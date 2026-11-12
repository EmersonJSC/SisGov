// Etapas do turno: jogabilidade. Comportamento em turno.md.
import { andarDerivas } from "../../deriva";
import { somaPorIndice } from "../../efeitos";
import type { Estado } from "../../estado";
import {
  contaDoPais,
  segurancaDaCesta,
  reacaoDaCesta,
  reacaoCivil,
} from "../../mercado";
import type { Etapa } from "../comum";
import type { Regras } from "../regras";
import { situacoesDeCapacidade } from "./economia";

/** Cestas cujo índice o mundo declara (ex.: abastecimento, acesso a remédios). */
const cestasComIndice = (regras: Regras) =>
  (regras.mercado?.mercado.cestas ?? []).filter((c) => c.indice);
/**
 * Segurança média da população em cada cesta com índice, com os preços e a
 * renda de hoje (motor/mercado, fatias 6c e 6d).
 */
function indicesDasCestas(
  regras: Regras,
  estado: Estado,
): Record<string, number> {
  const cestas = cestasComIndice(regras);
  const m = regras.mercado;
  if (cestas.length === 0 || !m) return {};
  const conta = contaDoPais(
    m.mercado,
    m.producao,
    m.cobertura,
    m.populacaoBase,
    estado.essenciais.populacao,
    estado.precos,
  );
  const seguranca = segurancaDaCesta(m.mercado, conta, estado.pops);
  const indices: Record<string, number> = {};
  for (const cesta of cestas) {
    const media = seguranca.find((c) => c.id === cesta.id)?.media;
    if (cesta.indice && media !== undefined) indices[cesta.indice] = media;
  }
  return indices;
}
/**
 * Pontos que as cestas somam em outros índices (6c e 6d). Usa o índice do
 * turno anterior: o efeito chega com um turno de atraso.
 */
export function reacaoDasCestas(regras: Regras, estado: Estado) {
  const soma: Record<string, number> = {};
  for (const cesta of cestasComIndice(regras)) {
    const atual = cesta.indice && estado.jogabilidade[cesta.indice];
    const marco = cesta.indice && estado.marco.indices[cesta.indice];
    if (!cesta.reacao || atual === undefined || marco === undefined) continue;
    const pontos = reacaoDaCesta(cesta.reacao, Number(atual) - Number(marco));
    for (const [id, v] of Object.entries(pontos))
      soma[id] = (soma[id] ?? 0) + v;
  }
  // Falta de capacidade que chega aos civis (ex.: apagão em crise grave).
  for (const { capacidade, situacao } of situacoesDeCapacidade(regras, estado))
    for (const [id, v] of Object.entries(reacaoCivil(capacidade, situacao)))
      soma[id] = (soma[id] ?? 0) + v;
  return soma;
}
export function jogabilidade(regras: Regras, estado: Estado) {
  const soma = somaPorIndice(estado.efeitos);
  const cestas = reacaoDasCestas(regras, estado);
  const indices: Record<string, number> = {};
  for (const [id, base] of Object.entries(estado.base)) {
    const { min, max } = regras.dominios[id];
    indices[id] = Math.min(
      max,
      Math.max(min, base + (soma[id] ?? 0) + (cestas[id] ?? 0)),
    );
  }
  // Os índices das cestas não têm base: são calculados no passo 8 e passam adiante.
  for (const { indice } of cestasComIndice(regras))
    if (indice && indice in estado.jogabilidade)
      indices[indice] = estado.jogabilidade[indice];
  return indices;
}
/** 7. Índices de jogabilidade: base do país + contribuições das leis; a deriva move a base. */
export const indicesJogabilidade: Etapa = (regras, estado) => {
  const base = regras.derivas
    ? andarDerivas(
        regras.derivas,
        estado.base,
        todosIndices(estado),
        estado.marco.indices,
        somaPorIndice(estado.efeitos),
        regras.dominios,
      )
    : estado.base;
  const comBase = { ...estado, base };
  return { ...comBase, jogabilidade: jogabilidade(regras, comBase) };
};
/** Essenciais e jogabilidade num mapa só, para os grupos. */
export const todosIndices = (estado: Estado): Record<string, number> => ({
  ...estado.essenciais,
  ...estado.jogabilidade,
});
/** Índices das cestas de hoje no estado, para os grupos e o turno seguinte. */
export function comIndicesDasCestas(regras: Regras, estado: Estado): Estado {
  const indices = indicesDasCestas(regras, estado);
  if (Object.keys(indices).length === 0) return estado;
  return { ...estado, jogabilidade: { ...estado.jogabilidade, ...indices } };
}
