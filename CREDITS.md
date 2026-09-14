# Sources and licences

Everything in this prototype is free to use commercially. No account, subscription,
trial, credit or per-use fee is involved, and nothing is loaded from a third-party
service at runtime — all code and images are served from our own hosting.

## Software

| Component | Version | Licence | Source |
|---|---|---|---|
| Photo Sphere Viewer (core) | 5.15.1 | MIT | https://github.com/mistic100/Photo-Sphere-Viewer |
| Photo Sphere Viewer — Virtual Tour plugin | 5.15.1 | MIT | https://photo-sphere-viewer.js.org/plugins/virtual-tour.html |
| Photo Sphere Viewer — Markers plugin | 5.15.1 | MIT | https://photo-sphere-viewer.js.org/plugins/markers.html |
| three.js | 0.185.1 | MIT | https://github.com/mrdoob/three.js |

Full licence texts: `vendor/LICENSE-photo-sphere-viewer.txt`, `vendor/LICENSE-three.txt`.

> Photo Sphere Viewer — MIT © 2014–2015 Jérémy Heleine, © 2016–2026 Damien Sorel
> three.js — MIT © 2010–2026 three.js authors

No fonts are downloaded; the UI uses the operating system's own sans-serif stack.

## Panoramas

360° images from **Poly Haven**, released under **CC0 1.0** (public domain,
commercial reuse allowed — https://polyhaven.com/license). Downloaded as the free
"Tonemapped JPG" version and resized to 4096 × 2048 for the web.

| In the demo | Poly Haven asset | Link |
|---|---|---|
| Living room | Brown Photostudio 05 | https://polyhaven.com/a/brown_photostudio_05 |
| Kitchen | Brown Photostudio 02 | https://polyhaven.com/a/brown_photostudio_02 |
| Bedroom | Brown Photostudio 04 | https://polyhaven.com/a/brown_photostudio_04 |
| Bathroom | Modern Bathroom | https://polyhaven.com/a/modern_bathroom |

## Sample photos

`assets/photos/*.jpg` (16 files, 4 per room) are **not** separate stock photos: they
were rendered from the panoramas above with ffmpeg's `v360` filter, projecting a
phone-camera field of view (52° × 68°, portrait 960 × 1280) at four angles per room.
They therefore show exactly the same rooms as the tour, and inherit the same CC0
licence.

Reproduce them with:

```sh
ffmpeg -i <panorama>.jpg \
  -vf "v360=e:flat:yaw=<deg>:pitch=-8:h_fov=52:v_fov=68:w=960:h=1280" \
  -frames:v 1 -q:v 3 out.jpg
```

Angles used are listed in `tour-data.js` (tour start views) and in the git-free
build notes below:

* living: −85°, −35°, 65°, 90°
* kitchen: −180°, −140°, −95° (62° fov), 140°
* bedroom: −50°, −15°, 15°, −95°
* bathroom: −180°, −135°, −20°, 25°

## Design

Colours, radii and typography are taken from the existing HousingAnywhere front-end
prototype (`html pagina/Home Finder Hub`, `src/styles.css`) — primary
`oklch(0.653 0.212 32.5)`, foreground `oklch(0.264 0.048 217.5)`, radius `0.75rem`.
