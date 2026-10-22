import {
  rateUnitFor,
  type ConsequenceFile,
  type PolicyFile,
  type VariableDefinition,
} from "../../../engine";
import type { Familia, FichaV3, FichaV4 } from "./tipos";
import { idDoEfeito } from "./verificar";

export type FichaConvertida = Readonly<{
  lei: PolicyFile;
  consequencias: readonly ConsequenceFile[];
}>;

type Ficha = FichaV3 | FichaV4;

const GRUPO_DA_FAMILIA: Readonly<Record<Familia, PolicyFile["grupo"]>> = {
  imposto: "tributaria",
  verba: "orcamentaria",
  programa: "orcamentaria",
  constitucional: "institucional",
  petrea: "institucional",
  regra: "regulatoria",
};

function processoDe(ficha: Ficha): string {
  if (ficha.nivel === "constituicao")
    return ficha.petrea ? "clausula-petrea" : "emenda-constitucional";
  if (ficha.nivel === "lei") return "lei-ordinaria";
  return ficha.dinheiro?.tipo === "gasto"
    ? "execucao-programa-autorizado"
    : "decreto";
}

function grupoDe(ficha: Ficha): PolicyFile["grupo"] {
  if (ficha.versaoEsquema === 4) return GRUPO_DA_FAMILIA[ficha.familia];
  if (ficha.grupo) return ficha.grupo;
  if (ficha.dinheiro?.tipo === "gasto") return "orcamentaria";
  if (ficha.dinheiro?.tipo === "receita") return "tributaria";
  return ficha.nivel === "constituicao" ? "institucional" : "regulatoria";
}

/**
 * Gera a lei v2 e as consequências que o motor lê. A ficha já passou pelo
 * verificador; o motor ainda valida o resultado como qualquer outro arquivo.
 * Toda ficha v3 usa os três níveis (D-65): `nivelLegal` sempre presente.
 */
export function converterFicha(
  ficha: Ficha,
  variaveis: ReadonlyMap<string, VariableDefinition>,
): FichaConvertida {
  const consequencias = ficha.efeitos.map((efeito): ConsequenceFile => {
    const alvo = variaveis.get(efeito.alvo);
    const unidade =
      efeito.unidade ??
      (alvo?.tipo === "estoque"
        ? (rateUnitFor(alvo.unidade) ?? alvo.unidade)
        : (alvo?.unidade ?? ""));
    return {
      id: idDoEfeito(ficha.id, efeito.alvo, efeito.id),
      tipo: "consequencia",
      versaoEsquema: 1,
      origem: efeito.origem ?? ficha.controle.variavel,
      alvo: efeito.alvo,
      mecanismo: efeito.mecanismo,
      parametros: efeito.parametros,
      ...(efeito.normalizacao ? { normalizacao: efeito.normalizacao } : {}),
      ...(efeito.leitura ? { leitura: efeito.leitura } : {}),
      ...(efeito.escala ? { escala: efeito.escala } : {}),
      unidade,
      atrasoPassos: efeito.atraso,
      duracao: efeito.duracao ?? { modo: "continuo" },
    };
  });
  const dinheiro = ficha.dinheiro;
  const lei: PolicyFile = {
    id: ficha.id,
    tipo: "lei",
    versaoEsquema: 2,
    grupo: grupoDe(ficha),
    nome: ficha.nome,
    ...(ficha.versaoEsquema === 4
      ? {
          descricao: ficha.decide,
          decide: ficha.decide,
          familia: ficha.familia,
          ...(ficha.area ? { area: ficha.area, areaMundo: ficha.area } : {}),
          ...(ficha.exemplo ? { exemplo: ficha.exemplo } : {}),
          ...(ficha.trava?.length ? { trava: ficha.trava } : {}),
          ...(ficha.publico ? { publico: ficha.publico } : {}),
        }
      : {
          descricao: ficha.descricao,
          area: ficha.area,
          ministerio: ficha.ministerio,
        }),
    processoAutorizacao: processoDe(ficha),
    nivelLegal:
      ficha.nivel === "constituicao"
        ? ficha.petrea
          ? "petrea"
          : "constitucional"
        : "derivada",
    ...(ficha.revogavel !== undefined ? { revogavel: ficha.revogavel } : {}),
    controle: ficha.controle,
    ...(dinheiro?.tipo === "gasto"
      ? {
          orcamento: {
            modo: dinheiro.modo,
            ...(dinheiro.base ? { base: dinheiro.base } : {}),
            ...(dinheiro.limites ? { limites: dinheiro.limites } : {}),
          },
        }
      : {}),
    ...(dinheiro?.tipo === "receita"
      ? {
          tributo: {
            base: dinheiro.base,
            ...(dinheiro.limites ? { limites: dinheiro.limites } : {}),
          },
        }
      : {}),
    ...(ficha.dependeDe?.length ? { requer: ficha.dependeDe } : {}),
    ...(ficha.mesa ? { mesa: ficha.mesa } : {}),
    ...(ficha.vinculos?.length ? { vinculos: ficha.vinculos } : {}),
    consequencias: consequencias.map((c) => c.id),
    ...(ficha.implantacao
      ? {
          respostaTemporal: {
            implantacao: ficha.implantacao.entrada,
            degradacao: ficha.implantacao.saida,
          },
        }
      : {}),
  };
  return { lei, consequencias };
}
