export type DomainErrorCode =
  | "ESTADO_INVALIDO"
  | "NIVEL_INVALIDO"
  | "DECISAO_INVALIDA"
  | "DEFINICAO_INVALIDA"
  | "CONFLITO_DE_PROPOSTA";

export type DomainError = Readonly<{
  code: DomainErrorCode;
  message: string;
}>;

export type DomainResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; error: DomainError }>;

export function domainFailure<T>(
  code: DomainErrorCode,
  message: string,
): DomainResult<T> {
  return { ok: false, error: { code, message } };
}
