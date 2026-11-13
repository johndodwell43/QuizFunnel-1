// Remembers a visitor's own arch + tooth answers on their device, so quiz.klyrosdental.com/new
// can show "their" partial when they come back. Nothing here is sent anywhere.
// Only arch and tooth counts are kept (never the health/safety answers), for 30 days.

export const SAVED_CASE_KEY = 'klyros_case_v1';
export const SAVED_CASE_DAYS = 30;

const ARCHES = ['upper', 'lower', 'both'];
const COUNTS = ['1', '2', '3', '4', '5', '6+', 'most'];

function store() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function cleanTeeth(teeth = {}) {
  return {
    upper: COUNTS.includes(teeth.upper) ? teeth.upper : null,
    lower: COUNTS.includes(teeth.lower) ? teeth.lower : null
  };
}

// A case is complete when the arch is known and every arch in it has a tooth count.
export function isCompleteCase(c) {
  if (!c || !ARCHES.includes(c.arch)) return false;
  const need = c.arch === 'both' ? ['upper', 'lower'] : [c.arch];
  return need.every((a) => COUNTS.includes(c.teeth?.[a]));
}

export function parseSavedCase(raw, now = Date.now()) {
  if (!raw) return null;
  let c;
  try {
    c = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!c || typeof c.t !== 'number' || now - c.t > SAVED_CASE_DAYS * 864e5 || now < c.t - 864e5) return null;
  const out = { arch: c.arch, teeth: cleanTeeth(c.teeth) };
  return isCompleteCase(out) ? out : null;
}

export function loadSavedCase(storage = store(), now = Date.now()) {
  try {
    return storage ? parseSavedCase(storage.getItem(SAVED_CASE_KEY), now) : null;
  } catch {
    return null;
  }
}

export function saveCase(arch, teeth, storage = store(), now = Date.now()) {
  const c = { arch, teeth: cleanTeeth(teeth) };
  if (!storage || !isCompleteCase(c)) return false;
  // Keep only the arches that are part of the case.
  if (arch === 'upper') c.teeth.lower = null;
  if (arch === 'lower') c.teeth.upper = null;
  try {
    storage.setItem(SAVED_CASE_KEY, JSON.stringify({ ...c, t: now }));
    return true;
  } catch {
    return false;
  }
}
