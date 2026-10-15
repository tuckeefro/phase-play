"""Render and exercise the app in isolated, network-blocked Chromium."""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "browser"
CHROMIUM = shutil.which("chromium") or shutil.which("google-chrome")
if not CHROMIUM:
    raise SystemExit("Chromium is required for this optional development check.")
OUTPUT.mkdir(parents=True, exist_ok=True)
source = (ROOT / "index.html").read_text()

DRIVER = r"""
(() => {
  const root=document.getElementById('slit-cover-review');
  const find=s=>root.querySelector(s);
  const state=()=>({
    target:find('[data-target-reading]').textContent,
    center:find('[data-center-reading]').textContent,
    coverVisible:getComputedStyle(find('[data-cover]')).display!=='none',
    resultVisible:getComputedStyle(find('[data-result]')).display!=='none'
  });
  const initial=state();
  root.querySelectorAll('[data-guess]')[1].click();
  const predictionSelected=root.querySelectorAll('[data-guess]')[1].getAttribute('aria-pressed')==='true';
  find('[data-toggle]').click();
  const covered=state();
  const explanation=root.querySelector('details');
  explanation.querySelector('summary').click();
  const explanationOpened=explanation.open;
  explanation.querySelector('summary').click();
  find('[data-toggle]').click();
  const reopened=state();
  find('[data-reset]').click();
  const reset=state();
  const guessesCleared=Array.from(root.querySelectorAll('[data-guess]')).every(b=>b.getAttribute('aria-pressed')==='false');
  if(SCREENSHOT_STATE==='covered')find('[data-toggle]').click();
  const axes=Array.from(root.querySelectorAll('.screen text')).filter(t=>t.getAttribute('y')==='232').map(t=>{
    const transform=t.getScreenCTM();
    const r=t.getBoundingClientRect();
    return {text:t.textContent,fontPixels:parseFloat(getComputedStyle(t).fontSize)*Math.hypot(transform.a,transform.b),left:r.left,right:r.right};
  });
  const report={
    viewportWidth:innerWidth,
    sourceContext:'Exact app HTML in a local srcdoc frame; only the diagnostic driver is added',
    initial,covered,reopened,reset,predictionSelected,guessesCleared,explanationOpened,
    gradientStops:root.querySelectorAll('[data-gradient] stop').length,
    horizontalOverflow:document.documentElement.scrollWidth>innerWidth,
    criticalAxisLabels:axes,
    controls:Array.from(root.querySelectorAll('button')).map(b=>({text:b.textContent,height:b.getBoundingClientRect().height})),
    httpResources:performance.getEntriesByType('resource').filter(r=>/^https?:/.test(r.name)).map(r=>r.name),
    checks:{
      initialValues:initial.target==='0.0%'&&initial.center==='100.0%'&&!initial.coverVisible,
      coverValues:covered.target==='24.2%'&&covered.center==='25.0%'&&covered.coverVisible,
      reopenValues:reopened.target==='0.0%'&&reopened.center==='100.0%'&&!reopened.coverVisible,
      resetState:!reset.resultVisible&&guessesCleared,
      predictionSelected,explanationOpened,
      readableAxisLabels:axes.every(t=>t.fontPixels>=10.5),
      noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth
    }
  };
  parent.postMessage({kind:'phase-play-browser-evidence',report},'*');
})();
"""

class ResultParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.capture = False
        self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag == "pre" and dict(attrs).get("id") == "browser-result":
            self.capture = True
    def handle_endtag(self, tag):
        if tag == "pre":
            self.capture = False
    def handle_data(self, data):
        if self.capture:
            self.parts.append(data)

def browser(path, width, screenshot=None):
    with tempfile.TemporaryDirectory(prefix="phase-play-chromium-") as profile:
        args = [
            CHROMIUM, "--headless", "--disable-gpu", "--disable-background-networking",
            "--no-first-run", "--no-default-browser-check",
            "--host-resolver-rules=MAP * ~NOTFOUND",
            "--user-data-dir=" + profile, "--window-size=" + str(max(500, width)) + ",1200",
            "--virtual-time-budget=1500", "--dump-dom",
        ]
        if screenshot:
            args.append("--screenshot=" + str(screenshot))
        args.append(path.as_uri())
        result = subprocess.run(args, text=True, capture_output=True, timeout=25)
        if result.returncode:
            diagnostic = result.stderr[-2000:].replace(profile, "<temporary-profile>")
            blocked = {
                "status": "browser_process_failed",
                "recordedUTC": datetime.now(timezone.utc).isoformat(),
                "browser": version,
                "sourceSHA256": hashlib.sha256(source.encode()).hexdigest(),
                "exitCode": result.returncode,
                "diagnostic": diagnostic,
                "applicationChecksCompleted": False,
                "validScreenshotsProduced": False,
            }
            (OUTPUT / "results.json").write_text(json.dumps(blocked, indent=2) + "\n")
            raise RuntimeError("Chromium startup failed; diagnostic saved in docs/browser/results.json")
        return result.stdout

version = subprocess.run([CHROMIUM, "--version"], text=True, capture_output=True, check=True, timeout=5).stdout.strip()
cases = []
with tempfile.TemporaryDirectory(prefix="phase-play-browser-test-") as directory:
    directory = Path(directory)
    direct = browser(ROOT / "index.html", 1024, OUTPUT / "desktop-direct.png")
    direct_ran_script = direct.count("<stop ") >= 641 and 'd="M' in direct
    if not direct_ran_script:
        raise RuntimeError("Unmodified file did not show the script-generated gradient and curve")
    for width, final_state, name in [(1024, "covered", "desktop-covered"), (320, "open", "narrow-open")]:
        driver = DRIVER.replace("SCREENSHOT_STATE", json.dumps(final_state))
        instrumented = source.replace("</body>", "<script>" + driver + "</script></body>", 1)
        frame = escape(instrumented, quote=True)
        harness = (
            '<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}iframe{display:block;border:0;margin:0 auto}</style></head><body>'
            '<pre id="browser-result" hidden></pre>'
            '<script>addEventListener("message",e=>{if(e.source===document.getElementById("app").contentWindow&&e.data.kind==="phase-play-browser-evidence")'
            'document.getElementById("browser-result").textContent=JSON.stringify(e.data.report);});</script>'
            '<iframe id="app" width="' + str(width) + '" height="1200" srcdoc="' + frame + '"></iframe></body></html>'
        )
        path = directory / (name + ".html")
        path.write_text(harness)
        dom = browser(path, width, OUTPUT / (name + ".png"))
        parser = ResultParser()
        parser.feed(dom)
        if not parser.parts:
            raise RuntimeError("Browser did not return the in-frame diagnostic report")
        case = json.loads("".join(parser.parts))
        if case["viewportWidth"] != width:
            raise RuntimeError("Unexpected frame viewport")
        case["screenshot"] = "docs/browser/" + name + ".png"
        cases.append(case)

report = {
    "status": "checks_completed",
    "recordedUTC": datetime.now(timezone.utc).isoformat(),
    "browser": version,
    "sourceSHA256": hashlib.sha256(source.encode()).hexdigest(),
    "unmodifiedFileInitialRender": direct_ran_script,
    "networkCondition": "Fresh Chromium profile, background networking disabled, all network hostnames blocked in this process",
    "cases": cases,
    "limitations": [
        "Control checks activate native DOM elements programmatically; physical pointer, keyboard and touch operation are not established.",
        "The controlled-width cases embed exact app HTML in a local srcdoc frame with an added diagnostic driver.",
        "This is one Chromium version and does not establish other browsers, child enjoyment or learning.",
    ],
}
(OUTPUT / "results.json").write_text(json.dumps(report, indent=2) + "\n")
failures = [
    {"viewport": case["viewportWidth"], "check": name}
    for case in cases for name, passed in case["checks"].items() if not passed
]
print(json.dumps({"browser": version, "results": "docs/browser/results.json", "failures": failures}, indent=2))
raise SystemExit(1 if failures else 0)
