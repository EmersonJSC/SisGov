// Receita do começo por lei de imposto, em % do PIB. Rodar:
// npx vite-node scripts/receita-inicial.ts brasil-2026
// Serve para calibrar a base de um imposto novo e a receita_fora_das_leis.
import { arrecadacaoPorLei } from "../src/motor/turno/etapas/economia";
import { criarPartida } from "../src/partida";

const pais = process.argv[2] ?? "brasil-2026";
const { regras, estado } = criarPartida(pais, 1, { semCongresso: true });
const e = estado.essenciais;
const porLei = arrecadacaoPorLei(regras, estado.leis, e);
let total = 0;
for (const [id, v] of Object.entries(porLei)) {
  const pct = (v / e.pib_nominal) * 100;
  total += pct;
  console.log(`${id.padEnd(44)} ${pct.toFixed(4)}`);
}
console.log(`${"leis".padEnd(44)} ${total.toFixed(4)}`);
console.log(
  `${"fora das leis".padEnd(44)} ${regras.pais.receita_fora_das_leis.toFixed(4)}`,
);
console.log(
  `${"arrecadação declarada".padEnd(44)} ${e.arrecadacao.toFixed(4)}`,
);
