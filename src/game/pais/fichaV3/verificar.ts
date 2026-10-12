import type { ContentDiagnostic, VariableDefinition } from "../../../engine";
import type { FichaV3 } from "./tipos";

/** O que o verificador precisa saber do resto do pacote. */
export type ContextoDaFicha = Readonly<{
  variaveis: ReadonlyMap<string, VariableDefinition>;
  /** Leis do catálogo (formato antigo e novo) e os ids das suas opções. */
  leis: ReadonlyMap<string, readonly string[]>;
}>;

const MINIMO_DE_EFEITOS = 3;
const MAXIMO_DE_EFEITOS = 8;
const OPCOES_POR_NIVEL = { constituicao: [2, 5], lei: [2, 5] } as const;

/**
 * Nomes de programas e órgãos de um país, que não entram no texto da lei
 * (conteudo.md 1.2). A história da lei pode citá-los; o nome e as opções, não.
 */
const NOMES_DE_PROGRAMA = [
  "Bolsa Família",
  "SUS",
  "Pix",
  "Minha Casa",
  "Mais Médicos",
  "Prouni",
  "Fies",
  "Obamacare",
  "Medicare",
  "NHS",
];

function erro(
  file: string,
  field: string,
  message: string,
  code: ContentDiagnostic["code"] = "VALOR_INVALIDO",
): ContentDiagnostic {
  return { code, file, field, message };
}

export function idDoEfeito(lei: string, alvo: string, id?: string): string {
  return id ?? `${lei}--${alvo.replaceAll("_", "-")}`;
}

function textoProibido(texto: string): string | undefined {
  if (texto.includes("—")) return "travessão (—)";
  return NOMES_DE_PROGRAMA.find((nome) =>
    new RegExp(`(^|[^\\p{L}])${nome}([^\\p{L}]|$)`, "u").test(texto),
  );
}

/** Confere a ficha contra as regras da versão 1 e o resto do pacote. */
export function verificarFicha(
  ficha: FichaV3,
  arquivo: string,
  contexto: ContextoDaFicha,
): ContentDiagnostic[] {
  const erros: ContentDiagnostic[] = [];
  const push = (
    field: string,
    message: string,
    code?: ContentDiagnostic["code"],
  ) => erros.push(erro(arquivo, field, message, code));

  for (const campo of [
    "id",
    "nome",
    "descricao",
    "area",
    "ministerio",
  ] as const)
    if (typeof ficha[campo] !== "string" || ficha[campo].trim() === "")
      push(campo, `A ficha precisa de ${campo}.`, "CAMPO_AUSENTE");

  // Fonte obrigatória, com link.
  const fontes = Array.isArray(ficha.fontes) ? ficha.fontes : [];
  if (fontes.length === 0)
    push(
      "fontes",
      "A ficha precisa de pelo menos uma fonte com link para os números.",
      "CAMPO_AUSENTE",
    );
  fontes.forEach((fonte, i) => {
    if (typeof fonte?.titulo !== "string" || fonte.titulo.trim() === "")
      push(`fontes.${i}.titulo`, "A fonte precisa de título.", "CAMPO_AUSENTE");
    if (typeof fonte?.url !== "string" || !/^https?:\/\//.test(fonte.url))
      push(`fontes.${i}.url`, "A fonte precisa de um link http ou https.");
  });

  // Nível e controle.
  if (!["constituicao", "lei", "decreto"].includes(ficha.nivel))
    push("nivel", "O nível deve ser constituicao, lei ou decreto.");
  if (ficha.petrea && ficha.nivel !== "constituicao")
    push("petrea", "Só uma regra da constituição pode ser pétrea.");
  const controle = contexto.variaveis.get(ficha.controle?.variavel);
  if (!controle || controle.tipo !== "controle")
    push(
      "controle.variavel",
      `O controle ${ficha.controle?.variavel} não existe entre as variáveis de controle.`,
      "REFERENCIA_QUEBRADA",
    );
  const opcoes = ficha.controle?.opcoes ?? [];
  if (ficha.nivel === "constituicao" || ficha.nivel === "lei") {
    const [minimo, maximo] = OPCOES_POR_NIVEL[ficha.nivel];
    if (opcoes.length < minimo || opcoes.length > maximo)
      push(
        "controle.opcoes",
        `Uma ${ficha.nivel === "lei" ? "lei" : "regra da constituição"} tem de ${minimo} a ${maximo} opções com nome.`,
      );
  } else if (opcoes.length !== 0 && opcoes.length !== 2)
    push(
      "controle.opcoes",
      "Um decreto é uma faixa (sem opções) ou liga e desliga (duas opções).",
    );

  // Efeitos.
  const efeitos = Array.isArray(ficha.efeitos) ? ficha.efeitos : [];
  if (efeitos.length < MINIMO_DE_EFEITOS || efeitos.length > MAXIMO_DE_EFEITOS)
    push(
      "efeitos",
      `A lei tem de ${MINIMO_DE_EFEITOS} a ${MAXIMO_DE_EFEITOS} efeitos; esta tem ${efeitos.length}.`,
    );
  const ids = new Set<string>();
  efeitos.forEach((efeito, i) => {
    const alvo = contexto.variaveis.get(efeito?.alvo);
    if (!alvo || alvo.tipo === "controle")
      push(
        `efeitos.${i}.alvo`,
        `O índice ${efeito?.alvo} não existe.`,
        "REFERENCIA_QUEBRADA",
      );
    if (efeito?.origem !== undefined && !contexto.variaveis.has(efeito.origem))
      push(
        `efeitos.${i}.origem`,
        `A origem ${efeito.origem} não existe.`,
        "REFERENCIA_QUEBRADA",
      );
    if (!Number.isInteger(efeito?.atraso) || efeito.atraso < 0)
      push(
        `efeitos.${i}.atraso`,
        "O atraso é um número inteiro de turnos, zero ou mais.",
      );
    const id = idDoEfeito(ficha.id, efeito?.alvo ?? "", efeito?.id);
    if (ids.has(id))
      push(
        `efeitos.${i}.id`,
        `Dois efeitos geram o id ${id}; dê um id próprio a um deles.`,
        "ID_DUPLICADO",
      );
    ids.add(id);
  });

  // Dependências.
  (ficha.dependeDe ?? []).forEach((dependencia, i) => {
    const mae = contexto.leis.get(dependencia.lei);
    if (!mae) {
      push(
        `dependeDe.${i}.lei`,
        `A lei ${dependencia.lei} não existe no catálogo.`,
        "REFERENCIA_QUEBRADA",
      );
      return;
    }
    for (const opcao of dependencia.opcoes)
      if (!mae.includes(opcao))
        push(
          `dependeDe.${i}.opcoes`,
          `A lei ${dependencia.lei} não tem a opção ${opcao}.`,
          "REFERENCIA_QUEBRADA",
        );
  });
  (ficha.excludentes ?? []).forEach((lei, i) => {
    if (!contexto.leis.has(lei))
      push(
        `excludentes.${i}`,
        `A lei ${lei} não existe no catálogo.`,
        "REFERENCIA_QUEBRADA",
      );
  });

  // Texto: sem travessão e sem nome de programa de um país.
  const textos: [string, unknown][] = [
    ["nome", ficha.nome],
    ["descricao", ficha.descricao],
    ...opcoes.map((o, i): [string, unknown] => [
      `controle.opcoes.${i}.rotulo`,
      o.rotulo,
    ]),
  ];
  for (const [campo, texto] of textos) {
    if (typeof texto !== "string") continue;
    const achado = textoProibido(texto);
    if (achado)
      push(
        campo,
        achado.startsWith("travessão")
          ? "O texto não pode ter travessão (—)."
          : `O texto cita "${achado}", nome de programa ou órgão de um país.`,
      );
  }
  if (ficha.historia?.brasil?.includes("—"))
    push("historia.brasil", "O texto não pode ter travessão (—).");

  return erros;
}
