# Poke holes in it

Before adding sliders and missions, I want the opening experiment to hold up.
Here's where it could mislead someone, and what would catch that.

| What could fool us | What would catch it | What we have |
| --- | --- | --- |
| The brightness scale is doing the trick. | Keep one intensity reference and fixed exposure. Compare both conditions with an independent aperture integral. | Mathematical check passes at the fixed geometry. |
| A kid leaves thinking blocking light always makes things brighter. | Ask why the marked spot and center change in opposite directions. Use a separate unseen pattern for a later transfer check. | The center's outcome is already shown, so predicting it again could be recall. Learner response is untested. |
| The marker only makes sense after someone coaches you. | Let a new learner find the marked stripe and use the cover button with only the opening prompt. | Browser rendering and scripted controls are captured; uncoached learner use is untested. |
| The plot turns into tiny squiggles on a phone. | Measure the axis labels in the actual browser. | Observed: about 3.68 pixels at 320-pixel width. The readability check fails. [Capture evidence](EVIDENCE.md#e07-captured-previews-and-a-narrow-screen-failure). |
| The physics section looks serious but cannot be checked. | Have a technical reader reproduce a case and challenge the approximation. | Code, normalization, parameters, and an approximation-failure example are provided; human review is pending. |

## Next checks

1. Make the plot labels readable on a phone. Repeat the 320-pixel capture.
2. Use the locally opened app with physical keys, a pointer, and touch, with
   networking disabled. The current control checks use scripted clicks.
3. Let someone new try it. Record where they need coaching, then ask them to
   explain why the two spots changed differently. Use a separate unseen pattern
   to check transfer; repeating an already displayed result could be recall.
4. Have a technical reader reproduce a result and push on the assumptions.
5. Use those observations to revise the opening activity before adding controls.

No learner trial has been recorded. The Chrome captures establish rendering
and scripted behavior in one browser. They do not establish enjoyment, learning,
physical input operation, or agreement with a real optical device.
