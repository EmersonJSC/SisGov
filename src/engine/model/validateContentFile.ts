import type {
  ContentDiagnostic,
  ValidationResult,
} from "../diagnostics/contentDiagnostic";
import {
  supportedMechanisms,
  policyTiers,
  type ConsequenceFile,
  type ContentFile,
  type InitialStateFile,
  type OccurrenceFile,
  type PolicyFile,
  type PolicyCatalogFile,
  type PoliticalOrganizationFile,
  type ScenarioManifest,
  type VariablesFile,
  type WorldFile,
} from "./contentTypes";

type JsonObject = Record<string, unknown>;

const policyTypes = new Set(["lei", "imposto", "programa", "regulamentacao"]);

function diagnostic(
  file: string,
  field: string,
  code: ContentDiagnostic["code"],
  message: string,
): ContentDiagnostic {
  return { code, file, field, message };
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateKnownFields(
  value: JsonObject,
  file: string,
  fields: readonly string[],
  diagnostics: ContentDiagnostic[],
): void {
  for (const field of Object.keys(value)) {
    if (!fields.includes(field)) {
      diagnostics.push(
        diagnostic(
          file,
          field,
          "CAMPO_DESCONHECIDO",
          "Campo não previsto neste formato.",
        ),
      );
    }
  }
}

function requiredString(
  value: JsonObject,
  file: string,
  field: string,
  diagnostics: ContentDiagnostic[],
): string | undefined {
  const candidate = value[field.slice(field.lastIndexOf(".") + 1)];
  if (typeof candidate !== "string" || candidate.trim() === "") {
    diagnostics.push(
      diagnostic(
        file,
        field,
        candidate === undefined ? "CAMPO_AUSENTE" : "VALOR_INVALIDO",
        "Deve ser um texto não vazio.",
      ),
    );
    return undefined;
  }
  return candidate;
}

function requiredNumber(
  value: JsonObject,
  file: string,
  field: string,
  diagnostics: ContentDiagnostic[],
): number | undefined {
  const candidate = value[field.slice(field.lastIndexOf(".") + 1)];
  if (typeof candidate !== "number" || !Number.isFinite(candidate)) {
    diagnostics.push(
      diagnostic(
        file,
        field,
        candidate === undefined ? "CAMPO_AUSENTE" : "VALOR_INVALIDO",
        "Deve ser um número finito.",
      ),
    );
    return undefined;
  }
  return candidate;
}

function requiredStringArray(
  value: JsonObject,
  file: string,
  field: string,
  diagnostics: ContentDiagnostic[],
): string[] | undefined {
  const candidate = value[field.slice(field.lastIndexOf(".") + 1)];
  if (
    !Array.isArray(candidate) ||
    candidate.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    diagnostics.push(
      diagnostic(
        file,
        field,
        candidate === undefined ? "CAMPO_AUSENTE" : "VALOR_INVALIDO",
        "Deve ser uma lista de textos não vazios.",
      ),
    );
    return undefined;
  }
  return candidate;
}

function validateEnvelope(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): void {
  requiredString(value, file, "id", diagnostics);
  const version = requiredNumber(value, file, "versaoEsquema", diagnostics);
  if (version !== undefined && version !== 1) {
    diagnostics.push(
      diagnostic(
        file,
        "versaoEsquema",
        "VALOR_INVALIDO",
        "A versão de esquema suportada é 1.",
      ),
    );
  }
}

function validateManifest(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): ScenarioManifest | undefined {
  validateKnownFields(
    value,
    file,
    [
      "id",
      "tipo",
      "versaoEsquema",
      "nome",
      "mundo",
      "estadoInicial",
      "variaveis",
      "politicas",
      "catalogoPoliticas",
      "consequencias",
      "eventos",
      "situacoes",
      "dilemas",
      "perfis",
      "organizacaoPolitica",
      "unidadeTemporal",
      "respostaDasBolhas",
    ],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  validateBubbleResponse(value, file, diagnostics);
  if (
    value.unidadeTemporal !== undefined &&
    value.unidadeTemporal !== "mes" &&
    value.unidadeTemporal !== "trimestre"
  ) {
    diagnostics.push(
      diagnostic(
        file,
        "unidadeTemporal",
        "VALOR_INVALIDO",
        "Use mes ou trimestre para a unidade temporal do conteúdo.",
      ),
    );
  }
  const nome = requiredString(value, file, "nome", diagnostics);
  const estadoInicial = requiredString(
    value,
    file,
    "estadoInicial",
    diagnostics,
  );
  const world =
    value.mundo === undefined
      ? undefined
      : requiredString(value, file, "mundo", diagnostics);
  if (world !== undefined) {
    for (const field of [
      "variaveis",
      "politicas",
      "catalogoPoliticas",
      "consequencias",
      "eventos",
      "situacoes",
      "dilemas",
    ])
      if (value[field] !== undefined)
        diagnostics.push(
          diagnostic(
            file,
            field,
            "VALOR_INVALIDO",
            "Um país que usa mundo não declara conteúdo do mundo; ele vem de mundo.",
          ),
        );
  }
  const variaveis =
    world !== undefined
      ? world
      : requiredString(value, file, "variaveis", diagnostics);
  const politicas =
    world !== undefined || value.politicas === undefined
      ? undefined
      : requiredStringArray(value, file, "politicas", diagnostics);
  const catalogoPoliticas =
    world !== undefined || value.catalogoPoliticas === undefined
      ? undefined
      : requiredString(value, file, "catalogoPoliticas", diagnostics);
  if (
    world === undefined &&
    (politicas === undefined) === (catalogoPoliticas === undefined)
  )
    diagnostics.push(
      diagnostic(
        file,
        "politicas",
        "VALOR_INVALIDO",
        "Informe exatamente politicas ou catalogoPoliticas.",
      ),
    );
  const consequencias =
    world !== undefined
      ? []
      : requiredStringArray(value, file, "consequencias", diagnostics);
  for (const field of ["eventos", "situacoes", "dilemas"] as const) {
    if (value[field] !== undefined)
      requiredStringArray(value, file, field, diagnostics);
  }
  if (value.organizacaoPolitica !== undefined)
    requiredString(value, file, "organizacaoPolitica", diagnostics);
  if (value.perfis !== undefined) {
    if (!Array.isArray(value.perfis))
      diagnostics.push(
        diagnostic(file, "perfis", "TIPO_INVALIDO", "Deve ser uma lista."),
      );
    else
      value.perfis.forEach((profile, index) => {
        if (!isObject(profile)) {
          diagnostics.push(
            diagnostic(
              file,
              `perfis[${index}]`,
              "TIPO_INVALIDO",
              "Deve ser um objeto.",
            ),
          );
          return;
        }
        validateKnownFields(
          profile,
          file,
          ["id", "nome", "peso", "interesses"],
          diagnostics,
        );
        requiredString(profile, file, `perfis[${index}].id`, diagnostics);
        requiredString(profile, file, `perfis[${index}].nome`, diagnostics);
        requiredNumber(profile, file, `perfis[${index}].peso`, diagnostics);
        requiredStringArray(profile, file, "interesses", diagnostics);
      });
  }
  if (
    diagnostics.length > 0 ||
    !nome ||
    !estadoInicial ||
    !variaveis ||
    (world === undefined && !politicas && !catalogoPoliticas) ||
    !consequencias
  )
    return undefined;
  return value as ScenarioManifest;
}

function validateBubbleResponse(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
) {
  if (value.respostaDasBolhas === undefined) return;
  const response = requiredNumber(
    value,
    file,
    "respostaDasBolhas",
    diagnostics,
  );
  if (response !== undefined && (response <= 0 || response > 1))
    diagnostics.push(
      diagnostic(
        file,
        "respostaDasBolhas",
        "VALOR_INVALIDO",
        "Use uma fração maior que 0 e até 1.",
      ),
    );
}

function validateWorld(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): WorldFile | undefined {
  validateKnownFields(
    value,
    file,
    [
      "id",
      "tipo",
      "versaoEsquema",
      "nome",
      "variaveis",
      "catalogoPoliticas",
      "consequencias",
      "eventos",
      "situacoes",
      "dilemas",
      "respostaDasBolhas",
    ],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  validateBubbleResponse(value, file, diagnostics);
  requiredString(value, file, "nome", diagnostics);
  requiredString(value, file, "variaveis", diagnostics);
  requiredString(value, file, "catalogoPoliticas", diagnostics);
  requiredStringArray(value, file, "consequencias", diagnostics);
  for (const field of ["eventos", "situacoes", "dilemas"] as const)
    if (value[field] !== undefined)
      requiredStringArray(value, file, field, diagnostics);
  return diagnostics.length === 0 ? (value as WorldFile) : undefined;
}

function validatePolicyCatalog(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): PolicyCatalogFile | undefined {
  validateKnownFields(
    value,
    file,
    ["id", "tipo", "versaoEsquema", "politicas", "leisEleitorais"],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  requiredStringArray(value, file, "politicas", diagnostics);
  if (value.leisEleitorais !== undefined) {
    if (!Array.isArray(value.leisEleitorais))
      diagnostics.push(
        diagnostic(
          file,
          "leisEleitorais",
          "TIPO_INVALIDO",
          "Deve ser uma lista.",
        ),
      );
    else {
      const ids = new Set<string>();
      value.leisEleitorais.forEach((law, index) => {
        const field = `leisEleitorais.${index}`;
        if (!isObject(law)) {
          diagnostics.push(
            diagnostic(file, field, "TIPO_INVALIDO", "Deve ser um objeto."),
          );
          return;
        }
        validateKnownFields(
          law,
          file,
          [
            "id",
            "nome",
            "ambito",
            "eleicao",
            "instituicao",
            "alcance",
            "mecanismo",
            "parametros",
          ],
          diagnostics,
        );
        const id = requiredString(law, file, `${field}.id`, diagnostics);
        if (id) {
          if (ids.has(id))
            diagnostics.push(
              diagnostic(
                file,
                `${field}.id`,
                "ID_DUPLICADO",
                `Lei eleitoral repetida: ${id}.`,
              ),
            );
          ids.add(id);
        }
        requiredString(law, file, `${field}.nome`, diagnostics);
        requiredString(law, file, `${field}.eleicao`, diagnostics);
        requiredString(law, file, `${field}.instituicao`, diagnostics);
        if (law.ambito !== "constitucional")
          diagnostics.push(
            diagnostic(
              file,
              `${field}.ambito`,
              "VALOR_INVALIDO",
              "Lei eleitoral deve ser constitucional.",
            ),
          );
        if (law.alcance !== "nacional" && law.alcance !== "territorial")
          diagnostics.push(
            diagnostic(
              file,
              `${field}.alcance`,
              "VALOR_INVALIDO",
              "Alcance não suportado.",
            ),
          );
        const mechanism = requiredString(
          law,
          file,
          `${field}.mecanismo`,
          diagnostics,
        );
        if (
          mechanism !== "pluralidade_nacional" &&
          mechanism !== "maiores_quotientes_por_unidade"
        )
          diagnostics.push(
            diagnostic(
              file,
              `${field}.mecanismo`,
              "MECANISMO_NAO_SUPORTADO",
              "Mecanismo eleitoral não suportado.",
            ),
          );
        if (!isObject(law.parametros))
          diagnostics.push(
            diagnostic(
              file,
              `${field}.parametros`,
              "TIPO_INVALIDO",
              "Deve ser um objeto de parâmetros.",
            ),
          );
        else if (
          mechanism === "pluralidade_nacional" &&
          law.parametros.turnos !== 1
        )
          diagnostics.push(
            diagnostic(
              file,
              `${field}.parametros.turnos`,
              "VALOR_INVALIDO",
              "Pluralidade nacional exige turno único.",
            ),
          );
        else if (
          mechanism === "maiores_quotientes_por_unidade" &&
          law.parametros.desempate !== "d20"
        )
          diagnostics.push(
            diagnostic(
              file,
              `${field}.parametros.desempate`,
              "VALOR_INVALIDO",
              "Maiores quocientes exige desempate d20.",
            ),
          );
      });
    }
  }
  return diagnostics.length === 0 ? (value as PolicyCatalogFile) : undefined;
}

function validatePoliticalOrganization(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): PoliticalOrganizationFile | undefined {
  validateKnownFields(
    value,
    file,
    [
      "id",
      "tipo",
      "versaoEsquema",
      "formaInicial",
      "formasDeGoverno",
      "instituicoes",
      "processosConstitucionais",
      "mudancasConstitucionais",
    ],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  const initialForm = requiredString(value, file, "formaInicial", diagnostics);
  const forms: JsonObject[] = [];
  const institutions: JsonObject[] = [];
  const processes: JsonObject[] = [];
  const changes: JsonObject[] = [];

  for (const [field, output] of [
    ["formasDeGoverno", forms],
    ["instituicoes", institutions],
    ["processosConstitucionais", processes],
    ["mudancasConstitucionais", changes],
  ] as const) {
    const items = value[field];
    if (!Array.isArray(items) || items.some((item) => !isObject(item))) {
      diagnostics.push(
        diagnostic(
          file,
          field,
          items === undefined ? "CAMPO_AUSENTE" : "TIPO_INVALIDO",
          "Deve ser uma lista de objetos.",
        ),
      );
      continue;
    }
    output.push(...(items as JsonObject[]));
  }

  const formIds = new Set<string>();
  for (const [index, form] of forms.entries()) {
    const path = `formasDeGoverno[${index}]`;
    validateKnownFields(
      form,
      file,
      ["id", "nome", "instituicoesAtivas", "eleicoesAtivas", "poderes"],
      diagnostics,
    );
    const id = requiredString(form, file, `${path}.id`, diagnostics);
    requiredString(form, file, `${path}.nome`, diagnostics);
    if (id) {
      if (formIds.has(id))
        diagnostics.push(
          diagnostic(
            file,
            `${path}.id`,
            "ID_DUPLICADO",
            `Forma de governo repetida: ${id}.`,
          ),
        );
      formIds.add(id);
    }
    requiredStringArray(form, file, `${path}.instituicoesAtivas`, diagnostics);
    requiredStringArray(form, file, `${path}.eleicoesAtivas`, diagnostics);
    if (
      !Array.isArray(form.poderes) ||
      form.poderes.some((power) => !isObject(power))
    ) {
      diagnostics.push(
        diagnostic(
          file,
          `${path}.poderes`,
          "TIPO_INVALIDO",
          "Deve ser uma lista de objetos.",
        ),
      );
    } else {
      form.poderes.forEach((power, powerIndex) => {
        if (!isObject(power)) return;
        const powerPath = `${path}.poderes[${powerIndex}]`;
        validateKnownFields(power, file, ["id", "relacao"], diagnostics);
        requiredString(power, file, `${powerPath}.id`, diagnostics);
        const relation = requiredString(
          power,
          file,
          `${powerPath}.relacao`,
          diagnostics,
        );
        if (
          relation !== undefined &&
          ![
            "independente",
            "compartilhado",
            "concentrado",
            "subordinado",
            "ausente",
          ].includes(relation)
        )
          diagnostics.push(
            diagnostic(
              file,
              `${powerPath}.relacao`,
              "VALOR_INVALIDO",
              "Relação de poder não suportada.",
            ),
          );
      });
    }
  }

  const institutionIds = new Set<string>();
  for (const [index, institution] of institutions.entries()) {
    const path = `instituicoes[${index}]`;
    validateKnownFields(
      institution,
      file,
      [
        "id",
        "nome",
        "poder",
        "composicao",
        "mandatoMeses",
        "renovacao",
        "votacaoOrdinaria",
      ],
      diagnostics,
    );
    const id = requiredString(institution, file, `${path}.id`, diagnostics);
    requiredString(institution, file, `${path}.nome`, diagnostics);
    requiredString(institution, file, `${path}.poder`, diagnostics);
    if (id) {
      if (institutionIds.has(id))
        diagnostics.push(
          diagnostic(
            file,
            `${path}.id`,
            "ID_DUPLICADO",
            `Instituição repetida: ${id}.`,
          ),
        );
      institutionIds.add(id);
    }
    let seatsPerUnit: number | undefined;
    if (!isObject(institution.composicao)) {
      diagnostics.push(
        diagnostic(
          file,
          `${path}.composicao`,
          institution.composicao === undefined
            ? "CAMPO_AUSENTE"
            : "TIPO_INVALIDO",
          "Deve declarar o modelo de composição.",
        ),
      );
    } else {
      const composition = institution.composicao;
      const mode = requiredString(
        composition,
        file,
        `${path}.composicao.modo`,
        diagnostics,
      );
      if (mode === "nacional") {
        validateKnownFields(
          composition,
          file,
          ["modo", "quantidade"],
          diagnostics,
        );
        const quantity = requiredNumber(
          composition,
          file,
          `${path}.composicao.quantidade`,
          diagnostics,
        );
        if (
          quantity !== undefined &&
          (!Number.isInteger(quantity) || quantity <= 0)
        )
          diagnostics.push(
            diagnostic(
              file,
              `${path}.composicao.quantidade`,
              "VALOR_INVALIDO",
              "Deve ser um inteiro positivo.",
            ),
          );
      } else if (mode === "territorial") {
        validateKnownFields(
          composition,
          file,
          ["modo", "unidade", "quantidadeUnidades", "quantidadePorUnidade"],
          diagnostics,
        );
        requiredString(
          composition,
          file,
          `${path}.composicao.unidade`,
          diagnostics,
        );
        for (const field of ["quantidadeUnidades", "quantidadePorUnidade"]) {
          const number = requiredNumber(
            composition,
            file,
            `${path}.composicao.${field}`,
            diagnostics,
          );
          if (
            number !== undefined &&
            (!Number.isInteger(number) || number <= 0)
          )
            diagnostics.push(
              diagnostic(
                file,
                `${path}.composicao.${field}`,
                "VALOR_INVALIDO",
                "Deve ser um inteiro positivo.",
              ),
            );
          if (field === "quantidadePorUnidade") seatsPerUnit = number;
        }
      } else {
        diagnostics.push(
          diagnostic(
            file,
            `${path}.composicao.modo`,
            "VALOR_INVALIDO",
            "Use nacional ou territorial.",
          ),
        );
      }
    }
    if (institution.mandatoMeses !== undefined) {
      const term = requiredNumber(
        institution,
        file,
        `${path}.mandatoMeses`,
        diagnostics,
      );
      if (term !== undefined && (!Number.isInteger(term) || term <= 0))
        diagnostics.push(
          diagnostic(
            file,
            `${path}.mandatoMeses`,
            "VALOR_INVALIDO",
            "Deve ser um inteiro positivo.",
          ),
        );
    }
    if (institution.renovacao !== undefined) {
      if (!isObject(institution.renovacao)) {
        diagnostics.push(
          diagnostic(
            file,
            `${path}.renovacao`,
            "TIPO_INVALIDO",
            "Deve ser um objeto.",
          ),
        );
      } else {
        validateKnownFields(
          institution.renovacao,
          file,
          ["intervaloMeses", "cadeirasPorUnidade"],
          diagnostics,
        );
        const interval = requiredNumber(
          institution.renovacao,
          file,
          `${path}.renovacao.intervaloMeses`,
          diagnostics,
        );
        if (
          interval !== undefined &&
          (!Number.isInteger(interval) || interval <= 0)
        )
          diagnostics.push(
            diagnostic(
              file,
              `${path}.renovacao.intervaloMeses`,
              "VALOR_INVALIDO",
              "Deve ser um inteiro positivo.",
            ),
          );
        const seats = institution.renovacao.cadeirasPorUnidade;
        if (
          !Array.isArray(seats) ||
          seats.some(
            (seat) =>
              typeof seat !== "number" || !Number.isInteger(seat) || seat <= 0,
          )
        )
          diagnostics.push(
            diagnostic(
              file,
              `${path}.renovacao.cadeirasPorUnidade`,
              "VALOR_INVALIDO",
              "Deve conter inteiros positivos.",
            ),
          );
        else if (
          seatsPerUnit !== undefined &&
          seats.reduce((sum, seat) => sum + seat, 0) !== seatsPerUnit
        )
          diagnostics.push(
            diagnostic(
              file,
              `${path}.renovacao.cadeirasPorUnidade`,
              "VALOR_INVALIDO",
              "A soma da renovação deve corresponder às cadeiras por unidade.",
            ),
          );
      }
    }
    if (institution.votacaoOrdinaria !== undefined) {
      if (!isObject(institution.votacaoOrdinaria)) {
        diagnostics.push(
          diagnostic(
            file,
            `${path}.votacaoOrdinaria`,
            "TIPO_INVALIDO",
            "Deve ser um objeto.",
          ),
        );
      } else {
        validateKnownFields(
          institution.votacaoOrdinaria,
          file,
          ["regra", "base", "fracao"],
          diagnostics,
        );
        const rule = requiredString(
          institution.votacaoOrdinaria,
          file,
          `${path}.votacaoOrdinaria.regra`,
          diagnostics,
        );
        const base = requiredString(
          institution.votacaoOrdinaria,
          file,
          `${path}.votacaoOrdinaria.base`,
          diagnostics,
        );
        if (
          rule !== undefined &&
          ![
            "maioria_absoluta",
            "maioria_simples",
            "maioria_qualificada",
          ].includes(rule)
        )
          diagnostics.push(
            diagnostic(
              file,
              `${path}.votacaoOrdinaria.regra`,
              "VALOR_INVALIDO",
              "Regra de votação não suportada.",
            ),
          );
        if (
          base !== undefined &&
          !["cadeiras_ativas", "votos_validos"].includes(base)
        )
          diagnostics.push(
            diagnostic(
              file,
              `${path}.votacaoOrdinaria.base`,
              "VALOR_INVALIDO",
              "Base de votação não suportada.",
            ),
          );
        if (institution.votacaoOrdinaria.fracao !== undefined) {
          const fraction = requiredNumber(
            institution.votacaoOrdinaria,
            file,
            `${path}.votacaoOrdinaria.fracao`,
            diagnostics,
          );
          if (fraction !== undefined && (fraction <= 0 || fraction > 1))
            diagnostics.push(
              diagnostic(
                file,
                `${path}.votacaoOrdinaria.fracao`,
                "VALOR_INVALIDO",
                "Deve estar entre 0 (exclusivo) e 1.",
              ),
            );
        }
      }
    }
  }

  const processIds = new Set<string>();
  for (const [index, process] of processes.entries()) {
    const path = `processosConstitucionais[${index}]`;
    validateKnownFields(
      process,
      file,
      ["id", "orgaosAprovadores", "fracaoFavoravel", "rodadas"],
      diagnostics,
    );
    const id = requiredString(process, file, `${path}.id`, diagnostics);
    if (id) {
      if (processIds.has(id))
        diagnostics.push(
          diagnostic(
            file,
            `${path}.id`,
            "ID_DUPLICADO",
            `Processo constitucional repetido: ${id}.`,
          ),
        );
      processIds.add(id);
    }
    requiredStringArray(
      process,
      file,
      `${path}.orgaosAprovadores`,
      diagnostics,
    );
    const fraction = requiredNumber(
      process,
      file,
      `${path}.fracaoFavoravel`,
      diagnostics,
    );
    if (fraction !== undefined && (fraction <= 0 || fraction > 1))
      diagnostics.push(
        diagnostic(
          file,
          `${path}.fracaoFavoravel`,
          "VALOR_INVALIDO",
          "Deve estar entre 0 (exclusivo) e 1.",
        ),
      );
    const rounds = requiredNumber(
      process,
      file,
      `${path}.rodadas`,
      diagnostics,
    );
    if (rounds !== undefined && (!Number.isInteger(rounds) || rounds <= 0))
      diagnostics.push(
        diagnostic(
          file,
          `${path}.rodadas`,
          "VALOR_INVALIDO",
          "Deve ser um inteiro positivo.",
        ),
      );
  }

  const changeIds = new Set<string>();
  for (const [index, change] of changes.entries()) {
    const path = `mudancasConstitucionais[${index}]`;
    validateKnownFields(
      change,
      file,
      [
        "id",
        "processo",
        "tipo",
        "formaGoverno",
        "instituicao",
        "valor",
        "mandatoMeses",
        "intervaloRenovacaoMeses",
        "cadeirasPorCiclo",
      ],
      diagnostics,
    );
    const id = requiredString(change, file, `${path}.id`, diagnostics);
    if (id) {
      if (changeIds.has(id))
        diagnostics.push(
          diagnostic(
            file,
            `${path}.id`,
            "ID_DUPLICADO",
            `Mudança constitucional repetida: ${id}.`,
          ),
        );
      changeIds.add(id);
    }
    requiredString(change, file, `${path}.processo`, diagnostics);
    const type = requiredString(change, file, `${path}.tipo`, diagnostics);
    if (type === "mudar_forma")
      requiredString(change, file, `${path}.formaGoverno`, diagnostics);
    else if (type === "alterar_vagas_por_unidade") {
      requiredString(change, file, `${path}.instituicao`, diagnostics);
      const amount = requiredNumber(change, file, `${path}.valor`, diagnostics);
      if (amount !== undefined && (!Number.isInteger(amount) || amount <= 0))
        diagnostics.push(
          diagnostic(
            file,
            `${path}.valor`,
            "VALOR_INVALIDO",
            "Deve ser um inteiro positivo.",
          ),
        );
      for (const field of [
        "mandatoMeses",
        "intervaloRenovacaoMeses",
      ] as const) {
        if (change[field] === undefined) continue;
        const duration = requiredNumber(
          change,
          file,
          `${path}.${field}`,
          diagnostics,
        );
        if (
          duration !== undefined &&
          (!Number.isInteger(duration) || duration <= 0)
        )
          diagnostics.push(
            diagnostic(
              file,
              `${path}.${field}`,
              "VALOR_INVALIDO",
              "Deve ser um inteiro positivo.",
            ),
          );
      }
      if (change.cadeirasPorCiclo !== undefined) {
        const cycle = change.cadeirasPorCiclo;
        if (
          !Array.isArray(cycle) ||
          cycle.some(
            (seat) =>
              typeof seat !== "number" || !Number.isInteger(seat) || seat <= 0,
          )
        )
          diagnostics.push(
            diagnostic(
              file,
              `${path}.cadeirasPorCiclo`,
              "VALOR_INVALIDO",
              "Deve conter inteiros positivos.",
            ),
          );
        else if (
          amount !== undefined &&
          cycle.reduce((sum, seat) => sum + seat, 0) !== amount
        )
          diagnostics.push(
            diagnostic(
              file,
              `${path}.cadeirasPorCiclo`,
              "VALOR_INVALIDO",
              "A soma do ciclo deve corresponder às vagas por unidade.",
            ),
          );
      }
    } else if (type === "desativar_instituicao")
      requiredString(change, file, `${path}.instituicao`, diagnostics);
    else
      diagnostics.push(
        diagnostic(
          file,
          `${path}.tipo`,
          "VALOR_INVALIDO",
          "Mudança constitucional não suportada.",
        ),
      );
  }

  for (const [index, form] of forms.entries()) {
    for (const institutionId of (form.instituicoesAtivas as
      unknown[] | undefined) ?? [])
      if (
        typeof institutionId === "string" &&
        !institutionIds.has(institutionId)
      )
        diagnostics.push(
          diagnostic(
            file,
            `formasDeGoverno[${index}].instituicoesAtivas`,
            "REFERENCIA_QUEBRADA",
            `Instituição inexistente: ${institutionId}.`,
          ),
        );
  }
  for (const [index, process] of processes.entries()) {
    for (const institutionId of (process.orgaosAprovadores as
      unknown[] | undefined) ?? [])
      if (
        typeof institutionId === "string" &&
        !institutionIds.has(institutionId)
      )
        diagnostics.push(
          diagnostic(
            file,
            `processosConstitucionais[${index}].orgaosAprovadores`,
            "REFERENCIA_QUEBRADA",
            `Instituição inexistente: ${institutionId}.`,
          ),
        );
  }
  for (const [index, change] of changes.entries()) {
    if (typeof change.processo === "string" && !processIds.has(change.processo))
      diagnostics.push(
        diagnostic(
          file,
          `mudancasConstitucionais[${index}].processo`,
          "REFERENCIA_QUEBRADA",
          `Processo constitucional inexistente: ${change.processo}.`,
        ),
      );
    if (
      change.tipo === "mudar_forma" &&
      typeof change.formaGoverno === "string" &&
      !formIds.has(change.formaGoverno)
    )
      diagnostics.push(
        diagnostic(
          file,
          `mudancasConstitucionais[${index}].formaGoverno`,
          "REFERENCIA_QUEBRADA",
          `Forma de governo inexistente: ${change.formaGoverno}.`,
        ),
      );
    if (
      (change.tipo === "alterar_vagas_por_unidade" ||
        change.tipo === "desativar_instituicao") &&
      typeof change.instituicao === "string" &&
      !institutionIds.has(change.instituicao)
    )
      diagnostics.push(
        diagnostic(
          file,
          `mudancasConstitucionais[${index}].instituicao`,
          "REFERENCIA_QUEBRADA",
          `Instituição inexistente: ${change.instituicao}.`,
        ),
      );
  }
  if (initialForm && !formIds.has(initialForm))
    diagnostics.push(
      diagnostic(
        file,
        "formaInicial",
        "REFERENCIA_QUEBRADA",
        `Forma de governo inexistente: ${initialForm}.`,
      ),
    );

  return diagnostics.length === 0
    ? (value as PoliticalOrganizationFile)
    : undefined;
}

function validateVariables(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): VariablesFile | undefined {
  validateKnownFields(
    value,
    file,
    ["id", "tipo", "versaoEsquema", "variaveis"],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  const variables = value.variaveis;
  if (!Array.isArray(variables)) {
    diagnostics.push(
      diagnostic(
        file,
        "variaveis",
        variables === undefined ? "CAMPO_AUSENTE" : "VALOR_INVALIDO",
        "Deve ser uma lista de variáveis.",
      ),
    );
  } else {
    variables.forEach((item, index) => {
      if (!isObject(item)) {
        diagnostics.push(
          diagnostic(
            file,
            `variaveis[${index}]`,
            "TIPO_INVALIDO",
            "Deve ser um objeto.",
          ),
        );
        return;
      }
      validateKnownFields(
        item,
        file,
        [
          "id",
          "tipo",
          "nome",
          "unidade",
          "dominio",
          "valorInicial",
          "entrada",
          "saida",
          "transbordo",
          "area",
          "avaliacao",
          "resposta",
          "faixaVisual",
          "medida",
        ],
        diagnostics,
      );
      requiredString(item, file, `variaveis[${index}].id`, diagnostics);
      if (item.resposta !== undefined) {
        const response = requiredNumber(
          item,
          file,
          `variaveis[${index}].resposta`,
          diagnostics,
        );
        if (response !== undefined && (response <= 0 || response > 1))
          diagnostics.push(
            diagnostic(
              file,
              `variaveis[${index}].resposta`,
              "VALOR_INVALIDO",
              "Use uma fração maior que 0 e até 1.",
            ),
          );
      }
      if (item.faixaVisual !== undefined) {
        if (!isObject(item.faixaVisual))
          diagnostics.push(
            diagnostic(
              file,
              `variaveis[${index}].faixaVisual`,
              "TIPO_INVALIDO",
              "Deve ser um objeto com mínimo e máximo.",
            ),
          );
        else {
          validateKnownFields(
            item.faixaVisual,
            file,
            ["minimo", "maximo"],
            diagnostics,
          );
          const low = requiredNumber(
            item.faixaVisual,
            file,
            `variaveis[${index}].faixaVisual.minimo`,
            diagnostics,
          );
          const high = requiredNumber(
            item.faixaVisual,
            file,
            `variaveis[${index}].faixaVisual.maximo`,
            diagnostics,
          );
          if (low !== undefined && high !== undefined && high <= low)
            diagnostics.push(
              diagnostic(
                file,
                `variaveis[${index}].faixaVisual`,
                "VALOR_INVALIDO",
                "O máximo precisa ser maior que o mínimo.",
              ),
            );
        }
      }
      const type = requiredString(
        item,
        file,
        `variaveis[${index}].tipo`,
        diagnostics,
      );
      if (
        type !== undefined &&
        !["controle", "calculado", "estoque", "situacao", "grupo"].includes(
          type,
        )
      ) {
        diagnostics.push(
          diagnostic(
            file,
            `variaveis[${index}].tipo`,
            "VALOR_INVALIDO",
            "Tipo de variável não suportado.",
          ),
        );
      }
      requiredString(item, file, `variaveis[${index}].nome`, diagnostics);
      requiredString(item, file, `variaveis[${index}].unidade`, diagnostics);
      if (item.area !== undefined)
        requiredString(item, file, `variaveis[${index}].area`, diagnostics);
      if (
        item.avaliacao !== undefined &&
        !["maior_melhor", "maior_pior", "neutra"].includes(
          String(item.avaliacao),
        )
      )
        diagnostics.push(
          diagnostic(
            file,
            `variaveis[${index}].avaliacao`,
            "VALOR_INVALIDO",
            "Avaliação de indicador não suportada.",
          ),
        );
      if (!isObject(item.dominio)) {
        diagnostics.push(
          diagnostic(
            file,
            `variaveis[${index}].dominio`,
            item.dominio === undefined ? "CAMPO_AUSENTE" : "TIPO_INVALIDO",
            "Deve ser um objeto com mínimo, máximo ou ambos.",
          ),
        );
      } else {
        validateKnownFields(
          item.dominio,
          file,
          ["minimo", "maximo"],
          diagnostics,
        );
        for (const bound of ["minimo", "maximo"] as const) {
          if (item.dominio[bound] !== undefined) {
            requiredNumber(
              item.dominio,
              file,
              `variaveis[${index}].dominio.${bound}`,
              diagnostics,
            );
          }
        }
        const min = item.dominio.minimo;
        const max = item.dominio.maximo;
        if (typeof min === "number" && typeof max === "number" && min > max) {
          diagnostics.push(
            diagnostic(
              file,
              `variaveis[${index}].dominio`,
              "VALOR_INVALIDO",
              "O mínimo não pode ser maior que o máximo.",
            ),
          );
        }
      }
      const bubble =
        type === "calculado" || type === "situacao" || type === "grupo";
      if (bubble && item.valorInicial !== undefined)
        diagnostics.push(
          diagnostic(
            file,
            `variaveis[${index}].valorInicial`,
            "VALOR_INVALIDO",
            "Índices e situações não têm valor inicial: são o resultado do que recebem (D-41).",
          ),
        );
      if (!bubble && item.valorInicial !== undefined)
        requiredNumber(
          item,
          file,
          `variaveis[${index}].valorInicial`,
          diagnostics,
        );
      if (type === "situacao") {
        const entrada = requiredNumber(
          item,
          file,
          `variaveis[${index}].entrada`,
          diagnostics,
        );
        const saida = requiredNumber(
          item,
          file,
          `variaveis[${index}].saida`,
          diagnostics,
        );
        if (
          typeof entrada === "number" &&
          typeof saida === "number" &&
          saida > entrada
        )
          diagnostics.push(
            diagnostic(
              file,
              `variaveis[${index}].saida`,
              "VALOR_INVALIDO",
              "A saída da situação não pode passar da entrada.",
            ),
          );
      } else if (item.transbordo !== undefined && type !== "estoque")
        diagnostics.push(
          diagnostic(
            file,
            `variaveis[${index}].transbordo`,
            "VALOR_INVALIDO",
            "Só estoques transbordam.",
          ),
        );
      else if (item.transbordo !== undefined) {
        const t = item.transbordo;
        if (
          !isObject(t) ||
          typeof t.estoque !== "string" ||
          (t.sentido !== "oposto" && t.sentido !== "igual") ||
          (t.teto !== undefined &&
            (typeof t.teto !== "number" || !Number.isFinite(t.teto)))
        )
          diagnostics.push(
            diagnostic(
              file,
              `variaveis[${index}].transbordo`,
              "VALOR_INVALIDO",
              "Transbordo: { estoque, sentido: oposto | igual, teto? }.",
            ),
          );
      }
      if (item.medida !== undefined)
        validateMeasure(
          item.medida,
          type,
          file,
          `variaveis[${index}].medida`,
          diagnostics,
        );
      if (type !== "situacao")
        for (const campo of ["entrada", "saida"] as const)
          if (item[campo] !== undefined)
            diagnostics.push(
              diagnostic(
                file,
                `variaveis[${index}].${campo}`,
                "VALOR_INVALIDO",
                "Só situações têm entrada e saída.",
              ),
            );
    });
  }
  return diagnostics.length === 0 ? (value as VariablesFile) : undefined;
}

/** Medida real de um índice (V1-07); ver `VariableMeasure`. */
function validateMeasure(
  value: unknown,
  type: string | undefined,
  file: string,
  path: string,
  diagnostics: ContentDiagnostic[],
): void {
  const fail = (message: string) =>
    diagnostics.push(diagnostic(file, path, "VALOR_INVALIDO", message));
  if (type !== "calculado" && type !== "estoque")
    return void fail("Só índices calculados e estoques têm medida.");
  if (!isObject(value))
    return void fail("Medida: { unidade, zero?, cem?, fontes?, tecnico? }.");
  validateKnownFields(
    value,
    file,
    ["unidade", "zero", "cem", "fontes", "tecnico"],
    diagnostics,
  );
  requiredString(value, file, `${path}.unidade`, diagnostics);
  const ends = [value.zero, value.cem];
  if (ends.some((end) => end !== undefined)) {
    if (value.tecnico === true) fail("Medida técnica não tem zero e cem.");
    else if (
      !ends.every((end) => typeof end === "number" && Number.isFinite(end))
    )
      fail("Zero e cem vêm juntos, como números.");
    else if (value.zero === value.cem)
      fail("Zero e cem precisam ser diferentes.");
  }
  if (value.tecnico !== undefined && typeof value.tecnico !== "boolean")
    fail("Técnico é verdadeiro ou falso.");
  if (value.tecnico === true) return;
  if (
    !Array.isArray(value.fontes) ||
    value.fontes.length === 0 ||
    !value.fontes.every((fonte) => typeof fonte === "string" && fonte.trim())
  )
    fail("Uma medida real precisa de pelo menos uma fonte.");
}

function validateInitialState(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): InitialStateFile | undefined {
  validateKnownFields(
    value,
    file,
    [
      "id",
      "tipo",
      "versaoEsquema",
      "valores",
      "economia",
      "leisVigentes",
      "limitesProprios",
      "leisEleitoraisVigentes",
      "politica",
      "cenario",
      "indicesIniciais",
      "lugares",
    ],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  if (value.cenario !== undefined) {
    if (!isObject(value.cenario))
      diagnostics.push(
        diagnostic(file, "cenario", "TIPO_INVALIDO", "Deve ser um objeto."),
      );
    else {
      validateKnownFields(
        value.cenario,
        file,
        ["nome", "ano", "aquecimentoMeses"],
        diagnostics,
      );
      requiredString(value.cenario, file, "cenario.nome", diagnostics);
      if (value.cenario.ano !== undefined)
        requiredNumber(value.cenario, file, "cenario.ano", diagnostics);
      const warmUp = value.cenario.aquecimentoMeses;
      if (
        warmUp !== undefined &&
        (!Number.isInteger(warmUp) ||
          (warmUp as number) < 0 ||
          (warmUp as number) > 60)
      )
        diagnostics.push(
          diagnostic(
            file,
            "cenario.aquecimentoMeses",
            "VALOR_INVALIDO",
            "Use um número inteiro de meses, de 0 a 60.",
          ),
        );
    }
  }
  if (value.indicesIniciais !== undefined) {
    if (!isObject(value.indicesIniciais))
      diagnostics.push(
        diagnostic(
          file,
          "indicesIniciais",
          "TIPO_INVALIDO",
          "Deve ser um objeto de valores numéricos.",
        ),
      );
    else
      for (const [id, current] of Object.entries(value.indicesIniciais))
        if (typeof current !== "number" || !Number.isFinite(current))
          diagnostics.push(
            diagnostic(
              file,
              `indicesIniciais.${id}`,
              "VALOR_INVALIDO",
              "Deve ser um número finito.",
            ),
          );
  }
  if (!isObject(value.valores)) {
    diagnostics.push(
      diagnostic(
        file,
        "valores",
        value.valores === undefined ? "CAMPO_AUSENTE" : "TIPO_INVALIDO",
        "Deve ser um objeto de valores numéricos.",
      ),
    );
  } else {
    for (const [id, current] of Object.entries(value.valores)) {
      if (typeof current !== "number" || !Number.isFinite(current)) {
        diagnostics.push(
          diagnostic(
            file,
            `valores.${id}`,
            "VALOR_INVALIDO",
            "Deve ser um número finito.",
          ),
        );
      }
    }
  }
  if (value.leisVigentes !== undefined) {
    if (!Array.isArray(value.leisVigentes))
      diagnostics.push(
        diagnostic(
          file,
          "leisVigentes",
          "TIPO_INVALIDO",
          "Deve ser uma lista.",
        ),
      );
    else
      value.leisVigentes.forEach((item, index) => {
        const field = `leisVigentes[${index}]`;
        if (!isObject(item)) {
          diagnostics.push(
            diagnostic(file, field, "TIPO_INVALIDO", "Deve ser um objeto."),
          );
          return;
        }
        validateKnownFields(
          item,
          file,
          ["lei", "nivel", "opcao", "nivelImplantado"],
          diagnostics,
        );
        requiredString(item, file, `${field}.lei`, diagnostics);
        if ((item.nivel === undefined) === (item.opcao === undefined))
          diagnostics.push(
            diagnostic(
              file,
              field,
              "VALOR_INVALIDO",
              "Informe nivel (valor ou %) ou opcao (lei com opções), um dos dois.",
            ),
          );
        if (item.nivel !== undefined)
          requiredNumber(item, file, `${field}.nivel`, diagnostics);
        if (item.opcao !== undefined)
          requiredString(item, file, `${field}.opcao`, diagnostics);
        if (item.nivelImplantado !== undefined)
          requiredNumber(item, file, `${field}.nivelImplantado`, diagnostics);
      });
  }
  if (value.economia !== undefined) {
    if (!isObject(value.economia))
      diagnostics.push(
        diagnostic(file, "economia", "TIPO_INVALIDO", "Deve ser um objeto."),
      );
    else {
      validateKnownFields(value.economia, file, ["pibAnual"], diagnostics);
      const gdp = requiredNumber(
        value.economia,
        file,
        "economia.pibAnual",
        diagnostics,
      );
      if (gdp !== undefined && gdp <= 0)
        diagnostics.push(
          diagnostic(
            file,
            "economia.pibAnual",
            "VALOR_INVALIDO",
            "O PIB deve ser maior que zero.",
          ),
        );
    }
  }
  if (value.limitesProprios !== undefined) {
    if (!Array.isArray(value.limitesProprios))
      diagnostics.push(
        diagnostic(
          file,
          "limitesProprios",
          "TIPO_INVALIDO",
          "Deve ser uma lista.",
        ),
      );
    else
      value.limitesProprios.forEach((item, index) => {
        const field = `limitesProprios[${index}]`;
        if (!isObject(item)) {
          diagnostics.push(
            diagnostic(file, field, "TIPO_INVALIDO", "Deve ser um objeto."),
          );
          return;
        }
        validateKnownFields(
          item,
          file,
          ["lei", "minimo", "maximo"],
          diagnostics,
        );
        requiredString(item, file, `${field}.lei`, diagnostics);
        const low =
          item.minimo === undefined
            ? undefined
            : requiredNumber(item, file, `${field}.minimo`, diagnostics);
        const high =
          item.maximo === undefined
            ? undefined
            : requiredNumber(item, file, `${field}.maximo`, diagnostics);
        if (low === undefined && high === undefined)
          diagnostics.push(
            diagnostic(
              file,
              field,
              "CAMPO_AUSENTE",
              "Informe minimo, maximo ou ambos.",
            ),
          );
        if (low !== undefined && high !== undefined && low > high)
          diagnostics.push(
            diagnostic(
              file,
              field,
              "VALOR_INVALIDO",
              "minimo não pode ser maior que maximo.",
            ),
          );
      });
  }
  if (value.leisEleitoraisVigentes !== undefined)
    requiredStringArray(value, file, "leisEleitoraisVigentes", diagnostics);
  if (value.politica !== undefined)
    validatePoliticalInitialState(value.politica, file, diagnostics);
  if (value.lugares !== undefined) {
    if (!isObject(value.lugares))
      diagnostics.push(
        diagnostic(file, "lugares", "TIPO_INVALIDO", "Deve ser um objeto."),
      );
    else
      for (const kind of Object.keys(value.lugares))
        requiredStringArray(
          value.lugares,
          file,
          `lugares.${kind}`,
          diagnostics,
        );
  }
  return diagnostics.length === 0 ? (value as InitialStateFile) : undefined;
}

function validatePoliticalInitialState(
  value: unknown,
  file: string,
  diagnostics: ContentDiagnostic[],
): void {
  if (!isObject(value)) {
    diagnostics.push(
      diagnostic(file, "politica", "TIPO_INVALIDO", "Deve ser um objeto."),
    );
    return;
  }
  validateKnownFields(
    value,
    file,
    [
      "origem",
      "partidos",
      "grupos",
      "perfis",
      "relacoes",
      "cadeirasSenadoPorPartido",
      "coalizaoGoverno",
    ],
    diagnostics,
  );
  if (!isObject(value.origem))
    diagnostics.push(
      diagnostic(
        file,
        "politica.origem",
        "TIPO_INVALIDO",
        "Deve ser um objeto.",
      ),
    );
  else {
    validateKnownFields(value.origem, file, ["tipo", "descricao"], diagnostics);
    if (value.origem.tipo !== "observado" && value.origem.tipo !== "hipotese")
      diagnostics.push(
        diagnostic(
          file,
          "politica.origem.tipo",
          "VALOR_INVALIDO",
          "Use observado ou hipotese.",
        ),
      );
    requiredString(
      value.origem,
      file,
      "politica.origem.descricao",
      diagnostics,
    );
  }
  const parties = Array.isArray(value.partidos) ? value.partidos : undefined;
  const groups = Array.isArray(value.grupos) ? value.grupos : undefined;
  const profiles = Array.isArray(value.perfis) ? value.perfis : undefined;
  if (!parties || parties.length < 2)
    diagnostics.push(
      diagnostic(
        file,
        "politica.partidos",
        "VALOR_INVALIDO",
        "Exige ao menos dois partidos.",
      ),
    );
  if (!groups || groups.length === 0)
    diagnostics.push(
      diagnostic(
        file,
        "politica.grupos",
        "VALOR_INVALIDO",
        "Exige ao menos um grupo.",
      ),
    );
  if (!profiles || profiles.length === 0)
    diagnostics.push(
      diagnostic(
        file,
        "politica.perfis",
        "VALOR_INVALIDO",
        "Exige ao menos um perfil.",
      ),
    );
  const partyIds = new Set<string>();
  parties?.forEach((party, index) => {
    if (!isObject(party)) {
      diagnostics.push(
        diagnostic(
          file,
          `politica.partidos.${index}`,
          "TIPO_INVALIDO",
          "Deve ser um objeto.",
        ),
      );
      return;
    }
    validateKnownFields(
      party,
      file,
      ["id", "nome", "pesoReferencia"],
      diagnostics,
    );
    const id = requiredString(
      party,
      file,
      `politica.partidos.${index}.id`,
      diagnostics,
    );
    requiredString(party, file, `politica.partidos.${index}.nome`, diagnostics);
    if (id) {
      if (partyIds.has(id))
        diagnostics.push(
          diagnostic(
            file,
            `politica.partidos.${index}.id`,
            "ID_DUPLICADO",
            "Partido repetido.",
          ),
        );
      else partyIds.add(id);
    }
    if (
      party.pesoReferencia !== undefined &&
      (typeof party.pesoReferencia !== "number" ||
        !Number.isFinite(party.pesoReferencia) ||
        party.pesoReferencia < 0)
    )
      diagnostics.push(
        diagnostic(
          file,
          `politica.partidos.${index}.pesoReferencia`,
          "VALOR_INVALIDO",
          "Deve ser finito e não negativo.",
        ),
      );
  });
  const groupIds = new Set<string>();
  groups?.forEach((group, index) => {
    if (!isObject(group)) {
      diagnostics.push(
        diagnostic(
          file,
          `politica.grupos.${index}`,
          "TIPO_INVALIDO",
          "Deve ser um objeto.",
        ),
      );
      return;
    }
    validateKnownFields(group, file, ["id", "nome"], diagnostics);
    const id = requiredString(
      group,
      file,
      `politica.grupos.${index}.id`,
      diagnostics,
    );
    requiredString(group, file, `politica.grupos.${index}.nome`, diagnostics);
    if (id) {
      if (groupIds.has(id))
        diagnostics.push(
          diagnostic(
            file,
            `politica.grupos.${index}.id`,
            "ID_DUPLICADO",
            "Grupo repetido.",
          ),
        );
      else groupIds.add(id);
    }
  });
  let profileWeight = 0;
  profiles?.forEach((profile, index) => {
    const path = `politica.perfis.${index}`;
    if (!isObject(profile)) {
      diagnostics.push(
        diagnostic(file, path, "TIPO_INVALIDO", "Deve ser um objeto."),
      );
      return;
    }
    validateKnownFields(
      profile,
      file,
      ["id", "nome", "pesoEleitoral", "associacoes", "preferenciaBase"],
      diagnostics,
    );
    requiredString(profile, file, `${path}.id`, diagnostics);
    requiredString(profile, file, `${path}.nome`, diagnostics);
    const weight = requiredNumber(
      profile,
      file,
      `${path}.pesoEleitoral`,
      diagnostics,
    );
    if (weight !== undefined && weight >= 0) profileWeight += weight;
    else if (weight !== undefined)
      diagnostics.push(
        diagnostic(
          file,
          `${path}.pesoEleitoral`,
          "VALOR_INVALIDO",
          "Deve ser não negativo.",
        ),
      );
    if (!Array.isArray(profile.associacoes))
      diagnostics.push(
        diagnostic(
          file,
          `${path}.associacoes`,
          "TIPO_INVALIDO",
          "Deve ser lista, inclusive quando vazia.",
        ),
      );
    else {
      const associations = new Set<string>();
      profile.associacoes.forEach((association, associationIndex) => {
        if (!isObject(association)) {
          diagnostics.push(
            diagnostic(
              file,
              `${path}.associacoes.${associationIndex}`,
              "TIPO_INVALIDO",
              "Deve ser um objeto.",
            ),
          );
          return;
        }
        const group = requiredString(
          association,
          file,
          `${path}.associacoes.${associationIndex}.grupo`,
          diagnostics,
        );
        const associationWeight = requiredNumber(
          association,
          file,
          `${path}.associacoes.${associationIndex}.peso`,
          diagnostics,
        );
        if (group && (!groupIds.has(group) || associations.has(group)))
          diagnostics.push(
            diagnostic(
              file,
              `${path}.associacoes.${associationIndex}.grupo`,
              "REFERENCIA_QUEBRADA",
              "Grupo ausente ou repetido.",
            ),
          );
        if (group) associations.add(group);
        if (associationWeight !== undefined && associationWeight < 0)
          diagnostics.push(
            diagnostic(
              file,
              `${path}.associacoes.${associationIndex}.peso`,
              "VALOR_INVALIDO",
              "Deve ser não negativo.",
            ),
          );
      });
    }
    if (!isObject(profile.preferenciaBase))
      diagnostics.push(
        diagnostic(
          file,
          `${path}.preferenciaBase`,
          "TIPO_INVALIDO",
          "Deve ser um vetor por partido.",
        ),
      );
    else {
      const entries = Object.entries(profile.preferenciaBase);
      const total = entries.reduce((sum, [partyId, support]) => {
        if (
          !partyIds.has(partyId) ||
          typeof support !== "number" ||
          !Number.isFinite(support) ||
          support < 0
        ) {
          diagnostics.push(
            diagnostic(
              file,
              `${path}.preferenciaBase.${partyId}`,
              "VALOR_INVALIDO",
              "Partido ou apoio inválido.",
            ),
          );
          return sum;
        }
        return sum + support;
      }, 0);
      if (entries.length !== partyIds.size || Math.abs(total - 100) > 0.000001)
        diagnostics.push(
          diagnostic(
            file,
            `${path}.preferenciaBase`,
            "VALOR_INVALIDO",
            "Deve conter todos os partidos e somar 100.",
          ),
        );
    }
  });
  if (profiles && Math.abs(profileWeight - 1) > 0.000001)
    diagnostics.push(
      diagnostic(
        file,
        "politica.perfis",
        "VALOR_INVALIDO",
        "Os pesos eleitorais devem somar 1.",
      ),
    );
  if (!Array.isArray(value.relacoes))
    diagnostics.push(
      diagnostic(
        file,
        "politica.relacoes",
        "TIPO_INVALIDO",
        "Deve ser uma lista, inclusive quando vazia.",
      ),
    );
  else {
    const relationIds = new Set<string>();
    value.relacoes.forEach((relation, index) => {
      const path = `politica.relacoes.${index}`;
      if (!isObject(relation)) {
        diagnostics.push(
          diagnostic(file, path, "TIPO_INVALIDO", "Deve ser um objeto."),
        );
        return;
      }
      validateKnownFields(
        relation,
        file,
        ["id", "origem", "grupo", "pontosEmReferencia"],
        diagnostics,
      );
      const id = requiredString(relation, file, `${path}.id`, diagnostics);
      if (id) {
        if (relationIds.has(id))
          diagnostics.push(
            diagnostic(file, `${path}.id`, "ID_DUPLICADO", "Relação repetida."),
          );
        else relationIds.add(id);
      }
      const group = requiredString(
        relation,
        file,
        `${path}.grupo`,
        diagnostics,
      );
      if (group && !groupIds.has(group))
        diagnostics.push(
          diagnostic(
            file,
            `${path}.grupo`,
            "REFERENCIA_QUEBRADA",
            "Grupo inexistente.",
          ),
        );
      requiredNumber(relation, file, `${path}.pontosEmReferencia`, diagnostics);
      if (!isObject(relation.origem)) {
        diagnostics.push(
          diagnostic(
            file,
            `${path}.origem`,
            "TIPO_INVALIDO",
            "Deve ser um objeto.",
          ),
        );
        return;
      }
      validateKnownFields(
        relation.origem,
        file,
        ["tipo", "id", "referencia"],
        diagnostics,
      );
      if (
        relation.origem.tipo !== "politica" &&
        relation.origem.tipo !== "indicador"
      )
        diagnostics.push(
          diagnostic(
            file,
            `${path}.origem.tipo`,
            "VALOR_INVALIDO",
            "Use politica ou indicador.",
          ),
        );
      requiredString(relation.origem, file, `${path}.origem.id`, diagnostics);
      const reference = requiredNumber(
        relation.origem,
        file,
        `${path}.origem.referencia`,
        diagnostics,
      );
      if (reference !== undefined && reference <= 0)
        diagnostics.push(
          diagnostic(
            file,
            `${path}.origem.referencia`,
            "VALOR_INVALIDO",
            "Deve ser positiva.",
          ),
        );
    });
  }
  if (!isObject(value.cadeirasSenadoPorPartido))
    diagnostics.push(
      diagnostic(
        file,
        "politica.cadeirasSenadoPorPartido",
        "TIPO_INVALIDO",
        "Deve ser um vetor por partido.",
      ),
    );
  else {
    const totalSeats = Object.entries(value.cadeirasSenadoPorPartido).reduce(
      (sum, [partyId, seats]) => {
        if (
          !partyIds.has(partyId) ||
          !Number.isSafeInteger(seats) ||
          (seats as number) < 0
        ) {
          diagnostics.push(
            diagnostic(
              file,
              `politica.cadeirasSenadoPorPartido.${partyId}`,
              "VALOR_INVALIDO",
              "Partido ou cadeiras inválidos.",
            ),
          );
          return sum;
        }
        return sum + (seats as number);
      },
      0,
    );
    if (totalSeats === 0)
      diagnostics.push(
        diagnostic(
          file,
          "politica.cadeirasSenadoPorPartido",
          "VALOR_INVALIDO",
          "A composição inicial exige ao menos uma cadeira.",
        ),
      );
  }
  if (
    !Array.isArray(value.coalizaoGoverno) ||
    value.coalizaoGoverno.length === 0 ||
    value.coalizaoGoverno.some(
      (id) => typeof id !== "string" || !partyIds.has(id),
    )
  )
    diagnostics.push(
      diagnostic(
        file,
        "politica.coalizaoGoverno",
        "VALOR_INVALIDO",
        "A coalizão precisa conter partidos existentes.",
      ),
    );
}

const policyGroups = new Set([
  "orcamentaria",
  "regulatoria",
  "tributaria",
  "institucional",
]);

/** Campos de quantidade do formato antigo: no v2 a quantidade vem do país (D-24). */
const quantityFields = [
  "impactoFiscal",
  "nivel",
  "nivelInicial",
  "valor",
  "valorAnual",
];

function validatePolicyLimits(
  value: unknown,
  file: string,
  field: string,
  allowed: readonly string[],
  diagnostics: ContentDiagnostic[],
): void {
  if (!isObject(value)) {
    diagnostics.push(
      diagnostic(file, field, "TIPO_INVALIDO", "Deve ser um objeto."),
    );
    return;
  }
  validateKnownFields(value, file, allowed, diagnostics);
  for (const key of allowed) {
    if (value[key] === undefined) continue;
    const amount = requiredNumber(value, file, `${field}.${key}`, diagnostics);
    if (amount !== undefined && amount < 0)
      diagnostics.push(
        diagnostic(
          file,
          `${field}.${key}`,
          "VALOR_INVALIDO",
          "Não pode ser negativo.",
        ),
      );
  }
  for (const [min, max] of [
    ["minimo", "maximo"],
    ["minimoPercentualPib", "maximoPercentualPib"],
  ]) {
    const low = value[min];
    const high = value[max];
    if (typeof low === "number" && typeof high === "number" && low > high)
      diagnostics.push(
        diagnostic(
          file,
          field,
          "VALOR_INVALIDO",
          `${min} não pode ser maior que ${max}.`,
        ),
      );
  }
}

function validatePolicyOptions(
  value: JsonObject,
  file: string,
  minimum: number,
  diagnostics: ContentDiagnostic[],
): void {
  const options = value.opcoes;
  if (!Array.isArray(options)) {
    diagnostics.push(
      diagnostic(
        file,
        "controle.opcoes",
        options === undefined ? "CAMPO_AUSENTE" : "TIPO_INVALIDO",
        `Este grupo de lei exige uma lista de opções (mínimo ${minimum}).`,
      ),
    );
    return;
  }
  if (options.length < minimum)
    diagnostics.push(
      diagnostic(
        file,
        "controle.opcoes",
        "VALOR_INVALIDO",
        `Este grupo de lei exige no mínimo ${minimum} opções; não existe lei de sim ou não.`,
      ),
    );
  const ids = new Set<string>();
  options.forEach((option, index) => {
    const field = `controle.opcoes[${index}]`;
    if (!isObject(option)) {
      diagnostics.push(
        diagnostic(file, field, "TIPO_INVALIDO", "Deve ser um objeto."),
      );
      return;
    }
    validateKnownFields(
      option,
      file,
      ["id", "rotulo", "valor", "custoAnualPercentualPib"],
      diagnostics,
    );
    const id = requiredString(option, file, `${field}.id`, diagnostics);
    if (id !== undefined) {
      if (ids.has(id))
        diagnostics.push(
          diagnostic(
            file,
            `${field}.id`,
            "ID_DUPLICADO",
            `Opção repetida: ${id}.`,
          ),
        );
      ids.add(id);
    }
    requiredString(option, file, `${field}.rotulo`, diagnostics);
    requiredNumber(option, file, `${field}.valor`, diagnostics);
    if (option.custoAnualPercentualPib !== undefined) {
      const cost = requiredNumber(
        option,
        file,
        `${field}.custoAnualPercentualPib`,
        diagnostics,
      );
      if (cost !== undefined && cost < 0)
        diagnostics.push(
          diagnostic(
            file,
            `${field}.custoAnualPercentualPib`,
            "VALOR_INVALIDO",
            "Não pode ser negativo.",
          ),
        );
    }
  });
}

function validatePolicy(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): PolicyFile | undefined {
  for (const field of quantityFields)
    if (value[field] !== undefined)
      diagnostics.push(
        diagnostic(
          file,
          field,
          "VALOR_INVALIDO",
          "A lei não declara quantidade; o nível vem do país ou do jogador (D-24).",
        ),
      );
  validateKnownFields(
    value,
    file,
    [
      "id",
      "tipo",
      "versaoEsquema",
      "grupo",
      "nome",
      "descricao",
      "area",
      "categoria",
      "fonte",
      "icone",
      "ministerio",
      "respostaTemporal",
      "processoAutorizacao",
      "controle",
      "orcamento",
      "tributo",
      "nivelLegal",
      "revogavel",
      "requer",
      "consequencias",
      ...quantityFields,
    ],
    diagnostics,
  );
  requiredString(value, file, "id", diagnostics);
  if (value.tipo !== "lei")
    diagnostics.push(
      diagnostic(
        file,
        "tipo",
        "VALOR_INVALIDO",
        'No esquema v2 toda lei usa tipo "lei"; o grupo diferencia orçamentária, regulatória, tributária e institucional.',
      ),
    );
  if (value.versaoEsquema !== 2)
    diagnostics.push(
      diagnostic(
        file,
        "versaoEsquema",
        "VALOR_INVALIDO",
        "Leis usam o esquema v2.",
      ),
    );
  const group =
    typeof value.grupo === "string" && policyGroups.has(value.grupo)
      ? value.grupo
      : undefined;
  if (!group)
    diagnostics.push(
      diagnostic(
        file,
        "grupo",
        value.grupo === undefined ? "CAMPO_AUSENTE" : "VALOR_INVALIDO",
        "Use orcamentaria, regulatoria, tributaria ou institucional.",
      ),
    );
  requiredString(value, file, "nome", diagnostics);
  requiredString(value, file, "descricao", diagnostics);
  for (const field of ["area", "categoria", "icone", "fonte", "ministerio"])
    if (value[field] !== undefined)
      requiredString(value, file, field, diagnostics);
  if (value.respostaTemporal !== undefined) {
    if (!isObject(value.respostaTemporal))
      diagnostics.push(
        diagnostic(
          file,
          "respostaTemporal",
          "TIPO_INVALIDO",
          "Deve ser um objeto.",
        ),
      );
    else {
      validateKnownFields(
        value.respostaTemporal,
        file,
        ["implantacao", "degradacao"],
        diagnostics,
      );
      for (const field of ["implantacao", "degradacao"]) {
        const fraction = requiredNumber(
          value.respostaTemporal,
          file,
          `respostaTemporal.${field}`,
          diagnostics,
        );
        if (fraction !== undefined && (fraction <= 0 || fraction > 1))
          diagnostics.push(
            diagnostic(
              file,
              `respostaTemporal.${field}`,
              "VALOR_INVALIDO",
              "A fração por turno deve estar entre 0 (exclusivo) e 1.",
            ),
          );
      }
    }
  }
  requiredString(value, file, "processoAutorizacao", diagnostics);
  requiredStringArray(value, file, "consequencias", diagnostics);
  if (
    value.nivelLegal !== undefined &&
    !policyTiers.includes(value.nivelLegal as never)
  )
    diagnostics.push(
      diagnostic(
        file,
        "nivelLegal",
        "VALOR_INVALIDO",
        `Use ${policyTiers.join(", ")}.`,
      ),
    );
  if (value.revogavel !== undefined && typeof value.revogavel !== "boolean")
    diagnostics.push(
      diagnostic(
        file,
        "revogavel",
        "TIPO_INVALIDO",
        "Deve ser verdadeiro ou falso.",
      ),
    );
  if (value.requer !== undefined) {
    const lista = Array.isArray(value.requer) ? value.requer : [value.requer];
    if (Array.isArray(value.requer) && value.nivelLegal === undefined)
      diagnostics.push(
        diagnostic(
          file,
          "requer",
          "VALOR_INVALIDO",
          "Só leis de três níveis (com nivelLegal) exigem mais de uma lei.",
        ),
      );
    for (const [index, requer] of lista.entries()) {
      const campo = Array.isArray(value.requer) ? `requer[${index}]` : "requer";
      if (!isObject(requer)) {
        diagnostics.push(
          diagnostic(file, campo, "TIPO_INVALIDO", "Deve ser um objeto."),
        );
        continue;
      }
      validateKnownFields(
        requer,
        file,
        ["lei", "opcoes", "motivo"],
        diagnostics,
      );
      if (requer.motivo !== undefined && typeof requer.motivo !== "string")
        diagnostics.push(
          diagnostic(
            file,
            `${campo}.motivo`,
            "TIPO_INVALIDO",
            "Deve ser texto.",
          ),
        );
      if (typeof requer.lei !== "string" || !requer.lei)
        diagnostics.push(
          diagnostic(
            file,
            `${campo}.lei`,
            "CAMPO_AUSENTE",
            "Diga a lei exigida.",
          ),
        );
      if (
        !Array.isArray(requer.opcoes) ||
        requer.opcoes.length === 0 ||
        requer.opcoes.some((item) => typeof item !== "string")
      )
        diagnostics.push(
          diagnostic(
            file,
            `${campo}.opcoes`,
            "VALOR_INVALIDO",
            "A lei filha precisa de pelo menos uma opção da mãe.",
          ),
        );
    }
  }

  if (!isObject(value.controle)) {
    diagnostics.push(
      diagnostic(
        file,
        "controle",
        value.controle === undefined ? "CAMPO_AUSENTE" : "TIPO_INVALIDO",
        "Deve ser um objeto.",
      ),
    );
  } else {
    validateKnownFields(
      value.controle,
      file,
      ["variavel", "unidade", "opcoes"],
      diagnostics,
    );
    requiredString(value.controle, file, "controle.variavel", diagnostics);
    requiredString(value.controle, file, "controle.unidade", diagnostics);
    if (group === "regulatoria")
      validatePolicyOptions(
        value.controle,
        file,
        value.nivelLegal === undefined ? 3 : 2,
        diagnostics,
      );
    else if (group === "institucional")
      validatePolicyOptions(value.controle, file, 2, diagnostics);
    else if (group && value.controle.opcoes !== undefined)
      diagnostics.push(
        diagnostic(
          file,
          "controle.opcoes",
          "VALOR_INVALIDO",
          "Só leis regulatórias e institucionais têm opções.",
        ),
      );
  }

  if (group === "orcamentaria") {
    if (!isObject(value.orcamento))
      diagnostics.push(
        diagnostic(
          file,
          "orcamento",
          value.orcamento === undefined ? "CAMPO_AUSENTE" : "TIPO_INVALIDO",
          "Lei orçamentária exige o bloco orcamento.",
        ),
      );
    else {
      validateKnownFields(
        value.orcamento,
        file,
        ["modo", "base", "limites"],
        diagnostics,
      );
      const mode = value.orcamento.modo;
      if (mode !== "valor_fixo" && mode !== "percentual_orcamento")
        diagnostics.push(
          diagnostic(
            file,
            "orcamento.modo",
            mode === undefined ? "CAMPO_AUSENTE" : "VALOR_INVALIDO",
            "Use valor_fixo ou percentual_orcamento.",
          ),
        );
      if (
        mode === "percentual_orcamento" &&
        value.orcamento.base !== "receita_total"
      )
        diagnostics.push(
          diagnostic(
            file,
            "orcamento.base",
            "VALOR_INVALIDO",
            "O percentual do orçamento usa a base receita_total.",
          ),
        );
      if (mode === "valor_fixo" && value.orcamento.base !== undefined)
        diagnostics.push(
          diagnostic(
            file,
            "orcamento.base",
            "VALOR_INVALIDO",
            "Valor fixo não tem base.",
          ),
        );
      if (value.orcamento.limites !== undefined)
        validatePolicyLimits(
          value.orcamento.limites,
          file,
          "orcamento.limites",
          mode === "percentual_orcamento"
            ? ["minimo", "maximo"]
            : ["minimoPercentualPib", "maximoPercentualPib"],
          diagnostics,
        );
    }
  } else if (value.orcamento !== undefined)
    diagnostics.push(
      diagnostic(
        file,
        "orcamento",
        "VALOR_INVALIDO",
        "Só leis orçamentárias têm o bloco orcamento.",
      ),
    );

  if (group === "tributaria") {
    if (!isObject(value.tributo))
      diagnostics.push(
        diagnostic(
          file,
          "tributo",
          value.tributo === undefined ? "CAMPO_AUSENTE" : "TIPO_INVALIDO",
          "Lei tributária exige o bloco tributo.",
        ),
      );
    else {
      validateKnownFields(
        value.tributo,
        file,
        ["base", "limites"],
        diagnostics,
      );
      requiredString(value.tributo, file, "tributo.base", diagnostics);
      if (value.tributo.limites !== undefined)
        validatePolicyLimits(
          value.tributo.limites,
          file,
          "tributo.limites",
          ["minimo", "maximo"],
          diagnostics,
        );
    }
  } else if (value.tributo !== undefined)
    diagnostics.push(
      diagnostic(
        file,
        "tributo",
        "VALOR_INVALIDO",
        "Só leis tributárias têm o bloco tributo.",
      ),
    );
  return diagnostics.length === 0 ? (value as PolicyFile) : undefined;
}

function validateConsequence(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): ConsequenceFile | undefined {
  validateKnownFields(
    value,
    file,
    [
      "id",
      "tipo",
      "versaoEsquema",
      "origem",
      "alvo",
      "mecanismo",
      "parametros",
      "normalizacao",
      "leitura",
      "escala",
      "unidade",
      "atrasoPassos",
      "duracao",
    ],
    diagnostics,
  );
  if (
    value.leitura !== undefined &&
    value.leitura !== "efeito" &&
    value.leitura !== "nivel"
  )
    diagnostics.push(
      diagnostic(
        file,
        "leitura",
        "VALOR_INVALIDO",
        'Use "efeito" (nível × eficácia) ou "nivel".',
      ),
    );
  validateEnvelope(value, file, diagnostics);
  requiredString(value, file, "origem", diagnostics);
  requiredString(value, file, "alvo", diagnostics);
  const mechanism = requiredString(value, file, "mecanismo", diagnostics);
  if (
    mechanism !== undefined &&
    !supportedMechanisms.includes(
      mechanism as (typeof supportedMechanisms)[number],
    )
  ) {
    diagnostics.push(
      diagnostic(
        file,
        "mecanismo",
        "MECANISMO_NAO_SUPORTADO",
        `Mecanismo não suportado: ${mechanism}.`,
      ),
    );
  }
  requiredString(value, file, "unidade", diagnostics);
  const delay = requiredNumber(value, file, "atrasoPassos", diagnostics);
  if (delay !== undefined && (!Number.isInteger(delay) || delay < 0)) {
    diagnostics.push(
      diagnostic(
        file,
        "atrasoPassos",
        "VALOR_INVALIDO",
        "Deve ser um inteiro maior ou igual a zero.",
      ),
    );
  }
  if (!isObject(value.duracao)) {
    diagnostics.push(
      diagnostic(
        file,
        "duracao",
        value.duracao === undefined ? "CAMPO_AUSENTE" : "TIPO_INVALIDO",
        "Deve declarar o modo temporal.",
      ),
    );
  } else {
    validateKnownFields(value.duracao, file, ["modo", "passos"], diagnostics);
    const mode = requiredString(
      value.duracao,
      file,
      "duracao.modo",
      diagnostics,
    );
    if (mode === "fixo") {
      const steps = requiredNumber(
        value.duracao,
        file,
        "duracao.passos",
        diagnostics,
      );
      if (steps !== undefined && (!Number.isInteger(steps) || steps <= 0)) {
        diagnostics.push(
          diagnostic(
            file,
            "duracao.passos",
            "VALOR_INVALIDO",
            "Duração fixa deve ter número inteiro positivo de passos.",
          ),
        );
      }
    } else if (mode === "unico" || mode === "continuo") {
      if (value.duracao.passos !== undefined)
        diagnostics.push(
          diagnostic(
            file,
            "duracao.passos",
            "VALOR_INVALIDO",
            "Este modo não aceita quantidade de passos.",
          ),
        );
    } else if (mode !== undefined) {
      diagnostics.push(
        diagnostic(
          file,
          "duracao.modo",
          "VALOR_INVALIDO",
          "Modo temporal não suportado.",
        ),
      );
    }
  }
  if (!isObject(value.parametros)) {
    diagnostics.push(
      diagnostic(
        file,
        "parametros",
        value.parametros === undefined ? "CAMPO_AUSENTE" : "TIPO_INVALIDO",
        "Deve ser um objeto.",
      ),
    );
  } else {
    const required: Record<string, readonly string[]> = {
      afim: ["coeficiente", "termoConstante"],
      saturacao: ["maximo", "escala"],
      retornos_decrescentes: ["coeficiente", "escala"],
      limiar: ["limiar", "coeficiente", "direcao"],
      pontos: ["pontos"],
    };
    const fields = mechanism !== undefined ? required[mechanism] : undefined;
    if (mechanism === "pontos") {
      validateKnownFields(value.parametros, file, ["pontos"], diagnostics);
      const points = value.parametros.pontos;
      const valid =
        Array.isArray(points) &&
        points.length >= 2 &&
        points.every(
          (point) =>
            Array.isArray(point) &&
            point.length === 2 &&
            point.every((n) => typeof n === "number" && Number.isFinite(n)),
        ) &&
        points.every(
          (point, i) =>
            i === 0 || (point as number[])[0] > (points[i - 1] as number[])[0],
        );
      if (!valid)
        diagnostics.push(
          diagnostic(
            file,
            "parametros.pontos",
            points === undefined ? "CAMPO_AUSENTE" : "VALOR_INVALIDO",
            "Use dois ou mais pares [entrada, saída], com a entrada crescente.",
          ),
        );
    } else if (fields) {
      validateKnownFields(value.parametros, file, fields, diagnostics);
      for (const field of fields) {
        if (field === "direcao") {
          if (
            value.parametros.direcao !== "acima" &&
            value.parametros.direcao !== "abaixo"
          )
            diagnostics.push(
              diagnostic(
                file,
                "parametros.direcao",
                value.parametros.direcao === undefined
                  ? "CAMPO_AUSENTE"
                  : "VALOR_INVALIDO",
                "Use acima ou abaixo.",
              ),
            );
          continue;
        }
        const amount = requiredNumber(
          value.parametros,
          file,
          `parametros.${field}`,
          diagnostics,
        );
        if (field === "escala" && amount !== undefined && amount <= 0)
          diagnostics.push(
            diagnostic(
              file,
              "parametros.escala",
              "VALOR_INVALIDO",
              "A escala deve ser maior que zero.",
            ),
          );
      }
    }
  }
  if (value.escala !== undefined) {
    if (!isObject(value.escala))
      diagnostics.push(
        diagnostic(file, "escala", "TIPO_INVALIDO", "Deve ser um objeto."),
      );
    else {
      validateKnownFields(
        value.escala,
        file,
        ["fator", "referencia"],
        diagnostics,
      );
      requiredString(value.escala, file, "escala.fator", diagnostics);
      const reference = requiredNumber(
        value.escala,
        file,
        "escala.referencia",
        diagnostics,
      );
      if (reference !== undefined && reference <= 0)
        diagnostics.push(
          diagnostic(
            file,
            "escala.referencia",
            "VALOR_INVALIDO",
            "A referência deve ser maior que zero.",
          ),
        );
    }
  }
  if (value.normalizacao !== undefined) {
    if (!isObject(value.normalizacao))
      diagnostics.push(
        diagnostic(
          file,
          "normalizacao",
          "TIPO_INVALIDO",
          "Deve ser um objeto.",
        ),
      );
    else {
      validateKnownFields(
        value.normalizacao,
        file,
        ["divisor", "fator", "multiplicador"],
        diagnostics,
      );
      if (
        value.normalizacao.divisor === undefined &&
        value.normalizacao.fator === undefined
      )
        diagnostics.push(
          diagnostic(
            file,
            "normalizacao",
            "CAMPO_AUSENTE",
            "Declare divisor, fator ou os dois.",
          ),
        );
      for (const field of ["divisor", "fator"] as const)
        if (value.normalizacao[field] !== undefined)
          requiredString(
            value.normalizacao,
            file,
            `normalizacao.${field}`,
            diagnostics,
          );
      if (value.normalizacao.multiplicador !== undefined) {
        const factor = requiredNumber(
          value.normalizacao,
          file,
          "normalizacao.multiplicador",
          diagnostics,
        );
        if (factor !== undefined && factor <= 0)
          diagnostics.push(
            diagnostic(
              file,
              "normalizacao.multiplicador",
              "VALOR_INVALIDO",
              "O multiplicador deve ser maior que zero.",
            ),
          );
      }
    }
  }
  return diagnostics.length === 0 ? (value as ConsequenceFile) : undefined;
}

function validateOccurrence(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): OccurrenceFile | undefined {
  validateKnownFields(
    value,
    file,
    [
      "id",
      "tipo",
      "versaoEsquema",
      "nome",
      "descricao",
      "area",
      "avaliacao",
      "entraQuando",
      "saiQuando",
      "consequencias",
      "manchete",
      "origem",
      "nivel",
      "unica",
      "controle",
      "duracaoMeses",
      "intervaloMinimoTurnos",
      "gatilho",
      "desdobramentos",
      "opcoes",
      "padrao",
    ],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  validateOccurrenceDrama(value, file, diagnostics);
  requiredString(value, file, "nome", diagnostics);
  if (value.descricao !== undefined)
    requiredString(value, file, "descricao", diagnostics);
  if (value.area !== undefined)
    requiredString(value, file, "area", diagnostics);
  if (
    value.avaliacao !== undefined &&
    value.avaliacao !== "positiva" &&
    value.avaliacao !== "negativa"
  )
    diagnostics.push(
      diagnostic(
        file,
        "avaliacao",
        "VALOR_INVALIDO",
        "Deve ser positiva ou negativa.",
      ),
    );
  for (const field of ["entraQuando", "saiQuando"] as const) {
    const condition = value[field];
    if (condition === undefined) continue;
    if (!isObject(condition)) {
      diagnostics.push(
        diagnostic(
          file,
          field,
          "TIPO_INVALIDO",
          "Deve ser uma condição de comparação.",
        ),
      );
      continue;
    }
    validateKnownFields(
      condition,
      file,
      ["tipo", "variavel", "operador", "valor"],
      diagnostics,
    );
    if (condition.tipo !== "comparacao")
      diagnostics.push(
        diagnostic(
          file,
          `${field}.tipo`,
          "VALOR_INVALIDO",
          "Deve ser comparacao.",
        ),
      );
    requiredString(condition, file, `${field}.variavel`, diagnostics);
    const operator = requiredString(
      condition,
      file,
      `${field}.operador`,
      diagnostics,
    );
    if (
      operator !== undefined &&
      ![
        "maior_que",
        "maior_ou_igual",
        "menor_que",
        "menor_ou_igual",
        "igual",
      ].includes(operator)
    )
      diagnostics.push(
        diagnostic(
          file,
          `${field}.operador`,
          "VALOR_INVALIDO",
          "Operador não suportado.",
        ),
      );
    requiredNumber(condition, file, `${field}.valor`, diagnostics);
  }
  requiredStringArray(value, file, "consequencias", diagnostics);
  return diagnostics.length === 0 ? (value as OccurrenceFile) : undefined;
}

const OCCURRENCE_ORIGINS = new Set([
  "mundo",
  "natureza",
  "pais",
  "reacao",
  "desdobramento",
  "crise",
  "cotidiano",
]);
const COMPARISONS = new Set([
  "maior_que",
  "maior_ou_igual",
  "menor_que",
  "menor_ou_igual",
  "igual",
]);

/** Condição recursiva (comparação, e, ou, não), como no motor. */
function validateOccurrenceCondition(
  value: unknown,
  file: string,
  path: string,
  diagnostics: ContentDiagnostic[],
): void {
  if (!isObject(value)) {
    diagnostics.push(
      diagnostic(file, path, "TIPO_INVALIDO", "Deve ser uma condição."),
    );
    return;
  }
  if (value.tipo === "comparacao") {
    validateKnownFields(
      value,
      file,
      ["tipo", "variavel", "operador", "valor"],
      diagnostics,
    );
    requiredString(value, file, `${path}.variavel`, diagnostics);
    if (typeof value.operador !== "string" || !COMPARISONS.has(value.operador))
      diagnostics.push(
        diagnostic(
          file,
          `${path}.operador`,
          "VALOR_INVALIDO",
          "Operador não suportado.",
        ),
      );
    requiredNumber(value, file, `${path}.valor`, diagnostics);
  } else if (value.tipo === "e" || value.tipo === "ou") {
    validateKnownFields(value, file, ["tipo", "condicoes"], diagnostics);
    if (!Array.isArray(value.condicoes) || value.condicoes.length === 0)
      diagnostics.push(
        diagnostic(
          file,
          `${path}.condicoes`,
          "VALOR_INVALIDO",
          "Deve ser uma lista não vazia.",
        ),
      );
    else
      value.condicoes.forEach((item, i) =>
        validateOccurrenceCondition(
          item,
          file,
          `${path}.condicoes[${i}]`,
          diagnostics,
        ),
      );
  } else if (value.tipo === "nao") {
    validateKnownFields(value, file, ["tipo", "condicao"], diagnostics);
    validateOccurrenceCondition(
      value.condicao,
      file,
      `${path}.condicao`,
      diagnostics,
    );
  } else
    diagnostics.push(
      diagnostic(
        file,
        `${path}.tipo`,
        "VALOR_INVALIDO",
        "Use comparacao, e, ou ou nao.",
      ),
    );
}

function validateFollowUps(
  value: unknown,
  file: string,
  path: string,
  diagnostics: ContentDiagnostic[],
): void {
  if (!Array.isArray(value)) {
    diagnostics.push(
      diagnostic(file, path, "TIPO_INVALIDO", "Deve ser uma lista."),
    );
    return;
  }
  value.forEach((item, i) => {
    const itemPath = `${path}[${i}]`;
    if (!isObject(item)) {
      diagnostics.push(
        diagnostic(file, itemPath, "TIPO_INVALIDO", "Deve ser um objeto."),
      );
      return;
    }
    validateKnownFields(
      item,
      file,
      ["ocorrencia", "chance", "emTurnos"],
      diagnostics,
    );
    requiredString(item, file, `${itemPath}.ocorrencia`, diagnostics);
    const chance = requiredNumber(
      item,
      file,
      `${itemPath}.chance`,
      diagnostics,
    );
    if (chance !== undefined && (chance <= 0 || chance > 1))
      diagnostics.push(
        diagnostic(
          file,
          `${itemPath}.chance`,
          "VALOR_INVALIDO",
          "A chance vai de 0 (exclusivo) a 1.",
        ),
      );
    const window = item.emTurnos;
    if (
      !Array.isArray(window) ||
      window.length !== 2 ||
      !window.every((n) => Number.isInteger(n) && n >= 1) ||
      window[0] > window[1]
    )
      diagnostics.push(
        diagnostic(
          file,
          `${itemPath}.emTurnos`,
          "VALOR_INVALIDO",
          "Use [mínimo, máximo] em turnos, a partir de 1.",
        ),
      );
  });
}

/** Campos do SG106: origem, nível, gatilho, duração, desdobramentos e opções. */
function validateOccurrenceDrama(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): void {
  for (const field of ["manchete", "controle", "padrao"])
    if (value[field] !== undefined)
      requiredString(value, file, field, diagnostics);
  if (
    value.origem !== undefined &&
    (typeof value.origem !== "string" || !OCCURRENCE_ORIGINS.has(value.origem))
  )
    diagnostics.push(
      diagnostic(file, "origem", "VALOR_INVALIDO", "Origem não suportada."),
    );
  if (
    value.nivel !== undefined &&
    (typeof value.nivel !== "number" || ![1, 2, 3, 4].includes(value.nivel))
  )
    diagnostics.push(
      diagnostic(file, "nivel", "VALOR_INVALIDO", "Use um nível de 1 a 4."),
    );
  if (value.unica !== undefined && typeof value.unica !== "boolean")
    diagnostics.push(
      diagnostic(
        file,
        "unica",
        "TIPO_INVALIDO",
        "Deve ser verdadeiro ou falso.",
      ),
    );
  const integer = (owner: JsonObject, path: string, minimum: number) => {
    const n = requiredNumber(owner, file, path, diagnostics);
    if (n !== undefined && (!Number.isInteger(n) || n < minimum))
      diagnostics.push(
        diagnostic(
          file,
          path,
          "VALOR_INVALIDO",
          `Deve ser um inteiro a partir de ${minimum}.`,
        ),
      );
  };
  if (value.duracaoMeses !== undefined) integer(value, "duracaoMeses", 1);
  if (value.intervaloMinimoTurnos !== undefined)
    integer(value, "intervaloMinimoTurnos", 0);
  if (value.desdobramentos !== undefined)
    validateFollowUps(
      value.desdobramentos,
      file,
      "desdobramentos",
      diagnostics,
    );
  if (value.gatilho !== undefined) {
    const trigger = value.gatilho;
    if (!isObject(trigger))
      diagnostics.push(
        diagnostic(file, "gatilho", "TIPO_INVALIDO", "Deve ser um objeto."),
      );
    else {
      validateKnownFields(
        trigger,
        file,
        ["chance", "fatores", "condicao", "porTurnos", "reacao"],
        diagnostics,
      );
      const p = requiredNumber(trigger, file, "gatilho.chance", diagnostics);
      if (p !== undefined && (p < 0 || p > 1))
        diagnostics.push(
          diagnostic(
            file,
            "gatilho.chance",
            "VALOR_INVALIDO",
            "A chance por turno vai de 0 a 1.",
          ),
        );
      if (trigger.condicao !== undefined)
        validateOccurrenceCondition(
          trigger.condicao,
          file,
          "gatilho.condicao",
          diagnostics,
        );
      if (trigger.porTurnos !== undefined)
        integer(trigger, "gatilho.porTurnos", 1);
      const factors = trigger.fatores;
      if (factors !== undefined && !Array.isArray(factors))
        diagnostics.push(
          diagnostic(
            file,
            "gatilho.fatores",
            "TIPO_INVALIDO",
            "Deve ser uma lista.",
          ),
        );
      else
        (factors ?? []).forEach((factor, index) => {
          const path = `gatilho.fatores[${index}]`;
          if (!isObject(factor)) {
            diagnostics.push(
              diagnostic(file, path, "TIPO_INVALIDO", "Deve ser um objeto."),
            );
            return;
          }
          validateKnownFields(
            factor,
            file,
            ["variavel", "de", "ate", "multiplica"],
            diagnostics,
          );
          requiredString(factor, file, `${path}.variavel`, diagnostics);
          const from = requiredNumber(factor, file, `${path}.de`, diagnostics);
          const to = requiredNumber(factor, file, `${path}.ate`, diagnostics);
          const times = requiredNumber(
            factor,
            file,
            `${path}.multiplica`,
            diagnostics,
          );
          if (from !== undefined && to !== undefined && from === to)
            diagnostics.push(
              diagnostic(
                file,
                `${path}.ate`,
                "VALOR_INVALIDO",
                "de e ate precisam ser diferentes.",
              ),
            );
          if (times !== undefined && times <= 0)
            diagnostics.push(
              diagnostic(
                file,
                `${path}.multiplica`,
                "VALOR_INVALIDO",
                "O multiplicador precisa ser positivo.",
              ),
            );
        });
      if (trigger.reacao !== undefined) {
        const reaction = trigger.reacao;
        if (!isObject(reaction))
          diagnostics.push(
            diagnostic(
              file,
              "gatilho.reacao",
              "TIPO_INVALIDO",
              "Deve ser um objeto.",
            ),
          );
        else {
          validateKnownFields(
            reaction,
            file,
            ["controle", "para", "sobe", "desce", "janelaTurnos"],
            diagnostics,
          );
          requiredString(
            reaction,
            file,
            "gatilho.reacao.controle",
            diagnostics,
          );
          integer(reaction, "gatilho.reacao.janelaTurnos", 1);
          const ways = ["para", "sobe", "desce"].filter(
            (k) => reaction[k] !== undefined,
          );
          if (ways.length !== 1)
            diagnostics.push(
              diagnostic(
                file,
                "gatilho.reacao",
                "VALOR_INVALIDO",
                "Use para, sobe ou desce (só um).",
              ),
            );
          if (
            reaction.para !== undefined &&
            (!Array.isArray(reaction.para) ||
              !reaction.para.every((n) => typeof n === "number"))
          )
            diagnostics.push(
              diagnostic(
                file,
                "gatilho.reacao.para",
                "VALOR_INVALIDO",
                "Deve ser uma lista de valores.",
              ),
            );
          for (const k of ["sobe", "desce"])
            if (reaction[k] !== undefined) {
              const n = requiredNumber(
                reaction,
                file,
                `gatilho.reacao.${k}`,
                diagnostics,
              );
              if (n !== undefined && n <= 0)
                diagnostics.push(
                  diagnostic(
                    file,
                    `gatilho.reacao.${k}`,
                    "VALOR_INVALIDO",
                    "Deve ser positivo.",
                  ),
                );
            }
        }
      }
    }
  }
  if (value.opcoes !== undefined) {
    if (!Array.isArray(value.opcoes)) {
      diagnostics.push(
        diagnostic(file, "opcoes", "TIPO_INVALIDO", "Deve ser uma lista."),
      );
      return;
    }
    value.opcoes.forEach((option, index) => {
      const path = `opcoes[${index}]`;
      if (!isObject(option)) {
        diagnostics.push(
          diagnostic(file, path, "TIPO_INVALIDO", "Deve ser um objeto."),
        );
        return;
      }
      validateKnownFields(
        option,
        file,
        [
          "id",
          "rotulo",
          "descricao",
          "controle",
          "duracaoMeses",
          "consequencias",
          "leis",
          "requer",
          "motivoRequer",
          "desdobramentos",
        ],
        diagnostics,
      );
      requiredString(option, file, `${path}.id`, diagnostics);
      requiredString(option, file, `${path}.rotulo`, diagnostics);
      requiredString(option, file, `${path}.controle`, diagnostics);
      for (const field of ["descricao", "motivoRequer"])
        if (option[field] !== undefined)
          requiredString(option, file, `${path}.${field}`, diagnostics);
      integer(option, `${path}.duracaoMeses`, 1);
      requiredStringArray(option, file, `${path}.consequencias`, diagnostics);
      if (option.requer !== undefined)
        validateOccurrenceCondition(
          option.requer,
          file,
          `${path}.requer`,
          diagnostics,
        );
      if (option.desdobramentos !== undefined)
        validateFollowUps(
          option.desdobramentos,
          file,
          `${path}.desdobramentos`,
          diagnostics,
        );
      if (option.leis !== undefined) {
        if (!Array.isArray(option.leis))
          diagnostics.push(
            diagnostic(
              file,
              `${path}.leis`,
              "TIPO_INVALIDO",
              "Deve ser uma lista.",
            ),
          );
        else
          option.leis.forEach((law, i) => {
            const lawPath = `${path}.leis[${i}]`;
            if (!isObject(law)) {
              diagnostics.push(
                diagnostic(
                  file,
                  lawPath,
                  "TIPO_INVALIDO",
                  "Deve ser um objeto.",
                ),
              );
              return;
            }
            validateKnownFields(law, file, ["lei", "nivel"], diagnostics);
            requiredString(law, file, `${lawPath}.lei`, diagnostics);
            requiredNumber(law, file, `${lawPath}.nivel`, diagnostics);
          });
      }
    });
  }
}

export function validateContentFile(
  file: string,
  text: string,
): ValidationResult<ContentFile> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      ok: false,
      diagnostics: [
        diagnostic(
          file,
          "$",
          "JSON_INVALIDO",
          "O arquivo não contém JSON válido.",
        ),
      ],
    };
  }
  if (!isObject(parsed)) {
    return {
      ok: false,
      diagnostics: [
        diagnostic(
          file,
          "$",
          "TIPO_INVALIDO",
          "O conteúdo deve ser um objeto JSON.",
        ),
      ],
    };
  }
  const tipo = parsed.tipo;
  if (typeof tipo !== "string") {
    return {
      ok: false,
      diagnostics: [
        diagnostic(
          file,
          "tipo",
          "CAMPO_AUSENTE",
          "Todo arquivo precisa informar seu tipo.",
        ),
      ],
    };
  }
  const diagnostics: ContentDiagnostic[] = [];
  let value: ContentFile | undefined;
  if (tipo === "cenario") value = validateManifest(parsed, file, diagnostics);
  else if (tipo === "mundo") value = validateWorld(parsed, file, diagnostics);
  else if (tipo === "organizacao-politica")
    value = validatePoliticalOrganization(parsed, file, diagnostics);
  else if (tipo === "variaveis")
    value = validateVariables(parsed, file, diagnostics);
  else if (tipo === "estado-inicial")
    value = validateInitialState(parsed, file, diagnostics);
  else if (tipo === "catalogo-politicas")
    value = validatePolicyCatalog(parsed, file, diagnostics);
  else if (policyTypes.has(tipo))
    value = validatePolicy(parsed, file, diagnostics);
  else if (tipo === "consequencia")
    value = validateConsequence(parsed, file, diagnostics);
  else if (["evento", "situacao", "dilema"].includes(tipo))
    value = validateOccurrence(parsed, file, diagnostics);
  else
    diagnostics.push(
      diagnostic(
        file,
        "tipo",
        "VALOR_INVALIDO",
        `Tipo de arquivo não suportado: ${tipo}.`,
      ),
    );
  return value && diagnostics.length === 0
    ? { ok: true, value }
    : { ok: false, diagnostics };
}
