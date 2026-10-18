export type RegistroDeContraparte = Readonly<{
  problemaEquivalente: string;
  leiBaseId: string;
  leiContraparteId: string;
  nome: string;
  pais: string;
  fonte: string;
  fonteDaContraparte: string;
  regraDaLeiBase: "provisao-estatal-exclusiva";
  regraDaContraparte: "provedores-independentes-permitidos";
  tipoRelacao: "excludente";
  justificativa: string;
}>;

/** Pares pesquisados que o gerador deve incluir como alternativas excludentes. */
export const contrapartesPesquisadas: readonly RegistroDeContraparte[] = [
  {
    problemaEquivalente: "regime-de-provisao-escolar",
    leiBaseId: "provisao-publica-exclusiva",
    leiContraparteId: "escolha-escolar-financiada",
    nome: "Provisão escolar estatal exclusiva e autorização de escolas independentes",
    pais: "Cuba e Suécia",
    fonte:
      "https://siteal.iiep.unesco.org/sites/default/files/sit_accion_files/ley_de_nacionalizacion_de_la_educacion.pdf",
    fonteDaContraparte:
      "https://www.skolverket.se/styrning-och-ansvar/regler-och-ansvar/ansvar-i-skolfragor/valja-forskoleklass-och-grundskola-eller-anpassad-grundskola",
    regraDaLeiBase: "provisao-estatal-exclusiva",
    regraDaContraparte: "provedores-independentes-permitidos",
    tipoRelacao: "excludente",
    justificativa:
      "A lei cubana de 1961 atribui a provisão do ensino ao Estado e nacionaliza centros privados, com exceções no artigo 5º. A regra sueca autoriza escolas independentes financiadas publicamente. As direções se opõem na permissão de provedores independentes.",
  },
];

export function auditarLeisExcludentes(leiIds: readonly string[]) {
  const presentes = new Set(leiIds);
  return contrapartesPesquisadas.map((pair) => ({
    ...pair,
    leiBaseGerada: presentes.has(pair.leiBaseId),
    leiContraparteGerada: presentes.has(pair.leiContraparteId),
    ambasGeradas:
      presentes.has(pair.leiBaseId) && presentes.has(pair.leiContraparteId),
    regrasDeProvisaoIncompativeis:
      pair.regraDaLeiBase === "provisao-estatal-exclusiva" &&
      pair.regraDaContraparte === "provedores-independentes-permitidos",
    posicaoNaBussola: "pendente-de-fundamentacao" as const,
  }));
}

export function validarParesExcludentes(
  registros: readonly RegistroDeContraparte[],
): string[] {
  const erros: string[] = [];
  const ids = new Set<string>();
  for (const registro of registros) {
    if (ids.has(registro.leiContraparteId))
      erros.push(`Contraparte duplicada: ${registro.leiContraparteId}`);
    ids.add(registro.leiContraparteId);
    if (!/^https:\/\//.test(registro.fonte))
      erros.push(`Contraparte sem fonte: ${registro.leiContraparteId}`);
    if (!/^https:\/\//.test(registro.fonteDaContraparte))
      erros.push(`Contraparte sem segunda fonte: ${registro.leiContraparteId}`);
    if (!registro.problemaEquivalente || !registro.justificativa)
      erros.push(
        `Contraparte sem equivalência explicada: ${registro.leiContraparteId}`,
      );
    if (
      registro.regraDaLeiBase !== "provisao-estatal-exclusiva" ||
      registro.regraDaContraparte !== "provedores-independentes-permitidos"
    )
      erros.push(
        `Contraparte sem oposição na regra de provisão: ${registro.leiContraparteId}`,
      );
  }
  return erros;
}
