const PREFIX = 'mra_';

export const storage = {
  get: (key) => {
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(val));
    } catch {}
  },
  remove: (key) => {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {}
  },
  clear: () => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch {}
  },
};
