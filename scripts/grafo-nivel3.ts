// Mede o nível 3 do grafo (índices e leis): o que está solto, o que não leva a
// nada e quem é dono de quê. Só leitura. Rodar: npx vite-node scripts/grafo-nivel3.ts
import { readdirSync, readFileSync } from "node:fs";

const MUNDO = "src/conteudo/mundo";
const ler = <T>(caminho: string): T =>
  JSON.parse(readFileSync(caminho, "utf8")) as T;

interface Efeito {
  indice: string;
}
interface Ponto {
  economico?: number;
  social?: number;
}
interface Lei {
  id: string;
  esfera: string;
  efeitos?: Efeito[];
  opcoes?: { efeitos?: Efeito[]; bussola?: Ponto }[];
  bussola?: { min?: Ponto; max?: Ponto };
  conta?: unknown;
  calculo?: unknown;
}
interface Indice {
  id: string;
  nome: string;
  dono: string;
}

const indices = ler<{ variaveis: Indice[] }>(
  `${MUNDO}/indicadores/variaveis.json`,
).variaveis;
const ids = new Set(indices.map((i) => i.id));
const leis = readdirSync(`${MUNDO}/leis`)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ler<Lei>(`${MUNDO}/leis/${f}`));
const instituicoes = ler<{ instituicoes: { id: string; poder?: string }[] }>(
  `${MUNDO}/ministerios/instituicoes.json`,
).instituicoes;
const derivas = ler<{ derivas: { indice: string; por: string }[] }>(
  `${MUNDO}/indicadores/derivas.json`,
).derivas;
const grupos = ler<{ grupos: { cobra: { indice: string }[] }[] }>(
  `${MUNDO}/grupos/grupos.json`,
).grupos;

/** Todo texto dentro de um JSON (para achar ids citados pelos módulos). */
function textos(x: unknown): string[] {
  if (typeof x === "string") return [x];
  if (Array.isArray(x)) return x.flatMap(textos);
  if (x && typeof x === "object") return Object.values(x).flatMap(textos);
  return [];
}
const modulos = ["atendimento", "saneamento", "moradia", "mercado"].flatMap(
  (pasta) =>
    readdirSync(`${MUNDO}/${pasta}`).map((f) =>
      textos(ler<unknown>(`${MUNDO}/${pasta}/${f}`)),
    ),
);
const citadoPorModulo = new Set(modulos.flat());

const alvos = (l: Lei) =>
  new Set(
    [...(l.efeitos ?? []), ...(l.opcoes ?? []).flatMap((o) => o.efeitos ?? [])]
      .map((e) => e.indice)
      .filter((i) => ids.has(i)),
  );
const pontos = (l: Lei): Ponto[] =>
  l.opcoes
    ? l.opcoes.map((o) => o.bussola ?? {})
    : [l.bussola?.min ?? {}, l.bussola?.max ?? {}];
const noCentro = (l: Lei) => pontos(l).every((p) => !p.economico && !p.social);

const entraLei = leis
  .flatMap((l) => [...alvos(l)])
  .reduce(
    (conta, i) => conta.set(i, (conta.get(i) ?? 0) + 1),
    new Map<string, number>(),
  );
const cobrados = new Set(grupos.flatMap((g) => g.cobra.map((c) => c.indice)));
const empurra = new Set(derivas.map((d) => d.por));
const recebe = new Set(derivas.map((d) => d.indice));

/** Até quantas leis um índice é "puxado por pouca lei". */
const POUCAS_LEIS = 2;
const semNada = leis.filter(
  (l) =>
    alvos(l).size === 0 && !l.conta && !l.calculo && !citadoPorModulo.has(l.id),
);
const umFio = leis.filter(
  (l) => alvos(l).size === 1 && !l.conta && !citadoPorModulo.has(l.id),
);
const semSaida = indices.filter(
  (i) => !cobrados.has(i.id) && !empurra.has(i.id),
);
const sozinhos = indices.filter(
  (i) =>
    !entraLei.has(i.id) &&
    !recebe.has(i.id) &&
    !empurra.has(i.id) &&
    !cobrados.has(i.id) &&
    !citadoPorModulo.has(i.id) &&
    i.dono !== "pais",
);
const donos = indices.reduce(
  (mapa, i) => mapa.set(i.dono, [...(mapa.get(i.dono) ?? []), i.id]),
  new Map<string, string[]>(),
);
const semIndice = instituicoes.filter((i) => !i.poder && !donos.has(i.id));

const linhas = [
  `${leis.length} leis, ${indices.length} índices, ${derivas.length} fios entre índices, ${cobrados.size} índices cobrados por grupos`,
  `Lei sem nada (sem efeito, dinheiro ou módulo): ${semNada.length}`,
  `Lei no centro da bússola (nenhum grupo reage): ${leis.filter(noCentro).length}`,
  `Lei com um fio só: ${umFio.length}`,
  `Índice sem saída (nenhum grupo cobra, não empurra outro): ${semSaida.length}`,
  `Índice sozinho (nada entra nem sai): ${sozinhos.length} ${sozinhos.map((i) => i.id).join(", ")}`,
  `Índice com 1–2 leis: ${indices.filter((i) => (entraLei.get(i.id) ?? 0) > 0 && (entraLei.get(i.id) ?? 0) <= POUCAS_LEIS).length}`,
  `Instituição sem índice: ${semIndice.length} ${semIndice.map((i) => i.id).join(", ")}`,
  "",
  "Índices por dono:",
  ...[...donos]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([d, is]) => `  ${d} (${is.length})`),
];
console.log(linhas.join("\n"));
