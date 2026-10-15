# Phase Play

**Can covering a slit make a dark stripe brighter?**

Make a guess, cover the slit, and watch the marked stripe and the center.
Same light source. Same brightness scale. One spot gets brighter while the
other gets dimmer.

I want a kid to mess with this and someone who knows optics to pick it apart.
The first milestone is poking holes in it. More controls can wait.

## Run it

Download or clone this repository and open **index.html** in a browser.
The app is one self-contained file and runs offline. No account, local server,
runtime installation, or hosting bill.

## Preview

**Both slits open**

![Both slits open: the marked stripe is dark and the bright center reads 100%.](docs/browser/desktop-direct.png)

**Right slit covered**

![Right slit covered: the marked spot rises to 24.2% while the center falls to 25%, using the same brightness reference.](docs/browser/desktop-covered.png)

## Poke holes in it

The calculation checks and automated desktop Chrome checks pass. The narrow
capture exposed plot labels that are too small to read. No learner trial has
been recorded yet.

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

Edit **src/challenge.html**, then rebuild **index.html**. Development commands
use Node.js with no third-party dependencies:

```bash
node tools/build.mjs
node tools/verify.mjs
```

The verifier checks the calculations, simulated controls, and packaged source.
[Saved numerical results](docs/verification.json) include the HTML source hashes.

Browser checks and PNG captures use Python's standard library and an installed
Chromium or Google Chrome browser:

```bash
python3 tools/check-browser.py
```

The browser checker currently reports the narrow-screen label failure.
The [capture workflow](.github/workflows/previews.yml) regenerates the PNGs when
the app or checker changes.

*Built with assistance from Codex.*
