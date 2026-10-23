/**
 * Varredura: cada lei, em cada opção (ou ±50% se numérica), aplicada sozinha
 * no Brasil por N turnos; grava a diferença contra "Nada muda".
 * Uso: TURNOS=16 npx vite-node scripts/teste/varredura-leis.ts -- <inicio> <fim> >> saida.jsonl
 * Serve para o jogador-teste achar as alavancas que baixam a dívida sem
 * derrubar o PIB (e as que fazem algo absurdo).
 */
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";
import { appendFileSync, existsSync, readFileSync } from "node:fs";

// SAIDA=arquivo.jsonl: grava lá e pula o que já foi feito (retomável)
const SAIDA = process.env.SAIDA;
const feitos = new Set(
  SAIDA && existsSync(SAIDA)
    ? readFileSync(SAIDA, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((l) => {
          const o = JSON.parse(l) as { lei: string; alvo: number };
          return `${o.lei}@${o.alvo}`;
        })
    : [],
);
const gravar = (o: object) =>
  SAIDA
    ? appendFileSync(SAIDA, JSON.stringify(o) + "\n")
    : console.log(JSON.stringify(o));

const N = Number(process.env.TURNOS ?? 16);
const IND = [
  "divida_publica",
  "pib",
  "resultado_fiscal",
  "pobreza",
  "desemprego",
  "inflacao",
  "popularidade_governo",
  "crime_organizado",
  "violencia_letal",
  "taxa_juros",
  "desigualdade",
  "escolaridade",
];
const criada = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
if (!criada.ok) throw new Error(criada.erros.join(" "));
const molde = criada.value;
// criar leva ~7 s (aquecimento); clonar leva 0,2 s
const nova = (): Partida => structuredClone(molde);
const rodar = (p: Partida) => {
  for (let t = 0; t < N; t++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(r.erros.join(" "));
    p = r.value.partida;
  }
  const v = p.game.execution.values as Record<string, number>;
  return Object.fromEntries(IND.map((k) => [k, v[k] ?? NaN]));
};
const [ini, fim] = process.argv
  .slice(2)
  .filter((a) => !a.startsWith("-"))
  .map(Number);
const base = rodar(nova());
const leis = verPartida(nova()).leis;
const filtro = process.env.LEIS?.split(",");
const escolhidas = filtro
  ? leis.filter((l) => filtro.includes(l.id))
  : leis.slice(ini, fim);
for (const l of escolhidas) {
  const ops = (l as { opcoes?: { valor: number }[] }).opcoes ?? [];
  const alvos = ops.length
    ? ops.map((o) => o.valor).filter((x) => x !== l.nivel)
    : [l.nivel * 0.5, l.nivel * 1.5, l.nivel === 0 ? 5 : l.nivel * 2].filter(
        (x) => x !== l.nivel,
      );
  for (const alvo of [...new Set(alvos)]) {
    if (feitos.has(`${l.id}@${alvo}`)) continue;
    const r = aplicarMeta(nova(), l.id, alvo);
    if (!r.ok) {
      gravar({ lei: l.id, alvo, recusada: r.erros.join(" ") });
      continue;
    }
    const v = rodar(r.value);
    const d = Object.fromEntries(
      IND.map((k) => [k, Math.round((v[k] - base[k]) * 100) / 100]),
    );
    gravar({
      lei: l.id,
      area: (l as { area?: string }).area,
      de: l.nivel,
      alvo,
      d,
    });
  }
}
