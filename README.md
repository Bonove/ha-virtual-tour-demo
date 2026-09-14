# HousingAnywhere — virtual tour prototype

A clickable mobile prototype: a landlord photographs their rooms, uploads the photos
and gets an interactive 360° tour of the apartment.

Open `index.html` over HTTP (not `file://` — the page uses ES modules and an import
map). Locally:

```sh
cd virtual-tour-demo
python3 -m http.server 8811
# → http://localhost:8811
```

On a screen wider than 760 px the prototype renders inside a phone frame; on a phone
it fills the screen. **Mobile only by design** — there is no desktop layout.

## What is real and what is simulated

| | |
|---|---|
| **Real** | Taking a photo with the camera, picking photos from the gallery, showing/enlarging/replacing/deleting them, moving a photo to another room, adding and renaming rooms, going back without losing anything |
| **Real** | The 360° tour: look around, click the floor arrows, jump between rooms from the room bar, landlord preview vs. tenant view |
| **Simulated** | The three processing steps after "Create my tour". Nothing is computed from the uploaded photos — the tour is the prepared demo apartment, which is why the screen and the tour both carry a "DEMO" label |

The tour reuses the landlord's own room names where they can be matched
(`living/lounge/studio`, `bed`, `kitchen/dining`, `bath/shower/toilet`), so with the
sample photos the result visibly matches the photos that went in.

## Demo script (≈ 2 minutes)

1. **Open the link.** Start screen: "Create a virtual tour".
2. **Tap "Try with sample photos".** You land straight on *Check your photos* with
   four rooms, four photos each — this is the fast path for the stage.
3. **Tap a room** to show the capture screen: the shooting tips, *Take photo* /
   *Choose*, and the photo grid. Tap a photo to enlarge, delete, replace or move it
   to another room. Go back — nothing is lost.
4. **Tap "Create my tour".** Three steps tick past (~5 s).
5. **The tour opens** in landlord preview. Drag to look around, tap the white floor
   arrow to walk into the next room, or use the room bar at the bottom.
6. **Tap "View as tenant"** for the tenant's version with the listing bar.
   The back arrow returns to the landlord view.
7. **Restart** with the circular arrow in the top bar — ready for the next run.

To show the *own photos* path instead: on the start screen tap **Get started**,
add/rename rooms, then *Take photo* (opens the phone camera) or *Choose* (gallery).
For that path put `sample-photos.zip` on the phone beforehand if you want
predictable images.

## Costs

Zero. Photo Sphere Viewer and three.js are MIT and served from our own hosting
(`vendor/`, no CDN); the panoramas are CC0 from Poly Haven; no fonts, analytics,
accounts or APIs are loaded. See `CREDITS.md`.

## Files

```
index.html          phone frame, import map
styles.css          design tokens copied from the existing HA prototype
app.js              screens, state, photo handling, viewer mount
tour-data.js        the four demo rooms: panorama, start view, links
assets/pano/*.jpg   4096 × 2048 equirectangular panoramas
assets/photos/*.jpg 16 sample photos (4 per room)
vendor/             Photo Sphere Viewer 5.15.1 + three.js 0.185.1 + licences
sample-photos.zip   the 16 sample photos, to copy onto a phone
```
