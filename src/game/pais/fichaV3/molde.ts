/**
 * Verificador do molde das leis (docs/jogo/mecanicas/molde-das-leis.md):
 * as regras da ficha v4, por cima das que a v3 já confere.
 */
import type { ContentDiagnostic } from "../../../engine";
import type { Familia, FichaV3, FichaV4 } from "./tipos";
import { verificarFicha, type ContextoDaFicha } from "./verificar";

export const FAMILIAS: readonly Familia[] = [
  "imposto",
  "verba",
  "programa",
  "regra",
  "constitucional",
  "petrea",
];

const MAXIMO_DE_EFEITOS = 8;
const MAXIMO_DE_OPCOES = 3;
/** Mínimo de leis por área; sem teto (decisão do autor, 22/out). */
const MINIMO_POR_AREA = 8;

/** Regras da v3 que a v4 troca pelas suas (campo exato do diagnóstico). */
const TROCADAS_NA_V4 = new Set([
  "fontes",
  "ministerio",
  "area",
  "descricao",
  "efeitos",
  "controle.opcoes",
]);

export type ContextoDoMolde = ContextoDaFicha &
  Readonly<{ areas: ReadonlySet<string> }>;

export function verificarMolde(
  ficha: FichaV4,
  arquivo: string,
  contexto: ContextoDoMolde,
): ContentDiagnostic[] {
  const comoV3 = {
    ...ficha,
    versaoEsquema: 3,
    descricao: ficha.decide,
    area: ficha.area ?? "centro",
    ministerio: ficha.ministerio ?? "-",
    fontes: ficha.fontes ?? [],
  } as unknown as FichaV3;
  const erros = verificarFicha(comoV3, arquivo, contexto).filter(
    (e) => !TROCADAS_NA_V4.has(e.field) && !e.field.startsWith("fontes."),
  );
  const push = (
    field: string,
    message: string,
    code: ContentDiagnostic["code"] = "VALOR_INVALIDO",
  ) => erros.push({ code, file: arquivo, field, message });

  const familia = ficha.familia;
  if (!FAMILIAS.includes(familia))
    push("familia", `A família deve ser uma de: ${FAMILIAS.join(", ")}.`);

  const decide = typeof ficha.decide === "string" ? ficha.decide.trim() : "";
  if (decide === "")
    push("decide", "A lei precisa dizer o que decide.", "CAMPO_AUSENTE");
  else if (decide.endsWith("?"))
    push("decide", "O que a lei decide é uma frase afirmativa, não pergunta.");

  if (familia === "petrea") {
    if (ficha.area !== undefined)
      push("area", "A pétrea fica no centro e não tem área.");
  } else if (ficha.area === undefined)
    push("area", "A lei precisa de uma das 11 áreas.", "CAMPO_AUSENTE");
  else if (!contexto.areas.has(ficha.area))
    push(
      "area",
      `A área ${ficha.area} não é uma das 11 do mundo.`,
      "REFERENCIA_QUEBRADA",
    );

  const constituicao = familia === "constitucional" || familia === "petrea";
  if (constituicao && ficha.nivel !== "constituicao")
    push("nivel", "Lei constitucional ou pétrea tem nível constituicao.");
  if (!constituicao && ficha.nivel === "constituicao")
    push("nivel", "Lei de nível constituicao é constitucional ou pétrea.");
  if (familia === "petrea" && ficha.petrea !== true)
    push("petrea", "A pétrea precisa de petrea: true.");

  const efeitos = Array.isArray(ficha.efeitos) ? ficha.efeitos : [];
  if (efeitos.length < 1 || efeitos.length > MAXIMO_DE_EFEITOS)
    push(
      "efeitos",
      `A lei tem de 1 a ${MAXIMO_DE_EFEITOS} efeitos na rede; esta tem ${efeitos.length}.`,
    );

  const opcoes = ficha.controle?.opcoes ?? [];
  if ((familia === "regra" || constituicao) && opcoes.length > MAXIMO_DE_OPCOES)
    push(
      "controle.opcoes",
      `Regra e constitucional têm no máximo ${MAXIMO_DE_OPCOES} opções.`,
    );
  opcoes.forEach((o, i) => {
    if (typeof o.propoe !== "string" || o.propoe.trim() === "")
      push(
        `controle.opcoes.${i}.propoe`,
        "Cada opção diz o que propõe, numa frase.",
        "CAMPO_AUSENTE",
      );
  });

  if (familia === "constitucional" && (ficha.trava ?? []).length === 0)
    push(
      "trava",
      "A constitucional diz o que trava em outras leis.",
      "CAMPO_AUSENTE",
    );
  const ids = new Set(opcoes.map((o) => o.id));
  (ficha.trava ?? []).forEach((t, i) => {
    if (!contexto.leis.has(t.lei))
      push(
        `trava.${i}.lei`,
        `A lei ${t.lei} não existe no catálogo.`,
        "REFERENCIA_QUEBRADA",
      );
    if (!ids.has(t.opcao))
      push(
        `trava.${i}.opcao`,
        `A opção ${t.opcao} não existe nesta lei.`,
        "REFERENCIA_QUEBRADA",
      );
  });

  if (familia === "imposto" && ficha.dinheiro?.tipo !== "receita")
    push("dinheiro", "Imposto arrecada: dinheiro.tipo deve ser receita.");
  if (
    (familia === "verba" || familia === "programa") &&
    ficha.dinheiro?.tipo !== "gasto"
  )
    push("dinheiro", "Verba e programa gastam: dinheiro.tipo deve ser gasto.");
  if (familia === "programa") {
    const p = ficha.publico;
    if (!p || !p.quem?.trim() || !(p.pessoas > 0))
      push(
        "publico",
        "O programa diz quem recebe e quantas pessoas.",
        "CAMPO_AUSENTE",
      );
  }

  return erros;
}

/** Áreas com menos de 8 leis, contando o catálogo inteiro. Só aviso. */
export function avisosPorArea(
  leis: readonly { id: string; area?: string }[],
  areas: readonly string[],
): string[] {
  return areas.flatMap((area) => {
    const n = leis.filter((l) => l.area === area).length;
    return n < MINIMO_POR_AREA
      ? [`${area}: ${n} leis (o molde pede pelo menos ${MINIMO_POR_AREA})`]
      : [];
  });
}
