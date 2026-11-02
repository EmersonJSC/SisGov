// Mercado: setores e produtos do mundo (src/motor/mercado/mercado.md). O motor
// não conhece os nomes; eles vêm do conteúdo.

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
}

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

  return erros;
}

/** Valida e devolve o mercado tipado; lança com todos os erros juntos. */
export function lerMercado(dado: unknown): Mercado {
  const erros = validarMercado(dado);
  if (erros.length > 0)
    throw new Error(erros.map((e) => `${e.campo}: ${e.motivo}`).join("\n"));
  const { setores, produtos, cestas } = dado as Mercado;
  return { setores, produtos, cestas: cestas ?? [] };
}

export * from "./producao";
export * from "./preco";
export * from "./emprego";
export * from "./demanda";
