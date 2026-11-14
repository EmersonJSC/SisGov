// Validador do JSON de lei. Roda ao carregar; erro diz arquivo, campo e motivo.
import { ehBase } from "../calculos";
import { INDICES_ESSENCIAIS } from "../estado";
import { ehEstrato, ESTRATOS } from "../populacao";
import { CAMADAS, CANAIS, CLASSES, EIXOS, FORCAS, type Lei } from "./tipos";

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

/** O que cada conferência precisa: onde anotar o erro e os índices do mundo. */
interface Contexto {
  erro: (campo: string, motivo: string) => void;
  indices: readonly string[];
}

function conferirCabecalho(c: Contexto, dado: Objeto, arquivo: string) {
  if (dado.versao !== 1) c.erro("versao", "precisa ser 1");
  if (!ehKebab(dado.id)) c.erro("id", "precisa ser kebab-case");
  else if (
    !arquivo.endsWith(`/${dado.id}.json`) &&
    arquivo !== `${dado.id}.json`
  )
    c.erro("id", `difere do nome do arquivo`);
  if (!CAMADAS.includes(dado.camada as never))
    c.erro("camada", `precisa ser ${CAMADAS.join(" ou ")}`);
  if (dado.classe !== undefined && !CLASSES.includes(dado.classe as never))
    c.erro("classe", `precisa ser ${CLASSES.join(", ")}`);
  if (dado.esfera !== undefined && !ehKebab(dado.esfera))
    c.erro("esfera", "precisa ser kebab-case");
  conferirCanal(c, dado);
}

/** O canal diz como a lei chega ao pop e precisa bater com o que ela faz. */
function conferirCanal(c: Contexto, dado: Objeto) {
  if (!CANAIS.includes(dado.canal as never))
    return c.erro("canal", `precisa ser ${CANAIS.join(", ")}`);
  if (dado.canal === "espera") {
    if (typeof dado.espera !== "string" || dado.espera === "")
      c.erro("espera", "diga o que a lei espera (a triagem ou a mecânica)");
  } else if (dado.espera !== undefined)
    c.erro("espera", 'só existe no canal "espera"');
  const temCalculo = dado.calculo !== undefined;
  if ((dado.canal === "imposto") !== temCalculo)
    c.erro(
      "canal",
      'o canal "imposto" anda junto com o cálculo de arrecadação',
    );
  if (dado.canal === "transferencia" && dado.para === undefined)
    c.erro("canal", 'o canal "transferencia" precisa de "para"');
  if (dado.canal === "verba" && dado.conta !== "gasto")
    c.erro("canal", 'o canal "verba" precisa de "conta": "gasto"');
}

/** Posição na bússola: eixos conhecidos, cada um de −1 a +1. */
function conferirPonto(c: Contexto, valor: unknown, campo: string) {
  if (!ehObjeto(valor)) return c.erro(campo, "precisa ser um objeto");
  for (const [eixo, v] of Object.entries(valor))
    if (!EIXOS.includes(eixo as never))
      c.erro(`${campo}.${eixo}`, `eixo precisa ser ${EIXOS.join(" ou ")}`);
    else if (!ehNumero(v) || v < -1 || v > 1)
      c.erro(`${campo}.${eixo}`, "precisa estar entre -1 e 1");
}

function conferirEfeito(c: Contexto, ef: unknown, campo: string) {
  if (!ehObjeto(ef)) return c.erro(campo, "precisa ser um objeto");
  if (INDICES_ESSENCIAIS.includes(ef.indice as never))
    c.erro(
      `${campo}.indice`,
      `"${ef.indice}" é essencial: vem do cálculo do motor, não da lei`,
    );
  else if (!c.indices.includes(ef.indice as string))
    c.erro(
      `${campo}.indice`,
      `índice "${String(ef.indice)}" não existe no mundo`,
    );
  if (ef.sentido !== 1 && ef.sentido !== -1)
    c.erro(`${campo}.sentido`, "precisa ser 1 ou -1");
  if (!FORCAS.includes(ef.forca as never))
    c.erro(`${campo}.forca`, `precisa ser ${FORCAS.join(", ")}`);
  if (!Number.isInteger(ef.atraso_turnos) || (ef.atraso_turnos as number) < 0)
    c.erro(`${campo}.atraso_turnos`, "precisa ser inteiro ≥ 0");
}

function conferirEfeitos(c: Contexto, valor: unknown, campo: string) {
  if (!Array.isArray(valor)) return c.erro(campo, "precisa ser uma lista");
  valor.forEach((ef, i) => conferirEfeito(c, ef, `${campo}[${i}]`));
}

/** Unidade, faixa e passo da lei de régua. */
function conferirRegua(c: Contexto, dado: Objeto) {
  const fracao = dado.unidade === "fracao";
  if (
    !fracao &&
    dado.unidade !== "meses" &&
    dado.unidade !== "anos" &&
    dado.unidade !== "livre"
  )
    c.erro("unidade", 'precisa ser "fracao", "meses", "anos" ou "livre"');
  if (
    dado.unidade === "livre" &&
    (typeof dado.rotulo_unidade !== "string" || !dado.rotulo_unidade.trim())
  )
    c.erro("rotulo_unidade", 'unidade "livre" precisa do nome da unidade');
  const faixa = dado.faixa;
  if (!ehObjeto(faixa) || !ehNumero(faixa.min) || !ehNumero(faixa.max))
    c.erro("faixa", "precisa ter min e max numéricos");
  else if (faixa.min >= faixa.max) c.erro("faixa", "precisa ter min < max");
  else if (faixa.min < 0 && dado.unidade !== "livre")
    c.erro("faixa", "abaixo de zero só na unidade livre");
  else if (fracao && faixa.max > 1)
    c.erro("faixa", "em fração, precisa ter max ≤ 1");
  if (!fracao && (dado.calculo !== undefined || dado.conta !== undefined))
    c.erro("unidade", "calculo e conta só existem em fração");
  if (!ehNumero(dado.passo) || dado.passo <= 0)
    c.erro("passo", "precisa ser > 0");
}

/** Cálculo de arrecadação, conta de gasto e para quem o gasto vira renda. */
function conferirContas(c: Contexto, dado: Objeto) {
  if (dado.calculo !== undefined) {
    const calc = dado.calculo;
    if (!ehObjeto(calc)) c.erro("calculo", "precisa ser um objeto");
    else {
      if (typeof calc.base !== "string" || !ehBase(calc.base))
        c.erro(
          "calculo.base",
          `base "${String(calc.base)}" não existe no motor`,
        );
      if (calc.modelo !== "laffer")
        c.erro("calculo.modelo", 'precisa ser "laffer"');
    }
  }
  if (dado.conta !== undefined && dado.conta !== "gasto")
    c.erro("conta", 'precisa ser "gasto"');
  else if (dado.conta !== undefined && dado.calculo !== undefined)
    c.erro("conta", "lei de gasto não tem cálculo de arrecadação");
  if (dado.para !== undefined) {
    if (dado.conta !== "gasto") c.erro("para", "só lei de gasto tem para");
    else if (!ehObjeto(dado.para) || !ehEstrato(dado.para.estrato))
      c.erro("para.estrato", `precisa ser ${ESTRATOS.join(", ")}`);
  }
}

/** Bússola da régua: os dois extremos e, se houver, onde ela chega ao máximo. */
function conferirBussolaDaRegua(c: Contexto, dado: Objeto) {
  if (dado.bussola === undefined) return;
  if (!ehObjeto(dado.bussola))
    return c.erro("bussola", "precisa ter min e max");
  conferirPonto(c, dado.bussola.min, "bussola.min");
  conferirPonto(c, dado.bussola.max, "bussola.max");
  const ate = dado.bussola.ate;
  const f = ehObjeto(dado.faixa) ? dado.faixa : {};
  if (
    ate !== undefined &&
    !(
      typeof ate === "number" &&
      ehNumero(f.min) &&
      ehNumero(f.max) &&
      ate > f.min &&
      ate <= f.max
    )
  )
    c.erro("bussola.ate", "precisa estar dentro da faixa");
}

function conferirOpcao(
  c: Contexto,
  op: unknown,
  i: number,
  vistos: Set<unknown>,
) {
  const campo = `opcoes[${i}]`;
  if (!ehObjeto(op)) return c.erro(campo, "precisa ser um objeto");
  if (!ehKebab(op.id)) c.erro(`${campo}.id`, "precisa ser kebab-case");
  else if (vistos.has(op.id)) c.erro(`${campo}.id`, `"${op.id}" repetido`);
  vistos.add(op.id);
  if (op.bussola !== undefined)
    conferirPonto(c, op.bussola, `${campo}.bussola`);
  if (
    op.mandato_anos !== undefined &&
    !(Number.isInteger(op.mandato_anos) && (op.mandato_anos as number) > 0)
  )
    c.erro(`${campo}.mandato_anos`, "precisa ser inteiro > 0");
  for (const nome of ["deficit_do_cofre", "superavit_ao_cofre"]) {
    const v = op[nome];
    if (v !== undefined && !(typeof v === "number" && v >= 0 && v <= 1))
      c.erro(`${campo}.${nome}`, "precisa ser um número de 0 a 1");
  }
  if (
    op.valores !== undefined &&
    (!ehObjeto(op.valores) ||
      !Object.values(op.valores).every(
        (n) => typeof n === "number" && Number.isFinite(n),
      ))
  )
    c.erro(`${campo}.valores`, "precisa ser números por chave");
  conferirEfeitos(c, op.efeitos, `${campo}.efeitos`);
}

/** Campo que, se uma opção tem, todas precisam ter. */
function conferirTodasOuNenhuma(c: Contexto, opcoes: unknown[], campo: string) {
  const com = opcoes.filter((op) => ehObjeto(op) && op[campo] !== undefined);
  if (com.length > 0 && com.length < opcoes.length)
    c.erro("opcoes", `${campo} precisa estar em todas as opções`);
}

function conferirOpcoes(c: Contexto, dado: Objeto) {
  const opcoes = dado.opcoes;
  if (!Array.isArray(opcoes) || opcoes.length < 2)
    return c.erro("opcoes", "precisa ter ao menos duas opções");
  const vistos = new Set<unknown>();
  opcoes.forEach((op, i) => conferirOpcao(c, op, i, vistos));
  for (const campo of ["deficit_do_cofre", "superavit_ao_cofre"])
    conferirTodasOuNenhuma(c, opcoes, campo);
  conferirTodasOuNenhuma(c, opcoes, "mandato_anos");
}

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
  const c: Contexto = {
    erro: (campo, motivo) => erros.push({ arquivo, campo, motivo }),
    indices,
  };
  if (!ehObjeto(dado)) {
    c.erro("(raiz)", "a lei precisa ser um objeto");
    return erros;
  }
  conferirCabecalho(c, dado, arquivo);
  if (dado.forma === "continua") {
    conferirRegua(c, dado);
    conferirContas(c, dado);
    conferirBussolaDaRegua(c, dado);
    conferirEfeitos(c, dado.efeitos, "efeitos");
  } else if (dado.forma === "opcoes") conferirOpcoes(c, dado);
  else c.erro("forma", 'precisa ser "continua" ou "opcoes"');
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
