import type { VariableDefinition } from "../../engine";
import type { EstruturaDeGoverno } from "../../game/ministerios";
import type { Resultado } from "./tipos";

/** Ministérios de cada país (D-64), pelo nome da pasta do país. */
export const ESTRUTURAS: Readonly<Record<string, EstruturaDeGoverno>> =
  Object.fromEntries(
    Object.entries(
      import.meta.glob<EstruturaDeGoverno>(
        "../../conteudo/paises/*/ministerios.json",
        { eager: true, import: "default" },
      ),
    ).map(([caminho, estrutura]) => [caminho.split("/").at(-2)!, estrutura]),
  );

/** Escala de desenho da bolha: a faixa visual, ou o domínio (SG159). */
export function escalaDe(variable: VariableDefinition) {
  return {
    minimo: variable.faixaVisual?.minimo ?? variable.dominio.minimo ?? 0,
    maximo: variable.faixaVisual?.maximo ?? variable.dominio.maximo ?? 100,
  };
}

export function falha<T>(
  diagnostics: readonly { message: string }[],
): Resultado<T> {
  return { ok: false, erros: diagnostics.map((item) => item.message) };
}
