// Etapas do turno: politica. Comportamento em turno.md.
import { DESGASTE_POR_TURNO } from "../../eleicao";
import { novoFato, type Fato } from "../../fatos";
import {
  esfriarEEsquentar,
  iniciarCongresso,
  satisfacaoDoPartido,
  type Partido,
} from "../../politica";
import type { Etapa } from "../comum";
import type { Regras } from "../regras";

/**
 * 9. Política: a base olha os seus grupos (passo 8) e o desgaste sobe. A
 * eleição é a etapa seguinte.
 */
export const politica: Etapa = (regras, estado) => {
  const base = regras.congresso
    ? esfriarEEsquentar(
        regras.congresso,
        estado.congresso ??
          iniciarCongresso(regras.congresso, estado.coligacao),
        estado.coligacao,
        (id) =>
          satisfacaoDoPartido(
            (
              regras.congresso as NonNullable<Regras["congresso"]>
            ).partidos.find((p) => p.id === id) as Partido,
            estado.grupos,
          ),
        estado.turno,
      )
    : null;
  const coligacao = base ? base.coligacao : estado.coligacao;
  const desgaste = estado.desgaste + DESGASTE_POR_TURNO;
  const fatos = [
    ...(estado.fatos ?? []),
    ...(base ? base.fatos : []),
    ...fatosDaBase(estado.turno, estado.coligacao, coligacao),
  ];
  const comDesgaste = {
    ...estado,
    coligacao,
    desgaste,
    fatos,
    ...(base ? { congresso: base.estado } : {}),
  };
  return comDesgaste;
};
/** Partido que saiu ou entrou na base vira fato. */
function fatosDaBase(turno: number, antes: string[], agora: string[]): Fato[] {
  return [
    ...antes
      .filter((p) => !agora.includes(p))
      .map((p) =>
        novoFato({
          tipo: "partido-saiu-da-base",
          turno,
          tamanho: "grande",
          quem: [p],
        }),
      ),
    ...agora
      .filter((p) => !antes.includes(p))
      .map((p) =>
        novoFato({
          tipo: "partido-entrou-na-base",
          turno,
          tamanho: "medio",
          quem: [p],
        }),
      ),
  ];
}
