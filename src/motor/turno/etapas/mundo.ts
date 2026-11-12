// Etapas do turno: mundo. Comportamento em turno.md.
import type { Estado } from "../../estado";
import { andarChoques, andarPrecos } from "../../mercado";
import {
  reputacao,
  segurancaExterna,
  andarOpinioes,
  posicaoDoPais,
} from "../../mundo";
import type { Etapa } from "../comum";
import type { Regras } from "../regras";
import { reacaoDasCestas } from "./jogabilidade";

/** A reputação é a média das opiniões, pesada pelo peso (motor/mundo). */
export function comReputacao(regras: Regras, estado: Estado): Estado {
  const { potencias, indiceReputacao } = regras;
  if (!potencias || !indiceReputacao) return estado;
  const { min, max } = regras.dominios[indiceReputacao];
  const dasCestas = reacaoDasCestas(regras, estado)[indiceReputacao] ?? 0;
  const rep = Math.min(
    max,
    Math.max(
      min,
      reputacao(potencias, estado.opinioes) +
        dasCestas +
        (estado.atendimento?.reputacao ?? 0),
    ),
  );
  const jogabilidade = { ...estado.jogabilidade, [indiceReputacao]: rep };
  const { indicePoderDefensivo: poder, indiceSegurancaExterna: seguranca } =
    regras;
  if (poder && seguranca)
    jogabilidade[seguranca] = segurancaExterna(jogabilidade[poder], rep);
  return { ...estado, jogabilidade };
}
/** 7b. Mundo: cada potência anda a opinião rumo à desejada (motor/mundo). */
export const mundo: Etapa = (regras, estado) => {
  if (!regras.potencias) return estado;
  const opinioes = andarOpinioes(
    regras.potencias,
    estado.opinioes,
    posicaoDoPais(regras.leis, estado.leis),
  );
  return comReputacao(regras, { ...estado, opinioes });
};
/** 7c. Preço do mundo anda rumo ao que a oferta pede (motor/mercado). */
export const precosDoMundo: Etapa = (regras, estado) => {
  if (!regras.mercado) return estado;
  const { mercado, producao } = regras.mercado;
  const choques = andarChoques(mercado, estado.choques, estado.turno);
  return {
    ...estado,
    choques,
    precos: andarPrecos(
      mercado,
      producao,
      estado.precos,
      estado.turno,
      choques,
    ),
  };
};
