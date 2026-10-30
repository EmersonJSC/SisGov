/**
 * Diagnóstico (30/out): o jogo responde ao que o jogador faz? Joga um mandato
 * com três jogadores (parado, no máximo, no mínimo) e compara o que aconteceu:
 * ocorrências sorteadas e valores finais das variáveis.
 */
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  responderDilema,
} from "../../src/app/partida";
import type { Partida } from "../../src/app/partida";

const TURNOS = Number(process.argv[2] ?? 24);
const SEMENTE = Number(process.argv[3] ?? 4);

function nova(): Partida {
  const r = criarPartida({ semente: SEMENTE });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  return { ...r.value, modo: "teste" };
}

function aplicar(p: Partida, lado: "max" | "min"): Partida {
  let atual = p;
  for (const lei of p.content.policies) {
    const opcoes = lei.controle.opcoes;
    if (!opcoes?.length || lei.nivelLegal === "petrea") continue;
    const valores = opcoes.map((o) => o.valor);
    const alvo = lado === "max" ? Math.max(...valores) : Math.min(...valores);
    const r = mudarLei(atual, lei.id, alvo);
    if (r.ok) atual = r.value;
  }
  return atual;
}

type Resultado = {
  nome: string;
  ocorrencias: Map<string, number>;
  porTurno: number[];
  valores: Record<string, number>;
};

function jogar(nome: string, inicial: Partida): Resultado {
  let p = inicial;
  const ocorrencias = new Map<string, number>();
  const porTurno: number[] = [];
  for (let t = 0; t < TURNOS; t++) {
    for (const d of p.game.occurrences?.pending ?? []) {
      const def = p.content.dilemmas.find((o) => o.id === d.occurrenceId);
      const padrao = def?.padrao ?? def?.opcoes?.[0]?.id;
      if (padrao) {
        const r = responderDilema(p, d.occurrenceId, padrao);
        if (r.ok) p = r.value;
      }
    }
    const e = encerrarTurno(p);
    if (!e.ok) {
      console.log(nome, "parou no turno", t, e.erros.join(" "));
      break;
    }
    p = e.value.partida;
    const o = e.value.relatorio.ocorrencias;
    const novos = [...o.eventos, ...o.dilemas, ...o.surgiram];
    porTurno.push(novos.length);
    for (const x of novos)
      ocorrencias.set(`${x.tipo}:${x.id}`, (ocorrencias.get(`${x.tipo}:${x.id}`) ?? 0) + 1);
  }
  return {
    nome,
    ocorrencias,
    porTurno,
    valores: { ...p.game.execution.values },
  };
}

const base = nova();
const rodadas = [
  jogar("parado", base),
  jogar("maximo", aplicar(base, "max")),
  jogar("minimo", aplicar(base, "min")),
];

for (const r of rodadas) {
  console.log(`\n== ${r.nome}: ${r.porTurno.reduce((s, n) => s + n, 0)} ocorrências em ${r.porTurno.length} turnos`);
  console.log("por turno:", r.porTurno.join(" "));
  console.log(
    [...r.ocorrencias.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}×${n}`).join(", ") || "(nenhuma)",
  );
}

const ids = new Set(rodadas.flatMap((r) => [...r.ocorrencias.keys()]));
const todas = (k: string) => rodadas.map((r) => r.ocorrencias.get(k) ?? 0);
const soEm = [...ids].filter((k) => todas(k).some((n) => n === 0) && todas(k).some((n) => n > 0));
console.log(`\nocorrências distintas: ${ids.size}; só em alguns jogadores: ${soEm.length}`);

const chaves = Object.keys(rodadas[0].valores);
const spread = chaves
  .map((k) => {
    const v = rodadas.map((r) => r.valores[k] ?? 0);
    const mx = Math.max(...v), mn = Math.min(...v);
    const escala = Math.max(Math.abs(mx), Math.abs(mn), 1e-9);
    return { k, v, rel: (mx - mn) / escala };
  })
  .sort((a, b) => b.rel - a.rel);
const mexeu = (lim: number) => spread.filter((s) => s.rel > lim).length;
console.log(`\nvariáveis: ${chaves.length}; diferem >5% entre jogadores: ${mexeu(0.05)}; >20%: ${mexeu(0.2)}; iguais (<0,5%): ${spread.filter((s) => s.rel < 0.005).length}`);
console.log("as que mais mudam:");
for (const s of spread.slice(0, 12)) console.log(" ", s.k, s.v.map((x) => x.toFixed(1)).join(" / "));
