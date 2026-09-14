/* HousingAnywhere — virtual tour prototype (mobile).
 *
 * Real: choosing/taking photos, managing them per room, the 360° tour.
 * Simulated: the "processing" step. It always ends in the prepared demo tour.
 */

import { DEMO_NODES, matchRoomToNode } from './tour-data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const app = $('#app');
const screens = () => $('#screens');

/* ---------------------------------------------------------------- icons */

const I = {
  back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  fwd: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  camera: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  image: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.6"/><path d="m21 15-5-5L5 21"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>',
  sun: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  level: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M3 12h2M19 12h2"/></svg>',
  turn: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
  rooms: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M10 21v-6h4v6"/></svg>',
  sparkle: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
  drag: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 5 12l4 6M15 6l4 6-4 6"/></svg>',
  eye: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  warn: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v5M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>',
  restart: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  info: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 11v5M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg>',
};

/* ---------------------------------------------------------------- state */

const PRESETS = ['Living room', 'Bedroom', 'Kitchen', 'Bathroom', 'Hallway', 'Balcony', 'Study'];
const SAMPLE_ROOMS = [
  { name: 'Living room', key: 'living' },
  { name: 'Kitchen', key: 'kitchen' },
  { name: 'Bedroom', key: 'bedroom' },
  { name: 'Bathroom', key: 'bathroom' },
];

let uid = 0;
const state = {
  screen: 'start',
  usingSamples: false,
  rooms: [],          // { id, name, photos: [{ id, url, revoke }] }
  activeRoom: 0,
  error: null,
  lightbox: null,     // { roomId, photoId }
  tourMode: 'landlord',
};

const newRoom = (name) => ({ id: `r${++uid}`, name, photos: [] });
const roomById = (id) => state.rooms.find((r) => r.id === id);
const totalPhotos = () => state.rooms.reduce((n, r) => n + r.photos.length, 0);

function reset() {
  state.rooms.forEach((r) => r.photos.forEach((p) => p.revoke && URL.revokeObjectURL(p.url)));
  Object.assign(state, {
    screen: 'start', usingSamples: false, rooms: [], activeRoom: 0,
    error: null, lightbox: null, tourMode: 'landlord',
  });
  destroyTour();
  render();
}

function go(screen) {
  state.screen = screen;
  state.error = null;
  render();
}

/* ---------------------------------------------------------------- photos */

const MAX_MB = 25;

function addFiles(room, fileList) {
  const files = [...fileList];
  const ok = files.filter((f) => f.type.startsWith('image/') && f.size <= MAX_MB * 1024 * 1024);
  ok.forEach((f) => {
    room.photos.push({ id: `p${++uid}`, url: URL.createObjectURL(f), revoke: true, name: f.name });
  });
  const failed = files.length - ok.length;
  state.error = failed
    ? `${failed} file${failed > 1 ? 's' : ''} couldn't be added. Use photos up to ${MAX_MB} MB.`
    : null;
  render();
}

/** Wires a hidden <input type=file> to the room being captured. */
function pickPhotos(room, which) {
  const input = $(which === 'camera' ? '#file-camera' : '#file-gallery');
  input.value = '';
  input.onchange = () => { if (input.files?.length) addFiles(room, input.files); };
  input.click();
}

function removePhoto(room, photoId) {
  const i = room.photos.findIndex((p) => p.id === photoId);
  if (i < 0) return;
  if (room.photos[i].revoke) URL.revokeObjectURL(room.photos[i].url);
  room.photos.splice(i, 1);
}

/* ---------------------------------------------------------------- screens */

const restartBtn = (dark = false) =>
  `<button class="iconbtn${dark ? ' on-dark' : ''}" data-act="restart" title="Restart demo" aria-label="Restart demo">${I.restart}</button>`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function screenStart() {
  return `
  <section class="screen">
    <header class="topbar">
      <span class="wordmark">housinganywhere</span>
      <span class="spacer"></span>
      <span class="avatar"></span>
    </header>
    <div class="scroll">
      <div class="hero">
        <img src="assets/photos/living-1.jpg" alt="Bright living room">
        <span class="tag">${I.sparkle} 360° tour</span>
      </div>
      <h2>Create a virtual tour</h2>
      <p class="lead">Take a few photos of every room with your phone. We turn them into a 360° tour that tenants can walk through — so you get fewer viewings and better requests.</p>
      <ul class="steps">
        <li><span class="ico">${I.rooms}</span><div><strong>1. Add your rooms</strong><span>Name the rooms you want to show.</span></div></li>
        <li><span class="ico">${I.camera}</span><div><strong>2. Photograph each room</strong><span>Take new photos or pick existing ones from your gallery.</span></div></li>
        <li><span class="ico">${I.sparkle}</span><div><strong>3. We build the tour</strong><span>Ready in a couple of minutes — you approve before it goes live.</span></div></li>
      </ul>
    </div>
    <footer class="footer" style="flex-direction:column">
      <button class="btn btn-primary" data-act="begin">Get started</button>
      <button class="btn btn-outline" data-act="samples">Try with sample photos</button>
    </footer>
  </section>`;
}

function screenRooms() {
  const rows = state.rooms.map((r) => `
    <div class="roomrow">
      <span class="thumb empty">${I.rooms}</span>
      <span class="meta"><input class="name" value="${esc(r.name)}" data-rename="${r.id}" aria-label="Room name"></span>
      <button class="iconbtn" data-drop="${r.id}" aria-label="Remove ${esc(r.name)}">${I.close}</button>
    </div>`).join('');

  return `
  <section class="screen">
    <header class="topbar">
      <button class="iconbtn" data-act="home" aria-label="Back">${I.back}</button>
      <h1>Your rooms</h1>
      <span class="spacer"></span>${restartBtn()}
    </header>
    <div class="scroll">
      <p>Add the rooms you want in the tour. Tap a name to change it.</p>
      <div class="chiprow">
        ${PRESETS.map((p) => `<button class="chip" data-add="${p}">${I.plus} ${p}</button>`).join('')}
      </div>
      ${rows || `<div class="empty-state">No rooms yet. Pick one above to start.</div>`}
    </div>
    <footer class="footer">
      <button class="btn btn-primary" data-act="toCapture" ${state.rooms.length ? '' : 'disabled'}>
        Continue${state.rooms.length ? ` with ${state.rooms.length} room${state.rooms.length > 1 ? 's' : ''}` : ''}
      </button>
    </footer>
  </section>`;
}

function screenCapture() {
  const room = state.rooms[state.activeRoom];
  if (!room) return screenRooms();
  const last = state.activeRoom === state.rooms.length - 1;
  const n = room.photos.length;

  const cells = room.photos.map((p) => `
    <button class="cell" data-open="${room.id}:${p.id}" aria-label="Open photo">
      <img src="${p.url}" alt="">
      <span class="del" data-del="${room.id}:${p.id}" role="button" aria-label="Delete photo">${I.trash}</span>
    </button>`).join('');

  return `
  <section class="screen">
    <header class="topbar">
      <button class="iconbtn" data-act="prevRoom" aria-label="Back">${I.back}</button>
      <div>
        <div class="steplabel">Room ${state.activeRoom + 1} of ${state.rooms.length}</div>
        <h1>${esc(room.name)}</h1>
      </div>
      <span class="spacer"></span>${restartBtn()}
    </header>
    <div class="scroll">
      ${state.error ? `<div class="alert">${I.warn}<span>${esc(state.error)} <button data-act="retry">Try again</button></span></div>` : ''}
      <div class="card">
        <h3>How to shoot this room</h3>
        <ul class="tips">
          <li><span class="ico">${I.sun}</span> Open the curtains — turn the lights on.</li>
          <li><span class="ico">${I.level}</span> Hold your phone upright, at chest height.</li>
          <li><span class="ico">${I.turn}</span> Stand in the middle and shoot all four walls.</li>
        </ul>
      </div>

      <div class="btn-row" style="margin-bottom:16px">
        <button class="btn btn-primary" data-act="camera">${I.camera} Take photo</button>
        <button class="btn btn-outline" data-act="gallery">${I.image} Choose</button>
      </div>

      <h3 style="display:flex;justify-content:space-between;align-items:baseline;gap:10px">
        <span style="white-space:nowrap">Photos in this room</span>
        <small style="text-align:right">${n} added${n < 4 ? ` · ${4 - n} more advised` : ''}</small>
      </h3>
      ${n ? `<div class="photogrid">${cells}</div>`
          : `<div class="empty-state">No photos in ${esc(room.name)} yet.<br>Take at least 3 so we can reconstruct the space.</div>`}
    </div>
    <footer class="footer">
      ${last
        ? `<button class="btn btn-primary" data-act="toReview">Review all rooms</button>`
        : `<button class="btn btn-outline btn-skip" data-act="toReview">Skip</button>
           <button class="btn btn-primary" data-act="nextRoom">Next room</button>`}
    </footer>
  </section>`;
}

function screenReview() {
  const rows = state.rooms.map((r, i) => `
    <button class="roomrow" data-goroom="${i}">
      ${r.photos.length
        ? `<img class="thumb" src="${r.photos[0].url}" alt="">`
        : `<span class="thumb empty">${I.camera}</span>`}
      <span class="meta">
        <span class="name">${esc(r.name)}</span>
        <span class="sub ${r.photos.length ? '' : 'warn'}">
          ${r.photos.length ? `${r.photos.length} photo${r.photos.length > 1 ? 's' : ''}` : 'No photos yet — tap to add'}
        </span>
      </span>
      <span class="iconbtn">${I.fwd}</span>
    </button>`).join('');

  const empty = state.rooms.filter((r) => !r.photos.length).length;

  return `
  <section class="screen">
    <header class="topbar">
      <button class="iconbtn" data-act="backToCapture" aria-label="Back">${I.back}</button>
      <h1>Check your photos</h1>
      <span class="spacer"></span>${restartBtn()}
    </header>
    <div class="scroll">
      <p>Tap a room to add, replace or delete photos. Nothing is lost when you go back.</p>
      ${rows}
      ${empty ? `<div class="note">${I.info}<span>${empty} room${empty > 1 ? 's have' : ' has'} no photos. You can still continue — empty rooms are left out of the tour.</span></div>` : ''}
    </div>
    <footer class="footer">
      <button class="btn btn-primary" data-act="build" ${totalPhotos() ? '' : 'disabled'}>
        ${I.sparkle} Create my tour
      </button>
    </footer>
  </section>`;
}

const PROC_STEPS = ['Analysing your photos', 'Preparing the rooms', 'Assembling the tour'];

function screenProcessing() {
  return `
  <section class="screen">
    <div class="proc">
      <svg class="ring" viewBox="0 0 64 64"><circle class="bg" cx="32" cy="32" r="27"/><circle class="fg" cx="32" cy="32" r="27"/></svg>
      <h2 style="text-align:center">Building your tour</h2>
      <p style="text-align:center;margin-bottom:26px">${totalPhotos()} photo${totalPhotos() > 1 ? 's' : ''} from ${state.rooms.filter((r) => r.photos.length).length} room${state.rooms.filter((r) => r.photos.length).length > 1 ? 's' : ''}</p>
      <ul class="proclist">
        ${PROC_STEPS.map((s, i) => `<li data-step="${i}"><span class="dot">${I.check}</span>${s}</li>`).join('')}
      </ul>
    </div>
    <footer class="footer">
      <div class="note" style="width:100%">${I.info}<span>Prototype: the processing is simulated and always opens the same prepared demo apartment.</span></div>
    </footer>
  </section>`;
}

function screenTour() {
  const tenant = state.tourMode === 'tenant';
  return `
  <section class="screen" id="screen-tour">
    <div class="tour-top">
      <button class="iconbtn" data-act="${tenant ? 'toLandlord' : 'exitTour'}" aria-label="Close">${tenant ? I.back : I.close}</button>
      <span class="pill" id="room-label">Loading…</span>
      <span class="spacer" style="flex:1"></span>
      ${tenant ? '' : restartBtn(true)}
      <span class="pill demo">DEMO</span>
    </div>
    <div class="hint">${I.drag} Drag to look around</div>
    <div class="tour-bottom">
      ${tenant ? `
        <div class="listingbar">
          <div class="info">
            <span class="title">€1,650 / month</span>
            <span class="price">Bright 2-bedroom · Oud-West, Amsterdam</span>
          </div>
          <button class="btn btn-primary btn-sm" data-act="book">Request</button>
        </div>` : ''}
      <div class="roomnav" id="roomnav"></div>
      ${tenant ? '' : `
      <div class="tour-actions">
        <button class="btn btn-outline" data-act="toReview">My photos</button>
        <button class="btn btn-primary" data-act="toTenant">${I.eye} View as tenant</button>
      </div>`}
    </div>
  </section>`;
}

function lightboxHtml() {
  if (!state.lightbox) return '';
  const room = roomById(state.lightbox.roomId);
  const photo = room?.photos.find((p) => p.id === state.lightbox.photoId);
  if (!photo) return '';
  return `
  <div class="lightbox">
    <div class="lb-top"><button class="iconbtn" data-act="closeLb" aria-label="Close">${I.close}</button></div>
    <img src="${photo.url}" alt="">
    <div class="lb-move">
      <label for="move-to">Room</label>
      <select id="move-to" data-move>
        ${state.rooms.map((r) => `<option value="${r.id}" ${r.id === room.id ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
      </select>
    </div>
    <div class="lb-actions">
      <button class="btn btn-outline" data-act="replace">Replace</button>
      <button class="btn btn-primary" data-act="deletePhoto">Delete</button>
    </div>
  </div>`;
}

const SCREENS = {
  start: screenStart, rooms: screenRooms, capture: screenCapture,
  review: screenReview, processing: screenProcessing, tour: screenTour,
};

function render() {
  const onTour = state.screen === 'tour';
  screens().innerHTML = SCREENS[state.screen]() + lightboxHtml();
  $('#viewer-layer').hidden = !onTour;
  screens().classList.toggle('passthrough', onTour);
  if (onTour) mountTour();
  else destroyTour();
  if (state.screen === 'processing') runProcessing();
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  screens().appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

/* ---------------------------------------------------------------- actions */

const ACTIONS = {
  begin: () => { if (!state.rooms.length) state.rooms = PRESETS.slice(0, 3).map(newRoom); go('rooms'); },
  home: () => go('start'),
  samples: () => {
    state.usingSamples = true;
    state.rooms = SAMPLE_ROOMS.map(({ name, key }) => {
      const r = newRoom(name);
      r.photos = [1, 2, 3, 4].map((i) => ({ id: `p${++uid}`, url: `assets/photos/${key}-${i}.jpg`, revoke: false }));
      return r;
    });
    state.activeRoom = 0;
    go('review');
  },
  toCapture: () => { state.activeRoom = 0; go('capture'); },
  nextRoom: () => { state.activeRoom = Math.min(state.activeRoom + 1, state.rooms.length - 1); go('capture'); },
  prevRoom: () => { if (state.activeRoom === 0) return go('rooms'); state.activeRoom--; go('capture'); },
  toReview: () => go('review'),
  backToCapture: () => go('capture'),
  camera: () => pickPhotos(state.rooms[state.activeRoom], 'camera'),
  gallery: () => pickPhotos(state.rooms[state.activeRoom], 'gallery'),
  retry: () => { state.error = null; pickPhotos(state.rooms[state.activeRoom], 'gallery'); },
  build: () => go('processing'),
  exitTour: () => go('review'),
  toTenant: () => { state.tourMode = 'tenant'; go('tour'); },
  toLandlord: () => { state.tourMode = 'landlord'; go('tour'); },
  book: () => toast('Demo — no booking request is sent'),
  closeLb: () => { state.lightbox = null; render(); },
  deletePhoto: () => {
    const { roomId, photoId } = state.lightbox;
    removePhoto(roomById(roomId), photoId);
    state.lightbox = null;
    render();
  },
  replace: () => {
    const { roomId, photoId } = state.lightbox;
    const room = roomById(roomId);
    const at = room.photos.findIndex((p) => p.id === photoId);
    const input = $('#file-gallery');
    input.value = '';
    input.removeAttribute('multiple');
    input.onchange = () => {
      const f = input.files?.[0];
      input.setAttribute('multiple', '');
      if (!f || !f.type.startsWith('image/')) {
        state.error = "That file couldn't be used. Pick an image.";
      } else {
        if (room.photos[at].revoke) URL.revokeObjectURL(room.photos[at].url);
        room.photos[at] = { id: `p${++uid}`, url: URL.createObjectURL(f), revoke: true };
      }
      state.lightbox = null;
      render();
    };
    input.click();
  },
  restart: () => reset(),
};

app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act],[data-add],[data-drop],[data-goroom],[data-open],[data-del],[data-node]');
  if (!el) return;
  const d = el.dataset;

  if (d.del) {                                   // delete from the grid
    e.stopPropagation();
    const [roomId, photoId] = d.del.split(':');
    removePhoto(roomById(roomId), photoId);
    return render();
  }
  if (d.open) {
    const [roomId, photoId] = d.open.split(':');
    state.lightbox = { roomId, photoId };
    return render();
  }
  if (d.add) { state.rooms.push(newRoom(d.add)); return render(); }
  if (d.drop) {
    const r = roomById(d.drop);
    r.photos.forEach((p) => p.revoke && URL.revokeObjectURL(p.url));
    state.rooms = state.rooms.filter((x) => x.id !== d.drop);
    return render();
  }
  if (d.goroom !== undefined) { state.activeRoom = +d.goroom; return go('capture'); }
  if (d.node) return goToNode(d.node);
  if (d.act && ACTIONS[d.act]) ACTIONS[d.act]();
});

app.addEventListener('change', (e) => {
  if (!('move' in e.target.dataset)) return;
  const { roomId, photoId } = state.lightbox;
  const from = roomById(roomId);
  const to = roomById(e.target.value);
  if (!to || to === from) return;
  const i = from.photos.findIndex((p) => p.id === photoId);
  to.photos.push(...from.photos.splice(i, 1));
  state.lightbox = { roomId: to.id, photoId };
  render();
  toast(`Moved to ${to.name}`);
});

app.addEventListener('input', (e) => {
  const id = e.target.dataset.rename;
  if (id) roomById(id).name = e.target.value;
});

/* ---------------------------------------------------------------- processing */

let procTimers = [];

function runProcessing() {
  procTimers.forEach(clearTimeout);
  procTimers = [];
  const items = [...app.querySelectorAll('.proclist li')];
  const step = (i) => {
    items.forEach((li, k) => li.classList.toggle('active', k === i));
    if (i > 0) items[i - 1].classList.add('done');
  };
  step(0);
  procTimers.push(setTimeout(() => step(1), 1400));
  procTimers.push(setTimeout(() => step(2), 2900));
  procTimers.push(setTimeout(() => {
    items.forEach((li) => li.classList.add('done'));
  }, 4300));
  procTimers.push(setTimeout(() => { state.tourMode = 'landlord'; go('tour'); }, 4800));
}

/* ---------------------------------------------------------------- tour */

let viewer = null;
let tourPlugin = null;
let nodes = [];
let navBusy = false;   // a node is loading — ignore room taps until it settles

/** Names the demo nodes after the landlord's own rooms where they match. */
function buildNodes() {
  return DEMO_NODES.map((n) => {
    const match = state.rooms.find((r) => r.photos.length && matchRoomToNode(r.name) === n.id);
    return { ...n, name: match ? match.name : n.name };
  });
}

async function mountTour() {
  if (viewer) {                       // only the chrome around it was re-rendered
    const current = tourPlugin?.getCurrentNode();
    if (current) {
      $('#room-label').textContent = current.name;
      renderRoomNav(current.id);
    }
    return;
  }
  nodes = buildNodes();
  renderRoomNav(nodes[0].id);

  const [{ Viewer }, { VirtualTourPlugin }] = await Promise.all([
    import('@photo-sphere-viewer/core'),
    import('@photo-sphere-viewer/virtual-tour-plugin'),
  ]);
  if (state.screen !== 'tour') return;

  viewer = new Viewer({
    container: $('#viewer-layer'),
    defaultZoomLvl: 15,
    maxFov: 100,
    navbar: false,
    touchmoveTwoFingers: false,
    mousewheelCtrlKey: false,
    loadingTxt: 'Loading your tour…',
    plugins: [[VirtualTourPlugin, {
      positionMode: 'manual',
      preload: true,
      renderMode: '3d',
      // every room opens on its own best view; the panoramas share no common north
      transitionOptions: (node) => ({ showLoader: true, speed: '25rpm', effect: 'fade', rotation: true, rotateTo: node.startPosition }),
      arrowStyle: { size: { width: 76, height: 76 } },
      arrowsPosition: { minPitch: 0.45, maxPitch: Math.PI / 2, linkPitchOffset: -0.05 },
      getLinkTooltip: (_content, link) => nodes.find((n) => n.id === link.nodeId)?.name ?? '',
    }]],
  });

  tourPlugin = viewer.getPlugin(VirtualTourPlugin);
  tourPlugin.addEventListener('node-changed', ({ node }) => {
    navBusy = false;
    const label = $('#room-label');
    if (label) label.textContent = node.name;
    renderRoomNav(node.id);
  });
  navBusy = true;
  tourPlugin.setNodes(nodes, nodes[0].id);
}

function destroyTour() {
  if (viewer) { viewer.destroy(); viewer = null; tourPlugin = null; navBusy = false; }
}

/** Taps during a panorama load can wedge the plugin, so navigation is serialised.
 *  The timeout is a safety net: a backgrounded tab pauses rAF, which stalls the
 *  transition, and the demo must not stay stuck when it comes back. */
function goToNode(id) {
  if (!tourPlugin || navBusy) return;
  navBusy = true;
  const release = setTimeout(() => { navBusy = false; }, 8000);
  Promise.resolve(tourPlugin.setCurrentNode(id))
    .catch(() => {})
    .finally(() => { clearTimeout(release); navBusy = false; });
}

function renderRoomNav(currentId) {
  const nav = $('#roomnav');
  if (!nav) return;
  nav.innerHTML = nodes.map((n) => `
    <button data-node="${n.id}" aria-current="${n.id === currentId}">
      <img src="${n.thumbnail}" alt="">
      <span>${esc(n.name)}</span>
    </button>`).join('');
}

/* ---------------------------------------------------------------- boot */

/* On a laptop the phone frame keeps its real 390 x 844 proportions and is scaled
   down to fit the window, so the layout never differs from a real phone. */
function fitDevice() {
  const d = document.querySelector('.device');
  if (d) {
    const s = Math.min(1, (window.innerHeight - 84) / 844, (window.innerWidth - 40) / 390);
    d.style.setProperty('--dev-scale', s.toFixed(3));
  }
}
window.addEventListener('resize', fitDevice);
fitDevice();

render();
