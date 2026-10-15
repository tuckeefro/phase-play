# Tucker Vana — Phase Play

**Can covering one opening make a dark spot brighter?**

A standalone double-slit optics experiment. Make a guess, cover one opening,
and compare the marked spot with the center. Same light source. Same brightness
scale.

I want a kid to mess with this and someone who knows optics to pick it apart.
First, poke holes in it. More knobs can wait.

## Open it

1. [Download the project ZIP](https://github.com/tuckeefro/phase-play/archive/refs/heads/main.zip) and extract it.
2. Open **index.html** in a browser.

You can keep just that HTML file. The experiment runs offline with no account,
server, or installation. Its explanation and model are included.

## See what changes

**Both openings clear**

![Phase Play by Tucker Vana: both slits open, with a dark marked stripe and the center at 100%.](docs/browser/desktop-direct.png)

**One opening covered**

![Covering the right slit raises the marked spot to 24.2% and lowers the center to 25%, on the same brightness scale.](docs/browser/desktop-covered.png)

[Phone view](docs/browser/narrow-open.png)

## Decisions you can check

| Question | Decision and evidence |
| --- | --- |
| Is the display inventing the surprise? | Keep the brightness reference fixed. Compare both states with a separate calculation across the openings. [Calculation and limits](docs/EVIDENCE.md#e01-does-the-opening-surprise-follow-from-the-field-calculation). |
| Does the formula work at any screen distance? | Keep the screen at 2 m. At 1 cm, the far-field model disagrees substantially with a Fresnel calculation. [The failed approximation](docs/EVIDENCE.md#e02-can-we-move-the-screen-closer-and-keep-the-same-formula). |
| Can someone read it on a phone? | The first capture had 3.68-pixel graph labels. Moving them out of the scaled graphic brought them to 13 pixels at both tested widths. [Browser measurements](docs/browser/results.json). |

This is a classical scalar wave simulation using finite-width slits and
Fraunhofer diffraction. [Equations and assumptions](docs/MODEL.md) ·
[Evidence log](docs/EVIDENCE.md)

The numerical, packaged-file, and recorded Chrome checks pass. A learner trial,
physical input checks, and independent human physics review remain open.
[What could fool us next](docs/REVIEW.md)

## About Tucker Vana

I work across hardware and software: equipment integration, troubleshooting,
and testing. [My engineering work and background](https://github.com/tuckeefro/career-portfolio)
include production startup, CNC equipment, and cryogenic hardware.

The APS record lists me as presenter and coauthor of
[Scalable Flexible Coaxial Ribbon Cables for High-Density Quantum Wiring (Part II)](https://meetings-archive.aps.org/mar/2023/q72/5/)
at the 2023 March Meeting.

## Reproduce the checks

These are optional development commands. Using the experiment only needs a browser.

```bash
node tools/build.mjs
node tools/verify.mjs
python3 tools/check-browser.py
```

Node checks use no third-party packages. Browser checks use Python's standard
library and an installed Chromium or Google Chrome browser.
[Saved numerical results](docs/verification.json) identify the checked source.
The [capture workflow](.github/workflows/previews.yml) rebuilds the file,
runs the checks, and publishes the PNGs.

*Built with assistance from Codex.*
