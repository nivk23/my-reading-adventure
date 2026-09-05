import { storage } from './storage.js';

const KEY = 'session_history';
const MAX_SESSIONS = 30;

export const sessionHistory = {
  log(type, id, correct) {
    try {
      const now = Date.now();
      const today = new Date().toDateString();
      const history = storage.get(KEY) || [];
      const todayIdx = history.findIndex(s => s.date === today);
      if (todayIdx >= 0) {
        history[todayIdx].activities.push({ type, id, correct, ts: now });
      } else {
        history.unshift({ date: today, activities: [{ type, id, correct, ts: now }] });
        if (history.length > MAX_SESSIONS) history.pop();
      }
      storage.set(KEY, history);
    } catch {}
  },

  getHistory() {
    return storage.get(KEY) || [];
  },

  getTodayStats() {
    const today = new Date().toDateString();
    const history = storage.get(KEY) || [];
    const todaySession = history.find(s => s.date === today);
    if (!todaySession) return { total: 0, correct: 0, types: {} };
    const acts = todaySession.activities;
    const correct = acts.filter(a => a.correct).length;
    const types = {};
    acts.forEach(a => { types[a.type] = (types[a.type] || 0) + 1; });
    return { total: acts.length, correct, types };
  },
};
