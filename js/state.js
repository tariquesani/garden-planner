// ─── Config ──────────────────────────────────────────────────────────────────
const SCALE = 36; // px per foot
const GRID  = 0.5; // snap resolution in feet

let garden   = { width: 20, height: 18 };
let plot = { plotId: null, widthPx: 0, heightPx: 0, calibration: null, feetPerPixel: 0 };
let plotImage = null;
let plotDataUrl = null;
let tool = 'select';
let calibClicks = [];
let calibHover = null;
let draftPoints = [];
let draftCursor = null;
let lastDrawTap = 0;
let dragMode = null;
let dragVertex = -1;
let selectedVertex = -1;
let dragOriginPoints = null;
let dragStartFeet = null;
let selectedId = null;
let dragging   = null;
let dragOff    = { x: 0, y: 0 };
let isRotating      = false;
let rotateStartAngle = 0;
let rotateStartRot   = 0;
let nextId     = 20;

// ─── Viewport (zoom / pan) ────────────────────────────────────────────────────
let viewX = 0, viewY = 0, viewZoom = 1;
let isPanning = false, panStart = null;

function screenToWorld(sx, sy) {
  return { x: (sx - viewX) / viewZoom, y: (sy - viewY) / viewZoom };
}

// ─── Undo History ─────────────────────────────────────────────────────────────
const MAX_HISTORY = 50;
const undoStack   = [];
let   _propHistorySaved = false; // prevents saving on every keystroke in text fields

function saveHistory() {
  undoStack.push({
    beds:      JSON.parse(JSON.stringify(beds)),
    obstacles: JSON.parse(JSON.stringify(obstacles)),
    garden:    { ...garden },
    plot: {
      plotId: plot.plotId,
      widthPx: plot.widthPx,
      heightPx: plot.heightPx,
      calibration: plot.calibration ? { ...plot.calibration } : null,
      feetPerPixel: plot.feetPerPixel || 0,
    },
    nextId,
  });
  if (undoStack.length > MAX_HISTORY) undoStack.shift();
}

function undoLast() {
  if (!undoStack.length) return;
  const snap = undoStack.pop();
  beds      = snap.beds;
  obstacles = snap.obstacles;
  garden    = { ...snap.garden };
  nextId    = snap.nextId;
  if (snap.plot) restorePlotMeta(snap.plot);
  document.getElementById('gardenWidth').value  = Math.round(garden.width * 10) / 10;
  document.getElementById('gardenHeight').value = Math.round(garden.height * 10) / 10;
  _propHistorySaved = false;
  // If the previously selected item no longer exists, deselect it
  const stillExists = beds.find(b => b.id === selectedId) || obstacles.find(o => o.id === selectedId);
  if (!stillExists) select(null);
  else syncPanel();
  updateCalibReadout();
  renderLists(); draw();
}
// ─── Data ────────────────────────────────────────────────────────────────────
let obstacles = [
  { id:'obs1', name:'🌳 Tree',      x:0,  y:0,  w:4, h:4, color:'#5aaa5b' },
  { id:'obs2', name:'🚪 Door',      x:0,  y:14, w:2, h:4, color:'#b87333' },
  { id:'obs3', name:'🪑 Furniture', x:14, y:0,  w:6, h:6, color:'#9a9a9a' },
];

let beds = [
  { id:'bed1', name:'Bed 1 — Top',    x:4,   y:0,  w:10, h:4, color:'#8B5E3C', type:'raised', depthIn:12,
    plants:['🍅 Tomatoes','🌶️ Hot Peppers'], notes:'Full sun. Stake tomatoes, cage peppers.' },
  { id:'bed2', name:'Bed 2 — Left',   x:0,   y:6,  w:4,  h:6, color:'#6B4226', type:'raised', depthIn:12,
    plants:['🥒 Cucumbers','🌿 Basil'], notes:'Trellis on inner (yard-facing) edge for cucumbers.' },
  { id:'bed3', name:'Bed 4 — Bottom', x:4,   y:14, w:8,  h:4, color:'#7A5230', type:'raised', depthIn:12,
    plants:['🥕 Carrots','🎃 Squash'], notes:'Squash can sprawl over the front edge.' },
  { id:'bed4', name:'Bed 3 — Right',  x:5.5, y:6,  w:4,  h:6, color:'#5C3D1E', type:'raised', depthIn:12,
    plants:['🍓 Strawberries','🌿 Thyme'], notes:'Strawberries return every year via runners.' },
  { id:'pot20', name:'Pot', x:18,  y:6.5, diam:2, w:2, h:2, color:'#c1440e', type:'pot', plants:['🌼 Marigolds'], notes:'' },
  { id:'pot22', name:'Pot', x:18.5, y:9,  diam:1, w:1, h:1, color:'#c1440e', type:'pot', plants:['🌼 Marigolds'], notes:'' },
  { id:'pot23', name:'Pot', x:18.5, y:10.5, diam:1, w:1, h:1, color:'#c1440e', type:'pot', plants:[], notes:'' },
  { id:'area24', name:'Ground Area', x:14, y:14, w:6, h:4, color:'#3a7d44', type:'ground',
    plants:['🥬 Lettuce','🌱 Radishes'], notes:'' },
];

const BED_COLORS = ['#8B5E3C','#6B4226','#7A5230','#5C3D1E','#9B6B3C','#4A3020','#A0522D'];
let colorIdx = 4;

