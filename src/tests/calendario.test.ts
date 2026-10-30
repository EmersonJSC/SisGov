import { describe, expect, it } from "vitest";
import {
  anoComFracao,
  ESCALA_DO_TURNO,
  turnosDoConteudo,
  dataDoMes,
  mesesAteOTurno,
  turnoDoMes,
  TURNOS_POR_ANO,
} from "../game/calendario";

describe("calendário da partida (mecânica 1)", () => {
  it("um turno são dois meses e um ano são seis turnos", () => {
    expect(mesesAteOTurno(0)).toBe(0);
    expect(mesesAteOTurno(24)).toBe(48);
    expect(turnoDoMes(0)).toBe(0);
    expect(turnoDoMes(1)).toBe(0);
    expect(turnoDoMes(2)).toBe(1);
    expect(TURNOS_POR_ANO).toBe(6);
  });

  it("conta a data a partir de janeiro do ano inicial", () => {
    expect(dataDoMes(2027, 0)).toEqual({ ano: 2027, mes: 1, trimestre: 1 });
    expect(dataDoMes(2027, 5)).toEqual({ ano: 2027, mes: 6, trimestre: 2 });
    expect(dataDoMes(2027, 11)).toEqual({ ano: 2027, mes: 12, trimestre: 4 });
    expect(dataDoMes(2027, 12)).toEqual({ ano: 2028, mes: 1, trimestre: 1 });
    expect(dataDoMes(2027, 47)).toEqual({ ano: 2030, mes: 12, trimestre: 4 });
  });

  it("o ano com fração bate com a conta de 1/6 de ano por turno", () => {
    for (const turno of [0, 1, 7, 24, 31])
      expect(anoComFracao(2027, mesesAteOTurno(turno))).toBeCloseTo(
        2027 + turno / 6,
        10,
      );
  });

  it("o conteúdo escrito em turnos de 3 meses vale o mesmo prazo corrido", () => {
    expect(turnosDoConteudo(4)).toBe(6);
    expect(turnosDoConteudo(2)).toBe(3);
    expect(turnosDoConteudo(1)).toBe(2);
    expect(ESCALA_DO_TURNO).toBeCloseTo(2 / 3, 10);
  });
});
