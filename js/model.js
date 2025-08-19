// Clases y lógica de dominio

export class Turno {
  constructor({ id, nombre, email, fecha, tratamiento, notas }) {
    this.id = id || crypto.randomUUID?.() || String(Date.now());
    this.nombre = nombre.trim();
    this.email = email.trim().toLowerCase();
    this.fecha = fecha; // ISO yyyy-mm-dd
    this.tratamiento = tratamiento;
    this.notas = (notas || "").trim();
    this.createdAt = new Date().toISOString();
  }
}

export class Turnero {
  constructor(items = []) {
    this.items = items;
  }

  add(turnoData) {
    const turno = turnoData instanceof Turno ? turnoData : new Turno(turnoData);
    this.items.push(turno);
    return turno;
  }

  update(id, patch) {
    const i = this.items.findIndex(t => t.id === id);
    if (i === -1) return null;
    this.items[i] = { ...this.items[i], ...patch };
    return this.items[i];
  }

  remove(id) {
    const before = this.items.length;
    this.items = this.items.filter(t => t.id !== id);
    return this.items.length < before;
  }

  query({ text = "", tratamiento = "", sortBy = "fecha", dir = "asc" } = {}) {
    const q = text.trim().toLowerCase();
    let out = this.items.filter(t => {
      const matchQ = !q || t.nombre.toLowerCase().includes(q) || t.email.includes(q);
      const matchTr = !tratamiento || t.tratamiento === tratamiento;
      return matchQ && matchTr;
    });

    out.sort((a, b) => {
      let va, vb;
      if (sortBy === "fecha") { va = a.fecha; vb = b.fecha; }
      else { va = a.nombre.toLowerCase(); vb = b.nombre.toLowerCase(); }
      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ?  1 : -1;
      return 0;
    });
    return out;
  }

  stats(list) {
    const arr = list ?? this.items;
    const porTrat = arr.reduce((acc, t) => {
      acc[t.tratamiento] = (acc[t.tratamiento] || 0) + 1;
      return acc;
    }, {});
    return { total: arr.length, porTrat };
  }
}
