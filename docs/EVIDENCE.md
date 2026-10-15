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

**Limit:** this is static packaging and simulated state evidence. A real browser
must still establish rendering, keyboard/touch operation, and offline use.

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

## E05: Can the saved project run its checks outside the conversation fixture?

**Observed:** native Git 2.47.3 completed git fsck --full without an error.
Native Node.js v20.19.2 completed tools/verify.mjs successfully. The aperture,
Fresnel, input-validation, DOM-fixture, state-restoration, and static packaging
checks passed in that execution.

**Limit:** these are command-line and simulated-state observations. They do
not establish browser operation or learning.

## E06: Did we obtain real browser evidence?

**Attempt:** run an unmodified local index.html in isolated headless Chromium,
then exercise the same app HTML in 1,024-pixel and 320-pixel frames. Use a new
temporary profile and block network hostnames for the browser process.

**Observed:** Chromium was denied a socket operation at startup in this
execution environment. No application checks completed and no valid screenshot
was obtained.

**Decision:** preserve the optional checker and its process-failure diagnostic.
Re-run it in an environment that permits Chromium. Do not treat the failed
launch as an application failure or claim a browser pass from the DOM fixture.

## Next evidence to collect

- Actual browser use of the distributed file, with networking disabled.
- A screenshot or recording of the actual rendered activity.
- A learner's new prediction and any confusing instructions.
- A technical reader's reproduced result and objections to the model.
