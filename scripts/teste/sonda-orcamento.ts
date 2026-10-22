import { criarPartida, encerrarTurno, verPartida } from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";
const CORTE: [string, number | ((n: number) => number)][] = [
  ["idade-minima-aposentadoria", 75],
  ["reajuste-de-beneficios", 25],
  ["regra-fiscal", 67],
  ["meta-de-resultado-primario", 100],
  ["transferencia-de-renda", (v) => v * 0.85],
  ["investimento-em-infraestrutura", (v) => v * 0.8],
  ["estabilidade-dos-servidores-publicos", 67],
];
const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
for (const nome of ["base", "corte", ...CORTE.map((c) => c[0])]) {
  if (only.length && !only.includes(nome)) continue;
  const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
  if (!c.ok) throw Error(c.erros.join());
  let p = c.value;
  const metas =
    nome === "base"
      ? []
      : nome === "corte"
        ? CORTE
        : CORTE.filter((m) => m[0] === nome);
  for (const [id, a] of metas) {
    const l = verPartida(p).leis.find((l) => l.id === id);
    const v = typeof a === "function" ? a(l?.nivel ?? 0) : a;
    const r = aplicarMeta(p, id, v);
    if (r.ok) p = r.value;
    else console.log("REC", id, r.erros);
  }
  const f = (t: number) => {
    const v = p.game.execution.values as Record<string, number>;
    const k = verPartida(p).contas.percentualPib as Record<string, number>;
    const r = (n: number) => Math.round(n * 10) / 10;
    return `t${t} rec ${r(k.receita)} gas ${r(k.gasto)} jur ${r(k.juros)} res ${r(k.resultado)} div ${r(v.divida_publica)} pib ${r(v.pib)} cons ${r(v.consumo)} renda ${r(v.renda_familias ?? NaN)} desemp ${r(v.desemprego)} selic ${r(v.taxa_juros)}`;
  };
  console.log("==", nome);
  console.log(f(0));
  for (let t = 1; t <= 8; t++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw Error(r.erros.join());
    p = r.value.partida;
    if (t % 2 == 0) console.log(f(t));
  }
}
