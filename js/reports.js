// ─── Amazon Affiliate + Local Store ──────────────────────────────────────────
const AMAZON_TAG_US = 'mvrieperry-20';
const AMAZON_TAG_CA = 'mvrieperry02-20';

function amazonUrl(keywords, ca = false) {
  const tag  = ca ? AMAZON_TAG_CA : AMAZON_TAG_US;
  const host = ca ? 'www.amazon.ca' : 'www.amazon.com';
  return `https://${host}/s?k=${encodeURIComponent(keywords)}&tag=${tag}`;
}
function amazonBadge(keywords) {
  const btnStyle = `display:inline-flex;align-items:center;gap:3px;background:#FF9900;color:#111;
    font-size:10px;font-weight:700;padding:2px 7px;border-radius:3px;
    text-decoration:none;white-space:nowrap;vertical-align:middle;margin-left:4px`;
  return `<a href="${amazonUrl(keywords)}" target="_blank" rel="noopener sponsored" style="${btnStyle}">🛒 .com</a>` +
         `<a href="${amazonUrl(keywords, true)}" target="_blank" rel="noopener sponsored" style="${btnStyle}">🛒 .ca</a>`;
}
function whereToBuyBanner(categories) {
  const store = getLocalStore();
  const localBtn = store.name && store.url
    ? `<a href="${store.url}" target="_blank" rel="noopener"
        style="display:inline-flex;align-items:center;gap:5px;background:#2d6a30;color:#fff;
        font-size:12px;font-weight:700;padding:6px 14px;border-radius:5px;text-decoration:none;white-space:nowrap">
        🏪 ${store.name}</a>`
    : `<span style="font-size:11px;color:#999;font-style:italic">Add your local store in the sidebar →</span>`;
  const amzBtns = categories.flatMap(([kw, label]) => [
    `<a href="${amazonUrl(kw)}" target="_blank" rel="noopener sponsored"
      style="display:inline-flex;align-items:center;gap:4px;background:#FF9900;color:#111;
      font-size:12px;font-weight:700;padding:6px 14px;border-radius:5px;text-decoration:none;white-space:nowrap">
      🛒 ${label} (.com)</a>`,
    `<a href="${amazonUrl(kw, true)}" target="_blank" rel="noopener sponsored"
      style="display:inline-flex;align-items:center;gap:4px;background:#FF9900;color:#111;
      font-size:12px;font-weight:700;padding:6px 14px;border-radius:5px;text-decoration:none;white-space:nowrap">
      🛒 ${label} (.ca)</a>`
  ]).join('');
  return `
  <div style="background:#f8fdf8;border:1px solid #c4e0c4;border-radius:8px;padding:12px 16px;margin-bottom:18px">
    <div style="font-size:11px;font-weight:700;color:#4a7a4b;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">🛍️ Where to buy</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${localBtn} ${amzBtns}</div>
  </div>`;
}
function getLocalStore() {
  return {
    name: localStorage.getItem('localStoreName') || '',
    url:  localStorage.getItem('localStoreUrl')  || '',
  };
}
function saveLocalStore() {
  localStorage.setItem('localStoreName', (document.getElementById('localStoreName').value || '').trim());
  localStorage.setItem('localStoreUrl',  (document.getElementById('localStoreUrl').value  || '').trim());
}
function loadLocalStoreInputs() {
  const s = getLocalStore();
  const n = document.getElementById('localStoreName');
  const u = document.getElementById('localStoreUrl');
  if (n) n.value = s.name;
  if (u) u.value = s.url;
}
// ─── Export / Print ───────────────────────────────────────────────────────────
function exportImg() {
  // Render at full 1:1 scale into a temporary canvas for a clean export
  const oc = document.createElement('canvas');
  oc.width  = ft(garden.width);
  oc.height = ft(garden.height);
  const savedCtx = canvas.getContext('2d');
  // Temporarily redirect drawing to oc by swapping viewX/Y/Zoom
  const [svX, svY, svZ] = [viewX, viewY, viewZoom];
  const [sw, sh] = [canvas.width, canvas.height];
  canvas.width  = oc.width;
  canvas.height = oc.height;
  viewX = 0; viewY = 0; viewZoom = 1;
  draw();
  const a = document.createElement('a');
  a.download = 'garden-layout.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  canvas.width  = sw;
  canvas.height = sh;
  viewX = svX; viewY = svY; viewZoom = svZ;
  draw();
}

function printPlan() {
  const img = canvas.toDataURL('image/png');
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head><title>Garden Plan</title>
  <style>
    body { font-family: sans-serif; padding: 24px; color: #222; }
    h1 { color: #2d6a30; margin-bottom: 4px; }
    img { max-width: 100%; border: 1px solid #ccc; border-radius: 4px; margin: 16px 0; }
    table { border-collapse: collapse; width: 100%; margin-top: 8px; }
    th, td { border: 1px solid #ccc; padding: 7px 10px; text-align: left; font-size: 13px; }
    th { background: #e8f4e8; font-weight: 600; }
    tr:nth-child(even) td { background: #f8fdf8; }
    .footer { margin-top: 24px; font-size: 11px; color: #888; }
  </style></head><body>
  <h1>🌱 Garden Layout Plan</h1>
  <p style="color:#555;font-size:13px">Garden: <strong>${garden.width} ft × ${garden.height} ft</strong></p>
  <img src="${img}">
  <h2 style="font-size:15px;margin-bottom:8px">Raised Bed Summary</h2>
  <table>
    <tr><th>Bed</th><th>Size</th><th>Position (from top-left)</th><th>Plants</th><th>Notes</th></tr>
    ${beds.map(b => `<tr>
      <td><strong>${b.name}</strong></td>
      <td>${b.w} × ${b.h} ft</td>
      <td>x = ${b.x} ft, y = ${b.y} ft</td>
      <td>${(b.plants||[]).join(', ') || '—'}</td>
      <td style="font-size:11px">${b.notes || '—'}</td>
    </tr>`).join('')}
  </table>
  <div class="footer">Generated with 🌱 Garden Layout Planner</div>
  </body></html>`);
  win.print();
}
// Returns true if a saved plantGrid has old-format cells (plain strings or wrong spans)
function gridNeedsMigration(bed) {
  if (!bed.plantGrid) return false;
  return bed.plantGrid.some(row => row.some(cell => {
    if (!cell || cell.occupied) return false;
    if (typeof cell === 'string') return true; // old string-only format
    const sqft = EMOJI_SQFT[cell.emoji];
    if (!sqft) return false;
    const { rowSpan, colSpan } = getPlantSpan(sqft);
    return (cell.rowSpan || 1) !== rowSpan || (cell.colSpan || 1) !== colSpan;
  }));
}

// ─── Save / Load JSON ─────────────────────────────────────────────────────────
function saveJSON() {
  const embed = document.getElementById('embedPhoto')?.checked && plotDataUrl;
  const plan = {
    version: 2,
    garden: { ...garden },
    beds: beds.map(b => ({
      ...b,
      plants: [...(b.plants || [])],
      points: b.points ? b.points.map(p => ({ x: p.x, y: p.y })) : undefined,
    })),
    obstacles: obstacles.map(o => ({ ...o })),
    plot: plot.plotId ? {
      plotId: plot.plotId,
      widthPx: plot.widthPx,
      heightPx: plot.heightPx,
      calibration: plot.calibration ? { ...plot.calibration } : null,
      feetPerPixel: plot.feetPerPixel || 0,
      imageDataUrl: embed ? plotDataUrl : undefined,
    } : null,
    savedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'garden-plan.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function showNewGardenDialog() {
  const dlg = document.getElementById('newGardenDialog');
  dlg.style.display = 'flex';
}

function confirmNewGarden() {
  document.getElementById('newGardenDialog').style.display = 'none';
  // Reset all state
  beds      = [];
  obstacles = [];
  garden    = { width: 20, height: 18 };
  plot = blankPlot();
  plotImage = null;
  plotDataUrl = null;
  calibClicks = [];
  draftPoints = [];
  draftCursor = null;
  tool = 'select';
  nextId    = 1;
  colorIdx  = 0;
  selectedId = null;
  history   = []; historyIdx = -1;
  document.getElementById('gardenWidth').value  = garden.width;
  document.getElementById('gardenHeight').value = garden.height;
  document.getElementById('rightPanel').classList.remove('open');
  select(null);
  setTool('select');
  updateCalibReadout();
  renderLists();
  fitView();
  draw();
}

function loadJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const plan = JSON.parse(ev.target.result);
        if (plan.garden) {
          Object.assign(garden, plan.garden);
          document.getElementById('gardenWidth').value  = garden.width;
          document.getElementById('gardenHeight').value = garden.height;
        }
        if (plan.beds) {
          beds = plan.beds;
          beds.forEach(b => {
            if (gridNeedsMigration(b)) b.plantGrid = null;
            if (!b.plantGrid && b.plants?.length) initPlantGrid(b);
          });
        }
        if (plan.obstacles) obstacles = plan.obstacles;
        if (plan.plot) {
          plot = {
            plotId: plan.plot.plotId || null,
            widthPx: plan.plot.widthPx || 0,
            heightPx: plan.plot.heightPx || 0,
            calibration: plan.plot.calibration || null,
            feetPerPixel: plan.plot.feetPerPixel || 0,
          };
          if (plan.plot.imageDataUrl) {
            adoptPlotDataUrl(plan.plot.imageDataUrl, { preserveCalibration: true, keepId: true });
          } else if (plan.plot.plotId) {
            idbGet(plan.plot.plotId).then(url => {
              if (url) adoptPlotDataUrl(url, { preserveCalibration: true, keepId: true });
              else alert('This plan’s plot photo is not on this computer. Upload the same photo and the saved scale will apply if the image size matches.');
            });
          }
        } else {
          plot = blankPlot();
          plotImage = null;
          plotDataUrl = null;
        }
        select(null); renderLists(); initCanvas();
        updateCalibReadout();
        alert('Plan loaded successfully!');
      } catch { alert('Could not read plan file. Make sure it was saved from this app.'); }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ─── Report Modal ─────────────────────────────────────────────────────────────
let activeTab = 'build';

function openReport(tab = 'build') {
  if (!beds.length) { alert('Add at least one bed first.'); return; }
  switchTab(tab);
  document.getElementById('reportModal').style.display = 'flex';
}

function closeReport() {
  document.getElementById('reportModal').style.display = 'none';
}

function switchTab(tab) {
  activeTab = tab;
  document.getElementById('tab-build').classList.toggle('active', tab === 'build');
  document.getElementById('tab-plant').classList.toggle('active', tab === 'plant');
  document.getElementById('tab-shop').classList.toggle('active',  tab === 'shop');
  document.getElementById('reportBody').innerHTML =
    tab === 'build' ? generateBuildHTML() :
    tab === 'plant' ? generatePlantsHTML() :
                      generateShoppingHTML();
}

// ─── Bed Builder ──────────────────────────────────────────────────────────────
function boardSizeForDepth(depthIn) {
  if      (depthIn <= 8)  return { boardSize: '2×8', runs: 1 };
  else if (depthIn <= 12) return { boardSize: '2×6', runs: 2 };
  else if (depthIn <= 15) return { boardSize: '2×8', runs: 2 };
  return { boardSize: '2×6', runs: 3 };
}

function lumberBoardCost(len, size) {
  return size === '2×6'
    ? (len<=6?5 : len<=8?7 : len<=10?9 : len<=12?11 : 14)
    : (len<=6?7 : len<=8?9 : len<=10?11 : len<=12?13 : 16);
}

function edgeCuts(points) {
  const cuts = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    let left = Math.hypot(b.x - a.x, b.y - a.y);
    while (left > 16) { cuts.push(16); left -= 16; }
    if (left > 0.05) cuts.push(Math.round(left * 10) / 10);
  }
  return cuts;
}

function calcPolygonMaterials(bed) {
  const depthIn = bed.depthIn || 12;
  const { boardSize, runs } = boardSizeForDepth(depthIn);
  const actualDepthIn = boardSize === '2×6' ? runs * 5.5 : runs * 7.25;
  const area = shoelaceArea(bed.points);
  const cuts = edgeCuts(bed.points);
  const BOARD_LENGTHS = [6, 8, 10, 12, 14, 16];
  const nearestLen = dim => BOARD_LENGTHS.find(l => l >= dim) || 16;
  let lumberCost = 0;
  const boards = cuts.map(len => {
    const boardLen = nearestLen(len);
    const cost = lumberBoardCost(boardLen, boardSize);
    lumberCost += cost * runs;
    return { len, boardLen, cost };
  });
  const postCount = bed.points.length;
  const postCost = postCount * 4;
  const screwCost = Math.max(1, Math.ceil(runs * cuts.length * 2));
  const soilCuFtNum = area * (depthIn / 12);
  const soilCuYd = soilCuFtNum / 27;
  const soilCost = Math.round(soilCuYd * 38);
  const total = lumberCost + postCost + screwCost + soilCost;
  return {
    polygon: true, W: bed.w, L: bed.h, area, depthIn, boardSize, runs, actualDepthIn,
    cuts, boards, postCount,
    lumberCost, postCost, screwCost,
    soilCuFtNum, soilCuFt: soilCuFtNum.toFixed(1), soilCuYd: soilCuYd.toFixed(2),
    soilCost, total,
  };
}

function polygonBuildHTML(bed, m) {
  const cutItems = m.boards.map(b =>
    `<li><strong>${b.len} ft</strong> edge — cut from a ${b.boardLen} ft ${m.boardSize} (${m.runs} run${m.runs > 1 ? 's' : ''})</li>`
  ).join('');
  const boardRows = m.boards.map(b => `
    <tr>
      <td>${m.boardSize} edge board ${amazonBadge(`cedar ${m.boardSize} board lumber`)}</td>
      <td>${m.runs}</td>
      <td>${b.len} ft cut from a ${b.boardLen} ft board</td>
      <td class="cost">$${b.cost * m.runs}</td>
    </tr>`).join('');
  return `
    <div class="report-bed">
      <div class="report-bed-header">
        <h3>${bed.name}</h3>
        <span>${m.area.toFixed(1)} sq ft · ${bed.points.length} sides × ${m.actualDepthIn.toFixed(1)} in deep (${m.runs}× ${m.boardSize})</span>
      </div>
      <div class="report-bed-body">
        <div class="report-section">
          <h4>🧱 Materials List</h4>
          <table class="materials-table">
            <tr><th>Item</th><th>Qty</th><th>Size / Notes</th><th class="cost">Est. Cost</th></tr>
            ${boardRows}
            <tr>
              <td>4×4 Corner Post ${amazonBadge('cedar 4x4 post raised garden bed')}</td><td>${m.postCount}</td>
              <td>One post at each corner, cut to about ${(m.actualDepthIn + 2).toFixed(0)} in</td>
              <td class="cost">$${m.postCost}</td>
            </tr>
            <tr>
              <td>3 in Deck Screws ${amazonBadge('galvanized 3 inch deck screws')}</td><td>1 box</td>
              <td>Galvanized deck screws, one box covers this frame</td>
              <td class="cost">$${m.screwCost}</td>
            </tr>
            <tr class="soil-row">
              <td>Garden Soil / Mix ${amazonBadge('raised bed garden soil mix')}</td><td>${m.soilCuYd} yd³</td>
              <td>${m.soilCuFt} cu ft needed (bulk or ~${Math.ceil(m.soilCuFtNum / 2)} bags × 2 cu ft)</td>
              <td class="cost">≈$${m.soilCost}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Estimated Total</strong></td>
              <td class="cost"><strong>$${m.total}</strong></td>
            </tr>
          </table>
          <p style="font-size:11px;color:#888;margin-top:6px">Prices are approximate Home Depot / Lowe's averages. Each straight edge is one board run. Edges longer than 16 ft are split.</p>
        </div>
        <div class="report-section">
          <h4>✂️ Cut List</h4>
          <ul class="cut-list">${cutItems}
            <li>${m.postCount} × corner posts: <strong>${m.actualDepthIn.toFixed(0)} in each</strong></li>
          </ul>
        </div>
        <div class="report-section">
          <h4>🔨 Assembly Steps</h4>
          <ol class="steps-list">
            <li>Mark each corner of the outline with a stake. Measure the edges against the cut list.</li>
            <li>Cut one board for each edge. Edges longer than 16 ft use two boards butted at a post.</li>
            <li>Stand the boards along the outline and clamp a corner post at each vertex.</li>
            <li>Pre-drill and drive 3 in galvanized deck screws through the boards into the posts.</li>
            <li>Set the frame in place and check that it sits flat. Shim any low corner.</li>
            <li>Fill with ${m.soilCuFt} cu ft (${m.soilCuYd} yd³) of garden mix, rake level, and water before planting.</li>
          </ol>
        </div>
        ${bed.notes ? `<div class="report-section"><h4>📝 Bed Notes</h4><p style="font-size:12px;color:#4a6b4b">${bed.notes}</p></div>` : ''}
      </div>
    </div>`;
}

function calcMaterials(bed) {
  if (isPolygon(bed)) return calcPolygonMaterials(bed);
  const W = bed.w, L = bed.h;
  const depthIn = bed.depthIn || 12;

  // Determine board size and number of runs (layers)
  let boardSize, runs;
  if      (depthIn <= 8)  { boardSize = '2×8'; runs = 1; }  // 7.25" actual
  else if (depthIn <= 12) { boardSize = '2×6'; runs = 2; }  // 11.5" actual
  else if (depthIn <= 15) { boardSize = '2×8'; runs = 2; }  // 14.5" actual
  else                    { boardSize = '2×6'; runs = 3; }  // 16.5" actual

  const actualDepthIn = boardSize === '2×6' ? runs * 5.5 : runs * 7.25;

  const BOARD_LENGTHS = [6, 8, 10, 12, 14, 16];
  const nearestLen = dim => BOARD_LENGTHS.find(l => l >= dim) || 16;
  // 2×6 is ~$2 cheaper per board than 2×8
  const boardCost = (len, size) => size === '2×6'
    ? (len<=6?5 : len<=8?7 : len<=10?9 : len<=12?11 : 14)
    : (len<=6?7 : len<=8?9 : len<=10?11 : len<=12?13 : 16);

  const sideLen  = nearestLen(L);
  const endLen   = nearestLen(W);
  const sideCost = boardCost(sideLen, boardSize);
  const endCost  = boardCost(endLen,  boardSize);

  const soilCuFtNum = W * L * (depthIn / 12);
  const soilCuYd = soilCuFtNum / 27;

  const lumberCost = runs * ((2 * sideCost) + (2 * endCost));
  const postCost   = 4 * 4;                    // ~$4 per cut corner post
  const screwCost  = Math.ceil(runs * 9);      // more screws for more layers
  const soilCost   = Math.round(soilCuYd * 38);
  const total      = lumberCost + postCost + screwCost + soilCost;

  return { W, L, area: W * L, depthIn, boardSize, runs, actualDepthIn,
    sideLen, endLen, sideCost, endCost, postCount: 4,
    lumberCost, postCost, screwCost,
    soilCuFtNum, soilCuFt: soilCuFtNum.toFixed(1), soilCuYd: soilCuYd.toFixed(2),
    soilCost, total };
}

function generateBuildHTML() {
  let grandTotal = 0;
  const raisedBeds  = beds.filter(b => b.type !== 'ground' && b.type !== 'pot' && b.type !== 'planter');
  const nonRaised   = beds.filter(b => b.type === 'ground' || b.type === 'pot' || b.type === 'planter');

  const bedSections = raisedBeds.map(bed => {
    const m = calcMaterials(bed);
    grandTotal += m.total;
    if (m.polygon) return polygonBuildHTML(bed, m);
    const sqft = bed.w * bed.h;

    return `
    <div class="report-bed">
      <div class="report-bed-header">
        <h3>${bed.name}</h3>
        <span>${bed.w} ft wide × ${bed.h} ft long × ${m.actualDepthIn.toFixed(1)} in deep (${m.runs}× ${m.boardSize}) · ${sqft} sq ft</span>
      </div>
      <div class="report-bed-body">
        <div class="report-section">
          <h4>🧱 Materials List</h4>
          <table class="materials-table">
            <tr><th>Item</th><th>Qty</th><th>Size / Notes</th><th class="cost">Est. Cost</th></tr>
            <tr>
              <td>${m.boardSize} Side Board ${amazonBadge(`cedar ${m.boardSize} board lumber`)}</td><td>${m.runs * 2}</td>
              <td>${m.sideLen} ft × ${m.runs} run${m.runs > 1 ? 's' : ''} (for ${bed.h} ft sides${m.sideLen > bed.h ? ` — ${(m.sideLen - bed.h).toFixed(1)} ft waste each` : ''})</td>
              <td class="cost">$${m.sideCost * 2 * m.runs}</td>
            </tr>
            <tr>
              <td>${m.boardSize} End Board ${amazonBadge(`cedar ${m.boardSize} board lumber`)}</td><td>${m.runs * 2}</td>
              <td>${m.endLen} ft × ${m.runs} run${m.runs > 1 ? 's' : ''} (for ${bed.w} ft ends${m.endLen > bed.w ? ` — ${(m.endLen - bed.w).toFixed(1)} ft waste each` : ''})</td>
              <td class="cost">$${m.endCost * 2 * m.runs}</td>
            </tr>
            <tr>
              <td>4×4 Corner Post ${amazonBadge('cedar 4x4 post raised garden bed')}</td><td>4</td>
              <td>Cut to 10 in from a 4×4×8 post</td>
              <td class="cost">$${m.postCost}</td>
            </tr>
            <tr>
              <td>3 in Deck Screws ${amazonBadge('galvanized 3 inch deck screws')}</td><td>1 box</td>
              <td>Galvanized, 1 lb box (~100 screws)</td>
              <td class="cost">$${m.screwCost}</td>
            </tr>
            <tr class="soil-row">
              <td>Garden Soil / Mix ${amazonBadge('raised bed garden soil mix')}</td><td>${m.soilCuYd} yd³</td>
              <td>${m.soilCuFt} cu ft needed (bulk or ~${Math.ceil(m.soilCuFt / 2)} bags × 2 cu ft)</td>
              <td class="cost">≈$${m.soilCost}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Estimated Total</strong></td>
              <td class="cost"><strong>$${m.total}</strong></td>
            </tr>
          </table>
          <p style="font-size:11px;color:#888;margin-top:6px">Prices are approximate Home Depot / Lowe's averages. Soil cost varies widely by source (bulk vs. bags).</p>
        </div>

        <div class="report-section">
          <h4>✂️ Cut List</h4>
          <ul class="cut-list">
            <li>${m.runs * 2} × side boards: <strong>${bed.h} ft each</strong> — cut from ${m.sideLen} ft ${m.boardSize} boards (${m.runs} run${m.runs > 1 ? 's' : ''})</li>
            <li>${m.runs * 2} × end boards: <strong>${bed.w} ft each</strong> — cut from ${m.endLen} ft ${m.boardSize} boards (${m.runs} run${m.runs > 1 ? 's' : ''})</li>
            <li>4 × corner posts: <strong>${m.actualDepthIn.toFixed(0)} in each</strong> — rip from a single 4×4×8 post</li>
          </ul>
        </div>

        <div class="report-section">
          <h4>🔨 Assembly Steps</h4>
          <ol class="steps-list">
            <li>Mark the bed footprint with stakes. Check square: diagonals must be equal.</li>
            <li>Cut lumber to length per the cut list above using a circular saw or miter saw.</li>
            <li>Stand two side boards upright and clamp a 10 in corner post flush at each end.</li>
            <li>Pre-drill 3 holes through the board into the post; drive 3 in galvanized deck screws.</li>
            <li>Attach the two end boards to the remaining post faces the same way. Re-check square.</li>
            <li>Set the frame in position, level with shims if needed. Fill with ${m.soilCuFt} cu ft (${m.soilCuYd} yd³) of quality garden mix, rake level, and water before planting.</li>
          </ol>
        </div>

        ${bed.notes ? `<div class="report-section"><h4>📝 Bed Notes</h4><p style="font-size:12px;color:#4a6b4b">${bed.notes}</p></div>` : ''}
      </div>
    </div>`;
  }).join('');

  const totalSqft = Math.round(raisedBeds.reduce((s, b) => s + bedArea(b), 0) * 10) / 10;
  const groundNote = nonRaised.length
    ? `<p style="font-size:12px;color:#666;margin-top:8px">🌍 ${nonRaised.length} ground area${nonRaised.length > 1 ? 's' : ''}, pot${nonRaised.length > 1 ? 's' : ''}, or planter${nonRaised.length > 1 ? 's' : ''} not shown here — no lumber needed. See Plant Organizer for planting details.</p>`
    : '';
  const summary = `
  <div class="report-summary">
    <h3>📐 Project Summary</h3>
    <div class="summary-grid">
      <div class="summary-stat"><div class="val">${raisedBeds.length}</div><div class="lbl">Beds to build</div></div>
      <div class="summary-stat"><div class="val">${totalSqft}</div><div class="lbl">Total sq ft</div></div>
      <div class="summary-stat"><div class="val">$${grandTotal}</div><div class="lbl">Est. total cost</div></div>
    </div>
    ${groundNote}
  </div>`;

  const buildBanner = whereToBuyBanner([
    ['cedar raised bed lumber boards', 'Lumber'],
    ['4x4 cedar post raised garden bed', 'Posts'],
    ['galvanized 3 inch deck screws', 'Screws'],
    ['raised bed garden soil mix', 'Soil'],
  ]);
  return buildBanner + summary + bedSections;
}

// ─── Interactive Plant Grid ────────────────────────────────────────────────────
let igridDragSrc    = null;
let igridTouchEl      = null; // element being touch-dragged
let igridTouchOverEl  = null; // current drag-over target
let igridTouchStartPos = null; // for detecting tap vs drag
let igridLastTap      = null;  // { time, bedId, row, col } for double-tap
let igridDragActivated = false; // true once touch has moved enough to commit to drag

function igridEraseCell(e) {
  const el = e.currentTarget;
  const bed = beds.find(b => b.id === el.dataset.bed);
  if (!bed?.plantGrid) return;
  clearSpanFromGrid(bed.plantGrid, +el.dataset.row, +el.dataset.col);
  rerenderIGrid(bed.id);
}

// Compute the largest cell size (px) that fits W columns in the available width.
function igridCellSize(W) {
  const gap = 3, padding = 20;
  const available = Math.min(window.innerWidth - 80, 560) - padding;
  const natural = W * 38 + (W - 1) * gap;
  if (natural <= available) return 38;
  return Math.max(26, Math.floor((available - (W - 1) * gap) / W));
}

// Touch drag — touchstart on a plant cell or palette item
function igridTouchStart(e) {
  const el = e.currentTarget;
  const isPlant   = el.classList.contains('has-plant');
  const isPalette = el.dataset.palette === 'true';
  if (!isPlant && !isPalette) return; // empty cell — let scroll pass through
  // Don't preventDefault yet — wait to see if it's a drag or a scroll swipe
  const rowSpan = +el.dataset.rowSpan || 1;
  const colSpan = +el.dataset.colSpan || 1;
  const perSqft = +el.dataset.perSqft || 1;
  if (isPalette) {
    igridDragSrc = { bedId: el.dataset.bed, emoji: el.dataset.emoji, fromPalette: true, rowSpan, colSpan, perSqft };
  } else {
    igridDragSrc = { bedId: el.dataset.bed, row: +el.dataset.row, col: +el.dataset.col, fromPalette: false, rowSpan, colSpan, perSqft };
  }
  igridTouchEl = el;
  igridTouchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  igridDragActivated = false;
}

function igridTouchMove(e) {
  if (!igridDragSrc) return;
  const t = e.touches[0];
  const dx = t.clientX - (igridTouchStartPos?.x || 0);
  const dy = t.clientY - (igridTouchStartPos?.y || 0);
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (!igridDragActivated) {
    if (dist < 6) return; // not committed yet — let browser decide scroll vs drag
    // If movement is primarily horizontal, cancel drag and let grid scroll
    if (Math.abs(dx) > Math.abs(dy) * 1.5) {
      igridDragSrc = null; igridTouchEl = null; igridTouchOverEl = null;
      return;
    }
    // Vertical/diagonal movement → commit to drag
    igridDragActivated = true;
    igridTouchEl.classList.add('dragging');
  }

  e.preventDefault(); // block scroll now that drag is confirmed
  // Briefly hide the dragged element so elementFromPoint sees through it
  if (igridTouchEl) igridTouchEl.style.pointerEvents = 'none';
  const under = document.elementFromPoint(t.clientX, t.clientY);
  if (igridTouchEl) igridTouchEl.style.pointerEvents = '';
  const cell = under?.closest?.('.igrid-cell') || null;
  if (cell !== igridTouchOverEl) {
    if (igridTouchOverEl) igridTouchOverEl.classList.remove('drag-over');
    igridTouchOverEl = cell;
    if (cell) cell.classList.add('drag-over');
  }
}

function igridTouchEnd(e) {
  if (!igridDragSrc) return;
  if (igridDragActivated) e.preventDefault();
  if (igridTouchEl)    { igridTouchEl.classList.remove('dragging'); igridTouchEl.style.pointerEvents = ''; }
  if (igridTouchOverEl) igridTouchOverEl.classList.remove('drag-over');
  const t = e.changedTouches[0];

  // Double-tap detection for erase (only when drag was not activated)
  const dx = t.clientX - (igridTouchStartPos?.x || 0);
  const dy = t.clientY - (igridTouchStartPos?.y || 0);
  const moved = Math.sqrt(dx * dx + dy * dy) > 8;
  if (!moved && !igridDragActivated && igridDragSrc && !igridDragSrc.fromPalette) {
    const { bedId, row, col } = igridDragSrc;
    const now = Date.now();
    if (igridLastTap && now - igridLastTap.time < 350 &&
        igridLastTap.bedId === bedId && igridLastTap.row === row && igridLastTap.col === col) {
      const bed = beds.find(b => b.id === bedId);
      if (bed?.plantGrid) { clearSpanFromGrid(bed.plantGrid, row, col); rerenderIGrid(bedId); }
      igridLastTap = null; igridDragSrc = null; igridTouchEl = null; igridTouchOverEl = null;
      igridDragActivated = false; return;
    } else {
      igridLastTap = { time: now, bedId, row, col };
    }
  }

  if (igridDragActivated) {
    if (igridTouchEl) igridTouchEl.style.pointerEvents = 'none';
    const under = document.elementFromPoint(t.clientX, t.clientY);
    if (igridTouchEl) igridTouchEl.style.pointerEvents = '';
    const dstEl = under?.closest?.('.igrid-cell') || null;
    if (dstEl?.dataset?.bed) {
      igridDrop({ preventDefault: () => {}, currentTarget: dstEl });
    } else {
      igridDragSrc = null;
    }
  } else {
    igridDragSrc = null;
  }
  igridTouchEl = null;
  igridTouchOverEl = null;
  igridDragActivated = false;
}

// Returns grid span dimensions for a plant.
// Dense plants (<1 sqft) stay 1×1 but get a perSqft count > 1 (e.g. radishes: ×9).
// Larger plants snap to the next square size (e.g. 4sqft → 2×2, 9sqft → 3×3).
function getPlantSpan(sqft) {
  if (sqft < 1) return { rowSpan: 1, colSpan: 1, perSqft: Math.max(2, Math.round(1 / sqft)) };
  if (sqft === 1) return { rowSpan: 1, colSpan: 1, perSqft: 1 };
  const side = Math.ceil(Math.sqrt(sqft));
  return { rowSpan: side, colSpan: side, perSqft: 1 };
}

function canPlaceSpan(cells, r, c, rowSpan, colSpan, L, W, bed) {
  if (r + rowSpan > L || c + colSpan > W) return false;
  for (let dr = 0; dr < rowSpan; dr++) {
    for (let dc = 0; dc < colSpan; dc++) {
      if (bed && isPolygon(bed) && !polygonCellInside(bed, r + dr, c + dc)) return false;
      if (cells[r + dr][c + dc] !== null) return false;
    }
  }
  return true;
}

function placeSpanInGrid(cells, r, c, rowSpan, colSpan, emoji, perSqft = 1) {
  cells[r][c] = { emoji, rowSpan, colSpan, perSqft };
  for (let dr = 0; dr < rowSpan; dr++)
    for (let dc = 0; dc < colSpan; dc++)
      if (!(dr === 0 && dc === 0)) cells[r + dr][c + dc] = { occupied: true };
}

function clearSpanFromGrid(cells, r, c) {
  const cell = cells[r][c];
  if (cell === null) return;
  if (cell.occupied) {
    // Trace back to primary cell
    for (let pr = 0; pr <= r; pr++)
      for (let pc = 0; pc < cells[pr].length; pc++) {
        const p = cells[pr][pc];
        if (p && !p.occupied && p.rowSpan && p.colSpan &&
            pr + p.rowSpan > r && pc + p.colSpan > c) {
          clearSpanFromGrid(cells, pr, pc); return;
        }
      }
    cells[r][c] = null; return;
  }
  const rowSpan = cell.rowSpan || 1;
  const colSpan = cell.colSpan || 1;
  for (let dr = 0; dr < rowSpan; dr++)
    for (let dc = 0; dc < colSpan; dc++)
      if (cells[r + dr] && c + dc < cells[r + dr].length)
        cells[r + dr][c + dc] = null;
}

function initPlantGrid(bed) {
  if (bed.plantGrid) return;
  const W = Math.max(1, Math.floor(bed.w));
  const L = Math.max(1, Math.floor(bed.h));
  let inside = W * L;
  if (isPolygon(bed)) {
    inside = 0;
    for (let r = 0; r < L; r++)
      for (let c = 0; c < W; c++)
        if (polygonCellInside(bed, r, c)) inside++;
  }
  const totalCells = Math.max(1, inside);
  const cells = Array.from({ length: L }, () => Array(W).fill(null));

  const plants = (bed.plants || []).filter(p => PLANT_DATA[p]);
  if (plants.length) {
    const sharePerPlant = Math.max(1, Math.round(totalCells / plants.length));
    plants.forEach(pName => {
      const pd = PLANT_DATA[pName];
      const { rowSpan, colSpan, perSqft } = getPlantSpan(pd.sqft);
      const spanArea = rowSpan * colSpan;
      const instances = Math.max(1, Math.round(sharePerPlant / spanArea));
      for (let i = 0; i < instances; i++) {
        outer: for (let r = 0; r < L; r++)
          for (let c = 0; c < W; c++)
            if (canPlaceSpan(cells, r, c, rowSpan, colSpan, L, W, bed)) {
              placeSpanInGrid(cells, r, c, rowSpan, colSpan, pd.emoji, perSqft);
              break outer;
            }
      }
    });
  }
  bed.plantGrid = cells;
}

// Add a new plant into existing empty cells without disturbing other placements
function addPlantToGrid(bed, pName) {
  if (!bed.plantGrid) { initPlantGrid(bed); return; }
  const pd = PLANT_DATA[pName]; if (!pd) return;
  const { rowSpan, colSpan, perSqft } = getPlantSpan(pd.sqft);
  const L = bed.plantGrid.length;
  const W = bed.plantGrid[0]?.length || 0;
  const instances = Math.max(1, Math.round((L * W) / bed.plants.length / (rowSpan * colSpan)));
  for (let i = 0; i < instances; i++) {
    outer: for (let r = 0; r < L; r++)
      for (let c = 0; c < W; c++)
        if (canPlaceSpan(bed.plantGrid, r, c, rowSpan, colSpan, L, W, bed)) {
          placeSpanInGrid(bed.plantGrid, r, c, rowSpan, colSpan, pd.emoji, perSqft);
          break outer;
        }
  }
}

// Remove only cells belonging to a specific plant, leaving others in place
function removePlantFromGrid(bed, pName) {
  if (!bed.plantGrid) return;
  const pd = PLANT_DATA[pName]; if (!pd) return;
  bed.plantGrid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell && !cell.occupied) {
        const emoji = typeof cell === 'string' ? cell : cell.emoji;
        if (emoji === pd.emoji) clearSpanFromGrid(bed.plantGrid, r, c);
      }
    });
  });
}

function resetPlantGrid(bedId) {
  const bed = beds.find(b => b.id === bedId);
  if (!bed) return;
  delete bed.plantGrid;
  initPlantGrid(bed);
  rerenderIGrid(bedId);
}

function clearBedPlants(bedId) {
  const bed = beds.find(b => b.id === bedId);
  if (!bed) return;
  if (!confirm(`Remove all plants from "${bed.name}"? This cannot be undone.`)) return;
  bed.plants = [];
  delete bed.plantGrid;
  saveHistory();
  switchTab(activeTab);
  syncPanel();
}

function igridCellHTML(cell, bedId, ri, ci, cellSize = 38, outside = false) {
  if (outside) {
    return `<div class="igrid-cell outside" data-bed="${bedId}" data-row="${ri}" data-col="${ci}"
      ondragover="igridDragOver(event)" ondragleave="igridDragLeave(event)" ondrop="igridDrop(event)"></div>`;
  }
  // Occupied cells are invisible — the spanning parent covers their space in the grid
  if (cell && cell.occupied) return '';

  // Support both legacy string cells and new object format
  const emoji    = cell === null ? null : (typeof cell === 'string' ? cell : cell.emoji);
  const rowSpan  = (cell && cell.rowSpan)  || 1;
  const colSpan  = (cell && cell.colSpan)  || 1;
  const perSqft  = (cell && cell.perSqft)  || 1;
  const isSpanning = rowSpan > 1 || colSpan > 1;
  const isDense    = perSqft > 1;
  const baseFs = Math.round(cellSize * 0.53); // ~20px at 38px cell

  const spanStyle  = isSpanning ? `grid-column:span ${colSpan};grid-row:span ${rowSpan};` : '';
  const fsStyle    = `font-size:${isSpanning ? Math.min(48, baseFs * Math.min(rowSpan, colSpan)) : baseFs}px;`;
  const extraStyle = isSpanning ? 'border-radius:8px;' : '';
  const badge      = (emoji && isDense) ? `<span class="cell-count">×${perSqft}</span>` : '';

  return `<div class="igrid-cell ${emoji ? 'has-plant' : 'empty'}${isDense ? ' dense' : ''}"
    draggable="${emoji ? 'true' : 'false'}"
    data-bed="${bedId}" data-row="${ri}" data-col="${ci}"
    data-row-span="${rowSpan}" data-col-span="${colSpan}" data-per-sqft="${perSqft}"
    style="${spanStyle}${fsStyle}${extraStyle}"
    ondragstart="igridDragStart(event)"
    ondragover="igridDragOver(event)"
    ondragleave="igridDragLeave(event)"
    ondrop="igridDrop(event)"
    ondragend="igridDragEnd(event)"
    ondblclick="${emoji ? 'igridEraseCell(event)' : ''}"
    ontouchstart="igridTouchStart(event)"
    ontouchmove="igridTouchMove(event)"
    ontouchend="igridTouchEnd(event)">${emoji || '·'}${badge}</div>`;
}

function renderInteractiveGrid(bed) {
  initPlantGrid(bed);
  const W = Math.max(1, Math.floor(bed.w));
  const cs = igridCellSize(W); // responsive cell size
  const cells = bed.plantGrid.flatMap((row, ri) =>
    row.map((cell, ci) => igridCellHTML(cell, bed.id, ri, ci, cs, isPolygon(bed) && !polygonCellInside(bed, ri, ci)))
  ).join('');
  const legend = (bed.plants || []).map(pName => {
    const pd = PLANT_DATA[pName]; if (!pd) return '';
    return `<span class="grid-legend-item">${pd.emoji} ${pName.replace(/^\S+\s/, '')}</span>`;
  }).join('') + `<span class="grid-legend-item" style="opacity:0.5">· empty</span>`;

  // Plant palette — drag or touch from here to paint individual cells
  const paletteItems = (bed.plants || []).map(pName => {
    const pd = PLANT_DATA[pName]; if (!pd) return '';
    const { rowSpan, colSpan, perSqft } = getPlantSpan(pd.sqft);
    const badge = perSqft > 1 ? `<span class="cell-count" style="font-size:9px">×${perSqft}</span>` : '';
    return `<div class="igrid-palette-item" draggable="true"
      data-bed="${bed.id}" data-emoji="${pd.emoji}" data-palette="true"
      data-row-span="${rowSpan}" data-col-span="${colSpan}" data-per-sqft="${perSqft}"
      ondragstart="igridDragStart(event)" ondragend="igridDragEnd(event)"
      ontouchstart="igridTouchStart(event)" ontouchmove="igridTouchMove(event)" ontouchend="igridTouchEnd(event)"
      title="${pName} (${perSqft > 1 ? perSqft + '/sq ft' : pd.sqft + ' sq ft'})">${pd.emoji}${badge}</div>`;
  }).join('') +
  `<div class="igrid-palette-item clear-cell" draggable="true"
    data-bed="${bed.id}" data-emoji="" data-palette="true"
    data-row-span="1" data-col-span="1"
    ondragstart="igridDragStart(event)" ondragend="igridDragEnd(event)"
    ontouchstart="igridTouchStart(event)" ontouchmove="igridTouchMove(event)" ontouchend="igridTouchEnd(event)"
    title="Erase cell">✕</div>`;

  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:8px">
      <div class="grid-legend" style="margin:0">${legend}</div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        <button class="btn btn-sm" style="font-size:11px;padding:3px 10px" onclick="resetPlantGrid('${bed.id}')">↺ Reset layout</button>
        <button class="btn btn-sm" style="font-size:11px;padding:3px 10px;background:#fee2e2;color:#b91c1c;border-color:#fca5a5" onclick="clearBedPlants('${bed.id}')">🗑 Clear all plants</button>
      </div>
    </div>
    <div class="igrid-scroll">
      <div class="igrid" id="igrid-${bed.id}" style="grid-template-columns:repeat(${W},${cs}px);grid-auto-rows:${cs}px">${cells}</div>
    </div>
    <div class="igrid-palette">
      <span style="font-size:10px;color:#aaa;margin-right:4px;flex-shrink:0">🎨 Paint:</span>
      ${paletteItems}
    </div>
    <p style="font-size:10px;color:#888;margin-top:4px">Drag or tap grid cells to rearrange · ${bed.w} cols × ${bed.h} rows · 1 cell = 1 sq ft</p>`;
}

function rerenderIGrid(bedId) {
  const container = document.getElementById(`igrid-${bedId}`);
  if (!container) return;
  const bed = beds.find(b => b.id === bedId);
  if (!bed?.plantGrid) return;
  const W = Math.max(1, Math.floor(bed.w));
  const cs = igridCellSize(W);
  container.style.gridTemplateColumns = `repeat(${W},${cs}px)`;
  container.style.gridAutoRows = `${cs}px`;
  container.innerHTML = bed.plantGrid.flatMap((row, ri) =>
    row.map((cell, ci) => igridCellHTML(cell, bed.id, ri, ci, cs))
  ).join('');
}

function igridDragStart(e) {
  const el = e.currentTarget;
  const rowSpan = +el.dataset.rowSpan || 1;
  const colSpan = +el.dataset.colSpan || 1;
  const perSqft = +el.dataset.perSqft || 1;
  if (el.dataset.palette === 'true') {
    igridDragSrc = { bedId: el.dataset.bed, emoji: el.dataset.emoji, fromPalette: true, rowSpan, colSpan, perSqft };
  } else {
    igridDragSrc = { bedId: el.dataset.bed, row: +el.dataset.row, col: +el.dataset.col, fromPalette: false, rowSpan, colSpan, perSqft };
  }
  e.dataTransfer.effectAllowed = 'move';
  el.classList.add('dragging');
}

function igridDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function igridDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }

function igridDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  igridDragSrc = null;
}

function igridDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!igridDragSrc) return;
  const dstEl = e.currentTarget;
  if (!dstEl.dataset.row) return;
  const dst = { row: +dstEl.dataset.row, col: +dstEl.dataset.col };
  if (igridDragSrc.bedId !== dstEl.dataset.bed) return;
  const bed = beds.find(b => b.id === igridDragSrc.bedId);
  if (!bed?.plantGrid) return;
  const L = bed.plantGrid.length;
  const W = bed.plantGrid[0]?.length || 0;

  if (igridDragSrc.fromPalette) {
    const emoji = igridDragSrc.emoji || null;
    if (!emoji) {
      // ✕ erase palette item
      clearSpanFromGrid(bed.plantGrid, dst.row, dst.col);
    } else {
      const { rowSpan, colSpan, perSqft: srcPerSqft } = igridDragSrc;
      // Center the span on the drop cell, then clamp to grid bounds
      const pr = Math.max(0, Math.min(dst.row - Math.floor(rowSpan / 2), L - rowSpan));
      const pc = Math.max(0, Math.min(dst.col - Math.floor(colSpan / 2), W - colSpan));
      if (pr < 0 || pc < 0) {
        showIgridToast(`Bed too small for this plant — needs at least ${colSpan}×${rowSpan} ft.`);
        igridDragSrc = null; rerenderIGrid(bed.id); return;
      }
      clearSpanFromGrid(bed.plantGrid, pr, pc);
      if (canPlaceSpan(bed.plantGrid, pr, pc, rowSpan, colSpan, L, W, bed)) {
        placeSpanInGrid(bed.plantGrid, pr, pc, rowSpan, colSpan, emoji, srcPerSqft || 1);
      } else {
        showIgridToast(`Not enough space here — this plant needs a ${colSpan}×${rowSpan} ft area.`);
        igridDragSrc = null; rerenderIGrid(bed.id); return;
      }
    }
  } else {
    if (igridDragSrc.row === dst.row && igridDragSrc.col === dst.col) return;
    const srcCell = bed.plantGrid[igridDragSrc.row][igridDragSrc.col];
    if (!srcCell || srcCell.occupied) return;
    const srcEmoji = typeof srcCell === 'string' ? srcCell : srcCell.emoji;
    const srcRSpan = (typeof srcCell === 'object' && srcCell.rowSpan) || 1;
    const srcCSpan = (typeof srcCell === 'object' && srcCell.colSpan) || 1;
    clearSpanFromGrid(bed.plantGrid, igridDragSrc.row, igridDragSrc.col);
    // Center the span on the drop cell, then clamp to grid bounds
    const pr = Math.max(0, Math.min(dst.row - Math.floor(srcRSpan / 2), L - srcRSpan));
    const pc = Math.max(0, Math.min(dst.col - Math.floor(srcCSpan / 2), W - srcCSpan));
    clearSpanFromGrid(bed.plantGrid, pr, pc);
    if (canPlaceSpan(bed.plantGrid, pr, pc, srcRSpan, srcCSpan, L, W, bed)) {
      placeSpanInGrid(bed.plantGrid, pr, pc, srcRSpan, srcCSpan, srcEmoji);
    } else {
      // Restore to source — destination doesn't have room
      if (canPlaceSpan(bed.plantGrid, igridDragSrc.row, igridDragSrc.col, srcRSpan, srcCSpan, L, W, bed))
        placeSpanInGrid(bed.plantGrid, igridDragSrc.row, igridDragSrc.col, srcRSpan, srcCSpan, srcEmoji);
      showIgridToast(`Not enough space here — this plant needs a ${srcCSpan}×${srcRSpan} ft area.`);
    }
  }
  igridDragSrc = null;
  rerenderIGrid(bed.id);
}

function showIgridToast(msg) {
  let t = document.getElementById('igridToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'igridToast';
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1a1a1a;color:#fff;padding:9px 16px;border-radius:8px;font-size:13px;z-index:9999;pointer-events:none;transition:opacity 0.3s;white-space:nowrap;max-width:90vw;text-align:center';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

function generatePlantsHTML() {
  const bedSections = beds.map(bed => {
    const plants  = bed.plants || [];
    const sqftTotal = Math.round(bedArea(bed) * 10) / 10;
    const sizeLabel = isPolygon(bed) ? `${sqftTotal} sq ft` : `${bed.w}×${bed.h} ft`;

    const addRow = `
      <div style="display:flex;gap:6px;align-items:center;padding:8px 16px;border-bottom:1px solid #d4e4d4;background:#f8fcf8">
        <select id="orgSelect-${bed.id}" style="flex:1;padding:5px 8px;border:1px solid #c6d9c6;border-radius:6px;font-size:13px;background:#fff">${PLANT_OPTIONS_HTML}</select>
        <button class="btn btn-primary btn-sm" onclick="addPlantFromOrganizer('${bed.id}')">+ Add</button>
      </div>`;

    if (!plants.length) {
      return `<div class="report-bed">
        <div class="report-bed-header"><h3>${bed.name}</h3><span>${sizeLabel}</span></div>
        ${addRow}
        <div class="report-bed-body"><p style="color:#888;font-size:13px;padding:4px 0">No plants yet — use the dropdown above to add some.</p></div>
      </div>`;
    }

    // Companion & conflict checks
    const companionAlerts = [];
    const avoidAlerts     = [];
    plants.forEach(p => {
      const pd = PLANT_DATA[p]; if (!pd) return;
      pd.companions.forEach(c => { if (plants.includes(c)) companionAlerts.push([p, c].sort().join(' + ')); });
      pd.avoid.forEach(a => { if (plants.includes(a)) avoidAlerts.push([p, a].sort().join(' conflicts with ')); });
    });

    const alertsHTML = avoidAlerts.length
      ? `<div style="background:#fee2e2;border:1px solid #fca5a5;border-radius:6px;padding:9px 12px;margin-bottom:12px;font-size:12px">
          ⚠️ <strong>Conflicts detected:</strong> ${[...new Set(avoidAlerts)].join(' · ')}
        </div>` : '';
    const companionsHTML = [...new Set(companionAlerts)].length
      ? `<div style="background:#e8f4e8;border:1px solid #b8d8b8;border-radius:6px;padding:9px 12px;margin-bottom:12px;font-size:12px">
          ✅ <strong>Good companions:</strong> ${[...new Set(companionAlerts)].join(' · ')}
        </div>` : '';

    // Grid (interactive)
    const isGround  = bed.type === 'ground';
    const isPot     = bed.type === 'pot';
    const isPlanter = bed.type === 'planter';

    // Per-plant detail rows
    const plantRows = plants.map(pName => {
      const pd = PLANT_DATA[pName]; if (!pd) return '';
      const perSqft    = pd.sqft < 1 ? Math.round(1 / pd.sqft) : null;
      const countLabel = perSqft
        ? `~${Math.round(sqftTotal * perSqft)} plants (${perSqft}/sq ft)`
        : `~${Math.floor(sqftTotal / pd.sqft)} plants`;
      const trellisTag  = pd.trellis ? `<span class="pill warn">🪝 Trellis needed</span>` : '';
      const cTags = pd.companions.filter(c => plants.includes(c)).map(c => `<span class="pill">✅ ${c}</span>`).join('');
      const aTags = pd.avoid.filter(a => plants.includes(a)).map(a => `<span class="pill bad">⚠️ ${a}</span>`).join('');

      return `<div class="plant-row">
        <div class="plant-emoji">${pd.emoji}</div>
        <div class="plant-info">
          <h5>${pName}</h5>
          <div class="plant-meta">
            <span class="pill">📐 ${pd.sqft >= 1 ? pd.sqft + ' sq ft/plant' : perSqft + '/sq ft'}</span>
            <span class="pill">↔ ${pd.spacing}" apart</span>
            ${(!isGround && !isPot && !isPlanter) ? `<span class="pill">⬇ ${pd.depthIn}" soil</span>` : ''}
            <span class="pill">☀ ${pd.sun}</span>
            <span class="pill">💧 ${pd.water}</span>
            ${trellisTag}
          </div>
          ${(cTags || aTags) ? `<div class="plant-meta">${cTags}${aTags}</div>` : ''}
          <div class="plant-notes">${countLabel} in this ${sqftTotal} sq ft ${isPlanter ? 'planter' : isPot ? 'pot' : isGround ? 'ground area' : 'bed'}. ${pd.notes}</div>
        </div>
      </div>`;
    }).join('');

    return `<div class="report-bed">
      <div class="report-bed-header">
        <h3>${bed.name} ${isPlanter ? '<span style="font-size:11px;font-weight:normal;background:rgba(156,102,68,0.18);border:1px solid #9c6644;border-radius:4px;padding:1px 6px;vertical-align:middle">🍱 planter</span>' : isPot ? '<span style="font-size:11px;font-weight:normal;background:rgba(193,68,14,0.15);border:1px solid #c1440e;border-radius:4px;padding:1px 6px;vertical-align:middle">🪴 pot</span>' : isGround ? '<span style="font-size:11px;font-weight:normal;background:rgba(58,125,68,0.2);border:1px solid #3a7d44;border-radius:4px;padding:1px 6px;vertical-align:middle">🌍 in-ground</span>' : ''}</h3>
        <span>${isPlanter ? `${Math.round(bed.w * 12)}×${Math.round(bed.h * 12)} in · ${sqftTotal} sq ft` : isPolygon(bed) ? `${sqftTotal} sq ft` : `${bed.w} ft × ${bed.h} ft · ${sqftTotal} sq ft`}</span>
      </div>
      ${addRow}
      <div class="report-bed-body">
        ${alertsHTML}${companionsHTML}
        ${isPlanter ? '' : `<div class="report-section">
          <h4>🗺 Square-Foot Layout (drag to rearrange)</h4>
          <p style="font-size:11px;color:#aaa;margin:-2px 0 8px">Drag palette emojis onto cells to paint. Double-click (or double-tap) a plant to remove it.</p>
          ${renderInteractiveGrid(bed)}
        </div>`}
        <div class="report-section">
          <h4>🌿 Plant Details</h4>
          ${plantRows}
        </div>
      </div>
    </div>`;
  }).join('');

  const uniquePlants = [...new Set(beds.flatMap(b => b.plants || []))];
  const summary = `
  <div class="report-summary">
    <h3>🌱 Planting Summary</h3>
    <div class="summary-grid">
      <div class="summary-stat"><div class="val">${beds.length}</div><div class="lbl">Beds</div></div>
      <div class="summary-stat"><div class="val">${uniquePlants.length}</div><div class="lbl">Unique plants</div></div>
      <div class="summary-stat"><div class="val">${beds.reduce((s,b)=>s+b.w*b.h,0)}</div><div class="lbl">Sq ft total</div></div>
    </div>
  </div>`;

  return summary + bedSections;
}

function addPlantFromOrganizer(bedId) {
  const sel = document.getElementById('orgSelect-' + bedId);
  const p = sel.value; if (!p) return;
  const bed = beds.find(b => b.id === bedId); if (!bed) return;
  const pd = PLANT_DATA[p];
  if (pd && bed.type !== 'planter') {
    const { rowSpan, colSpan } = getPlantSpan(pd.sqft);
    const L = Math.floor(bed.h), W = Math.floor(bed.w);
    if (L < rowSpan || W < colSpan) {
      showIgridToast(`Too small for ${p} — needs at least ${colSpan}×${rowSpan} ft.`);
      sel.value = '';
      return;
    }
  }
  if (!bed.plants.includes(p)) {
    saveHistory();
    bed.plants.push(p);
    if (bed.type !== 'planter') addPlantToGrid(bed, p);
    draw();
  }
  sel.value = '';
  switchTab('plant'); // re-render organizer to show new plant
}

// ─── Shopping List ────────────────────────────────────────────────────────────
function generateShoppingHTML() {
  if (!beds.length) return '<p style="padding:20px;color:#888">No beds to calculate.</p>';

  // Collect every cut piece needed across raised beds only (ground areas need no lumber)
  const pieces = [];
  beds.filter(b => b.type !== 'ground' && b.type !== 'pot' && b.type !== 'planter').forEach(bed => {
    const m = calcMaterials(bed);
    for (let r = 0; r < m.runs; r++) {
      if (m.polygon) {
        m.cuts.forEach((len, i) => {
          pieces.push({ len, label: `${bed.name} edge ${i + 1}`, bedName: bed.name, boardSize: m.boardSize });
        });
      } else {
        pieces.push({ len: bed.h, label: `${bed.name} side`, bedName: bed.name, boardSize: m.boardSize });
        pieces.push({ len: bed.h, label: `${bed.name} side`, bedName: bed.name, boardSize: m.boardSize });
        pieces.push({ len: bed.w, label: `${bed.name} end`,  bedName: bed.name, boardSize: m.boardSize });
        pieces.push({ len: bed.w, label: `${bed.name} end`,  bedName: bed.name, boardSize: m.boardSize });
      }
    }
  });

  // Bin-pack pieces into boards using First Fit Decreasing
  // Pieces of different board sizes (2×6 vs 2×8) cannot share a board
  const BOARD_LENGTHS = [6, 8, 10, 12, 14, 16];
  const nearestLen = dim => BOARD_LENGTHS.find(l => l >= dim) || 16;
  const boardCost = (len, size) => size === '2×6'
    ? (len<=6?5 : len<=8?7 : len<=10?9 : len<=12?11 : 14)
    : (len<=6?7 : len<=8?9 : len<=10?11 : len<=12?13 : 16);

  const sorted = [...pieces].sort((a, b) => b.len - a.len);
  const bins   = [];

  sorted.forEach(piece => {
    // Try to fit into an existing board of the same size with enough space
    const bin = bins.find(b => b.boardSize === piece.boardSize && b.remaining >= piece.len);
    if (bin) {
      bin.pieces.push(piece);
      bin.remaining -= piece.len;
    } else {
      const bl = nearestLen(piece.len);
      bins.push({ boardLen: bl, boardSize: piece.boardSize, remaining: bl - piece.len, pieces: [piece], cost: boardCost(bl, piece.boardSize) });
    }
  });

  // Corner posts: compute actual depth from materials to size posts correctly
  const bedMats = beds.map(b => calcMaterials(b));
  const maxDepthIn = Math.max(...bedMats.map(m => m.actualDepthIn));
  const postLenIn  = Math.ceil(maxDepthIn) + 2; // 2" below grade
  const cornerCount = beds.reduce((s, b) => s + (isPolygon(b) ? b.points.length : 4), 0);
  const totalPostIn  = cornerCount * postLenIn;
  const postsNeeded  = Math.ceil(totalPostIn / 96);
  const postsPerBuy  = Math.floor(96 / postLenIn);

  // Screws: depends on total runs across all beds
  const totalRuns  = bedMats.reduce((s, m) => s + m.runs, 0);
  const screwBoxes = Math.max(1, Math.ceil(totalRuns * 16 / 100));

  // Soil
  const totalSoilCuFt = bedMats.reduce((s, m) => s + (m.soilCuFtNum != null ? m.soilCuFtNum : m.W * m.L * (m.depthIn / 12)), 0);
  const totalSoilCuYd = totalSoilCuFt / 27;

  // Costs
  const lumberCost = bins.reduce((s, b) => s + b.cost, 0);
  const postCost   = postsNeeded * 12;
  const screwCost  = screwBoxes  * 9;
  const soilCost   = Math.round(totalSoilCuYd * 38);
  const grandTotal = lumberCost + postCost + screwCost + soilCost;

  // Bed label colors
  const palette = ['#2d6a30','#6B4226','#7A5230','#5C3D1E','#9B6B3C','#4A3020'];
  const bedColor = {};
  beds.forEach((b, i) => { bedColor[b.name] = palette[i % palette.length]; });

  const boardRows = bins.map(bin => {
    const cuts = bin.pieces.map(p =>
      `<span style="background:${bedColor[p.bedName]};color:#fff;padding:2px 7px;border-radius:10px;font-size:11px;margin:2px;display:inline-block;white-space:nowrap">${p.label} ${p.len} ft</span>`
    ).join(' ');
    const waste = bin.remaining;
    const wasteStr = waste === 0
      ? '<span style="color:#2d6a30;font-weight:600">✓ zero waste</span>'
      : `${waste.toFixed(1)} ft left`;
    return `<tr>
      <td style="font-size:12px;padding:6px 8px;white-space:nowrap"><strong>${bin.boardSize}×${bin.boardLen}</strong></td>
      <td style="padding:6px 8px;line-height:1.8">${cuts}</td>
      <td style="font-size:12px;padding:6px 8px;white-space:nowrap">${wasteStr}</td>
      <td style="font-size:12px;padding:6px 8px;text-align:right;font-weight:600;color:#2d6a30;white-space:nowrap">$${bin.cost}</td>
    </tr>`;
  }).join('');

  const soilRows = beds.map((b, i) => {
    const m    = bedMats[i];
    const cuft = m.soilCuFt;
    const bags  = Math.ceil(parseFloat(cuft) / 2);
    return `<tr><td>${b.name}</td><td>${cuft} cu ft</td><td>${bags} bags (2 cu ft)</td></tr>`;
  }).join('');

  // Reuse callout — boards shared across beds
  const sharedBoards = bins.filter(b => {
    const names = [...new Set(b.pieces.map(p => p.bedName))];
    return names.length > 1;
  });
  const reuseNote = sharedBoards.length
    ? `<div style="background:#fffbeb;border:1px solid #fbbf24;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#78350f">
        💡 <strong>${sharedBoards.length} board${sharedBoards.length > 1 ? 's' : ''} shared across beds</strong> —
        pieces from different beds are cut from the same board, saving waste and money.
        ${postsNeeded < beds.length ? `Also, ${postsNeeded} corner post${postsNeeded > 1 ? 's' : ''} (instead of ${beds.length}) cover all ${cornerCount} corners — each 4×4×8 yields ${postsPerBuy} corner posts.` : ''}
      </div>`
    : '';

  const shopBanner = whereToBuyBanner([
    ['cedar raised bed lumber boards', 'Lumber'],
    ['4x4 cedar post raised garden bed', 'Posts'],
    ['galvanized 3 inch deck screws', 'Screws'],
    ['raised bed garden soil mix', 'Soil'],
    ['vegetable garden seeds variety pack', 'Seeds'],
  ]);

  // Seeds & Plants
  const largePlantWords = ['apple','pear','peach','cherr','lemon','kiwi','blueberr','grape','rose','lavender','hibiscus'];
  const allPlants = [...new Set(beds.flatMap(b => b.plants || []))].filter(p => PLANT_DATA[p]);
  const seedRows = allPlants.map(p => {
    const pd = PLANT_DATA[p];
    const plantName = p.split(' ').slice(1).join(' ');
    const nameLower = plantName.toLowerCase();
    const kw = `${nameLower} ${largePlantWords.some(w => nameLower.includes(w)) ? 'plant' : 'seeds'}`;
    const bedsUsing = beds.filter(b => (b.plants||[]).includes(p)).map(b => b.name || 'Bed').join(', ');
    // Count placed instances from plantGrid; fall back to 1 per bed if no grid
    let count = 0;
    beds.forEach(bed => {
      if (!(bed.plants||[]).includes(p)) return;
      if (bed.plantGrid) {
        bed.plantGrid.forEach(row => row.forEach(cell => {
          if (cell && !cell.occupied && cell.emoji === pd.emoji)
            count += (cell.perSqft || 1);
        }));
      } else {
        count++; // at least 1 per bed if grid not initialized
      }
    });
    return `<tr>
      <td>${pd.emoji} <strong>${plantName}</strong></td>
      <td style="text-align:center;font-weight:700;font-size:15px;color:#2d6a30">${count || '—'}</td>
      <td style="font-size:11px;color:#666">${bedsUsing}</td>
      <td>${amazonBadge(kw)}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="4" style="color:#999;font-style:italic">No plants added to beds yet.</td></tr>';

  const totalPlantCount = allPlants.reduce((sum, p) => {
    const pd = PLANT_DATA[p];
    beds.forEach(bed => {
      if (!(bed.plants||[]).includes(p)) return;
      if (bed.plantGrid) {
        bed.plantGrid.forEach(row => row.forEach(cell => {
          if (cell && !cell.occupied && cell.emoji === pd.emoji)
            sum += (cell.perSqft || 1);
        }));
      } else { sum++; }
    });
    return sum;
  }, 0);

  return shopBanner + `
  <div class="report-summary">
    <h3>🛒 Total Shopping List — ${beds.length} Bed${beds.length > 1 ? 's' : ''}</h3>
    <div class="summary-grid">
      <div class="summary-stat"><div class="val">${bins.length}</div><div class="lbl">lumber boards</div></div>
      <div class="summary-stat"><div class="val">${postsNeeded}</div><div class="lbl">4×4 posts</div></div>
      <div class="summary-stat"><div class="val">${Math.ceil(totalSoilCuFt / 2)}</div><div class="lbl">soil bags (2 cu ft)</div></div>
      <div class="summary-stat"><div class="val">${totalPlantCount || '—'}</div><div class="lbl">plants / seeds</div></div>
      <div class="summary-stat"><div class="val">$${grandTotal}</div><div class="lbl">Est. materials total</div></div>
    </div>
  </div>

  ${reuseNote}

  <div class="report-bed" style="margin-bottom:20px">
    <div class="report-bed-header">
      <h3>🪵 Lumber — Optimized Cut Plan</h3>
      <span>${bins.length} boards for all ${beds.length} beds</span>
    </div>
    <div class="report-bed-body">
      <p style="font-size:12px;color:#4a6b4b;margin-bottom:12px">
        Colored tags show which bed each cut serves. Pieces from different beds on the same board = shared purchase, less waste.
      </p>
      <table class="materials-table">
        <tr><th>Buy this board</th><th>Cut into these pieces</th><th>Leftover</th><th class="cost">Cost</th></tr>
        ${boardRows}
        <tr class="total-row">
          <td colspan="3"><strong>Lumber subtotal</strong></td>
          <td class="cost"><strong>$${lumberCost}</strong></td>
        </tr>
      </table>

      <details style="margin-top:14px">
        <summary style="cursor:pointer;font-size:13px;font-weight:600;color:#2d6a30;user-select:none;padding:6px 0">
          🛒 Store shopping list (totals by board size)
        </summary>
        <table class="materials-table" style="margin-top:8px">
          <tr><th>Board</th><th>Qty to buy</th><th class="cost">Unit cost</th><th class="cost">Subtotal</th></tr>
          ${(() => {
            const tally = {};
            bins.forEach(b => {
              const key = `${b.boardSize}×${b.boardLen}`;
              if (!tally[key]) tally[key] = { count: 0, cost: b.cost };
              tally[key].count++;
            });
            return Object.entries(tally)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, { count, cost }]) => `
              <tr>
                <td><strong>${key}</strong></td>
                <td>${count}</td>
                <td class="cost">$${cost}</td>
                <td class="cost"><strong>$${count * cost}</strong></td>
              </tr>`).join('');
          })()}
          <tr class="total-row">
            <td colspan="3"><strong>Lumber total</strong></td>
            <td class="cost"><strong>$${lumberCost}</strong></td>
          </tr>
        </table>
      </details>
    </div>
  </div>

  <div class="report-bed" style="margin-bottom:20px">
    <div class="report-bed-header"><h3>🔩 Hardware</h3></div>
    <div class="report-bed-body">
      <table class="materials-table">
        <tr><th>Item</th><th>Qty</th><th>Notes</th><th class="cost">Cost</th></tr>
        <tr>
          <td>4×4×8 Post ${amazonBadge('cedar 4x4 post raised garden bed')}</td><td>${postsNeeded}</td>
          <td>Each post → ${postsPerBuy} corner posts (${postLenIn} in). Covers ${postsNeeded * postsPerBuy} corners total.</td>
          <td class="cost">$${postCost}</td>
        </tr>
        <tr>
          <td>3 in Deck Screws ${amazonBadge('galvanized 3 inch deck screws')}</td><td>${screwBoxes} box${screwBoxes > 1 ? 'es' : ''}</td>
          <td>Galvanized, 1 lb (~100 screws). ~${totalRuns * 16} screws needed total.</td>
          <td class="cost">$${screwCost}</td>
        </tr>
        <tr class="total-row">
          <td colspan="3"><strong>Hardware subtotal</strong></td>
          <td class="cost"><strong>$${postCost + screwCost}</strong></td>
        </tr>
      </table>
    </div>
  </div>

  <div class="report-bed" style="margin-bottom:20px">
    <div class="report-bed-header">
      <h3>🌱 Soil</h3>
      <span>${totalSoilCuYd.toFixed(2)} yd³ total</span>
    </div>
    <div class="report-bed-body">
      <table class="materials-table" style="margin-bottom:8px">
        <tr><th>Bed</th><th>Volume needed</th><th>If buying bags</th></tr>
        ${soilRows}
        <tr class="total-row">
          <td><strong>Total</strong></td>
          <td><strong>${totalSoilCuFt.toFixed(1)} cu ft · ${totalSoilCuYd.toFixed(2)} yd³</strong></td>
          <td><strong>${Math.ceil(totalSoilCuFt / 2)} bags (2 cu ft each)</strong></td>
        </tr>
      </table>
      <p style="font-size:11px;color:#888">💡 Bulk delivery (≥1 yd³) is usually cheaper than bags. Ask your local nursery — typically $35–$60/yd³ delivered. ≈$${soilCost} estimated. ${amazonBadge('raised bed garden soil mix')}</p>
    </div>
  </div>

  <div class="report-bed" style="margin-bottom:20px">
    <div class="report-bed-header">
      <h3>🌱 Seeds &amp; Plants</h3>
      <span>${allPlants.length} plant type${allPlants.length !== 1 ? 's' : ''} across your garden</span>
    </div>
    <div class="report-bed-body">
      <table class="materials-table">
        <tr><th>Plant</th><th style="text-align:center">Count</th><th>Used in</th><th>Buy seeds / plants</th></tr>
        ${seedRows}
      </table>
      <p style="font-size:11px;color:#888;margin-top:10px">💡 Prices vary by variety. Check your local nursery for transplants or bulk seed packets.</p>
    </div>
  </div>

  <div class="report-summary">
    <h3>💰 Grand Total</h3>
    <div class="summary-grid">
      <div class="summary-stat"><div class="val">$${lumberCost}</div><div class="lbl">Lumber</div></div>
      <div class="summary-stat"><div class="val">$${postCost + screwCost}</div><div class="lbl">Hardware</div></div>
      <div class="summary-stat"><div class="val">$${soilCost}</div><div class="lbl">Soil</div></div>
    </div>
    <p style="text-align:center;font-size:20px;font-weight:800;color:#2d6a30;margin-top:14px">~$${grandTotal} total</p>
    <p style="text-align:center;font-size:11px;color:#888">Approximate Home Depot / Lowe's prices. Soil cost varies by source.</p>
  </div>`;
}
