import type {
  ContentDiagnostic,
  InitialStateFile,
  PackageFiles,
  ScenarioManifest,
  ValidationResult,
} from "../../../engine";
import {
  caracteristicasDoPais,
  type EconomiaDoPais,
  type HistoriaDoPais,
  type LeisDoPais,
  type PaisV2,
  type PoliticaDoPais,
  type PopulacaoDoPais,
  type RequerCaracteristicas,
  type ValoresDoPais,
} from "./tipos";

export type PacoteDoPais = Readonly<{
  manifestPath: string;
  files: PackageFiles;
}>;

type Json = Record<string, unknown>;

function parse(text: string | undefined): Json | undefined {
  if (text === undefined) return undefined;
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Json)
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

/** `requer` de características: objeto com `exige` e/ou `proibe`. */
function requerDe(
  arquivo: Json | undefined,
): RequerCaracteristicas | undefined {
  const requer = arquivo?.requer;
  return requer &&
    typeof requer === "object" &&
    !Array.isArray(requer) &&
    ("exige" in requer || "proibe" in requer)
    ? (requer as RequerCaracteristicas)
    : undefined;
}

/** O país atende ao `requer`? Sem `requer`, sempre. */
export function atendeRequer(
  requer: RequerCaracteristicas | undefined,
  caracteristicas: ReadonlySet<string>,
): boolean {
  if (!requer) return true;
  return (
    (requer.exige ?? []).every((c) => caracteristicas.has(c)) &&
    !(requer.proibe ?? []).some((c) => caracteristicas.has(c))
  );
}

export const ARQUIVOS_DO_PAIS = [
  "politica",
  "economia",
  "leis",
  "valores",
  "populacao",
  "historia",
] as const;

/**
 * País no formato da versão 1 (V1-06): `pais.json` com características e seis
 * arquivos na mesma pasta. Gera o manifesto e o estado inicial que o motor lê
 * e tira do pacote as leis, eventos e dilemas cujo `requer` o país não atende.
 * Manifesto em outro formato volta igual.
 */
export function expandirPais(
  manifestPath: string,
  files: PackageFiles,
): ValidationResult<PacoteDoPais> {
  const manifesto = parse(files[manifestPath]);
  if (manifesto?.tipo !== "pais" || manifesto.versaoEsquema !== 2)
    return { ok: true, value: { manifestPath, files } };
  const pais = manifesto as unknown as PaisV2;
  const pasta = manifestPath.slice(0, manifestPath.lastIndexOf("/") + 1);
  const diagnostics: ContentDiagnostic[] = [];
  const erro = (
    file: string,
    field: string,
    message: string,
    code: ContentDiagnostic["code"] = "VALOR_INVALIDO",
  ) => diagnostics.push({ code, file, field, message });

  const lidos: Partial<Record<(typeof ARQUIVOS_DO_PAIS)[number], Json>> = {};
  for (const nome of ARQUIVOS_DO_PAIS) {
    const caminho = `${pasta}${nome}.json`;
    const json = parse(files[caminho]);
    if (!json)
      erro(
        caminho,
        "$",
        files[caminho] === undefined
          ? "O país precisa deste arquivo."
          : "O arquivo não é um JSON válido.",
        files[caminho] === undefined ? "ARQUIVO_AUSENTE" : "JSON_INVALIDO",
      );
    else if (json.tipo !== `pais-${nome}`)
      erro(caminho, "tipo", `O tipo deve ser pais-${nome}.`, "TIPO_INVALIDO");
    else lidos[nome] = json;
  }
  const conhecidas = new Set<string>(caracteristicasDoPais);
  const caracteristicas = new Set(strings(pais.caracteristicas));
  for (const c of caracteristicas)
    if (!conhecidas.has(c))
      erro(
        manifestPath,
        "caracteristicas",
        `Característica desconhecida: ${c}.`,
      );
  const mundo = parse(files[pais.mundo]);
  if (!mundo)
    erro(
      manifestPath,
      "mundo",
      "O mundo do país não foi encontrado.",
      "REFERENCIA_QUEBRADA",
    );
  if (diagnostics.length > 0 || !mundo) return { ok: false, diagnostics };

  const politica = lidos.politica as unknown as PoliticaDoPais;
  const economia = lidos.economia as unknown as EconomiaDoPais;
  const leis = lidos.leis as unknown as LeisDoPais;
  const valores = lidos.valores as unknown as ValoresDoPais;
  const populacao = lidos.populacao as unknown as PopulacaoDoPais;
  const historia = lidos.historia as unknown as HistoriaDoPais;
  const out: Record<string, string> = { ...files };

  // Leis, eventos, situações e dilemas que o país não comporta saem do pacote.
  // O `requer` das ocorrências sai do arquivo: o motor não o conhece.
  const filtrar = (paths: readonly string[], ocorrencia: boolean) =>
    paths.filter((path) => {
      const arquivo = parse(files[path]);
      const requer = requerDe(arquivo);
      if (!requer) return true;
      if (!atendeRequer(requer, caracteristicas)) return false;
      if (ocorrencia) {
        const semRequer: Json = { ...arquivo };
        delete semRequer.requer;
        out[path] = JSON.stringify(semRequer);
      }
      return true;
    });
  const novoMundo: Json = { ...mundo };
  for (const lista of ["eventos", "situacoes", "dilemas"])
    if (Array.isArray(mundo[lista]))
      novoMundo[lista] = filtrar(strings(mundo[lista]), true);
  out[pais.mundo] = JSON.stringify(novoMundo);
  const catalogoPath =
    typeof mundo.catalogoPoliticas === "string" ? mundo.catalogoPoliticas : "";
  const catalogo = parse(files[catalogoPath]);
  const politicas = filtrar(strings(catalogo?.politicas), false);
  if (catalogo) out[catalogoPath] = JSON.stringify({ ...catalogo, politicas });

  // Lei em vigor tem de existir e caber no país.
  const leisDoPacote = new Set(
    politicas.map((path) => String(parse(files[path])?.id ?? "")),
  );
  leis.emVigor.forEach((vigente, i) => {
    if (!leisDoPacote.has(vigente.lei))
      erro(
        `${pasta}leis.json`,
        `emVigor.${i}.lei`,
        `A lei ${vigente.lei} está em vigor, mas não existe no catálogo ou exige uma característica que o país não tem.`,
        "REFERENCIA_QUEBRADA",
      );
  });
  if (diagnostics.length > 0) return { ok: false, diagnostics };

  const estadoPath = `${manifestPath}#estado-inicial`;
  const estado: InitialStateFile = {
    id: `${pais.id}-estado-inicial`,
    tipo: "estado-inicial",
    versaoEsquema: 1,
    cenario: {
      nome: pais.cenario.nome,
      ano: pais.cenario.ano,
      ...(pais.cenario.aquecimentoTrimestres !== undefined
        ? { aquecimentoMeses: pais.cenario.aquecimentoTrimestres * 3 }
        : {}),
    },
    indicesIniciais: valores.indices,
    economia: economia.economia,
    limitesProprios: economia.limitesProprios ?? [],
    leisVigentes: leis.emVigor,
    ...(politica.leisEleitorais
      ? { leisEleitoraisVigentes: politica.leisEleitorais }
      : {}),
    ...(politica.estadoPolitico ? { politica: politica.estadoPolitico } : {}),
    valores: { ...leis.controles, ...valores.estoques },
    ...(historia.lugares ? { lugares: historia.lugares } : {}),
  };
  out[estadoPath] = JSON.stringify(estado);
  let organizacaoPath: string | undefined;
  if (politica.organizacao) {
    organizacaoPath = `${pasta}politica.json#organizacao`;
    out[organizacaoPath] = JSON.stringify(politica.organizacao);
  }
  const cenario: ScenarioManifest = {
    id: pais.id,
    tipo: "cenario",
    versaoEsquema: 1,
    nome: pais.nome,
    unidadeTemporal: pais.unidadeTemporal,
    mundo: pais.mundo,
    ...(populacao.perfis ? { perfis: populacao.perfis } : {}),
    ...(organizacaoPath ? { organizacaoPolitica: organizacaoPath } : {}),
    estadoInicial: estadoPath,
  } as ScenarioManifest;
  const cenarioPath = `${manifestPath}#cenario`;
  out[cenarioPath] = JSON.stringify(cenario);
  return { ok: true, value: { manifestPath: cenarioPath, files: out } };
}
