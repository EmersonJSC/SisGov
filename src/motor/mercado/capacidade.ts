// Capacidade contra demanda (src/motor/mercado/mercado.md, fatia 7). Para o que
// não se guarda e viaja pela rede (ex.: energia). As fontes ganham capacidade
// quando o Estado investe, depois do prazo da obra, e perdem um pouco a cada
// turno. A unidade é "pontos": a demanda do turno 0 vale 100. O motor não
// conhece nomes de fonte nem de lei; eles vêm do conteúdo.
import type { ValorLei } from "../leis";
import { precoDoPais, reacaoDaCesta } from "./demanda";
import type { ErroMercado, ReacaoDaCesta } from "./index";

const TURNOS_POR_ANO = 6;

export interface FonteDeCapacidade {
  id: string;
  nome: string;
  /** Lei contínua (% do PIB ao ano) que paga a expansão desta fonte. */
  lei: string;
  /** Turnos entre pagar a obra e a capacidade ficar pronta. */
  prazo: number;
  /** Pontos de capacidade comprados por 1% do PIB investido num ano. */
  custo: number;
  /** Parte da capacidade que se perde por ano (0 a 1). */
  desgaste: number;
}

export interface Capacidade {
  id: string;
  nome: string;
  /** Demanda do turno 0, em pontos; a das empresas cresce com o PIB real. */
  demanda: { pessoas: number; empresas: number; elasticidade?: number };
  /** Pontos de crescimento ao ano perdidos se faltar tudo às empresas. */
  freio_crescimento: number;
  /** Pontos de inflação ao ano por ponto de preço acima do base. */
  peso_nos_precos: number;
  /** Efeito da falta que chega aos civis (só em crise grave). */
  reacao_civil?: ReacaoDaCesta;
  fontes: FonteDeCapacidade[];
  /** Leis de opções que mudam como a rede funciona (quem constrói, opera, vende). */
  camadas?: CamadaDaCapacidade[];
}

/** O que uma opção de lei faz na rede; tudo opcional, ausente = nada. */
export interface EfeitoDaOpcao {
  /** Parte da obra paga por empresas (0 a 0,9): a mesma verba compra mais. */
  parte_privada?: number;
  /** Capacidade a mais (ou a menos) que a rede entrega, em %. */
  ganho_capacidade?: number;
  /** Pontos de % que o preço sobe (lucro de quem opera ou vende). */
  margem_preco?: number;
}

export interface CamadaDaCapacidade {
  /** Lei de opções do mundo; cada opção diz o que faz na rede. */
  lei: string;
  opcoes: Record<string, EfeitoDaOpcao>;
}

/** Soma dos efeitos das opções em vigor de todas as camadas. */
export function efeitoDasCamadas(
  c: Capacidade,
  leis: Record<string, ValorLei>,
): Required<EfeitoDaOpcao> {
  const soma = { parte_privada: 0, ganho_capacidade: 0, margem_preco: 0 };
  for (const camada of c.camadas ?? []) {
    const e = camada.opcoes[String(leis[camada.lei])] ?? {};
    soma.parte_privada += e.parte_privada ?? 0;
    soma.ganho_capacidade += e.ganho_capacidade ?? 0;
    soma.margem_preco += e.margem_preco ?? 0;
  }
  return { ...soma, parte_privada: Math.min(soma.parte_privada, MAX_PRIVADO) };
}

/** Empresas nunca pagam mais que isto da obra (a verba do Estado não vira infinito). */
const MAX_PRIVADO = 0.9;

/** O que uma fonte tem no estado: pronta e obras a chegar (a primeira chega já). */
export interface FonteNoEstado {
  pronta: number;
  obras: number[];
}
export type CapacidadeNoEstado = Record<string, FonteNoEstado>;

/** Pontos que chegam por turno com a lei no valor dado (fração do PIB). */
const chegada = (
  f: FonteDeCapacidade,
  valor: ValorLei | undefined,
  privado: number,
) => (Number(valor ?? 0) * 100 * f.custo) / TURNOS_POR_ANO / (1 - privado);

/** Turno 0: o que o país tem pronto e as obras em andamento, no ritmo das leis. */
export function capacidadeInicial(
  capacidades: readonly Capacidade[],
  declarada: Record<string, number>,
  leis: Record<string, ValorLei>,
): CapacidadeNoEstado {
  const estado: CapacidadeNoEstado = {};
  for (const c of capacidades) {
    const { parte_privada } = efeitoDasCamadas(c, leis);
    for (const f of c.fontes)
      estado[f.id] = {
        pronta: declarada[f.id] ?? 0,
        obras: Array<number>(f.prazo).fill(
          chegada(f, leis[f.lei], parte_privada),
        ),
      };
  }
  return estado;
}

/** Um turno: a obra mais velha fica pronta, a capacidade desgasta, nova obra entra. */
export function andarCapacidade(
  capacidades: readonly Capacidade[],
  atual: CapacidadeNoEstado,
  leis: Record<string, ValorLei>,
): CapacidadeNoEstado {
  const novo: CapacidadeNoEstado = {};
  for (const c of capacidades) {
    const { parte_privada } = efeitoDasCamadas(c, leis);
    for (const f of c.fontes) {
      const hoje = atual[f.id] ?? { pronta: 0, obras: [] };
      const [chega = 0, ...resto] = hoje.obras;
      novo[f.id] = {
        pronta: hoje.pronta * (1 - f.desgaste / TURNOS_POR_ANO) + chega,
        obras: [...resto, chegada(f, leis[f.lei], parte_privada)],
      };
    }
  }
  return novo;
}

export interface SituacaoDaCapacidade {
  id: string;
  nome: string;
  demanda: { pessoas: number; empresas: number; total: number };
  /** Capacidade que a rede entrega: pronta das fontes, mais o ganho da rede. */
  capacidade: number;
  /** Falta, em % da demanda de cada lado: os civis são atendidos primeiro. */
  faltaCivil: number;
  faltaEmpresas: number;
  /** Preço no país; 100 = base. */
  preco: number;
  fontes: { id: string; nome: string; pronta: number; emObra: number }[];
}

const BASE = 100;

/** Capacidade contra demanda hoje. `pibReal` é o PIB real de hoje ÷ o do turno 0. */
export function situacaoDaCapacidade(
  c: Capacidade,
  noEstado: CapacidadeNoEstado,
  contexto: {
    pessoas: number;
    pessoasBase: number;
    pibReal: number;
    leis: Record<string, ValorLei>;
  },
): SituacaoDaCapacidade {
  const pessoas =
    contexto.pessoasBase > 0
      ? c.demanda.pessoas * (contexto.pessoas / contexto.pessoasBase)
      : 0;
  const empresas =
    c.demanda.empresas *
    Math.pow(Math.max(contexto.pibReal, 0), c.demanda.elasticidade ?? 1);
  const fontes = c.fontes.map((f) => ({
    id: f.id,
    nome: f.nome,
    pronta: noEstado[f.id]?.pronta ?? 0,
    emObra: (noEstado[f.id]?.obras ?? []).reduce((s, v) => s + v, 0),
  }));
  const camadas = efeitoDasCamadas(c, contexto.leis);
  const capacidade =
    (fontes.reduce((s, f) => s + f.pronta, 0) *
      (BASE + camadas.ganho_capacidade)) /
    BASE;
  const paraCivis = Math.min(capacidade, pessoas);
  const paraEmpresas = Math.min(Math.max(capacidade - pessoas, 0), empresas);
  const falta = (pedido: number, entregue: number) =>
    pedido > 0 ? (100 * (pedido - entregue)) / pedido : 0;
  const total = pessoas + empresas;
  return {
    id: c.id,
    nome: c.nome,
    demanda: { pessoas, empresas, total },
    capacidade,
    faltaCivil: falta(pessoas, paraCivis),
    faltaEmpresas: falta(empresas, paraEmpresas),
    preco:
      (precoDoPais(total, capacidade, 0, BASE) *
        (BASE + camadas.margem_preco)) /
      BASE,
    fontes,
  };
}

/** Pontos de crescimento ao ano que a falta tira (as empresas sentem primeiro). */
export const freioDoCrescimento = (
  c: Capacidade,
  s: SituacaoDaCapacidade,
): number => (c.freio_crescimento * s.faltaEmpresas) / 100;

/** Pontos de inflação ao ano que o preço acima do base soma aos preços. */
export const pressaoNosPrecos = (
  c: Capacidade,
  s: SituacaoDaCapacidade,
): number => c.peso_nos_precos * Math.max(0, s.preco - BASE);

/** Pontos que a falta dos civis soma em outros índices (só crise grave). */
export const reacaoCivil = (
  c: Capacidade,
  s: SituacaoDaCapacidade,
): Record<string, number> =>
  c.reacao_civil ? reacaoDaCesta(c.reacao_civil, -s.faltaCivil) : {};

type Objeto = Record<string, unknown>;
const ehObjeto = (v: unknown): v is Objeto =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const ehKebab = (v: unknown): v is string =>
  typeof v === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v);
const ehTexto = (v: unknown): v is string => typeof v === "string" && v !== "";
const positivo = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v > 0;

/** Valida o bloco `capacidades` do JSON dos produtos (ausente vale lista vazia). */
export function validarCapacidades(dado: unknown): ErroMercado[] {
  const erros: ErroMercado[] = [];
  const erro = (campo: string, motivo: string) => erros.push({ campo, motivo });
  if (dado === undefined) return erros;
  if (!Array.isArray(dado))
    return [{ campo: "capacidades", motivo: "precisa ser uma lista" }];
  const ids = new Set<string>();
  const fontesVistas = new Set<string>();
  dado.forEach((c, i) => {
    const k = `capacidades[${i}]`;
    if (!ehObjeto(c)) return erro(k, "precisa ser um objeto");
    if (!ehKebab(c.id)) erro(`${k}.id`, "precisa ser kebab-case");
    else if (ids.has(c.id)) erro(`${k}.id`, `"${c.id}" repetido`);
    else ids.add(c.id);
    if (!ehTexto(c.nome)) erro(`${k}.nome`, "precisa ter nome");
    const d = c.demanda;
    if (!ehObjeto(d)) erro(`${k}.demanda`, "precisa ser um objeto");
    else {
      if (!positivo(d.pessoas))
        erro(`${k}.demanda.pessoas`, "precisa ser um número maior que 0");
      if (!positivo(d.empresas))
        erro(`${k}.demanda.empresas`, "precisa ser um número maior que 0");
      if (d.elasticidade !== undefined && !positivo(d.elasticidade))
        erro(`${k}.demanda.elasticidade`, "precisa ser um número maior que 0");
    }
    if (!positivo(c.freio_crescimento))
      erro(`${k}.freio_crescimento`, "precisa ser um número maior que 0");
    if (typeof c.peso_nos_precos !== "number" || !(c.peso_nos_precos >= 0))
      erro(`${k}.peso_nos_precos`, "precisa ser um número maior ou igual a 0");
    if (c.reacao_civil !== undefined) {
      const r = c.reacao_civil;
      if (!ehObjeto(r)) erro(`${k}.reacao_civil`, "precisa ser um objeto");
      else {
        if (!positivo(r.escala))
          erro(`${k}.reacao_civil.escala`, "precisa ser um número maior que 0");
        if (typeof r.ganho !== "number" || !(r.ganho >= 0))
          erro(
            `${k}.reacao_civil.ganho`,
            "precisa ser um número maior ou igual a 0",
          );
        if (!Array.isArray(r.efeitos))
          erro(`${k}.reacao_civil.efeitos`, "precisa ser uma lista");
        else
          r.efeitos.forEach((e, j) => {
            const p = `${k}.reacao_civil.efeitos[${j}]`;
            if (!ehObjeto(e)) return erro(p, "precisa ser um objeto");
            if (!ehTexto(e.indice)) erro(`${p}.indice`, "precisa ter índice");
            if (e.sentido !== 1 && e.sentido !== -1)
              erro(`${p}.sentido`, "precisa ser 1 ou -1");
            if (!["fraca", "media", "forte"].includes(String(e.forca)))
              erro(`${p}.forca`, "precisa ser fraca, media ou forte");
          });
      }
    }
    if (c.camadas !== undefined) {
      if (!Array.isArray(c.camadas))
        erro(`${k}.camadas`, "precisa ser uma lista");
      else
        c.camadas.forEach((cm, j) => {
          const p = `${k}.camadas[${j}]`;
          if (!ehObjeto(cm)) return erro(p, "precisa ser um objeto");
          if (!ehTexto(cm.lei)) erro(`${p}.lei`, "precisa apontar uma lei");
          if (!ehObjeto(cm.opcoes))
            return erro(`${p}.opcoes`, "precisa ser um objeto");
          for (const [id, e] of Object.entries(cm.opcoes)) {
            const q = `${p}.opcoes.${id}`;
            if (!ehObjeto(e)) {
              erro(q, "precisa ser um objeto");
              continue;
            }
            const pp = e.parte_privada;
            if (
              pp !== undefined &&
              (typeof pp !== "number" || pp < 0 || pp > 0.9)
            )
              erro(`${q}.parte_privada`, "precisa estar entre 0 e 0,9");
            for (const campo of ["ganho_capacidade", "margem_preco"])
              if (e[campo] !== undefined && typeof e[campo] !== "number")
                erro(`${q}.${campo}`, "precisa ser número");
          }
        });
    }
    if (!Array.isArray(c.fontes) || c.fontes.length === 0)
      return erro(`${k}.fontes`, "precisa ter ao menos uma fonte");
    c.fontes.forEach((f, j) => {
      const p = `${k}.fontes[${j}]`;
      if (!ehObjeto(f)) return erro(p, "precisa ser um objeto");
      if (!ehKebab(f.id)) erro(`${p}.id`, "precisa ser kebab-case");
      else if (fontesVistas.has(f.id)) erro(`${p}.id`, `"${f.id}" repetido`);
      else fontesVistas.add(f.id);
      if (!ehTexto(f.nome)) erro(`${p}.nome`, "precisa ter nome");
      if (!ehTexto(f.lei)) erro(`${p}.lei`, "precisa apontar uma lei");
      if (!Number.isInteger(f.prazo) || (f.prazo as number) < 1)
        erro(`${p}.prazo`, "precisa ser um inteiro maior ou igual a 1");
      if (!positivo(f.custo))
        erro(`${p}.custo`, "precisa ser um número maior que 0");
      if (typeof f.desgaste !== "number" || f.desgaste < 0 || f.desgaste > 1)
        erro(`${p}.desgaste`, "precisa estar entre 0 e 1");
    });
  });
  return erros;
}
