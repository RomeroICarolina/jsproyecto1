// Persistencia en localStorage + seed opcional desde /data/seed.json

const KEY = "entrega2_turnos";

export const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },
  save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
  },
  async seedIfEmpty() {
    const current = this.load();
    if (current.length) return current;
    try {
      const res = await fetch("../data/seed.json");
      if (!res.ok) throw new Error("no seed");
      const seed = await res.json();
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    } catch {
      // Fallback sin fetch (si abren con file://)
      const fallback = [];
      localStorage.setItem(KEY, JSON.stringify(fallback));
      return fallback;
    }
  }
};
