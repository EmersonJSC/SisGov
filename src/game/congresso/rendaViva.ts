import type { ResolvedPackage } from "../../engine";
import { bolsosDoEleitorado, type EleitoradoComBolso } from "./bolso";
import type { MemoriaDaPopulacao } from "./memoria";

/**
 * A renda pela sobra (População, camada C): quem passa a sobrar mais que o
 * país sobe de faixa de renda; quem sobra menos desce.
 *
 * É leitura (mecânica 2.7): a faixa muda no censo, não na eleição nem na
 * satisfação. Não guarda estado: compara a sobra de agora com a do turno 0,
 * que a partida guarda em `valoresIniciais`.
 *
 * A posição é relativa — a sobra do perfil em salários médios —, então um
 * país que cresce inteiro não promove ninguém. O passo é uma faixa por vez: o
 * perfil move a fração `|mudança| / distância entre as faixas` do seu peso
 * para a vizinha, e a distância é a que as faixas tinham no início.
 */

/** Com menos de duas faixas não há para onde subir. */
const MENOS_FAIXAS = 2;

/** Uma linha do eleitorado é o perfil menos o peso. */
const chaveDe = (perfil: readonly number[]): string =>
  perfil.slice(1).join(",");

/** O eleitorado do início e o bolso dele, uma vez por conjunto de valores. */
const inicios = new WeakMap<object, EleitoradoComBolso | undefined>();

function doInicio(
  content: ResolvedPackage,
  valoresIniciais: Readonly<Record<string, number>>,
): EleitoradoComBolso | undefined {
  if (!inicios.has(valoresIniciais))
    inicios.set(valoresIniciais, bolsosDoEleitorado(content, valoresIniciais));
  return inicios.get(valoresIniciais);
}

/**
 * Sobra de cada linha em salários médios do país. O salário médio é a régua
 * porque o país que cresce ou encolhe inteiro não promove nem rebaixa
 * ninguém, e a composição (mais desempregados) não a mexe.
 */
function posicoes(
  { manifesto, bolsos }: EleitoradoComBolso,
  salarioMedio: number | undefined,
): ReadonlyMap<string, number> | undefined {
  if (!(salarioMedio && salarioMedio > 0)) return undefined;
  return new Map(
    manifesto.perfis.map((p, i) => [
      chaveDe(p),
      (bolsos[i]?.sobra ?? 0) / salarioMedio,
    ]),
  );
}

/**
 * O eleitorado de agora com a renda movida pela sobra, e o bolso de cada
 * linha na mesma ordem. As linhas novas vêm no fim: são a parte do perfil que
 * mudou de faixa, com o mesmo bolso de quem a originou (é a mesma pessoa).
 * Sem o início, sem tabela de renda ou sem salário médio, devolve o
 * eleitorado como está.
 */
export function eleitoradoComRendaViva(
  content: ResolvedPackage,
  valores: Readonly<Record<string, number>>,
  valoresIniciais: Readonly<Record<string, number>> | undefined,
  memoria?: MemoriaDaPopulacao,
): EleitoradoComBolso | undefined {
  const agora = bolsosDoEleitorado(content, valores, memoria);
  if (!agora || !valoresIniciais) return agora;
  const inicio = doInicio(content, valoresIniciais);
  const { manifesto, bolsos } = agora;
  const faixas = manifesto.valores.renda ?? [];
  const coluna = manifesto.atributos.indexOf("renda") + 1;
  const antes = inicio && posicoes(inicio, valoresIniciais.salario_medio);
  const depois = posicoes(agora, valores.salario_medio);
  if (
    !inicio ||
    !antes ||
    !depois ||
    coluna === 0 ||
    faixas.length < MENOS_FAIXAS
  )
    return agora;

  // A distância entre faixas vizinhas, no início: a média de cada faixa.
  const soma = inicio.manifesto.perfis.reduce(
    (acc, p) => {
      const x = antes.get(chaveDe(p));
      if (x === undefined || !acc[p[coluna]]) return acc;
      acc[p[coluna]].peso += p[0];
      acc[p[coluna]].posicao += p[0] * x;
      return acc;
    },
    faixas.map(() => ({ peso: 0, posicao: 0 })),
  );
  const media = soma.map((s) => (s.peso > 0 ? s.posicao / s.peso : 0));
  const distancia = (de: number, para: number): number =>
    Math.abs((media[para] ?? 0) - (media[de] ?? 0));

  const perfis: number[][] = manifesto.perfis.map((p) => [...p]);
  const novos: { linha: number[]; bolso: (typeof bolsos)[number] }[] = [];
  manifesto.perfis.forEach((p, i) => {
    const chave = chaveDe(p);
    const a = antes.get(chave);
    const d = depois.get(chave);
    const bolso = bolsos[i];
    if (a === undefined || d === undefined || !bolso) return;
    const vizinha = p[coluna] + (d > a ? 1 : -1);
    if (!(vizinha >= 0 && vizinha < faixas.length)) return;
    const passo = distancia(p[coluna], vizinha);
    if (!(passo > 0)) return;
    const fracao = Math.min(1, Math.abs(d - a) / passo);
    if (!(fracao > 0)) return;
    perfis[i][0] = p[0] * (1 - fracao);
    novos.push({
      linha: p.map((v, j) => ({ 0: p[0] * fracao, [coluna]: vizinha })[j] ?? v),
      bolso,
    });
  });
  return {
    manifesto: {
      ...manifesto,
      perfis: [...perfis, ...novos.map((n) => n.linha)],
    },
    bolsos: [...bolsos, ...novos.map((n) => n.bolso)],
  };
}
