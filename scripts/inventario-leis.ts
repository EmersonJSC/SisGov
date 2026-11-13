// Inventário das leis: uma linha por lei, com as marcas que só um número mostra
// (sem ligação, duplicata provável, opções demais ou de menos, sem dinheiro nem
// efeito). Roda com `npm run inventario` e reescreve
// `docs/jogo/leis-inventario.md`. Não muda nenhuma lei.
import { writeFileSync } from "node:fs";
import { criarPartida, montarVisao, type VisaoLei } from "../src/partida";

const PAIS = "brasil-2026";
const SAIDA = "docs/jogo/leis-inventario.md";
/** Duas leis da mesma esfera com nomes que dividem esta fração das palavras. */
const NOMES_PARECIDOS = 0.5;
const POUCAS_OPCOES = 2;
const MUITAS_OPCOES = 6;
const PALAVRA_MINIMA = 4;
const VAZIAS = new Set([
  "para",
  "pela",
  "pelo",
  "como",
  "entre",
  "sobre",
  "contra",
  "lei",
  "leis",
]);

const visao = montarVisao(criarPartida(PAIS, 1));
const indices = new Set(
  visao.bolhas.filter((b) => b.tipo !== "grupo").map((b) => b.id),
);
const grupos = new Set(
  visao.bolhas.filter((b) => b.tipo === "grupo").map((b) => b.id),
);
const nomeDoIndice = new Map(visao.bolhas.map((b) => [b.id, b.nome]));

const alvosDe = (lei: string, conjunto: Set<string>) =>
  [
    ...new Set(
      visao.ligacoes
        .filter((l) => l.origem === lei && conjunto.has(l.alvo))
        .map((l) => l.alvo),
    ),
  ].sort();

const palavras = (nome: string) =>
  new Set(
    nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .split(/[^a-z0-9]+/)
      .filter((p) => p.length >= PALAVRA_MINIMA && !VAZIAS.has(p)),
  );

function parecidas(a: Set<string>, b: Set<string>): boolean {
  const comuns = [...a].filter((p) => b.has(p)).length;
  const menor = Math.min(a.size, b.size);
  return menor > 0 && comuns / menor >= NOMES_PARECIDOS;
}

type Linha = Readonly<{
  lei: VisaoLei;
  indices: readonly string[];
  grupos: readonly string[];
  marcas: readonly string[];
}>;

const leis = [...visao.leis].sort(
  (a, b) =>
    (a.esfera ?? "").localeCompare(b.esfera ?? "") ||
    a.nome.localeCompare(b.nome),
);
const alvos = new Map(leis.map((l) => [l.id, alvosDe(l.id, indices)]));
/** Palavra que aparece no nome de muitas leis ("verba", "imposto") não indica parentesco. */
const PALAVRA_COMUM = 6;
const frequencia = new Map<string, number>();
leis.forEach((l) =>
  palavras(l.nome).forEach((p) =>
    frequencia.set(p, (frequencia.get(p) ?? 0) + 1),
  ),
);
const nomes = new Map(
  leis.map((l) => [
    l.id,
    new Set(
      [...palavras(l.nome)].filter(
        (p) => (frequencia.get(p) ?? 0) <= PALAVRA_COMUM,
      ),
    ),
  ]),
);

/** Mexer exatamente nos mesmos índices só conta como suspeita com pelo menos tantos. */
const MESMOS_INDICES_MINIMO = 2;

/** Outras leis da mesma esfera com nome parecido. */
function nomeParecido(lei: VisaoLei): string[] {
  return leis
    .filter((o) => o.id !== lei.id && o.esfera === lei.esfera)
    .filter((o) => parecidas(nomes.get(lei.id)!, nomes.get(o.id)!))
    .map((o) => o.nome);
}

/** Outras leis da mesma esfera que mexem exatamente nos mesmos índices (dois ou mais). */
function mesmoEfeito(lei: VisaoLei): string[] {
  const meus = alvos.get(lei.id) ?? [];
  if (meus.length < MESMOS_INDICES_MINIMO) return [];
  return leis
    .filter((o) => o.id !== lei.id && o.esfera === lei.esfera)
    .filter((o) => (alvos.get(o.id) ?? []).join(",") === meus.join(","))
    .map((o) => o.nome);
}

const linhas: Linha[] = leis.map((lei) => {
  const i = alvos.get(lei.id) ?? [];
  const g = alvosDe(lei.id, grupos);
  const n = lei.opcoes?.length ?? 0;
  const nome = nomeParecido(lei);
  const efeito = mesmoEfeito(lei);
  const marcas = [
    i.length === 0 && g.length === 0 ? "sem ligação" : "",
    i.length === 0 && g.length > 0 ? "só grupos" : "",
    lei.opcoes && n <= POUCAS_OPCOES ? `${n} opções` : "",
    lei.opcoes && n > MUITAS_OPCOES ? `${n} opções` : "",
    lei.naoLegislada ? "país não declara" : "",
    nome.length ? `nome parecido: ${nome.join("; ")}` : "",
    efeito.length ? `mesmo efeito: ${efeito.join("; ")}` : "",
  ].filter(Boolean);
  return { lei, indices: i, grupos: g, marcas };
});

const forma = (l: VisaoLei) =>
  l.opcoes ? `${l.opcoes.length} opções` : "régua";
const DINHEIRO: Readonly<Record<string, string>> = {
  verba: "gasta",
  imposto: "arrecada",
};
const dinheiro = (l: VisaoLei) => DINHEIRO[l.fluxo?.tipo ?? ""] ?? "";
// a barra "|" quebraria a tabela: "a|b" vira "a/b"; quebra de linha vira espaço
const celula = (t: string) => t.replace(/\|/g, "/").replace(/\n/g, " ");

const conta = (f: (x: Linha) => boolean) => linhas.filter(f).length;
const temMarca = (x: Linha, m: string) => x.marcas.some((y) => y.startsWith(m));
const esferas = [...new Set(leis.map((l) => l.esfera ?? "(sem esfera)"))];

const resumo = [
  `| Esfera | Leis | Sem ligação | Só grupos | Nome parecido | Mesmo efeito | Não declaradas |`,
  `| ------ | ---- | ----------- | --------- | ------------- | ------------ | -------------- |`,
  ...esferas.map((e) => {
    const da = (x: Linha) => (x.lei.esfera ?? "(sem esfera)") === e;
    return `| ${e} | ${conta(da)} | ${conta((x) => da(x) && temMarca(x, "sem ligação"))} | ${conta((x) => da(x) && temMarca(x, "só grupos"))} | ${conta((x) => da(x) && temMarca(x, "nome parecido"))} | ${conta((x) => da(x) && temMarca(x, "mesmo efeito"))} | ${conta((x) => da(x) && temMarca(x, "país não"))} |`;
  }),
  `| **Total** | **${linhas.length}** | **${conta((x) => temMarca(x, "sem ligação"))}** | **${conta((x) => temMarca(x, "só grupos"))}** | **${conta((x) => temMarca(x, "nome parecido"))}** | **${conta((x) => temMarca(x, "mesmo efeito"))}** | **${conta((x) => temMarca(x, "país não"))}** |`,
];

const porEsfera = esferas.flatMap((e) => [
  "",
  `## ${e}`,
  "",
  "| Lei | O que faz | Forma | Dinheiro | Índices que mexe | Marcas |",
  "| --- | --------- | ----- | -------- | ---------------- | ------ |",
  ...linhas
    .filter((x) => (x.lei.esfera ?? "(sem esfera)") === e)
    .map(
      (x) =>
        `| ${celula(x.lei.nome)} \`${x.lei.id}\` | ${celula(x.lei.descricao)} | ${forma(x.lei)} | ${dinheiro(x.lei)} | ${x.indices.map((i) => nomeDoIndice.get(i) ?? i).join(", ")} | ${celula(x.marcas.join(" · "))} |`,
    ),
]);

const texto = [
  "# Inventário das leis",
  "",
  `Gerado por \`npm run inventario\` (país ${PAIS}). Não editar à mão: rodar de novo.`,
  "As marcas só apontam o que o número mostra; cortar, juntar ou manter é decisão do autor.",
  "",
  "- **sem ligação**: a lei não mexe em nenhum índice nem grupo.",
  "- **só grupos**: mexe em grupos, mas em nenhum índice.",
  `- **N opções**: lei de opções com ${POUCAS_OPCOES} ou menos, ou mais de ${MUITAS_OPCOES}.`,
  `- **nome parecido**: mesma esfera e metade ou mais das palavras do nome em comum (sem contar palavras que aparecem em mais de ${PALAVRA_COMUM} leis, como "verba").`,
  `- **mesmo efeito**: mesma esfera e mexe exatamente nos mesmos índices (${MESMOS_INDICES_MINIMO} ou mais).`,
  "- **país não declara**: o país não tem valor para ela (fica fora do mapa).",
  "",
  "## Resumo por esfera",
  "",
  ...resumo,
  ...porEsfera,
  "",
].join("\n");

writeFileSync(SAIDA, texto);
console.log(`${linhas.length} leis → ${SAIDA}`);
console.log(resumo.at(-1));
