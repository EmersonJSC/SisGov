/**
 * Chapa e ministérios (M8.3): o vice e um ministro por área do governo.
 * As opções saem do mesmo gerador de pessoas dos candidatos; o sorteio de
 * ministros parte do ponto médio da chapa (presidente e vice), por dentro,
 * sem rótulo na tela.
 */
import { distancia, type PontoDaBussola } from "../bussola";
import {
  criarSorte,
  embaralhar,
  gerarPessoas,
  type Sorte,
} from "./personagens";
import type { EleicaoDoPais, MundoDosPersonagens, Personagem } from "./tipos";

type PoliticaDoPais = Readonly<{
  ministerios?: Readonly<{
    areas: readonly Readonly<{
      id: string;
      titulo: string;
      curto: string;
      coordenador: string;
    }>[];
    ministerios: readonly Readonly<{ id: string; cargo: string }>[];
  }>;
}>;

const POLITICAS: Readonly<Record<string, PoliticaDoPais>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<PoliticaDoPais>("../../conteudo/paises/*/politica.json", {
      eager: true,
      import: "default",
    }),
  ).map(([caminho, dados]) => [caminho.split("/").at(-2)!, dados]),
);

/** Uma área do governo: a bolha, com o cargo do ministro no centro dela. */
export type AreaDoGoverno = Readonly<{
  id: string;
  titulo: string;
  /** Cargo de quem a comanda ("Fazenda"). */
  cargo: string;
}>;

export function areasDoGoverno(pais: string): readonly AreaDoGoverno[] {
  const m = POLITICAS[pais]?.ministerios;
  if (!m) return [];
  return m.areas.map((a) => ({
    id: a.id,
    titulo: a.titulo,
    cargo: m.ministerios.find((x) => x.id === a.coordenador)?.cargo ?? a.curto,
  }));
}

/** Quem pode ser vice e quem pode ocupar cada área. */
export type OpcoesDaChapa = Readonly<{
  vices: readonly Personagem[];
  ministros: Readonly<Record<string, readonly Personagem[]>>;
}>;

export const VICES_POR_ESCOLHA = 4;
export const MINISTROS_POR_AREA = 3;

/**
 * Os nomes da tela de chapa. Sorte à parte da escolha de candidatos, para
 * não deslocá-la; o id leva um prefixo porque o gerador numera por sorte.
 */
export function opcoesDaChapa(
  mundo: MundoDosPersonagens,
  pais: EleicaoDoPais,
  areas: readonly AreaDoGoverno[],
  semente: number,
  rodada = 0,
): OpcoesDaChapa {
  const sorte = criarSorte(semente * 104729 + 31 + rodada * 7907);
  const todos = gerarPessoas(
    mundo,
    pais,
    sorte,
    "ministro",
    VICES_POR_ESCOLHA + areas.length * MINISTROS_POR_AREA,
  );
  const vices = todos.slice(0, VICES_POR_ESCOLHA).map((p, i) => ({
    ...p,
    id: `vice-${rodada}-${i}`,
    papel: "vice" as const,
  }));
  const ministros: Record<string, Personagem[]> = {};
  areas.forEach((area, a) => {
    const de = VICES_POR_ESCOLHA + a * MINISTROS_POR_AREA;
    ministros[area.id] = todos
      .slice(de, de + MINISTROS_POR_AREA)
      .map((p, i) => ({ ...p, id: `min-${rodada}-${area.id}-${i}` }));
  });
  return { vices, ministros };
}

/** O ponto médio da chapa: a média dos pontos do presidente e do vice. */
export function pontoDaChapa(
  presidente: Personagem,
  vice?: Personagem,
): PontoDaBussola {
  if (!vice) return presidente.ponto;
  return {
    economia: (presidente.ponto.economia + vice.ponto.economia) / 2,
    costumes: (presidente.ponto.costumes + vice.ponto.costumes) / 2,
  };
}

/** Parte dos ministros que sai perto da chapa; o resto é cota de coalizão. */
export const BASE_DO_GOVERNO = 2 / 3;

/**
 * Um ministro por área: com chance de dois terços o mais perto da chapa,
 * senão um dos outros (o ministro que o governo cede à coalizão).
 */
export function sortearMinistros(
  opcoes: OpcoesDaChapa,
  chapa: PontoDaBussola,
  sorte: Sorte,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(opcoes.ministros).flatMap(([area, lista]) => {
      if (lista.length === 0) return [];
      const porPerto = [...lista].sort(
        (a, b) => distancia(a.ponto, chapa) - distancia(b.ponto, chapa),
      );
      const [perto, ...fora] = porPerto;
      const escolhido =
        fora.length === 0 || sorte.numero() < BASE_DO_GOVERNO
          ? perto
          : embaralhar(sorte, fora)[0];
      return [[area, escolhido.id]];
    }),
  );
}

/** O ministro de cada área, a partir dos ids escolhidos nas opções. */
export function ministrosEscolhidos(
  opcoes: OpcoesDaChapa,
  ids: Readonly<Record<string, string>>,
): Readonly<Record<string, Personagem>> {
  return Object.fromEntries(
    Object.entries(ids).flatMap(([area, id]) => {
      const p = opcoes.ministros[area]?.find((x) => x.id === id);
      return p ? [[area, p]] : [];
    }),
  );
}
