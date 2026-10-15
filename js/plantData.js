// ─── Plant Data ───────────────────────────────────────────────────────────────
const PLANT_DATA = {
  '🍅 Tomatoes':     { emoji:'🍅', sqft:4,    spacing:24, depthIn:12, sun:'Full',      water:'High',   trellis:false, notes:'Stake or cage. Deep roots — 12″+ soil.',         companions:['🌿 Basil','🧅 Onions'],     avoid:['🥦 Broccoli'] },
  '🌶️ Hot Peppers': { emoji:'🌶️', sqft:1,    spacing:18, depthIn:8,  sun:'Full',      water:'Medium', trellis:false, notes:'Loves heat. Cage to support heavy fruits.',        companions:['🌿 Basil','🌿 Chives','🌼 Marigolds','🌿 Oregano','🥕 Carrots'], avoid:['🥦 Broccoli','🫛 Green Beans'] },
  '🥒 Cucumbers':   { emoji:'🥒', sqft:2,    spacing:12, depthIn:8,  sun:'Full',      water:'High',   trellis:true,  notes:'Trellis required. Keep soil evenly moist.',        companions:['🌿 Dill','🧅 Onions','🌼 Marigolds','🌸 Nasturtiums','🌻 Sunflowers','🌱 Radishes'], avoid:['🌿 Rosemary','🌿 Sage'] },
  '🥕 Carrots':     { emoji:'🥕', sqft:1,    spacing:3,  depthIn:12, sun:'Full',      water:'Medium', trellis:false, notes:'Needs 12″+ loose soil. Thin seedlings to 3″.',     companions:['🌿 Rosemary','🧅 Onions'], avoid:['🥦 Broccoli'] },
  '🎃 Squash':      { emoji:'🎃', sqft:9,    spacing:36, depthIn:8,  sun:'Full',      water:'High',   trellis:false, notes:'Sprawling — place at bed edge to drape over.',     companions:['🌿 Dill'],                 avoid:[] },
  '🥬 Lettuce':     { emoji:'🥬', sqft:0.25, spacing:6,  depthIn:6,  sun:'Full/Part', water:'Medium', trellis:false, notes:'4 per sq ft. Harvest outer leaves first.',         companions:['🥕 Carrots','🌿 Mint'],    avoid:[] },
  '🌱 Spinach':     { emoji:'🌱', sqft:0.11, spacing:3,  depthIn:6,  sun:'Full/Part', water:'Medium', trellis:false, notes:'9 per sq ft. Great for cool seasons.',             companions:[],                          avoid:[] },
  '🫛 Green Beans': { emoji:'🫛', sqft:1,    spacing:6,  depthIn:8,  sun:'Full',      water:'Medium', trellis:false, notes:'Bush variety needs no support.',                   companions:['🥕 Carrots'],              avoid:['🧅 Onions'] },
  '🧅 Onions':      { emoji:'🧅', sqft:0.25, spacing:4,  depthIn:8,  sun:'Full',      water:'Low',    trellis:false, notes:'16 per sq ft. Plant sets 1″ deep.',                companions:['🍅 Tomatoes','🌶️ Hot Peppers'], avoid:['🫛 Green Beans'] },
  '🧄 Garlic':      { emoji:'🧄', sqft:0.25, spacing:6,  depthIn:8,  sun:'Full',      water:'Low',    trellis:false, notes:'Plant cloves 2″ deep in fall; harvest in summer. Repels aphids and pests.', companions:['🍅 Tomatoes','🌹 Roses','🥕 Carrots'], avoid:['🫛 Green Beans','🌿 Sage'] },
  '🥦 Broccoli':    { emoji:'🥦', sqft:1,    spacing:12, depthIn:8,  sun:'Full',      water:'Medium', trellis:false, notes:'1 plant per sq ft. Watch for caterpillars.',       companions:[],                          avoid:['🍅 Tomatoes','🌶️ Hot Peppers'] },
  '🌿 Basil':       { emoji:'🌿', sqft:1,    spacing:12, depthIn:6,  sun:'Full',      water:'Medium', trellis:false, notes:'Pinch flowers to extend harvest.',                  companions:['🍅 Tomatoes','🌶️ Hot Peppers'], avoid:['🌿 Dill'] },
  '🌿 Parsley':     { emoji:'🌿', sqft:0.25, spacing:6,  depthIn:6,  sun:'Full/Part', water:'Medium', trellis:false, notes:'4 per sq ft. Biennial — replant each year.',       companions:['🍅 Tomatoes'],             avoid:[] },
  '🌿 Cilantro':    { emoji:'🌿', sqft:0.25, spacing:6,  depthIn:6,  sun:'Full/Part', water:'Medium', trellis:false, notes:'Bolts in heat. Succession-plant every 3 weeks.',   companions:[],                          avoid:[] },
  '🌿 Thyme':       { emoji:'🌿', sqft:1,    spacing:12, depthIn:6,  sun:'Full',      water:'Low',    trellis:false, notes:'Drought-tolerant once established.',                companions:['🍓 Strawberries','🍅 Tomatoes'], avoid:[] },
  '🌿 Oregano':     { emoji:'🌿', sqft:1,    spacing:12, depthIn:6,  sun:'Full',      water:'Low',    trellis:false, notes:'Spreads aggressively. Consider a sunken pot.',     companions:['🌶️ Hot Peppers'],          avoid:[] },
  '🌿 Mint':        { emoji:'🌿', sqft:1,    spacing:12, depthIn:6,  sun:'Full/Part', water:'Medium', trellis:false, notes:'Very invasive — sink a buried pot into the bed.',   companions:['🥬 Lettuce'],              avoid:[] },
  '🌿 Rosemary':    { emoji:'🌿', sqft:4,    spacing:24, depthIn:8,  sun:'Full',      water:'Low',    trellis:false, notes:'Perennial. Great corner or border plant.',          companions:['🥕 Carrots'],             avoid:['🥒 Cucumbers'] },
  '🌿 Chives':      { emoji:'🌿', sqft:0.25, spacing:6,  depthIn:6,  sun:'Full',      water:'Low',    trellis:false, notes:'Repels aphids & spider mites. Divide clumps every 3 years.', companions:['🌶️ Hot Peppers','🍅 Tomatoes','🥕 Carrots'], avoid:[] },
  '🌿 Dill':        { emoji:'🌿', sqft:1,    spacing:6,  depthIn:8,  sun:'Full',      water:'Low',    trellis:false, notes:"Tall — plant at north end so it doesn't shade.",    companions:['🥒 Cucumbers','🎃 Squash'],avoid:['🌿 Basil'] },
  '🌼 Marigolds':   { emoji:'🌼', sqft:0.25, spacing:6,  depthIn:6,  sun:'Full',      water:'Low',    trellis:false, notes:'Plant at bed corners/edges. Deters nematodes, aphids & whiteflies.', companions:['🌶️ Hot Peppers','🍅 Tomatoes','🥕 Carrots','🥒 Cucumbers'], avoid:[] },
  '🌸 Nasturtiums': { emoji:'🌸', sqft:1,    spacing:12, depthIn:6,  sun:'Full',      water:'Low',    trellis:false, notes:'Trap crop — aphids prefer them over cucumbers. Flowers & leaves are edible.', companions:['🥒 Cucumbers','🎃 Squash','🍅 Tomatoes'], avoid:[] },
  '🌻 Sunflowers':  { emoji:'🌻', sqft:1,    spacing:12, depthIn:8,  sun:'Full',      water:'Low',    trellis:false, notes:'Living trellis for cucumbers. Plant on north side to avoid shading other crops.', companions:['🥒 Cucumbers'], avoid:[] },
  '🌱 Radishes':    { emoji:'🌱', sqft:0.11, spacing:3,  depthIn:6,  sun:'Full',      water:'Medium', trellis:false, notes:'Fast (25 days). Plant at base of cucumbers to deter beetles. Pull before they crowd.', companions:['🥒 Cucumbers','🥕 Carrots','🌸 Nasturtiums'], avoid:['🥦 Broccoli'] },
  '🍓 Strawberries':{ emoji:'🍓', sqft:1,    spacing:12, depthIn:6,  sun:'Full',      water:'Medium', trellis:false, notes:'Send runners yearly. Refresh plants every 3 years.',companions:['🌿 Thyme'],               avoid:['🥦 Broccoli'] },
  '🍈 Melon':       { emoji:'🍈', sqft:9,    spacing:36, depthIn:8,  sun:'Full',      water:'High',   trellis:false, notes:'Needs full sun and a long warm season.',            companions:['🌿 Dill'],                avoid:[] },

  // ── Additional Vegetables ─────────────────────────────────────────────────
  '🫑 Bell Peppers':  { emoji:'🫑', sqft:1,    spacing:18, depthIn:8,  sun:'Full',      water:'Medium', trellis:false, notes:'Needs warm soil. Stake when heavy with fruit.',         companions:['🌿 Basil','🌿 Chives','🌼 Marigolds'], avoid:['🥦 Broccoli'] },
  '🍆 Eggplant':      { emoji:'🍆', sqft:2,    spacing:18, depthIn:8,  sun:'Full',      water:'Medium', trellis:false, notes:'Loves heat. Stake tall varieties. Repels aphids with foil mulch.', companions:['🌿 Basil','🌼 Marigolds'], avoid:[] },
  '🍉 Watermelon':    { emoji:'🍉', sqft:12,   spacing:48, depthIn:8,  sun:'Full',      water:'High',   trellis:false, notes:'Very large vines — give plenty of space at bed edges.',  companions:['🌿 Dill'],                avoid:[] },
  '🌽 Corn':          { emoji:'🌽', sqft:1,    spacing:12, depthIn:8,  sun:'Full',      water:'High',   trellis:false, notes:'Plant in blocks (4+ rows) for wind pollination.',        companions:['🎃 Squash','🫛 Green Beans'], avoid:[] },
  '🥔 Potatoes':      { emoji:'🥔', sqft:1,    spacing:12, depthIn:12, sun:'Full',      water:'Medium', trellis:false, notes:'Hill up soil as plants grow. Harvest after tops die back.', companions:['🌿 Basil','🧅 Onions'],    avoid:['🍅 Tomatoes'] },
  '🍠 Sweet Potatoes':{ emoji:'🍠', sqft:4,    spacing:18, depthIn:8,  sun:'Full',      water:'Low',    trellis:false, notes:'Sprawling vines. Very drought-tolerant once established.', companions:[],                          avoid:[] },
  '🫘 Edamame':       { emoji:'🫘', sqft:0.25, spacing:6,  depthIn:6,  sun:'Full',      water:'Medium', trellis:false, notes:'Harvest when pods are plump and bright green.',          companions:[],                          avoid:['🧅 Onions'] },
  '🌱 Vegetable':     { emoji:'🌱', sqft:1,    spacing:12, depthIn:8,  sun:'Full',      water:'Medium', trellis:false, notes:'Generic vegetable — update spacing and depth for your variety.', companions:[],                   avoid:[] },

  // ── Additional Herbs ──────────────────────────────────────────────────────
  '🌿 Sage':          { emoji:'🌿', sqft:1,    spacing:18, depthIn:6,  sun:'Full',      water:'Low',    trellis:false, notes:'Woody perennial. Trim after blooming to keep bushy. Repels cabbage moths.', companions:['🥦 Broccoli','🥕 Carrots'], avoid:['🥒 Cucumbers','🧄 Garlic'] },
  '🌿 Herb':          { emoji:'🌿', sqft:1,    spacing:12, depthIn:6,  sun:'Full',      water:'Medium', trellis:false, notes:'Generic herb — update spacing and depth for your variety.', companions:[],                        avoid:[] },

  // ── Additional Flowers ────────────────────────────────────────────────────
  '🌹 Roses':         { emoji:'🌹', sqft:4,    spacing:24, depthIn:12, sun:'Full',      water:'Medium', trellis:false, notes:'Good air circulation prevents disease. Prune in early spring.', companions:['🧄 Garlic','🌿 Chives','🌼 Marigolds'], avoid:[] },
  '🌷 Tulips':        { emoji:'🌷', sqft:0.25, spacing:6,  depthIn:8,  sun:'Full',      water:'Low',    trellis:false, notes:'Plant bulbs in fall, 6-8" deep. Lift and store after foliage dies back.', companions:[],       avoid:[] },
  '🌺 Hibiscus':      { emoji:'🌺', sqft:4,    spacing:24, depthIn:8,  sun:'Full',      water:'Medium', trellis:false, notes:'Tropical types need warm temps. Hardy types can overwinter in zones 5+.', companions:[],       avoid:[] },
  '🪷 Lavender':      { emoji:'🪷', sqft:1,    spacing:18, depthIn:8,  sun:'Full',      water:'Low',    trellis:false, notes:'Drought-tolerant once established. Excellent pollinator attractor.',    companions:['🥦 Broccoli','🌹 Roses'], avoid:[] },
  '💐 Wildflowers':   { emoji:'💐', sqft:1,    spacing:6,  depthIn:4,  sun:'Full/Part', water:'Low',    trellis:false, notes:'Direct-sow mix. Attracts pollinators and beneficial insects.',           companions:['🍅 Tomatoes','🥒 Cucumbers'], avoid:[] },

  // ── Additional Fruit ──────────────────────────────────────────────────────
  '🫐 Blueberries':   { emoji:'🫐', sqft:9,    spacing:48, depthIn:12, sun:'Full',      water:'Medium', trellis:false, notes:'Need acidic soil (pH 4.5-5.5). Plant 2+ varieties to cross-pollinate.', companions:[],       avoid:[] },
  '🍇 Grapes':        { emoji:'🍇', sqft:9,    spacing:72, depthIn:12, sun:'Full',      water:'Low',    trellis:true,  notes:'Needs sturdy trellis or arbor. Prune heavily each winter for best fruit.', companions:[],      avoid:[] },
  '🍎 Apple':         { emoji:'🍎', sqft:64,   spacing:120,depthIn:18, sun:'Full',      water:'Medium', trellis:false, notes:'Plant 2+ varieties for pollination. Dwarf trees fit smaller gardens.',  companions:[],        avoid:[] },
  '🍐 Pear':          { emoji:'🍐', sqft:64,   spacing:120,depthIn:18, sun:'Full',      water:'Medium', trellis:false, notes:'Plant 2 varieties for cross-pollination. Harvest before fully ripe.',   companions:[],        avoid:[] },
  '🍑 Peach':         { emoji:'🍑', sqft:64,   spacing:120,depthIn:18, sun:'Full',      water:'Medium', trellis:false, notes:'Self-fertile but yields more with cross-pollination. Thin fruits early.', companions:[],      avoid:[] },
  '🍒 Cherries':      { emoji:'🍒', sqft:64,   spacing:120,depthIn:18, sun:'Full',      water:'Medium', trellis:false, notes:'Sweet cherries need a pollinator variety. Sour cherries are self-fertile.', companions:[],    avoid:[] },
  '🍋 Lemon':         { emoji:'🍋', sqft:16,   spacing:72, depthIn:12, sun:'Full',      water:'Medium', trellis:false, notes:'Frost-sensitive. Grow in containers in cold climates; bring indoors in winter.', companions:[],avoid:[] },
  '🥝 Kiwi':          { emoji:'🥝', sqft:64,   spacing:120,depthIn:12, sun:'Full',      water:'Medium', trellis:true,  notes:'Vigorous climber — needs sturdy trellis. Plant 1 male per 6-8 female plants.', companions:[],  avoid:[] },

  // ── Cannabis ──────────────────────────────────────────────────────────────
  '🍃 Cannabis (Autoflower)':  { emoji:'🍃', sqft:4,  spacing:24, depthIn:18, sun:'Full', water:'Medium', trellis:false, notes:'Compact autoflowering variety. Finishes in ~10 weeks regardless of light cycle. Great for small spaces or first-time growers. Rich, well-draining soil.', companions:['🌼 Marigolds','🌿 Basil','🌸 Nasturtiums'], avoid:['🍅 Tomatoes'] },
  '🍃 Cannabis (Photoperiod)': { emoji:'🍃', sqft:9,  spacing:48, depthIn:18, sun:'Full', water:'High',   trellis:false, notes:'Full-size outdoor plant — can reach 6+ ft and needs lots of space. Flowers triggered by shorter days in late summer. Plant after last frost. Rich, well-draining soil.', companions:['🌼 Marigolds','🌿 Basil','🌸 Nasturtiums'], avoid:['🍅 Tomatoes'] },
};

// Shared plant <select> options HTML — used in right panel and organizer
const PLANT_OPTIONS_HTML = `
  <option value="">Add plant…</option>
  <optgroup label="Vegetables">
    <option>🍅 Tomatoes</option><option>🌶️ Hot Peppers</option><option>🫑 Bell Peppers</option>
    <option>🍆 Eggplant</option><option>🥒 Cucumbers</option><option>🎃 Squash</option>
    <option>🌽 Corn</option><option>🥕 Carrots</option><option>🥔 Potatoes</option>
    <option>🍠 Sweet Potatoes</option><option>🥬 Lettuce</option><option>🌱 Spinach</option>
    <option>🥦 Broccoli</option><option>🫛 Green Beans</option><option>🫘 Edamame</option>
    <option>🧅 Onions</option><option>🧄 Garlic</option><option>🌱 Radishes</option>
    <option>🌱 Vegetable</option>
  </optgroup>
  <optgroup label="Cannabis">
    <option>🍃 Cannabis (Autoflower)</option><option>🍃 Cannabis (Photoperiod)</option>
  </optgroup>
  <optgroup label="Herbs">
    <option>🌿 Basil</option><option>🌿 Chives</option><option>🌿 Parsley</option>
    <option>🌿 Cilantro</option><option>🌿 Thyme</option><option>🌿 Oregano</option>
    <option>🌿 Mint</option><option>🌿 Rosemary</option><option>🌿 Dill</option>
    <option>🌿 Sage</option><option>🌿 Herb</option>
  </optgroup>
  <optgroup label="Flowers">
    <option>🌼 Marigolds</option><option>🌸 Nasturtiums</option><option>🌻 Sunflowers</option>
    <option>🌹 Roses</option><option>🌷 Tulips</option><option>🌺 Hibiscus</option>
    <option>🪷 Lavender</option><option>💐 Wildflowers</option>
  </optgroup>
  <optgroup label="Fruit">
    <option>🍓 Strawberries</option><option>🫐 Blueberries</option><option>🍇 Grapes</option>
    <option>🍈 Melon</option><option>🍉 Watermelon</option><option>🍎 Apple</option>
    <option>🍐 Pear</option><option>🍑 Peach</option><option>🍒 Cherries</option>
    <option>🍋 Lemon</option><option>🥝 Kiwi</option>
  </optgroup>`;

// Reverse lookup: emoji character → sqft (used for grid migration)
const EMOJI_SQFT = {};
Object.values(PLANT_DATA).forEach(pd => { EMOJI_SQFT[pd.emoji] = pd.sqft; });
