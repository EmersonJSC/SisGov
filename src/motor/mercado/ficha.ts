// Ficha do setor (src/motor/mercado/mercado.md, fatia 8). Cada ficha tem
// quatro leis de opções (dono, importação, capital estrangeiro, preço) e o
// mundo tem leis gerais de propriedade. O motor lê números nas opções
// (`valores`) pelo papel da lei; não conhece os nomes. Mudar a ficha é mudar
// uma lei, então o Congresso, o atraso e a prévia já são os das leis.
import type { Lei, ValorLei } from "../leis";
import type { Ajuste, Ajustes } from "./demanda";
import type { ErroMercado, Mercado } from "./index";

export const PAPEIS = ["dono", "importacao", "estrangeiro", "preco"] as const;
export type Papel = (typeof PAPEIS)[number];

/** Leis gerais de propriedade, por papel; cada uma é uma lei de opções do mundo. */
export const PAPEIS_GERAIS = [
  "indenizacao",
  "prazo",
  "metodo",
  "minimo",
  "posvenda",
  "politica",
  "estado_pode",
  "triagem",
  "remessa",
  "fabrica_de_fora",
  "fabrica_no_exterior",
  "antitruste",
  "acordo",
] as const;
export type PapelGeral = (typeof PAPEIS_GERAIS)[number];

export interface Ficha {
  id: string;
  nome: string;
  descricao: string;
  /** Produtos do mercado que a ficha governa. */
  produtos: string[];
  /** Redes de capacidade (ex.: energia) que a ficha governa. */
  capacidades: string[];
  /** Valor do setor, em % do PIB (base de indenização e de venda). */
  valor: number;
  /** Quanto o setor pesa no crescimento: falta de oferta o freia (pontos ao ano). */
  freio: number;
  /** Setor estratégico: o Estado só tem empresa se a lei geral deixar. */
  estrategico: boolean;
  leis: Record<Papel, string>;
}

export interface Fichas {
  fichas: Ficha[];
  gerais: Record<PapelGeral, string>;
}

/** Onde a ficha está hoje; `0` é o valor do turno 0 (referência dos ganhos). */
export interface FichaNoEstado {
  /** Fatia do Estado no setor, 0 a 1. */
  fatia: number;
  /** Fatia de capital estrangeiro, 0 a 1. */
  estrangeiro: number;
  fatia0: number;
  estrangeiro0: number;
}

export type FichasNoEstado = Record<string, FichaNoEstado>;

type Objeto = Record<string, unknown>;
const ehObjeto = (v: unknown): v is Objeto =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const ehKebab = (v: unknown): v is string =>
  typeof v === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v);

/** Chave de `valores` que cada papel precisa ter em todas as opções. */
const CHAVES: Record<Papel, string> = {
  dono: "fatia_estado",
  importacao: "permitida",
  estrangeiro: "teto",
  preco: "preco",
};

/** Valida o JSON das fichas contra o mercado e as leis do mundo. */
export function validarFichas(
  dado: unknown,
  mercado: Mercado,
  leis: Record<string, Lei>,
): ErroMercado[] {
  const erros: ErroMercado[] = [];
  const erro = (campo: string, motivo: string) => erros.push({ campo, motivo });
  if (!ehObjeto(dado))
    return [{ campo: "(raiz)", motivo: "precisa ser um objeto" }];
  if (dado.versao !== 1) erro("versao", "precisa ser 1");
  const produtos = new Set(mercado.produtos.map((p) => p.id));
  const redes = new Set((mercado.capacidades ?? []).map((c) => c.id));
  const temOpcoes = (id: unknown, onde: string, chave?: string) => {
    const lei = typeof id === "string" ? leis[id] : undefined;
    if (!lei || lei.forma !== "opcoes")
      return erro(onde, `"${String(id)}" não é uma lei de opções do mundo`);
    for (const o of lei.opcoes)
      if (chave && typeof o.valores?.[chave] !== "number")
        erro(onde, `a opção "${o.id}" precisa de valores.${chave}`);
  };
  const gerais = dado.gerais;
  if (!ehObjeto(gerais)) erro("gerais", "precisa ser um objeto");
  else
    for (const papel of PAPEIS_GERAIS)
      temOpcoes(gerais[papel], `gerais.${papel}`);
  if (!Array.isArray(dado.fichas) || dado.fichas.length === 0)
    erro("fichas", "precisa ter ao menos uma ficha");
  else {
    const vistos = new Set<unknown>();
    const usados = new Set<string>();
    dado.fichas.forEach((f, i) => {
      const c = `fichas[${i}]`;
      if (!ehObjeto(f)) return erro(c, "precisa ser um objeto");
      if (!ehKebab(f.id)) erro(`${c}.id`, "precisa ser kebab-case");
      else if (vistos.has(f.id)) erro(`${c}.id`, `"${f.id}" repetido`);
      vistos.add(f.id);
      for (const campo of ["valor", "freio"])
        if (typeof f[campo] !== "number" || !((f[campo] as number) >= 0))
          erro(`${c}.${campo}`, "precisa ser um número ≥ 0");
      if (typeof f.estrategico !== "boolean")
        erro(`${c}.estrategico`, "precisa ser verdadeiro ou falso");
      for (const [campo, lista, existe] of [
        ["produtos", f.produtos, produtos],
        ["capacidades", f.capacidades, redes],
      ] as const) {
        if (!Array.isArray(lista)) {
          erro(`${c}.${campo}`, "precisa ser uma lista");
          continue;
        }
        for (const id of lista) {
          if (!existe.has(id as string))
            erro(`${c}.${campo}`, `"${String(id)}" não existe no mercado`);
          else if (usados.has(`${campo}:${String(id)}`))
            erro(`${c}.${campo}`, `"${String(id)}" já está em outra ficha`);
          usados.add(`${campo}:${String(id)}`);
        }
      }
      const doSetor = f.leis;
      if (!ehObjeto(doSetor)) return erro(`${c}.leis`, "precisa ser um objeto");
      for (const papel of PAPEIS)
        temOpcoes(doSetor[papel], `${c}.leis.${papel}`, CHAVES[papel]);
    });
  }
  return erros;
}

/** Valida e devolve as fichas; lança com todos os erros juntos. */
export function lerFichas(
  dado: unknown,
  mercado: Mercado,
  leis: Record<string, Lei>,
): Fichas {
  const erros = validarFichas(dado, mercado, leis);
  if (erros.length > 0)
    throw new Error(erros.map((e) => `${e.campo}: ${e.motivo}`).join("\n"));
  const { fichas, gerais } = dado as Fichas;
  return { fichas, gerais };
}

/** Leis de cada setor (dono, importação, capital de fora, preço): ficam fora do mapa. */
export function leisDasFichas(f: Fichas): Set<string> {
  return new Set(f.fichas.flatMap((x) => Object.values(x.leis)));
}

type Leis = Record<string, Lei>;
type Vigentes = Record<string, ValorLei>;

/** Número da opção em vigor de uma lei; `padrao` se a lei não está legislada. */
export function valorDaOpcao(
  leis: Leis,
  vigentes: Vigentes,
  lei: string,
  chave: string,
  padrao: number,
): number {
  const l = leis[lei];
  if (!l || l.forma !== "opcoes") return padrao;
  const op = l.opcoes.find((o) => o.id === vigentes[lei]);
  return op?.valores?.[chave] ?? padrao;
}

/** O que as leis dizem para a ficha hoje (o alvo; a fatia anda até ele). */
export interface Situacao {
  fatiaAlvo: number;
  importacao: number;
  tetoEstrangeiro: number;
  precoMax?: number;
  precoMin?: number;
}

export function situacaoDaFicha(
  f: Ficha,
  leis: Leis,
  vigentes: Vigentes,
): Situacao {
  const v = (papel: Papel, chave: string, padrao: number) =>
    valorDaOpcao(leis, vigentes, f.leis[papel], chave, padrao);
  const max = v("preco", "max", NaN);
  const min = v("preco", "min", NaN);
  return {
    fatiaAlvo: v("dono", "fatia_estado", 0),
    importacao: v("importacao", "permitida", 1),
    tetoEstrangeiro: v("estrangeiro", "teto", 1),
    precoMax: Number.isNaN(max) ? undefined : max,
    precoMin: Number.isNaN(min) ? undefined : min,
  };
}

/** Número de uma lei geral em vigor. */
export function geral(
  fichas: Fichas,
  leis: Leis,
  vigentes: Vigentes,
  papel: PapelGeral,
  chave: string,
  padrao: number,
): number {
  return valorDaOpcao(leis, vigentes, fichas.gerais[papel], chave, padrao);
}

const PASSO_FATIA = 0.1;
const PASSO_ESTRANGEIRO = 0.05;
/** Fatia de capital de fora que cada ficha tem no começo, até o teto. */
const ESTRANGEIRO_INICIAL = 0.2;

const limitar = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const rumo = (de: number, para: number, passo: number) =>
  de < para ? Math.min(para, de + passo) : Math.max(para, de - passo);

/** Turno 0: a fatia é a que a lei diz; o capital de fora, até 20% ou o teto. */
export function fichasIniciais(
  fichas: Fichas,
  leis: Leis,
  vigentes: Vigentes,
): FichasNoEstado {
  return Object.fromEntries(
    fichas.fichas.map((f) => {
      const s = situacaoDaFicha(f, leis, vigentes);
      const estrangeiro = Math.min(
        ESTRANGEIRO_INICIAL,
        s.tetoEstrangeiro,
        1 - s.fatiaAlvo,
      );
      return [
        f.id,
        {
          fatia: s.fatiaAlvo,
          estrangeiro,
          fatia0: s.fatiaAlvo,
          estrangeiro0: estrangeiro,
        },
      ];
    }),
  );
}

/** O Estado pode ter empresa neste setor? (lei geral "onde o Estado pode"). */
export function estadoPodeTer(
  fichas: Fichas,
  f: Ficha,
  leis: Leis,
  vigentes: Vigentes,
): boolean {
  const chave = f.estrategico ? "estrategicos" : "outros";
  return geral(fichas, leis, vigentes, "estado_pode", chave, 1) > 0;
}

/** Quanto a fatia e o capital de fora andam neste turno, com as leis de hoje. */
export interface Movimento {
  fatia: number;
  estrangeiro: number;
  /** Mudança da fatia do Estado neste turno (+ estatiza, − vende). */
  delta: number;
  /** A venda não saiu: o interesse dos compradores ficou abaixo do mínimo. */
  semComprador: boolean;
}

/** Interesse dos compradores: confiança média das potências, de 0 a 1. */
export const interesseDosCompradores = (opinioes: Record<string, number>) => {
  const v = Object.values(opinioes);
  return v.length === 0 ? 0.5 : v.reduce((s, x) => s + x, 0) / v.length / 100;
};

export function moverFicha(
  fichas: Fichas,
  f: Ficha,
  atual: FichaNoEstado,
  leis: Leis,
  vigentes: Vigentes,
  interesse: number,
): Movimento {
  const s = situacaoDaFicha(f, leis, vigentes);
  const g = (papel: PapelGeral, chave: string, padrao: number) =>
    geral(fichas, leis, vigentes, papel, chave, padrao);
  let alvo = s.fatiaAlvo;
  // A lei geral pode proibir empresa do Estado neste tipo de setor.
  if (!estadoPodeTer(fichas, f, leis, vigentes))
    alvo = Math.min(alvo, atual.fatia);
  let fatia = rumo(atual.fatia, alvo, PASSO_FATIA);
  let semComprador = false;
  if (fatia < atual.fatia && 0.5 + 0.6 * interesse < g("minimo", "minimo", 0)) {
    fatia = atual.fatia;
    semComprador = true;
  }
  // Capital de fora: entra devagar até o teto (leis de entrada); sai rápido.
  const velocidade =
    g("triagem", "velocidade", 1) *
    g("remessa", "atrai", 1) *
    g("fabrica_de_fora", "velocidade", 1);
  const folga = 1 - fatia;
  const teto = Math.min(s.tetoEstrangeiro, folga);
  const estrangeiro =
    atual.estrangeiro < teto
      ? Math.min(teto, atual.estrangeiro + PASSO_ESTRANGEIRO * velocidade)
      : rumo(atual.estrangeiro, teto, 2 * PASSO_ESTRANGEIRO);
  return { fatia, estrangeiro, delta: fatia - atual.fatia, semComprador };
}

/** Fator da produção do setor: dono, capital de fora e regras de venda. */
export function fatorDeProducao(
  fichas: Fichas,
  f: Ficha,
  atual: FichaNoEstado,
  leis: Leis,
  vigentes: Vigentes,
): number {
  const g = (papel: PapelGeral, chave: string, padrao: number) =>
    geral(fichas, leis, vigentes, papel, chave, padrao);
  const vendido = Math.max(0, atual.fatia0 - atual.fatia);
  const ganhoVenda =
    g("metodo", "eficiencia", 0) * g("posvenda", "eficiencia", 1) * vendido;
  const fator =
    1 -
    0.15 * (atual.fatia - atual.fatia0) +
    0.2 * (atual.estrangeiro - atual.estrangeiro0) +
    ganhoVenda +
    g("fabrica_de_fora", "producao", 0) * atual.estrangeiro -
    g("fabrica_no_exterior", "perda", 0);
  return limitar(fator, 0.5, 1.5);
}

/** Fator do preço: política da estatal, concentração do mercado privado. */
export function fatorDePreco(
  fichas: Fichas,
  f: Ficha,
  atual: FichaNoEstado,
  leis: Leis,
  vigentes: Vigentes,
): number {
  const g = (papel: PapelGeral, chave: string, padrao: number) =>
    geral(fichas, leis, vigentes, papel, chave, padrao);
  const doEstado =
    (g("politica", "preco", 1) - 1) * (atual.fatia - atual.fatia0);
  const privado = 1 - atual.fatia - (1 - atual.fatia0);
  const concentracao =
    0.08 *
    g("antitruste", "concentracao", 1) *
    g("posvenda", "tarifa", 1) *
    privado;
  return limitar(1 + doEstado + concentracao, 0.6, 1.6);
}

/** Ajuste de cada produto das fichas, com as leis e a posição de hoje. */
export function ajustesDasFichas(
  fichas: Fichas | undefined,
  leis: Leis,
  vigentes: Vigentes,
  noEstado: FichasNoEstado,
): Ajustes {
  if (!fichas) return {};
  const saida: Ajustes = {};
  for (const f of fichas.fichas) {
    const atual = noEstado[f.id];
    if (!atual) continue;
    const s = situacaoDaFicha(f, leis, vigentes);
    const ajuste: Ajuste = {
      importacao:
        s.importacao * geral(fichas, leis, vigentes, "acordo", "abertura", 1),
      producao: fatorDeProducao(fichas, f, atual, leis, vigentes),
      preco: fatorDePreco(fichas, f, atual, leis, vigentes),
      precoMax: s.precoMax,
      precoMin: s.precoMin,
    };
    for (const p of f.produtos) saida[p] = ajuste;
  }
  return saida;
}

/**
 * Freio no crescimento (pontos ao ano): cada ficha pesa `freio` vezes a falta
 * que as regras criaram, isto é, a falta de hoje menos a que haveria sem
 * ficha. O país que já começa com falta não paga duas vezes.
 */
export function freioDasFichas(
  fichas: Fichas | undefined,
  hoje: (produto: string) => LinhaFalta | undefined,
  semFicha: (produto: string) => LinhaFalta | undefined,
): number {
  if (!fichas) return 0;
  const falta = (ls: (LinhaFalta | undefined)[]) =>
    ls.reduce((s, l) => s + (l ? Math.max(0, l.demanda - l.oferta) : 0), 0);
  return fichas.fichas.reduce((freio, f) => {
    const demanda = f.produtos.reduce((s, p) => s + (hoje(p)?.demanda ?? 0), 0);
    if (demanda <= 0) return freio;
    const nova = falta(f.produtos.map(hoje)) - falta(f.produtos.map(semFicha));
    return freio + f.freio * (Math.max(0, nova) / demanda);
  }, 0);
}

interface LinhaFalta {
  demanda: number;
  oferta: number;
}
