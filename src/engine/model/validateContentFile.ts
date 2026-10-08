import type {
  ContentDiagnostic,
  ValidationResult,
} from "../diagnostics/contentDiagnostic";
import {
  supportedMechanisms,
  type ConsequenceFile,
  type ContentFile,
  type InitialStateFile,
  type OccurrenceFile,
  type PolicyFile,
  type PolicyCatalogFile,
  type PoliticalOrganizationFile,
  type ScenarioManifest,
  type VariablesFile,
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
    ],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
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
  const variaveis = requiredString(value, file, "variaveis", diagnostics);
  const politicas =
    value.politicas === undefined
      ? undefined
      : requiredStringArray(value, file, "politicas", diagnostics);
  const catalogoPoliticas =
    value.catalogoPoliticas === undefined
      ? undefined
      : requiredString(value, file, "catalogoPoliticas", diagnostics);
  if ((politicas === undefined) === (catalogoPoliticas === undefined))
    diagnostics.push(
      diagnostic(
        file,
        "politicas",
        "VALOR_INVALIDO",
        "Informe exatamente politicas ou catalogoPoliticas.",
      ),
    );
  const consequencias = requiredStringArray(
    value,
    file,
    "consequencias",
    diagnostics,
  );
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
    (!politicas && !catalogoPoliticas) ||
    !consequencias
  )
    return undefined;
  return value as ScenarioManifest;
}

function validatePolicyCatalog(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): PolicyCatalogFile | undefined {
  validateKnownFields(
    value,
    file,
    ["id", "tipo", "versaoEsquema", "politicas"],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  requiredStringArray(value, file, "politicas", diagnostics);
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
          "area",
          "avaliacao",
        ],
        diagnostics,
      );
      requiredString(item, file, `variaveis[${index}].id`, diagnostics);
      const type = requiredString(
        item,
        file,
        `variaveis[${index}].tipo`,
        diagnostics,
      );
      if (
        type !== undefined &&
        !["controle", "calculado", "estoque"].includes(type)
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
      requiredNumber(
        item,
        file,
        `variaveis[${index}].valorInicial`,
        diagnostics,
      );
    });
  }
  return diagnostics.length === 0 ? (value as VariablesFile) : undefined;
}

function validateInitialState(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): InitialStateFile | undefined {
  validateKnownFields(
    value,
    file,
    ["id", "tipo", "versaoEsquema", "valores", "politicasVigentes"],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
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
  if (
    value.politicasVigentes !== undefined &&
    (!Array.isArray(value.politicasVigentes) ||
      value.politicasVigentes.some(
        (item) =>
          !isObject(item) ||
          typeof item.politica !== "string" ||
          typeof item.nivelDesejado !== "number" ||
          !Number.isFinite(item.nivelDesejado) ||
          typeof item.nivelImplantado !== "number" ||
          !Number.isFinite(item.nivelImplantado),
      ))
  )
    diagnostics.push(
      diagnostic(
        file,
        "politicasVigentes",
        "VALOR_INVALIDO",
        "Cada política vigente exige política, nível desejado e nível implantado finitos.",
      ),
    );
  return diagnostics.length === 0 ? (value as InitialStateFile) : undefined;
}

function validatePolicy(
  value: JsonObject,
  file: string,
  diagnostics: ContentDiagnostic[],
): PolicyFile | undefined {
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
      "categoria",
      "fonte",
      "icone",
      "ministerio",
      "respostaTemporal",
      "processoAutorizacao",
      "controle",
      "consequencias",
    ],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  requiredString(value, file, "nome", diagnostics);
  requiredString(value, file, "descricao", diagnostics);
  if (value.area !== undefined)
    requiredString(value, file, "area", diagnostics);
  if (value.categoria !== undefined)
    requiredString(value, file, "categoria", diagnostics);
  if (value.icone !== undefined)
    requiredString(value, file, "icone", diagnostics);
  if (value.fonte !== undefined)
    requiredString(value, file, "fonte", diagnostics);
  if (value.ministerio !== undefined)
    requiredString(value, file, "ministerio", diagnostics);
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
      ["variavel", "modo", "unidade", "opcoes"],
      diagnostics,
    );
    requiredString(value.controle, file, "controle.variavel", diagnostics);
    requiredString(value.controle, file, "controle.modo", diagnostics);
    requiredString(value.controle, file, "controle.unidade", diagnostics);
    if (value.controle.opcoes !== undefined) {
      if (!Array.isArray(value.controle.opcoes))
        diagnostics.push(
          diagnostic(
            file,
            "controle.opcoes",
            "TIPO_INVALIDO",
            "Deve ser uma lista.",
          ),
        );
      else
        value.controle.opcoes.forEach((option, index) => {
          if (!isObject(option)) {
            diagnostics.push(
              diagnostic(
                file,
                `controle.opcoes[${index}]`,
                "TIPO_INVALIDO",
                "Deve ser um objeto.",
              ),
            );
            return;
          }
          validateKnownFields(option, file, ["valor", "rotulo"], diagnostics);
          requiredNumber(
            option,
            file,
            `controle.opcoes[${index}].valor`,
            diagnostics,
          );
          requiredString(
            option,
            file,
            `controle.opcoes[${index}].rotulo`,
            diagnostics,
          );
        });
    }
  }
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
      "unidade",
      "atrasoPassos",
      "duracao",
    ],
    diagnostics,
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
    validateKnownFields(
      value.parametros,
      file,
      ["coeficiente", "termoConstante"],
      diagnostics,
    );
    requiredNumber(
      value.parametros,
      file,
      "parametros.coeficiente",
      diagnostics,
    );
    requiredNumber(
      value.parametros,
      file,
      "parametros.termoConstante",
      diagnostics,
    );
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
    ],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
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
