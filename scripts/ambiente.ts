// Passo 6c: proteção ambiental em 6 leis. Rodar: npm run ambiente
//
// Esperado (escrito antes), país de teste, fim do mandato (24 turnos):
// - receita do turno 1 com as leis como estão: 31,8% do PIB (o país de teste
//   não legislou o imposto sobre poluição, então ele não arrecada);
// - polícia ambiental e saneamento: quanto mais gasto, mais dívida; meio
//   ambiente sobe (polícia também tira um pouco de corrupção; saneamento
//   também sobe a saúde, mais devagar);
// - licenciamento: frouxo sobe industrialização e corrupção e derruba o meio
//   ambiente; rigoroso é o contrário, sem a corrupção;
// - áreas protegidas: meio ambiente sobe forte; reputação sobe; indústria e
//   padrão de vida caem um pouco;
// - terras indígenas: meio ambiente e reputação sobem; indústria cai um pouco;
// - imposto sobre poluição, proposto do zero (não legislado): arrecada mais
//   até o pico do país (30%) e menos em 60%; meio ambiente sobe, indústria cai.
import { criarPartida, jogar, type Estado } from "../src/partida";
import type { ValorLei } from "../src/motor";

const TURNOS_MANDATO = 24;

function com(lei: string, valor: ValorLei, turnos: number): Estado {
  return jogar(criarPartida("teste", 42, { semCongresso: true }), turnos, [
    { tipo: "mudar_lei", lei, valor },
  ]).estado;
}

const CASOS: { lei: string; valores: ValorLei[]; indices: string[] }[] = [
  {
    lei: "policia-ambiental",
    valores: [0, 0.002, 0.005, 0.01],
    indices: ["meio_ambiente", "corrupcao"],
  },
  {
    lei: "saneamento-basico",
    valores: [0, 0.005, 0.01, 0.02],
    indices: ["meio_ambiente", "saude"],
  },
  {
    lei: "licenciamento-ambiental",
    valores: ["frouxo", "normal", "rigoroso"],
    indices: ["meio_ambiente", "industrializacao", "corrupcao"],
  },
  {
    lei: "areas-protegidas",
    valores: [0, 0.1, 0.2, 0.4],
    indices: [
      "meio_ambiente",
      "reputacao_internacional",
      "industrializacao",
      "padrao_vida",
    ],
  },
  {
    lei: "terras-indigenas",
    valores: [0, 0.05, 0.15, 0.3],
    indices: ["meio_ambiente", "reputacao_internacional", "industrializacao"],
  },
  {
    lei: "imposto-poluicao",
    valores: [0, 0.2, 0.3, 0.6],
    indices: ["meio_ambiente", "industrializacao"],
  },
];

const n = (v: number) => v.toFixed(1).padStart(5);
const rotulo = (v: ValorLei) =>
  (typeof v === "number" ? `${+(v * 100).toFixed(1)}%` : v).padStart(8);
const inicio = jogar(
  criarPartida("teste", 42, { semCongresso: true }),
  1,
  [],
).estado;
console.log(
  `Receita no turno 1, leis como estão: ${n(inicio.essenciais.arrecadacao)}% do PIB`,
);

for (const { lei, valores, indices } of CASOS) {
  const vigente = inicio.leis[lei];
  console.log(
    `\n${lei} (país: ${vigente === undefined ? "não legislada" : rotulo(vigente).trim()})`,
  );
  for (const valor of valores) {
    const t1 = com(lei, valor, 1);
    const fim = com(lei, valor, TURNOS_MANDATO);
    const ind = indices.map((i) => `${i} ${n(fim.jogabilidade[i])}`).join("  ");
    console.log(
      `  ${rotulo(valor)}  receita ${n(t1.essenciais.arrecadacao)}`,
      ` dívida no fim ${n(fim.essenciais.divida_publica)}  ${ind}`,
    );
  }
}
