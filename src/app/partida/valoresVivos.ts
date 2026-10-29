import type { EleitoradoComBolso } from "./bolso";

/**
 * Os valores do eleitorado (População, camada C): o que muda no país desde o
 * turno 0 empurra o peso dos perfis entre progressista, centro e
 * conservador, uma faixa por vez.
 *
 * É leitura, como a renda pela sobra: a faixa muda no censo, não na eleição
 * nem na satisfação. Não guarda estado: compara os indicadores de agora com
 * os do turno 0, que a partida guarda em `valoresIniciais`.
 *
 * A pressão é a soma de `peso × variação / 100` dos indicadores listados em
 * `mudancaDeValores.empurroes`. Positiva, empurra para a última faixa do
 * atributo; negativa, para a primeira. Uma fração `forca × |pressão|` (até 1)
 * do peso de cada perfil passa à faixa vizinha.
 */

/** Os indicadores chegam em pontos de 0 a 100. */
const ESCALA = 100;

type Valores = Readonly<Record<string, number>>;

/** Pressão sobre os valores, de agora contra o início. */
function pressao(
  empurroes: Readonly<Record<string, number>>,
  valores: Valores,
  valoresIniciais: Valores,
): number {
  return Object.entries(empurroes).reduce((soma, [id, peso]) => {
    const agora = valores[id];
    const antes = valoresIniciais[id];
    return Number.isFinite(agora) && Number.isFinite(antes)
      ? soma + (peso * (agora - antes)) / ESCALA
      : soma;
  }, 0);
}

/**
 * O eleitorado com os valores movidos pela pressão do país. As linhas novas
 * vêm no fim, com o bolso de quem as originou (é a mesma pessoa). Sem
 * configuração, sem o início ou sem pressão, devolve o eleitorado como está.
 */
export function eleitoradoComValoresVivos(
  eleitorado: EleitoradoComBolso | undefined,
  valores: Valores,
  valoresIniciais: Valores | undefined,
): EleitoradoComBolso | undefined {
  const config = eleitorado?.manifesto.mudancaDeValores;
  if (!eleitorado || !config || !valoresIniciais) return eleitorado;
  const { manifesto, bolsos } = eleitorado;
  const faixas = manifesto.valores[config.atributo] ?? [];
  const coluna = manifesto.atributos.indexOf(config.atributo) + 1;
  const empurrao = pressao(config.empurroes, valores, valoresIniciais);
  const fracao = Math.min(1, config.forca * Math.abs(empurrao));
  if (coluna === 0 || !(fracao > 0)) return eleitorado;

  const passo = empurrao > 0 ? 1 : -1;
  const perfis: number[][] = manifesto.perfis.map((p) => [...p]);
  const novos: { linha: number[]; bolso: (typeof bolsos)[number] }[] = [];
  manifesto.perfis.forEach((p, i) => {
    const bolso = bolsos[i];
    const vizinha = p[coluna] + passo;
    if (!bolso || !(vizinha >= 0 && vizinha < faixas.length)) return;
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
