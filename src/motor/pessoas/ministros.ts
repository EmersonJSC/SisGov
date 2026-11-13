// Ministros sorteados: cada caixa fica com quem tem competência e está perto
// da bússola da chapa; a chapa em si e quem já foi escolhido não entram.
import type { Ficha } from "../governo";
import { EIXOS, type PontoBussola } from "../leis";
import { fonteDeSorteio } from "./gerar";
import type { VagaDeMinistro } from "./tipos";

/** Peso da afinidade com a chapa e do acaso na nota de cada candidato. */
const PESO_DA_AFINIDADE = 0.8;
const PESO_DO_ACASO = 0.3;
const DISTANCIA_MAXIMA = Math.sqrt(EIXOS.length * 4);

/** Distância entre dois pontos da bússola, de 0 a 1. */
export function distanciaNaBussola(a: PontoBussola, b: PontoBussola): number {
  const soma = EIXOS.reduce(
    (total, eixo) => total + ((a[eixo] ?? 0) - (b[eixo] ?? 0)) ** 2,
    0,
  );
  return Math.sqrt(soma) / DISTANCIA_MAXIMA;
}

/** Posição média de um grupo de pessoas. */
export function bussolaMedia(fichas: Ficha[]): PontoBussola {
  return Object.fromEntries(
    EIXOS.map((eixo) => [
      eixo,
      fichas.length === 0
        ? 0
        : Math.round(
            (fichas.reduce((soma, f) => soma + (f.bussola[eixo] ?? 0), 0) /
              fichas.length) *
              100,
          ) / 100,
    ]),
  );
}

/**
 * Quem ocupa cada caixa. `escolhidos` manda: o que o jogador pôs fica, o resto
 * é sorteado entre as pessoas livres, na ordem das caixas.
 */
export function sortearMinistros(
  semente: number,
  vagas: VagaDeMinistro[],
  pessoas: Ficha[],
  centro: PontoBussola,
  escolhidos: Record<string, string>,
  fora: string[],
): Record<string, string> {
  const s = fonteDeSorteio(semente);
  const ocupados = new Set([...fora, ...Object.values(escolhidos)]);
  return vagas.reduce<Record<string, string>>((resultado, vaga) => {
    if (escolhidos[vaga.id])
      return { ...resultado, ...{ [vaga.id]: escolhidos[vaga.id] } };
    const nota = (f: Ficha) =>
      f.competencia / 100 +
      PESO_DA_AFINIDADE * (1 - distanciaNaBussola(f.bussola, centro)) +
      PESO_DO_ACASO * s.unico();
    const livres = pessoas.filter((f) => !ocupados.has(f.id));
    const melhor = livres.reduce((a, b) => (nota(b) > nota(a) ? b : a));
    ocupados.add(melhor.id);
    return { ...resultado, [vaga.id]: melhor.id };
  }, {});
}
