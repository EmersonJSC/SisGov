import type { VisualMapDefinition } from "../influenceLayout";
import type { ResolvedPackage, ScenarioGraph } from "../engine";
import { loadDistributedScenario } from "./loadScenarioPackage";

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

/** Um ministério por área das fichas (só apresentação; o motor ignora). */
const ministryByArea: Readonly<Record<string, string>> = {
  "Trabalho e emprego": "Ministério do Trabalho",
  Tributação: "Ministério da Fazenda",
  "Economia, finanças e comércio exterior": "Ministério do Desenvolvimento",
  Saúde: "Ministério da Saúde",
  "Educação, ciência e cultura": "Ministério da Educação",
  "Previdência e assistência social": "Ministério da Previdência",
  "Segurança, justiça e drogas": "Ministério da Justiça",
  "Direitos civis, costumes, imigração, mídia e defesa":
    "Ministério dos Direitos e da Defesa",
  "Instituições, Estado e sistema político": "Casa Civil",
  "Meio ambiente, energia, agro e infraestrutura":
    "Ministério do Meio Ambiente e Infraestrutura",
};

/** O mapa lê o pacote real do Brasil (mundo + país), sem dados de demonstração. */
export function createBrazilMap(): {
  content: ResolvedPackage;
  graph: ScenarioGraph;
  visualMap: VisualMapDefinition;
} {
  const loaded = loadDistributedScenario("paises/brasil/pais.json");
  if (!loaded.ok)
    throw new Error(loaded.diagnostics.map((issue) => issue.message).join(" "));
  const { definition: resolved, graph } = loaded.value;
  const content: ResolvedPackage = {
    ...resolved,
    policies: resolved.policies.map((policy) => ({
      ...policy,
      ministerio: ministryByArea[policy.area ?? ""] ?? policy.ministerio,
    })),
  };
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
    content,
    graph,
    visualMap: {
      seed: 2026,
      governmentName: "Governo Federal",
      macroAreas,
      ministries: [...ministries].map(([name, macroAreaId]) => ({
        name,
        macroAreaId,
        abbreviation: name.replace("Ministério d", "M. d"),
        minimumRadius: 9,
      })),
    },
  };
}
