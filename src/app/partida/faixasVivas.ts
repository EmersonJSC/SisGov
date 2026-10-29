import type { CongressManifest } from "../../engine/model/contentTypes";
import type { EleitoradoComBolso } from "./bolso";

/**
 * As faixas vivas do eleitorado (População, camada C): o que muda no país
 * desde o turno 0 empurra o peso dos perfis de uma faixa para outra — hoje os
 * valores (progressista, centro, conservador) e a religião.
 *
 * É leitura, como a renda pela sobra: a faixa muda no censo, não na eleição
 * nem na satisfação. Não guarda estado: compara os indicadores de agora com
 * os do turno 0, que a partida guarda em `valoresIniciais`.
 *
 * Cada fluxo de `mundo/populacao.json` liga duas faixas. A pressão é a soma
 * de `peso × variação / 100` dos seus indicadores; positiva, uma fração
 * `forca × pressão` (até 1) do peso de `de` passa para `para`; negativa, o
 * contrário. Os fluxos do mesmo atributo valem juntos sobre o eleitorado de
 * antes: quem acabou de chegar numa faixa não segue viagem no mesmo turno.
 */

/** Os indicadores chegam em pontos de 0 a 100. */
const ESCALA = 100;

type Valores = Readonly<Record<string, number>>;
type Fluxo = NonNullable<CongressManifest["mudancas"]>[number];
type Linha = { linha: number[]; bolso: EleitoradoComBolso["bolsos"][number] };

/** Pressão do fluxo sobre as faixas, de agora contra o início. */
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

/** Move o peso de um atributo conforme os fluxos dele, todos sobre o mesmo eleitorado. */
function mover(
  { manifesto, bolsos }: EleitoradoComBolso,
  atributo: string,
  fluxos: readonly Fluxo[],
  valores: Valores,
  valoresIniciais: Valores,
): EleitoradoComBolso {
  const faixas = manifesto.valores[atributo] ?? [];
  const coluna = manifesto.atributos.indexOf(atributo) + 1;
  // Cada fluxo com pressão vira "sai da faixa X, vai para Y, esta fração".
  const saidas = fluxos.flatMap((f) => {
    const p = pressao(f.empurroes, valores, valoresIniciais);
    const fracao = Math.min(1, f.forca * Math.abs(p));
    const [de, para] = p > 0 ? [f.de, f.para] : [f.para, f.de];
    return fracao > 0
      ? [{ de: faixas.indexOf(de), para: faixas.indexOf(para), fracao }]
      : [];
  });
  if (coluna === 0 || saidas.length === 0) return { manifesto, bolsos };

  const perfis: number[][] = manifesto.perfis.map((p) => [...p]);
  const novos: Linha[] = [];
  manifesto.perfis.forEach((p, i) => {
    const bolso = bolsos[i];
    const daqui = saidas.filter((s) => s.de === p[coluna] && s.para >= 0);
    if (!bolso || daqui.length === 0) return;
    // Quem sai de uma faixa por vários fluxos nunca passa de tudo.
    const soma = daqui.reduce((t, s) => t + s.fracao, 0);
    const ajuste = soma > 1 ? 1 / soma : 1;
    perfis[i][0] = p[0] * (1 - Math.min(1, soma));
    daqui.forEach((s) =>
      novos.push({
        linha: p.map(
          (v, j) => ({ 0: p[0] * s.fracao * ajuste, [coluna]: s.para })[j] ?? v,
        ),
        bolso,
      }),
    );
  });
  return {
    manifesto: {
      ...manifesto,
      perfis: [...perfis, ...novos.map((n) => n.linha)],
    },
    bolsos: [...bolsos, ...novos.map((n) => n.bolso)],
  };
}

/**
 * O eleitorado com as faixas movidas pela pressão do país. As linhas novas
 * vêm no fim, com o bolso de quem as originou (é a mesma pessoa). Sem
 * configuração, sem o início ou sem pressão, devolve o eleitorado como está.
 */
export function eleitoradoComFaixasVivas(
  eleitorado: EleitoradoComBolso | undefined,
  valores: Valores,
  valoresIniciais: Valores | undefined,
): EleitoradoComBolso | undefined {
  const mudancas = eleitorado?.manifesto.mudancas;
  if (!eleitorado || !mudancas || !valoresIniciais) return eleitorado;
  const atributos = [...new Set(mudancas.map((m) => m.atributo))];
  return atributos.reduce(
    (acc, atributo) =>
      mover(
        acc,
        atributo,
        mudancas.filter((m) => m.atributo === atributo),
        valores,
        valoresIniciais,
      ),
    eleitorado,
  );
}
