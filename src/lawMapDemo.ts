import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
  type RelatorioTurno,
} from "./app/partida";

const NS = "http://www.w3.org/2000/svg";
const root = document.querySelector<SVGGElement>("#map-content")!;
const viewport = document.querySelector<HTMLElement>("#map-viewport")!;
const card = document.querySelector<HTMLElement>("#selection-card")!;
const notice = document.querySelector<HTMLElement>("#notice")!;
let partida: Partida;
let selected = "";
let hover = "";
let expanded = "";
let pan = { x: -260, y: 0 };
let zoom = 0.94;
let dragging: { x: number; y: number; px: number; py: number } | null = null;
let report: RelatorioTurno | null = null;
const history: string[] = [];
let activeFilter = "all";

const colors = [
  "#397c70",
  "#5277a5",
  "#9a7251",
  "#a55b63",
  "#8070a8",
  "#5c8b72",
  "#b07d3c",
  "#4b8295",
  "#9a6d8b",
  "#657b4c",
];
const el = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  text = "",
) => {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([key, value]) =>
    node.setAttribute(key, String(value)),
  );
  if (text) node.textContent = text;
  return node;
};
const html = (selector: string) =>
  document.querySelector<HTMLElement>(selector)!;
const money = (n: number) =>
  `${n < 0 ? "−" : ""}R$ ${Math.abs(n).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} mi`;
const short = (text: string, max = 24) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;
const wrap = (text: string, max = 20) => {
  const lines: string[] = [];
  for (const word of text.split(/\s+/)) {
    const last = lines.length - 1;
    if (last >= 0 && `${lines[last]} ${word}`.length <= max) {
      lines[last] += ` ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines.slice(0, 3);
};
const lawOrbit = (x: number, y: number, index: number, total: number) => {
  const innerCount = Math.min(7, total);
  const isOuter = index >= innerCount;
  const ringCount = isOuter ? Math.max(1, total - innerCount) : innerCount;
  const ringIndex = isOuter ? index - innerCount : index;
  const radius = isOuter ? 145 : 110;
  const angle = -Math.PI / 2 + (ringIndex * 2 * Math.PI) / ringCount;
  return {
    x: x + Math.cos(angle) * radius,
    y: y + Math.sin(angle) * radius * 0.68,
  };
};
const safe = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

function say(text: string) {
  notice.textContent = text;
  notice.hidden = false;
  window.setTimeout(() => {
    notice.hidden = true;
  }, 3200);
}

function updateTransform() {
  root.setAttribute("transform", `translate(${pan.x} ${pan.y}) scale(${zoom})`);
}

function graphState() {
  const view = verPartida(partida);
  const laws = view.leis;
  const ministries = [
    ...new Set(laws.flatMap((law) => law.ministerios).filter(Boolean)),
  ].slice(0, 10);
  return { view, laws, ministries };
}

function draw() {
  const { view, laws, ministries } = graphState();
  root.replaceChildren();
  updateTransform();
  html("#country-name").textContent = view.pais || "Brasil";
  html("#cash-value").textContent = money(view.caixa);
  html("#debt-value").textContent = money(view.divida);
  html("#gdp-value").textContent = money(view.pib);
  html("#turn-value").textContent = String(view.turno + 1);
  const focus = hover || selected;
  const direct = new Set(
    view.ligacoes
      .filter((link) => link.origem === focus || link.alvo === focus)
      .flatMap((link) => [link.origem, link.alvo]),
  );

  const defs = el("defs");
  const marker = el("marker", {
    id: "arrow",
    markerWidth: 8,
    markerHeight: 8,
    refX: 7,
    refY: 4,
    orient: "auto",
    markerUnits: "strokeWidth",
  });
  marker.append(el("path", { d: "M0,0 L8,4 L0,8 z", fill: "context-stroke" }));
  defs.append(marker);
  root.append(defs);

  const edges = el("g", { "aria-hidden": "true" });
  const positions = new Map<string, { x: number; y: number }>();
  const cx = 800,
    cy = 550;
  positions.set("presidente", { x: cx, y: cy });
  ministries.forEach((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ministries.length;
    positions.set(`min:${ministries[i]}`, {
      x: cx + Math.cos(a) * 435,
      y: cy + Math.sin(a) * 330,
    });
  });
  const outer = view.bolhas;
  outer.forEach((bubble, i) => {
    const a = -Math.PI / 2 + i * 2.399963;
    const r = 515 + (i % 3) * 46;
    positions.set(bubble.id, {
      x: cx + Math.cos(a) * r * 1.16,
      y: cy + Math.sin(a) * r * 0.72,
    });
  });
  laws.forEach((law) => {
    const ministry = law.ministerios[0];
    const p = positions.get(`min:${ministry}`);
    if (p) positions.set(law.id, { x: p.x, y: p.y });
  });
  if (expanded) {
    const ministryIndex = ministries.indexOf(expanded);
    const a = -Math.PI / 2 + (ministryIndex * 2 * Math.PI) / ministries.length;
    const x = cx + Math.cos(a) * 435;
    const y = cy + Math.sin(a) * 330;
    const members = laws.filter(
      (law) =>
        law.ministerios.includes(expanded) && law.grupo !== "institucional",
    );
    members.forEach((law, j) =>
      positions.set(law.id, lawOrbit(x, y, j, members.length)),
    );
  }
  const constitutionalLaw = laws.find((law) => law.grupo === "institucional");
  if (constitutionalLaw)
    positions.set(constitutionalLaw.id, { x: cx, y: cy - 63 });

  for (const link of view.ligacoes) {
    const from = positions.get(link.origem),
      to = positions.get(link.alvo);
    if (
      !from ||
      !to ||
      (Math.abs(from.x - to.x) < 1 && Math.abs(from.y - to.y) < 1)
    )
      continue;
    const relevant = focus && (link.origem === focus || link.alvo === focus);
    const edge = el("path", {
      d: `M${from.x},${from.y} Q${(from.x + to.x) / 2 + 8},${(from.y + to.y) / 2 - 5} ${to.x},${to.y}`,
      class: `map-edge${relevant ? (link.sinal < 0 ? " focus-negative" : " focus") : focus ? " dim" : ""}`,
      "data-signal": link.sinal,
      "data-delay": link.atrasoMeses,
      "data-from": link.origem,
      "data-to": link.alvo,
      "marker-end": "url(#arrow)",
    });
    edges.append(edge);
  }
  root.append(edges);

  const outerRing = el("circle", {
    cx,
    cy,
    r: 448,
    class: "constitution-ring",
    "stroke-dasharray": "2 8",
    opacity: 0.42,
  });
  root.append(outerRing);
  const institutions = laws.filter((l) => l.grupo === "institucional");
  if (institutions.length) {
    const region = el("circle", { cx, cy, r: 112, class: "constitution-ring" });
    root.append(region);
    root.append(
      el(
        "text",
        { x: cx, y: cy - 91, class: "area-count" },
        "ÁREA PRESIDENCIAL",
      ),
    );
    const constitution = institutions[0];
    const x = cx,
      y = cy - 63;
    positions.set(constitution.id, { x, y });
    const n = el("g", {
      class: `law-node institution-node${selected === constitution.id ? " selected" : ""}`,
      transform: `translate(${x} ${y})`,
      tabindex: 0,
      role: "button",
      "aria-label": constitution.nome,
      "data-id": constitution.id,
    });
    n.append(
      el("circle", { r: 16 }),
      el("text", { class: "node-icon", y: 1 }, "§"),
      el("text", { class: "node-label", y: 29 }, short(constitution.nome, 23)),
    );
    n.addEventListener("click", () => selectLaw(constitution.id));
    n.addEventListener("pointerenter", () => setHover(constitution.id));
    n.addEventListener("pointerleave", () => setHover(""));
    root.append(n);
  }

  ministries.forEach((ministry, i) => {
    if (activeFilter === "indicators" || activeFilter === "events") return;
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ministries.length;
    const x = cx + Math.cos(a) * 435,
      y = cy + Math.sin(a) * 330;
    const members = laws.filter(
      (law) =>
        law.ministerios.includes(ministry) && law.grupo !== "institucional",
    );
    const color = colors[i % colors.length];
    const group = el("g", {
      class: `ministry-area${expanded === ministry ? " expanded" : ""}${focus && !members.some((l) => direct.has(l.id)) && !direct.has(`min:${ministry}`) ? " dim" : ""}`,
      style: `--tone:${color}`,
      tabindex: 0,
      role: "button",
      "aria-label": `${ministry}, ${members.length} leis`,
      "data-ministry": ministry,
    });
    const radius = expanded === ministry ? 156 : 128;
    group.append(
      el("circle", {
        cx: x,
        cy: y,
        r: radius,
        class: "area-influence",
        fill: color,
        stroke: color,
      }),
    );
    group.append(
      el("circle", { cx: x, cy: y - 25, r: 24, class: "minister-avatar" }),
    );
    group.append(
      el("circle", { cx: x, cy: y - 32, r: 6, class: "avatar-head" }),
    );
    group.append(
      el("path", {
        d: `M${x - 12},${y - 15} Q${x - 10},${y - 27} ${x},${y - 26} Q${x + 10},${y - 27} ${x + 12},${y - 15}Z`,
        class: "avatar-body",
      }),
    );
    const label = el("text", { x, y: y + 7, class: "area-name" });
    wrap(ministry).forEach((line, lineIndex) => {
      label.append(el("tspan", { x, dy: lineIndex === 0 ? 0 : 15 }, line));
    });
    group.append(label);
    group.append(
      el(
        "text",
        { x, y: y + 54, class: "area-count" },
        `${members.length} ${members.length === 1 ? "lei" : "leis"}`,
      ),
    );
    group.append(
      el(
        "text",
        { x, y: y + 73, class: "area-count", "font-size": 9 },
        expanded === ministry ? "fechar área" : "abrir área",
      ),
    );
    group.addEventListener("click", () => {
      expanded = expanded === ministry ? "" : ministry;
      draw();
    });
    group.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        expanded = expanded === ministry ? "" : ministry;
        draw();
      }
    });
    root.append(group);

    if (expanded === ministry)
      members.forEach((law, j) => {
        const { x: lx, y: ly } = lawOrbit(x, y, j, members.length);
        positions.set(law.id, { x: lx, y: ly });
        const related = law.ministerios.length > 1;
        const lawNode = el("g", {
          class: `law-node${selected === law.id ? " selected" : ""}${focus && !direct.has(law.id) ? " dim" : ""}`,
          style: `--tone:${color}`,
          transform: `translate(${lx} ${ly})`,
          tabindex: 0,
          role: "button",
          "aria-label": law.nome,
          "data-id": law.id,
        });
        lawNode.append(
          el("circle", { r: 17 }),
          el(
            "text",
            { class: "node-icon", y: 1 },
            law.grupo === "orcamentaria"
              ? "¤"
              : law.grupo === "tributaria"
                ? "%"
                : law.grupo === "institucional"
                  ? "§"
                  : "⚖",
          ),
          el("text", { class: "node-label", y: 30 }, short(law.nome, 16)),
        );
        if (related)
          lawNode.append(
            el("circle", { cx: 13, cy: -13, r: 5, class: "multi-mark" }),
            el(
              "text",
              {
                x: 13,
                y: -11,
                "font-size": 7,
                "text-anchor": "middle",
                fill: color,
              },
              "+",
            ),
          );
        lawNode.addEventListener("click", (ev) => {
          ev.stopPropagation();
          selectLaw(law.id);
        });
        lawNode.addEventListener("pointerenter", () => setHover(law.id));
        lawNode.addEventListener("pointerleave", () => setHover(""));
        lawNode.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            selectLaw(law.id);
          }
        });
        root.append(lawNode);
      });
  });

  outer.forEach((bubble) => {
    if (
      activeFilter === "ministries" ||
      activeFilter === "laws" ||
      activeFilter === "budget"
    )
      return;
    const p = positions.get(bubble.id)!;
    const kind =
      bubble.tipo === "situacao"
        ? "situacao"
        : bubble.tipo === "evento"
          ? "evento"
          : bubble.tipo === "estoque"
            ? "estoque"
            : "calculado";
    const g = el("g", {
      class: `indicator-node${selected === bubble.id ? " selected" : ""}${focus && !direct.has(bubble.id) ? " dim" : ""}`,
      "data-kind": kind,
      transform: `translate(${p.x} ${p.y})`,
      tabindex: 0,
      role: "button",
      "aria-label": bubble.nome,
      "data-id": bubble.id,
    });
    const r = kind === "estoque" ? 13 : 10;
    g.append(
      el("circle", { r }),
      el(
        "text",
        { class: "node-icon", y: 1 },
        kind === "situacao"
          ? "!"
          : kind === "evento"
            ? "✦"
            : kind === "estoque"
              ? "◷"
              : "⌁",
      ),
      el("text", { class: "node-label", y: 25 }, short(bubble.nome, 25)),
    );
    g.addEventListener("click", () => selectBubble(bubble.id));
    g.addEventListener("pointerenter", () => setHover(bubble.id));
    g.addEventListener("pointerleave", () => setHover(""));
    root.append(g);
  });

  const president = el("g", {
    class: "president-core",
    transform: `translate(${cx} ${cy})`,
  });
  president.append(
    el("circle", { r: 59 }),
    el("circle", { cx: 0, cy: -13, r: 10, class: "person-head" }),
    el("path", {
      d: "M-19,12 Q-16,-4 0,-3 Q16,-4 19,12 L19,21 L-19,21Z",
      class: "person-body",
    }),
    el("text", { x: 0, y: 39, class: "president-label" }, "Presidente"),
    el("text", { x: 0, y: 53, class: "president-sub" }, "GOVERNO"),
  );
  root.append(president);
  renderCard();
}

function setHover(id: string) {
  hover = id;
  const focus = hover || selected;
  const related = new Set<string>();
  for (const link of verPartida(partida).ligacoes) {
    if (link.origem === focus || link.alvo === focus) {
      related.add(link.origem);
      related.add(link.alvo);
    }
  }
  root.querySelectorAll<SVGPathElement>(".map-edge").forEach((edge) => {
    const active =
      Boolean(focus) &&
      (edge.dataset.from === focus || edge.dataset.to === focus);
    edge.classList.toggle("focus", active && edge.dataset.signal !== "-1");
    edge.classList.toggle(
      "focus-negative",
      active && edge.dataset.signal === "-1",
    );
    edge.classList.toggle("dim", Boolean(focus) && !active);
  });
  root
    .querySelectorAll<SVGGElement>(".law-node,.indicator-node")
    .forEach((node) => {
      const active =
        node.dataset.id === focus || related.has(node.dataset.id || "");
      node.classList.toggle("dim", Boolean(focus) && !active);
      node.classList.toggle(
        "related",
        Boolean(focus) && active && node.dataset.id !== focus,
      );
    });
  root.querySelectorAll<SVGGElement>(".ministry-area").forEach((node) => {
    const name = node.dataset.ministry || "";
    const ownsRelated = verPartida(partida).leis.some(
      (law) => law.ministerios.includes(name) && related.has(law.id),
    );
    node.classList.toggle("dim", Boolean(focus) && !ownsRelated);
  });
}

function selectLaw(id: string) {
  selected = id;
  const law = verPartida(partida).leis.find((item) => item.id === id);
  if (law?.ministerios[0]) expanded = law.ministerios[0];
  history.unshift(`Lei selecionada: ${law?.nome ?? id}`);
  draw();
}

function selectBubble(id: string) {
  selected = id;
  history.unshift(
    `Indicador selecionado: ${verPartida(partida).bolhas.find((item) => item.id === id)?.nome ?? id}`,
  );
  draw();
}

function renderCard() {
  const { view } = graphState();
  const id = selected;
  const law = view.leis.find((item) => item.id === id);
  const bubble = view.bolhas.find((item) => item.id === id);
  if (!law && !bubble) {
    card.hidden = true;
    card.innerHTML = "";
    return;
  }
  card.hidden = false;
  if (law) {
    const effects = view.ligacoes
      .filter((link) => link.origem === law.id)
      .map((link) => ({
        link,
        bubble: view.bolhas.find((item) => item.id === link.alvo),
      }))
      .filter((item) => item.bubble);
    const tags = law.ministerios
      .map((name) => `<span class="tag">${safe(name)}</span>`)
      .join("");
    const control = law.opcoes?.length
      ? `<div class="control-label"><span>Meta da lei</span><span class="control-output" id="law-choice-label"></span></div><div class="option-grid">${law.opcoes.map((option) => `<button class="option-choice${option.id === law.opcaoAtual ? " active" : ""}" data-value="${option.valor}" type="button">${safe(option.rotulo)}</button>`).join("")}</div>`
      : `<div class="control-label"><span>Meta da lei</span><span class="control-output" id="law-choice-label">${law.meta.toLocaleString("pt-BR")} ${safe(law.unidade)}</span></div><input id="law-range" class="range-input" type="range" min="${law.minimo ?? 0}" max="${law.maximo ?? Math.max(law.meta * 2, 100)}" step="any" value="${law.meta}" />`;
    card.innerHTML = `<span class="card-eyebrow">Lei · ${safe(law.grupo)}</span><h2>${safe(law.nome)}</h2><p>${safe(law.descricao || "Sem descrição disponível.")}</p><div class="tag-row">${tags}</div><div class="detail-value">${law.nivel.toLocaleString("pt-BR")} <small>${safe(law.unidade)} em vigor</small></div>${control}<button class="apply-change" id="apply-law" type="button">Aplicar meta</button><div class="card-eyebrow" style="margin-top:15px">Efeitos diretos esperados</div><ul class="effect-list">${effects.length ? effects.map(({ link, bubble: item }) => `<li><span>${safe(item!.nome)}</span><span class="effect-timing"><b class="effect-direction ${link.sinal < 0 ? "down" : ""}">${link.sinal > 0 ? "↑" : "↓"}</b> ${link.atrasoMeses ? `em ${link.atrasoMeses} meses` : "imediato"}</span></li>`).join("") : "<li>Sem efeitos diretos expostos no mapa.</li>"}</ul>`;
    let target = law.meta;
    const range = card.querySelector<HTMLInputElement>("#law-range");
    range?.addEventListener("input", () => {
      target = Number(range.value);
      const out = card.querySelector("#law-choice-label");
      if (out)
        out.textContent = `${target.toLocaleString("pt-BR")} ${law.unidade}`;
    });
    card.querySelectorAll<HTMLButtonElement>("[data-value]").forEach((button) =>
      button.addEventListener("click", () => {
        target = Number(button.dataset.value);
        card
          .querySelectorAll(".option-choice")
          .forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const output = card.querySelector("#law-choice-label");
        if (output) output.textContent = button.textContent || "";
      }),
    );
    card
      .querySelector<HTMLButtonElement>("#apply-law")
      ?.addEventListener("click", () => {
        const result = mudarLei(partida, law.id, target);
        if (!result.ok) {
          say(result.erros.join(" "));
          return;
        }
        partida = result.value;
        history.unshift(`Meta ajustada: ${law.nome}`);
        say("Meta da lei atualizada.");
        draw();
      });
  } else if (bubble) {
    card.innerHTML = `<span class="card-eyebrow">Indicador · ${safe(bubble.area || bubble.tipo)}</span><h2>${safe(bubble.nome)}</h2><p>Valor atual observado. As conexões destacadas mostram leis diretamente relacionadas a este indicador.</p><div class="detail-value">${bubble.valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} <small>${safe(bubble.unidade)}</small></div><div class="card-eyebrow" style="margin-top:14px">Leis que afetam este nó</div><ul class="effect-list">${
      view.ligacoes
        .filter((link) => link.alvo === bubble.id)
        .map(
          (link) =>
            `<li><span>${safe(view.leis.find((item) => item.id === link.origem)?.nome ?? link.origem)}</span><span class="effect-timing">${link.atrasoMeses ? `${link.atrasoMeses} meses` : "imediato"}</span></li>`,
        )
        .join("") || "<li>Sem relações diretas expostas.</li>"
    }</ul>`;
  }
}

function applyFilter(filter: string) {
  activeFilter = filter;
  document
    .querySelectorAll<HTMLButtonElement>(".nav-item")
    .forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  draw();
}

function advanceTurn() {
  const button = html("#advance-turn") as HTMLButtonElement;
  button.disabled = true;
  const result = encerrarTurno(partida);
  button.disabled = false;
  if (!result.ok) {
    say(result.erros.join(" "));
    return;
  }
  partida = result.value.partida;
  report = result.value.relatorio;
  history.unshift(
    `Turno ${report.turno} encerrado · resultado fiscal ${money(report.resultado)}`,
  );
  const reportCard = html("#report-card");
  reportCard.hidden = false;
  reportCard.innerHTML = `<span class="card-eyebrow">Relatório · turno ${report.turno}</span><h2>Trimestre concluído</h2><p>Receita ${money(report.receita)} · gastos primários ${money(report.gastoPrimario)} · juros ${money(report.juros)}.</p><div class="card-eyebrow" style="margin-top:12px">Maiores mudanças</div><ul class="report-list">${report.mudancas
    .slice(0, 6)
    .map(
      (item) =>
        `<li><span>${safe(item.nome)}</span><strong>${item.depois > item.antes ? "↑" : "↓"} ${Math.abs(item.depois - item.antes).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</strong></li>`,
    )
    .join("")}</ul>`;
  draw();
  say("O turno avançou três meses.");
}

function resetView() {
  expanded = "";
  selected = "";
  hover = "";
  zoom = 0.94;
  pan = { x: -260, y: 0 };
  updateTransform();
  draw();
}

function setZoom(next: number, anchor?: { x: number; y: number }) {
  const bounded = Math.max(0.68, Math.min(1.42, next));
  if (anchor) {
    const ratio = bounded / zoom;
    pan.x = Math.max(
      -520,
      Math.min(520, anchor.x - (anchor.x - pan.x) * ratio),
    );
    pan.y = Math.max(
      -420,
      Math.min(420, anchor.y - (anchor.y - pan.y) * ratio),
    );
  }
  zoom = bounded;
  updateTransform();
}

function renderHistory() {
  const content = html("#turn-log-content");
  content.innerHTML =
    history
      .slice(0, 10)
      .map((item) => `<div class="log-item">${safe(item)}</div>`)
      .join("") ||
    `<div class="log-item">Suas decisões e relatórios aparecerão aqui.</div>`;
}

function start() {
  const created = criarPartida({ pais: "brasil", modo: "teste" });
  if (!created.ok) {
    say(created.erros.join(" "));
    return;
  }
  partida = created.value;
  draw();
  document
    .querySelectorAll<HTMLButtonElement>(".nav-item")
    .forEach((button) =>
      button.addEventListener("click", () =>
        applyFilter(button.dataset.filter || "all"),
      ),
    );
  html("#advance-turn").addEventListener("click", advanceTurn);
  html("#zoom-in").addEventListener("click", () => setZoom(zoom + 0.12));
  html("#zoom-out").addEventListener("click", () => setZoom(zoom - 0.12));
  html("#reset-view").addEventListener("click", resetView);
  html("#toggle-log").addEventListener("click", (ev) => {
    const btn = ev.currentTarget as HTMLButtonElement;
    const log = html("#turn-log-card");
    log.hidden = !log.hidden;
    btn.setAttribute("aria-expanded", String(!log.hidden));
    renderHistory();
  });
  viewport.addEventListener("pointerdown", (ev) => {
    if (
      (ev.target as HTMLElement).closest(
        "button,.ministry-area,.law-node,.indicator-node,.side-panel",
      )
    )
      return;
    dragging = { x: ev.clientX, y: ev.clientY, px: pan.x, py: pan.y };
    viewport.setPointerCapture(ev.pointerId);
  });
  viewport.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    const rect = viewport.getBoundingClientRect();
    const sx = 1600 / rect.width,
      sy = 1100 / rect.height;
    pan = {
      x: Math.max(
        -520,
        Math.min(520, dragging.px + (ev.clientX - dragging.x) * sx),
      ),
      y: Math.max(
        -420,
        Math.min(420, dragging.py + (ev.clientY - dragging.y) * sy),
      ),
    };
    updateTransform();
  });
  viewport.addEventListener("pointerup", () => {
    dragging = null;
  });
  viewport.addEventListener("pointercancel", () => {
    dragging = null;
  });
  viewport.addEventListener(
    "wheel",
    (ev) => {
      ev.preventDefault();
      const rect = viewport.getBoundingClientRect();
      setZoom(zoom * (ev.deltaY < 0 ? 1.08 : 0.92), {
        x: ((ev.clientX - rect.left) * 1600) / rect.width,
        y: ((ev.clientY - rect.top) * 1100) / rect.height,
      });
    },
    { passive: false },
  );
}

start();
