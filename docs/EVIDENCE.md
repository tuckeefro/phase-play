# Evidence log

Baseline recorded on 2026-10-14. Run node tools/verify.mjs to reproduce the
calculations. The exact values and SHA-256 hashes of the activity source and
distributed HTML are saved in [verification.json](verification.json).

## E01: Does the opening surprise follow from the field calculation?

**Claim:** covering one slit brightens the marked dark stripe and dims the center,
using one intensity reference for both conditions.

**Method:** integrate the complex field across the finite rectangular openings;
compare the resulting intensity with the formula embedded in the activity.
Use 2,048 midpoint samples per slit and 242 condition/position pairs across
the displayed screen range.

**Result:** maximum absolute difference is 0.0000000718839 in I / I₀.
The marked point changes from approximately zero to 0.2418828 I₀. The center
changes from I₀ to 0.25 I₀.

**Limit:** both calculations assume the same coherent scalar far-field model.
Agreement checks the formula and implementation under those assumptions.
It does not validate an actual optical device.

## E02: Can we move the screen closer and keep the same formula?

**Claim under challenge:** the far-field formula would remain suitable at an
arbitrary screen distance.

**Method:** compare it with a paraxial Fresnel aperture integral at 121 positions
over ±3 nominal fringe spacings, for each distance. Refine integration from
2,048 to 4,096 samples per slit.

**Result:** maximum absolute profile differences are 0.0000138011 at 2 m,
0.00550824 at 0.10 m, and 0.443232 at 0.01 m. Quadrature refinement changes the
sampled Fresnel profiles by less than 0.0000001.

**Decision:** keep the sketch's screen distance fixed at 2 m. An adjustable
distance requires a reviewed propagation model and validity range.

## E03: Do the controls and packaged source agree?

**Method:** parse the embedded JavaScript, exercise prediction, cover/uncover,
reset, and restored state in a DOM fixture, and compare the source fragment
with the distributed HTML. Reject nonfinite model inputs and invalid states.

**Result:** these checks pass. The packaged file contains the exact source,
has one embedded script, and references no external runtime assets.

**Limit:** static packaging and simulated state cannot establish browser
rendering or physical input behavior. E07 and E08 record subsequent browser observations.

## E04: Is our proposed learning check actually a new prediction?

**Source observation:** after the first cover action, the app already shows
the center at 25% and states that it dimmed. Asking about the same center on the
next trial can be answered by remembering that display.

**Decision:** treat the center prompt as a comparison and explanation prompt.
It does not by itself establish transfer to an unseen case.

**Next observation:** ask the learner to explain why the two spots changed in
opposite directions, without supplying the explanation first. For a transfer
check, prepare a separate before-only pattern with a reviewed, different slit
separation and ask for a prediction before revealing its covered-slit result.
Do not add controls or claim learning effectiveness based on a repeated result.

**Evidence from learners:** none yet.

## E05: Do the project checks run as ordinary commands?

**Observed:** native Git 2.47.3 completed git fsck --full without an error.
Native Node.js v20.19.2 completed tools/verify.mjs successfully. The aperture,
Fresnel, input-validation, DOM-fixture, state-restoration, and static packaging
checks passed in that execution.

**Limit:** these are command-line and simulated-state observations. They do
not establish browser operation or learning.

## E06: Initial browser startup failure

The first local Chromium attempt stopped before app rendering because the
execution environment denied a socket operation. It produced no application
checks or valid screenshots. The [original diagnostic](https://github.com/tuckeefro/phase-play/blob/4c5567b0e2ce94570472620e2a16036ae310b563/docs/browser/results.json)
is preserved in Git history. The later successful capture is recorded below.

## E07: Captured previews and a narrow-screen failure

**Method:** run tools/check-browser.py with Google Chrome 155.0.8059.39 on
GitHub's Ubuntu runner, using a fresh profile and blocked network hostnames.
Load the unmodified local index.html, then exercise the same app HTML in
1,024-pixel and 320-pixel frames with an added diagnostic driver.
The [capture run](https://github.com/tuckeefro/phase-play/actions/runs/38674719813)
records the execution; [results.json](https://github.com/tuckeefro/phase-play/blob/e3cd5a8b90eae1b7b8aec00d20557b24e0379196/docs/browser/results.json) identifies the
browser and exact HTML source by SHA-256.

**Observed:** the [opening view](https://github.com/tuckeefro/phase-play/blob/e3cd5a8b90eae1b7b8aec00d20557b24e0379196/docs/browser/desktop-direct.png) and
[covered-slit result](https://github.com/tuckeefro/phase-play/blob/e3cd5a8b90eae1b7b8aec00d20557b24e0379196/docs/browser/desktop-covered.png) are real 1,024 × 1,200 PNG
captures. The desktop case passes all recorded checks: initial values,
prediction selection, cover/reopen, reset, explanation opening, readable
axis labels, and no horizontal overflow.

The [320-pixel frame](https://github.com/tuckeefro/phase-play/blob/e3cd5a8b90eae1b7b8aec00d20557b24e0379196/docs/browser/narrow-open.png) passes those control checks
and has no horizontal overflow, but its plot-axis labels render at about
3.68 pixels. They fail the 10.5-pixel minimum readability check.

**Decision:** publish the two desktop views in the README. Record the narrow
plot labels as a layout defect to fix and re-capture.

**Limit:** controls were activated programmatically on native DOM elements.
These captures do not establish physical keyboard or touch operation, other
browser behavior, child enjoyment, learning, or agreement with a real device.

## E08: Readable labels and the workshop notebook

**Change:** define “slit” before the first prediction, show the parts in a setup
sketch, and put the plain-language result beside the cover action. The selected
visual direction is a workshop notebook: paper, ink, measurement readouts, and
notes about what to hold fixed and what to question.

**Phone fix:** keep the graph 220 pixels tall and put its labels in ordinary page
text. The labels no longer shrink with the SVG. Check that all three labels are
present, at least 12 pixels, and inside the plot panel; an empty label list cannot
pass. Visual inspection also caught crowded Left/Right labels on the barrier.
Their spacing was corrected and captured again.

**Method:** the [checked build and capture run](https://github.com/tuckeefro/phase-play/actions/runs/38770526403)
ran the standalone build, the numerical/state/packaging verifier, and the browser
checker with Google Chrome 155.0.8059.39. The unmodified local HTML rendered
with network hostnames blocked. Controlled-width frames then exercised the same
HTML with a diagnostic driver.

The [browser report](https://github.com/tuckeefro/phase-play/blob/bb8e37fa4d3aee9ceae6262373b40e525a224239/docs/browser/results.json)
and [numerical report](https://github.com/tuckeefro/phase-play/blob/bb8e37fa4d3aee9ceae6262373b40e525a224239/docs/verification.json)
identify the same standalone HTML:

```text
c21267880972e3db783bfd014099ce5ffca60f23dc3f7e6232e45de37b27ba41
```

**Observed:** all eight recorded browser checks pass at 1,024 and 320 pixels:
initial values, cover, reopen, reset, prediction selection, explanation opening,
axis-label readability, and no horizontal overflow. All three horizontal-axis
labels measure 13 CSS pixels in both cases. The marked spot still changes from
0.0% to 24.2%; the center changes from 100.0% to 25.0%.

The [opening](https://github.com/tuckeefro/phase-play/blob/bb8e37fa4d3aee9ceae6262373b40e525a224239/docs/browser/desktop-direct.png) and
[covered-slit](https://github.com/tuckeefro/phase-play/blob/bb8e37fa4d3aee9ceae6262373b40e525a224239/docs/browser/desktop-covered.png)
PNGs are 1,024 × 1,800. The [narrow PNG](https://github.com/tuckeefro/phase-play/blob/bb8e37fa4d3aee9ceae6262373b40e525a224239/docs/browser/narrow-open.png)
is a 500 × 2,400 outer capture containing the 320-pixel app frame.

**Capture failures:** two attempts timed out while asking Chrome for its version,
before opening the app. After the repeated [timeout](https://github.com/tuckeefro/phase-play/actions/runs/38770332486),
that deadline increased from 5 to 15 seconds; the final run passed. Capture
startup clears older generated files, and publication requires every recorded
check to pass.

**Limit:** scripted clicks establish the recorded state transitions. Physical
keyboard, pointer, and touch operation, other browsers, and uncoached learner use
remain untested. The numerical verifier's “unverified” list describes what that
script alone cannot establish; browser observations are recorded separately here.

## Next evidence to collect

- Physical keyboard, pointer, and touch use with networking disabled.
- A learner's new prediction and any confusing instructions.
- A technical reader's reproduced result and objections to the model.
