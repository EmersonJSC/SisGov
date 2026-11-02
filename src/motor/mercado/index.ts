// Mercado: setores e produtos do mundo (src/motor/mercado/mercado.md). O motor
// não conhece os nomes; eles vêm do conteúdo.
import { validarCapacidades, type Capacidade } from "./capacidade";

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

/** Valida o JSON dos setores e produtos do mundo. */
export function validarMercado(dado: unknown): ErroMercado[] {
  const erros: ErroMercado[] = [];
  const erro = (campo: string, motivo: string) => erros.push({ campo, motivo });

  if (!ehObjeto(dado)) {
    erro("(raiz)", "precisa ser um objeto");
    return erros;
  }
  if (dado.versao !== 1) erro("versao", "precisa ser 1");

  const setores = dado.setores;
  const produtos = dado.produtos;
  if (!Array.isArray(setores) || setores.length === 0)
    erro("setores", "precisa ter ao menos um setor");
  if (!Array.isArray(produtos) || produtos.length === 0)
    erro("produtos", "precisa ter ao menos um produto");
  if (!Array.isArray(setores) || !Array.isArray(produtos)) return erros;

  const idsDeSetor = new Set<string>();
  setores.forEach((s, i) => {
    const c = `setores[${i}]`;
    if (!ehObjeto(s)) return erro(c, "precisa ser um objeto");
    if (!ehKebab(s.id)) erro(`${c}.id`, "precisa ser kebab-case");
    else if (idsDeSetor.has(s.id)) erro(`${c}.id`, `"${s.id}" repetido`);
    else idsDeSetor.add(s.id);
    if (!ehTexto(s.nome)) erro(`${c}.nome`, "precisa ter nome");
    if (typeof s.descricao !== "string")
      erro(`${c}.descricao`, "precisa ser texto");
  });

  const cestas = Array.isArray(dado.cestas) ? dado.cestas : [];
  const idsDeCesta = new Set<string>();
  cestas.forEach((x, i) => {
    const c = `cestas[${i}]`;
    if (!ehObjeto(x)) return erro(c, "precisa ser um objeto");
    if (!ehKebab(x.id)) erro(`${c}.id`, "precisa ser kebab-case");
    else if (idsDeCesta.has(x.id)) erro(`${c}.id`, `"${x.id}" repetido`);
    else idsDeCesta.add(x.id);
    if (!ehTexto(x.nome)) erro(`${c}.nome`, "precisa ter nome");
    if (typeof x.tamanho !== "number" || !(x.tamanho > 0))
      erro(`${c}.tamanho`, "precisa ser um número maior que 0");
    if (x.termo !== undefined && !ehTexto(x.termo))
      erro(`${c}.termo`, "precisa ser texto");
    if (x.indice !== undefined && !ehTexto(x.indice))
      erro(`${c}.indice`, "precisa ser texto");
    if (x.reacao === undefined) return;
    const r = x.reacao;
    if (!ehObjeto(r)) return erro(`${c}.reacao`, "precisa ser um objeto");
    if (!ehTexto(x.indice)) erro(`${c}.indice`, "reação precisa de índice");
    if (typeof r.escala !== "number" || !(r.escala > 0))
      erro(`${c}.reacao.escala`, "precisa ser um número maior que 0");
    if (typeof r.ganho !== "number" || !(r.ganho >= 0))
      erro(`${c}.reacao.ganho`, "precisa ser um número maior ou igual a 0");
    if (!Array.isArray(r.efeitos))
      return erro(`${c}.reacao.efeitos`, "precisa ser uma lista");
    r.efeitos.forEach((e, j) => {
      const k = `${c}.reacao.efeitos[${j}]`;
      if (!ehObjeto(e)) return erro(k, "precisa ser um objeto");
      if (!ehTexto(e.indice)) erro(`${k}.indice`, "precisa ter índice");
      if (e.sentido !== 1 && e.sentido !== -1)
        erro(`${k}.sentido`, "precisa ser 1 ou -1");
      if (!["fraca", "media", "forte"].includes(String(e.forca)))
        erro(`${k}.forca`, "precisa ser fraca, media ou forte");
    });
  });

  const idsDeProduto = new Set<string>();
  const comProduto = new Set<string>();
  produtos.forEach((p, i) => {
    const c = `produtos[${i}]`;
    if (!ehObjeto(p)) return erro(c, "precisa ser um objeto");
    if (!ehKebab(p.id)) erro(`${c}.id`, "precisa ser kebab-case");
    else if (idsDeProduto.has(p.id)) erro(`${c}.id`, `"${p.id}" repetido`);
    else idsDeProduto.add(p.id);
    if (!ehTexto(p.nome)) erro(`${c}.nome`, "precisa ter nome");
    if (!ehTexto(p.setor)) erro(`${c}.setor`, "precisa ter setor");
    else if (!idsDeSetor.has(p.setor))
      erro(`${c}.setor`, `setor "${p.setor}" não existe`);
    else comProduto.add(p.setor);
    if (p.cesta !== undefined) {
      const k = p.cesta;
      if (!ehObjeto(k)) erro(`${c}.cesta`, "precisa ser um objeto");
      else {
        if (typeof k.id !== "string" || !idsDeCesta.has(k.id))
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
  });

  for (const id of idsDeSetor)
    if (!comProduto.has(id))
      erro("setores", `o setor "${id}" não tem nenhum produto`);

  erros.push(...validarCapacidades(dado.capacidades));

  return erros;
}

/** Valida e devolve o mercado tipado; lança com todos os erros juntos. */
export function lerMercado(dado: unknown): Mercado {
  const erros = validarMercado(dado);
  if (erros.length > 0)
    throw new Error(erros.map((e) => `${e.campo}: ${e.motivo}`).join("\n"));
  const { setores, produtos, cestas, capacidades } = dado as Mercado;
  return {
    setores,
    produtos,
    cestas: cestas ?? [],
    capacidades: capacidades ?? [],
  };
}

export * from "./producao";
export * from "./preco";
export * from "./emprego";
export * from "./demanda";
export * from "./capacidade";
export * from "./ficha";
export * from "./propriedade";
