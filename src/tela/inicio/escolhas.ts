// O que o jogador já escolheu na tela inicial e as regras de cada passo.
import {
  idDoPartidoDoJogador,
  type CaixaDoGabinete,
  type ComecoDoJogador,
  type PreparoDoComeco,
  type Tamanho,
} from "../../partida";

export const VAGAS = [
  { chave: "presidente", nome: "Presidente do partido" },
  { chave: "candidato", nome: "Candidato a presidente" },
  { chave: "vice", nome: "Vice" },
] as const;
export type Vaga = (typeof VAGAS)[number]["chave"];

export interface Escolhas {
  pais: string;
  semente: number;
  nome: string;
  sigla: string;
  chapa: Record<Vaga, string | null>;
  coligarGoverno: boolean;
  /** Quantas vezes o jogador pediu para sortear os ministros de novo. */
  rodada: number;
  /** Parada da régua do tamanho do governo. */
  tamanho: Tamanho;
  /** Ministérios que o jogador ajustou à mão; nulo: os da parada da régua. */
  caixas: CaixaDoGabinete[] | null;
  /** Caixas a que o jogador deu nome: não mudam de nome ao ganhar instituição. */
  renomeadas: string[];
  /** Ministros que o jogador pôs à mão, por caixa. */
  trocas: Record<string, string>;
  semCongresso: boolean;
  semSenado: boolean;
  semEleicao: boolean;
  comJudiciario: boolean;
}

export const ESCOLHAS_INICIAIS = (pais: string): Escolhas => ({
  pais,
  semente: 42,
  nome: "",
  sigla: "",
  chapa: { presidente: null, candidato: null, vice: null },
  coligarGoverno: false,
  rodada: 0,
  tamanho: "pais",
  caixas: null,
  renomeadas: [],
  trocas: {},
  semCongresso: false,
  semSenado: false,
  semEleicao: false,
  comJudiciario: false,
});

const NOME_MINIMO = 3;
const SIGLA_MINIMA = 2;
const SIGLA_MAXIMA = 8;

/** O que falta no partido, ou nulo se está certo. */
export function motivoDoPartido(
  e: Escolhas,
  partidos: PreparoDoComeco["partidos"],
): string | null {
  if (e.nome.trim().length < NOME_MINIMO) return "Dê um nome ao partido.";
  const id = idDoPartidoDoJogador(e.sigla);
  if (id.length < SIGLA_MINIMA || id.length > SIGLA_MAXIMA)
    return `A sigla leva de ${SIGLA_MINIMA} a ${SIGLA_MAXIMA} letras.`;
  if (partidos.some((p) => p.id === id))
    return "Essa sigla já é de outro partido.";
  return null;
}

export function chapaCompleta(e: Escolhas): ComecoDoJogador["chapa"] | null {
  const { presidente, candidato, vice } = e.chapa;
  return presidente && candidato && vice
    ? { presidente, candidato, vice }
    : null;
}

/**
 * Põe `pessoa` na caixa. Se ela já cuidava de outra, as duas trocam de lugar,
 * para ninguém ficar em duas caixas nem sobrar caixa sem ministro.
 */
export function trocarMinistro(
  atual: Record<string, string>,
  caixa: string,
  pessoa: string,
): Record<string, string> {
  const outra = Object.keys(atual).find((c) => atual[c] === pessoa);
  return {
    ...atual,
    [caixa]: pessoa,
    ...(outra ? { [outra]: atual[caixa] } : {}),
  };
}
