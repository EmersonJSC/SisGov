/**
 * Programas da prova real (V1-34, docs/v1/desenho/leis-de-todos-os-lados.md):
 * o que cada governo de referência aprovou ou manteve, lei por lei.
 */
import type { ResolvedPackage } from "../../engine";
import type { PolicyState } from "../leis/policyState";

export type LinhaDoPrograma = Readonly<{
  lei: string;
  opcao?: string;
  nivel?: number;
  como: string;
  fonte: string;
}>;

export type ProgramaDeGoverno = Readonly<{
  referencia: string;
  periodo: string;
  grupo: string;
  opostos: readonly string[];
  leis: readonly LinhaDoPrograma[];
}>;

/** Nível de uma linha no catálogo, ou undefined se a lei ou a opção não existe. */
export function nivelDaLinha(
  content: ResolvedPackage,
  linha: LinhaDoPrograma,
): number | undefined {
  const lei = content.policies.find((p) => p.id === linha.lei);
  if (!lei) return undefined;
  if (lei.controle.opcoes)
    return lei.controle.opcoes.find((o) => o.id === linha.opcao)?.valor;
  return linha.nivel;
}

/** Leis do país com o programa aplicado; lei fora de vigor entra decretada. */
export function aplicarPrograma(
  content: ResolvedPackage,
  policies: readonly PolicyState[],
  programa: ProgramaDeGoverno,
): PolicyState[] {
  const lista = [...policies];
  for (const linha of programa.leis) {
    const nivel = nivelDaLinha(content, linha);
    if (nivel === undefined)
      throw new Error(`Linha inválida no programa: ${linha.lei}.`);
    const i = lista.findIndex((s) => s.policyDefinitionId === linha.lei);
    const novo: PolicyState = {
      ...(i >= 0
        ? lista[i]
        : {
            id: `programa-${linha.lei}`,
            policyDefinitionId: linha.lei,
            origin: { kind: "decretada", turn: 0 },
            history: [],
          }),
      status: "vigente",
      legalStatus: "vigente",
      desiredLevel: nivel,
      implementedLevel: nivel,
    };
    if (i >= 0) lista[i] = novo;
    else lista.push(novo);
  }
  return lista;
}
