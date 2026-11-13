// O jogador sente a lei? Para cada lei que mexe em índice, leva a lei ao extremo
// oposto de onde está, joga um ano (6 turnos) e compara com o mesmo ano sem
// mexer: quanto a saúde (0 a 100) do índice mais afetado mudou. Mostra também
// quantos problemas o país tem no começo e depois de um ano parado.
// Roda com `npm run sentir`; escreve `docs/jogo/leis-sentir.md`.
import { writeFileSync } from "node:fs";
import {
  avancar,
  criarPartida,
  montarVisao,
  type Partida,
  type Pedido,
} from "../src/partida";

const PAIS = "brasil-2026";
const TURNOS = 6;
const SAIDA = "docs/jogo/leis-sentir.md";
const METADE = 2;
const NA_LISTA = 20;
const MS_POR_SEGUNDO = 1000;
const QUASE_NADA = 3;
const DA_PARA_VER = 10;
/** Linhas do resumo que o terminal mostra. */
const RESUMO_DE = 4;
const RESUMO_ATE = 16;
/** Faixas de quanto a lei move a saúde do índice, em pontos de 0 a 100. */
const FAIXAS = [
  { ate: 1, rotulo: "menos de 1 ponto (não se sente)" },
  { ate: QUASE_NADA, rotulo: "1 a 3 pontos (quase nada)" },
  { ate: DA_PARA_VER, rotulo: "3 a 10 pontos (dá para ver)" },
  { ate: Infinity, rotulo: "10 pontos ou mais (forte)" },
] as const;

const jogarAno = (p: Partida, pedidos: Pedido[]) =>
  Array.from({ length: TURNOS }).reduce<Partida>(
    (q, _, t) => avancar(q, t === 0 ? pedidos : []),
    p,
  );

const saudes = (p: Partida) =>
  new Map(
    montarVisao(p)
      .bolhas.filter((b) => b.saude !== undefined)
      .map((b) => [b.id, b.saude as number]),
  );

const contarAlertas = (p: Partida) => {
  const conta = new Map<string, number>();
  montarVisao(p).bolhas.forEach((b) => {
    if (b.alerta) conta.set(b.alerta, (conta.get(b.alerta) ?? 0) + 1);
  });
  return ["critico", "preocupante", "normal", "bom"]
    .map((a) => `${a} ${conta.get(a) ?? 0}`)
    .join(" · ");
};

const inicio = criarPartida(PAIS, 1, { semCongresso: true });
const visao0 = montarVisao(inicio);
const nomes = new Map(visao0.bolhas.map((b) => [b.id, b.nome]));
const nomeDaLei = new Map(visao0.leis.map((l) => [l.id, l.nome]));
const comIndice = new Set(
  visao0.ligacoes
    .filter((l) => nomes.has(l.alvo) && nomeDaLei.has(l.origem))
    .map((l) => l.origem),
);

/** O valor mais longe do atual: a outra ponta da régua, ou a opção mais distante. */
function extremo(id: string): Pedido | null {
  const lei = inicio.regras.leis[id];
  const atual = inicio.estado.leis[id];
  if (!lei || atual === undefined) return null;
  if (lei.forma === "continua") {
    const meio = (lei.faixa.min + lei.faixa.max) / METADE;
    const valor = Number(atual) <= meio ? lei.faixa.max : lei.faixa.min;
    return { tipo: "mudar_lei", lei: id, valor };
  }
  const i = lei.opcoes.findIndex((o) => o.id === atual);
  const longe =
    i < lei.opcoes.length / METADE ? lei.opcoes.at(-1) : lei.opcoes[0];
  return longe ? { tipo: "mudar_lei", lei: id, valor: longe.id } : null;
}

const parado = jogarAno(inicio, []);
const colididas: string[] = [];
const base = saudes(parado);
const t0 = performance.now();
const resultados = [...comIndice].flatMap((id) => {
  const pedido = extremo(id);
  if (!pedido) return [];
  // lei que colide com outra em vigor não pode ir ao extremo sozinha: fica de fora
  const jogado = (() => {
    try {
      return jogarAno(inicio, [pedido]);
    } catch {
      return null;
    }
  })();
  if (!jogado) {
    colididas.push(id);
    return [];
  }
  const depois = saudes(jogado);
  const [indice, delta] = [...depois].reduce<[string, number]>(
    (melhor, [i, s]) => {
      const d = Math.abs(s - (base.get(i) ?? s));
      return d > melhor[1] ? [i, d] : melhor;
    },
    ["", 0],
  );
  return [{ id, indice, delta }];
});
const ms = performance.now() - t0;

const linhas = FAIXAS.map((f, i) => {
  const de = i === 0 ? -Infinity : FAIXAS[i - 1].ate;
  const n = resultados.filter((r) => r.delta >= de && r.delta < f.ate).length;
  return `| ${f.rotulo} | ${n} |`;
});
const ordem = [...resultados].sort((a, b) => b.delta - a.delta);
const lista = (r: (typeof resultados)[number]) =>
  `| ${nomeDaLei.get(r.id)} | ${nomes.get(r.indice) ?? "-"} | ${r.delta.toFixed(1)} |`;

const texto = [
  "# As leis se sentem?",
  "",
  `Gerado por \`npm run sentir\` (${PAIS}, sem Congresso). Cada lei vai ao extremo oposto de onde está, joga ${TURNOS} turnos (um ano) e compara com o mesmo ano sem mexer. Mede a saúde do índice (0 a 100) que mais mudou.`,
  "",
  `- Problemas no começo: ${contarAlertas(inicio)}`,
  `- Depois de um ano sem fazer nada: ${contarAlertas(parado)}`,
  `- Leis com índice medidas: ${resultados.length} (de ${visao0.leis.length}); ${colididas.length} não foram ao extremo por colidir com outra lei`,
  "",
  "| Quanto a lei mexe no índice mais afetado, em um ano | Leis |",
  "| --- | --- |",
  ...linhas,
  "",
  `## As ${NA_LISTA} mais fortes`,
  "",
  "| Lei | Índice | Pontos |",
  "| --- | --- | --- |",
  ...ordem.slice(0, NA_LISTA).map(lista),
  "",
  `## As ${NA_LISTA} mais fracas`,
  "",
  "| Lei | Índice | Pontos |",
  "| --- | --- | --- |",
  ...ordem.slice(-NA_LISTA).map(lista),
  "",
].join("\n");
writeFileSync(SAIDA, texto);
console.log(texto.split("\n").slice(RESUMO_DE, RESUMO_ATE).join("\n"));
console.log(`(${(ms / MS_POR_SEGUNDO).toFixed(0)} s)`);
