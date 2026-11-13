// Arquivos dos países (conteudo/paises/<país>/*.json), lidos uma vez.
const arquivosPaises = import.meta.glob("../conteudo/paises/*/*.json", {
  eager: true,
  import: "default",
});

export const temArquivoDoPais = (pais: string, nome: string): boolean =>
  `../conteudo/paises/${pais}/${nome}.json` in arquivosPaises;

export function arquivoPais<T>(pais: string, nome: string): T {
  const caminho = `../conteudo/paises/${pais}/${nome}.json`;
  const dado = arquivosPaises[caminho] as { versao?: unknown } | undefined;
  if (!dado) throw new Error(`país "${pais}": falta ${nome}.json`);
  if (dado.versao !== 1) throw new Error(`${caminho} › versao: precisa ser 1`);
  return dado as T;
}

export function paisesDisponiveis(): string[] {
  return [
    ...new Set(
      Object.keys(arquivosPaises).map((c) => c.split("/").at(-2) as string),
    ),
  ];
}

/** Países que a tela inicial sabe começar: têm elenco de pessoas e governo. */
export const paisesJogaveis = (): string[] =>
  paisesDisponiveis().filter(
    (p) => temArquivoDoPais(p, "pessoas") && temArquivoDoPais(p, "governo"),
  );
