import type { ResolvedPackage } from "../../engine";
import { contextNodeId } from "../../engine/model/lawNodes";
import { valorNaMedida } from "./medida";
import { fraseDaBolha } from "./frase";
import { medidaDoPais } from "./regua";
import { occurrenceCatalog } from "../../game/occurrences";
import {
  optionLock,
  policyMinimum,
  policyInForce,
  policyRequirements,
  policyRevocable,
  requirementBlock,
  requirementMet,
  revocationBlock,
} from "../../game/policyRequirements";
import { policyLevelRulesFromContent } from "../../game/policyRulesFromContent";
import { nivelNoCongresso } from "../../game/tramitacao";
import type {
  Partida,
  VisaoLei,
  VisaoOpcao,
  VisaoExigencia,
  VisaoLigacao,
  VisaoPartida,
  VisaoArea,
  VisaoEfeitoOcorrencia,
} from "./tipos";
import { ESTRUTURAS, escalaDe } from "./comum";
import areasDoMundo from "../../conteudo/mundo/areas.json";

/** Título e "o que faz" de cada área vêm do mundo (molde-das-leis.md, 2.4). */
const AREA_DO_MUNDO = new Map(areasDoMundo.areas.map((a) => [a.id, a]));
import { preencher, leisAlteradas } from "./turno";
import {
  lerContas,
  saldoDasLeis,
  gruposDaPartida,
  brutoDasSituacoes,
} from "./contas";
import { ocorrenciasDaPartida } from "./ocorrencias";
import { nosForaDoMapa, pressaoDaPartida } from "./pressao";
import { linhasDoOrcamento } from "./orcamento";

/** Tudo o que a tela precisa desenhar, sem tipos do motor. */
/** Ordem das camadas da mesa, de cima para baixo (V1-34). */
const ORDEM_DA_CAMADA = { constituicao: 0, lei: 1, alavanca: 2 } as const;

export function verPartida(partida: Partida): VisaoPartida {
  const { content, game } = partida;
  const values = game.execution.values;
  const precosHoje = values.indice_precos ?? 100;
  const precosHaUmAno =
    game.execution.step >= 12
      ? (game.execution.history.find(
          (item) => item.step === game.execution.step - 12,
        )?.values.indice_precos ?? game.execution.initialValues.indice_precos)
      : undefined;
  const poderCompraPerdido =
    precosHoje > 0 && precosHaUmAno !== undefined
      ? 100 * (1 - precosHaUmAno / precosHoje)
      : undefined;
  const saldo = saldoDasLeis(partida, values);
  const alteradas = leisAlteradas(game, partida.piloto);
  const states = new Map(
    game.policies.map((state) => [state.policyDefinitionId, state]),
  );
  const exigencias = policyRequirements(content);
  const nomeDaLei = new Map(content.policies.map((p) => [p.id, p.nome]));
  const naFila = new Set(
    (game.bills?.fila ?? []).map((projeto) => projeto.lei),
  );
  const governo = governoDaPartida(content);
  const lugares = new Map(
    governo.flatMap((area) =>
      area.ministerios.flatMap((m) =>
        m.leis.map((lei) => [lei, { area: area.id, ministerio: m }] as const),
      ),
    ),
  );
  const coordenador = new Map(
    governo.map((area) => [
      area.id,
      area.ministerios.find((m) => m.cargo === area.cargo) ??
        area.ministerios[0],
    ]),
  );
  const lugarDaLei = (id: string, areaMundo?: string) => {
    // Lei do molde v4 mora na área dela; o rótulo é o coordenador da área.
    // Se o ministério da lista é de outra área, vale a área da lei.
    const ministerio = areaMundo ? coordenador.get(areaMundo) : undefined;
    const listado = lugares.get(id);
    const lugar =
      areaMundo && ministerio && listado?.area !== areaMundo
        ? { area: areaMundo, ministerio }
        : listado;
    return {
      ministerio: lugar?.ministerio.nome ?? "",
      ministerios: lugar ? [lugar.ministerio.nome] : [],
      ministerioId: lugar?.ministerio.id ?? "",
      areas: lugar ? [lugar.area] : [],
    };
  };
  const segmentoPorNome = new Map<string, string>(
    content.variables.variaveis
      .filter((v) => v.id.startsWith("grupo_"))
      .map((v) => [v.nome.toLowerCase(), v.id] as [string, string]),
  );
  for (const [nome, id] of Object.entries(SEGMENTO_ALIAS))
    segmentoPorNome.set(nome, id);
  const leis = content.policies.map((policy): VisaoLei => {
    const state = states.get(policy.id);
    const jurosDoBanco =
      policy.id === "taxa-basica-de-juros" &&
      policyInForce(game.policies, policy.id) === undefined;
    const metaInflacao =
      2 + (4 * (values.nivel_valor_da_meta_de_inflacao ?? 25)) / 100;
    const motivoJuros =
      (values.inflacao ?? 0) > metaInflacao + 0.25
        ? "a inflação está acima da meta"
        : (values.inflacao ?? 0) < metaInflacao - 0.25
          ? "a inflação está abaixo da meta"
          : "a inflação está perto da meta";
    const nivel = jurosDoBanco
      ? Math.max(0, Math.min(100, ((values.taxa_juros ?? 2) - 2) / 0.28))
      : (state?.implementedLevel ?? 0);
    const opcoes = policy.controle.opcoes;
    const nearest = opcoes?.reduce((best, option) =>
      Math.abs(option.valor - nivel) < Math.abs(best.valor - nivel)
        ? option
        : best,
    );
    const variable = content.variables.variaveis.find(
      (item) => item.id === policy.controle.variavel,
    );
    const definicao = policyLevelRulesFromContent(content, policy.id);
    const regras = definicao.ok ? definicao.value.rules : undefined;
    return {
      id: policy.id,
      nome: policy.nome,
      descricao: jurosDoBanco
        ? `${policy.descricao ?? ""} O banco central fixou ${(values.taxa_juros ?? 0).toFixed(1).replace(".", ",")}% ao ano; ${motivoJuros} (${metaInflacao.toFixed(1).replace(".", ",")}% ao ano).`
        : (policy.descricao ?? ""),
      grupo: policy.grupo,
      area: policy.area ?? "",
      ...lugarDaLei(policy.id, policy.areaMundo),
      ...(policy.familia ? { familia: policy.familia } : {}),
      ...(policy.decide ? { decide: policy.decide } : {}),
      processo: policy.processoAutorizacao,
      nivel,
      meta: jurosDoBanco ? nivel : (state?.desiredLevel ?? nivel),
      // limites efetivos: os mesmos que a partida aceita (SG159)
      minimo: Math.max(
        regras?.domain.minimum ?? variable?.dominio.minimo ?? 0,
        policyMinimum(content, game.policies, policy.id) ??
          regras?.domain.minimum ??
          variable?.dominio.minimo ??
          0,
      ),
      maximo:
        regras?.domain.maximum ??
        variable?.dominio.maximo ??
        (policy.controle.unidade === "moeda_ano"
          ? values.pib_nominal
          : undefined),
      unidade: policy.controle.unidade,
      opcoes: opcoes?.map(({ id, rotulo, valor }) => ({
        id,
        rotulo,
        valor,
        saldoAnual: saldo(policy.id, valor),
        ...travaDa(policy.id, valor, state),
      })),
      opcaoAtual: nearest?.id,
      ...popularidadeDa(nearest, segmentoPorNome),
      saldoAnual: saldo(policy.id),
      ...(policy.controle.unidade === "moeda_ano" &&
      poderCompraPerdido !== undefined
        ? { poderCompraPerdido }
        : {}),
      alteradaPorVoce: alteradas.has(policy.id),
      ...(policy.nivelLegal ? { nivelLegal: policy.nivelLegal } : {}),
      emVigor: policyInForce(game.policies, policy.id) !== undefined,
      ...(jurosDoBanco ? { sempreVisivel: true } : {}),
      revogavel:
        policyRevocable(policy) &&
        revocationBlock(content, game.policies, policy.id) === undefined,
      ...congressoDa(policy),
      ...bloqueioDa(policy.id, state),
      ...exigenciasDa(policy.id),
      ...mesaDa(policy),
      filhas: [...exigencias.values()]
        .flat()
        .filter((r) => r.parentId === policy.id)
        .map((r) => {
          const filha = policyInForce(game.policies, r.childId);
          return {
            id: r.childId,
            nome: nomeDaLei.get(r.childId) ?? r.childId,
            valores: r.allowedLevels,
            ativa:
              filha !== undefined &&
              (r.baseLevel === undefined ||
                Math.abs(filha.desiredLevel - r.baseLevel) > 1e-9),
          };
        }),
    };
  });
  function congressoDa(policy: (typeof content.policies)[number]): {
    congresso?: VisaoLei["congresso"];
  } {
    if (partida.modo !== "real" || !game.congress) return {};
    const tipo = nivelNoCongresso(policy);
    if (tipo === "decreto") return {};
    return { congresso: { tipo, naFila: naFila.has(policy.id) } };
  }
  function bloqueioDa(
    id: string,
    state: (typeof game.policies)[number] | undefined,
  ): { bloqueio?: string } {
    const emVigor = policyInForce(game.policies, id);
    // em vigor: a meta atual sempre vale; testa uma meta diferente qualquer
    const bloqueio = requirementBlock(
      content,
      game.policies,
      id,
      emVigor ? Number.NaN : (state?.desiredLevel ?? 0),
    );
    return bloqueio ? { bloqueio } : {};
  }
  // V1-34: trava de opção (a meta atual sempre vale)
  function travaDa(
    id: string,
    valor: number,
    state: (typeof game.policies)[number] | undefined,
  ): { trava?: VisaoOpcao["trava"] } {
    if (state && Math.abs(state.desiredLevel - valor) < 1e-9) return {};
    const lock = optionLock(content, game.policies, id, valor);
    if (!lock) return {};
    return {
      trava: {
        lei: lock.parentId,
        nome: lock.parentName,
        motivo: `Exige ${lock.parentName} em: ${lock.allowedLabels.join(", ")}.${lock.reason ? ` ${lock.reason}` : ""}`,
      },
    };
  }
  // V1-34: a mesa e os vínculos da lei
  function mesaDa(policy: (typeof content.policies)[number]): {
    mesa?: VisaoLei["mesa"];
    vinculos?: VisaoLei["vinculos"];
  } {
    const vinculos = (policy.vinculos ?? []).map((v) => ({
      lei: v.lei,
      nome: nomeDaLei.get(v.lei) ?? v.lei,
      motivo: v.motivo,
    }));
    const mesa = policy.mesa;
    return {
      ...(vinculos.length ? { vinculos } : {}),
      ...(mesa
        ? {
            mesa: {
              id: mesa.id,
              nome: mesa.nome,
              camada: mesa.camada,
              camadas: content.policies
                .filter((p) => p.mesa?.id === mesa.id)
                .sort(
                  (a, b) =>
                    ORDEM_DA_CAMADA[a.mesa!.camada] -
                    ORDEM_DA_CAMADA[b.mesa!.camada],
                )
                .map((p) => {
                  const vigente = policyInForce(game.policies, p.id);
                  const opcao = vigente
                    ? p.controle.opcoes?.find(
                        (o) => Math.abs(o.valor - vigente.desiredLevel) < 1e-9,
                      )
                    : undefined;
                  return {
                    lei: p.id,
                    nome: p.nome,
                    camada: p.mesa!.camada,
                    emVigor: !!vigente,
                    ...(opcao ? { opcao: opcao.rotulo } : {}),
                  };
                }),
            },
          }
        : {}),
    };
  }
  function exigenciasDa(id: string): {
    exige?: VisaoExigencia;
    exigencias: readonly VisaoExigencia[];
  } {
    const lista = (exigencias.get(id) ?? []).map((r): VisaoExigencia => ({
      lei: r.parentId,
      nome: nomeDaLei.get(r.parentId) ?? r.parentId,
      opcoes: r.allowedLabels,
      base: r.baseLabel ?? "",
      atendida: requirementMet(r, game.policies),
      ...(r.reason ? { motivo: r.reason } : {}),
    }));
    return lista.length > 0
      ? { exige: lista[0], exigencias: lista }
      : { exigencias: lista };
  }
  const brutoDe = brutoDasSituacoes(partida, values);
  const comPiloto = partida.piloto !== game;
  const pilotoValues = partida.piloto.execution.values;
  const brutoPiloto = brutoDasSituacoes(partida, pilotoValues);
  const foraDoMapa = nosForaDoMapa(content);
  // o país pode trocar a medida de um índice pela dele (referencias.json)
  const pais = content.manifest?.nome ?? "";
  const medidaNoPais = (
    variable: (typeof content.variables.variaveis)[number],
  ) => {
    const doPais = medidaDoPais(pais, variable.id);
    return doPais && variable.medida
      ? { ...variable.medida, ...doPais }
      : variable.medida;
  };
  const bolhas = content.variables.variaveis
    .filter(
      (variable) =>
        variable.tipo !== "controle" && !foraDoMapa.has(variable.id),
    )
    .map((variable) => {
      const bolha = {
        id: variable.id,
        nome: variable.nome,
        tipo: variable.tipo,
        unidade: variable.unidade,
        area: variable.area ?? "",
        avaliacao: variable.avaliacao,
        valor:
          variable.tipo === "situacao"
            ? brutoDe(variable.id, variable.entrada ?? 0, variable.saida ?? 0)
            : (values[variable.id] ?? 0),
        ...escalaDe(variable),
        ...(variable.tipo === "situacao"
          ? {
              entrada: variable.entrada,
              saida: variable.saida,
              ativa: (values[variable.id] ?? 0) > 0,
            }
          : {}),
        ...(variable.pilar !== undefined ? { pilar: variable.pilar } : {}),
        ...((m) =>
          m && !m.tecnico
            ? {
                medida: {
                  valor: valorNaMedida(m, values[variable.id] ?? 0),
                  unidade: m.unidade,
                  convertida: m.zero !== undefined,
                  ...(m.zero !== undefined ? { zero: m.zero, cem: m.cem } : {}),
                },
              }
            : {})(medidaNoPais(variable)),
        ...(values[contextNodeId(variable.id)] !== undefined
          ? { contexto: values[contextNodeId(variable.id)] }
          : {}),
        ...(comPiloto
          ? {
              semVoce:
                variable.tipo === "situacao"
                  ? brutoPiloto(
                      variable.id,
                      variable.entrada ?? 0,
                      variable.saida ?? 0,
                    )
                  : (pilotoValues[variable.id] ?? 0),
            }
          : {}),
      };
      // País em frases: a bolha diz como está. Sem frase, a tela cai no
      // número — nunca em texto inventado.
      const frase = fraseDaBolha(bolha);
      return frase === undefined ? bolha : { ...bolha, frase };
    });
  const controlToLaw = new Map(
    content.policies.map((policy) => [policy.controle.variavel, policy.id]),
  );
  // SG106: as setas de ocorrência só aparecem enquanto ela está em curso
  const catalogo = occurrenceCatalog(content);
  const emCurso = new Map(
    (game.occurrences?.active ?? []).map((a) => [a.control, a]),
  );
  const ligacoes = content.consequences.flatMap((consequence) => {
    if (foraDoMapa.has(consequence.alvo) || foraDoMapa.has(consequence.origem))
      return [];
    const parametros = consequence.parametros;
    const dona = catalogo.ownerByControl.get(consequence.origem);
    let ocorrencia: VisaoLigacao["ocorrencia"];
    if (dona) {
      const ativa = emCurso.get(consequence.origem);
      if (!ativa) return [];
      const o = catalogo.byId.get(dona);
      const opcao = o?.opcoes?.find((x) => x.id === ativa.optionId);
      ocorrencia = {
        id: dona,
        nome: opcao
          ? `${preencher(o?.nome ?? dona, ativa.vars)}: ${opcao.rotulo}`
          : preencher(o?.nome ?? dona, ativa.vars),
      };
    }
    // Tabela de pontos (custo por opção): o sinal é o da maior saída.
    const forte = parametros.pontos
      ? parametros.pontos.reduce(
          (best, [, y]) => (Math.abs(y) > Math.abs(best) ? y : best),
          0,
        )
      : Number(parametros.coeficiente ?? 1);
    const ligacao: VisaoLigacao = {
      id: consequence.id,
      origem: controlToLaw.get(consequence.origem) ?? consequence.origem,
      alvo: consequence.alvo,
      sinal: forte < 0 ? -1 : 1,
      // O conteúdo da partida já é mensal (prepareMonthlyContent).
      atrasoMeses: consequence.atrasoPassos,
      mecanismo: consequence.mecanismo,
      ...(ocorrencia ? { ocorrencia } : {}),
    };
    // Produto (D-50) e custo que reage (D-52): o outro nó também empurra o
    // alvo (consumo → receita, dívida → juros, desemprego → gasto), e o
    // jogador precisa ver essa seta.
    const outros = [consequence.normalizacao?.fator, consequence.escala?.fator];
    return [
      ligacao,
      ...outros
        .filter((id): id is string => id !== undefined)
        .map((id) => ({
          ...ligacao,
          id: `${consequence.id}~${id}`,
          origem: id,
          mecanismo: "produto",
        })),
    ];
  });
  const pressao = pressaoDaPartida(partida);
  return {
    pais: content.manifest?.nome ?? "",
    cenario: content.initialState.cenario?.nome ?? content.manifest?.nome ?? "",
    turno: game.currentTurn,
    contas: lerContas(content, values),
    orcamento: linhasDoOrcamento(partida, values),
    grupos: gruposDaPartida(partida, values, alteradas),
    ocorrencias: ocorrenciasDaPartida(partida),
    ...(pressao ? { pressao } : {}),
    governo,
    leis,
    bolhas,
    ligacoes,
  };
}

/**
 * Áreas e ministérios do país (D-64). País sem ministérios em `politica.json` (os
 * pacotes de teste) cai no campo `ministerio` de cada lei: uma área por
 * ministério citado.
 */
function governoDaPartida(content: ResolvedPackage): VisaoArea[] {
  const estrutura = ESTRUTURAS[content.manifest?.id ?? ""];
  if (estrutura) {
    const existe = new Set(content.policies.map((p) => p.id));
    return estrutura.areas.map((area) => {
      const ministerios = estrutura.ministerios
        .filter((m) => m.area === area.id)
        .map((m) => ({
          id: m.id,
          nome: m.nome,
          cargo: m.cargo,
          leis: m.leis.filter((lei) => existe.has(lei)),
          extinguivel: Boolean(m.extincao),
        }));
      const doMundo = AREA_DO_MUNDO.get(area.id);
      return {
        id: area.id,
        titulo: doMundo?.titulo ?? area.titulo,
        curto: area.curto,
        faz: doMundo?.faz ?? area.faz,
        cargo:
          ministerios.find((m) => m.id === area.coordenador)?.cargo ??
          ministerios[0]?.cargo ??
          "",
        ministerios,
      };
    });
  }
  const porNome = new Map<string, string[]>();
  for (const policy of content.policies) {
    const nome = policy.ministerio ?? policy.area ?? "Governo";
    porNome.set(nome, [...(porNome.get(nome) ?? []), policy.id]);
  }
  return [...porNome].map(([nome, leis]) => {
    const curto = nome.replace(/^Ministério (da|do|dos|das|de) /, "");
    return {
      id: nome,
      titulo: curto,
      curto,
      faz: "",
      cargo: curto,
      ministerios: [{ id: nome, nome, cargo: curto, leis, extinguivel: false }],
    };
  });
}

/** Setas que saem do nó de uma ocorrência (o que ela mexe enquanto dura). */
export function efeitosDoNo(
  content: ResolvedPackage,
  controle: string,
): VisaoEfeitoOcorrencia[] {
  const variaveis = new Map(content.variables.variaveis.map((v) => [v.id, v]));
  return content.consequences
    .filter((c) => c.origem === controle)
    .map((c) => {
      const alvo = variaveis.get(c.alvo);
      return {
        id: c.alvo,
        nome: alvo?.nome ?? c.alvo,
        unidade: alvo?.unidade ?? c.unidade,
        pontos: c.parametros.coeficiente ?? 0,
        ...(alvo?.avaliacao ? { avaliacao: alvo.avaliacao } : {}),
      };
    });
}

/** Nomes das fichas que não são o nome exato do segmento. */
const SEGMENTO_ALIAS: Readonly<Record<string, string>> = {
  "pequenos negócios": "grupo_pequenos_negocios",
  "pequenos empreendedores": "grupo_pequenos_negocios",
  agronegócio: "grupo_agro",
  agro: "grupo_agro",
  periferias: "grupo_periferias",
  informais: "grupo_informais",
  servidores: "grupo_servidores",
  trabalhadores: "grupo_trabalhadores",
};

/** Popularidade da opção: +1 se o segmento apoia, −1 se rejeita, 0 se não cita. */
function popularidadeDa(
  opcao:
    | {
        readonly apoiam?: readonly string[];
        readonly rejeitam?: readonly string[];
      }
    | undefined,
  segmentoPorNome: ReadonlyMap<string, string>,
): Pick<VisaoLei, "popularidade"> {
  if (!opcao || (!opcao.apoiam?.length && !opcao.rejeitam?.length)) return {};
  const nota = new Map<string, number>();
  for (const nome of opcao.apoiam ?? []) {
    const id = segmentoPorNome.get(nome.toLowerCase());
    if (id) nota.set(id, (nota.get(id) ?? 0) + 1);
  }
  for (const nome of opcao.rejeitam ?? []) {
    const id = segmentoPorNome.get(nome.toLowerCase());
    if (id) nota.set(id, (nota.get(id) ?? 0) - 1);
  }
  if (!nota.size) return {};
  const segmentos: Record<string, number> = {};
  let soma = 0;
  for (const [id, n] of nota) {
    const t = 50 + 50 * Math.max(-1, Math.min(1, n));
    segmentos[id] = t;
    soma += t;
  }
  return { popularidade: { pais: soma / nota.size, segmentos } };
}
