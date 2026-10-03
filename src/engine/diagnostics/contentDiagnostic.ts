export type ContentDiagnosticCode =
  | "JSON_INVALIDO"
  | "TIPO_INVALIDO"
  | "CAMPO_AUSENTE"
  | "CAMPO_DESCONHECIDO"
  | "VALOR_INVALIDO"
  | "MECANISMO_NAO_SUPORTADO"
  | "ARQUIVO_AUSENTE"
  | "ARQUIVO_DUPLICADO"
  | "TIPO_DE_ARQUIVO_INCORRETO"
  | "ID_DUPLICADO"
  | "REFERENCIA_QUEBRADA"
  | "COERENCIA_INVALIDA"
  | "COMANDO_INVALIDO"
  | "CALCULO_INVALIDO"
  | "SNAPSHOT_INVALIDO";

export type ContentDiagnostic = {
  code: ContentDiagnosticCode;
  file: string;
  field: string;
  message: string;
};

export type ValidationResult<T> =
  { ok: true; value: T } | { ok: false; diagnostics: ContentDiagnostic[] };
