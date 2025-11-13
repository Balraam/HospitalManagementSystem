const SEED_KEY = 'hospital_seed_initialized';
const DATA_KEY = 'hospital_data';

export function initSeedData(seed) {
  if (!localStorage.getItem(SEED_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(seed));
    localStorage.setItem(SEED_KEY, 'true');
  }
}

export function readData() {
  return JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
}

export function writeData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function getRawJson() {
  return localStorage.getItem(DATA_KEY) || '{}';
}

export function exportData(filename = 'hospital-data.json') {
  const json = getRawJson();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}