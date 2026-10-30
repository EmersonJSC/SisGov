/**
 * Diagnóstico (30/out), passo 1: um jogador normal mexe em UMA lei e joga.
 * Para cada lei, compara com o jogador parado e conta quantas bolhas do mapa
 * (as que o jogador vê) mudaram. Args: [turnos=12] [semente=4] [passo=1]
 */
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  responderDilema,
  verPartida,
} from "../../src/app/partida";
import type { Partida } from "../../src/app/partida";

const TURNOS = Number(process.argv[2] ?? 12);
const SEMENTE = Number(process.argv[3] ?? 4);
const PASSO = Number(process.argv[4] ?? 1);
const LIMITE = 0.03; // 3% de diferença já conta como "mudou"

const r0 = criarPartida({ semente: SEMENTE });
if (!r0.ok) throw new Error(r0.erros.join("\n"));
const base: Partida = { ...r0.value, modo: "teste" };
const visiveis = new Map(verPartida(base).bolhas.map((b) => [b.id, b.nome]));

function jogar(inicial: Partida): Record<string, number> {
  let p = inicial;
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
    if (!e.ok) break;
    p = e.value.partida;
  }
  return { ...p.game.execution.values };
}

const parado = jogar(base);
const leis = base.content.policies.filter(
  (l) => l.controle.opcoes?.length && l.nivelLegal !== "petrea",
);
console.log(`bolhas visíveis: ${visiveis.size}; leis testadas: ${Math.ceil(leis.length / PASSO)}`);

const linhas: { lei: string; n: number; top: string }[] = [];
for (let i = 0; i < leis.length; i += PASSO) {
  const lei = leis[i];
  const atual = base.game.policies.find((x) => x.policyDefinitionId === lei.id)?.desiredLevel;
  const valores = lei.controle.opcoes!.map((o) => o.valor);
  const alvo = atual === Math.max(...valores) ? Math.min(...valores) : Math.max(...valores);
  const m = mudarLei(base, lei.id, alvo);
  if (!m.ok) continue;
  const fim = jogar(m.value);
  const mudou = [...visiveis]
    .map(([id, nome]) => {
      const a = parado[id] ?? 0, b = fim[id] ?? 0;
      const rel = Math.abs(b - a) / Math.max(Math.abs(a), Math.abs(b), 1e-9);
      return { nome, rel };
    })
    .filter((x) => x.rel > LIMITE)
    .sort((x, y) => y.rel - x.rel);
  linhas.push({ lei: lei.id, n: mudou.length, top: mudou.slice(0, 3).map((x) => x.nome).join(", ") });
  console.log(`${lei.id}: ${mudou.length} bolhas${mudou.length ? " — " + linhas[linhas.length - 1].top : ""}`);
}
const zero = linhas.filter((l) => l.n === 0).length;
const poucas = linhas.filter((l) => l.n > 0 && l.n <= 3).length;
console.log(`\nRESUMO: ${linhas.length} leis; nenhuma bolha mudou: ${zero}; 1 a 3 bolhas: ${poucas}; 4 ou mais: ${linhas.length - zero - poucas}`);
