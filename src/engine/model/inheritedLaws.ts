import type { InitialStateFile, PolicyFile } from "./contentTypes";

export type InheritedLawEntry = NonNullable<
  InitialStateFile["leisVigentes"]
>[number];

export type InheritedLawLevels =
  | { ok: true; desiredLevel: number; implementedLevel: number }
  | { ok: false; field: string; message: string };

/**
 * Converte uma entrada de `leisVigentes` do país nos níveis desejado e
 * implantado. Lei com opções usa `opcao` (o valor vem da definição da opção);
 * as demais usam `nivel`.
 */
export function resolveInheritedLawLevels(
  policy: PolicyFile,
  entry: InheritedLawEntry,
): InheritedLawLevels {
  const options = policy.controle.opcoes;
  if (options) {
    if (entry.opcao === undefined)
      return {
        ok: false,
        field: "opcao",
        message: `A lei ${policy.id} tem opções; o país deve informar opcao.`,
      };
    const option = options.find((item) => item.id === entry.opcao);
    if (!option)
      return {
        ok: false,
        field: "opcao",
        message: `Opção inexistente para a lei ${policy.id}: ${entry.opcao}.`,
      };
    return {
      ok: true,
      desiredLevel: option.valor,
      implementedLevel: entry.nivelImplantado ?? option.valor,
    };
  }
  if (entry.nivel === undefined)
    return {
      ok: false,
      field: "nivel",
      message: `A lei ${policy.id} não tem opções; o país deve informar nivel.`,
    };
  return {
    ok: true,
    desiredLevel: entry.nivel,
    implementedLevel: entry.nivelImplantado ?? entry.nivel,
  };
}
