// Produção do país e fornecedores do mundo (src/motor/mercado/mercado.md,
// fatia 2). O motor não conhece nomes de produto nem de potência.
import type { ErroMercado, Mercado } from "./index";

/** Para cada produto, a parte de cada potência no que o mundo fornece (soma 1). */
export type Produtores = Record<string, Record<string, number>>;

/** O que o país declara: de cada produto, quanto da demanda ele mesmo atende (%). */
export type Cobertura = Record<string, number>;

export interface MercadoDoPais {
  mercado: Mercado;
  produtores: Produtores;
  cobertura: Cobertura;
}

type Objeto = Record<string, unknown>;
const ehObjeto = (v: unknown): v is Objeto =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const ehNumero = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

/** Folga para somas de frações (0,35 + 0,25 + … não dá 1 exato). */
const FOLGA = 1e-9;
const COBERTURA_MAX = 200;

/** Valida os fornecedores do mundo: todo produto, potências que existem, soma 1. */
export function validarProdutores(
  dado: unknown,
  mercado: Mercado,
  potencias: readonly string[],
): ErroMercado[] {
  const erros: ErroMercado[] = [];
  const erro = (campo: string, motivo: string) => erros.push({ campo, motivo });
  if (!ehObjeto(dado))
    return [{ campo: "(raiz)", motivo: "precisa ser um objeto" }];
  if (dado.versao !== 1) erro("versao", "precisa ser 1");
  if (!ehObjeto(dado.produtores)) {
    erro("produtores", "precisa ser um objeto");
    return erros;
  }
  const lista = dado.produtores;
  const ids = new Set(mercado.produtos.map((p) => p.id));
  for (const id of Object.keys(lista))
    if (!ids.has(id)) erro(`produtores.${id}`, "produto não existe");
  for (const id of ids) {
    const partes = lista[id];
    if (!ehObjeto(partes)) {
      erro(`produtores.${id}`, "produto sem fornecedores");
      continue;
    }
    let soma = 0;
    for (const [potencia, parte] of Object.entries(partes)) {
      if (!potencias.includes(potencia))
        erro(`produtores.${id}.${potencia}`, "potência não existe");
      else if (!ehNumero(parte) || parte <= 0 || parte > 1)
        erro(`produtores.${id}.${potencia}`, "parte precisa estar entre 0 e 1");
      else soma += parte;
    }
    if (Math.abs(soma - 1) > FOLGA)
      erro(`produtores.${id}`, `as partes somam ${soma}, precisam somar 1`);
  }
  return erros;
}

export function lerProdutores(
  dado: unknown,
  mercado: Mercado,
  potencias: readonly string[],
): Produtores {
  const erros = validarProdutores(dado, mercado, potencias);
  if (erros.length)
    throw new Error(
      erros
        .map((e) => `mercado/produtores.json › ${e.campo}: ${e.motivo}`)
        .join("\n"),
    );
  return (dado as { produtores: Produtores }).produtores;
}

/** Valida a cobertura declarada pelo país: todo produto, de 0 a 200. */
export function validarCobertura(
  dado: unknown,
  mercado: Mercado,
): ErroMercado[] {
  const erros: ErroMercado[] = [];
  const erro = (campo: string, motivo: string) => erros.push({ campo, motivo });
  if (!ehObjeto(dado))
    return [{ campo: "(raiz)", motivo: "precisa ser um objeto" }];
  if (dado.versao !== 1) erro("versao", "precisa ser 1");
  if (!ehObjeto(dado.cobertura)) {
    erro("cobertura", "precisa ser um objeto");
    return erros;
  }
  const lista = dado.cobertura;
  const ids = new Set(mercado.produtos.map((p) => p.id));
  for (const id of Object.keys(lista))
    if (!ids.has(id)) erro(`cobertura.${id}`, "produto não existe");
  for (const id of ids) {
    const v = lista[id];
    if (!ehNumero(v)) erro(`cobertura.${id}`, "falta declarar (número)");
    else if (v < 0 || v > COBERTURA_MAX)
      erro(`cobertura.${id}`, `precisa estar entre 0 e ${COBERTURA_MAX}`);
  }
  return erros;
}

export function lerCobertura(dado: unknown, mercado: Mercado): Cobertura {
  const erros = validarCobertura(dado, mercado);
  if (erros.length)
    throw new Error(
      erros.map((e) => `producao.json › ${e.campo}: ${e.motivo}`).join("\n"),
    );
  return (dado as { cobertura: Cobertura }).cobertura;
}

export interface LinhaDoProduto {
  id: string;
  nome: string;
  /** Quanto da demanda a produção do país atende, em %. */
  cobertura: number;
  /** O que falta para 100, comprado de fora (% da demanda). */
  importa: number;
  /** O que passa de 100, vendido para fora (% da demanda). */
  exporta: number;
  /** De quem vem o que se importa, em % da demanda; maior primeiro. */
  fornecedores: { potencia: string; parte: number }[];
}

export interface BalancoDoSetor {
  id: string;
  nome: string;
  descricao: string;
  produtos: LinhaDoProduto[];
}

export interface Balanco {
  setores: BalancoDoSetor[];
  /** Por potência: média, nos produtos, do que o país compra dela (% da demanda). */
  dependencia: Record<string, number>;
}

/** Conta de cada produto e a dependência de cada potência. */
export function balancoDoPais({
  mercado,
  produtores,
  cobertura,
}: MercadoDoPais): Balanco {
  const dependencia: Record<string, number> = {};
  const setores = mercado.setores.map((s) => ({
    id: s.id,
    nome: s.nome,
    descricao: s.descricao,
    produtos: mercado.produtos
      .filter((p) => p.setor === s.id)
      .map((p) => {
        const c = cobertura[p.id] ?? 0;
        const importa = Math.max(0, 100 - c);
        const fornecedores = Object.entries(produtores[p.id] ?? {})
          .map(([potencia, parte]) => ({ potencia, parte: importa * parte }))
          .filter((f) => f.parte > 0)
          .sort((a, b) => b.parte - a.parte);
        for (const f of fornecedores)
          dependencia[f.potencia] =
            (dependencia[f.potencia] ?? 0) + f.parte / mercado.produtos.length;
        return {
          id: p.id,
          nome: p.nome,
          cobertura: c,
          importa,
          exporta: Math.max(0, c - 100),
          fornecedores,
        };
      }),
  }));
  return { setores, dependencia };
}
