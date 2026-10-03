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
  const candidate = value[field];
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
      "consequencias",
      "eventos",
      "situacoes",
      "dilemas",
      "perfis",
    ],
    diagnostics,
  );
  validateEnvelope(value, file, diagnostics);
  const nome = requiredString(value, file, "nome", diagnostics);
  const estadoInicial = requiredString(
    value,
    file,
    "estadoInicial",
    diagnostics,
  );
  const variaveis = requiredString(value, file, "variaveis", diagnostics);
  const politicas = requiredStringArray(value, file, "politicas", diagnostics);
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
  if (value.perfis !== undefined) {
    if (!Array.isArray(value.perfis))
      diagnostics.push(diagnostic(file, "perfis", "TIPO_INVALIDO", "Deve ser uma lista."));
    else
      value.perfis.forEach((profile, index) => {
        if (!isObject(profile)) {
          diagnostics.push(diagnostic(file, `perfis[${index}]`, "TIPO_INVALIDO", "Deve ser um objeto."));
          return;
        }
        validateKnownFields(profile, file, ["id", "nome", "peso", "interesses"], diagnostics);
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
    !politicas ||
    !consequencias
  )
    return undefined;
  return value as ScenarioManifest;
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
    ["id", "tipo", "versaoEsquema", "valores"],
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
          diagnostic(file, "controle.opcoes", "TIPO_INVALIDO", "Deve ser uma lista."),
        );
      else
        value.controle.opcoes.forEach((option, index) => {
          if (!isObject(option)) {
            diagnostics.push(
              diagnostic(file, `controle.opcoes[${index}]`, "TIPO_INVALIDO", "Deve ser um objeto."),
            );
            return;
          }
          validateKnownFields(option, file, ["valor", "rotulo"], diagnostics);
          requiredNumber(option, file, `controle.opcoes[${index}].valor`, diagnostics);
          requiredString(option, file, `controle.opcoes[${index}].rotulo`, diagnostics);
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
  else if (tipo === "variaveis")
    value = validateVariables(parsed, file, diagnostics);
  else if (tipo === "estado-inicial")
    value = validateInitialState(parsed, file, diagnostics);
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
