/**
 * Que frase sai de cada bolha, na partida de verdade. Serve para olhar os
 * sujeitos que a heurística derivou da unidade e ver onde ela errou.
 * Uso: npx vite-node scripts/teste/frases-das-bolhas.ts
 */
import { criarPartida, verPartida } from "../../src/app/partida";

const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
if (!c.ok) throw new Error(c.erros.join(" "));
const v = verPartida(c.value);

const comFrase = v.bolhas.filter((b) => b.frase !== undefined);
const sem = v.bolhas.filter((b) => b.frase === undefined);

console.log(
  `bolhas: ${v.bolhas.length}  com frase: ${comFrase.length}  sem: ${sem.length}\n`,
);
console.log("=== COM FRASE ===");
for (const b of comFrase) {
  const med = b.medida
    ? `${b.medida.valor.toFixed(1)} ${b.medida.unidade}`
    : `${b.valor.toFixed(1)}`;
  console.log(`[${b.tipo}] ${b.nome}\n    ${med}\n    -> ${b.frase}`);
}
console.log("\n=== SEM FRASE (cai no número) ===");
for (const b of sem) {
  console.log(
    `[${b.tipo}] ${b.nome} | ${b.medida?.unidade ?? b.unidade ?? "-"}`,
  );
}
