// Passo 7a: pops com renda calculada pelo motor. Rodar: npm run pops
//
// Esperado (escrito antes, igual a src/motor/populacao/populacao.md), país de
// teste:
// - turno 1: renda média por pessoa = PIB nominal ÷ população; empresário
//   bem acima (5×), informal bem abaixo (¼);
// - imposto de renda 20% → 30%: a renda de todos os pops cai na mesma
//   proporção, a bruta não muda;
// - transferência de renda 2% → 4% do PIB: a renda dos três pops pobres
//   sobe, a dos médios e ricos não muda;
// - num mandato sem mudar nada: todas as rendas sobem com o PIB nominal, e a
//   ordem entre os pops não muda.
import {
  criarPartida,
  jogar,
  nomesPops,
  type Estado,
  type Pedido,
} from "../src/partida";

const TURNOS_MANDATO = 24;
const PAIS = "teste";

const CENARIOS: [string, number, Pedido[]][] = [
  ["turno 1", 1, []],
  [
    "imposto de renda 30%",
    1,
    [{ tipo: "mudar_lei", lei: "imposto-renda", valor: 0.3 }],
  ],
  [
    "transferência 4% do PIB",
    1,
    [{ tipo: "mudar_lei", lei: "transferencia-renda", valor: 0.04 }],
  ],
  ["fim do mandato, sem mudar", TURNOS_MANDATO, []],
];

const mil = (v: number) => (v / 1000).toFixed(1).padStart(6);

function mostrar(rotulo: string, e: Estado, antes?: Estado) {
  const media = e.essenciais.pib_nominal / e.essenciais.populacao;
  console.log(`\n${rotulo} (renda média ${mil(media)} mil/ano)`);
  console.log(
    `  ${"pop".padEnd(26)} pessoas  bruta  imposto  transf.  renda  × média  vs turno 1`,
  );
  for (const [id, p] of Object.entries(e.pops)) {
    const delta = antes ? (p.renda / antes.pops[id].renda - 1) * 100 : 0;
    console.log(
      `  ${nomesPops[id].padEnd(26)}`,
      `${(p.pessoas / 1e6).toFixed(1).padStart(5)}M`,
      `${mil(p.renda_bruta)} ${mil(p.imposto)}  ${mil(p.transferencia)}`,
      ` ${mil(p.renda)}  ${(p.renda / media).toFixed(2).padStart(6)}`,
      antes ? `  ${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%` : "",
    );
  }
}

const base = jogar(criarPartida(PAIS, 42), 1).estado;
for (const [rotulo, turnos, pedidos] of CENARIOS) {
  const e = jogar(criarPartida(PAIS, 42), turnos, pedidos).estado;
  mostrar(rotulo, e, turnos === 1 && pedidos.length === 0 ? undefined : base);
}
