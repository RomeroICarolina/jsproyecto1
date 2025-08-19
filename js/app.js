import { Turnero } from "./model.js";
import { Storage } from "./storage.js";
import {
  $, $$, getFormData, setFormData, validate, showErrors, clearErrors,
  renderTable, renderStats, toast, confirmDialog
} from "./ui.js";

const form = $("#form");
const tbody = $("#tbody");
const stats = $("#stats");

const q = $("#q");
const filtro = $("#filtro-tratamiento");
const orden = $("#orden");
const btnCancelar = $("#btn-cancelar");

let turnero = new Turnero(await Storage.seedIfEmpty());

// Estado de UI
function currentQuery() {
  const [sortBy, dir] = orden.value.split("_");
  return {
    text: q.value,
    tratamiento: filtro.value,
    sortBy, dir
  };
}

function render() {
  const list = turnero.query(currentQuery());
  renderTable(tbody, list);
  renderStats(stats, turnero.stats(list));
}
render();

// Eventos del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = getFormData(form);
  const errs = validate(data);
  if (Object.keys(errs).length) {
    showErrors(form, errs);
    return;
  }
  clearErrors(form);

  if (data.id) {
    // update
    turnero.update(data.id, data);
    toast("Turno actualizado", "ok");
  } else {
    // add
    turnero.add(data);
    toast("Turno agregado", "ok");
  }
  Storage.save(turnero.items);
  setFormData(form, null);
  form.reset();
  render();
});

btnCancelar.addEventListener("click", () => {
  setFormData(form, null);
  form.reset();
  clearErrors(form);
  toast("Edición cancelada", "warn");
});

// Filtros y orden
[q, filtro, orden].forEach(el => el.addEventListener("input", render));

// Delegación de eventos en la tabla
tbody.addEventListener("click", async (e) => {
  const editId = e.target?.dataset?.edit;
  const delId = e.target?.dataset?.del;

  if (editId) {
    const t = turnero.items.find(x => x.id === editId);
    if (!t) return;
    setFormData(form, t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (delId) {
    const ok = await confirmDialog({
      title: "Eliminar turno",
      message: "Esta acción no se puede deshacer. ¿Eliminar?"
    });
    if (ok) {
      turnero.remove(delId);
      Storage.save(turnero.items);
      render();
      toast("Turno eliminado", "err");
    }
  }
});
