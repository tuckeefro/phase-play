# Phase Play

**Can covering a slit make a dark stripe brighter?**

An offline double-slit light experiment by [Tucker Vana](https://github.com/tuckeefro).

Light goes through two narrow openings and makes bright and dark stripes on a
screen. Those openings are called slits. Make a guess, cover one, and watch the
marked stripe and the center. Same light source. Same brightness scale.

I want a kid to mess with this and someone who knows optics to pick it apart.
The first milestone is poking holes in it. More controls can wait.

## Open it

1. [Download the project ZIP](https://github.com/tuckeefro/phase-play/archive/refs/heads/main.zip) and extract it.
2. Open **index.html** in a browser.

You can keep just that HTML file. Everything the experiment needs is inside it:
no account, local server, installation, or hosting bill. It works offline.

## Preview

**Both slits open**

![Both slits open: the marked stripe is dark and the bright center reads 100%.](docs/browser/desktop-direct.png)

**Right slit covered**

![Right slit covered: the marked spot rises to 24.2% while the center falls to 25%, using the same brightness reference.](docs/browser/desktop-covered.png)

[Phone view](docs/browser/narrow-open.png)

## Decisions worth checking

My thing is getting hardware and software to work together: equipment
integration, troubleshooting, and testing. Here, the work is a small simulation
with its decisions and failures left visible.

| Question | Decision and evidence |
| --- | --- |
| Is the display making up the surprise? | Keep the brightness reference fixed. Check both conditions against a separate calculation across the openings. [Calculation and limits](docs/EVIDENCE.md#e01-does-the-opening-surprise-follow-from-the-field-calculation). |
| Can we put the screen anywhere? | Keep it at 2 m. At 1 cm, the far-field model disagrees substantially with a Fresnel calculation. [Comparison](docs/EVIDENCE.md#e02-can-we-move-the-screen-closer-and-keep-the-same-formula). |
| Does fitting on a phone mean someone can read it? | The first capture had 3.68-pixel graph labels. Labels now use ordinary page text, and the browser check measures their size and visibility. [Current browser measurements](docs/browser/results.json). |

## Poke holes in it

The numerical and packaged-source checks pass. The updated browser captures
are being checked on the review branch before this pass reaches main.
No learner trial has been recorded.

The next question is whether someone can explain why the two spots changed
in opposite directions. Clicking the button or remembering a number won't
tell us that.

[What could fool us, and how to catch it](docs/REVIEW.md) ·
[What was checked and what remains open](docs/EVIDENCE.md)

## The physics

The app uses classical scalar Fraunhofer diffraction for two equal,
finite-width slits with coherent illumination and matched polarization.
Intensity uses the original two-slit bright center as a fixed reference.

[Equations, assumptions, and where the approximation breaks](docs/MODEL.md)

## Work on it

Edit **src/challenge.html**, then rebuild **index.html**. These optional
development commands use Node.js with no third-party dependencies:

```bash
node tools/build.mjs
node tools/verify.mjs
```

[Saved numerical results](docs/verification.json) identify the checked source.

Browser checks and PNG captures use Python's standard library and an installed
Chromium or Google Chrome browser:

```bash
python3 tools/check-browser.py
```

The [capture workflow](.github/workflows/previews.yml) checks the standalone
build and calculations, tests the controls, measures graph labels at 320 and
1,024 pixels, and regenerates the PNGs. Every recorded browser check must pass.

*Built with assistance from Codex.*
