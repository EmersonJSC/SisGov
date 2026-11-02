// Produção do país e fornecedores do mundo (src/motor/mercado/mercado.md,
// fatia 2). O motor não conhece nomes de produto nem de potência.
import type { ErroMercado, Mercado } from "./index";
import type { Ocupacao } from "./emprego";
import type { Fichas } from "./ficha";

/** Para cada potência, a cobertura de cada produto (0 a 200). */
export type ProducaoDoMundo = Record<string, Cobertura>;

/** O que o país declara: de cada produto, quanto da demanda ele mesmo atende (%). */
export type Cobertura = Record<string, number>;

export interface MercadoDoPais {
  mercado: Mercado;
  producao: ProducaoDoMundo;
  cobertura: Cobertura;
  /** Capacidade pronta de cada fonte no turno 0, em pontos (fatia 7). */
  capacidade: Record<string, number>;
  /** Onde cada tipo de pop trabalha (do mundo). */
  ocupacao: Record<string, Ocupacao>;
  /** Fichas de setor e leis gerais de propriedade (fatia 8); ausente = sem. */
  fichas?: Fichas;
  /** População do turno 0: a produção declarada é cobertura × demanda daquele dia. */
  populacaoBase: number;
}

type Objeto = Record<string, unknown>;
const ehObjeto = (v: unknown): v is Objeto =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const ehNumero = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

const COBERTURA_MAX = 200;

/** Valida a produção das potências: cada uma declara todo produto, de 0 a 200. */
export function validarProducaoDoMundo(
  dado: unknown,
  mercado: Mercado,
  potencias: readonly string[],
): ErroMercado[] {
  const erros: ErroMercado[] = [];
  if (!ehObjeto(dado))
    return [{ campo: "(raiz)", motivo: "precisa ser um objeto" }];
  if (dado.versao !== 1)
    erros.push({ campo: "versao", motivo: "precisa ser 1" });
  if (!ehObjeto(dado.producao)) {
    erros.push({ campo: "producao", motivo: "precisa ser um objeto" });
    return erros;
  }
  const lista = dado.producao;
  for (const id of Object.keys(lista))
    if (!potencias.includes(id))
      erros.push({ campo: `producao.${id}`, motivo: "potência não existe" });
  for (const id of potencias) {
    const cobertura = { versao: 1, cobertura: lista[id] };
    if (!ehObjeto(lista[id])) {
      erros.push({ campo: `producao.${id}`, motivo: "potência sem produção" });
      continue;
    }
    for (const e of validarCobertura(cobertura, mercado, true))
      erros.push({ campo: `producao.${id}.${e.campo}`, motivo: e.motivo });
  }
  return erros;
}

export function lerProducaoDoMundo(
  dado: unknown,
  mercado: Mercado,
  potencias: readonly string[],
): ProducaoDoMundo {
  const erros = validarProducaoDoMundo(dado, mercado, potencias);
  if (erros.length)
    throw new Error(
      erros
        .map((e) => `mercado/produtores.json › ${e.campo}: ${e.motivo}`)
        .join("\n"),
    );
  return (dado as { producao: ProducaoDoMundo }).producao;
}

/**
 * Valida a cobertura declarada: de 0 a 200. O país pode deixar produtos de
 * fora (compra tudo); a potência declara todos (`completa`).
 */
export function validarCobertura(
  dado: unknown,
  mercado: Mercado,
  completa = false,
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
    if (v === undefined && !completa) continue;
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

/** Parte de cada potência no que o mundo vende (soma 1): pelo excedente. */
export function partesDoExcedente(
  producao: ProducaoDoMundo,
  produto: string,
): [string, number][] {
  const cobertura = Object.entries(producao).map(
    ([potencia, c]) => [potencia, c[produto] ?? 0] as const,
  );
  const excedente = cobertura.map(
    ([potencia, c]) => [potencia, Math.max(0, c - 100)] as const,
  );
  const base = excedente.some(([, e]) => e > 0) ? excedente : cobertura;
  const total = base.reduce((soma, [, e]) => soma + e, 0);
  return total > 0 ? base.map(([potencia, e]) => [potencia, e / total]) : [];
}

/** Conta de cada produto e a dependência de cada potência. */
export function balancoDoPais({
  mercado,
  producao,
  cobertura,
}: Pick<MercadoDoPais, "mercado" | "producao" | "cobertura">): Balanco {
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
        const fornecedores = partesDoExcedente(producao, p.id)
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
