import type {
  ContentDiagnostic,
  PackageFiles,
  ValidationResult,
  VariableDefinition,
} from "../../../engine";
import { converterFicha } from "./converter";
import type { FichaV3 } from "./tipos";
import { verificarFicha, type ContextoDaFicha } from "./verificar";

const FICHA_V3 = /"versaoEsquema"\s*:\s*3\b/;
const LEI = /"tipo"\s*:\s*"lei"/;
const CONTAINER = /"tipo"\s*:\s*"(mundo|cenario)"/;

type Container = {
  path: string;
  json: Record<string, unknown> & { consequencias?: string[] };
  politicas: string[];
  variaveis?: string;
};

function ehFichaV3(text: string | undefined): boolean {
  return text !== undefined && FICHA_V3.test(text) && LEI.test(text);
}

function parse(text: string | undefined): Record<string, unknown> | undefined {
  if (text === undefined) return undefined;
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((x): x is string => typeof x === "string")
    : [];
}

function containers(files: PackageFiles): Container[] {
  return Object.entries(files).flatMap(([path, text]) => {
    if (!CONTAINER.test(text)) return [];
    const json = parse(text);
    if (!json || (json.tipo !== "mundo" && json.tipo !== "cenario")) return [];
    const catalogo =
      typeof json.catalogoPoliticas === "string"
        ? parse(files[json.catalogoPoliticas])
        : undefined;
    return [
      {
        path,
        json: json as Container["json"],
        politicas: strings(catalogo?.politicas ?? json.politicas),
        ...(typeof json.variaveis === "string"
          ? { variaveis: json.variaveis }
          : {}),
      },
    ];
  });
}

function contextoDe(
  container: Container,
  files: PackageFiles,
): ContextoDaFicha {
  const variaveis = new Map<string, VariableDefinition>();
  const arquivo = parse(container.variaveis && files[container.variaveis]);
  for (const variavel of (arquivo?.variaveis ?? []) as VariableDefinition[])
    variaveis.set(variavel.id, variavel);
  const leis = new Map<string, readonly string[]>();
  for (const path of container.politicas) {
    const lei = parse(files[path]) as
      { id?: string; controle?: { opcoes?: { id: string }[] } } | undefined;
    if (typeof lei?.id === "string")
      leis.set(
        lei.id,
        (lei.controle?.opcoes ?? []).map((opcao) => opcao.id),
      );
  }
  return { variaveis, leis };
}

/** Caminho da consequência gerada: o arquivo da ficha mais o id do efeito. */
export function caminhoDoEfeito(ficha: string, id: string): string {
  return `${ficha}#${id}`;
}

/**
 * Converte as fichas v3 do pacote para o formato que o motor lê, sem tocar no
 * resto: a lei v2 fica no caminho da ficha, cada efeito vira uma consequência
 * em `<ficha>#<id>`, e o mundo (ou cenário) que lista a lei passa a listar
 * essas consequências. Pacote sem ficha v3 volta igual.
 */
export function expandirFichasV3(
  files: PackageFiles,
): ValidationResult<PackageFiles> {
  if (!Object.values(files).some(ehFichaV3)) return { ok: true, value: files };
  const out: Record<string, string> = { ...files };
  const diagnostics: ContentDiagnostic[] = [];
  const convertidas = new Map<string, string[]>();
  for (const container of containers(files)) {
    const fichas = container.politicas.filter((p) => ehFichaV3(files[p]));
    if (fichas.length === 0) continue;
    const contexto = contextoDe(container, files);
    const geradas: string[] = [];
    for (const path of fichas) {
      let caminhos = convertidas.get(path);
      if (!caminhos) {
        const ficha = parse(files[path]) as FichaV3 | undefined;
        if (!ficha) {
          diagnostics.push({
            code: "JSON_INVALIDO",
            file: path,
            field: "$",
            message: "A ficha não é um JSON válido.",
          });
          continue;
        }
        const erros = verificarFicha(ficha, path, contexto);
        if (erros.length > 0) {
          diagnostics.push(...erros);
          continue;
        }
        const { lei, consequencias } = converterFicha(
          ficha,
          contexto.variaveis,
        );
        out[path] = JSON.stringify(lei);
        caminhos = consequencias.map((c) => {
          const caminho = caminhoDoEfeito(path, c.id);
          out[caminho] = JSON.stringify(c);
          return caminho;
        });
        convertidas.set(path, caminhos);
      }
      geradas.push(...caminhos);
    }
    out[container.path] = JSON.stringify({
      ...container.json,
      consequencias: [...strings(container.json.consequencias), ...geradas],
    });
  }
  return diagnostics.length > 0
    ? { ok: false, diagnostics }
    : { ok: true, value: out };
}

export type RelatorioDeMigracao = Readonly<{
  total: number;
  migradas: readonly string[];
  faltam: readonly string[];
}>;

/** Quantas leis do catálogo já estão no formato v3 e quantas faltam. */
export function relatorioDeMigracao(
  files: PackageFiles,
  catalogo: string,
): RelatorioDeMigracao {
  const migradas: string[] = [];
  const faltam: string[] = [];
  for (const path of strings(parse(files[catalogo])?.politicas)) {
    const id = String(parse(files[path])?.id ?? path);
    (ehFichaV3(files[path]) ? migradas : faltam).push(id);
  }
  return { total: migradas.length + faltam.length, migradas, faltam };
}
