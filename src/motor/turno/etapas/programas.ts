// Etapas do turno: programas. Comportamento em turno.md.
import { ajusteDaLei } from "../../governo";
import { andarProgramas } from "../../programas";
import type { Etapa } from "../comum";

/**
 * 8c. Programas: as leis aprovadas até aqui formam ou desfazem programas; o
 * ministro mais fraco dá o passo (motor/programas).
 */
export const programas: Etapa = (regras, estado) => {
  if (!regras.programas || !estado.programas) return estado;
  const { governo } = regras;
  const caixas = estado.governo?.caixas;
  const saida = andarProgramas({
    regras: regras.programas,
    estado: estado.programas,
    leis: regras.leis,
    valores: estado.leis,
    tipos: regras.grupos,
    turno: estado.turno,
    mandato: estado.inicio_mandato,
    atrasoDaLei: (lei) =>
      governo && caixas
        ? ajusteDaLei(governo, caixas, lei).atraso
        : 0,
  });
  return {
    ...estado,
    programas: saida.estado,
    fatos: [...(estado.fatos ?? []), ...saida.fatos],
  };
};
