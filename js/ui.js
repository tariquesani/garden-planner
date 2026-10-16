// ─── Selection ────────────────────────────────────────────────────────────────
function select(id, type, openPanel = true) {
  if (id !== selectedId) selectedVertex = -1;
  selectedId = id;
  const panel = document.getElementById('rightPanel');
  if (id && openPanel) { panel.classList.add('open'); syncPanel(); }
  else if (!id)        { panel.classList.remove('open'); }
  draw(); renderLists();
}

function getSelected() {
  return beds.find(b => b.id === selectedId) || obstacles.find(o => o.id === selectedId);
}

function isBedSelected() {
  return beds.some(b => b.id === selectedId);
}

function syncPanel() {
  const item = getSelected();
  if (!item) return;
  _propHistorySaved = false; // reset so next edit on this item saves a fresh snapshot
  const isBed = isBedSelected();

  const isGround  = isBed && item.type === 'ground';
  const isPot     = isBed && item.type === 'pot';
  const isPlanter = isBed && item.type === 'planter';
  const poly      = isBed && isPolygon(item);
  document.getElementById('panelTitle').textContent =
    isPlanter ? '🍱 Planter' : isPot ? '🪴 Pot' : isGround ? '🌍 Ground Area' : isBed ? '🌿 Bed Details' : '⬛ Obstacle Details';
  document.getElementById('propName').value = item.name;
  const _vp = visualPos(item);
  document.getElementById('propX').value    = Math.round(_vp.x * 10) / 10;
  document.getElementById('propY').value    = Math.round(_vp.y * 10) / 10;
  if (!isPot && !isPlanter && !poly) {
    document.getElementById('propW').value = item.w;
    document.getElementById('propH').value = item.h;
  }

  document.getElementById('sizeRow').style.display        = (isPot || isPlanter || poly) ? 'none' : '';
  document.getElementById('posRow').style.display         = poly ? 'none' : '';
  document.getElementById('polySection').style.display    = poly ? '' : 'none';
  document.getElementById('potSection').style.display     = isPot ? '' : 'none';
  document.getElementById('planterSection').style.display = isPlanter ? '' : 'none';
  document.getElementById('rotRow').style.display         = (!poly && !isPot) ? '' : 'none';
  if (poly) updatePolyPanel();
  if (isPlanter) {
    document.getElementById('propPlanterL').value = Math.round(item.w * 12);
    document.getElementById('propPlanterW').value = Math.round(item.h * 12);
    syncPlanterPreset();
  }
  if (!poly && !isPot) document.getElementById('propRot').value = rotationDegrees(item.rotation);
  document.getElementById('plantsSection').style.display = isBed ? '' : 'none';
  document.getElementById('organizerRow').style.display  = isBed ? '' : 'none';
  document.getElementById('notesSection').style.display  = isBed ? '' : 'none';
  document.getElementById('depthSection').style.display  = (isBed && !isGround && !isPot && !isPlanter) ? '' : 'none';

  if (isBed) {
    document.getElementById('propNotes').value = item.notes || '';
    if (!isGround && !isPot && !isPlanter) document.getElementById('propDepth').value = item.depthIn || 12;
    if (isPot) document.getElementById('propDiam').value = item.diam || 1;
    renderPlantTags(item);
  }
}

function rotationDegrees(rot) {
  let deg = ((rot || 0) * 180 / Math.PI) % 360;
  if (deg < 0) deg += 360;
  if (deg >= 359.5) deg = 0;
  return Math.round(deg);
}

function syncRotationField() {
  const item = getSelected();
  const el = document.getElementById('propRot');
  if (!item || !el || isPolygon(item) || item.type === 'pot') return;
  el.value = rotationDegrees(item.rotation);
}

function updateRotation(deg) {
  const item = getSelected();
  if (!item || isPolygon(item) || item.type === 'pot') return;
  const n = Number(deg);
  if (!Number.isFinite(n)) return;
  if (!_propHistorySaved) { saveHistory(); _propHistorySaved = true; }
  const wrapped = ((n % 360) + 360) % 360;
  item.rotation = wrapped * Math.PI / 180;
  syncPositionFields();
  draw(); renderLists();
}

// Convert between raw anchor (b.x/b.y = unrotated top-left) and
// visual edge (left/top of the rotated AABB) so position fields
// always show 0 when the item is at the garden wall.
function visualPos(item) {
  const rot = item.rotation || 0;
  const ac = Math.abs(Math.cos(rot)), as = Math.abs(Math.sin(rot));
  const hw = (item.w / 2) * ac + (item.h / 2) * as; // AABB half-width in ft
  const hh = (item.w / 2) * as + (item.h / 2) * ac; // AABB half-height in ft
  return { x: item.x + item.w / 2 - hw, y: item.y + item.h / 2 - hh };
}
function applyVisualPos(item, vx, vy) {
  const rot = item.rotation || 0;
  const ac = Math.abs(Math.cos(rot)), as = Math.abs(Math.sin(rot));
  const hw = (item.w / 2) * ac + (item.h / 2) * as;
  const hh = (item.w / 2) * as + (item.h / 2) * ac;
  item.x = vx - item.w / 2 + hw;
  item.y = vy - item.h / 2 + hh;
}

function syncPositionFields() {
  const item = getSelected();
  if (!item) return;
  const vp = visualPos(item);
  document.getElementById('propX').value = Math.round(vp.x * 10) / 10;
  document.getElementById('propY').value = Math.round(vp.y * 10) / 10;
}

function updateProp(field, value) {
  const item = getSelected();
  if (!item) return;
  // Save history once per editing session (reset when panel re-opens via syncPanel)
  if (!_propHistorySaved) { saveHistory(); _propHistorySaved = true; }
  if (field === 'x') { applyVisualPos(item, value, visualPos(item).y); }
  else if (field === 'y') { applyVisualPos(item, visualPos(item).x, value); }
  else { item[field] = value; }
  draw(); renderLists();
}

// ─── Plants ───────────────────────────────────────────────────────────────────
function renderPlantTags(bed) {
  const c = document.getElementById('plantTags');
  c.innerHTML = '';
  (bed.plants || []).forEach(p => {
    const s = document.createElement('span');
    s.className = 'plant-tag';
    s.innerHTML = `${p}<span class="rm" onclick="removePlant('${p}')"> ×</span>`;
    c.appendChild(s);
  });
}

function addPlant() {
  const sel = document.getElementById('plantSelect');
  const p = sel.value; if (!p) return;
  const bed = beds.find(b => b.id === selectedId); if (!bed) return;

  const pd = PLANT_DATA[p];
  if (pd && bed.type !== 'planter') {
    const { rowSpan, colSpan } = getPlantSpan(pd.sqft);
    const L = Math.floor(bed.h), W = Math.floor(bed.w);
    if (L < rowSpan || W < colSpan) {
      showPlantWarn(`This bed (${bed.w}×${bed.h} ft) is too small for ${p} — needs at least ${colSpan}×${rowSpan} ft.`);
      sel.value = '';
      return;
    }
  }

  if (!bed.plants.includes(p)) {
    saveHistory();
    bed.plants.push(p);
    if (bed.type !== 'planter') addPlantToGrid(bed, p);
    renderPlantTags(bed); draw();
  }
  sel.value = '';
}

function showPlantWarn(msg) {
  let el = document.getElementById('plantAddWarn');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function removePlant(plant) {
  const bed = beds.find(b => b.id === selectedId); if (!bed) return;
  saveHistory();
  removePlantFromGrid(bed, plant);
  bed.plants = bed.plants.filter(p => p !== plant);
  renderPlantTags(bed); draw();
}

// ─── Add / Remove ─────────────────────────────────────────────────────────────
function addBed() {
  saveHistory();
  const id = 'bed' + nextId++;
  const color = BED_COLORS[colorIdx++ % BED_COLORS.length];
  beds.push({ id, name:'New Bed', x:2, y:2, w:4, h:8, color, type:'raised', depthIn:12, plants:[], notes:'' });
  renderLists(); draw(); select(id, 'bed');
}

function addGroundArea() {
  saveHistory();
  const id = 'area' + nextId++;
  beds.push({ id, name:'Ground Area', x:1, y:1, w:6, h:4, color:'#3a7d44', type:'ground', plants:[], notes:'' });
  select(id, 'bed'); renderLists(); draw();
}

function addPot() {
  saveHistory();
  const id = 'pot' + nextId++;
  beds.push({ id, name:'Pot', x:2, y:2, diam:1, w:1, h:1, color:'#c1440e', type:'pot', plants:[], notes:'' });
  select(id, 'bed'); renderLists(); draw();
}

function addPlanter() {
  saveHistory();
  const id = 'planter' + nextId++;
  beds.push({ id, name:'Planter', x:2, y:2, w:3, h:1, color:'#9c6644', type:'planter', plants:[], notes:'' });
  select(id, 'bed'); renderLists(); draw();
  const nameEl = document.getElementById('propName');
  if (nameEl) { nameEl.focus(); nameEl.select(); }
}

function updatePlanterInches(axis, inches) {
  const bed = beds.find(b => b.id === selectedId);
  if (!bed || bed.type !== 'planter' || (axis !== 'w' && axis !== 'h')) return;
  const n = Number(inches);
  if (!Number.isFinite(n) || n < 4 || n > 240) return;
  if (!_propHistorySaved) { saveHistory(); _propHistorySaved = true; }
  bed[axis] = n / 12;
  syncPlanterPreset();
  draw(); renderLists();
}

function applyPlanterPreset(lengthIn, widthIn) {
  const bed = beds.find(b => b.id === selectedId);
  if (!bed || bed.type !== 'planter') return;
  if (!_propHistorySaved) { saveHistory(); _propHistorySaved = true; }
  bed.w = lengthIn / 12;
  bed.h = widthIn / 12;
  document.getElementById('propPlanterL').value = lengthIn;
  document.getElementById('propPlanterW').value = widthIn;
  syncPlanterPreset();
  draw(); renderLists();
}

function syncPlanterPreset() {
  const bed = getSelected();
  if (!bed || bed.type !== 'planter') return;
  const lengthIn = Math.round(bed.w * 12);
  const widthIn = Math.round(bed.h * 12);
  document.querySelectorAll('.planter-preset').forEach(btn => {
    const on = +btn.dataset.l === lengthIn && +btn.dataset.w === widthIn;
    btn.classList.toggle('btn-primary', on);
    btn.classList.toggle('btn-secondary', !on);
  });
}

function updatePotDiam(val) {
  const bed = beds.find(b => b.id === selectedId);
  if (!bed || bed.type !== 'pot') return;
  saveHistory();
  bed.diam = val; bed.w = val; bed.h = val;
  draw(); renderLists();
}

function addObstacle() {
  saveHistory();
  const id = 'obs' + nextId++;
  obstacles.push({ id, name: '⬛ Obstacle', x: 4, y: 4, w: 4, h: 4, color: '#888' });
  renderLists(); draw(); select(id, 'obstacle');
}

function toggleSidebar() {
  const s = document.querySelector('.sidebar');
  s.classList.toggle('collapsed');
  document.getElementById('sidebarExpandTab').style.display =
    s.classList.contains('collapsed') ? 'flex' : 'none';
}
function openSidebar() {
  document.querySelector('.sidebar').classList.add('open');
  document.getElementById('sidebarBackdrop').classList.add('visible');
}
function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('visible');
}

function duplicateSelected() {
  if (!selectedId) return;
  saveHistory();
  const isBed = beds.find(b => b.id === selectedId);
  const isObs = obstacles.find(o => o.id === selectedId);
  if (isBed) {
    const orig = beds.find(b => b.id === selectedId);
    const newId = (orig.type === 'planter' ? 'planter' : orig.type === 'pot' ? 'pot' : orig.type === 'ground' ? 'area' : 'bed') + nextId++;
    const copy = { ...orig, id: newId, x: orig.x + 1, y: orig.y + 1,
                   plants: [...(orig.plants || [])], notes: orig.notes || '', plantGrid: null };
    if (orig.points) {
      copy.points = orig.points.map(p => ({ x: p.x + 1, y: p.y + 1 }));
      syncPolygonBounds(copy);
    }
    beds.push(copy);
    select(newId, 'bed');
  } else if (isObs) {
    const orig = obstacles.find(o => o.id === selectedId);
    const newId = 'obs' + nextId++;
    const copy = { ...orig, id: newId, x: orig.x + 1, y: orig.y + 1 };
    obstacles.push(copy);
    select(newId, 'obstacle');
  }
  renderLists(); draw();
}

function deleteSelected() {
  if (!selectedId) return;
  if (!confirm('Remove this item?')) return;
  saveHistory();
  beds      = beds.filter(b => b.id !== selectedId);
  obstacles = obstacles.filter(o => o.id !== selectedId);
  select(null);
  renderLists(); draw();
}

// ─── Garden size ──────────────────────────────────────────────────────────────
function applyGardenSize() {
  saveHistory();
  garden.width  = parseFloat(document.getElementById('gardenWidth').value)  || 20;
  garden.height = parseFloat(document.getElementById('gardenHeight').value) || 18;
  if (plotImage) {
    plot.calibration = null;
    plot.feetPerPixel = 0;
    updateCalibReadout();
  }
  fitView();
  draw();
}

// ─── Suggest layout ───────────────────────────────────────────────────────────
function suggestLayout() {
  if (!confirm('Reset to the suggested perimeter layout?')) return;
  saveHistory();
  beds = [
    { id:'bed1', name:'Bed 1 — Top',    x:4,   y:0,  w:10, h:4, color:'#8B5E3C', type:'raised', depthIn:12,
      plants:['🍅 Tomatoes','🌶️ Hot Peppers'], notes:'Full sun. Stake tomatoes, cage peppers.' },
    { id:'bed2', name:'Bed 2 — Left',   x:0,   y:6,  w:4,  h:6, color:'#6B4226', type:'raised', depthIn:12,
      plants:['🥒 Cucumbers','🌿 Basil'], notes:'Trellis on inner (yard-facing) edge for cucumbers.' },
    { id:'bed3', name:'Bed 4 — Bottom', x:4,   y:14, w:8,  h:4, color:'#7A5230', type:'raised', depthIn:12,
      plants:['🥕 Carrots','🎃 Squash'], notes:'Squash can sprawl over the front edge.' },
    { id:'bed4', name:'Bed 3 — Right',  x:5.5, y:6,  w:4,  h:6, color:'#5C3D1E', type:'raised', depthIn:12,
      plants:['🍓 Strawberries','🌿 Thyme'], notes:'Strawberries return every year via runners.' },
    { id:'pot20', name:'Pot', x:18,   y:6.5, diam:2, w:2, h:2, color:'#c1440e', type:'pot', plants:['🌼 Marigolds'], notes:'' },
    { id:'pot22', name:'Pot', x:18.5, y:9,   diam:1, w:1, h:1, color:'#c1440e', type:'pot', plants:['🌼 Marigolds'], notes:'' },
    { id:'pot23', name:'Pot', x:18.5, y:10.5, diam:1, w:1, h:1, color:'#c1440e', type:'pot', plants:[], notes:'' },
    { id:'area24', name:'Ground Area', x:14, y:14, w:6, h:4, color:'#3a7d44', type:'ground',
      plants:['🥬 Lettuce','🌱 Radishes'], notes:'' },
  ];
  select(null); renderLists(); draw();
}

// ─── Sidebar lists ────────────────────────────────────────────────────────────
function bedListSize(b) {
  if (b.type === 'pot') return `${b.diam * 12}" pot`;
  if (b.type === 'planter') return `${Math.round(b.w * 12)}×${Math.round(b.h * 12)}" planter`;
  if (isPolygon(b)) return `${bedArea(b).toFixed(1)} sq ft · ${b.points.length} sides`;
  if (b.type === 'ground') return `${b.w}×${b.h} ft · in-ground`;
  return `${b.w}×${b.h} ft`;
}

function renderLists() {
  const bedList = document.getElementById('bedList');
  bedList.innerHTML = '';
  beds.forEach(b => {
    const d = document.createElement('div');
    d.className = 'list-item' + (b.id === selectedId ? ' selected' : '');
    d.innerHTML = `
      <div class="list-item-header">
        <div style="display:flex;align-items:center;gap:6px">
          <div class="color-dot" style="background:${b.color}"></div>
          <span class="list-item-name">${b.name}</span>
        </div>
        <span class="list-item-sub">${bedListSize(b)}</span>
      </div>
      <div class="list-item-sub" style="margin-top:3px">${(b.plants||[]).join(', ') || '—'}</div>
    `;
    d.onclick = () => select(b.id, 'bed');
    bedList.appendChild(d);
  });

  const obsList = document.getElementById('obstacleList');
  obsList.innerHTML = '';
  obstacles.forEach(o => {
    const d = document.createElement('div');
    d.className = 'list-item' + (o.id === selectedId ? ' selected' : '');
    d.innerHTML = `
      <div class="list-item-header">
        <div style="display:flex;align-items:center;gap:6px">
          <div class="color-dot" style="background:${o.color}"></div>
          <span class="list-item-name">${o.name}</span>
        </div>
        <span class="list-item-sub">${o.w}×${o.h} ft</span>
      </div>
    `;
    d.onclick = () => select(o.id, 'obstacle');
    obsList.appendChild(d);
  });
}
