const KEY = 'machigai_note';

export function loadWrongQuestions() {
  try {
    const json = localStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export function saveWrongQuestions(questions) {
  try {
    const existing = loadWrongQuestions();
    const map = {};
    for (const q of existing) map[q.display] = q;
    for (const q of questions) map[q.display] = q;
    localStorage.setItem(KEY, JSON.stringify(Object.values(map)));
  } catch {}
}

export function clearWrongQuestions() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
