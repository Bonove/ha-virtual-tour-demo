/* The prepared demo apartment.
 *
 * Panoramas: Poly Haven (CC0) — see CREDITS.md.
 * Positions are given in texture pixels of the 4096 x 2048 equirectangular
 * images, so they are independent of the viewer's angle conventions.
 * x(yaw): 0° is the centre of the image, positive turns right.
 */

const W = 4096, H = 2048;
const x = (yawDeg) => Math.round(((yawDeg + 180) / 360) * W);
const FLOOR = Math.round(H * 0.65);   // links sit below the horizon
const EYE = Math.round(H * 0.57);

const at = (yawDeg, y = FLOOR) => ({ textureX: x(yawDeg), textureY: y });

export const DEMO_NODES = [
  {
    id: 'living',
    name: 'Living room',
    panorama: 'assets/pano/living.jpg',
    thumbnail: 'assets/photos/living-1.jpg',
    startPosition: at(-85, EYE),
    links: [
      { nodeId: 'kitchen', position: at(-170) },
      { nodeId: 'bedroom', position: at(75) },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    panorama: 'assets/pano/kitchen.jpg',
    thumbnail: 'assets/photos/kitchen-1.jpg',
    startPosition: at(-160, Math.round(H * 0.63)),
    links: [
      { nodeId: 'living', position: at(-20) },
      { nodeId: 'bathroom', position: at(-95) },
    ],
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    panorama: 'assets/pano/bedroom.jpg',
    thumbnail: 'assets/photos/bedroom-1.jpg',
    startPosition: at(-25, EYE),
    links: [
      { nodeId: 'living', position: at(-160) },
      { nodeId: 'bathroom', position: at(100) },
    ],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    panorama: 'assets/pano/bathroom.jpg',
    thumbnail: 'assets/photos/bathroom-1.jpg',
    startPosition: at(-10, Math.round(H * 0.66)),
    links: [
      { nodeId: 'kitchen', position: at(60) },
      { nodeId: 'bedroom', position: at(130) },
    ],
  },
];

const KEYWORDS = [
  [/bath|shower|toilet|wc|en.?suite/i, 'bathroom'],
  [/bed|slaap/i, 'bedroom'],
  [/kitchen|cook|dining|keuken/i, 'kitchen'],
  [/living|lounge|studio|woon|salon/i, 'living'],
];

/** Maps a landlord's room name onto one of the demo nodes, or null. */
export function matchRoomToNode(name) {
  return KEYWORDS.find(([re]) => re.test(name))?.[1] ?? null;
}
