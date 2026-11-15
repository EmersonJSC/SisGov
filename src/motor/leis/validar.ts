// Validador do JSON de lei. Roda ao carregar; erro diz arquivo, campo e motivo.
import { ehBase } from "../calculos";
import { INDICES_ESSENCIAIS } from "../estado";
import { ehEstrato, ESTRATOS } from "../populacao";
import {
  CAMADAS,
  CANAIS,
  CLASSES,
  EIXOS,
  FORCAS,
  JEITOS,
  TIPOS,
  type Lei,
} from "./tipos";

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
  conferirTipo(c, dado);
}

/** Lei que já passou pela triagem da onda dela (plano das leis). */
const ehTriada = (dado: Objeto) =>
  !(dado.canal === "espera" && dado.espera === "triagem");

/** Lei com prazo diz quantos turnos vale; os outros tipos não têm prazo. */
function conferirTipo(c: Contexto, dado: Objeto) {
  if (dado.tipo !== undefined && !TIPOS.includes(dado.tipo as never))
    c.erro("tipo", `precisa ser ${TIPOS.join(", ")}`);
  const comPrazo = dado.tipo === "prazo";
  const prazo = dado.prazo_turnos;
  if (comPrazo && !(Number.isInteger(prazo) && (prazo as number) > 0))
    c.erro("prazo_turnos", "lei com prazo precisa de turnos inteiros > 0");
  if (!comPrazo && prazo !== undefined)
    c.erro("prazo_turnos", 'só existe no tipo "prazo"');
}

/** Degrau que não faz nada: sem efeito, sem lado, sem número para o motor. */
const ehNada = (op: Objeto) =>
  (!Array.isArray(op.efeitos) || op.efeitos.length === 0) &&
  !(ehObjeto(op.bussola) && Object.values(op.bussola).some((v) => v !== 0)) &&
  op.valores === undefined &&
  op.mandato_anos === undefined &&
  op.deficit_do_cofre === undefined &&
  op.superavit_ao_cofre === undefined;

/**
 * Regras de classificação (GDD 4.3): o jeito bate com a forma, níveis têm
 * de 3 a 5 degraus e nenhum degrau é "nada" (nada = não legislada).
 */
function conferirJeito(c: Contexto, dado: Objeto) {
  const jeito = dado.jeito;
  if (jeito === undefined) {
    if (ehTriada(dado)) c.erro("jeito", "lei triada precisa do jeito");
    return;
  }
  if (!JEITOS.includes(jeito as never))
    return c.erro("jeito", `precisa ser ${JEITOS.join(", ")}`);
  const regua = dado.forma === "continua";
  const gasto = dado.conta === "gasto";
  if (jeito === "verba" && !(regua && gasto))
    c.erro("jeito", 'verba é régua com "conta": "gasto"');
  if (jeito === "regua" && !(regua && !gasto))
    c.erro("jeito", "régua é lei contínua sem gasto (gasto é verba)");
  if ((jeito === "niveis" || jeito === "escolha") && regua)
    c.erro("jeito", `${jeito} é lei de opções`);
  if (dado.forma !== "opcoes" || !Array.isArray(dado.opcoes)) return;
  // essencial é a estrutura do Estado: não se revoga, então sempre tem um
  // valor, e o degrau "nenhum" é um valor de verdade
  if (dado.camada === "essencial") return;
  const opcoes = dado.opcoes as unknown[];
  if (jeito === "niveis" && (opcoes.length < 3 || opcoes.length > 5))
    c.erro("opcoes", "níveis têm de 3 a 5 degraus");
  // no canal "regra" o módulo lê a opção pelo id: ela age sem efeito próprio
  if (dado.canal === "regra") return;
  opcoes.forEach((op, i) => {
    if (ehObjeto(op) && ehNada(op))
      c.erro(
        `opcoes[${i}]`,
        "degrau que não faz nada: o nada é a lei não legislada",
      );
  });
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
      if (calc.estrato !== undefined && !ehEstrato(calc.estrato))
        c.erro("calculo.estrato", `precisa ser ${ESTRATOS.join(", ")}`);
    }
  }
  if (dado.conta !== undefined && dado.conta !== "gasto")
    c.erro("conta", 'precisa ser "gasto"');
  else if (dado.conta !== undefined && dado.calculo !== undefined)
    c.erro("conta", "lei de gasto não tem cálculo de arrecadação");
  if (dado.para !== undefined) {
    if (dado.conta !== "gasto") c.erro("para", "só lei de gasto tem para");
    else if (!ehObjeto(dado.para)) c.erro("para", "precisa ser um objeto");
    else if (dado.para.pesos !== undefined) {
      const pesos = dado.para.pesos;
      if (
        !ehObjeto(pesos) ||
        Object.keys(pesos).length === 0 ||
        !Object.entries(pesos).every(
          ([k, v]) => ehEstrato(k) && ehNumero(v) && v > 0,
        )
      )
        c.erro("para.pesos", `estratos (${ESTRATOS.join(", ")}) com peso > 0`);
    } else if (!ehEstrato(dado.para.estrato))
      c.erro("para.estrato", `precisa ser ${ESTRATOS.join(", ")}`);
  }
  if (
    dado.arrecada !== undefined &&
    !(ehNumero(dado.arrecada) && dado.arrecada > 0 && dado.arrecada <= 10)
  )
    c.erro("arrecada", "precisa ser % do PIB entre 0 e 10");
  if (dado.encolhe !== undefined) {
    const en = dado.encolhe;
    if (
      !ehObjeto(en) ||
      typeof en.base !== "string" ||
      !ehBase(en.base) ||
      (en.estrato !== undefined && !ehEstrato(en.estrato)) ||
      !ehNumero(en.ate) ||
      en.ate < 0 ||
      en.ate > 1
    )
      c.erro(
        "encolhe",
        "precisa de base do motor, estrato opcional e ate de 0 a 1",
      );
  }
}

/** A lei que muda o gasto de outra diz qual e quanto (régua: min e max). */
function conferirEscalaGasto(c: Contexto, dado: Objeto) {
  const es = dado.escala_gasto;
  if (es === undefined) return;
  if (!ehObjeto(es) || !ehKebab(es.lei))
    return c.erro("escala_gasto", "precisa dizer a lei de verba");
  if (dado.forma === "continua") {
    if (!ehNumero(es.min) || !ehNumero(es.max) || es.min < 0 || es.max < 0)
      c.erro("escala_gasto", "régua precisa de min e max ≥ 0");
  } else if (Array.isArray(dado.opcoes)) {
    const sem = (dado.opcoes as unknown[]).some(
      (op) =>
        !ehObjeto(op) || !ehObjeto(op.valores) || !ehNumero(op.valores.gasto),
    );
    if (sem) c.erro("escala_gasto", "toda opção precisa de valores.gasto");
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
  conferirJeito(c, dado);
  conferirEscalaGasto(c, dado);
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
