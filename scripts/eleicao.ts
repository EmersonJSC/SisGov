// Passo 9: eleição e desgaste. Rodar: npm run eleicao
//
// Esperado (escrito antes, igual a src/motor/eleicao/eleicao.md):
// - governo parado: grupos perto de 50, desgaste 2,25, perde por pouco
//   (apoio perto de 48);
// - transferência de renda 2% → 4%: os trabalhadores, maior grupo, sobem
//   bastante e o governo vence;
// - imposto sobre empresas 25% → 35%: perde, por um pouco mais que parado;
// - o país pobre se comporta igual: parado perde por pouco.
import { criarPartida, jogar, nomesGrupos, type Pedido } from "../src/partida";

const lei = (id: string, valor: number): Pedido[] => [
  { tipo: "mudar_lei", lei: id, valor },
];

const CENARIOS: [string, string, Pedido[]][] = [
  ["teste", "sem mudar nada", []],
  ["teste", "transferência 4% do PIB", lei("transferencia-renda", 0.04)],
  ["teste", "imposto sobre empresas 35%", lei("imposto-empresas", 0.35)],
  ["teste-pobre", "sem mudar nada", []],
];

const n = (v: number) => v.toFixed(1).padStart(5);

for (const [pais, rotulo, pedidos] of CENARIOS) {
  const e = jogar(criarPartida(pais, 42), 24, pedidos).estado;
  const el = e.eleicao;
  console.log(`\n${pais}: ${rotulo}`);
  if (!el) {
    console.log("  sem eleição");
    continue;
  }
  const total = Object.values(el.grupos).reduce((s, g) => s + g.pessoas, 0);
  for (const [id, g] of Object.entries(el.grupos))
    console.log(
      `  ${nomesGrupos[id].padEnd(16)} satisfação ${n(g.satisfacao)}  peso ${n((g.pessoas / total) * 100)}%`,
    );
  console.log(
    `  desgaste ${n(el.desgaste)}  apoio ${n(el.apoio)}  adversário ${n(el.adversario)}  margem ${n(el.margem)}`,
  );
  console.log(
    `  ${el.venceu ? "GOVERNO VENCE" : "GOVERNO PERDE: fim da partida"}`,
  );
}
