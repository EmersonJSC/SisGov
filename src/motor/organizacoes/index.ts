// Organizações políticas (passo I2, GDD 2.7): nascem dos radicais de grupos
// perto de um molde na bússola, crescem, racham e acabam. Os moldes vêm do
// mundo; o motor não conhece nome de grupo nem de organização.
// Comportamento em organizacoes.md.
import { sortear, type Acaso } from "../acaso";
import { parecenca, type Grupo, type TipoGrupo } from "../grupos";
import type { PontoBussola } from "../leis";

/** MoldeDeOrganizacao do mundo (`organizacoes.json › moldes`). */
export interface MoldeDeOrganizacao {
  id: string;
  /** Primeira palavra do nome (ex.: "Frente", "Comando"). */
  tipos: string[];
  /** Segunda parte do nome (ex.: "Popular", "da Terra"). */
  ideias: string[];
  /** Onde a ideia fica; ausente = atrai radicais de qualquer lado. */
  bussola?: PontoBussola;
  /** Só estes grupos entram (ex.: só ambientalistas); ausente = todos. */
  grupos?: string[];
  /** Usa armas: só recebe radicais de grupo que pode pegar em armas. */
  armas: boolean;
  /** Parte dos radicais atraídos que entra de fato (só parte usa violência). */
  adesao: number;
}

/** Regras do mundo (`organizacoes.json › regra`). */
export interface RegraDasOrganizacoes {
  /** Radicais atraídos, em parte da população, a partir dos quais ela pode nascer. */
  limiar: number;
  /** Turnos seguidos acima do limiar até nascer (o tempo de achar ideia e líder). */
  turnos_para_nascer: number;
  /** Parte do caminho que a gente anda por turno até os atraídos. */
  ritmo: number;
  /** Turnos abaixo do limiar até a organização acabar. */
  fim_turnos: number;
  /** Peso da ameaça de quem não usa armas (o armado vale 1). */
  sem_armas: number;
  /** Ameaça (gente × armas, em parte da população) que abre cada nível. */
  niveis: { relevante: number; grave: number; critica: number };
  /** Pontos em cada índice por 1% da população em ameaça (com sinal). */
  indices: Record<string, number>;
  /** Teto dos pontos por índice. */
  teto: number;
  /** Chance por turno de a inteligência pegar os chefes, com a tomada em 1. */
  inteligencia: number;
  /** Pontos de radical por turno nos grupos que alimentam a organização reprimida, com a tomada em 1. */
  revolta: number;
}

export interface RegrasOrganizacoes {
  regra: RegraDasOrganizacoes;
  moldes: MoldeDeOrganizacao[];
}

export const NIVEIS = ["pequena", "relevante", "grave", "critica"] as const;
export type Nivel = (typeof NIVEIS)[number];

export interface Organizacao {
  id: string;
  molde: string;
  nome: string;
  /** Estado (território) onde nasceu. */
  lugar: string;
  nasceu: number;
  /** Pessoas. */
  gente: number;
  nivel: Nivel;
  /** Turnos seguidos com os atraídos abaixo do limiar. */
  fraca: number;
}

export interface OrganizacoesNoEstado {
  vivas: Organizacao[];
  /** Nome de cada organização que já existiu, pelo id: nenhum se repete. */
  nomes: Record<string, string>;
  /** Pontos que as organizações já somaram em cada índice. */
  pontos: Record<string, number>;
  /** Quantas já nasceram (para o id). */
  contador: number;
  /** Turnos seguidos de cada molde com os atraídos acima do limiar. */
  acima: Record<string, number>;
}

/** O que o turno conta para as organizações. */
export interface TurnoDasOrganizacoes {
  turno: number;
  populacao: number;
  grupos: Record<string, Grupo>;
  tipos: TipoGrupo[];
  /** Gente de cada grupo em cada estado (para onde a organização nasce). */
  lugares: Record<string, Record<string, number>>;
  /** Gente de cada estado. */
  pessoas_lugar: Record<string, number>;
  /** Tomadas das leis (0 a 1). */
  repressao: number;
  inteligencia: number;
}

/** Radical acima da base (5%): só o excesso conta. */
const BASE_RADICAL = 5;

/** Parte de cada grupo que o molde atrai (0 a 1). */
export function atracao(molde: MoldeDeOrganizacao, t: TipoGrupo): number {
  if (molde.grupos && !molde.grupos.includes(t.id)) return 0;
  if (molde.armas && !t.armas) return 0;
  return molde.bussola ? parecenca(t, molde.bussola) : 1;
}

/** Radicais (acima da base) que o molde atrai, em pessoas. */
export function atraidos(
  molde: MoldeDeOrganizacao,
  tipos: TipoGrupo[],
  grupos: Record<string, Grupo>,
): number {
  return tipos.reduce((soma, t) => {
    const g = grupos[t.id];
    if (!g) return soma;
    const radicais = (g.pessoas * Math.max(0, g.radicais - BASE_RADICAL)) / 100;
    return soma + radicais * atracao(molde, t);
  }, 0);
}

/** Ameaça em parte da população: a gente, pesada pelas armas. */
export const ameaca = (
  regra: RegraDasOrganizacoes,
  molde: MoldeDeOrganizacao,
  gente: number,
  populacao: number,
) => (gente / populacao) * (molde.armas ? 1 : regra.sem_armas);

export function nivelDa(regra: RegraDasOrganizacoes, a: number): Nivel {
  if (a >= regra.niveis.critica) return "critica";
  if (a >= regra.niveis.grave) return "grave";
  if (a >= regra.niveis.relevante) return "relevante";
  return "pequena";
}

/** Nome novo: tipo + ideia, sorteados; se todos já foram usados, ganha número. */
function nomeNovo(
  molde: MoldeDeOrganizacao,
  usados: Set<string>,
  acaso: Acaso,
): [string, Acaso] {
  const livres = molde.tipos
    .flatMap((t) => molde.ideias.map((i) => `${t} ${i}`))
    .filter((n) => !usados.has(n));
  const [u, a] = sortear(acaso);
  if (livres.length) return [livres[Math.floor(u * livres.length)], a];
  const base = `${molde.tipos[0]} ${molde.ideias[0]}`;
  let n = 2;
  while (usados.has(`${base} ${n}`)) n++;
  return [`${base} ${n}`, a];
}

/**
 * Estado onde nasce: onde os radicais que o molde atrai são a maior parte da
 * gente do estado (proporção, não número: senão nasce sempre no maior).
 */
function lugarDo(
  molde: MoldeDeOrganizacao,
  turno: TurnoDasOrganizacoes,
): string {
  let melhor = "";
  let maior = -1;
  for (const [lugar, porGrupo] of Object.entries(turno.lugares)) {
    const gente = turno.pessoas_lugar[lugar] ?? 0;
    if (!(gente > 0)) continue;
    const radicais = turno.tipos.reduce((s, t) => {
      const g = turno.grupos[t.id];
      return g
        ? s +
            (porGrupo[t.id] ?? 0) *
              Math.max(0, g.radicais - BASE_RADICAL) *
              atracao(molde, t)
        : s;
    }, 0);
    if (radicais / gente > maior) {
      maior = radicais / gente;
      melhor = lugar;
    }
  }
  return melhor;
}

/** O que aconteceu no turno, para os fatos. */
export interface Acontecido {
  tipo: "nasceu" | "cresceu" | "rachou" | "acabou";
  organizacao: Organizacao;
}

export const organizacoesIniciais = (): OrganizacoesNoEstado => ({
  vivas: [],
  nomes: {},
  pontos: {},
  contador: 0,
  acima: {},
});

/**
 * Um turno das organizações: as vivas andam até os radicais atraídos (a
 * repressão corta), a inteligência pode pegar os chefes (a organização perde
 * metade e racha se ainda for grande), as fracas acabam, e onde o molde atrai
 * gente bastante e não há organização dele, uma pode nascer.
 */
export function andarOrganizacoes(
  r: RegrasOrganizacoes,
  antes: OrganizacoesNoEstado,
  turno: TurnoDasOrganizacoes,
  acaso: Acaso,
): {
  organizacoes: OrganizacoesNoEstado;
  acaso: Acaso;
  acontecidos: Acontecido[];
  /** Pontos de radical a somar em cada grupo (a revolta da repressão). */
  revolta: Record<string, number>;
} {
  const { regra } = r;
  const limiar = regra.limiar * turno.populacao;
  const usados = new Set(Object.values(antes.nomes));
  const nomes = { ...antes.nomes };
  const acontecidos: Acontecido[] = [];
  const revolta: Record<string, number> = {};
  const vivas: Organizacao[] = [];
  const acima: Record<string, number> = {};
  let contador = antes.contador;
  let a = acaso;
  const nova = (
    molde: MoldeDeOrganizacao,
    gente: number,
    lugar: string,
  ): Organizacao => {
    const [nome, prox] = nomeNovo(molde, usados, a);
    a = prox;
    usados.add(nome);
    contador++;
    nomes[`org-${contador}`] = nome;
    return {
      id: `org-${contador}`,
      molde: molde.id,
      nome,
      lugar,
      nasceu: turno.turno,
      gente,
      nivel: nivelDa(regra, ameaca(regra, molde, gente, turno.populacao)),
      fraca: 0,
    };
  };
  for (const molde of r.moldes) {
    const pool = atraidos(molde, turno.tipos, turno.grupos);
    const doMolde = antes.vivas.filter((o) => o.molde === molde.id);
    const total = doMolde.reduce((s, o) => s + o.gente, 0);
    for (const o of doMolde) {
      // Os atraídos se dividem entre as organizações do molde pela gente.
      const alvo =
        (total > 0 ? (pool * o.gente) / total : pool) *
        molde.adesao *
        (1 - Math.min(1, Math.max(0, turno.repressao)));
      let gente = o.gente + regra.ritmo * (alvo - o.gente);
      const fraca = pool < limiar ? o.fraca + 1 : 0;
      if (fraca >= regra.fim_turnos) {
        acontecidos.push({
          tipo: "acabou",
          organizacao: { ...o, gente, fraca },
        });
        continue;
      }
      if (turno.repressao > 0)
        for (const t of turno.tipos) {
          const p = atracao(molde, t);
          if (p > 0)
            revolta[t.id] =
              (revolta[t.id] ?? 0) + regra.revolta * turno.repressao * p;
        }
      const [u, prox] = sortear(a);
      a = prox;
      let racha: Organizacao | undefined;
      if (
        u <
        regra.inteligencia * Math.min(1, Math.max(0, turno.inteligencia))
      ) {
        gente /= 2;
        if (gente >= limiar * molde.adesao) {
          racha = nova(molde, gente / 2, o.lugar);
          gente /= 2;
        }
      }
      const nivel = nivelDa(
        regra,
        ameaca(regra, molde, gente, turno.populacao),
      );
      const atual = { ...o, gente, fraca, nivel };
      vivas.push(atual);
      if (NIVEIS.indexOf(nivel) > NIVEIS.indexOf(o.nivel))
        acontecidos.push({ tipo: "cresceu", organizacao: atual });
      if (racha) {
        vivas.push(racha);
        acontecidos.push({ tipo: "rachou", organizacao: racha });
      }
    }
    // Nasce depois de alguns turnos seguidos acima do limiar, sem sorte.
    const seguidos = pool >= limiar ? (antes.acima[molde.id] ?? 0) + 1 : 0;
    acima[molde.id] = seguidos;
    if (doMolde.length === 0 && seguidos >= regra.turnos_para_nascer) {
      const o = nova(
        molde,
        regra.ritmo * pool * molde.adesao,
        lugarDo(molde, turno),
      );
      vivas.push(o);
      acontecidos.push({ tipo: "nasceu", organizacao: o });
    }
  }
  // Pontos nos índices pela ameaça somada, até o teto.
  const porIndice: Record<string, number> = {};
  for (const o of vivas) {
    const molde = r.moldes.find((m) => m.id === o.molde);
    if (!molde) continue;
    const pct = ameaca(regra, molde, o.gente, turno.populacao) * 100;
    for (const [indice, ponto] of Object.entries(regra.indices))
      porIndice[indice] = (porIndice[indice] ?? 0) + pct * ponto;
  }
  const pontos = Object.fromEntries(
    Object.entries(regra.indices).map(([indice]) => [
      indice,
      Math.max(-regra.teto, Math.min(regra.teto, porIndice[indice] ?? 0)),
    ]),
  );
  return {
    organizacoes: { vivas, nomes, pontos, contador, acima },
    acaso: a,
    acontecidos,
    revolta,
  };
}

/** Por que os moldes não servem; null se servem. */
export function motivoOrganizacoesInvalidas(
  r: RegrasOrganizacoes,
  grupos: string[],
  indices: string[],
): string | null {
  const ids = new Set<string>();
  const temGrupo = new Set(grupos);
  const temIndice = new Set(indices);
  for (const m of r.moldes) {
    if (ids.has(m.id)) return `molde "${m.id}" repetido`;
    ids.add(m.id);
    if (!(m.adesao > 0 && m.adesao <= 1))
      return `molde "${m.id}": adesão entre 0 e 1`;
    if (!m.tipos.length || !m.ideias.length)
      return `molde "${m.id}": precisa de tipos e ideias para o nome`;
    for (const g of m.grupos ?? [])
      if (!temGrupo.has(g)) return `molde "${m.id}": grupo "${g}" não existe`;
  }
  for (const i of Object.keys(r.regra.indices))
    if (!temIndice.has(i)) return `índice "${i}" não existe`;
  const { relevante, grave, critica } = r.regra.niveis;
  if (!(relevante > 0 && grave > relevante && critica > grave))
    return "níveis precisam crescer: relevante < grave < crítica";
  if (!(r.regra.turnos_para_nascer >= 1)) return "turnos_para_nascer ≥ 1";
  for (const c of ["ritmo", "inteligencia"] as const)
    if (!(r.regra[c] >= 0 && r.regra[c] <= 1)) return `${c} entre 0 e 1`;
  return null;
}
