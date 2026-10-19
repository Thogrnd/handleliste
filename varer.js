// Kategorier, vanlige varer og mengder.

export const CATEGORIES = [
  'Frukt og grønt', 'Brød og bakst', 'Meieri og egg', 'Kjøtt og fisk', 'Pålegg',
  'Tørrvarer', 'Hermetikk og sauser', 'Frysevarer', 'Drikke', 'Snacks og godteri',
  'Husholdning', 'Hygiene', 'Baby og barn', 'Dyr', 'Annet'
];

const WORDS = {
  'Frukt og grønt': 'eple epler banan bananer appelsin appelsiner klementin klementiner pære pærer druer drue sitron sitroner lime avokado mango ananas kiwi melon vannmelon jordbær bringebær blåbær bær tomat tomater cherrytomater agurk paprika salat isbergsalat ruccola spinat brokkoli blomkål gulrot gulrøtter løk rødløk vårløk hvitløk purre potet poteter søtpotet squash aubergine sopp champignon mais selleri ingefær chili urter basilikum persille koriander dill kål rosenkål rødbeter reddik asparges erter bønner grønnsaker frukt',
  'Brød og bakst': 'brød grovbrød loff rundstykker rundstykke baguette ciabatta lomper lompe tortilla tortillas wraps pitabrød pita knekkebrød flatbrød boller bolle kanelbolle croissant pølsebrød hamburgerbrød lefse lefser kake kaker vafler',
  'Meieri og egg': 'melk lettmelk helmelk skummet ekstra lett havremelk sjokolademelk egg smør margarin meierismør ost norvegia jarlsberg gulost brunost geitost hvitost revet mozzarella parmesan fetaost cottage cheese kremost philadelphia rømme lettrømme crème fraiche creme fløte matfløte kremfløte yoghurt yoghurt skyr kesam kefir biola smoothie',
  'Kjøtt og fisk': 'kylling kyllingfilet kyllinglår kjøttdeig karbonadedeig deig bacon pølser pølse wienerpølser grillpølser kjøtt svinekjøtt svinekoteletter koteletter biff entrecote indrefilet lam lammekjøtt kalkun skinke ribbe medisterkaker kjøttkaker laks laksefilet torsk fisk fiskepinner fiskekaker fiskeboller reker scampi sei ørret tunfisk makrell',
  'Pålegg': 'pålegg leverpostei postei servelat salami kokt skinke kalkunpålegg makrell i tomat kaviar majones syltetøy jordbærsyltetøy nugatti nutella peanøttsmør honning prim prior sjokoladepålegg agurksalat italiensk salat',
  'Tørrvarer': 'mel hvetemel sammalt sukker melis brunt sukker salt pepper krydder tacokrydder kanel bakepulver gjær natron vaniljesukker havregryn müsli musli granola cornflakes frokostblanding ris pasta spagetti makaroni nudler couscous bulgur quinoa linser kakao rosiner nøtter mandler frø solsikkekjerner chiafrø kaffe te buljong olje olivenolje rapsolje eddik tacoskjell',
  'Hermetikk og sauser': 'hermetikk hermetiske tomater tomatpuré tomatpure kokosmelk mais bønner kikerter tacosaus salsa ketchup sennep dressing pesto soyasaus sweet chili saus pastasaus brun saus sjysaus bearnaise',
  'Frysevarer': 'frossen frosne frysepizza pizza fiskegrateng pommes frites pommes is iskrem frosne bær frosne grønnsaker wok blanding vårruller nuggets',
  'Drikke': 'juice appelsinjuice eplejuice saft brus cola pepsi solo farris vann mineralvann kullsyre øl alkoholfri energidrikk iste',
  'Snacks og godteri': 'chips potetgull nøtter popcorn sjokolade melkesjokolade godteri smågodt kjeks kaker cookies saltstenger snacks tyggegummi pastiller lakris',
  'Husholdning': 'dopapir toalettpapir tørkerull kjøkkenpapir oppvask oppvaskmiddel maskinoppvask oppvasktabletter vaskemiddel tøyvask skyllemiddel såpe grønnsåpe klut kluter svamp søppelposer bæreposer plastfolie aluminiumsfolie bakepapir fryseposer lyspærer batterier stearinlys servietter',
  'Hygiene': 'tannkrem tannbørste sjampo balsam dusjsåpe dusjsåpe deodorant deo håndsåpe bomullspads q-tips plaster solkrem barberhøvel barberskum bind tamponger',
  'Baby og barn': 'bleier våtservietter barnemat grøt morsmelkerstatning smokk',
  'Dyr': 'kattemat hundemat kattesand dyrefôr godbiter'
};

const LOOKUP = [];
for (const [cat, list] of Object.entries(WORDS)) {
  for (const w of list.split(' ')) if (w) LOOKUP.push([w, cat]);
}
LOOKUP.sort((a, b) => b[0].length - a[0].length);

export const norm = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

export function categorize(name) {
  const n = norm(name);
  if (!n) return 'Annet';
  const words = n.split(/[\s,-]+/);
  for (const [w, cat] of LOOKUP) if (words.includes(w)) return cat;
  for (const [w, cat] of LOOKUP) if (w.length >= 4 && (n.startsWith(w) || n.endsWith(w))) return cat;
  return 'Annet';
}

export const COMMON = [
  'Melk', 'Lettmelk', 'Egg', 'Brød', 'Grovbrød', 'Smør', 'Norvegia', 'Brunost', 'Rømme', 'Yoghurt',
  'Bananer', 'Epler', 'Appelsiner', 'Druer', 'Tomater', 'Agurk', 'Paprika', 'Salat', 'Løk', 'Hvitløk',
  'Poteter', 'Gulrøtter', 'Brokkoli', 'Avokado', 'Kyllingfilet', 'Kjøttdeig', 'Bacon', 'Pølser', 'Laks',
  'Fiskekaker', 'Pålegg', 'Leverpostei', 'Skinke', 'Syltetøy', 'Kaffe', 'Te', 'Juice', 'Pasta', 'Ris',
  'Havregryn', 'Mel', 'Sukker', 'Tacokrydder', 'Tacosaus', 'Tortillas', 'Hermetiske tomater', 'Pizza',
  'Is', 'Chips', 'Sjokolade', 'Brus', 'Toalettpapir', 'Tørkerull', 'Oppvaskmiddel', 'Vaskemiddel',
  'Tannkrem', 'Sjampo', 'Søppelposer', 'Bleier', 'Kattemat'
];

export const UNITS = ['stk', 'liter', 'kg', 'g', 'pk', 'pose', 'boks', 'flaske'];
const UNIT_ALIASES = { l: 'liter', ltr: 'liter', liter: 'liter', stk: 'stk', st: 'stk', pk: 'pk', pakke: 'pk', pakker: 'pk', kg: 'kg', g: 'g', gram: 'g', pose: 'pose', poser: 'pose', boks: 'boks', bokser: 'boks', flaske: 'flaske', flasker: 'flaske' };
const UNIT_RE = '(stk|st|pk|pakke|pakker|ltr|liter|l|kg|gram|g|poser|pose|bokser|boks|flasker|flaske)';
const NUM_RE = '(\\d+\\s+\\d\\/\\d|\\d+\\/\\d+|\\d*½|\\d+(?:[.,]\\d+)?)';
export const normUnit = (u) => UNIT_ALIASES[String(u || '').toLowerCase()] || '';

// Tallene i tallvelgeren
export const STEPS = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Standardenhet for vanlige varer (alt annet blir «stk»)
const UNIT_WORDS = {
  liter: 'melk lettmelk helmelk skummetmelk ekstralettmelk havremelk sjokolademelk kefir juice appelsinjuice eplejuice brus cola pepsi solo farris vann mineralvann saft iste',
  kg: 'poteter potet søtpotet gulrøtter gulrot epler appelsiner klementiner pærer løk rødløk kålrot',
  pk: 'kjøttdeig karbonadedeig bacon pølser wienerpølser grillpølser kaffe kyllingfilet fiskekaker fiskeboller fiskepinner pålegg skinke salami servelat tortillas tortilla lomper rundstykker knekkebrød pasta spagetti makaroni ris havregryn toalettpapir dopapir tørkerull kjøkkenpapir bleier våtservietter',
  boks: 'hermetiske tomatpuré kokosmelk tunfisk kikerter',
  pose: 'chips potetgull smågodt'
};
const UNIT_LOOKUP = [];
for (const [u, list] of Object.entries(UNIT_WORDS)) for (const w of list.split(' ')) if (w) UNIT_LOOKUP.push([w, u]);
UNIT_LOOKUP.sort((a, b) => b[0].length - a[0].length);

export function dictUnit(name) {
  const n = norm(name); if (!n) return 'stk';
  const words = n.split(/[\s,-]+/);
  for (const [w, u] of UNIT_LOOKUP) if (words.includes(w)) return u;
  for (const [w, u] of UNIT_LOOKUP) if (w.length >= 4 && words.some((x) => x.endsWith(w))) return u;
  return 'stk';
}

export function parseNum(s) {
  const t = String(s ?? '').trim().replace(',', '.');
  if (!t) return NaN;
  let m;
  if ((m = t.match(/^(\d+)\s+(\d)\/(\d)$/))) return +m[1] + (+m[2] / +m[3]);
  if ((m = t.match(/^(\d+)\/(\d+)$/))) return +m[1] / +m[2];
  if ((m = t.match(/^(\d*)½$/))) return (+m[1] || 0) + 0.5;
  return /^\d+(\.\d+)?$/.test(t) ? parseFloat(t) : NaN;
}

export function parseQty(q) {
  const m = String(q || '').trim().toLowerCase().match(new RegExp('^' + NUM_RE + '\\s*([a-zæøå]*)$'));
  if (!m) return null;
  const n = parseNum(m[1]);
  if (!isFinite(n)) return null;
  return { n, unit: UNIT_ALIASES[m[2] || 'stk'] || m[2] };
}

export function fmtNum(n) {
  const whole = Math.floor(n), frac = n - whole;
  if (Math.abs(frac - 0.5) < 1e-9) return (whole ? whole : '') + '½';
  return String(Math.round(n * 100) / 100).replace('.', ',');
}
export const fmtQty = ({ n, unit }) => `${fmtNum(n)} ${unit}`;

export function mergeQty(a, b) {
  const pa = a ? parseQty(a) : { n: 1, unit: 'stk' };
  const pb = b ? parseQty(b) : { n: 1, unit: 'stk' };
  if (pa && pb && pa.unit === pb.unit) return fmtQty({ n: pa.n + pb.n, unit: pa.unit });
  return `${a || '1 stk'} + ${b || '1 stk'}`;
}

// «2 melk», «melk 2», «2 liter melk», «melk 2 liter» → navn og mengde.
// unitFor(navn) gir standardenheten når enheten ikke er skrevet.
export function splitInput(text, unitFor = dictUnit) {
  const t = String(text || '').trim().replace(/\s+/g, ' ');
  const make = (name, num, u) => {
    const n = parseNum(num);
    name = cap(name.trim());
    if (!isFinite(n) || n <= 0 || !name) return null;
    return { name, qty: fmtQty({ n, unit: normUnit(u) || unitFor(name) }) };
  };
  let m = t.match(new RegExp('^' + NUM_RE + '(?:\\s*' + UNIT_RE + '\\.?)?\\s+(.*\\D.*)$', 'i'));
  if (m) { const r = make(m[3], m[1], m[2]); if (r) return r; }
  m = t.match(new RegExp('^(.*?\\D.*?)\\s+' + NUM_RE + '\\s*' + UNIT_RE + '?\\.?$', 'i'));
  if (m) { const r = make(m[1], m[2], m[3]); if (r) return r; }
  return { name: cap(t), qty: '' };
}

export const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
