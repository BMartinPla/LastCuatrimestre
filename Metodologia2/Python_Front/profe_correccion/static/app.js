/* Mapa de Carrera: front para la API de main.py, sin dependencias.
 *
 * Todo lo que se muestra sale de la API. El progreso del alumno (materias
 * cursadas o aprobadas) se guarda solo en este navegador, con localStorage.
 * Si la base tiene correlatividades, el tablero las dibuja y el simulador de
 * progreso las respeta; si no tiene, esas partes lo avisan y se ocultan.
 */
(() => {
  "use strict";

  // ───────────────────────── utilidades ─────────────────────────
  const $ = (selector, raiz = document) => raiz.querySelector(selector);
  const $$ = (selector, raiz = document) => Array.from(raiz.querySelectorAll(selector));
  const SVG_NS = "http://www.w3.org/2000/svg";
  const ETIQUETAS_SVG = new Set(["svg", "g", "path", "circle", "rect", "line", "text", "title"]);
  const sinMovimiento = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Crea un elemento. Los textos van con textContent: los datos de la API no son HTML. */
  function h(etiqueta, props, ...hijos) {
    const el = ETIQUETAS_SVG.has(etiqueta)
      ? document.createElementNS(SVG_NS, etiqueta)
      : document.createElement(etiqueta);
    for (const [clave, valor] of Object.entries(props || {})) {
      if (valor == null || valor === false) continue;
      if (clave === "text") {
        el.textContent = valor;
      } else if (clave === "style") {
        for (const [prop, v] of Object.entries(valor)) {
          if (prop.startsWith("--")) el.style.setProperty(prop, v);
          else el.style[prop] = v;
        }
      } else if (clave.startsWith("on") && typeof valor === "function") {
        el.addEventListener(clave.slice(2), valor);
      } else {
        el.setAttribute(clave, valor === true ? "" : String(valor));
      }
    }
    for (const hijo of hijos.flat(Infinity)) {
      if (hijo == null || hijo === false) continue;
      el.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
    }
    return el;
  }

  const ICONOS = {
    buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    luna: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    cerrar: '<path d="M18 6 6 18M6 6l12 12"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    externo: '<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
    descargar: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    copiar: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    doble: '<path d="m2 12.5 4.5 4.5L15 8.5M11.5 16.5l.5.5 9.5-9.5"/>',
    candado: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    entra: '<path d="M17 7 7 17M7 9v8h8"/>',
    sale: '<path d="M7 17 17 7M9 7h8v8"/>',
    libro: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
    edificio: '<path d="M4 21V5l8-3 8 3v16"/><path d="M9 21v-5h6v5M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/>',
    pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
    calendario: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    capas: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
    grafo: '<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7.3 10.9 16.7 6.1M7.3 13.1l9.4 4.8"/>',
    codigo: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>',
    play: '<path d="M7 4.5v15l12-7.5Z"/>',
    tabla: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 10h17M3.5 15h17M10 4.5v15"/>',
    llaves: '<path d="M8 4H7a2 2 0 0 0-2 2v4l-2 2 2 2v4a2 2 0 0 0 2 2h1M16 4h1a2 2 0 0 1 2 2v4l2 2-2 2v4a2 2 0 0 1-2 2h-1"/>',
    terminal: '<path d="m5 8 4 4-4 4M12 17h7"/>',
    alerta: '<path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    birrete: '<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    reiniciar: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>',
    objetivo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    base: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    lista: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    enlace: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    mapa: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/><path d="M9 4v14M15 6v14"/>',
  };

  function icono(nombre, tam = 16) {
    const svg = h("svg", {
      class: "ico", width: tam, height: tam, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
      "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", focusable: "false",
    });
    svg.innerHTML = ICONOS[nombre] || "";
    return svg;
  }

  const normalizar = (texto) => String(texto).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  const dos = (n) => String(n).padStart(2, "0");
  const kb = (bytes) => (bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`);
  const areaCorta = (nombre) => nombre.replace(/^Disciplinas\s+/i, "");
  const escaparHTML = (texto) => texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const guardado = {
    leer(clave, porDefecto) {
      try {
        const valor = localStorage.getItem(clave);
        return valor === null ? porDefecto : JSON.parse(valor);
      } catch {
        return porDefecto;
      }
    },
    escribir(clave, valor) {
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
      } catch {
        // Modo privado o almacenamiento bloqueado: seguimos sin guardar.
      }
    },
  };

  function avisar(texto, tipo = "info", accion = null) {
    const toast = h("div", { class: `toast toast-${tipo}`, role: "status" },
      icono(tipo === "ok" ? "check" : tipo === "error" ? "alerta" : "info", 16),
      h("span", { text: texto }),
      accion ? h("button", { class: "btn btn-ghost btn-sm", type: "button", onclick: () => { accion.fn(); cerrar(); } }, accion.texto) : null);
    const cerrar = () => {
      toast.classList.remove("in");
      setTimeout(() => toast.remove(), 300);
    };
    $("#toasts").append(toast);
    requestAnimationFrame(() => toast.classList.add("in"));
    setTimeout(cerrar, accion ? 6000 : 2800);
  }

  async function copiar(texto, mensaje = "Copiado al portapapeles") {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const area = h("textarea", { style: { position: "fixed", opacity: "0" } });
      area.value = texto;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    avisar(mensaje, "ok");
  }

  /** Un único tooltip compartido: aparece con el mouse y también con el foco del teclado. */
  const tip = {
    mostrar(contenido, x, y) {
      const el = $("#tip");
      el.replaceChildren(...contenido.filter(Boolean));
      el.hidden = false;
      this.mover(x, y);
    },
    mover(x, y) {
      const el = $("#tip");
      const caja = el.getBoundingClientRect();
      let izquierda = x + 14;
      let arriba = y + 16;
      if (izquierda + caja.width > innerWidth - 8) izquierda = x - caja.width - 14;
      if (arriba + caja.height > innerHeight - 8) arriba = y - caja.height - 14;
      el.style.left = `${Math.max(8, izquierda)}px`;
      el.style.top = `${Math.max(8, arriba)}px`;
    },
    ocultar() {
      $("#tip").hidden = true;
    },
    enlazar(el, contenido) {
      el.addEventListener("pointerenter", (e) => this.mostrar(contenido(), e.clientX, e.clientY));
      el.addEventListener("pointermove", (e) => this.mover(e.clientX, e.clientY));
      el.addEventListener("pointerleave", () => this.ocultar());
      el.addEventListener("focus", () => {
        const caja = el.getBoundingClientRect();
        this.mostrar(contenido(), caja.left + caja.width / 2, caja.bottom);
      });
      el.addEventListener("blur", () => this.ocultar());
    },
  };

  /** Contenido de tooltip: primero el valor, después la etiqueta, con una marca del color de la serie. */
  function contenidoTip(valor, etiqueta, color) {
    return [
      h("div", { class: "tip-val" }, color ? h("i", { class: "tip-key", style: { "--c": color } }) : null, h("strong", { text: valor })),
      etiqueta ? h("div", { class: "tip-lbl", text: etiqueta }) : null,
    ];
  }

  // ───────────────────────── API ─────────────────────────
  const API = {
    base: "",
    consultas: 0,

    /** Busca la API: primero en la misma dirección del front, después en el puerto 8000. */
    async detectar() {
      const candidatas = [];
      if (location.protocol.startsWith("http")) candidatas.push(location.origin);
      candidatas.push("http://127.0.0.1:8000", "http://localhost:8000");
      for (const base of new Set(candidatas)) {
        try {
          const respuesta = await conLimite(`${base}/estado`, 3000);
          if ((respuesta.headers.get("content-type") || "").includes("application/json")) {
            this.base = base === location.origin ? "" : base;
            return true;
          }
        } catch {
          // Esa no respondió: probamos la siguiente.
        }
      }
      return false;
    },

    url(ruta) {
      return (this.base || location.origin) + ruta;
    },

    /** Pide una ruta y devuelve todo: respuesta, texto, JSON (si hay), tiempo y tamaño. */
    async pedir(ruta) {
      const inicio = performance.now();
      const res = await fetch(this.base + ruta, { headers: { Accept: "application/json" } });
      const texto = await res.text();
      const ms = performance.now() - inicio;
      let datos = null;
      try {
        datos = JSON.parse(texto);
      } catch {
        // No era JSON.
      }
      return { res, texto, datos, ms, bytes: new Blob([texto]).size };
    },

    /** Pide una ruta y devuelve el JSON; si la respuesta no es 2xx, lanza un error con el detalle. */
    async get(ruta) {
      const r = await this.pedir(ruta);
      this.consultas += 1;
      if (!r.res.ok) {
        const detalle = r.datos && r.datos.detail;
        const error = new Error(typeof detalle === "string" ? detalle : `${r.res.status} ${r.res.statusText}`);
        error.status = r.res.status;
        throw error;
      }
      return r.datos;
    },
  };

  function conLimite(url, ms) {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), ms);
    return fetch(url, { signal: control.signal }).finally(() => clearTimeout(temporizador));
  }

  // ───────────────────────── estado ─────────────────────────
  const S = {
    d: null, // datos tal cual vienen de la API
    M: null, // modelo armado a partir de los datos
    hayCorrelativas: false,
    areasActivas: new Set(),
    texto: "",
    verTodas: false,
    modoProgreso: false,
    foco: null,
    progreso: guardado.leer("mapa.progreso", {}),
    endpoints: [],
    ep: null,
    historial: [],
    comandos: [],
    resultados: [],
    activo: 0,
    panelApi: null,
    listasAbiertas: new Set(),
  };

  // ───────────────────────── carga ─────────────────────────
  async function cargarDatos() {
    const inicio = performance.now();
    const [estado, instituciones, carreras, planes, regimenes, periodos, areas, tipos, carreraInstitucion, asignaturas, openapi] =
      await Promise.all([
        API.get("/estado"),
        API.get("/institucion/"),
        API.get("/carrera/"),
        API.get("/planestudio/"),
        API.get("/regimencursado/"),
        API.get("/periodocursado/"),
        API.get("/areaacademica/"),
        API.get("/tipocorrelativa/"),
        API.get("/carrerainstitucion/"),
        API.get("/asignaturas/"),
        API.get("/openapi.json").catch(() => null),
      ]);
    if (!planes.length) {
      const error = new Error("La base existe pero no tiene planes de estudio cargados.");
      error.sinDatos = true;
      throw error;
    }
    const plan = planes.find((p) => p.id === guardado.leer("mapa.plan", null)) || planes[0];
    const [materias, correlativas] = await Promise.all([
      API.get(`/asignaturasplan/${plan.id}`),
      API.get(`/correlativas/?plan_estudio_id=${plan.id}`),
    ]);
    S.d = {
      estado, instituciones, carreras, planes, plan, regimenes, periodos, areas, tipos,
      carreraInstitucion, asignaturas, materias, correlativas, openapi, ms: performance.now() - inicio,
    };
    S.M = construirModelo(S.d);
    S.hayCorrelativas = S.M.aristas.length > 0;
  }

  function construirModelo(d) {
    const areas = [...d.areas].sort((a, b) => a.id - b.id);
    // El color sigue al área (por su id), nunca a su posición en un filtro.
    const slotArea = new Map(areas.map((a, i) => [a.id, i < 8 ? i + 1 : 0]));
    const materias = d.materias.map((fila) => ({
      ap: fila.id,
      id: fila.asignatura_id,
      nombre: fila.asignatura,
      areaId: fila.area_academica_id,
      area: fila.area_academica,
      periodoId: fila.periodo_cursado_id,
      periodo: fila.periodo_cursado,
    }));
    const periodos = [];
    for (const m of materias) {
      if (!periodos.some((p) => p.id === m.periodoId)) periodos.push({ id: m.periodoId, nombre: m.periodo });
    }
    periodos.sort((a, b) => a.id - b.id);
    periodos.forEach((p, i) => {
      p.indice = i;
      p.corto = /trabajo final/i.test(p.nombre) ? "TF" : `${i + 1}°`;
    });

    const porAp = new Map(materias.map((m) => [m.ap, m]));
    const reqs = new Map(materias.map((m) => [m.ap, []]));
    const deps = new Map(materias.map((m) => [m.ap, []]));
    const aristas = [];
    for (const c of d.correlativas) {
      if (!porAp.has(c.asignaturaplan_id) || !porAp.has(c.correlativa_id)) continue;
      const tipo = /aprob/i.test(c.tipo_correlativa) ? "aprobada" : "cursada";
      reqs.get(c.asignaturaplan_id).push({ ap: c.correlativa_id, tipo });
      deps.get(c.correlativa_id).push({ ap: c.asignaturaplan_id, tipo });
      aristas.push({ desde: c.correlativa_id, hasta: c.asignaturaplan_id, tipo });
    }
    // Cierre transitivo con memoria: todas las materias previas de una materia.
    const cierre = (mapa) => {
      const memo = new Map();
      const visitar = (ap) => {
        if (memo.has(ap)) return memo.get(ap);
        const conjunto = new Set();
        memo.set(ap, conjunto);
        for (const x of mapa.get(ap) || []) {
          conjunto.add(x.ap);
          for (const y of visitar(x.ap)) conjunto.add(y);
        }
        return conjunto;
      };
      return visitar;
    };
    return { areas, slotArea, materias, periodos, porAp, reqs, deps, aristas, ancestros: cierre(reqs) };
  }

  const slot = (areaId) => S.M.slotArea.get(areaId) || 0;
  const colorArea = (areaId) => (slot(areaId) ? `var(--area-${slot(areaId)})` : "var(--muted)");

  // ───────────────────────── progreso ─────────────────────────
  const estado = (m) => S.progreso[m.id] || "pendiente";
  const hayProgreso = () => Object.keys(S.progreso).length > 0;

  function cumple(requisito) {
    const e = estado(S.M.porAp.get(requisito.ap));
    return requisito.tipo === "aprobada" ? e === "aprobada" : e !== "pendiente";
  }

  const faltantes = (m) => S.M.reqs.get(m.ap).filter((r) => !cumple(r));
  const puedeCursar = (m) => estado(m) === "pendiente" && faltantes(m).length === 0;
  const puedeRendir = (m) => estado(m) === "cursada" && faltantes(m).length === 0;

  function setEstado(m, valor, { desdeFicha = false } = {}) {
    if (valor === "pendiente") delete S.progreso[m.id];
    else S.progreso[m.id] = valor;
    guardado.escribir("mapa.progreso", S.progreso);
    actualizarTarjetas();
    renderProgreso({ accion: true });
    const ficha = $("#ficha");
    if (S.ficha && ficha.classList.contains("open")) {
      const desplazamiento = ficha.scrollTop;
      ficha.replaceChildren(contenidoFicha(S.ficha));
      ficha.scrollTop = desplazamiento;
      if (desdeFicha) $('.segmentado [aria-checked="true"]', ficha).focus();
    }
  }

  function ciclarEstado(m) {
    const siguiente = { pendiente: "cursada", cursada: "aprobada", aprobada: "pendiente" }[estado(m)];
    setEstado(m, siguiente);
    avisar(`${m.nombre}: ${siguiente}`, "ok");
  }

  function reiniciarProgreso() {
    if (!hayProgreso()) return;
    const anterior = { ...S.progreso };
    S.progreso = {};
    guardado.escribir("mapa.progreso", S.progreso);
    actualizarTarjetas();
    renderProgreso();
    avisar("Se borró tu progreso.", "info", {
      texto: "Deshacer",
      fn: () => {
        S.progreso = anterior;
        guardado.escribir("mapa.progreso", S.progreso);
        actualizarTarjetas();
        renderProgreso();
      },
    });
  }

  // ───────────────────────── encabezado y hero ─────────────────────────
  function estadoApi(clase, texto, titulo) {
    const pill = $("#estado-api");
    pill.className = `status ${clase}`;
    pill.replaceChildren(h("i", { class: "status-dot" }), h("span", { text: texto }));
    if (titulo) pill.title = titulo;
  }

  function renderHero() {
    const { d, M } = S;
    const plan = d.plan;
    const carrera = d.carreras.find((c) => c.id === plan.carrera_id) || d.carreras[0];
    const palabras = carrera.nombre.split(" ");
    const ultima = palabras.pop();
    $("#hero-titulo").replaceChildren(palabras.length ? `${palabras.join(" ")} ` : "", h("span", { class: "grad", text: ultima }));
    document.title = `${carrera.nombre} · Mapa de Carrera`;
    $("#marca-sub").textContent = `${plan.plan_estudio} · ${plan.institucion}`;
    $("#hero-sub").replaceChildren(
      h("span", { class: "chip-sm" }, icono("edificio", 14), plan.institucion),
      h("span", { class: "chip-sm" }, icono("libro", 14), plan.plan_estudio),
      h("span", { class: "chip-sm" }, icono("calendario", 14), `Régimen ${plan.regimen_cursado.toLowerCase()}`),
      h("span", { class: "chip-sm" }, icono("reloj", 14), plan.fin ? `${plan.inicio}–${plan.fin}` : `Vigente desde ${plan.inicio}`));

    const nombresAreas = M.areas.map((a) => a.nombre.replace(/^(Disciplinas|Ciencias)\s+/i, "").toLowerCase());
    const listaAreas = nombresAreas.length > 1
      ? `${nombresAreas.slice(0, -1).join(", ")} y ${nombresAreas[nombresAreas.length - 1]}`
      : nombresAreas.join("");
    const kpis = [
      { valor: M.materias.length, etiqueta: "Materias", sub: `en ${plural(M.periodos.length, "período", "períodos")}` },
      { valor: M.periodos.length, etiqueta: "Períodos", sub: `Régimen ${plan.regimen_cursado.toLowerCase()}` },
      { valor: M.areas.length, etiqueta: "Áreas académicas", sub: listaAreas },
      S.hayCorrelativas
        ? { valor: M.aristas.length, etiqueta: "Correlatividades", sub: "entre las materias del plan" }
        : { valor: plan.inicio, etiqueta: "Inicio del plan", sub: plan.fin ? `Hasta ${plan.fin}` : "Vigente" },
    ];
    $("#kpis").replaceChildren(...kpis.map((k) => h("div", { class: "kpi" },
      h("span", { class: "kpi-valor", "data-contar": k.valor, text: sinMovimiento() ? k.valor : 0 }),
      h("span", { class: "kpi-label", text: k.etiqueta }),
      h("span", { class: "kpi-sub", text: k.sub }))));
    contarHacia($$("[data-contar]", $("#kpis")));
  }

  function contarHacia(elementos) {
    for (const el of elementos) {
      const final = Number(el.dataset.contar);
      if (sinMovimiento()) {
        el.textContent = final;
        continue;
      }
      const inicio = performance.now();
      const duracion = 1200;
      const paso = (ahora) => {
        const t = Math.min(1, (ahora - inicio) / duracion);
        el.textContent = Math.round(final * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }
  }

  /** El plan como un mapa de subte: cada período es una línea y cada materia una estación. */
  function renderMapa() {
    const { M } = S;
    const svg = $("#mapa");
    const ANCHO = 560;
    const MARGEN = 46;
    const Y_LINEA = 46;
    const Y_PRIMERA = 108;
    const PASO = 56;
    const cantidades = M.periodos.map((p) => M.materias.filter((m) => m.periodoId === p.id).length);
    const alto = Y_PRIMERA + (Math.max(1, ...cantidades) - 1) * PASO + 34;
    const xDe = (i) => (M.periodos.length === 1 ? ANCHO / 2 : MARGEN + (i * (ANCHO - 2 * MARGEN)) / (M.periodos.length - 1));
    svg.setAttribute("viewBox", `0 0 ${ANCHO} ${alto}`);

    const lineas = h("g", {});
    const pulsos = h("g", { class: "mm-pulsos", "aria-hidden": "true" });
    const estaciones = h("g", {});
    const principal = `M${xDe(0)},${Y_LINEA} L${xDe(M.periodos.length - 1)},${Y_LINEA}`;
    lineas.append(h("path", { class: "mm-linea mm-principal", d: principal }));
    pulsos.append(h("path", { class: "mm-pulso", d: principal, pathLength: 100, style: { "--dur": "6s" } }));

    let orden = 0;
    M.periodos.forEach((p, i) => {
      const x = xDe(i);
      const materias = M.materias.filter((m) => m.periodoId === p.id);
      const rama = `M${x},${Y_LINEA} L${x},${Y_PRIMERA + (materias.length - 1) * PASO}`;
      lineas.append(h("path", { class: "mm-linea", d: rama }));
      pulsos.append(h("path", {
        class: "mm-pulso", d: rama, pathLength: 100,
        style: { "--dur": `${2.8 + i * 0.3}s`, "--retraso": `${(-i * 0.9).toFixed(1)}s` },
      }));
      materias.forEach((m, k) => {
        const estacion = h("g", {
          class: "mm-estacion", transform: `translate(${x} ${Y_PRIMERA + k * PASO})`, tabindex: 0, role: "button",
          "aria-label": `${m.nombre}. ${m.area}. ${m.periodo}.`,
          style: { "--area": colorArea(m.areaId), "--tinta": `var(--tinta-area-${slot(m.areaId)})`, "--i": orden++ },
        }, h("g", { class: "mm-pop" },
          h("circle", { class: "mm-halo", r: 20 }),
          h("circle", { class: "mm-punto", r: 13 }),
          h("text", { class: "mm-num", text: dos(m.id) })));
        tip.enlazar(estacion, () => contenidoTip(m.nombre, `${m.area} · ${m.periodo}`, colorArea(m.areaId)));
        estacion.addEventListener("click", () => abrirFicha(m));
        estacion.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrirFicha(m);
          }
        });
        estaciones.append(estacion);
      });
      const cabecera = h("g", {
        class: "mm-hub", transform: `translate(${x} ${Y_LINEA})`, tabindex: 0, role: "button",
        "aria-label": `${p.nombre}: ${plural(materias.length, "materia", "materias")}. Ir al plan.`,
      }, h("circle", { r: 18 }), h("text", { text: p.corto }));
      tip.enlazar(cabecera, () => contenidoTip(plural(materias.length, "materia", "materias"), p.nombre));
      cabecera.addEventListener("click", () => irA("#plan"));
      cabecera.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          irA("#plan");
        }
      });
      estaciones.append(cabecera);
    });
    svg.replaceChildren(lineas, pulsos, estaciones);
    // Los pulsos solo se animan mientras el mapa está a la vista.
    if ("IntersectionObserver" in window && !svg.dataset.observado) {
      svg.dataset.observado = "1";
      new IntersectionObserver(([entrada]) => svg.classList.toggle("pausado", !entrada.isIntersecting)).observe(svg);
    }
    $("#mapa-sub").textContent = `${plural(M.periodos.length, "período", "períodos")} · ${plural(M.materias.length, "materia", "materias")}`;
    $("#mapa-leyenda").replaceChildren(
      ...M.areas.map((a) => h("span", {}, h("i", { class: "sw", style: { "--area": colorArea(a.id) } }), a.nombre)),
      h("span", { class: "muted" }, "Cada estación es una materia"));
  }

  /** Color del número dentro de cada estación: blanco o tinta, según el contraste con el área. */
  function actualizarTintas() {
    const estilos = getComputedStyle(document.documentElement);
    for (let i = 1; i <= 8; i += 1) {
      const color = estilos.getPropertyValue(`--area-${i}`).trim();
      document.documentElement.style.setProperty(`--tinta-area-${i}`, tintaPara(color));
    }
  }

  function tintaPara(hex) {
    const partes = /^#?([0-9a-f]{6})$/i.exec(hex);
    if (!partes) return "#ffffff";
    const n = parseInt(partes[1], 16);
    const canal = (v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const luz = 0.2126 * canal(n >> 16) + 0.7152 * canal((n >> 8) & 255) + 0.0722 * canal(n & 255);
    return 1.05 / (luz + 0.05) >= (luz + 0.05) / 0.05 ? "#ffffff" : "#0b0b0b";
  }

  // ───────────────────────── plan: filtros y tablero ─────────────────────────
  function renderFiltros() {
    const { M } = S;
    const contenedor = $("#filtro-areas");
    contenedor.replaceChildren(
      h("button", { class: "chip", type: "button", "data-area": "todas" }, "Todas", h("span", { class: "chip-n", text: M.materias.length })),
      ...M.areas.map((a) => h("button", { class: "chip", type: "button", "data-area": a.id, style: { "--area": colorArea(a.id) } },
        h("i", { class: "dot" }), a.nombre,
        h("span", { class: "chip-n", text: M.materias.filter((m) => m.areaId === a.id).length }))));
    contenedor.onclick = (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      if (chip.dataset.area === "todas") {
        S.areasActivas.clear();
      } else {
        const id = Number(chip.dataset.area);
        if (S.areasActivas.has(id)) S.areasActivas.delete(id);
        else S.areasActivas.add(id);
        if (S.areasActivas.size === M.areas.length) S.areasActivas.clear();
      }
      aplicarFiltros();
    };
    aplicarFiltros();
  }

  function aplicarFiltros() {
    if (!S.M) return;
    for (const chip of $$("#filtro-areas .chip")) {
      const activo = chip.dataset.area === "todas" ? S.areasActivas.size === 0 : S.areasActivas.has(Number(chip.dataset.area));
      chip.classList.toggle("is-on", activo);
      chip.setAttribute("aria-pressed", String(activo));
    }
    const q = normalizar(S.texto);
    let visibles = 0;
    for (const card of $$("#tablero .card")) {
      const m = S.M.porAp.get(Number(card.dataset.ap));
      const pasa = (S.areasActivas.size === 0 || S.areasActivas.has(m.areaId)) && (!q || normalizar(m.nombre).includes(q));
      card.classList.toggle("is-dim", !pasa);
      if (pasa) visibles += 1;
    }
    $("#tablero").setAttribute("aria-description", `${plural(visibles, "materia coincide", "materias coinciden")} con el filtro`);
    programarAristas();
  }

  function renderTablero() {
    const { M } = S;
    const tablero = $("#tablero");
    tablero.style.setProperty("--cols", M.periodos.length);
    const columnas = M.periodos.map((p) => {
      const materias = M.materias.filter((m) => m.periodoId === p.id);
      return h("div", { class: "col" },
        h("button", {
          class: "col-head", type: "button", title: `Consultar /asignaturasplan/periodo/${p.id} en el explorador`,
          onclick: () => explorar("/asignaturasplan/periodo/{periodo_cursado_id}", { periodo_cursado_id: p.id }),
        }, h("span", { class: "col-num", text: p.corto }),
        h("span", { class: "col-txt" },
          h("span", { class: "col-nombre", text: p.nombre }),
          h("span", { class: "col-n", text: plural(materias.length, "materia", "materias") }))),
        h("div", { class: "col-lista", role: "list", "aria-label": p.nombre },
          ...materias.map((m) => h("div", { role: "listitem" }, crearTarjeta(m)))));
    });
    tablero.replaceChildren(h("svg", { class: "aristas", id: "aristas", "aria-hidden": "true" }), ...columnas);
    if (S.hayCorrelativas && "ResizeObserver" in window) new ResizeObserver(programarAristas).observe(tablero);
    actualizarTarjetas();

    $("#switch-todas").hidden = !S.hayCorrelativas;
    $("#plan-lead").textContent = S.hayCorrelativas
      ? "Pasá el mouse (o el foco) sobre una materia para ver qué necesita y qué habilita. Hacé clic para abrir su ficha."
      : "Hacé clic en una materia para abrir su ficha. El encabezado de cada período consulta su endpoint en el explorador.";
    $("#leyenda-plan").replaceChildren(...(S.hayCorrelativas
      ? [
        h("span", {}, muestraLinea("aprobada", 26, "var(--accent)"), "Requiere aprobada"),
        h("span", {}, muestraLinea("cursada", 26, "var(--accent)"), "Requiere cursada"),
        h("span", {}, muestraLinea("aprobada", 26, "var(--text-2)"), "Materias que habilita"),
      ]
      : [h("span", { class: "nota-vacia" }, icono("info", 15),
        "La base todavía no tiene correlatividades cargadas (la tabla Correlativa está vacía). Cuando se carguen, el tablero va a dibujar qué necesita y qué habilita cada materia.")]));
  }

  function crearTarjeta(m) {
    const { M } = S;
    const card = h("button", { class: "card", type: "button", "data-ap": m.ap, style: { "--area": colorArea(m.areaId) } },
      h("span", { class: "card-top" },
        h("span", { class: "card-id", text: dos(m.id) }),
        h("span", { class: "card-area" }, h("i", { class: "dot" }), areaCorta(m.area))),
      h("span", { class: "card-nombre", text: m.nombre }),
      h("span", { class: "card-estado" }),
      S.hayCorrelativas
        ? h("span", { class: "card-meta" },
          h("span", { title: "Correlativas que necesita" }, icono("entra", 13), String(M.reqs.get(m.ap).length)),
          h("span", { title: "Materias que habilita" }, icono("sale", 13), String(M.deps.get(m.ap).length)),
          h("span", { class: "card-rol" }))
        : null);
    card.addEventListener("pointerenter", () => enfocar(m));
    card.addEventListener("pointerleave", () => enfocar(null));
    card.addEventListener("focus", () => enfocar(m));
    card.addEventListener("blur", () => enfocar(null));
    card.addEventListener("click", () => (S.modoProgreso ? ciclarEstado(m) : abrirFicha(m)));
    return card;
  }

  function actualizarTarjetas() {
    for (const card of $$("#tablero .card")) {
      const m = S.M.porAp.get(Number(card.dataset.ap));
      const e = estado(m);
      card.dataset.estado = e;
      card.classList.toggle("is-disponible", puedeCursar(m));
      card.classList.toggle("is-bloqueada", e === "pendiente" && !puedeCursar(m));
      let contenido = [];
      if (e === "aprobada") contenido = [icono("doble", 13), "Aprobada"];
      else if (e === "cursada") contenido = [icono("check", 13), "Cursada"];
      else if (S.modoProgreso && puedeCursar(m)) contenido = [h("i", { class: "punto-ok" }), "Disponible"];
      $(".card-estado", card).replaceChildren(...contenido);
      card.setAttribute("aria-label", `${m.nombre}. ${m.area}. ${m.periodo}. Estado: ${e}.`);
    }
  }

  /** Resalta una materia y sus correlativas (solo si la base tiene correlatividades). */
  function enfocar(m) {
    if (!S.hayCorrelativas) return;
    S.foco = m;
    const requisitos = new Map();
    const habilitadas = new Map();
    if (m) {
      for (const r of S.M.reqs.get(m.ap)) requisitos.set(r.ap, r.tipo);
      for (const d of S.M.deps.get(m.ap)) habilitadas.set(d.ap, d.tipo);
    }
    const tablero = $("#tablero");
    tablero.classList.toggle("has-focus", Boolean(m));
    for (const card of $$(".card", tablero)) {
      const ap = Number(card.dataset.ap);
      card.classList.toggle("is-foco", Boolean(m) && m.ap === ap);
      card.classList.toggle("is-req", requisitos.has(ap));
      card.classList.toggle("is-dep", habilitadas.has(ap));
      const rol = $(".card-rol", card);
      if (!rol) continue;
      if (requisitos.has(ap)) rol.textContent = requisitos.get(ap) === "aprobada" ? "Requiere aprobada" : "Requiere cursada";
      else rol.textContent = habilitadas.has(ap) ? "Habilitada" : "";
    }
    programarAristas();
  }

  function setVerTodas(valor) {
    S.verTodas = valor;
    $("#ver-todas").checked = valor;
    programarAristas();
  }

  function setModoProgreso(valor) {
    S.modoProgreso = valor;
    $("#modo-progreso").checked = valor;
    $("#tablero").classList.toggle("modo-progreso", valor);
    $("#btn-modo-progreso").textContent = valor ? "Desactivar modo progreso" : "Activar modo progreso";
    actualizarTarjetas();
    if (valor) avisar("Modo progreso: cada clic en una materia la pasa a cursada, aprobada o pendiente.");
  }

  let cuadroAristas = 0;
  function programarAristas() {
    cancelAnimationFrame(cuadroAristas);
    cuadroAristas = requestAnimationFrame(dibujarAristas);
  }

  /** Dibuja las correlatividades como curvas entre tarjetas (de la previa a la que la necesita). */
  function dibujarAristas() {
    const tablero = $("#tablero");
    const svg = $("#aristas");
    if (!tablero || !svg || !S.hayCorrelativas) return;
    const ancho = tablero.scrollWidth;
    const alto = tablero.scrollHeight;
    svg.setAttribute("width", ancho);
    svg.setAttribute("height", alto);
    svg.setAttribute("viewBox", `0 0 ${ancho} ${alto}`);

    const base = tablero.getBoundingClientRect();
    const caja = new Map();
    for (const card of $$(".card", tablero)) {
      const r = card.getBoundingClientRect();
      caja.set(Number(card.dataset.ap), {
        x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height, oculta: card.classList.contains("is-dim"),
      });
    }

    const lista = [];
    const foco = S.foco;
    if (S.verTodas) {
      for (const a of S.M.aristas) {
        const tocaFoco = foco && (a.desde === foco.ap || a.hasta === foco.ap);
        if (!tocaFoco && !caja.get(a.desde).oculta && !caja.get(a.hasta).oculta) lista.push({ ...a, clase: "todas" });
      }
    }
    if (foco) {
      for (const r of S.M.reqs.get(foco.ap)) lista.push({ desde: r.ap, hasta: foco.ap, tipo: r.tipo, clase: "entra" });
      for (const d of S.M.deps.get(foco.ap)) lista.push({ desde: foco.ap, hasta: d.ap, tipo: d.tipo, clase: "sale" });
    }

    // Reparte las salidas y llegadas de cada tarjeta a lo alto, ordenadas por la otra punta.
    const salidas = new Map();
    const llegadas = new Map();
    for (const a of lista) {
      if (!salidas.has(a.desde)) salidas.set(a.desde, []);
      if (!llegadas.has(a.hasta)) llegadas.set(a.hasta, []);
      salidas.get(a.desde).push(a);
      llegadas.get(a.hasta).push(a);
    }
    for (const grupo of salidas.values()) grupo.sort((a, b) => caja.get(a.hasta).y - caja.get(b.hasta).y);
    for (const grupo of llegadas.values()) grupo.sort((a, b) => caja.get(a.desde).y - caja.get(b.desde).y);
    const puerto = (mapa, ap, arista) => {
      const grupo = mapa.get(ap);
      const b = caja.get(ap);
      const fraccion = (grupo.indexOf(arista) + 1) / (grupo.length + 1);
      return b.y + b.h * (0.22 + 0.56 * fraccion);
    };

    const trazos = [];
    for (const a of lista) {
      const s = caja.get(a.desde);
      const t = caja.get(a.hasta);
      const y1 = puerto(salidas, a.desde, a);
      const y2 = puerto(llegadas, a.hasta, a);
      const x1 = s.x + s.w;
      let d;
      let punta;
      if (t.x > x1) {
        const x2 = t.x - 7;
        const dx = Math.max(24, (x2 - x1) / 2);
        d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
        punta = `M${x2},${y2 - 4.5} L${x2 + 7},${y2} L${x2},${y2 + 4.5} Z`;
      } else {
        // Misma columna (o hacia atrás): la curva rodea por la derecha.
        const x2 = t.x + t.w + 7;
        const curva = 46;
        d = `M${x1},${y1} C${x1 + curva},${y1} ${x2 + curva},${y2} ${x2},${y2}`;
        punta = `M${x2},${y2 - 4.5} L${x2 - 7},${y2} L${x2},${y2 + 4.5} Z`;
      }
      trazos.push(h("g", { class: `arista ${a.clase} t-${a.tipo}` },
        h("path", { class: "arista-linea", d, pathLength: a.tipo === "aprobada" ? 1 : null }),
        h("path", { class: "arista-punta", d: punta }),
        h("circle", { class: "arista-origen", cx: x1, cy: y1, r: 2.5 })));
    }
    svg.replaceChildren(...trazos);
  }

  function muestraLinea(tipo, ancho = 22, color = "currentColor") {
    return h("svg", { class: "ico", width: ancho, height: 8, viewBox: `0 0 ${ancho} 8`, "aria-hidden": "true" },
      h("path", {
        d: `M1 4H${ancho - 1}`, stroke: color, "stroke-width": 2, "stroke-linecap": "round",
        "stroke-dasharray": tipo === "cursada" ? "4 3" : null,
      }));
  }

  // ───────────────────────── ficha de una materia ─────────────────────────
  function abrirFicha(m) {
    const ficha = $("#ficha");
    if (!ficha.classList.contains("open")) S.volverA = document.activeElement;
    S.ficha = m;
    tip.ocultar();
    ficha.replaceChildren(contenidoFicha(m));
    ficha.scrollTop = 0;
    ficha.classList.add("open");
    ficha.removeAttribute("inert");
    ficha.setAttribute("aria-hidden", "false");
    $("#velo").classList.add("open");
    document.body.classList.add("sin-scroll");
    $(".ficha-cerrar", ficha).focus({ preventScroll: true });
  }

  function cerrarFicha() {
    const ficha = $("#ficha");
    if (!ficha.classList.contains("open")) return;
    ficha.classList.remove("open");
    ficha.setAttribute("inert", "");
    ficha.setAttribute("aria-hidden", "true");
    $("#velo").classList.remove("open");
    document.body.classList.remove("sin-scroll");
    S.ficha = null;
    if (S.volverA && document.contains(S.volverA)) S.volverA.focus({ preventScroll: true });
  }

  function contenidoFicha(m) {
    const { M } = S;
    const reqs = M.reqs.get(m.ap);
    const deps = M.deps.get(m.ap);
    const ancestros = [...M.ancestros(m.ap)].map((ap) => M.porAp.get(ap)).sort((a, b) => a.id - b.id);
    const grupo = (tipo, titulo) => {
      const lista = reqs.filter((r) => r.tipo === tipo);
      if (!lista.length) return null;
      return [
        h("h4", {}, muestraLinea(tipo, 22, "var(--accent)"), titulo),
        h("ul", { class: "req-lista" }, ...lista.map((r) => itemRequisito(M.porAp.get(r.ap), cumple(r)))),
      ];
    };
    let requisitos;
    if (!S.hayCorrelativas) {
      requisitos = h("p", { class: "muted", text: "La base todavía no tiene correlatividades cargadas, así que no hay requisitos para mostrar." });
    } else if (!reqs.length) {
      requisitos = h("p", { class: "muted", text: "No tiene correlativas: se puede cursar desde el principio." });
    } else {
      requisitos = [grupo("cursada", "Cursadas"), grupo("aprobada", "Aprobadas")];
    }
    if (!S.panelApi || S.panelApi.ap !== m.ap) S.panelApi = { ap: m.ap, el: panelApiFicha(m) };

    return h("div", { class: "ficha-in" },
      h("header", { class: "ficha-head", style: { "--area": colorArea(m.areaId) } },
        h("div", { class: "ficha-top" },
          h("span", { class: "ficha-id", text: dos(m.id) }),
          h("button", { class: "icon-btn ficha-cerrar", type: "button", "aria-label": "Cerrar la ficha", onclick: cerrarFicha }, icono("cerrar", 18))),
        h("h2", { id: "ficha-titulo", text: m.nombre }),
        h("div", { class: "ficha-chips" },
          h("span", { class: "chip-sm", style: { "--area": colorArea(m.areaId) } }, h("i", { class: "dot" }), m.area),
          h("span", { class: "chip-sm" }, icono("calendario", 13), m.periodo),
          h("span", { class: "chip-sm" }, icono("libro", 13), S.d.plan.plan_estudio))),
      h("section", { class: "ficha-sec" }, h("h3", { text: "Mi estado" }), selectorEstado(m), avisoDisponibilidad(m)),
      h("section", { class: "ficha-sec" }, h("h3", { text: "Para cursarla y rendirla" }), requisitos),
      S.hayCorrelativas
        ? h("section", { class: "ficha-sec" },
          h("h3", { text: deps.length ? `Habilita ${plural(deps.length, "materia", "materias")}` : "Habilita" }),
          deps.length
            ? h("ul", { class: "req-lista" }, ...deps.map((d) => itemHabilita(M.porAp.get(d.ap), d.tipo)))
            : h("p", { class: "muted", text: "Ninguna materia la pide como correlativa." }))
        : null,
      ancestros.length
        ? h("section", { class: "ficha-sec" },
          h("h3", { text: "Camino completo" }),
          h("p", { class: "small muted", text: `Contando toda la cadena de correlativas, antes pasás por ${plural(ancestros.length, "materia", "materias")}.` }),
          h("div", { class: "camino" }, ...ancestros.map(miniMateria)))
        : null,
      h("section", { class: "ficha-sec" }, h("h3", { text: "En la API" }), S.panelApi.el));
  }

  function selectorEstado(m) {
    const actual = estado(m);
    const opciones = [["pendiente", "Pendiente", null], ["cursada", "Cursada", "check"], ["aprobada", "Aprobada", "doble"]];
    const grupo = h("div", { class: "segmentado", role: "radiogroup", "aria-label": "Estado de la materia" },
      ...opciones.map(([valor, texto, ic]) => h("button", {
        type: "button", role: "radio", "data-v": valor, "aria-checked": String(actual === valor),
        tabindex: actual === valor ? 0 : -1, onclick: () => setEstado(m, valor, { desdeFicha: true }),
      }, ic ? icono(ic, 14) : null, texto)));
    grupo.addEventListener("keydown", (e) => {
      const i = opciones.findIndex(([valor]) => valor === estado(m));
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setEstado(m, opciones[(i + 1) % 3][0], { desdeFicha: true });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setEstado(m, opciones[(i + 2) % 3][0], { desdeFicha: true });
      }
    });
    return grupo;
  }

  function avisoDisponibilidad(m) {
    const e = estado(m);
    const faltan = faltantes(m);
    if (e === "aprobada") {
      return h("div", { class: "aviso ok" }, icono("doble", 16), h("span", {}, h("strong", { text: "Aprobada." }), " Ya la tenés."));
    }
    if (faltan.length) {
      const nombres = faltan.map((r) => `${S.M.porAp.get(r.ap).nombre} (${r.tipo})`).join(", ");
      return h("div", { class: "aviso" }, icono("candado", 16),
        h("span", {}, h("strong", { text: `Te ${faltan.length === 1 ? "falta" : "faltan"} ${plural(faltan.length, "correlativa", "correlativas")}: ` }), nombres));
    }
    if (e === "cursada") {
      return h("div", { class: "aviso ok" }, icono("check", 16), h("span", {}, h("strong", { text: "Cursada." }), " Ya la podés rendir."));
    }
    return h("div", { class: "aviso ok" }, icono("check", 16), h("span", {},
      h("strong", { text: "Disponible." }),
      S.hayCorrelativas ? " Tenés todas sus correlativas." : " No hay correlativas cargadas que la bloqueen."));
  }

  function itemRequisito(x, ok) {
    return h("li", {}, h("button", { class: "req-item", type: "button", style: { "--area": colorArea(x.areaId) }, onclick: () => abrirFicha(x) },
      h("i", { class: "dot" }), h("span", { class: "nombre", text: x.nombre }), h("span", { class: "id", text: dos(x.id) }),
      hayProgreso()
        ? (ok ? h("span", { class: "req-ok" }, icono("check", 13), "Cumplida") : h("span", { class: "req-falta" }, icono("candado", 13), "Falta"))
        : null));
  }

  function itemHabilita(x, tipo) {
    return h("li", {}, h("button", { class: "req-item", type: "button", style: { "--area": colorArea(x.areaId) }, onclick: () => abrirFicha(x) },
      h("i", { class: "dot" }), h("span", { class: "nombre", text: x.nombre }),
      h("span", { class: "pill-tipo" }, muestraLinea(tipo, 18), tipo === "aprobada" ? "la pide aprobada" : "la pide cursada")));
  }

  function miniMateria(x) {
    return h("button", { class: "mini-materia", type: "button", style: { "--area": colorArea(x.areaId) }, onclick: () => abrirFicha(x) },
      h("i", { class: "dot" }), x.nombre);
  }

  function panelApiFicha(m) {
    const rutas = [`/asignatura/${m.id}`, `/asignaturaplan/${m.id}`, `/correlativas/?asignatura_id=${m.id}`];
    const salida = h("div", { class: "ficha-api-salida" });
    const cargar = async (ruta) => {
      salida.classList.add("cargando");
      try {
        const r = await API.pedir(ruta);
        salida.replaceChildren(
          h("div", { class: "resp-meta" }, pildoraHttp(r.res.status, r.res.statusText), h("span", {}, icono("reloj", 14), `${Math.round(r.ms)} ms`), h("span", { text: kb(r.bytes) })),
          vistaCodigo(r.datos !== null ? JSON.stringify(r.datos, null, 2) : r.texto, r.datos !== null));
      } catch (error) {
        salida.replaceChildren(h("p", { class: "muted", text: `No hubo respuesta: ${error.message}` }));
      } finally {
        salida.classList.remove("cargando");
      }
    };
    const pestanas = h("div", { class: "tabs", role: "tablist", "aria-label": "Endpoints de esta materia" },
      ...rutas.map((ruta, i) => h("button", {
        class: "tab", type: "button", role: "tab", "aria-selected": String(i === 0),
        onclick: (e) => {
          for (const b of $$(".tab", pestanas)) b.setAttribute("aria-selected", String(b === e.currentTarget));
          cargar(ruta);
        },
      }, h("code", { text: ruta }))));
    cargar(rutas[0]);
    return h("div", { class: "ficha-api" }, pestanas, salida,
      h("button", {
        class: "btn btn-ghost btn-sm", type: "button", style: { marginTop: "12px" },
        onclick: () => explorar("/asignatura/{asignatura_id}", { asignatura_id: m.id }),
      }, "Abrir en el explorador", icono("flecha", 14)));
  }

  // ───────────────────────── progreso ─────────────────────────
  function renderProgreso({ accion = false } = {}) {
    const { M } = S;
    const total = M.materias.length;
    const cuenta = { aprobada: 0, cursada: 0, pendiente: 0 };
    for (const m of M.materias) cuenta[estado(m)] += 1;
    const porcentaje = total ? Math.round((cuenta.aprobada / total) * 100) : 0;
    $("#prog-pct").textContent = `${porcentaje}%`;
    const medidor = $("#prog-meter");
    medidor.setAttribute("aria-label", `${cuenta.aprobada} aprobadas, ${cuenta.cursada} cursadas y ${cuenta.pendiente} pendientes, de ${total}`);
    medidor.replaceChildren(...["aprobada", "cursada", "pendiente"].filter((k) => cuenta[k])
      .map((k) => h("i", { class: `m-${k}`, style: { flex: `${cuenta[k]} 1 0px` } })));
    $("#prog-leyenda").replaceChildren(...[["aprobada", "Aprobadas"], ["cursada", "Cursadas"], ["pendiente", "Pendientes"]]
      .map(([k, texto]) => h("li", {},
        h("i", { class: `sw${k === "pendiente" ? " sw-track" : ""}`, style: { "--area": `var(--prog-${k === "pendiente" ? "track" : k})` } }),
        texto, h("strong", { text: cuenta[k] }))));

    const cursar = M.materias.filter(puedeCursar);
    const rendir = M.materias.filter(puedeRendir);
    const bloqueadas = M.materias.filter((m) => estado(m) === "pendiente" && !puedeCursar(m));
    $("#n-cursar").textContent = cursar.length;
    $("#n-rendir").textContent = rendir.length;
    $("#n-bloqueadas").textContent = bloqueadas.length;
    $("#nota-cursar").textContent = S.hayCorrelativas
      ? "Pendientes que ya tienen todas sus correlativas."
      : "Como no hay correlatividades cargadas, todas las pendientes aparecen disponibles.";
    llenarLista("#lista-cursar", cursar, cuenta.pendiente ? "Ninguna por ahora." : "No te queda nada por cursar.");
    llenarLista("#lista-rendir", rendir, "Ninguna: marcá materias como cursadas.");
    llenarLista("#lista-bloqueadas", bloqueadas, S.hayCorrelativas ? "Nada bloqueado." : "Sin correlatividades cargadas, nada está bloqueado.");
    $("#btn-reiniciar").disabled = !hayProgreso();
    if (accion && total && cuenta.aprobada === total) {
      confeti();
      avisar("¡Aprobaste todo el plan!", "ok");
    }
  }

  /** Lista de materias en píldoras; si son muchas muestra las primeras y un botón para ver el resto. */
  function llenarLista(selector, materias, vacio) {
    const caja = $(selector);
    if (!materias.length) {
      caja.replaceChildren(h("p", { class: "vacio", text: vacio }));
      return;
    }
    const LIMITE = 6;
    const botones = materias.map((m) => {
      const boton = miniMateria(m);
      if (selector === "#lista-bloqueadas") {
        tip.enlazar(boton, () => contenidoTip("Le falta", faltantes(m).map((r) => S.M.porAp.get(r.ap).nombre).join(", ")));
      }
      return boton;
    });
    if (botones.length <= LIMITE + 1) {
      caja.replaceChildren(...botones);
      return;
    }
    const abierta = S.listasAbiertas.has(selector);
    const alternar = h("button", {
      class: "mini-materia mas", type: "button", "aria-expanded": String(abierta),
      onclick: () => {
        if (abierta) S.listasAbiertas.delete(selector);
        else S.listasAbiertas.add(selector);
        llenarLista(selector, materias, vacio);
        $(".mas", caja).focus();
      },
    }, abierta ? "Ver menos" : `y ${botones.length - LIMITE} más`);
    caja.replaceChildren(...(abierta ? botones : botones.slice(0, LIMITE)), alternar);
  }

  // ───────────────────────── datos (gráficos y catálogos) ─────────────────────────
  function tarjeta({ ancho, icon, titulo, sub, endpoints = [], cuerpo, tabla }) {
    return h("article", { class: `glass spot tarjeta ${ancho}`, "data-reveal": "" },
      h("header", { class: "tarjeta-head" },
        h("span", { class: "tarjeta-ico" }, icono(icon, 18)),
        h("div", { class: "tarjeta-titulos" }, h("h3", { text: titulo }), sub ? h("p", { text: sub }) : null)),
      h("div", { class: "viz" }, cuerpo),
      tabla ? h("div", { class: "viz-tabla" }, tabla) : null,
      h("footer", { class: "tarjeta-pie" },
        ...endpoints.map(([ruta, valores]) => chipEndpoint(ruta, valores)),
        tabla ? botonTabla() : null));
  }

  function chipEndpoint(ruta, valores = {}) {
    const concreta = ruta.replace(/\{(\w+)\}/g, (_, nombre) => (valores[nombre] ?? `{${nombre}}`));
    return h("button", { class: "ep-chip", type: "button", title: "Probar en el explorador", onclick: () => explorar(ruta, valores) },
      h("span", { class: "ep-get", text: "GET" }), h("span", { text: concreta }));
  }

  function botonTabla() {
    return h("button", {
      class: "link-tabla", type: "button", "aria-pressed": "false",
      onclick: (e) => {
        const boton = e.currentTarget;
        const encendida = boton.closest(".tarjeta").classList.toggle("ver-tabla");
        boton.setAttribute("aria-pressed", String(encendida));
        boton.replaceChildren(icono(encendida ? "capas" : "tabla", 14), encendida ? "Ver gráfico" : "Ver tabla");
      },
    }, icono("tabla", 14), "Ver tabla");
  }

  function tablaDatos(columnas, filas) {
    return h("table", { class: "t" },
      h("thead", {}, h("tr", {}, ...columnas.map((c) => h("th", { scope: "col", class: c.n ? "n" : null, text: c.t })))),
      h("tbody", {}, ...filas.map((fila) => h("tr", {}, ...fila.map((v, i) => h("td", { class: columnas[i].n ? "n" : null, text: v }))))));
  }

  function leyendaAreas(areas) {
    return h("ul", { class: "leyenda" }, ...areas.map((a) => h("li", {}, h("i", { class: "sw", style: { "--area": colorArea(a.id) } }), a.nombre)));
  }

  function vizPorArea() {
    const { M } = S;
    const total = M.materias.length;
    const datos = M.areas.map((a) => ({ a, n: M.materias.filter((m) => m.areaId === a.id).length })).filter((x) => x.n);
    const pct = (n) => `${Math.round((n / total) * 100)}%`;
    const barra = h("div", { class: "stack", role: "img", "aria-label": datos.map((x) => `${x.a.nombre}: ${x.n}`).join(", ") },
      ...datos.map((x) => {
        const segmento = h("div", { class: "seg", tabindex: 0, style: { "--area": colorArea(x.a.id), flex: `${x.n} 1 0px` } });
        tip.enlazar(segmento, () => contenidoTip(`${plural(x.n, "materia", "materias")} · ${pct(x.n)}`, x.a.nombre, colorArea(x.a.id)));
        return segmento;
      }));
    // La leyenda lleva los valores: identifica cada color y a la vez etiqueta la barra.
    const leyenda = h("ul", { class: "leyenda-valores" }, ...datos.map((x) => h("li", {},
      h("i", { class: "sw", style: { "--area": colorArea(x.a.id) } }),
      h("span", { text: x.a.nombre }),
      h("strong", { text: x.n }),
      h("span", { class: "pct", text: pct(x.n) }))));
    return {
      viz: [barra, leyenda],
      tabla: tablaDatos([{ t: "Área" }, { t: "Materias", n: true }, { t: "%", n: true }], datos.map((x) => [x.a.nombre, x.n, pct(x.n)])),
    };
  }

  function vizPorPeriodo() {
    const { M } = S;
    const columnas = M.periodos.map((p) => {
      const delPeriodo = M.materias.filter((m) => m.periodoId === p.id);
      return {
        p,
        total: delPeriodo.length,
        partes: M.areas.map((a) => ({ a, n: delPeriodo.filter((m) => m.areaId === a.id).length })).filter((x) => x.n),
      };
    });
    const tope = Math.max(1, ...columnas.map((c) => c.total));
    const paso = tope > 8 ? 2 : 1;
    const techo = Math.ceil(tope / paso) * paso;
    const marcas = [];
    for (let v = 0; v <= techo; v += paso) marcas.push(v);
    const alto = (v) => `${(v / techo) * 100}%`;
    const etiquetaX = (p) => (p.corto === "TF" ? "Trabajo final" : `${p.corto} cuatr.`);

    const grafico = h("div", { class: "cc" },
      h("div", { class: "cc-y", "aria-hidden": "true" }, ...marcas.map((v) => h("span", { style: { bottom: alto(v) }, text: v }))),
      h("div", { class: "cc-plot", role: "img", "aria-label": columnas.map((c) => `${c.p.nombre}: ${c.total}`).join(", ") },
        ...marcas.slice(1).map((v) => h("i", { class: "cc-grid", style: { bottom: alto(v) } })),
        ...columnas.map((c) => h("div", { class: "cc-col", style: { "--h": alto(c.total) } },
          ...c.partes.map((x) => {
            const segmento = h("div", { class: "cc-seg", tabindex: 0, style: { "--area": colorArea(x.a.id), flex: `${x.n} 1 0px` } });
            tip.enlazar(segmento, () => contenidoTip(plural(x.n, "materia", "materias"), `${c.p.nombre} · ${x.a.nombre}`, colorArea(x.a.id)));
            return segmento;
          }),
          h("span", { class: "cc-total", text: c.total })))),
      h("div", { class: "cc-x", "aria-hidden": "true" }, ...columnas.map((c) => h("span", { text: etiquetaX(c.p) }))));
    return {
      viz: [grafico, leyendaAreas(M.areas.filter((a) => M.materias.some((m) => m.areaId === a.id)))],
      tabla: tablaDatos(
        [{ t: "Período" }, ...M.areas.map((a) => ({ t: areaCorta(a.nombre), n: true })), { t: "Total", n: true }],
        columnas.map((c) => [c.p.nombre, ...M.areas.map((a) => (c.partes.find((x) => x.a.id === a.id) || { n: 0 }).n), c.total])),
    };
  }

  function vizFilas() {
    const tablas = Object.entries(S.d.estado.tablas).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const maximo = Math.max(1, ...tablas.map(([, n]) => n));
    const filas = tablas.map(([tabla, n]) => {
      const fila = h("div", { class: "hb-row", role: "listitem", tabindex: 0 },
        h("span", { class: "hb-name", text: tabla }),
        h("span", { class: "hb-track" }, h("span", { class: "hb-bar", style: { "--area": "var(--accent)", "--w": `${(n / maximo) * 100}%` } })),
        h("span", { class: "hb-val", text: n }));
      tip.enlazar(fila, () => contenidoTip(plural(n, "fila", "filas"), `Tabla ${tabla}`, "var(--accent)"));
      return fila;
    });
    return {
      viz: h("div", { class: "hbars", role: "list", "aria-label": "Filas por tabla" }, ...filas),
      tabla: tablaDatos([{ t: "Tabla" }, { t: "Filas", n: true }], tablas),
    };
  }

  function renderDatos() {
    const { d, M } = S;
    const plan = d.plan;
    const institucion = d.instituciones.find((i) => i.id === plan.institucion_id) || d.instituciones[0];
    const carrera = d.carreras.find((c) => c.id === plan.carrera_id) || d.carreras[0];
    const porArea = vizPorArea();
    const porPeriodo = vizPorPeriodo();
    const filas = vizFilas();
    const contar = (filtro) => plural(M.materias.filter(filtro).length, "materia", "materias");

    const tipos = d.tipos.map((t) => {
      const tipo = /aprob/i.test(t.nombre) ? "aprobada" : "cursada";
      const descripcion = /aprob/i.test(t.nombre)
        ? "Hay que tener el final aprobado."
        : /curs/i.test(t.nombre) ? "Alcanza con tenerla cursada (regularizada)." : "";
      return h("div", { class: "tipo-fila" },
        muestraLinea(tipo, 40, "var(--accent)"),
        h("div", {}, h("strong", { text: t.nombre }), descripcion ? h("p", { text: descripcion }) : null),
        h("span", { class: "cuenta", text: d.correlativas.filter((c) => c.tipocorrelativa_id === t.id).length }));
    });

    const [porAreaT, porPeriodoT, filasT, correlativasT, institucionT, carreraT, planT, regimenT, periodosT, areasT, relacionT, archivosT] = [
      tarjeta({
        ancho: "span-4", icon: "capas", titulo: "Materias por área", sub: "Cuánto pesa cada área en el plan.",
        endpoints: [["/asignaturasplan/{plan_estudio_id}", { plan_estudio_id: plan.id }]], cuerpo: porArea.viz, tabla: porArea.tabla,
      }),
      tarjeta({
        ancho: "span-8", icon: "calendario", titulo: "Materias por período", sub: "Cuántas se cursan en cada período, por área.",
        endpoints: [["/asignaturasplan/periodo/{periodo_cursado_id}", { periodo_cursado_id: M.periodos[0].id }]],
        cuerpo: porPeriodo.viz, tabla: porPeriodo.tabla,
      }),
      tarjeta({
        ancho: "span-5", icon: "base", titulo: "Filas por tabla", sub: "Lo que hay hoy en db/Facultad.db.",
        endpoints: [["/estado", {}]], cuerpo: filas.viz, tabla: filas.tabla,
      }),
      tarjeta({
        ancho: "", icon: "grafo", titulo: "Correlatividades",
        sub: S.hayCorrelativas
          ? `${plural(M.aristas.length, "correlatividad cargada", "correlatividades cargadas")} en el plan.`
          : "Los tipos están definidos, pero la tabla Correlativa está vacía.",
        endpoints: [["/tipocorrelativa/", {}], ["/correlativas/", {}]], cuerpo: h("div", { class: "tipos" }, ...tipos),
      }),
      tarjeta({
        ancho: "span-4", icon: "edificio", titulo: "Institución", endpoints: [["/institucion/", {}]],
        cuerpo: [
          h("p", { class: "dato-grande", text: institucion.nombre }),
          h("p", { class: "dato-linea" }, icono("pin", 15), institucion.domicilio),
          h("div", { class: "acciones" }, h("a", {
            class: "btn btn-ghost btn-sm", target: "_blank", rel: "noopener",
            href: `https://www.openstreetmap.org/search?query=${encodeURIComponent(institucion.domicilio)}`,
          }, icono("mapa", 14), "Ver en el mapa")),
        ],
      }),
      tarjeta({
        ancho: "span-4", icon: "birrete", titulo: "Carrera", endpoints: [["/carrera/", {}]],
        cuerpo: [h("p", { class: "dato-grande", text: carrera.nombre }), h("p", { class: "muted", text: carrera.descripcion })],
      }),
      tarjeta({
        ancho: "span-4", icon: "libro", titulo: "Plan de estudio", endpoints: [["/planestudio/", {}]],
        cuerpo: [
          h("p", { class: "dato-grande", text: plan.plan_estudio }),
          h("dl", { class: "kv" },
            h("dt", { text: "Régimen" }), h("dd", { text: plan.regimen_cursado }),
            h("dt", { text: "Períodos" }), h("dd", { text: plan.periodos }),
            h("dt", { text: "Inicio" }), h("dd", { text: plan.inicio }),
            h("dt", { text: "Fin" }), h("dd", { text: plan.fin ?? "Vigente" })),
        ],
      }),
      tarjeta({
        ancho: "span-4", icon: "reloj", titulo: "Régimen de cursado", endpoints: [["/regimencursado/", {}]],
        cuerpo: [
          h("div", { class: "regimenes" }, ...d.regimenes.map((r) => {
            const delPlan = r.id === plan.regimen_cursado_id;
            return h("span", { class: `regimen${delPlan ? " is-on" : ""}` }, delPlan ? icono("check", 14) : null, r.nombre);
          })),
          h("p", { class: "small muted", text: `Resaltado: el que usa el ${plan.plan_estudio}.` }),
        ],
      }),
      tarjeta({
        ancho: "span-4", icon: "lista", titulo: "Períodos de cursado", endpoints: [["/periodocursado/", {}]],
        cuerpo: h("ul", { class: "lista-simple" }, ...d.periodos.map((p) => {
          const delPlan = M.periodos.find((x) => x.id === p.id);
          return h("li", {},
            h("span", { class: "num-badge", text: delPlan ? delPlan.corto : "–" }),
            h("button", {
              class: "link-lista", type: "button", title: `Consultar /asignaturasplan/periodo/${p.id}`,
              onclick: () => explorar("/asignaturasplan/periodo/{periodo_cursado_id}", { periodo_cursado_id: p.id }),
            }, p.nombre),
            h("span", { class: "fin", text: contar((m) => m.periodoId === p.id) }));
        })),
      }),
      tarjeta({
        ancho: "span-4", icon: "capas", titulo: "Áreas académicas", endpoints: [["/areaacademica/", {}]],
        cuerpo: h("ul", { class: "lista-simple" }, ...M.areas.map((a) => h("li", {},
          h("i", { class: "sw", style: { "--area": colorArea(a.id) } }),
          h("button", {
            class: "link-lista", type: "button", title: `Consultar /asignaturasplan/area/${a.id}`,
            onclick: () => explorar("/asignaturasplan/area/{area_academica_id}", { area_academica_id: a.id }),
          }, a.nombre),
          h("span", { class: "fin", text: contar((m) => m.areaId === a.id) })))),
      }),
      tarjeta({
        ancho: "span-12", icon: "enlace", titulo: "Carreras por institución", sub: "Qué carreras dicta cada institución.",
        endpoints: [["/carrerainstitucion/", {}]],
        cuerpo: d.carreraInstitucion.map((r) => h("div", { class: "relacion" },
          h("span", { class: "nodo" }, icono("edificio", 14), " ", r.institucion),
          h("span", { class: "enlace", "aria-hidden": "true" }),
          h("span", { class: "nodo" }, icono("birrete", 14), " ", r.carrera))),
      }),
      tarjeta({
        ancho: "", icon: "descargar", titulo: "Archivos", sub: "Institucion.json se arma desde la base en cada pedido.",
        endpoints: [["/finstitucion", {}], ["/jinstitucion", {}]],
        cuerpo: h("div", { class: "acciones" },
          h("a", { class: "btn btn-ghost btn-sm", href: API.url("/finstitucion"), download: "Institucion.json" }, icono("descargar", 14), "Descargar Institucion.json"),
          h("a", { class: "btn btn-ghost btn-sm", href: API.url("/jinstitucion"), target: "_blank", rel: "noopener" }, icono("externo", 14), "Verlo en el navegador")),
      }),
    ];
    $("#bento").replaceChildren(
      porPeriodoT, porAreaT,
      filasT, h("div", { class: "bento-pila span-7" }, correlativasT, archivosT),
      institucionT, carreraT, planT,
      periodosT, areasT, regimenT,
      relacionT);
    observarReveal($$("#bento [data-reveal]"));
  }

  // ───────────────────────── explorador de la API ─────────────────────────
  const OPCIONES = {
    asignatura_id: () => S.d.asignaturas.map((a) => [a.id, a.nombre]),
    plan_estudio_id: () => S.d.planes.map((p) => [p.id, p.plan_estudio]),
    periodo_cursado_id: () => S.d.periodos.map((p) => [p.id, p.nombre]),
    area_academica_id: () => S.d.areas.map((a) => [a.id, a.nombre]),
    tipocorrelativa_id: () => S.d.tipos.map((t) => [t.id, t.nombre]),
  };

  function tipoDe(schema) {
    if (!schema) return "string";
    if (schema.type) return schema.type;
    const opcion = (schema.anyOf || []).find((x) => x.type && x.type !== "null");
    return opcion ? opcion.type : "string";
  }

  function renderExplorador() {
    const spec = S.d.openapi;
    if (!spec || !spec.paths) {
      $("#ex-endpoints").replaceChildren(h("p", { class: "muted small", text: "No se pudo leer /openapi.json." }));
      return;
    }
    const ordenTags = (spec.tags || []).map((t) => t.name);
    const indice = (tag) => (ordenTags.includes(tag) ? ordenTags.indexOf(tag) : 99);
    S.endpoints = [];
    for (const [ruta, operaciones] of Object.entries(spec.paths)) {
      for (const [metodo, op] of Object.entries(operaciones)) {
        S.endpoints.push({
          ruta,
          metodo: metodo.toUpperCase(),
          resumen: op.summary || ruta,
          tag: (op.tags && op.tags[0]) || "Otros",
          params: (op.parameters || []).map((p) => ({ nombre: p.name, en: p.in, requerido: Boolean(p.required), tipo: tipoDe(p.schema) })),
        });
      }
    }
    S.endpoints.sort((a, b) => indice(a.tag) - indice(b.tag));
    $("#ex-filtro").addEventListener("input", (e) => dibujarListaEndpoints(e.target.value));
    const inicial = S.endpoints.find((e) => e.ruta === "/asignaturasplan/{plan_estudio_id}") || S.endpoints[0];
    if (inicial) seleccionarEndpoint(inicial, { plan_estudio_id: S.d.plan.id }, true);
  }

  function dibujarListaEndpoints(filtro = "") {
    const q = normalizar(filtro);
    const visibles = S.endpoints.filter((e) => !q || normalizar(`${e.ruta} ${e.resumen} ${e.tag}`).includes(q));
    const grupos = [];
    for (const e of visibles) {
      let grupo = grupos.find((g) => g.tag === e.tag);
      if (!grupo) grupos.push((grupo = { tag: e.tag, items: [] }));
      grupo.items.push(e);
    }
    $("#ex-endpoints").replaceChildren(...(grupos.length
      ? grupos.flatMap((g) => [
        h("p", { class: "ex-grupo", text: g.tag }),
        ...g.items.map((e) => h("button", {
          class: `ex-item${S.ep === e ? " is-on" : ""}`, type: "button", title: `${e.metodo} ${e.ruta}`,
          "aria-current": S.ep === e ? "true" : null,
          onclick: () => seleccionarEndpoint(e, {}, true),
        }, h("span", { class: "metodo", text: e.metodo }), h("code", { text: e.ruta }), h("small", { text: e.resumen }))),
      ])
      : [h("p", { class: "muted small", text: "Ningún endpoint coincide." })]));
  }

  function campoParametro(p, valor) {
    const id = `p-${p.nombre}`;
    const opciones = OPCIONES[p.nombre] ? OPCIONES[p.nombre]() : [];
    const inicial = valor ?? (p.requerido && opciones.length ? opciones[0][0] : "");
    const ayuda = h("span", { class: "campo-ayuda", id: `${id}-ayuda` });
    const entrada = h("input", {
      id, name: p.nombre, type: p.tipo === "integer" ? "number" : "text", value: inicial,
      list: opciones.length ? `${id}-lista` : null, placeholder: p.requerido ? "obligatorio" : "opcional",
      required: p.requerido, autocomplete: "off", "aria-describedby": `${id}-ayuda`,
    });
    const describir = () => {
      const texto = entrada.value.trim();
      const opcion = opciones.find(([v]) => String(v) === texto);
      if (opcion) ayuda.textContent = opcion[1];
      else if (texto) ayuda.textContent = opciones.length ? "No está en la base: debería dar 404" : "";
      else ayuda.textContent = p.requerido ? "" : "Vacío: sin filtrar";
    };
    entrada.addEventListener("input", describir);
    describir();
    return h("label", { class: "campo", for: id },
      h("span", { class: "campo-nombre" },
        h("code", { text: p.nombre }),
        h("span", { class: "campo-en", text: p.en === "path" ? "ruta" : "query" }),
        p.requerido ? h("span", { class: "campo-req", text: "obligatorio" }) : null),
      entrada,
      opciones.length ? h("datalist", { id: `${id}-lista` }, ...opciones.map(([v, t]) => h("option", { value: v, label: t }))) : null,
      ayuda);
  }

  function seleccionarEndpoint(ep, valores = {}, enviarYa = false) {
    S.ep = ep;
    dibujarListaEndpoints($("#ex-filtro").value);
    const formulario = h("form", { class: "ex-form", onsubmit: (e) => { e.preventDefault(); enviar(); } },
      ...ep.params.map((p) => campoParametro(p, valores[p.nombre])),
      h("div", { class: "ex-acciones" },
        h("button", { class: "btn btn-primary btn-sm", type: "submit" }, icono("play", 13), "Enviar"),
        h("a", { class: "btn btn-ghost btn-sm", id: "ex-abrir", target: "_blank", rel: "noopener" }, icono("externo", 13), "Abrir en una pestaña"),
        h("button", { class: "btn btn-ghost btn-sm", type: "button", onclick: () => copiar(API.url(rutaActual()), "URL copiada") }, icono("enlace", 13), "Copiar URL")));
    formulario.addEventListener("input", actualizarUrl);
    $("#ex-main").replaceChildren(
      h("div", { class: "ex-head" }, h("span", { class: "metodo", text: ep.metodo }), h("code", { class: "ex-url", id: "ex-url" })),
      h("p", { class: "ex-resumen", text: ep.resumen }),
      formulario,
      h("div", { class: "ex-respuesta", id: "ex-respuesta" },
        h("div", { class: "ex-vacio" }, icono("play", 20), h("span", { text: "Mandá la consulta para ver la respuesta." }))));
    actualizarUrl();
    if (enviarYa) enviar();
  }

  function rutaActual() {
    let ruta = S.ep.ruta;
    const query = new URLSearchParams();
    for (const p of S.ep.params) {
      const valor = ($(`#p-${p.nombre}`)?.value || "").trim();
      if (p.en === "path") ruta = ruta.replace(`{${p.nombre}}`, valor ? encodeURIComponent(valor) : `{${p.nombre}}`);
      else if (valor) query.set(p.nombre, valor);
    }
    const qs = query.toString();
    return qs ? `${ruta}?${qs}` : ruta;
  }

  function actualizarUrl() {
    const url = $("#ex-url");
    if (!url) return;
    const ruta = rutaActual();
    url.replaceChildren(h("span", { class: "base", text: API.base || location.origin }), ruta);
    $("#ex-abrir").href = API.url(ruta);
  }

  async function enviar() {
    const ruta = rutaActual();
    const panel = $("#ex-respuesta");
    const valores = Object.fromEntries(S.ep.params.map((p) => [p.nombre, ($(`#p-${p.nombre}`)?.value || "").trim()]));
    panel.classList.add("cargando");
    try {
      const r = await API.pedir(ruta);
      S.historial = [{ ep: S.ep, ruta, valores, status: r.res.status, ms: r.ms }, ...S.historial].slice(0, 6);
      panel.replaceChildren(vistaRespuesta(r, ruta));
      dibujarHistorial();
    } catch (error) {
      panel.replaceChildren(h("div", { class: "ex-vacio" }, icono("alerta", 20), h("span", { text: `No hubo respuesta: ${error.message}` })));
    } finally {
      panel.classList.remove("cargando");
    }
  }

  function pildoraHttp(status, texto) {
    const clase = status < 300 ? "ok" : status < 500 ? "aviso-http" : "mal";
    return h("span", { class: `http ${clase}` }, icono(status < 300 ? "check" : status < 500 ? "alerta" : "cerrar", 13), `${status} ${texto || ""}`.trim());
  }

  function vistaRespuesta(r, ruta) {
    const tipo = (r.res.headers.get("content-type") || "").split(";")[0];
    const disposicion = r.res.headers.get("content-disposition") || "";
    const archivo = (/filename="?([^";]+)"?/i.exec(disposicion) || [])[1];
    const meta = h("div", { class: "resp-meta" },
      pildoraHttp(r.res.status, r.res.statusText),
      h("span", {}, icono("reloj", 14), `${Math.round(r.ms)} ms`),
      h("span", {}, icono("base", 14), kb(r.bytes)),
      tipo ? h("span", { class: "muted", text: tipo }) : null,
      archivo ? h("a", { class: "btn btn-ghost btn-sm", href: API.url(ruta), download: archivo }, icono("descargar", 13), `Descargar ${archivo}`) : null);
    const contenido = h("div", { class: "panel-codigo" });
    const vistas = [["JSON", "llaves"], ["Tabla", "tabla"], ["cURL", "terminal"], ["fetch", "codigo"]];
    const pestanas = h("div", { class: "tabs", role: "tablist", "aria-label": "Formato de la respuesta" },
      ...vistas.map(([nombre, ic]) => h("button", {
        class: "tab", type: "button", role: "tab", "data-vista": nombre, onclick: () => mostrar(nombre),
      }, icono(ic, 13), nombre)));
    const mostrar = (cual) => {
      for (const b of $$(".tab", pestanas)) b.setAttribute("aria-selected", String(b.dataset.vista === cual));
      let texto = "";
      let vista;
      if (cual === "JSON") {
        texto = r.datos !== null ? JSON.stringify(r.datos, null, 2) : r.texto;
        vista = vistaCodigo(texto, r.datos !== null);
      } else if (cual === "Tabla") {
        vista = vistaTabla(r.datos);
      } else if (cual === "cURL") {
        texto = `curl -s "${API.url(ruta)}"`;
        vista = vistaCodigo(texto, false);
      } else {
        texto = `const respuesta = await fetch("${API.url(ruta)}");\nconst datos = await respuesta.json();\nconsole.log(datos);`;
        vista = vistaCodigo(texto, false);
      }
      contenido.replaceChildren(vista, texto ? h("button", { class: "copiar", type: "button", onclick: () => copiar(texto) }, icono("copiar", 13), "Copiar") : null);
    };
    mostrar("JSON");
    return h("div", {}, meta, pestanas, contenido);
  }

  function resaltarJSON(texto) {
    const token = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
    return escaparHTML(texto).replace(token, (m) => {
      let clase = "j-num";
      if (m.startsWith('"')) clase = /:\s*$/.test(m) ? "j-key" : "j-str";
      else if (m === "true" || m === "false") clase = "j-bool";
      else if (m === "null") clase = "j-null";
      return `<span class="${clase}">${m}</span>`;
    });
  }

  function vistaCodigo(texto, esJSON) {
    const html = esJSON ? resaltarJSON(texto) : escaparHTML(texto);
    const pre = h("pre", { class: "json", tabindex: 0 });
    // El HTML es seguro: el texto se escapó antes de envolverlo en <span>.
    pre.innerHTML = html.split("\n").map((linea) => `<span class="l">${linea || " "}</span>`).join("");
    return pre;
  }

  function vistaTabla(datos) {
    const celda = (v) => (v === null ? "null" : typeof v === "object" ? JSON.stringify(v) : String(v));
    if (Array.isArray(datos) && datos.length && datos.every((x) => x && typeof x === "object" && !Array.isArray(x))) {
      const columnas = [...new Set(datos.flatMap((x) => Object.keys(x)))];
      return h("div", { class: "tabla-scroll" }, h("table", { class: "t" },
        h("thead", {}, h("tr", {}, ...columnas.map((c) => h("th", { scope: "col", text: c })))),
        h("tbody", {}, ...datos.map((fila) => h("tr", {}, ...columnas.map((c) => h("td", { class: typeof fila[c] === "number" ? "n" : null, text: celda(fila[c]) })))))));
    }
    if (datos && typeof datos === "object" && !Array.isArray(datos)) {
      return h("div", { class: "tabla-scroll" }, h("table", { class: "t" },
        h("tbody", {}, ...Object.entries(datos).map(([k, v]) => h("tr", {}, h("th", { scope: "row", text: k }), h("td", { text: celda(v) }))))));
    }
    return h("div", { class: "ex-vacio" }, icono("tabla", 20),
      h("span", { text: Array.isArray(datos) ? "La respuesta es una lista vacía." : "Esta respuesta no se puede mostrar como tabla." }));
  }

  function dibujarHistorial() {
    const caja = $("#ex-historial");
    caja.hidden = !S.historial.length;
    caja.replaceChildren(h("h4", { text: "Historial" }), ...S.historial.map((item) => h("button", {
      class: "hist-item", type: "button", onclick: () => seleccionarEndpoint(item.ep, item.valores, true),
    }, h("span", { class: `http mini ${item.status < 300 ? "ok" : item.status < 500 ? "aviso-http" : "mal"}`, text: item.status }),
      h("code", { text: item.ruta }), h("span", { class: "muted", text: `${Math.round(item.ms)} ms` }))));
  }

  function explorar(ruta, valores = {}) {
    const ep = S.endpoints.find((e) => e.ruta === ruta);
    if (!ep) return;
    cerrarFicha();
    cerrarPaleta();
    seleccionarEndpoint(ep, valores, true);
    irA("#api");
  }

  // ───────────────────────── buscador (Ctrl+K) ─────────────────────────
  function prepararComandos() {
    const { M } = S;
    S.comandos = [
      ...[["#plan", "Plan de estudio", "lista"], ["#progreso", "Mi progreso", "objetivo"], ["#datos", "Datos", "capas"], ["#api", "Explorador de la API", "codigo"]]
        .map(([selector, titulo, ic]) => ({ grupo: "Secciones", titulo, detalle: "Ir a la sección", icono: ic, accion: () => irA(selector) })),
      ...M.materias.map((m) => ({
        grupo: "Materias", titulo: m.nombre, detalle: `${m.periodo} · ${m.area}`, icono: "libro", color: colorArea(m.areaId), accion: () => abrirFicha(m),
      })),
      ...S.endpoints.map((e) => ({ grupo: "Endpoints", titulo: `${e.metodo} ${e.ruta}`, detalle: e.resumen, icono: "codigo", accion: () => explorar(e.ruta) })),
      { grupo: "Acciones", titulo: "Cambiar el tema (claro u oscuro)", detalle: "Apariencia", icono: "sol", accion: alternarTema },
      {
        grupo: "Acciones", titulo: S.modoProgreso ? "Desactivar el modo progreso" : "Activar el modo progreso", detalle: "Marcar materias con un clic", icono: "objetivo",
        accion: () => { setModoProgreso(!S.modoProgreso); irA("#plan"); },
      },
      ...(S.hayCorrelativas
        ? [{ grupo: "Acciones", titulo: "Mostrar u ocultar todas las correlatividades", detalle: "Tablero", icono: "grafo", accion: () => { setVerTodas(!S.verTodas); irA("#plan"); } }]
        : []),
      { grupo: "Acciones", titulo: "Reiniciar mi progreso", detalle: "Se puede deshacer", icono: "reiniciar", accion: reiniciarProgreso },
      { grupo: "Acciones", titulo: "Abrir la documentación (/docs)", detalle: "Swagger", icono: "externo", accion: () => window.open(API.url("/docs"), "_blank", "noopener") },
    ];
  }

  /** Coincidencia aproximada: primero el texto tal cual (mejor si empieza una palabra), después letras en orden. */
  function puntaje(texto, q) {
    const i = texto.indexOf(q);
    if (i >= 0) return 200 - i + (i === 0 || texto[i - 1] === " " ? 50 : 0);
    let posicion = -1;
    let saltos = 0;
    for (const letra of q) {
      const j = texto.indexOf(letra, posicion + 1);
      if (j < 0) return -1;
      saltos += j - posicion - 1;
      posicion = j;
    }
    // Letras demasiado separadas ya no son una coincidencia útil.
    if (saltos > q.length * 2 + 4) return -1;
    return Math.max(1, 100 - saltos);
  }

  function abrirPaleta() {
    if (!S.M) return;
    prepararComandos();
    const paleta = $("#paleta");
    if (!paleta.classList.contains("open")) S.volverPaleta = document.activeElement;
    paleta.classList.add("open");
    paleta.removeAttribute("inert");
    paleta.setAttribute("aria-hidden", "false");
    const entrada = $("#paleta-texto");
    entrada.value = "";
    filtrarPaleta("");
    entrada.focus();
  }

  function cerrarPaleta() {
    const paleta = $("#paleta");
    if (!paleta.classList.contains("open")) return;
    paleta.classList.remove("open");
    paleta.setAttribute("inert", "");
    paleta.setAttribute("aria-hidden", "true");
    if (S.volverPaleta && document.contains(S.volverPaleta)) S.volverPaleta.focus({ preventScroll: true });
  }

  function filtrarPaleta(texto) {
    const q = normalizar(texto);
    let resultados;
    if (!q) {
      const de = (grupo) => S.comandos.filter((c) => c.grupo === grupo);
      resultados = [...de("Secciones"), ...de("Acciones"), ...de("Materias").slice(0, 6)];
    } else {
      const puntuados = S.comandos
        .map((c) => ({ c, p: puntaje(normalizar(`${c.titulo} ${c.detalle || ""}`), q) }))
        .filter((x) => x.p >= 0)
        .sort((a, b) => b.p - a.p)
        .slice(0, 30);
      // Agrupa por tipo, en el orden del mejor resultado de cada grupo.
      const grupos = new Map();
      for (const { c } of puntuados) {
        if (!grupos.has(c.grupo)) grupos.set(c.grupo, []);
        grupos.get(c.grupo).push(c);
      }
      resultados = [...grupos.values()].flat();
    }
    S.resultados = resultados;
    S.activo = 0;
    dibujarPaleta();
  }

  function dibujarPaleta() {
    const lista = $("#paleta-lista");
    const entrada = $("#paleta-texto");
    if (!S.resultados.length) {
      lista.replaceChildren(h("p", { class: "paleta-vacia", text: "Sin resultados." }));
      entrada.removeAttribute("aria-activedescendant");
      return;
    }
    const nodos = [];
    let grupo = null;
    S.resultados.forEach((c, i) => {
      if (c.grupo !== grupo) {
        grupo = c.grupo;
        nodos.push(h("p", { class: "paleta-grupo", role: "presentation", text: grupo }));
      }
      nodos.push(h("div", {
        class: "paleta-item", id: `cmd-${i}`, role: "option", "aria-selected": String(i === S.activo),
        onclick: () => ejecutar(i),
        onpointermove: () => {
          if (S.activo !== i) {
            S.activo = i;
            marcarActivo(false);
          }
        },
      }, h("span", { class: "ico-caja", style: c.color ? { color: c.color } : null }, icono(c.icono, 16)),
        h("span", { class: "txt" }, h("strong", { text: c.titulo }), c.detalle ? h("small", { text: c.detalle }) : null)));
    });
    lista.replaceChildren(...nodos);
    marcarActivo(true);
  }

  function marcarActivo(desplazar) {
    for (const item of $$(".paleta-item", $("#paleta-lista"))) {
      const activo = item.id === `cmd-${S.activo}`;
      item.setAttribute("aria-selected", String(activo));
      if (activo && desplazar) item.scrollIntoView({ block: "nearest" });
    }
    $("#paleta-texto").setAttribute("aria-activedescendant", `cmd-${S.activo}`);
  }

  function ejecutar(i) {
    const comando = S.resultados[i];
    if (!comando) return;
    cerrarPaleta();
    comando.accion();
  }

  function tecladoPaleta(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!S.resultados.length) return;
      const paso = e.key === "ArrowDown" ? 1 : -1;
      S.activo = (S.activo + paso + S.resultados.length) % S.resultados.length;
      marcarActivo(true);
    } else if (e.key === "Enter") {
      e.preventDefault();
      ejecutar(S.activo);
    }
  }

  // ───────────────────────── pantalla de configuración ─────────────────────────
  const PASOS = {
    sinApi: [
      ["Abrí PowerShell en la carpeta del proyecto y activá el entorno virtual:", ".\\venv\\Scripts\\Activate.ps1"],
      ["Arrancá la API:", "fastapi dev main.py"],
      ["Abrí el front desde la API:", "http://127.0.0.1:8000"],
    ],
    sinBase: [
      ["Creá la base con el esquema:", '.\\sqlite3.exe .\\db\\Facultad.db ".read db/Carrera.sql"'],
      ["Cargá los datos:", "python CargaCarrera.py"],
      ["Recargá esta página.", null],
    ],
    sinDatos: [
      ["Cargá los datos:", "python CargaCarrera.py"],
      ["Recargá esta página.", null],
    ],
    error: [
      ["Revisá la terminal donde corre fastapi dev: ahí está el error completo.", null],
    ],
  };

  function mostrarSetup(titulo, detalle, pasos) {
    document.body.classList.remove("cargando");
    document.body.classList.add("modo-setup");
    estadoApi("error", "Sin datos", detalle || titulo);
    $("#marca-sub").textContent = "Falta configurar la API";
    $("#setup").replaceChildren(h("div", { class: "wrap" }, h("div", { class: "glass setup-card" },
      h("div", { class: "ico-grande" }, icono("alerta", 26)),
      h("h2", { text: titulo }),
      h("p", { class: "muted", text: "El front necesita que la API responda con datos. En PowerShell, desde la carpeta del proyecto:" }),
      detalle ? h("div", { class: "detalle", text: detalle }) : null,
      h("ol", { class: "pasos" }, ...pasos.map(([texto, comando]) => h("li", {}, h("div", {},
        h("p", { text: texto }),
        comando
          ? h("div", { class: "comando" }, h("code", { text: comando }),
            h("button", { class: "icon-btn", type: "button", "aria-label": `Copiar ${comando}`, onclick: () => copiar(comando) }, icono("copiar", 15)))
          : null)))),
      h("div", { class: "acciones" },
        h("button", { class: "btn btn-primary", type: "button", onclick: () => location.reload() }, icono("reiniciar", 16), "Reintentar")))));
  }

  // ───────────────────────── tema, animaciones y detalles ─────────────────────────
  function pintarBotonTema() {
    const oscuro = document.documentElement.dataset.theme !== "light";
    const boton = $("#btn-tema");
    const texto = oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
    boton.replaceChildren(icono(oscuro ? "sol" : "luna", 17));
    boton.setAttribute("aria-label", texto);
    boton.title = texto;
  }

  function alternarTema() {
    const nuevo = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nuevo;
    guardado.escribir("mapa.tema", nuevo);
    pintarBotonTema();
    actualizarTintas();
    $('meta[name="theme-color"]').setAttribute("content", nuevo === "light" ? "#f4f5fa" : "#06070c");
  }

  const observadorReveal = "IntersectionObserver" in window
    ? new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-in");
          observadorReveal.unobserve(entrada.target);
        }
      }
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 })
    : null;

  function observarReveal(elementos) {
    for (const el of elementos) {
      if (observadorReveal) observadorReveal.observe(el);
      else el.classList.add("is-in");
    }
  }

  function activarScrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    const enlaces = $$(".nav-links a");
    const espia = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        for (const a of enlaces) a.classList.toggle("is-active", a.getAttribute("href") === `#${entrada.target.id}`);
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    // El hero no tiene enlace propio: al verlo, ninguna sección queda marcada.
    for (const id of ["inicio", "plan", "progreso", "datos", "api"]) espia.observe(document.getElementById(id));
  }

  /** Brillo del borde que sigue al mouse en tarjetas y paneles. */
  function seguirMouse(e) {
    const el = e.target instanceof Element ? e.target.closest(".spot, .card") : null;
    if (!el) return;
    const caja = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - caja.left}px`);
    el.style.setProperty("--y", `${e.clientY - caja.top}px`);
  }

  function irA(selector) {
    const destino = document.querySelector(selector);
    if (destino) destino.scrollIntoView({ behavior: sinMovimiento() ? "auto" : "smooth", block: "start" });
  }

  function confeti() {
    if (sinMovimiento()) return;
    const lienzo = $("#confeti");
    const ctx = lienzo.getContext("2d");
    const escala = window.devicePixelRatio || 1;
    lienzo.width = innerWidth * escala;
    lienzo.height = innerHeight * escala;
    ctx.setTransform(escala, 0, 0, escala, 0, 0);
    lienzo.classList.add("on");
    const estilos = getComputedStyle(document.documentElement);
    const colores = ["--area-1", "--area-2", "--area-3", "--accent", "--prog-aprobada"].map((v) => estilos.getPropertyValue(v).trim());
    const piezas = Array.from({ length: 170 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 240,
      y: innerHeight * 0.38,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 15 - 5,
      giro: Math.random() * Math.PI,
      vGiro: (Math.random() - 0.5) * 0.3,
      ancho: 6 + Math.random() * 6,
      alto: 3 + Math.random() * 4,
      color: colores[Math.floor(Math.random() * colores.length)],
    }));
    const inicio = performance.now();
    const cuadro = (ahora) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of piezas) {
        p.vy += 0.36;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.giro += p.vGiro;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.giro);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.ancho / 2, -p.alto / 2, p.ancho, p.alto);
        ctx.restore();
      }
      if (ahora - inicio < 3400) {
        requestAnimationFrame(cuadro);
      } else {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        lienzo.classList.remove("on");
      }
    };
    requestAnimationFrame(cuadro);
  }

  function atraparFoco(e) {
    const abierto = $("#paleta").classList.contains("open") ? $("#paleta")
      : $("#ficha").classList.contains("open") ? $("#ficha") : null;
    if (!abierto) return;
    const enfocables = $$('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])', abierto)
      .filter((el) => el.getClientRects().length);
    if (!enfocables.length) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (!abierto.contains(document.activeElement)) {
      e.preventDefault();
      primero.focus();
    } else if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  }

  function conectarEventos() {
    $("#btn-buscar").addEventListener("click", abrirPaleta);
    $("#btn-tema").addEventListener("click", alternarTema);
    $("#velo").addEventListener("click", cerrarFicha);
    $("#paleta").addEventListener("click", (e) => { if (e.target === e.currentTarget) cerrarPaleta(); });
    $("#paleta-texto").addEventListener("input", (e) => filtrarPaleta(e.target.value));
    $("#paleta-texto").addEventListener("keydown", tecladoPaleta);
    $("#filtro-texto").addEventListener("input", (e) => {
      S.texto = e.target.value;
      aplicarFiltros();
    });
    $("#ver-todas").addEventListener("change", (e) => setVerTodas(e.target.checked));
    $("#modo-progreso").addEventListener("change", (e) => setModoProgreso(e.target.checked));
    $("#btn-modo-progreso").addEventListener("click", () => {
      setModoProgreso(!S.modoProgreso);
      if (S.modoProgreso) irA("#plan");
    });
    $("#btn-reiniciar").addEventListener("click", reiniciarProgreso);
    document.addEventListener("pointermove", seguirMouse, { passive: true });
    window.addEventListener("resize", () => {
      tip.ocultar();
      programarAristas();
    });
    document.addEventListener("keydown", (e) => {
      const activo = document.activeElement;
      const escribiendo = activo && (/^(INPUT|TEXTAREA|SELECT)$/.test(activo.tagName) || activo.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if ($("#paleta").classList.contains("open")) cerrarPaleta();
        else abrirPaleta();
      } else if (e.key === "/" && !escribiendo) {
        e.preventDefault();
        abrirPaleta();
      } else if (e.key === "Escape") {
        if ($("#paleta").classList.contains("open")) cerrarPaleta();
        else if ($("#ficha").classList.contains("open")) cerrarFicha();
      } else if (e.key === "Tab") {
        atraparFoco(e);
      }
    });
  }

  function renderTodo() {
    document.body.classList.remove("cargando", "modo-setup");
    estadoApi("ok", `API en línea · ${API.consultas} consultas · ${Math.round(S.d.ms)} ms`, `Datos de ${API.url("")}`);
    renderHero();
    renderMapa();
    renderFiltros();
    renderTablero();
    renderProgreso();
    renderDatos();
    renderExplorador();
    observarReveal($$("[data-reveal]"));
    activarScrollSpy();
    if (S.d.planes.length > 1) {
      $("#plan .section-head").append(h("label", { class: "selector-plan" }, "Plan: ",
        h("select", {
          onchange: (e) => {
            guardado.escribir("mapa.plan", Number(e.target.value));
            location.reload();
          },
        }, ...S.d.planes.map((p) => h("option", { value: p.id, selected: p.id === S.d.plan.id, text: `${p.plan_estudio} · ${p.carrera}` })))));
    }
  }

  async function iniciar() {
    pintarBotonTema();
    actualizarTintas();
    conectarEventos();
    if (!(await API.detectar())) {
      mostrarSetup("No encuentro la API",
        "Probé en esta misma dirección y en http://127.0.0.1:8000, y ninguna respondió.", PASOS.sinApi);
      return;
    }
    for (const enlace of $$("[data-api]")) enlace.href = API.url(enlace.dataset.api);
    try {
      await cargarDatos();
    } catch (error) {
      if (error.status === 503) mostrarSetup("La base de datos no está lista", error.message, PASOS.sinBase);
      else if (error.sinDatos) mostrarSetup("Faltan los datos", error.message, PASOS.sinDatos);
      else mostrarSetup("La API respondió con un error", error.message, PASOS.error);
      return;
    }
    try {
      renderTodo();
    } catch (error) {
      console.error(error);
      mostrarSetup("Algo falló al dibujar la página", error.message, PASOS.error);
    }
  }

  iniciar();
})();
