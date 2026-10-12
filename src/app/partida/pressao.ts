import type { PressureGroupManifest, ResolvedPackage } from "../../engine";
import { AREA_PATROCINIO, AREA_PRESSAO } from "../../game/pais/pressao";
import {
  groupActions,
  openInvestigation,
  parRevelado,
  pressureCause,
  pressureGroups,
  type InvestigationResult,
  type PressureLevelChange,
} from "../../game/pressao";
import type {
  Partida,
  Resultado,
  VisaoGrupoPressao,
  VisaoInvestigacaoConcluida,
  VisaoMudancaDeNivel,
  VisaoPressao,
} from "./tipos";
import { registroDeOcorrencia } from "./turno";

/**
 * Nós dos grupos de pressão (pressão, nível, patrocínio): ficam no painel e
 * no jornal, sem bolha no mapa (desenho 5).
 */
export function nosForaDoMapa(content: ResolvedPackage): ReadonlySet<string> {
  const cached = foraDoMapa.get(content);
  if (cached) return cached;
  const ids = new Set(
    content.variables.variaveis
      .filter((v) => v.area === AREA_PRESSAO || v.area === AREA_PATROCINIO)
      .map((v) => v.id),
  );
  foraDoMapa.set(content, ids);
  return ids;
}
const foraDoMapa = new WeakMap<ResolvedPackage, ReadonlySet<string>>();

const verbo = (g: PressureGroupManifest, singular: string, plural: string) =>
  g.plural ? plural : singular;

/** Manchete de quem sobe ou desce de nível (V1-09, desenho 5). */
function mancheteDoNivel(g: PressureGroupManifest, de: number, para: number) {
  if (para < de) return `${g.nome} ${verbo(g, "perde", "perdem")} força`;
  if (para === 1)
    return `${g.nome} ${verbo(g, "começa", "começam")} a se organizar`;
  if (para === 2) return `${g.nome} se ${verbo(g, "mobiliza", "mobilizam")}`;
  return `${g.nome} ${verbo(g, "vira", "viram")} preocupação nacional`;
}

export function mudancasDeNivel(
  partida: Pick<Partida, "content">,
  changes: readonly PressureLevelChange[],
): VisaoMudancaDeNivel[] {
  const grupos = new Map(
    (pressureGroups(partida.content)?.grupos ?? []).map((g) => [g.id, g]),
  );
  return changes.flatMap((c) => {
    const g = grupos.get(c.groupId);
    return g
      ? [
          {
            grupo: g.id,
            nome: g.nome,
            de: c.from,
            para: c.to,
            manchete: mancheteDoNivel(g, c.from, c.to),
          },
        ]
      : [];
  });
}

export function investigacoesConcluidas(
  partida: Pick<Partida, "content">,
  results: readonly InvestigationResult[],
): VisaoInvestigacaoConcluida[] {
  const config = pressureGroups(partida.content);
  const grupos = new Map((config?.grupos ?? []).map((g) => [g.id, g]));
  const nomes = new Map(
    (config?.patrocinadores ?? []).map((s) => [s.id, s.nome]),
  );
  return results.flatMap((r) => {
    const g = grupos.get(r.groupId);
    if (!g) return [];
    const achados = r.sponsorIds.map((id) => nomes.get(id) ?? id);
    return [
      {
        grupo: g.id,
        nome: g.nome,
        achados,
        manchete: achados.length
          ? `Investigação revela quem financia ${g.nome}: ${achados.join(", ")}`
          : `Investigação sobre ${g.nome} termina sem achar dinheiro oculto`,
      },
    ];
  });
}

/** Painel "Pressão": todos os grupos, por seção, com nível e patrocínio. */
export function pressaoDaPartida(partida: Partida): VisaoPressao | undefined {
  const { content, game } = partida;
  const config = pressureGroups(content);
  const state = game.pressure;
  if (!config || !state) return undefined;
  const values = game.execution.values;
  const revelados = new Set(state.revealed);
  const patrocinadores = new Map(config.patrocinadores.map((s) => [s.id, s]));
  const acoes = groupActions(content);
  const ultima = new Map<string, VisaoGrupoPressao["ultimaAcao"]>();
  for (const record of game.occurrences?.history ?? []) {
    const grupo = record.kind === "evento" && acoes.get(record.id)?.group.id;
    if (!grupo) continue;
    const registro = registroDeOcorrencia(content, record);
    if (registro) ultima.set(grupo, registro);
  }
  const investigado = new Map(
    state.results.map((r) => [r.groupId, r.turn] as const),
  );
  const ordemDaSecao = new Map(config.secoes.map((s, i) => [s.id, i]));
  const grupos = config.grupos
    .map((g): VisaoGrupoPressao => {
      const nivel = Math.round(values[g.nivel] ?? 0);
      const emCurso = state.investigations.find((i) => i.groupId === g.id);
      const motivo = pressureCause(g, values);
      const ultimaAcao = ultima.get(g.id);
      const quando = investigado.get(g.id);
      return {
        id: g.id,
        nome: g.nome,
        secao: g.secao,
        visto: g.visto,
        recursos: g.recursos,
        pressao: values[g.pressao] ?? 0,
        nivel,
        nomeDoNivel: config.niveis[nivel] ?? "",
        limites: g.limites,
        ...(motivo ? { motivo } : {}),
        ...(ultimaAcao ? { ultimaAcao } : {}),
        financiadoPor: g.patrocinio
          .filter(
            (p) =>
              p.publico || revelados.has(parRevelado(g.id, p.patrocinador)),
          )
          .map((p) => ({
            id: p.patrocinador,
            nome: patrocinadores.get(p.patrocinador)?.nome ?? p.patrocinador,
            tipo: patrocinadores.get(p.patrocinador)?.tipo ?? "",
            revelado: !p.publico,
          })),
        ...(emCurso
          ? { investigacao: { turnosRestantes: emCurso.turnsLeft } }
          : {}),
        ...(quando !== undefined ? { investigadoEm: quando } : {}),
      };
    })
    .sort(
      (a, b) =>
        (ordemDaSecao.get(a.secao) ?? 99) - (ordemDaSecao.get(b.secao) ?? 99) ||
        b.nivel - a.nivel ||
        b.pressao - a.pressao,
    );
  return {
    niveis: config.niveis,
    secoes: config.secoes,
    grupos,
    alertas: grupos
      .filter((g) => g.nivel >= config.niveis.length - 1)
      .map((g) => g.id),
    investigacao: {
      capacidade: values[config.investigacao.capacidade] ?? 0,
      aoMesmoTempo: config.investigacao.aoMesmoTempo,
      emCurso: state.investigations.length,
      turnos: config.investigacao.turnos,
    },
  };
}

/**
 * O presidente manda investigar quem financia um grupo (V1-09). A cada
 * turno a investigação pode achar cada patrocinador oculto; a chance cresce
 * com a capacidade de investigação e cai com o poder do patrocinador.
 */
export function investigarGrupo(
  partida: Partida,
  grupoId: string,
): Resultado<Partida> {
  const { content, game } = partida;
  if (!game.pressure)
    return { ok: false, erros: ["Esta partida não tem grupos de pressão."] };
  const r = openInvestigation(
    content,
    game.pressure,
    grupoId,
    game.currentTurn,
  );
  if (!r.ok) return { ok: false, erros: [r.error] };
  return {
    ok: true,
    value: {
      ...partida,
      game: { ...game, pressure: r.state },
      acoes: partida.acoes + 1,
    },
  };
}
