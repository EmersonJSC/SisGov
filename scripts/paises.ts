// Passo 6d: o motor roda dois países sem código de país. Rodar: npm run paises
//
// Esperado (escrito antes), um mandato (24 turnos):
// - teste, sem mudar nada: receita ~31,8% e gasto 30% do PIB; sobra, a
//   dívida cai um pouco (60 → ~56); juros perto de neutro + inflação (8%);
// - teste-pobre, sem mudar nada: receita ~25% e gasto 26%, déficit primário;
//   dívida de 70% acima da tolerância (50%), então a taxa de juros sobe ao
//   longo do mandato e a dívida não cai;
// - mesmo pacote nos dois (imposto de renda 25%, saúde 6% do PIB, áreas
//   protegidas 20%): a direção é a mesma nos dois; a receita sobe menos no
//   pobre (base de renda menor, mais sonegação); saúde e meio ambiente sobem;
// - plausível: receita 15–45%, gasto 15–50%, juros 2–25%, dívida no fim
//   abaixo de 150% do PIB.
//
// Conferido em 01/nov: tudo bateu menos "a receita sobe menos no pobre". Ela
// sobe mais (+2,3 contra +1,2) porque o pobre parte de 12% de imposto de
// renda e o teste de 20%: o pacote é o mesmo valor final, não o mesmo
// aumento. A expectativa estava mal escrita; o motor está certo.
import { criarPartida, jogar, type Estado, type Pedido } from "../src/partida";
import type { IndicesEssenciais } from "../src/motor";

const TURNOS_MANDATO = 24;
const PAISES = ["teste", "teste-pobre"];

const PACOTE: Pedido[] = [
  { tipo: "mudar_lei", lei: "imposto-renda", valor: 0.25 },
  { tipo: "mudar_lei", lei: "gasto-saude", valor: 0.06 },
  { tipo: "mudar_lei", lei: "areas-protegidas", valor: 0.2 },
];

const FAIXAS: Partial<Record<keyof IndicesEssenciais, [number, number]>> = {
  arrecadacao: [15, 45],
  gasto_publico: [15, 50],
  taxa_juros: [2, 25],
  divida_publica: [0, 150],
};

const INDICES = ["saude", "meio_ambiente", "padrao_vida", "corrupcao"];

const n = (v: number) => v.toFixed(1).padStart(5);

function linha(rotulo: string, e: Estado): string[] {
  const s = e.essenciais;
  console.log(
    `  ${rotulo.padEnd(18)} receita ${n(s.arrecadacao)}  gasto ${n(s.gasto_publico)}`,
    ` juros pagos ${n(s.juros_pagos)}  taxa ${n(s.taxa_juros)}  dívida ${n(s.divida_publica)}`,
    ` ${INDICES.map((i) => `${i} ${n(e.jogabilidade[i])}`).join("  ")}`,
  );
  const faixas = Object.entries(FAIXAS) as [
    keyof IndicesEssenciais,
    [number, number],
  ][];
  return faixas
    .filter(([id, [min, max]]) => !(s[id] >= min && s[id] <= max))
    .map(([id]) => `${rotulo}: ${id} ${s[id].toFixed(1)}`);
}

const fora: string[] = [];
for (const pais of PAISES) {
  console.log(`\n${pais}`);
  const comeco = jogar(criarPartida(pais, 42), 1).estado;
  fora.push(...linha("turno 1", comeco).map((f) => `${pais} ${f}`));
  const parado = jogar(criarPartida(pais, 42), TURNOS_MANDATO).estado;
  fora.push(...linha("fim, sem mudar", parado).map((f) => `${pais} ${f}`));
  const pacote = jogar(criarPartida(pais, 42), TURNOS_MANDATO, PACOTE).estado;
  fora.push(...linha("fim, com pacote", pacote).map((f) => `${pais} ${f}`));
}

console.log(
  fora.length === 0
    ? "\nTudo dentro das faixas plausíveis."
    : `\nFora da faixa:\n  ${fora.join("\n  ")}`,
);
