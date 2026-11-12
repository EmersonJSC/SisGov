// Mercado: setores e produtos do mundo (src/motor/mercado/mercado.md). O motor
// não conhece os nomes; eles vêm do conteúdo.
import {
  conferirEfeitosDeReacao,
  validarCapacidades,
  type Capacidade,
} from "./capacidade";
import { validarRegraDasObras, type RegraDasObras } from "./construcoes";

export interface Setor {
  id: string;
  nome: string;
  descricao: string;
}

/** Uma necessidade que vários produtos atendem (ex.: comida). */
export interface Cesta {
  id: string;
  nome: string;
  /** Quanto cada pessoa gasta, em fração da renda média inicial, a preço base. */
  tamanho: number;
  /** Como a tela chama a falta ("fome", "carência"); sem ele, "carência". */
  termo?: string;
  /** Índice do mundo que recebe a segurança alimentar média (0 a 100). */
  indice?: string;
  reacao?: ReacaoDaCesta;
}

/**
 * Como o índice da cesta mexe em outros índices (fatia 6c). Desvio é o índice
 * de hoje menos o do turno 0; `escala` pontos de desvio dão o efeito inteiro;
 * quando melhora, o efeito vale `ganho` vezes (mais fraco que a piora).
 */
export interface ReacaoDaCesta {
  escala: number;
  ganho: number;
  efeitos: { indice: string; sentido: 1 | -1; forca: ForcaDaReacao }[];
}

export type ForcaDaReacao = "fraca" | "media" | "forte";

export interface Produto {
  id: string;
  nome: string;
  setor: string;
  /** Necessidade que o produto atende e o peso dele na cesta. */
  cesta?: { id: string; peso: number };
  /** Prédio típico: nome e tamanho (% do PIB); a tela mostra "≈ N". */
  unidade?: { nome: string; tamanho: number };
}

export interface Mercado {
  setores: Setor[];
  produtos: Produto[];
  cestas: Cesta[];
  /** Redes de capacidade (ex.: energia), sem cesta (fatia 7). */
  capacidades?: Capacidade[];
  /** Quem constrói e o que atrasa as obras (12b pilar 1); sem ela, PIB por tendência. */
  obras?: RegraDasObras;
}

export interface ErroMercado {
  campo: string;
  motivo: string;
}

type Objeto = Record<string, unknown>;
const ehObjeto = (v: unknown): v is Objeto =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const ehKebab = (v: unknown): v is string =>
  typeof v === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v);
const ehTexto = (v: unknown): v is string => typeof v === "string" && v !== "";

type Erro = (campo: string, motivo: string) => void;

/** Id kebab-case que ainda não apareceu; guarda o visto. */
function conferirId(
  erro: Erro,
  campo: string,
  id: unknown,
  vistos: Set<string>,
) {
  if (!ehKebab(id)) erro(`${campo}.id`, "precisa ser kebab-case");
  else if (vistos.has(id)) erro(`${campo}.id`, `"${id}" repetido`);
  else vistos.add(id);
}

/** Setores do mundo; devolve os ids. */
function conferirSetores(erro: Erro, setores: unknown[]): Set<string> {
  const ids = new Set<string>();
  setores.forEach((s, i) => {
    const c = `setores[${i}]`;
    if (!ehObjeto(s)) return erro(c, "precisa ser um objeto");
    conferirId(erro, c, s.id, ids);
    if (!ehTexto(s.nome)) erro(`${c}.nome`, "precisa ter nome");
    if (typeof s.descricao !== "string")
      erro(`${c}.descricao`, "precisa ser texto");
  });
  return ids;
}

/** Como a cesta reage ao preço: escala, ganho e os efeitos nos índices. */
function conferirReacao(erro: Erro, c: string, x: Objeto) {
  const r = x.reacao;
  if (!ehObjeto(r)) return erro(`${c}.reacao`, "precisa ser um objeto");
  if (!ehTexto(x.indice)) erro(`${c}.indice`, "reação precisa de índice");
  if (typeof r.escala !== "number" || !(r.escala > 0))
    erro(`${c}.reacao.escala`, "precisa ser um número maior que 0");
  if (typeof r.ganho !== "number" || !(r.ganho >= 0))
    erro(`${c}.reacao.ganho`, "precisa ser um número maior ou igual a 0");
  conferirEfeitosDeReacao(erro, `${c}.reacao.efeitos`, r.efeitos);
}

/** Cestas de consumo; devolve os ids. */
function conferirCestas(erro: Erro, cestas: unknown[]): Set<string> {
  const ids = new Set<string>();
  cestas.forEach((x, i) => {
    const c = `cestas[${i}]`;
    if (!ehObjeto(x)) return erro(c, "precisa ser um objeto");
    conferirId(erro, c, x.id, ids);
    if (!ehTexto(x.nome)) erro(`${c}.nome`, "precisa ter nome");
    if (typeof x.tamanho !== "number" || !(x.tamanho > 0))
      erro(`${c}.tamanho`, "precisa ser um número maior que 0");
    if (x.termo !== undefined && !ehTexto(x.termo))
      erro(`${c}.termo`, "precisa ser texto");
    if (x.indice !== undefined && !ehTexto(x.indice))
      erro(`${c}.indice`, "precisa ser texto");
    if (x.reacao !== undefined) conferirReacao(erro, c, x);
  });
  return ids;
}

/** Cada produto cita um setor e, se tiver, uma cesta e uma unidade válidas. */
function conferirProduto(
  erro: Erro,
  p: Objeto,
  c: string,
  setores: Set<string>,
  cestas: Set<string>,
) {
  if (!ehTexto(p.nome)) erro(`${c}.nome`, "precisa ter nome");
  if (!ehTexto(p.setor)) erro(`${c}.setor`, "precisa ter setor");
  else if (!setores.has(p.setor))
    erro(`${c}.setor`, `setor "${p.setor}" não existe`);
  if (p.cesta !== undefined) {
    const k = p.cesta;
    if (!ehObjeto(k)) erro(`${c}.cesta`, "precisa ser um objeto");
    else {
      if (typeof k.id !== "string" || !cestas.has(k.id))
        erro(`${c}.cesta.id`, "cesta não existe");
      if (typeof k.peso !== "number" || !(k.peso > 0))
        erro(`${c}.cesta.peso`, "precisa ser um número maior que 0");
    }
  }
  if (p.unidade !== undefined) {
    const u = p.unidade;
    if (!ehObjeto(u)) erro(`${c}.unidade`, "precisa ser um objeto");
    else {
      if (!ehTexto(u.nome)) erro(`${c}.unidade.nome`, "precisa ter nome");
      if (typeof u.tamanho !== "number" || !(u.tamanho > 0))
        erro(`${c}.unidade.tamanho`, "precisa ser um número maior que 0");
    }
  }
}

/** Produtos do mundo; devolve os setores que têm algum produto. */
function conferirProdutos(
  erro: Erro,
  produtos: unknown[],
  setores: Set<string>,
  cestas: Set<string>,
): Set<string> {
  const ids = new Set<string>();
  const comProduto = new Set<string>();
  produtos.forEach((p, i) => {
    const c = `produtos[${i}]`;
    if (!ehObjeto(p)) return erro(c, "precisa ser um objeto");
    conferirId(erro, c, p.id, ids);
    conferirProduto(erro, p, c, setores, cestas);
    if (ehTexto(p.setor) && setores.has(p.setor)) comProduto.add(p.setor);
  });
  return comProduto;
}

/** Valida o JSON dos setores e produtos do mundo. */
export function validarMercado(dado: unknown): ErroMercado[] {
  const erros: ErroMercado[] = [];
  const erro: Erro = (campo, motivo) => erros.push({ campo, motivo });

  if (!ehObjeto(dado)) {
    erro("(raiz)", "precisa ser um objeto");
    return erros;
  }
  if (dado.versao !== 1) erro("versao", "precisa ser 1");

  const { setores, produtos } = dado;
  if (!Array.isArray(setores) || setores.length === 0)
    erro("setores", "precisa ter ao menos um setor");
  if (!Array.isArray(produtos) || produtos.length === 0)
    erro("produtos", "precisa ter ao menos um produto");
  if (!Array.isArray(setores) || !Array.isArray(produtos)) return erros;

  const idsDeSetor = conferirSetores(erro, setores);
  const idsDeCesta = conferirCestas(
    erro,
    Array.isArray(dado.cestas) ? dado.cestas : [],
  );
  const comProduto = conferirProdutos(erro, produtos, idsDeSetor, idsDeCesta);
  for (const id of idsDeSetor)
    if (!comProduto.has(id))
      erro("setores", `o setor "${id}" não tem nenhum produto`);

  erros.push(...validarCapacidades(dado.capacidades));
  erros.push(
    ...validarRegraDasObras(dado.obras, {
      setores: setores.filter(ehObjeto) as unknown as Setor[],
    }),
  );
  return erros;
}

/** Valida e devolve o mercado tipado; lança com todos os erros juntos. */
export function lerMercado(dado: unknown): Mercado {
  const erros = validarMercado(dado);
  if (erros.length > 0)
    throw new Error(erros.map((e) => `${e.campo}: ${e.motivo}`).join("\n"));
  const { setores, produtos, cestas, capacidades, obras } = dado as Mercado;
  return {
    setores,
    produtos,
    cestas: cestas ?? [],
    capacidades: capacidades ?? [],
    ...(obras ? { obras } : {}),
  };
}

export * from "./producao";
export * from "./preco";
export * from "./emprego";
export * from "./demanda";
export * from "./capacidade";
export * from "./construcoes";
