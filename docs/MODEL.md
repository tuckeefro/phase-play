# The current double-slit model

All calculation inputs use SI units. The sketch fixes the geometry:

| Quantity | Value |
| --- | --- |
| Wavelength, λ | 550 nm |
| Width of each slit, a | 30 μm |
| Slit-center separation, d | 150 μm |
| Screen distance, L | 2 m |

The slit heights are identical. The displayed pattern is the horizontal
intensity profile through the diffraction pattern. The approximation uses
classical scalar, paraxial Fraunhofer propagation, uniform coherent plane-wave
illumination, and matched polarization.

For screen position x:

    β = π a x / (λ L)
    α = π d x / (λ L)
    sinc(β) = sin(β) / β, with sinc(0) = 1

    Both slits open: I / I₀ = sinc²(β) cos²(α)
    One slit covered: I / I₀ = ¼ sinc²(β)

I₀ is the original coherent two-slit on-axis intensity. It remains the reference
after covering a slit. The visualization also keeps the display exposure fixed.

At the marked first interference minimum, x = λL/(2d) = 3.6667 mm, the open-slit
intensity is zero and the covered-slit intensity is approximately 0.2418828 I₀.
At the center, covering a slit changes intensity from I₀ to 0.25 I₀.

These are point intensities. Under the uniform illumination, covering one of
the two equal openings halves the transmitted power at the barrier. The
integral over the finite displayed screen window is not a measurement of all
transmitted power.

## Independent checks and a failed approximation

The verifier numerically integrates the complex field across the actual
openings without using the closed-form sinc or interference factor. It then
compares the intensity with the embedded formula at 242 condition/position
pairs over the displayed range.

A second integral includes the quadratic aperture phase for paraxial Fresnel
propagation. It is compared with the far-field formula at 121 positions over
±3 nominal fringe spacings for each distance:

| Distance | Maximum absolute difference in I / I₀ |
| --- | --- |
| 2 m | 0.0000138011 |
| 0.10 m | 0.00550824 |
| 0.01 m | 0.443232 |

Refining the quadrature from 2,048 to 4,096 midpoint samples per slit changes
these sampled Fresnel profiles by less than 0.0000001. The large disagreement
at 0.01 m is not explained by that integration resolution.

This supports fixing the screen distance in the sketch. It does not establish
that the far-field model stays accurate for arbitrary settings. These are
comparisons between scalar approximations, not optical measurements or full
electromagnetic validation.

## Foundation

[OpenStax: Double-slit diffraction](https://openstax.org/books/university-physics-volume-3/pages/4-3-double-slit-diffraction)
describes the finite-width envelope and interference factor.

The independent calculations are in tools/verify.mjs, and the exact results
and source hashes are in [verification.json](verification.json).
