/**
 * A soma dos perfis fecha com os agregados do motor?
 * Uso: npx vite-node scripts/teste/conservacao-do-bolso.ts
 */
import { criarPartida } from "../../src/app/partida";
import { bolsosDosPerfis, rendasDosPerfis } from "../../src/app/partida/bolso";

const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
if (!c.ok) throw new Error(c.erros.join(" "));
const cong = c.value.content.manifest.congresso!;
const v = c.value.game.execution.values;
const rendas = rendasDosPerfis(c.value.content, v.salario_medio ?? 0);
const bolsos = bolsosDosPerfis(c.value.content, v);
const total = cong.perfis.reduce((s, p) => s + p[0], 0);
let trab = 0, salarios = 0, ganha = 0, paga = 0;
for (const [i, p] of cong.perfis.entries()) {
  if (rendas[i].porAno > 0) trab += p[0];
  salarios += p[0] * rendas[i].porAno;
  ganha += p[0] * bolsos[i].ganha;
  paga += p[0] * bolsos[i].paga;
}
console.log("soma dos pesos:", total);
console.log("parte que trabalha nos perfis:", (trab / total).toFixed(3));
console.log("ocupados / população (motor):", v.ocupados, v.populacao, v.ocupados && v.populacao ? (v.ocupados / v.populacao).toFixed(3) : "?");
console.log("salário médio × ocupados × 1e-6 =", v.massa_salarial);
console.log("Σ renda dos perfis (fração do eleitorado):", (salarios / total).toFixed(1), "por pessoa; salário médio:", v.salario_medio);
console.log("razão massa perfis/massa motor (por pessoa × ocupados):", ((salarios / total) * (v.ocupados ?? 0) * 1e-6 / (v.massa_salarial ?? 1) / (trab/total)).toFixed(3));
console.log("arrecadacao_consumo:", v.arrecadacao_consumo, " renda:", v.arrecadacao_renda_pessoas, " consumo_familias:", v.consumo_familias, " lucros:", v.lucros);
console.log("paga média por pessoa:", (paga / total).toFixed(1), " ganha média:", (ganha / total).toFixed(1));
