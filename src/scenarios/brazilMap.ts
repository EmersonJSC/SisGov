import type { VisualMapDefinition } from "../influenceLayout";
import type { ResolvedPackage } from "../engine";

/** Áreas das fichas agrupadas em regiões do mapa. Só apresentação. */
const macroAreas = [
  {
    id: "economia",
    name: "Economia, trabalho e tributos",
    color: "#2879bd",
    areas: [
      "Economia, finanças e comércio exterior",
      "Tributação",
      "Trabalho e emprego",
    ],
  },
  {
    id: "bem-estar",
    name: "Saúde, educação e proteção social",
    color: "#7456c7",
    areas: [
      "Saúde",
      "Educação, ciência e cultura",
      "Previdência e assistência social",
    ],
  },
  {
    id: "protecao",
    name: "Segurança, direitos e sociedade",
    color: "#db783c",
    areas: [
      "Segurança, justiça e drogas",
      "Direitos civis, costumes, imigração, mídia e defesa",
    ],
  },
  {
    id: "estado",
    name: "Instituições e Estado",
    color: "#b0476b",
    areas: ["Instituições, Estado e sistema político"],
  },
  {
    id: "territorio",
    name: "Território, energia e ambiente",
    color: "#23956f",
    areas: ["Meio ambiente, energia, agro e infraestrutura"],
  },
] as const;

/** Regiões e ministérios do mapa, lidos das leis do pacote. Só apresentação. */
export function brazilVisualMap(content: ResolvedPackage): VisualMapDefinition {
  const macroOf = (area: string | undefined) =>
    macroAreas.find((macro) =>
      (macro.areas as readonly string[]).includes(area ?? ""),
    )?.id ?? "estado";
  const ministries = new Map<string, string>();
  for (const policy of content.policies) {
    const name = policy.ministerio ?? policy.area ?? "Outras";
    if (!ministries.has(name)) ministries.set(name, macroOf(policy.area));
  }
  return {
    seed: 2026,
    governmentName: "Governo Federal",
    macroAreas,
    ministries: [...ministries].map(([name, macroAreaId]) => ({
      name,
      macroAreaId,
      abbreviation: name.replace("Ministério d", "M. d"),
      minimumRadius: 9,
    })),
  };
}
