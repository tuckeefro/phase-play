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

## E04: Does the surprise teach a transferable relationship?

**Question:** after seeing the marked stripe brighten, can a learner predict
that covering the slit dims the center?

**Evidence:** none from learners yet. The center prompt is a proposed check,
not an observed learning outcome.

**Next observation:** record the prediction before the second cover trial and
where coaching is needed. Use that result to revise the activity before adding
controls or missions.

## Next evidence to collect

- Actual browser use of the distributed file, with networking disabled.
- A screenshot or recording of the actual rendered activity.
- A learner's new prediction and any confusing instructions.
- A technical reader's reproduced result and objections to the model.
