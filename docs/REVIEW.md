# First milestone: try to break the activity

The opening question is whether covering a slit can brighten a marked dark
stripe. The activity also shows the center, where the effect reverses.

| Weakness | Check | Current evidence |
| --- | --- | --- |
| Rescaling the display could invent or exaggerate the surprise. | Use one intensity reference and fixed exposure; compare both conditions with an independent aperture integral. | Mathematical check passes at the fixed geometry. |
| A child could learn that blocking light always brightens the screen. | Ask why the marked spot and center change in opposite directions. Use a separate unseen pattern for a later transfer check. | The center's outcome is already shown, so a repeated prediction could be recall. Learner response is untested. |
| The marker or plot could require coaching. | Let a learner point to the marked stripe and use the cover button without instructions beyond the opening prompt. | Browser rendering and scripted controls are captured; uncoached learner use is untested. |
| Plot labels could become unreadable on a narrow screen. | Measure rendered axis-label size in the actual browser. | Observed: about 3.68 pixels at 320-pixel width; the readability check fails. [Capture evidence](EVIDENCE.md#e07-captured-previews-and-a-narrow-screen-failure). |
| The scientific explanation could be decorative. | Have a technical reader reproduce a case and identify the approximation's limits. | Code, normalization, parameters, and an approximation-failure example are provided; human review is pending. |

## Next checks

1. Fix narrow-screen plot-label scaling and repeat the 320-pixel capture.
2. Exercise physical keyboard, pointer, and touch operation in the locally
   opened app with networking disabled.
3. Run a brief learner trial. Record where coaching is needed and the learner's
   explanation of the two spots. Do not count clicking the button or recalling
   a displayed result as evidence of transfer to an unseen case.
4. Ask a technical reader to reproduce a result and challenge the assumptions.
5. Revise the opening activity before adding slit-width, separation, phase,
   coherence, or additional missions.

No audience trial has been conducted. Captured Chrome images and programmatic
control checks establish rendering and scripted behavior in one browser.
They do not establish enjoyment, learning, physical input operation, or real
optical device agreement.
