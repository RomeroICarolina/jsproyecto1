// Utilidades de UI: selección, render, validación, toasts, modal

export const $ = (sel, ctx=document) => ctx.querySelector(sel);
export const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

export function clearErrors(form) {
  $$(".error", form).forEach(el => el.textContent = "");
}

export function showErrors(form, errs) {
  clearErrors(form);
  Object.entries(errs).forEach(([field, msg]) => {
    const el = $(`.error[data-err-for="${field}"]`, form);
    if (el) el.textContent = msg;
  });
}

export function getFormData(form) {
  return {
    id: $("#id", form).value,
    nombre: $("#nombre", form).value,
    email: $("#email", form).value,
    fecha: $("#fecha", form).value,
    tratamiento: $("#tratamiento", form).value,
    notas: $("#notas", form).value
  };
}

export function setFormData(form, t=null) {
  $("#id", form).value = t?.id || "";
  $("#nombre", form).value = t?.nombre || "";
  $("#email", form).value = t?.email || "";
  $("#fecha", form).value = t?.fecha || "";
  $("#tratamiento", form).value = t?.tratamiento || "";
  $("#notas", form).value = t?.notas || "";
}

export function validate(data) {
  const e = {};
  if (!data.nombre.trim()) e.nombre = "El nombre es obligatorio.";
  if (!data.email.trim() || !/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Email inválido.";
  if (!data.fecha) e.fecha = "La fecha es obligatoria.";
  if (!data.tratamiento) e.tratamiento = "Elegí un tratamiento.";
  return e;
}

export function renderTable(tbody, list) {
  tbody.innerHTML = list.map(t => `
    <tr>
      <td><span class="badge">${t.fecha}</span></td>
      <td>${escapeHTML(t.nombre)}</td>
      <td>${escapeHTML(t.tratamiento)}</td>
      <td>${escapeHTML(t.email)}</td>
      <td>${escapeHTML(t.notas || "")}</td>
      <td>
        <div class="row-actions">
          <button data-edit="${t.id}">Editar</button>
          <button class="del" data-del="${t.id}">Borrar</button>
        </div>
      </td>
    </tr>
  `).join("");
}

export function renderStats(el, { total, porTrat }) {
  const resumen = Object.entries(porTrat).map(([k, v]) => `${k}: ${v}`).join(" · ");
  el.textContent = total ? `Mostrando ${total} turno(s). ${resumen ? " | " + resumen : ""}` : "Sin resultados.";
}

export function toast(msg, kind="ok") {
  const el = $("#toast");
  el.textContent = msg;
  el.className = `toast show ${kind}`;
  setTimeout(() => { el.className = "toast"; }, 1800);
}

export function confirmDialog({ title="Confirmar", message="¿Seguro?" }) {
  const modal = $("#modal");
  $("#modal-title").textContent = title;
  $("#modal-msg").textContent = message;
  return new Promise(res => {
    modal.addEventListener("close", () => res(modal.returnValue === "ok"), { once:true });
    modal.showModal();
  });
}

function escapeHTML(str){
  return String(str).replace(/[&<>"']/g, s => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[s]));
}
