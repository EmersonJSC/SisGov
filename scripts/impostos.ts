// Passo 6b: impostos sobre consumo e sobre empresas. Rodar: npm run impostos
//
// Esperado (escrito antes), país de teste:
// - receita do turno 1 com as leis como estão: 31,8% do PIB, a mesma de antes
//   do 6b (as duas leis tiraram a sua parte de receita_fora_das_leis);
// - consumo (pico 50%, acima da faixa de 0 a 40%): quanto mais alto, mais
//   arrecada; padrão de vida cai e pobreza sobe ao longo de 2 turnos;
// - empresas (pico 35%): arrecada mais até 35%; em 60% arrecada MENOS que em
//   35% (o lucro foge); industrialização cai, inteira em 1 ano (6 turnos).
import { criarPartida, jogar, type Estado } from "../src/partida";

const TURNOS_MANDATO = 24;

function com(lei: string, valor: number, turnos: number): Estado {
  return jogar(criarPartida("teste", 42, { semCongresso: true }), turnos, [
    { tipo: "mudar_lei", lei, valor },
  ]).estado;
}

const CASOS = [
  {
    lei: "imposto-consumo",
    valores: [0, 0.12, 0.25, 0.4],
    indices: ["padrao_vida", "pobreza"],
  },
  {
    lei: "imposto-empresas",
    valores: [0, 0.25, 0.35, 0.6],
    indices: ["industrializacao"],
  },
];

const n = (v: number) => v.toFixed(1).padStart(5);
const inicio = jogar(
  criarPartida("teste", 42, { semCongresso: true }),
  1,
  [],
).estado;
console.log(
  `Receita no turno 1, leis como estão: ${n(inicio.essenciais.arrecadacao)}% do PIB`,
);

for (const { lei, valores, indices } of CASOS) {
  console.log(`\n${lei}`);
  for (const valor of valores) {
    const t1 = com(lei, valor, 1);
    const fim = com(lei, valor, TURNOS_MANDATO);
    const ind = indices.map((i) => `${i} ${n(fim.jogabilidade[i])}`).join("  ");
    console.log(
      `  ${String(valor * 100).padStart(3)}%  receita ${n(t1.essenciais.arrecadacao)}`,
      ` dívida no fim ${n(fim.essenciais.divida_publica)}  ${ind}`,
    );
  }
}
