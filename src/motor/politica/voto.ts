// O voto: nota de cada partido para a lei. Sem sorteio: a mesma conta serve
// ao placar previsto e à votação.
import { consultar, forcaDoFato, type Fato } from "../fatos";
import { pontosLei, type Grupo, type TipoGrupo } from "../grupos";
import type { ClasseLei, Lei, ValorLei } from "../leis";
import type { Casa, Congresso, Oferta, Partido, Votacao, Voto } from "./tipos";

/** Pontos de um grupo que contam como opinião cheia (+1). */
const PONTOS_CHEIOS = 3;
/** Nota menor que isto conta como indecisa. */
export const INDECISO = 0.12;
/** Folga do arredondamento. */
const FOLGA = 1e-9;

const PESO = {
  grupos: 0.5,
  povo: 0.2,
  base: 0.4,
  oposicao: -0.3,
  termometro: 0.4,
  aprovacao: 0.15,
  escandalo: -0.15,
  ministerio: 0.3,
};
/** Conta da lei: pontos do PIB × interesse do partido nas contas × isto. */
const PESO_DA_CONTA = 0.12;
/** Déficit (% do PIB) que dobra o peso da conta. */
const DEFICIT_QUE_DOBRA = 5;
/** Paciência abaixo da qual a casa pune a lei do governo. */
export const PACIENCIA_BAIXA = 30;
const PUNICAO_DA_PACIENCIA = -0.3;
/** Turnos para a eleição em que os livres passam a olhar o povo. */
const ANO_DE_ELEICAO = 3;
/** Força de cada moeda sobre a nota, antes do preço que sobe. */
const FORCA_DA_MOEDA: Record<string, number> = {
  cargos: 0.6,
  emenda: 0.6,
  promessa: 0.5,
  ministerio: 0.8,
};
const PARTE_DOS_LIVRES = 3;
/** Quanto do lado (base ou oposição) ainda pesa no voto dos livres. */
const LADO_DOS_LIVRES = 0.25;
/** Quórum de cada classe acima do da maioria. */
const ACIMA_DO_QUORUM: Record<ClasseLei, number> = {
  comum: 0,
  absoluta: 0,
  constitucional: 0.1,
  mandato: 0.15,
  // não chegam ao voto (motor/turno/etapas/congresso)
  decreto: 0,
  petrea: 0,
};
const COESAO_PADRAO = 0.7;
const CONTAS_PADRAS = 0.5;

/** Tudo o que o voto lê; montado no começo do turno. */
export interface Cenario {
  congresso: Congresso;
  tipos: TipoGrupo[];
  coligacao: string[];
  grupos: Record<string, Grupo>;
  leis: Record<string, ValorLei>;
  termometro: Record<string, number>;
  preco: Record<string, number>;
  /** Paciência de cada casa. */
  paciencia: Record<Casa, number>;
  /** Déficit em % do PIB (0 se não há). */
  deficit: number;
  fatos: readonly Fato[];
  turnosParaEleicao: number | null;
  /** Quórum das votações (lei do mundo); ausente = só a maioria do país. */
  quorumDaLei: number | null;
  /** Ministérios que cada partido tem: aliado fiel enquanto o ministro ficar. */
  ministros: Record<string, number>;
}

const limitar = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/** O quanto os grupos que o partido defende querem a mudança (+ a favor). */
export function opiniao(
  partido: Partido,
  tipos: TipoGrupo[],
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
): number {
  let soma = 0;
  for (const [grupo, peso] of Object.entries(partido.defende)) {
    const tipo = tipos.find((t) => t.id === grupo);
    if (tipo) soma += peso * pontosLei(tipo, lei, para, de);
  }
  return Math.abs(soma) < FOLGA ? 0 : soma;
}

/** Quórum de sim que a lei pede, como fração das cadeiras da casa. */
export function quorumDa(c: Cenario, classe: ClasseLei): number {
  if (classe === "comum") return c.congresso.maioria;
  const base = Math.max(c.congresso.maioria, c.quorumDaLei ?? 0);
  return base + ACIMA_DO_QUORUM[classe];
}

/** Gasto a mais que a lei traz, em pontos do PIB (0 se não é de gasto). */
export function contaDaLei(
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
): number {
  if (lei.forma !== "continua" || lei.conta !== "gasto") return 0;
  const antes = (de as number | undefined) ?? lei.faixa.min;
  return Math.max(0, ((para as number) - antes) * 100);
}

/** Aprovação do governo: satisfação média, pesada pelas pessoas (0–100). */
function aprovacao(grupos: Record<string, Grupo>): number {
  let soma = 0;
  let pessoas = 0;
  for (const g of Object.values(grupos)) {
    soma += g.pessoas * g.satisfacao;
    pessoas += g.pessoas;
  }
  return pessoas ? soma / pessoas : 50;
}

/** O quanto a população, no conjunto, quer a mudança (−1 a +1). */
function apoioDoPovo(
  c: Cenario,
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
): number {
  let soma = 0;
  let pessoas = 0;
  for (const tipo of c.tipos) {
    const g = c.grupos[tipo.id];
    if (!g) continue;
    soma += g.pessoas * pontosLei(tipo, lei, para, de);
    pessoas += g.pessoas;
  }
  return pessoas ? limitar(soma / pessoas / PONTOS_CHEIOS, -1, 1) : 0;
}

interface Partes {
  /** Só o partido: bússola, grupos, base ou oposição, termômetro. */
  fiel: number;
  /** O voto livre: grupos e povo, sem a linha do partido. */
  livre: number;
}

function notaDoPartido(
  c: Cenario,
  p: Partido,
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
  ofertas: Oferta[],
  casa: Casa,
  comConta: boolean,
): Partes {
  const pesos = Object.values(p.defende).reduce((s, x) => s + x, 0);
  const grupos = pesos
    ? limitar(opiniao(p, c.tipos, lei, de, para) / pesos / PONTOS_CHEIOS, -1, 1)
    : 0;
  const povo = apoioDoPovo(c, lei, de, para);
  const aprov = ((aprovacao(c.grupos) - 50) / 50) * PESO.aprovacao;
  const lado = c.coligacao.includes(p.id) ? PESO.base : PESO.oposicao;
  const termo = (((c.termometro[p.id] ?? 50) - 50) / 50) * PESO.termometro;
  const escandalos = consultar(c.fatos, {
    tipo: ["escandalo", "manchete-contra"],
  }).reduce((s, f) => s + forcaDoFato(f), 0);
  const contra = lado < 0 || termo < 0 ? 1 : 0.5;
  const manchetes = Math.min(1, escandalos) * PESO.escandalo * contra;
  const conta = comConta
    ? -(p.contas ?? CONTAS_PADRAS) *
      contaDaLei(lei, de, para) *
      PESO_DA_CONTA *
      (1 + c.deficit / DEFICIT_QUE_DOBRA)
    : 0;
  const punicao =
    c.paciencia[casa] < PACIENCIA_BAIXA ? PUNICAO_DA_PACIENCIA : 0;
  let moedas = 0;
  for (const o of ofertas)
    if (o.partido === p.id)
      moedas += Math.max(
        0,
        (FORCA_DA_MOEDA[o.moeda] ?? 0) - (c.preco[p.id] ?? 0),
      );
  const eleicao =
    c.turnosParaEleicao !== null && c.turnosParaEleicao <= ANO_DE_ELEICAO
      ? PARTE_DOS_LIVRES
      : 1;
  const ministerio = (c.ministros[p.id] ?? 0) > 0 ? PESO.ministerio : 0;
  const comum = aprov + manchetes + conta + punicao + moedas + ministerio;
  return {
    fiel: PESO.grupos * grupos + PESO.povo * povo + lado + termo + comum,
    livre:
      PESO.grupos * grupos * PARTE_DOS_LIVRES +
      PESO.povo * povo * eleicao +
      lado * LADO_DOS_LIVRES +
      comum,
  };
}

/** Contagem de uma casa para a lei; `comConta` falso mede sem o gasto. */
function contar(
  c: Cenario,
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
  casa: Casa,
  ofertas: Oferta[],
  comConta: boolean,
) {
  const cadeiras = (p: Partido) =>
    casa === "senado" ? (c.congresso.senado?.[p.id] ?? 0) : p.cadeiras;
  const votos: Record<string, Voto> = {};
  const livres: Record<string, Voto> = {};
  const notas: Record<string, number> = {};
  let sim = 0;
  let total = 0;
  let indecisos = 0;
  for (const p of c.congresso.partidos) {
    const n = cadeiras(p);
    if (!n) continue;
    total += n;
    const partes = notaDoPartido(c, p, lei, de, para, ofertas, casa, comConta);
    const coesao = p.coesao ?? COESAO_PADRAO;
    const fieis = Math.round(n * coesao);
    const soltos = n - fieis;
    const governo = p.id === c.congresso.governo;
    const fiel: Voto = governo || partes.fiel > 0 ? "sim" : "nao";
    const livre: Voto = governo || partes.livre > 0 ? "sim" : "nao";
    votos[p.id] = fiel;
    if (livre !== fiel) livres[p.id] = livre;
    notas[p.id] = limitar(partes.fiel, -1, 1);
    if (fiel === "sim") sim += fieis;
    if (livre === "sim") sim += soltos;
    if (!governo && Math.abs(partes.fiel) < INDECISO) indecisos += n;
  }
  return { votos, livres, notas, sim, total, indecisos };
}

/** Uma votação de uma casa, sem sorteio. */
export function votar(
  c: Cenario,
  lei: Lei,
  de: ValorLei | undefined,
  para: ValorLei,
  casa: Casa = "camara",
  ofertas: Oferta[] = [],
): Votacao {
  const real = contar(c, lei, de, para, casa, ofertas, true);
  const classe = lei.classe ?? "comum";
  const quorum = quorumDa(c, classe);
  const passa = (sim: number, total: number) => sim > quorum * total + FOLGA;
  const aprovada = passa(real.sim, real.total);
  const sem = contar(c, lei, de, para, casa, ofertas, false);
  const exorbitante = !aprovada && passa(sem.sim, sem.total);
  return {
    lei: lei.id,
    valor: para,
    exorbitante,
    votos: real.votos,
    ...(Object.keys(real.livres).length ? { livres: real.livres } : {}),
    sim: real.sim,
    nao: real.total - real.sim,
    indecisos: real.indecisos,
    total: real.total,
    quorum,
    classe,
    casa,
    notas: real.notas,
    aprovada,
    muda_lei: false,
  };
}
