import type { VariableDefinition } from "../../engine";
import type { EstruturaDeGoverno } from "../../game/ministerios";
import type { Resultado } from "./tipos";

/** Ministérios de cada país (D-64), pelo nome da pasta do país (V1-06). */
export const ESTRUTURAS: Readonly<Record<string, EstruturaDeGoverno>> =
  Object.fromEntries(
    Object.entries(
      import.meta.glob<{ ministerios?: EstruturaDeGoverno }>(
        "../../conteudo/paises/*/politica.json",
        { eager: true, import: "default" },
      ),
    ).flatMap(([caminho, politica]) =>
      politica.ministerios
        ? [[caminho.split("/").at(-2)!, politica.ministerios]]
        : [],
    ),
  );

/** Escala de desenho da bolha: a faixa visual, ou o domínio (SG159). */
export function escalaDe(variable: VariableDefinition) {
  return {
    minimo: variable.faixaVisual?.minimo ?? variable.dominio.minimo ?? 0,
    maximo: variable.faixaVisual?.maximo ?? variable.dominio.maximo ?? 100,
  };
}

export function falha<T>(
  diagnostics: readonly {
    message: string;
    code?: string;
    file?: string;
    field?: string;
  }[],
): Resultado<T> {
  return {
    ok: false,
    erros: diagnostics.map((item) =>
      item.code === "CAMPO_DESCONHECIDO" && item.file && item.field
        ? `${item.file} · ${item.field}: ${item.message}`
        : item.message,
    ),
  };
}
