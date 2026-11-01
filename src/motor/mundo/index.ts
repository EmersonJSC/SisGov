// Mundo: as grandes potências (src/motor/mundo/mundo.md). O motor não
// conhece os nomes; elas vêm do conteúdo.
import { EIXOS, type Lei, type PontoBussola, type ValorLei } from "../leis";

export interface Potencia {
  id: string;
  nome: string;
  descricao: string;
  /** Os dois eixos sempre presentes, de −1 a +1. */
  bussola: Required<PontoBussola>;
  /** O quanto conta no mundo; a soma de todas é 1. */
  peso: number;
  /** Para cada outra potência, de −1 (rivais) a +1 (aliadas). */
  relacoes: Record<string, number>;
}

export interface ErroMundo {
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

const ehKebabBaixo = (v: unknown): v is string =>
  typeof v === "string" && /^[a-z0-9]+(_[a-z0-9]+)*$/.test(v);

/** Folga para somas de frações (0,3 + 0,25 + … não dá 1 exato). */
const FOLGA = 1e-9;

/** Valida o JSON das potências do mundo. */
export function validarPotencias(dado: unknown): ErroMundo[] {
  const erros: ErroMundo[] = [];
  const erro = (campo: string, motivo: string) => erros.push({ campo, motivo });

  if (!ehObjeto(dado)) {
    erro("(raiz)", "precisa ser um objeto");
    return erros;
  }
  if (dado.versao !== 1) erro("versao", "precisa ser 1");
  if (!ehKebabBaixo(dado.indice_reputacao))
    erro("indice_reputacao", "precisa ser o id do índice da reputação");
  const lista = dado.potencias;
  if (!Array.isArray(lista) || lista.length < 2) {
    erro("potencias", "precisa ter ao menos duas potências");
    return erros;
  }

  const ids = new Set<string>();
  lista.forEach((p, i) => {
    if (!ehObjeto(p)) return;
    if (!ehKebab(p.id)) erro(`potencias[${i}].id`, "precisa ser kebab-case");
    else if (ids.has(p.id)) erro(`potencias[${i}].id`, `"${p.id}" repetido`);
    else ids.add(p.id);
  });

  let somaPesos = 0;
  lista.forEach((p, i) => {
    const c = `potencias[${i}]`;
    if (!ehObjeto(p)) return erro(c, "precisa ser um objeto");
    if (typeof p.nome !== "string" || p.nome === "")
      erro(`${c}.nome`, "precisa ter nome");
    if (typeof p.descricao !== "string")
      erro(`${c}.descricao`, "precisa ser texto");

    if (!ehObjeto(p.bussola)) erro(`${c}.bussola`, "precisa ter posição");
    else {
      for (const eixo of EIXOS) {
        const v = p.bussola[eixo];
        if (v === undefined) erro(`${c}.bussola.${eixo}`, "falta a posição");
        else if (!ehNumero(v) || v < -1 || v > 1)
          erro(`${c}.bussola.${eixo}`, "precisa estar entre -1 e 1");
      }
      for (const eixo of Object.keys(p.bussola))
        if (!EIXOS.includes(eixo as never))
          erro(
            `${c}.bussola.${eixo}`,
            `eixo precisa ser ${EIXOS.join(" ou ")}`,
          );
    }

    if (!ehNumero(p.peso) || p.peso < 0 || p.peso > 1)
      erro(`${c}.peso`, "precisa estar entre 0 e 1");
    else somaPesos += p.peso;

    if (!ehObjeto(p.relacoes))
      return erro(`${c}.relacoes`, "precisa ser um objeto");
    for (const [outra, v] of Object.entries(p.relacoes)) {
      const cr = `${c}.relacoes.${outra}`;
      if (outra === p.id) erro(cr, "relação consigo mesma");
      else if (!ids.has(outra)) erro(cr, `potência "${outra}" não existe`);
      if (!ehNumero(v) || v < -1 || v > 1)
        erro(cr, "precisa estar entre -1 e 1");
    }
    for (const outra of ids)
      if (outra !== p.id && !(outra in p.relacoes))
        erro(`${c}.relacoes`, `falta a relação com "${outra}"`);
  });

  if (Math.abs(somaPesos - 1) > FOLGA)
    erro("potencias", `a soma dos pesos precisa ser 1 (deu ${somaPesos})`);

  // O par tem o mesmo valor dos dois lados.
  const porId = new Map(
    lista.filter(ehObjeto).map((p) => [p.id, p.relacoes] as const),
  );
  for (const [a, relA] of porId) {
    if (!ehObjeto(relA)) continue;
    for (const [b, v] of Object.entries(relA)) {
      const relB = porId.get(b);
      if (typeof a !== "string" || a >= b || !ehObjeto(relB)) continue;
      if (a in relB && relB[a] !== v)
        erro(
          `relacoes`,
          `"${a}" e "${b}" têm valores diferentes (${String(v)} e ${String(relB[a])})`,
        );
    }
  }

  return erros;
}

/** Id do índice que recebe a reputação (`indice_reputacao` do JSON). */
export function indiceDaReputacao(dado: unknown): string {
  return (dado as { indice_reputacao: string }).indice_reputacao;
}

/** Valida e devolve as potências tipadas; lança com todos os erros juntos. */
export function lerPotencias(dado: unknown): Potencia[] {
  const erros = validarPotencias(dado);
  if (erros.length > 0)
    throw new Error(erros.map((e) => `${e.campo}: ${e.motivo}`).join("\n"));
  return (dado as { potencias: Potencia[] }).potencias;
}

/**
 * Onde o país fica na bússola: média das leis vigentes, eixo por eixo. Lei
 * que não declara o eixo não entra nele; eixo sem lei nenhuma fica em 0.
 */
export function posicaoDoPais(
  leis: Record<string, Lei>,
  vigentes: Record<string, ValorLei>,
): Required<PontoBussola> {
  const soma = { economico: 0, social: 0 };
  const conta = { economico: 0, social: 0 };
  for (const lei of Object.values(leis)) {
    const valor = vigentes[lei.id];
    for (const eixo of EIXOS) {
      let v: number | undefined;
      if (lei.forma === "continua") {
        const b = lei.bussola;
        if (!b || (b.min[eixo] === undefined && b.max[eixo] === undefined))
          continue;
        const { min, max } = lei.faixa;
        const t = (((valor as number | undefined) ?? min) - min) / (max - min);
        const de = b.min[eixo] ?? 0;
        v = de + t * ((b.max[eixo] ?? 0) - de);
      } else {
        v = lei.opcoes.find((o) => o.id === valor)?.bussola?.[eixo];
      }
      if (v === undefined) continue;
      soma[eixo] += v;
      conta[eixo] += 1;
    }
  }
  return {
    economico: conta.economico ? soma.economico / conta.economico : 0,
    social: conta.social ? soma.social / conta.social : 0,
  };
}

/** Maior distância possível na bússola: de um canto ao oposto. */
const DISTANCIA_MAXIMA = 2 * Math.SQRT2;

/** Opinião que a potência gostaria de ter: 100 na mesma posição, 0 no canto oposto. */
export function opiniaoDesejada(
  potencia: Potencia,
  pais: Required<PontoBussola>,
): number {
  const d = Math.hypot(
    pais.economico - potencia.bussola.economico,
    pais.social - potencia.bussola.social,
  );
  return 100 * (1 - d / DISTANCIA_MAXIMA);
}

/** Reputação: média das opiniões pesada pelo `peso` das potências. */
export function reputacao(
  potencias: Potencia[],
  opinioes: Record<string, number>,
): number {
  return potencias.reduce((soma, p) => soma + p.peso * opinioes[p.id], 0);
}

/** Quanto da distância até a desejada a opinião anda por turno. */
export const PASSO_OPINIAO = 0.1;

/** Opiniões depois de um turno, rumo à desejada de cada potência. */
export function andarOpinioes(
  potencias: Potencia[],
  opinioes: Record<string, number>,
  pais: Required<PontoBussola>,
): Record<string, number> {
  const novas: Record<string, number> = {};
  for (const p of potencias) {
    const atual = opinioes[p.id];
    novas[p.id] = atual + PASSO_OPINIAO * (opiniaoDesejada(p, pais) - atual);
  }
  return novas;
}

/** Erro nas opiniões de partida do país, ou null. */
export function motivoOpinioesInvalidas(
  potencias: Potencia[],
  opinioes: Record<string, number> | undefined,
): string | null {
  if (!opinioes) return "faltam as opiniões das potências";
  const ids = new Set(potencias.map((p) => p.id));
  for (const id of Object.keys(opinioes))
    if (!ids.has(id)) return `opinião de potência que não existe: "${id}"`;
  for (const id of ids) {
    const v = opinioes[id];
    if (v === undefined) return `falta a opinião de "${id}"`;
    if (!(Number.isFinite(v) && v >= 0 && v <= 100))
      return `opinião de "${id}" precisa estar entre 0 e 100`;
  }
  return null;
}
