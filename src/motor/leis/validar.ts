// Validador do JSON de lei. Roda ao carregar; erro diz arquivo, campo e motivo.
import { ehBase } from "../calculos";
import { INDICES_ESSENCIAIS } from "../estado";
import { ehEstrato, ESTRATOS } from "../populacao";
import { CAMADAS, FORCAS, type Lei } from "./tipos";

export interface ErroLei {
  arquivo: string;
  campo: string;
  motivo: string;
}

type Objeto = Record<string, unknown>;

const ehObjeto = (v: unknown): v is Objeto =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const ehNumero = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
const ehKebab = (v: unknown): v is string =>
  typeof v === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v);

/**
 * Valida uma lei vinda de JSON.
 * @param indices ids dos índices de jogabilidade do mundo
 */
export function validarLei(
  dado: unknown,
  arquivo: string,
  indices: readonly string[],
): ErroLei[] {
  const erros: ErroLei[] = [];
  const erro = (campo: string, motivo: string) =>
    erros.push({ arquivo, campo, motivo });

  if (!ehObjeto(dado)) {
    erro("(raiz)", "a lei precisa ser um objeto");
    return erros;
  }

  if (dado.versao !== 1) erro("versao", "precisa ser 1");
  if (!ehKebab(dado.id)) erro("id", "precisa ser kebab-case");
  else if (
    !arquivo.endsWith(`/${dado.id}.json`) &&
    arquivo !== `${dado.id}.json`
  )
    erro("id", `difere do nome do arquivo`);
  if (!CAMADAS.includes(dado.camada as never))
    erro("camada", `precisa ser ${CAMADAS.join(" ou ")}`);

  const grupos = (valor: unknown, campo: string, aceitos: string[]) => {
    if (valor === undefined) return;
    if (!ehObjeto(valor)) return erro(campo, "precisa ser um objeto");
    for (const [g, v] of Object.entries(valor))
      if (!aceitos.includes(v as string))
        erro(`${campo}.${g}`, `precisa ser ${aceitos.join(" ou ")}`);
  };

  const efeitos = (valor: unknown, campo: string) => {
    if (!Array.isArray(valor)) return erro(campo, "precisa ser uma lista");
    valor.forEach((ef, i) => {
      const c = `${campo}[${i}]`;
      if (!ehObjeto(ef)) return erro(c, "precisa ser um objeto");
      if (INDICES_ESSENCIAIS.includes(ef.indice as never))
        erro(
          `${c}.indice`,
          `"${ef.indice}" é essencial: vem do cálculo do motor, não da lei`,
        );
      else if (!indices.includes(ef.indice as string))
        erro(
          `${c}.indice`,
          `índice "${String(ef.indice)}" não existe no mundo`,
        );
      if (ef.sentido !== 1 && ef.sentido !== -1)
        erro(`${c}.sentido`, "precisa ser 1 ou -1");
      if (!FORCAS.includes(ef.forca as never))
        erro(`${c}.forca`, `precisa ser ${FORCAS.join(", ")}`);
      if (
        !Number.isInteger(ef.atraso_turnos) ||
        (ef.atraso_turnos as number) < 0
      )
        erro(`${c}.atraso_turnos`, "precisa ser inteiro ≥ 0");
    });
  };

  if (dado.forma === "continua") {
    if (dado.unidade !== "fracao") erro("unidade", 'precisa ser "fracao"');
    const faixa = dado.faixa;
    if (!ehObjeto(faixa) || !ehNumero(faixa.min) || !ehNumero(faixa.max))
      erro("faixa", "precisa ter min e max numéricos");
    else if (faixa.min < 0 || faixa.max > 1 || faixa.min >= faixa.max)
      erro("faixa", "precisa ter 0 ≤ min < max ≤ 1");
    if (!ehNumero(dado.passo) || dado.passo <= 0)
      erro("passo", "precisa ser > 0");
    if (dado.calculo !== undefined) {
      const calc = dado.calculo;
      if (!ehObjeto(calc)) erro("calculo", "precisa ser um objeto");
      else {
        if (typeof calc.base !== "string" || !ehBase(calc.base))
          erro(
            "calculo.base",
            `base "${String(calc.base)}" não existe no motor`,
          );
        if (calc.modelo !== "laffer")
          erro("calculo.modelo", 'precisa ser "laffer"');
      }
    }
    if (dado.conta !== undefined && dado.conta !== "gasto")
      erro("conta", 'precisa ser "gasto"');
    else if (dado.conta !== undefined && dado.calculo !== undefined)
      erro("conta", "lei de gasto não tem cálculo de arrecadação");
    if (dado.para !== undefined) {
      if (dado.conta !== "gasto") erro("para", "só lei de gasto tem para");
      else if (!ehObjeto(dado.para) || !ehEstrato(dado.para.estrato))
        erro("para.estrato", `precisa ser ${ESTRATOS.join(", ")}`);
    }
    grupos(dado.grupos, "grupos", ["mais", "menos"]);
    efeitos(dado.efeitos, "efeitos");
  } else if (dado.forma === "opcoes") {
    const opcoes = dado.opcoes;
    if (!Array.isArray(opcoes) || opcoes.length < 2)
      erro("opcoes", "precisa ter ao menos duas opções");
    else {
      const vistos = new Set<unknown>();
      opcoes.forEach((op, i) => {
        if (!ehObjeto(op)) return erro(`opcoes[${i}]`, "precisa ser um objeto");
        if (!ehKebab(op.id)) erro(`opcoes[${i}].id`, "precisa ser kebab-case");
        else if (vistos.has(op.id))
          erro(`opcoes[${i}].id`, `"${op.id}" repetido`);
        vistos.add(op.id);
        grupos(op.grupos, `opcoes[${i}].grupos`, ["apoia", "rejeita"]);
        efeitos(op.efeitos, `opcoes[${i}].efeitos`);
      });
    }
  } else {
    erro("forma", 'precisa ser "continua" ou "opcoes"');
  }

  return erros;
}

/** Valida e devolve a lei tipada; lança com todos os erros juntos. */
export function lerLei(
  dado: unknown,
  arquivo: string,
  indices: readonly string[],
): Lei {
  const erros = validarLei(dado, arquivo, indices);
  if (erros.length > 0)
    throw new Error(
      erros.map((e) => `${e.arquivo} › ${e.campo}: ${e.motivo}`).join("\n"),
    );
  return dado as Lei;
}
