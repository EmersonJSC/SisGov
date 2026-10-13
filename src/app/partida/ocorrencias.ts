import type { OccurrenceFile } from "../../engine";
import {
  occurrenceCatalog,
  occurrenceChance,
  optionAvailable,
} from "../../game/occurrences";
import type {
  Partida,
  CamposOcorrencia,
  VisaoDilema,
  VisaoOcorrenciaAtiva,
  VisaoRegistro,
  VisaoOcorrencias,
} from "./tipos";
import { preencher, registroDeOcorrencia } from "./turno";
import { efeitosDoNo } from "./visao";
import { bussolaDoMundo } from "../../game/bussola";

function camposDe(
  o: OccurrenceFile,
  lugar: Readonly<Record<string, string>> | undefined,
): CamposOcorrencia {
  return {
    id: o.id,
    nome: preencher(o.nome, lugar),
    manchete: preencher(o.manchete ?? o.nome, lugar),
    descricao: preencher(o.descricao ?? "", lugar),
    area: o.area ?? "",
    origem: o.origem ?? "",
    nivel: o.nivel ?? 2,
    ...(o.avaliacao ? { avaliacao: o.avaliacao } : {}),
    ...(lugar ? { variaveis: lugar } : {}),
  };
}

export function ocorrenciasDaPartida(partida: Partida): VisaoOcorrencias {
  const { content, game } = partida;
  const state = game.occurrences;
  if (!state) return { mesa: [], emCurso: [], historico: [] };
  const catalogo = occurrenceCatalog(content);
  const values = game.execution.values;
  const nomeDaLei = new Map(content.policies.map((p) => [p.id, p]));
  const mesa = state.pending.flatMap((p): VisaoDilema[] => {
    const o = catalogo.byId.get(p.occurrenceId);
    if (!o) return [];
    const causa = p.causeId
      ? catalogo.byId.get(p.causeId.split(".")[0])
      : undefined;
    return [
      {
        ...camposDe(o, p.vars),
        aberto: p.openedTurn,
        ...(causa
          ? { causa: { id: causa.id, nome: preencher(causa.nome, p.vars) } }
          : {}),
        opcoes: (o.opcoes ?? []).map((op) => {
          const disponivel = optionAvailable(op, values);
          return {
            id: op.id,
            rotulo: preencher(op.rotulo, p.vars),
            descricao: preencher(op.descricao ?? "", p.vars),
            disponivel,
            ...(disponivel ? {} : { motivo: op.motivoRequer }),
            duracaoMeses: op.duracaoMeses,
            efeitos: efeitosDoNo(content, op.controle),
            ...(bussolaDoMundo.dilemas?.[o.id]?.opcoes[op.id]
              ? { lado: bussolaDoMundo.dilemas[o.id].opcoes[op.id] }
              : {}),
            leis: (op.leis ?? []).map((l) => {
              const lei = nomeDaLei.get(l.lei);
              const opcao = lei?.controle.opcoes?.find(
                (x) => Math.abs(x.valor - l.nivel) < 1e-9,
              );
              return {
                id: l.lei,
                nome: lei?.nome ?? l.lei,
                para: opcao?.rotulo ?? String(l.nivel),
              };
            }),
            padrao: op.id === o.padrao,
          };
        }),
      },
    ];
  });
  const emCurso = state.active.flatMap((a): VisaoOcorrenciaAtiva[] => {
    const o = catalogo.byId.get(a.occurrenceId);
    if (!o) return [];
    const opcao = o.opcoes?.find((x) => x.id === a.optionId);
    return [
      {
        ...camposDe(o, a.vars),
        tipo: o.tipo === "dilema" ? "dilema" : "evento",
        ...(opcao ? { opcao: opcao.rotulo } : {}),
        mesesRestantes: a.monthsLeft,
        inicio: a.startedTurn,
        efeitos: efeitosDoNo(content, a.control),
      },
    ];
  });
  const historico = [...state.history]
    .reverse()
    .slice(0, 40)
    .map((r) => registroDeOcorrencia(content, r))
    .filter((x): x is VisaoRegistro => x !== undefined);
  return { mesa, emCurso, historico };
}

/** Chance de uma ocorrência neste momento e o porquê (para a tela). */
export function chanceDaOcorrencia(
  partida: Partida,
  id: string,
):
  | Readonly<{
      chance: number;
      base: number;
      fatores: readonly Readonly<{
        id: string;
        nome: string;
        multiplica: number;
      }>[];
    }>
  | undefined {
  const o = occurrenceCatalog(partida.content).byId.get(id);
  if (!o) return undefined;
  const c = occurrenceChance(
    o,
    partida.game.execution.values,
    partida.game.occurrences,
  );
  const nomes = new Map(
    partida.content.variables.variaveis.map((v) => [v.id, v.nome]),
  );
  return {
    chance: c.chance,
    base: c.base,
    fatores: c.factors.map((f) => ({
      id: f.variable,
      nome: nomes.get(f.variable) ?? f.variable,
      multiplica: f.multiplier,
    })),
  };
}
