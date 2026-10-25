import type { VariableDefinition } from "../model/contentTypes";

/** Retorna derivados em ordem de dependência, ou undefined quando há ciclo. */
export function orderDerivedVariables(
  variables: readonly VariableDefinition[],
): readonly VariableDefinition[] | undefined {
  const derived = variables.filter((v) => v.tipo === "derivado");
  const byId = new Map(derived.map((v) => [v.id, v]));
  const ordered: VariableDefinition[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (variable: VariableDefinition): boolean => {
    if (visited.has(variable.id)) return true;
    if (visiting.has(variable.id)) return false;
    visiting.add(variable.id);
    for (const term of variable.formula?.termos ?? [])
      for (const factor of term.fatores) {
        const dependency = byId.get(factor.var);
        if (dependency && !visit(dependency)) return false;
      }
    visiting.delete(variable.id);
    visited.add(variable.id);
    ordered.push(variable);
    return true;
  };
  for (const variable of derived) if (!visit(variable)) return undefined;
  return ordered;
}

export function calculateDerivedValue(
  variable: VariableDefinition,
  values: Readonly<Record<string, number>>,
): number | undefined {
  if (variable.tipo !== "derivado" || !variable.formula) return undefined;
  let total = 0;
  for (const term of variable.formula.termos) {
    let product = term.sinal;
    for (const factor of term.fatores) {
      const value = values[factor.var];
      if (value === undefined) return undefined;
      const scaled = value * (factor.escala ?? 1);
      product *= factor.complemento ? 1 - scaled : scaled;
    }
    total += product;
  }
  return Number.isFinite(total)
    ? Math.max(
        variable.dominio.minimo ?? -Infinity,
        Math.min(variable.dominio.maximo ?? Infinity, total),
      )
    : undefined;
}
