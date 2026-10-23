/**
 * Jogador-teste guloso: parte de um pacote de leis (PACOTE) e, a cada passo,
 * testa somar cada candidata (da varredura), por N turnos, e fica com a que
 * mais melhora a nota. Grava o pacote em ESTADO (retomável).
 * Nota = −dívida + 1,5·PIB − pobreza − 0,3·crime + 0,3·popularidade.
 * Uso: ESTADO=x.json CANDIDATAS=c.json TURNOS=32 npx vite-node scripts/teste/jogador-guloso.ts
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import {
  criarPartida,
  encerrarTurno,
  type Partida,
} from "../../src/app/partida";
import { aplicarMeta } from "../../src/app/partida/leis";

type Jogada = [string, number];
const N = Number(process.env.TURNOS ?? 32);
const ESTADO = process.env.ESTADO!;
const cands = JSON.parse(
  readFileSync(process.env.CANDIDATAS!, "utf8"),
) as Jogada[];
const estado = existsSync(ESTADO)
  ? (JSON.parse(readFileSync(ESTADO, "utf8")) as {
      pacote: Jogada[];
      nota: number | null;
      testadas?: Record<string, number>;
    })
  : { pacote: [] as Jogada[], nota: null };
const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
if (!c.ok) throw new Error(c.erros.join(" "));
const molde = c.value;
const rodar = (pacote: Jogada[]) => {
  let p: Partida = structuredClone(molde);
  for (const [id, v] of pacote) {
    const r = aplicarMeta(p, id, v);
    if (!r.ok) return null;
    p = r.value;
  }
  for (let t = 0; t < N; t++) {
    const r = encerrarTurno(p);
    if (!r.ok) throw new Error(r.erros.join(" "));
    p = r.value.partida;
  }
  const v = p.game.execution.values as Record<string, number>;
  const nota =
    -v.divida_publica +
    1.5 * v.pib -
    v.pobreza -
    0.3 * v.crime_organizado +
    0.3 * v.popularidade_governo;
  return {
    nota,
    v: {
      div: v.divida_publica,
      pib: v.pib,
      res: v.resultado_fiscal,
      pobr: v.pobreza,
      desemp: v.desemprego,
      infl: v.inflacao,
      selic: v.taxa_juros,
      pop: v.popularidade_governo,
      crime: v.crime_organizado,
      viol: v.violencia_letal,
    },
  };
};
if (estado.nota === null) {
  const r = rodar(estado.pacote)!;
  estado.nota = r.nota;
  console.log("inicio", JSON.stringify(r));
}
const testadas = estado.testadas ?? {};
const usadas = new Set(estado.pacote.map((j) => j[0]));
const inicio = Date.now();
for (const j of cands) {
  const k = `${j[0]}@${j[1]}`;
  if (usadas.has(j[0]) || k in testadas) continue;
  if (Date.now() - inicio > Number(process.env.LIMITE ?? 150_000)) break;
  const r = rodar([...estado.pacote, j]);
  testadas[k] = r ? r.nota : -1e9;
}
const faltam = cands.filter(
  (j) => !usadas.has(j[0]) && !(`${j[0]}@${j[1]}` in testadas),
).length;
if (faltam === 0) {
  const [k, nota] = Object.entries(testadas).sort((a, b) => b[1] - a[1])[0];
  if (nota > estado.nota!) {
    const [id, v] = k.split("@");
    estado.pacote.push([id, Number(v)]);
    estado.nota = nota;
    console.log(
      "ESCOLHEU",
      k,
      nota.toFixed(1),
      JSON.stringify(rodar(estado.pacote)!.v),
    );
  } else console.log("PAROU: nenhuma melhora", estado.nota);
  estado.testadas = {};
} else {
  estado.testadas = testadas;
  console.log("parcial, faltam", faltam);
}
writeFileSync(ESTADO, JSON.stringify(estado, null, 1));
