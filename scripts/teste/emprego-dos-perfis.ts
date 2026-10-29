/**
 * O país absurdo: o que o censo mostra quando o desemprego e a informalidade
 * se mexem. É a ferramenta que flagra "80% informal" ou "metade do país sem
 * emprego" antes de a tela mostrar.
 * Uso: npx vite-node scripts/teste/emprego-dos-perfis.ts
 */
import { criarPartida } from "../../src/app/partida";
import { bolsosDoEleitorado } from "../../src/app/partida/bolso";
import { censoDoPais } from "../../src/app/partida/censo";
import { origemDoDesempregado } from "../../src/game/congresso/vivo";

const c = criarPartida({ semente: 7, ocorrencias: false, eleicao: false });
if (!c.ok) throw new Error(c.erros.join(" "));
const { content } = c.value;
const base = c.value.game.execution.values;
console.log(
  `partida: desemprego ${base.desemprego?.toFixed(1)}%, informalidade ${base.informalidade?.toFixed(1)}%\n`,
);

const FAIXAS = ["carteira", "informal", "desempregado", "fora"];
const pct = (x: number): string => `${(x * 100).toFixed(1).padStart(5)}%`;

function linha(desemprego: number, informalidade: number): string {
  const ocupacao = censoDoPais(content, {
    ...base,
    desemprego,
    informalidade,
  }).find((a) => a.id === "ocupacao")!;
  return FAIXAS.map(
    (f) => pct(ocupacao.faixas.find((x) => x.id === f)?.parte ?? 0),
  ).join("  ");
}

console.log("desemprego  informalidade   carteira  informal  desempreg.  fora");
for (const desemprego of [0, 6, 12, 25, 40])
  for (const informalidade of [20, 38.6, 55, 80])
    console.log(
      `${String(desemprego).padStart(9)}%  ${String(informalidade).padStart(11)}%   ${linha(desemprego, informalidade)}`,
    );

console.log("\nBOLSO DO DESEMPREGADO (desemprego 15%), por mês, por pessoa");
const vs = { ...base, desemprego: 15 };
const vivo = bolsosDoEleitorado(content, vs)!;
const primeira = vivo.manifesto.vivo!.primeiraLinhaDeDesempregado;
for (const origem of ["carteira", "informal"]) {
  const linhas = vivo.manifesto.perfis
    .map((p, i) => ({ p, i }))
    .filter(
      ({ i }) => i >= primeira && origemDoDesempregado(vivo.manifesto, i) === origem,
    );
  const peso = linhas.reduce((s, { p }) => s + p[0], 0);
  const media = (k: "ganha" | "paga" | "sobra"): number =>
    linhas.reduce((s, { p, i }) => s + p[0] * vivo.bolsos[i][k], 0) / peso / 12;
  console.log(
    `  ex-${origem.padEnd(9)} ${pct(peso)} do eleitorado  ganha R$ ${media("ganha").toFixed(0)}  paga R$ ${media("paga").toFixed(0)}  sobra R$ ${media("sobra").toFixed(0)}`,
  );
}
