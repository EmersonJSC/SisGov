import type { ResolvedPackage } from "../../engine";
import {
  answerDilemma,
  occurrenceCatalog,
  rollTurn,
  type OccurrenceState,
} from "../../game/occurrences";
import { lawTargets, type GameState } from "../../game/createGame";
import { commitGameQuarter } from "../../game/commitGameQuarter";
import type {
  Resultado,
  Partida,
  VisaoRegistro,
  RelatorioTurno,
  EfeitoPrevisto,
} from "./tipos";
import { falha } from "./comum";
import { aplicarMeta } from "./leis";
import {
  MAXIMO_TRIMESTRES_PREVIA,
  simularTrimestre,
  simularTrimestres,
  serieSemMudanca,
  compararSeries,
} from "./previsao";
import { lerContas } from "./contas";

/** O piloto automático (D-58) responde a mesa com a opção padrão. */
function responderComPadrao(partida: Partida, game: GameState): GameState {
  let atual: Partida = { ...partida, game };
  for (const pendente of game.occurrences?.pending ?? []) {
    const dilema = occurrenceCatalog(partida.content).byId.get(
      pendente.occurrenceId,
    );
    if (!dilema?.padrao) continue;
    const r = responder(atual, dilema.id, dilema.padrao, true);
    if (r.ok) atual = r.value;
  }
  return atual.game;
}

/** Sorteio do turno: eventos, mesa de dilemas e situações (SG106). */
function sortearTurno(
  content: ResolvedPackage,
  game: GameState,
): { game: GameState; jornal: RelatorioTurno["ocorrencias"] } {
  const vazio = { eventos: [], dilemas: [], surgiram: [], acabaram: [] };
  if (!game.occurrences) return { game, jornal: vazio };
  const r = rollTurn({
    content,
    state: game.occurrences,
    values: game.execution.values,
    turn: game.currentTurn,
    seed: game.random?.seed ?? 1,
    laws: lawTargets(content, game.policies),
  });
  const turno = game.currentTurn;
  const registro = (
    tipo: VisaoRegistro["tipo"],
    id: string,
  ): VisaoRegistro | undefined => {
    const achado = [...r.state.history]
      .reverse()
      .find((h) => h.kind === tipo && h.id === id);
    if (tipo === "situacao")
      return registroDeSituacao(content, id, turno, achado?.turn);
    if (tipo === "dilema") {
      const pendente = r.state.pending.find((p) => p.occurrenceId === id);
      return registroDeOcorrencia(content, {
        kind: "dilema",
        id,
        turn: turno,
        ...(pendente?.vars ? { vars: pendente.vars } : {}),
      });
    }
    return achado ? registroDeOcorrencia(content, achado) : undefined;
  };
  const lista = (tipo: VisaoRegistro["tipo"], ids: readonly string[]) =>
    ids
      .map((id) => registro(tipo, id))
      .filter((x): x is VisaoRegistro => x !== undefined);
  return {
    game: { ...game, occurrences: r.state },
    jornal: {
      eventos: lista("evento", r.events),
      dilemas: lista("dilema", r.dilemmas),
      surgiram: lista("situacao", r.situationsStarted),
      acabaram: r.situationsEnded.map((id) =>
        registroDeSituacao(content, id, turno, undefined),
      ),
    },
  };
}

/** Troca as variáveis do texto ({cidade}, {ministro}…) pelos valores sorteados. */
export function preencher(
  texto: string,
  vars?: Readonly<Record<string, string>>,
): string {
  const cheio = texto.replace(
    /\{([a-z_]+)\}/g,
    (_, nome: string) => vars?.[nome] ?? GENERICO[nome] ?? nome,
  );
  // "{ministro} é acusado…" começa a frase com maiúscula
  return cheio.charAt(0).toUpperCase() + cheio.slice(1);
}

/** Quando o país não tem a lista, um termo genérico. */
const GENERICO: Readonly<Record<string, string>> = {
  cidade: "uma cidade",
  bairro: "um bairro",
  estado: "um estado",
  regiao: "uma região",
  empresa: "uma grande empresa",
  vizinho: "um país vizinho",
  banco: "um grande banco",
  faccao: "uma facção criminosa",
  partido_aliado: "um partido aliado",
  potencia: "uma potência estrangeira",
  gentilico: "nacional",
  gentilicos: "cidadãos do país",
  palacio: "palácio do governo",
  festa: "A festa popular",
  sistema_saude: "sistema público de saúde",
  ministro: "um ministro do governo",
  ministerio: "do governo",
  pasta: "governo",
};

function registroDeSituacao(
  content: ResolvedPackage,
  id: string,
  turno: number,
  inicio: number | undefined,
): VisaoRegistro {
  const variable = content.variables.variaveis.find((v) => v.id === id);
  return {
    tipo: "situacao",
    id,
    nome: variable?.nome ?? id,
    manchete: variable?.nome ?? id,
    nivel: 2,
    turno: inicio ?? turno,
    avaliacao: "negativa",
  };
}

export function registroDeOcorrencia(
  content: ResolvedPackage,
  record: OccurrenceState["history"][number],
): VisaoRegistro | undefined {
  if (record.kind === "situacao")
    return registroDeSituacao(content, record.id, record.turn, record.turn);
  const o = occurrenceCatalog(content).byId.get(record.id);
  if (!o) return undefined;
  const opcao = o.opcoes?.find((x) => x.id === record.optionId);
  return {
    tipo: record.kind,
    id: record.id,
    nome: preencher(o.nome, record.vars),
    manchete: preencher(o.manchete ?? o.nome, record.vars),
    nivel: o.nivel ?? 2,
    turno: record.turn,
    ...(record.endedTurn !== undefined ? { fim: record.endedTurn } : {}),
    ...(opcao ? { opcao: opcao.rotulo } : {}),
    ...(record.vars ? { variaveis: record.vars } : {}),
    ...(record.automatic ? { automatica: true } : {}),
    ...(o.avaliacao ? { avaliacao: o.avaliacao } : {}),
  };
}

function responder(
  partida: Partida,
  dilemaId: string,
  opcaoId: string,
  automatica = false,
): Resultado<Partida> {
  const { content, game } = partida;
  if (!game.occurrences)
    return { ok: false, erros: ["Esta partida não tem dilemas."] };
  const r = answerDilemma({
    content,
    state: game.occurrences,
    occurrenceId: dilemaId,
    optionId: opcaoId,
    turn: game.currentTurn,
    seed: game.random?.seed ?? 1,
    values: game.execution.values,
    automatic: automatica,
  });
  if (!r.ok) return { ok: false, erros: [r.error] };
  let atual: Partida = {
    ...partida,
    game: { ...game, occurrences: r.state },
  };
  // a opção pode mudar leis (ex.: socorro externo impõe teto de gastos)
  for (const lei of r.laws) {
    const mudada = aplicarMeta(atual, lei.lei, lei.nivel);
    if (mudada.ok) atual = { ...mudada.value, acoes: atual.acoes };
  }
  return { ok: true, value: atual };
}

/**
 * O presidente escolhe uma opção do dilema na mesa (SG106). A opção começa a
 * valer na hora (o nó dela liga no próximo turno) e pode mudar leis.
 */
export function responderDilema(
  partida: Partida,
  dilemaId: string,
  opcaoId: string,
): Resultado<Partida> {
  const r = responder(partida, dilemaId, opcaoId);
  return r.ok
    ? { ok: true, value: { ...r.value, acoes: partida.acoes + 1 } }
    : r;
}

/** Prévia de uma opção do dilema: o país com ela, comparado com o país sem resposta. */
export function preverDilema(
  partida: Partida,
  dilemaId: string,
  opcaoId: string,
  trimestres = 4,
): Resultado<
  Readonly<{ efeitos: readonly EfeitoPrevisto[]; interrompida?: string }>
> {
  if (
    !Number.isInteger(trimestres) ||
    trimestres < 1 ||
    trimestres > MAXIMO_TRIMESTRES_PREVIA
  )
    return {
      ok: false,
      erros: [
        `O horizonte da prévia deve ser um número inteiro de 1 a ${MAXIMO_TRIMESTRES_PREVIA} trimestres.`,
      ],
    };
  const respondida = responder(partida, dilemaId, opcaoId);
  if (!respondida.ok) return respondida;
  const base = serieSemMudanca(partida, trimestres);
  if (!base.ok) return base;
  const alt = simularTrimestres(respondida.value, trimestres);
  if (!alt.ok) return alt;
  const meses = Math.min(base.value.valores.length, alt.value.valores.length);
  const interrompida = alt.value.interrompida ?? base.value.interrompida;
  return {
    ok: true,
    value: {
      efeitos: compararSeries(partida, base.value, alt.value, meses),
      ...(interrompida ? { interrompida } : {}),
    },
  };
}

/** Passa um trimestre: três meses de implantação, rede e contas públicas. */
export function encerrarTurno(
  partida: Partida,
): Resultado<Readonly<{ partida: Partida; relatorio: RelatorioTurno }>> {
  const { content, game } = partida;
  // SG106: o turno não passa com dilema na mesa
  const mesa = game.occurrences?.pending ?? [];
  if (mesa.length > 0) {
    const nomes = mesa
      .map((p) => occurrenceCatalog(content).byId.get(p.occurrenceId)?.nome)
      .join(", ");
    return {
      ok: false,
      erros: [
        `${mesa.length === 1 ? "Há um dilema" : `Há ${mesa.length} dilemas`} na mesa (${nomes}). Escolha uma opção antes de encerrar o turno.`,
      ],
    };
  }
  // O piloto automático responde sozinho, sempre com a opção padrão.
  const piloto = responderComPadrao(partida, partida.piloto);
  const simulated = simularTrimestre(partida);
  if (!simulated.ok) return falha(simulated.diagnostics);
  const prepared = simulated.value;
  const rolado = sortearTurno(
    content,
    commitGameQuarter(game, prepared.prepared),
  );
  const next = rolado.game;
  // O piloto automático só precisa andar à parte se o jogador mudou algo.
  let pilotoNext = next;
  if (piloto !== game) {
    const sozinho = simularTrimestre({ ...partida, game: piloto });
    if (!sozinho.ok) return falha(sozinho.diagnostics);
    pilotoNext = sortearTurno(
      content,
      commitGameQuarter(piloto, sozinho.value.prepared),
    ).game;
  }
  const before = game.execution.values;
  const after = next.execution.values;
  const pilotoBefore = piloto.execution.values;
  const pilotoAfter = pilotoNext.execution.values;
  const mudancas = content.variables.variaveis
    .filter((variable) => variable.tipo !== "controle")
    .map((variable) => {
      const id = variable.id;
      const antes = before[id] ?? 0;
      const depois = after[id] ?? 0;
      const sozinho = (pilotoAfter[id] ?? 0) - (pilotoBefore[id] ?? 0);
      return {
        id,
        nome: variable.nome,
        antes,
        depois,
        porVoce: depois - antes - sozinho,
        sozinho,
      };
    })
    .filter(
      (item) =>
        Math.abs(item.depois - item.antes) > 1e-6 ||
        Math.abs(item.porVoce) > 1e-6,
    )
    .sort(
      (a, b) => Math.abs(b.depois - b.antes) - Math.abs(a.depois - a.antes),
    );
  return {
    ok: true,
    value: {
      partida: { ...partida, game: next, piloto: pilotoNext },
      relatorio: {
        turno: next.currentTurn,
        contasAntes: lerContas(content, before),
        contas: lerContas(content, after),
        contasSemVoce: lerContas(content, pilotoAfter),
        mudancas,
        leisAlteradas: leisAlteradas(next, pilotoNext).size,
        dilemasDiferentes: dilemasDiferentes(next, pilotoNext),
        ocorrencias: rolado.jornal,
      },
    },
  };
}

/** Opções de dilema em curso que o piloto (sempre a padrão) não escolheu. */
function dilemasDiferentes(game: GameState, piloto: GameState): number {
  if (game === piloto) return 0;
  const chave = (a: { occurrenceId: string; optionId?: string }) =>
    `${a.occurrenceId}:${a.optionId}`;
  const doPiloto = new Set(
    (piloto.occurrences?.active ?? []).filter((a) => a.optionId).map(chave),
  );
  return (game.occurrences?.active ?? []).filter(
    (a) => a.optionId && !doPiloto.has(chave(a)),
  ).length;
}

/** Leis cuja meta o jogador mudou em relação ao piloto automático. */
export function leisAlteradas(game: GameState, piloto: GameState): Set<string> {
  if (game === piloto) return new Set();
  const metas = new Map(
    piloto.policies.map((state) => [
      state.policyDefinitionId,
      state.desiredLevel,
    ]),
  );
  return new Set(
    game.policies
      .filter(
        (state) =>
          Math.abs(
            state.desiredLevel -
              (metas.get(state.policyDefinitionId) ?? state.desiredLevel),
          ) > 1e-9,
      )
      .map((state) => state.policyDefinitionId),
  );
}
