/**
 * Marco D: joga um mandato inteiro (16 trimestres) no modo real com o
 * programa de um governo de referência. Uso: vite-node scripts/teste/mandato.ts
 */
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  responderDilema,
  responderPedido,
  verBussola,
  verPartida,
  verTramitacao,
  verEleicao,
  type Partida,
} from "../../src/app/partida";
import programas from "../../src/conteudo/bussola/programas.json";
import {
  nivelDaLinha,
  type ProgramaDeGoverno,
} from "../../src/game/bussola/programas";
import { referenciasDaBussola } from "../../src/game/bussola";

const ESCOLHIDOS = (process.argv[2] ?? "mujica,chavez,bolsonaro,pinera").split(
  ",",
);
const TURNOS = 16;
/** Sementes (3º argumento, ex.: 1-10 ou 3,7): uma partida por semente. */
const SEMENTES = (() => {
  const arg = process.argv[3] ?? "7";
  const [a, b] = arg.split("-").map(Number);
  return arg.includes("-")
    ? Array.from({ length: b - a + 1 }, (_, i) => a + i)
    : arg.split(",").map(Number);
})();
/** Só o resumo da eleição (4º argumento "curto"). */
const CURTO = process.argv[4] === "curto";
const r1 = (n: number) => Math.round(n * 10) / 10;

function jogar(nome: string, semente: number) {
  const prog =
    nome === "nada"
      ? {
          ...(programas.programas as Record<string, ProgramaDeGoverno>).merkel,
          leis: [],
        }
      : (programas.programas as Record<string, ProgramaDeGoverno>)[nome];
  const ref = referenciasDaBussola.personalidades.find(
    (p) => p.id === prog.referencia,
  )!;
  const criada = criarPartida({ modo: "real", semente });
  if (!criada.ok) throw new Error(criada.erros.join("\n"));
  let p: Partida = criada.value;
  const t0 = Date.now();
  const erros: string[] = [];
  const alvo = new Map<string, number>();
  for (const l of prog.leis) {
    const n = nivelDaLinha(p.content, l);
    if (n === undefined) erros.push(`linha inválida ${l.lei}`);
    else alvo.set(l.lei, n);
  }
  const tentativas = new Map<string, number>();
  const v0 = verPartida(p);
  const nivelAtual = (pp: Partida, id: string) =>
    pp.game.policies.find((s) => s.policyDefinitionId === id)?.desiredLevel;
  const jaEstava = [...alvo].filter(
    ([id, n]) =>
      nivelAtual(p, id) !== undefined &&
      Math.abs(nivelAtual(p, id)! - n) < 1e-9,
  ).length;
  const satisf = (pp: Partida) => {
    const g = verPartida(pp).grupos;
    const peso = g.reduce((s, x) => s + x.peso, 0);
    return g.reduce((s, x) => s + x.satisfacao * x.peso, 0) / peso;
  };
  const bolha = (pp: Partida, re: RegExp) =>
    verPartida(pp).bolhas.find((b) => re.test(b.id));
  const linhas: string[] = [];
  let passou = 0,
    caiu = 0,
    caducou = 0,
    dilemas = 0,
    pedidos = 0,
    decretos = 0;
  const contagemErros = new Map<string, number>();
  const anotar = (e: string) =>
    contagemErros.set(e, (contagemErros.get(e) ?? 0) + 1);
  for (let t = 1; t <= TURNOS; t++) {
    // manda o que falta do programa
    const fila = new Set(verTramitacao(p).fila.map((f) => f.lei));
    for (const [id, n] of alvo) {
      const atual = nivelAtual(p, id);
      if (atual !== undefined && Math.abs(atual - n) < 1e-9) continue;
      if (fila.has(id)) continue;
      const k = tentativas.get(id) ?? 0;
      if (k >= 3) continue;
      const antes = p.game.bills?.fila.length ?? 0;
      const r = mudarLei(p, id, n);
      if (!r.ok) {
        anotar(r.erros.join(" "));
        tentativas.set(id, 99);
        continue;
      }
      tentativas.set(id, k + 1);
      if ((r.value.game.bills?.fila.length ?? 0) === antes) decretos++;
      p = r.value;
    }
    // pedidos das bancadas: aceita todos
    for (const ped of verTramitacao(p).pedidos) {
      const r = responderPedido(p, ped.id, true);
      if (r.ok) {
        p = r.value;
        pedidos++;
      } else anotar(r.erros.join(" "));
    }
    // dilemas: opção padrão
    for (const d of verPartida(p).ocorrencias.mesa) {
      const op =
        d.opcoes.find((o) => o.padrao && o.disponivel) ??
        d.opcoes.find((o) => o.disponivel);
      if (!op) {
        anotar(`dilema sem opção: ${d.nome}`);
        continue;
      }
      const r = responderDilema(p, d.id, op.id);
      if (r.ok) {
        p = r.value;
        dilemas++;
      } else anotar(r.erros.join(" "));
    }
    const e = encerrarTurno(p);
    if (!e.ok) {
      anotar(`turno ${t}: ${e.erros.join(" ")}`);
      break;
    }
    p = e.value.partida;
    const tr = verTramitacao(p);
    for (const s of tr.saidas.filter(
      (s) => s.turno === p.game.currentTurn || s.turno === t,
    )) {
      if (s.motivo === "passou") passou++;
      else if (s.motivo === "caiu") caiu++;
      else caducou++;
    }
    const b = verBussola(p);
    const c = verPartida(p).contas;
    linhas.push(
      `T${t}: bússola (${r1(b!.ponto.economia)}, ${r1(b!.ponto.costumes)}) perto de ${b!.pertoPersonalidades[0]?.nome}; ` +
        `satisf ${r1(satisf(p))}; resultado ${r1(c.percentualPib.resultado)}% PIB; dívida ${r1(c.percentualPib.divida)}% PIB; fila ${tr.fila.length}`,
    );
  }
  const noAlvo = [...alvo].filter(([id, n]) => {
    const a = nivelAtual(p, id);
    return a !== undefined && Math.abs(a - n) < 1e-9;
  }).length;
  const b = verBussola(p)!;
  const dist = Math.hypot(
    b.ponto.economia - ref.economia,
    b.ponto.costumes - ref.costumes,
  );
  const ind = ["^inflacao$", "desemprego", "crescimento", "^pib"]
    .map((re) => {
      const a = bolha(criada.value, new RegExp(re)),
        z = bolha(p, new RegExp(re));
      return a && z ? `${a.nome} ${r1(a.valor)}→${r1(z.valor)}` : "";
    })
    .filter(Boolean)
    .join("; ");
  const fim = verPartida(p);
  const el = verEleicao(p);
  const res = el?.resultados.at(-1);
  const linhaEleicao = res
    ? `Eleição (semente ${semente}): ${res.candidato} ${res.venceu ? "VENCEU" : "PERDEU"}; 1º turno ${res.primeiro.map((x) => `${x.nome} ${r1(x.votos)}`).join(", ")}${res.segundo ? `; 2º turno ${res.segundo.map((x) => `${x.nome} ${r1(x.votos)}`).join(", ")}` : ""}; comparecimento ${r1(res.comparecimento)}%. Aprovação ${r1(bolha(p, /^popularidade_governo$/)?.valor ?? NaN)}. Pesquisas (2º turno, partido): ${(el?.pesquisas ?? []).map((q) => r1(Math.min(...q.segundo.map((x) => x.votos)))).join(" ")}`
    : `Eleição (semente ${semente}): ${el?.pesquisas.at(-1) ? "sem resultado" : "sem eleição"}`;
  if (CURTO) {
    console.log(`${prog.referencia}: ${linhaEleicao}`);
    return;
  }
  console.log(linhaEleicao);
  console.log(
    `\n=== ${prog.referencia} (${ref.economia}, ${ref.costumes}) — ${(Date.now() - t0) / 1000}s ===`,
  );
  console.log(
    `Programa: ${alvo.size} leis; já valiam ${jaEstava}; no fim ${noAlvo}. Passaram ${passou}, caíram ${caiu}, caducaram ${caducou}, decretos ${decretos}. Dilemas ${dilemas}, pedidos aceitos ${pedidos}.`,
  );
  console.log(
    `Bússola final (${r1(b.ponto.economia)}, ${r1(b.ponto.costumes)}), início (${r1(b.inicio.economia)}, ${r1(b.inicio.costumes)}), distância da referência ${r1(dist)}. Mais perto: ${b.pertoPersonalidades
      .slice(0, 3)
      .map((x) => x.nome)
      .join(", ")}.`,
  );
  console.log(
    `Satisfação ${r1(satisf(criada.value))}→${r1(satisf(p))}. Contas: resultado ${r1(v0.contas.percentualPib.resultado)}→${r1(fim.contas.percentualPib.resultado)}% PIB; dívida ${r1(v0.contas.percentualPib.divida)}→${r1(fim.contas.percentualPib.divida)}% PIB. ${ind}`,
  );
  console.log(
    `Pressão: alertas ${fim.pressao?.alertas.join(", ") || "nenhum"}. Grupos mais insatisfeitos: ${[
      ...fim.grupos,
    ]
      .slice(-3)
      .map((g) => `${g.nome} ${r1(g.satisfacao)}`)
      .join(", ")}.`,
  );
  for (const [e, n] of contagemErros) console.log(`ERRO x${n}: ${e}`);
  console.log(linhas.filter((_, i) => i % 4 === 3).join("\n"));
}

for (const nome of ESCOLHIDOS)
  for (const semente of SEMENTES) {
    try {
      jogar(nome, semente);
    } catch (e) {
      console.log(`\n=== ${nome}: QUEBROU ===\n${(e as Error).stack}`);
    }
  }
