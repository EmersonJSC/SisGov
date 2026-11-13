// O começo do jogador: partido novo, chapa e ministros. O país continua como
// está; o partido que governava vira oposição, ou entra na coligação se o
// jogador quiser. Comportamento em partida.md (começo da partida).
import {
  bussolaDoPartido,
  bussolaMedia,
  comPartidoNovo,
  defendeDaBussola,
  tomarCadeiras,
  FRACAO_DE_ESTREIA,
  type Caixa,
  type Ficha,
  type Partido,
  type TipoGrupo,
} from "../motor";

const TECNICO = "tecnico";
/** Cor do partido do jogador: o latão da mesa. */
export const COR_DO_JOGADOR = "#d4af37";

/** O que o jogador decide na tela inicial. */
export interface ComecoDoJogador {
  partido: { nome: string; sigla: string };
  /** Ids das pessoas: presidente do partido, candidato a presidente e vice. */
  chapa: { presidente: string; candidato: string; vice: string };
  /** O partido que governava entra na coligação em vez de ficar na oposição. */
  coligarGoverno?: boolean;
  /** Os ministérios que o jogador montou; sem isto, ficam os do país. */
  caixas?: Omit<Caixa, "ministro">[];
  /** Quem ocupa cada caixa (id da caixa → pessoa); o que faltar é sorteado. */
  ministros?: Record<string, string>;
}

/** O que o Congresso do país tem de comum com a tela inicial. */
export interface BaseDoCongresso {
  governo: string;
  coligacao: string[];
  senado?: Record<string, number>;
  partidos: (Partido & { nome: string; cor?: string })[];
}

/** Id do partido do jogador: a sigla em minúsculas, sem acento nem espaço. */
export function idDoPartidoDoJogador(sigla: string): string {
  return sigla
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/** Motivo de o partido ou a chapa não servirem, ou nulo. */
export function motivoComecoInvalido(
  c: ComecoDoJogador,
  pessoas: Ficha[],
  idsDePartidos: string[],
): string | null {
  const { nome, sigla } = c.partido;
  if (nome.trim().length < 3) return "o partido precisa de um nome";
  const id = idDoPartidoDoJogador(sigla);
  if (id.length < 2 || id.length > 8)
    return "a sigla precisa ter de 2 a 8 letras ou números";
  if (idsDePartidos.includes(id))
    return `a sigla ${sigla} já é de outro partido`;
  const ids = Object.values(c.chapa);
  if (new Set(ids).size !== ids.length) return "a chapa repete uma pessoa";
  const existe = (x: string) => pessoas.some((p) => p.id === x);
  if (!ids.every(existe)) return "a chapa tem uma pessoa que não existe";
  const ministros = Object.values(c.ministros ?? {});
  if (new Set(ministros).size !== ministros.length)
    return "a mesma pessoa em duas caixas";
  if (!ministros.every(existe)) return "um ministro não existe";
  if (ministros.some((m) => ids.includes(m)))
    return "quem está na chapa não pode ser ministro";
  return null;
}

export const fichasDaChapa = (c: ComecoDoJogador, pessoas: Ficha[]): Ficha[] =>
  Object.values(c.chapa).map((id) => pessoas.find((p) => p.id === id) as Ficha);

/** Onde o governo se põe na bússola: a chapa, ou o partido que governa. */
export function centroDoGoverno(
  c: ComecoDoJogador | undefined,
  pessoas: Ficha[],
  congresso: BaseDoCongresso,
  grupos: TipoGrupo[],
) {
  if (c) return bussolaMedia(fichasDaChapa(c, pessoas));
  const governo = congresso.partidos.find((p) => p.id === congresso.governo);
  return bussolaDoPartido(governo?.defende ?? {}, grupos);
}

/** O Congresso com o partido do jogador governando. */
export function comPartidoDoJogador<C extends BaseDoCongresso>(
  congresso: C,
  c: ComecoDoJogador,
  pessoas: Ficha[],
  grupos: TipoGrupo[],
): C {
  const id = idDoPartidoDoJogador(c.partido.sigla);
  const chapa = fichasDaChapa(c, pessoas);
  const origens = [
    ...new Set(chapa.map((f) => f.origem).filter((o) => o !== TECNICO)),
  ];
  const defende = defendeDaBussola(bussolaMedia(chapa), grupos);
  const total = Object.values(congresso.senado ?? {}).reduce(
    (s, n) => s + n,
    0,
  );
  const senado = congresso.senado && {
    ...tomarCadeiras(
      congresso.senado,
      origens,
      Math.round(total * FRACAO_DE_ESTREIA),
    ),
  };
  const antes = congresso.senado ?? {};
  return {
    ...congresso,
    governo: id,
    coligacao: [
      ...new Set([
        id,
        ...origens,
        ...(c.coligarGoverno ? [congresso.governo] : []),
      ]),
    ],
    partidos: comPartidoNovo(
      congresso.partidos,
      { id, defende, nome: c.partido.nome, cor: COR_DO_JOGADOR },
      origens,
    ),
    ...(senado
      ? {
          senado: {
            ...senado,
            [id]: Object.keys(antes).reduce(
              (soma, k) => soma + antes[k] - (senado[k] ?? 0),
              0,
            ),
          },
        }
      : {}),
  };
}
