# Phase Play

A small double-slit experiment you can open from disk.

Make a prediction about a dark stripe, cover one slit, and compare what happens
there with what happens at the bright center. Open the explanation to inspect
the model, its assumptions, and a case where the approximation stops working.

## Run it

Download or clone this repository and open **index.html** in a browser.
The application is one self-contained file. It needs no account, local server,
runtime installation, internet connection, or paid hosting.

## Current stage

This is the first activity sketch. The first milestone is to challenge the
physics and teaching approach before adding more features.

The scalar calculations and simulated control-state checks pass. Actual
browser operation, offline operation in a browser, child enjoyment, learning,
and an independent human physics review are still unverified.

See [the evidence log](docs/EVIDENCE.md) for what was observed and what each
check establishes. [The review](docs/REVIEW.md) records the failure cases and
next checks.

## Check or edit it

Optional development commands, using Node.js and no third-party dependencies:

    node tools/build.mjs
    node tools/verify.mjs

Edit **src/challenge.html**, then build to update the distributed index.html.
Verification checks that the distributed file contains the exact source.

The checks compare the embedded formula with an independent finite-aperture
integral, reproduce a far-field versus Fresnel comparison, and exercise state
transitions in a DOM fixture. That fixture does not provide browser rendering
or accessibility evidence. [Saved results](docs/verification.json) identify
the source and distributed file by SHA-256.

An optional Chromium check uses Python's standard library and an installed
Chromium browser:

    python3 tools/check-browser.py

It opens the unmodified file directly, exercises controls in controlled-width
frames containing the same app HTML, and saves results and screenshots under
docs/browser. It uses a fresh temporary browser profile with network hostnames
blocked. This execution environment denied Chromium startup; no browser pass
or valid screenshot is claimed. A failed process is recorded separately from
application assertions.

## Physics

This is classical scalar wave optics with equal finite-width rectangular
slits, uniform coherent illumination, matched polarization, and a fixed
far-field geometry. Intensity uses the original two-slit bright center as a
constant reference.

The underlying effect is established physics. The activity, explanation,
implementation, and reproducible checks are the work being evaluated here.
See [the model](docs/MODEL.md) for the equations and limits.

## Contributions

Tucker chose the double-slit direction, the standalone requirement, the two
audiences, and the requirement to criticize the approaches first.

Codex proposed this opening activity and drafted the implementation,
explanations, and verification code. Tucker's review of this draft and
independent learner and technical reviews are pending.
