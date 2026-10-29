/**
 * Quanto ganha, paga e sobra em cada faixa, na partida de verdade.
 * Uso: npx vite-node scripts/teste/bolso-dos-perfis.ts
 */
import { criarPartida } from "../../src/app/partida";
import { bolsosDosPerfis } from "../../src/app/partida/bolso";

const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
if (!c.ok) throw new Error(c.erros.join(" "));
const cong = c.value.content.manifest.congresso!;
const vs = c.value.game.execution.values;
const bolsos = bolsosDosPerfis(c.value.content, vs);
console.log(`salário médio do país: ${vs.salario_medio?.toFixed(0)}/ano\n`);

for (const atributo of ["ocupacao", "renda"]) {
  const col = cong.atributos.indexOf(atributo) + 1;
  const soma = new Map<
    string,
    { peso: number; g: number; p: number; s: number }
  >();
  for (const [i, perfil] of cong.perfis.entries()) {
    const faixa = cong.valores[atributo]![perfil[col]];
    const a = soma.get(faixa) ?? { peso: 0, g: 0, p: 0, s: 0 };
    a.peso += perfil[0];
    a.g += perfil[0] * bolsos[i].ganha;
    a.p += perfil[0] * bolsos[i].paga;
    a.s += perfil[0] * bolsos[i].sobra;
    soma.set(faixa, a);
  }
  console.log(
    atributo.toUpperCase().padEnd(24),
    "ganha/mês   paga/mês   sobra/mês",
  );
  for (const [faixa, a] of [...soma].sort(
    (x, y) => y[1].s / y[1].peso - x[1].s / x[1].peso,
  ))
    console.log(
      `  ${faixa.padEnd(22)}` +
        [a.g, a.p, a.s]
          .map((v) => `R$ ${(v / a.peso / 12).toFixed(0).padStart(7)}`)
          .join("  "),
    );
  console.log();
}
