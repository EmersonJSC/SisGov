// Dados da tela inicial: o que o jogador vê antes de a partida existir (partidos,
// pessoas, caixas dos ministérios e perfis). Só leitura; nada aqui cria partida.
import moldesDeMinisterio from "../conteudo/mundo/ministerios/moldes.json";
import {
  carregarGrupos,
  elencoDoPais,
  ministrosDoComeco,
  type CongressoPais,
} from ".";
import { type ComecoDoJogador } from "./comeco";
import { arquivoPais } from "./paises";
import { perfilDaPessoa, type PerfilDePessoa } from "./perfil";
import type { Ficha } from "../motor";

/** Uma pessoa como a tela a mostra: ficha com o nome do partido de origem. */
export interface PessoaDaLista {
  id: string;
  nome: string;
  sexo: "f" | "m";
  idade: number;
  origem: string;
  origemNome: string;
  competencia: number;
  habilidade: number;
  carisma: number;
  honestidade: number;
  lealdade: number;
}

export interface PreparoDoComeco {
  partidos: { id: string; nome: string; cadeiras: number; cor: string }[];
  /** Partido que governava o país até agora. */
  governava: string;
  pessoas: PessoaDaLista[];
  caixas: { molde: string; nome: string }[];
}

const COR_PADRAO = "#8a8a8a";
const SEM_PARTIDO = "Sem partido";
const nomesDosMoldes = new Map(
  moldesDeMinisterio.moldes.map((m) => [m.id, m.nome]),
);

const congressoDe = (pais: string) =>
  arquivoPais<CongressoPais>(pais, "congresso");

function elencoDe(pais: string, semente: number): Ficha[] {
  return elencoDoPais(pais, semente, congressoDe(pais), carregarGrupos());
}

export function prepararComeco(pais: string, semente: number): PreparoDoComeco {
  const congresso = congressoDe(pais);
  const nomes = new Map(congresso.partidos.map((p) => [p.id, p.nome]));
  const { ministerios } = arquivoPais<{ ministerios: { molde: string }[] }>(
    pais,
    "governo",
  );
  return {
    partidos: congresso.partidos.map((p) => ({
      id: p.id,
      nome: p.nome,
      cadeiras: p.cadeiras,
      cor: p.cor ?? COR_PADRAO,
    })),
    governava: congresso.governo,
    pessoas: elencoDe(pais, semente).map((f) => ({
      id: f.id,
      nome: f.nome,
      sexo: f.sexo ?? "f",
      idade: f.idade ?? 50,
      origem: f.origem,
      origemNome: nomes.get(f.origem) ?? SEM_PARTIDO,
      competencia: f.competencia,
      habilidade: f.habilidade,
      carisma: f.carisma,
      honestidade: f.honestidade,
      lealdade: f.lealdade,
    })),
    caixas: ministerios.map(({ molde }) => ({
      molde,
      nome: nomesDosMoldes.get(molde) ?? molde,
    })),
  };
}

/** Perfil de rede de uma pessoa, para a tela mostrar ao clicar nela. */
export function perfilDeUmaPessoa(
  pais: string,
  semente: number,
  id: string,
): PerfilDePessoa | null {
  const elenco = elencoDe(pais, semente);
  const pessoa = elenco.find((f) => f.id === id);
  return pessoa ? perfilDaPessoa(pessoa, elenco) : null;
}

const PARTIDO_DE_PASSAGEM = { nome: "-", sigla: "-" };

/** Ministros que o jogo sortearia para esta chapa; `rodada` sorteia de novo. */
export function ministrosSugeridos(
  pais: string,
  semente: number,
  chapa: ComecoDoJogador["chapa"],
  rodada = 0,
): Record<string, string> {
  return ministrosDoComeco(
    semente + rodada * 7919,
    pais,
    elencoDe(pais, semente),
    congressoDe(pais),
    carregarGrupos(),
    { partido: PARTIDO_DE_PASSAGEM, chapa },
  );
}

/** Uma chapa para começar rápido: as três pessoas de maior carisma e honestidade. */
export function chapaSugerida(
  pais: string,
  semente: number,
): ComecoDoJogador["chapa"] {
  const [presidente, candidato, vice] = elencoDe(pais, semente)
    .sort((a, b) => b.carisma + b.honestidade - (a.carisma + a.honestidade))
    .slice(0, 3);
  return { presidente: presidente.id, candidato: candidato.id, vice: vice.id };
}
