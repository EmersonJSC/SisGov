// Estado do turno 0: confere o país e monta tudo o que a partida começa sabendo.
import { semear } from "../acaso";
import {
  atendimentoInicial,
  fraquezaDaRede,
  indiceDoAtendimento,
} from "../atendimento";
import { ehBase } from "../calculos";
import { filaInicial, somaPorIndice } from "../efeitos";
import {
  type IndicesEssenciais,
  type Estado,
  INDICES_ESSENCIAIS,
} from "../estado";
import { type GovernoDoPais, iniciarGoverno } from "../governo";
import { iniciarMidia } from "../midia";
import { iniciarProgramas } from "../programas";
import { motivoGruposInvalidos, type Marco, rendaDoGrupo } from "../grupos";
import { type ValorLei, leiAtiva } from "../leis";
import {
  precosIniciais,
  capacidadeInicial,
  empregoDoPais,
  construcoesIniciais,
  precoDosSetores,
} from "../mercado";
import { juizesIniciais } from "../judiciario";
import { moradiaInicial } from "../moradia";
import { motivoOpinioesInvalidas } from "../mundo";
import { motivoCongressoInvalido, iniciarCongresso } from "../politica";
import { motivoPopsInvalidos, parteAbaixoDe, rendaMedia } from "../populacao";
import {
  saneamentoInicial,
  rendaParaAConta,
  trabalhoEmObra,
} from "../saneamento";
import { leisDoAtendimento } from "./etapas/atendimento";
import { fluxosDoTurno, mostrarContas } from "./etapas/economia";
import { invariantes } from "./etapas/invariantes";
import {
  comIndicesDasCestas,
  indicesDoFisco,
  todosIndices,
  valorDosServicos,
} from "./etapas/jogabilidade";
import { comReputacao } from "./etapas/mundo";
import { pessoasNaFolha, indiceDoInformal } from "./etapas/obras";
import { pops, grupos } from "./etapas/populacao";
import { leisDoSaneamento } from "./etapas/saneamento";
import type { Regras } from "./regras";

export interface Inicio {
  semente: number;
  essenciais: IndicesEssenciais;
  /** Índices de jogabilidade como o país está hoje, com as leis que tem. */
  jogabilidade: Record<string, number>;
  leis: Record<string, ValorLei>;
  /** Partidos da base no começo (com Congresso). */
  coligacao?: string[];
  /** Opinião de partida de cada potência (com potências). */
  opinioes?: Record<string, number>;
  /** Ministros de partida do país (com governo). */
  governo?: GovernoDoPais;
}
function erro(mensagem: string): never {
  throw new Error(mensagem);
}

type Obras = NonNullable<Regras["mercado"]>["mercado"]["obras"];

/** Leis e índices que o país declara existem no mundo e fecham entre si. */
function conferirLeisEIndices(regras: Regras, inicio: Inicio) {
  for (const id of Object.keys(inicio.leis))
    if (!(id in regras.leis)) erro(`país: lei "${id}" não existe`);
  const calculados = new Set(
    regras.mercado?.mercado.cestas.map((c) => c.indice),
  );
  for (const id of Object.keys(regras.dominios))
    if (!(id in inicio.jogabilidade) && !calculados.has(id))
      erro(`país: falta o índice ${id}`);
  for (const d of regras.derivas ?? []) {
    if (!(d.indice in regras.dominios))
      erro(`mundo: deriva de índice "${d.indice}" que não existe`);
    if (!(d.por in regras.dominios) && !(d.por in inicio.essenciais))
      erro(`mundo: deriva empurrada por "${d.por}", que não existe`);
  }
  for (const [a, b] of regras.colisoes ?? []) {
    for (const id of [a, b])
      if (!(id in regras.leis))
        erro(`mundo: colisão com lei "${id}", que não existe`);
    const leis = regras.leis;
    if (leiAtiva(leis[a], inicio.leis[a]) && leiAtiva(leis[b], inicio.leis[b]))
      erro(`país: "${a}" e "${b}" colidem e começam as duas`);
  }
  for (const base of Object.keys(regras.pais.bases))
    if (!ehBase(base)) erro(`país: base "${base}" não existe`);
}

/** Fontes de energia e camadas do mercado apontam leis certas; obras têm índice. */
function conferirMercado(regras: Regras) {
  for (const c of regras.mercado?.mercado.capacidades ?? [])
    for (const f of c.fontes) {
      const lei = regras.leis[f.lei];
      if (!lei || lei.forma !== "continua")
        erro(
          `mundo: fonte "${f.id}" aponta a lei "${f.lei}", que não é contínua`,
        );
      if (!(f.id in (regras.mercado?.capacidade ?? {})))
        erro(`país: falta a capacidade da fonte "${f.id}"`);
    }
  for (const c of regras.mercado?.mercado.capacidades ?? [])
    for (const camada of c.camadas ?? []) {
      const lei = regras.leis[camada.lei];
      if (!lei || lei.forma !== "opcoes")
        erro(`mundo: camada "${camada.lei}" não é uma lei de opções`);
      for (const id of Object.keys(camada.opcoes))
        if (!lei?.opcoes.some((o) => o.id === id))
          erro(
            `mundo: camada "${camada.lei}" cita a opção "${id}", que a lei não tem`,
          );
    }
  const obras = regras.mercado?.mercado.obras;
  if (obras && !(obras.indice_atraso in regras.dominios))
    erro(`mundo: obras: o índice "${obras.indice_atraso}" não existe`);
}

/** Índices, pops ou leis que a regra cita existem e têm a forma certa. */
const faltaIndice = (regras: Regras, regra: string, ids: string[]) => {
  for (const id of ids)
    if (!(id in regras.dominios))
      erro(`mundo: ${regra}: o índice "${id}" não existe`);
};
const faltaPop = (regras: Regras, regra: string, ids: string[]) => {
  for (const id of ids)
    if (!regras.pops.some((p) => p.id === id))
      erro(`mundo: ${regra}: o pop "${id}" não existe`);
};
const faltaLei = (
  regras: Regras,
  regra: string,
  ids: string[],
  forma: "continua" | "opcoes",
) => {
  for (const id of ids)
    if (regras.leis[id]?.forma !== forma)
      erro(
        `mundo: ${regra}: "${id}" não é ${forma === "continua" ? "lei contínua" : "lei de opções"}`,
      );
};

function conferirMoradia(regras: Regras, inicio: Inicio, obras: Obras) {
  const r = regras.moradia;
  if (!r) return;
  if (!obras) erro("mundo: moradia precisa da regra das obras");
  faltaIndice(regras, "moradia", [
    r.indice_deficit,
    r.indice_favela,
    r.indice_preco,
    r.indice_terra,
    ...(r.indice_vazias ? [r.indice_vazias] : []),
  ]);
  faltaPop(regras, "moradia", r.pops_campo);
  faltaLei(regras, "moradia", [r.lei_verba], "continua");
  if (
    inicio.jogabilidade[r.indice_favela] > inicio.jogabilidade[r.indice_deficit]
  )
    erro("país: favela maior que o déficit habitacional");
}

function conferirJudiciario(regras: Regras) {
  const r = regras.judiciario;
  if (!r) return;
  faltaIndice(regras, "judiciário", [r.indice_independencia]);
  faltaLei(regras, "judiciário", [r.lei_escolha], "opcoes");
  const lei = regras.leis[r.lei_escolha];
  for (const o of lei.forma === "opcoes" ? lei.opcoes : [])
    if (!(o.id in r.modos))
      erro(`mundo: judiciário: a opção "${o.id}" da lei não tem modo`);
}

function conferirSaneamento(regras: Regras, obras: Obras) {
  const r = regras.saneamento;
  if (!r) return;
  if (!regras.moradia || !obras)
    erro("mundo: saneamento precisa da moradia e das obras");
  faltaIndice(regras, "saneamento", [
    r.indice,
    r.indice_vida,
    r.indice_ambiente,
  ]);
  faltaLei(regras, "saneamento", [r.lei_verba], "continua");
  faltaLei(
    regras,
    "saneamento",
    [r.lei_concessao, r.lei_teto, r.lei_tratamento],
    "opcoes",
  );
}

function conferirAtendimento(regras: Regras, obras: Obras) {
  const r = regras.atendimento;
  if (!r) return;
  if (!obras) erro("mundo: atendimento precisa das obras");
  faltaIndice(regras, "atendimento", [
    r.indice,
    r.indice_profissionais,
    r.indice_instrucao,
    r.indice_desvio,
    r.indice_desigualdade,
    r.indice_vida,
    r.indice_informal,
    r.indice_vacina,
    r.indice_liberdade,
  ]);
  faltaPop(regras, "atendimento", [
    r.pop_profissionais,
    r.pop_origem,
    r.pop_informal,
    ...r.pops_folha,
  ]);
  faltaLei(regras, "atendimento", [r.lei_verba, r.lei_basica], "continua");
  faltaLei(
    regras,
    "atendimento",
    [
      r.lei_abertura,
      r.lei_limite,
      r.lei_seguro,
      r.lei_gratuidade,
      r.lei_cobranca,
      r.lei_deducao,
      r.lei_conta,
      r.lei_filantropia,
      r.lei_gestao,
      r.lei_carreira,
      r.lei_missao,
      r.lei_ambiental,
      r.lei_vacina,
      r.lei_recusa,
      ...r.leis_alcance,
    ],
    "opcoes",
  );
}

/** Pops, grupos, Congresso e potências do país fecham com o mundo. */
function conferirPessoasEPoder(
  regras: Regras,
  inicio: Inicio,
  coligacao: string[],
) {
  const motivoPops = motivoPopsInvalidos(regras.pops, regras.pais.pops);
  if (motivoPops) erro(`país: ${motivoPops}`);
  const motivoGrupos = motivoGruposInvalidos(
    regras.grupos,
    regras.pops.map((p) => p.id),
    [...INDICES_ESSENCIAIS, ...Object.keys(regras.dominios)],
  );
  if (motivoGrupos) erro(`mundo: ${motivoGrupos}`);
  if (regras.congresso) {
    const motivo = motivoCongressoInvalido(
      regras.congresso,
      coligacao,
      regras.grupos.map((g) => g.id),
    );
    if (motivo) erro(`país: congresso: ${motivo}`);
  }
  if (!regras.potencias) return;
  if (!regras.indiceReputacao || !(regras.indiceReputacao in regras.dominios))
    erro("mundo: falta o índice da reputação");
  for (const id of [regras.indicePoderDefensivo, regras.indiceSegurancaExterna])
    if (id && !(id in regras.dominios)) erro(`mundo: falta o índice "${id}"`);
  if (!regras.indicePoderDefensivo !== !regras.indiceSegurancaExterna)
    erro("mundo: poder defensivo e segurança externa vão juntos");
  const motivo = motivoOpinioesInvalidas(regras.potencias, inicio.opinioes);
  if (motivo) erro(`país: ${motivo}`);
}

/** Estado do turno 0 antes das contas, dos pops e dos serviços. */
function estadoBase(
  regras: Regras,
  inicio: Inicio,
  coligacao: string[],
): Estado {
  const efeitos = filaInicial(regras.leis, inicio.leis);
  const soma = somaPorIndice(efeitos);
  const base = Object.fromEntries(
    Object.entries(inicio.jogabilidade).map(([id, v]) => [
      id,
      v - (soma[id] ?? 0),
    ]),
  );
  const { pib_nominal, cofre, divida_publica } = inicio.essenciais;
  const mercado = regras.mercado;
  return {
    turno: 0,
    acaso: semear(inicio.semente),
    essenciais: { ...inicio.essenciais },
    tesouro: {
      cofre: (cofre / 100) * pib_nominal,
      divida: (divida_publica / 100) * pib_nominal,
      resultado: 0,
    },
    jogabilidade: { ...inicio.jogabilidade },
    base,
    leis: { ...inicio.leis },
    efeitos,
    pops: {},
    grupos: {},
    marco: { indices: {}, leis: {}, renda_real: {} },
    opinioes: regras.potencias ? { ...inicio.opinioes } : {},
    precos: mercado ? precosIniciais(mercado.mercado, mercado.producao) : {},
    capacidade: mercado
      ? capacidadeInicial(
          mercado.mercado.capacidades ?? [],
          mercado.capacidade,
          inicio.leis,
        )
      : {},
    choques: {},
    coligacao: [...coligacao],
    votacoes: [],
    desgaste: 0,
    inicio_mandato: 0,
    eleicao: null,
    encerrada: false,
    fatos: [],
    ...(regras.congresso
      ? { congresso: iniciarCongresso(regras.congresso, [...coligacao]) }
      : {}),
    ...(regras.governo && inicio.governo
      ? {
          governo: iniciarGoverno(
            inicio.governo,
            regras.governo,
            regras.leis,
            inicio.leis,
          ),
        }
      : {}),
    ...(regras.judiciario
      ? { judiciario: juizesIniciais(regras.judiciario, inicio.semente) }
      : {}),
    midia: iniciarMidia(regras.midia ?? { midias: [] }),
    ...(regras.programas
      ? {
          programas: iniciarProgramas(
            {
              regras: regras.programas,
              tipos: regras.grupos,
              leis: regras.leis,
              valores: inicio.leis,
            },
            0,
          ),
        }
      : {}),
  };
}

/** Atraso das obras hoje, que os serviços leem. */
const atrasoDasObras = (obras: NonNullable<Obras>, e: Estado) =>
  e.jogabilidade[obras.indice_atraso] ?? 0;

/** Construções do turno 0: cada setor vale a renda que paga (motor/mercado). */
function construcoesDoTurnoZero(regras: Regras, e: Estado): Estado {
  const m = regras.mercado;
  if (!m?.mercado.obras) return e;
  const emprego = empregoDoPais(m.mercado, m.ocupacao, e.pops);
  return {
    ...e,
    construcoes: construcoesIniciais(
      m.mercado.obras,
      Object.fromEntries(emprego.setores.map((s) => [s.id, s.massa + s.lucro])),
      regras.pais.crescimento.tendencia,
      atrasoDasObras(m.mercado.obras, e),
      {
        salarios: Object.fromEntries(
          emprego.setores.map((s) => [s.id, s.massa]),
        ),
        preco0: precoDosSetores(m.mercado, e.precos),
      },
    ),
  };
}

function moradiaDoTurnoZero(regras: Regras, e: Estado): Estado {
  const r = regras.moradia;
  const obras = regras.mercado?.mercado.obras;
  if (!r || !obras) return e;
  const verba = e.leis[r.lei_verba];
  return {
    ...e,
    moradia: moradiaInicial(r, obras, {
      populacao: e.essenciais.populacao,
      deficit: e.jogabilidade[r.indice_deficit],
      favela: e.jogabilidade[r.indice_favela],
      verba: typeof verba === "number" ? verba : 0,
      atraso: atrasoDasObras(obras, e),
    }),
  };
}

function saneamentoDoTurnoZero(regras: Regras, e: Estado): Estado {
  const r = regras.saneamento;
  const obras = regras.mercado?.mercado.obras;
  if (!r || !regras.moradia || !obras) return e;
  const leis = leisDoSaneamento(regras, r, e.leis);
  return {
    ...e,
    saneamento: saneamentoInicial(r, {
      populacao: e.essenciais.populacao,
      saneamento: e.jogabilidade[r.indice],
      leis,
      atraso: atrasoDasObras(obras, e),
      sem_bolso: parteAbaixoDe(
        e.pops,
        rendaParaAConta(r, leis) * rendaMedia(e.pops),
      ),
      trabalho_casas: trabalhoEmObra(
        r,
        regras.moradia.custo_casa,
        e.moradia?.obras ?? [],
        [],
      ),
    }),
  };
}

function atendimentoDoTurnoZero(regras: Regras, e: Estado): Estado {
  const r = regras.atendimento;
  const obras = regras.mercado?.mercado.obras;
  if (!r || !obras) return e;
  const { populacao } = e.essenciais;
  const profissionais = e.pops[r.pop_profissionais].pessoas;
  const atendimento = e.jogabilidade[r.indice];
  const inicial = atendimentoInicial(r, {
    populacao,
    profissionais,
    atendimento,
    leis: leisDoAtendimento(regras, r, e.leis),
    atraso: atrasoDasObras(obras, e),
    com_bolso: 1 - parteAbaixoDe(e.pops, r.renda_plano * rendaMedia(e.pops)),
    na_folha: pessoasNaFolha(r, e.pops, populacao),
    informal: indiceDoInformal(r, e.pops, populacao),
    vacina: e.jogabilidade[r.indice_vacina],
  });
  const teto = indiceDoAtendimento(r, {
    populacao,
    profissionais,
    vagas: populacao,
    planos: inicial.planos,
    seguro: inicial.seguro,
    procura: inicial.procura,
  });
  if (atendimento > teto + 1e-6)
    erro("país: atendimento maior que o dos profissionais");
  // Os pontos da rede na saúde já contam no turno 0: o turno 1 não salta.
  const fraqueza = fraquezaDaRede(r, {
    populacao,
    profissionais,
    vagas: inicial.vagas,
    planos: inicial.planos,
    seguro: inicial.seguro,
    alcance: inicial.alcance,
    cobertura: inicial.cobertura,
    fraco: leisDoAtendimento(regras, r, e.leis).fraco,
    procura: inicial.procura,
    filantropia: inicial.filantropia,
    reserva: inicial.reserva,
    disputa: inicial.disputa,
    missao: inicial.missao,
    ambiental: inicial.ambiental,
    ambiente: e.jogabilidade[r.indice_ambiente],
  });
  return { ...e, atendimento: { ...inicial, fraqueza } };
}

/** O marco é o próprio turno 0: grupos começam em 50. */
function marcoDoTurnoZero(regras: Regras, e: Estado): Marco {
  return {
    renda_pop: Object.fromEntries(
      Object.entries(e.pops).map(([id, p]) => [
        id,
        (p.renda * 100) / e.essenciais.indice_precos,
      ]),
    ),
    casa_razao: Object.fromEntries(
      Object.entries(e.pops)
        .filter(([, p]) => p.casa && p.renda > 0)
        .map(([id, p]) => [id, p.casa!.renda / p.renda]),
    ),
    poder_pop: Object.fromEntries(
      Object.entries(e.pops).map(([id, p]) => [id, p.poder ?? 0]),
    ),
    ...(regras.servicos?.length
      ? { valor_servico: valorDosServicos(regras, e) }
      : {}),
    indices: todosIndices(e),
    leis: { ...e.leis },
    renda_real: Object.fromEntries(
      regras.grupos.map((t) => [
        t.id,
        rendaDoGrupo(t, e.pops, e.essenciais.indice_precos).renda_real,
      ]),
    ),
  };
}

/**
 * Estado do turno 0. Confere leis e índices; as leis vigentes já estão
 * inteiras. Lei do mundo que o país não declarou fica não legislada: não
 * arrecada, não gasta, não mexe em índice, e pode ser proposta na partida.
 */
export function estadoInicial(regras: Regras, inicio: Inicio): Estado {
  const coligacao = inicio.coligacao ?? [];
  const obras = regras.mercado?.mercado.obras;
  conferirLeisEIndices(regras, inicio);
  conferirMercado(regras);
  conferirMoradia(regras, inicio, obras);
  conferirSaneamento(regras, obras);
  conferirJudiciario(regras);
  conferirAtendimento(regras, obras);
  conferirPessoasEPoder(regras, inicio, coligacao);

  const estado = estadoBase(regras, inicio, coligacao);
  // Turno 0 mostra as contas sem fechar: cofre e dívida são os declarados.
  const fluxos = fluxosDoTurno(regras, estado);
  const montado = [
    construcoesDoTurnoZero,
    moradiaDoTurnoZero,
    saneamentoDoTurnoZero,
    atendimentoDoTurnoZero,
  ].reduce(
    (e, etapa) => etapa(regras, e),
    comIndicesDasCestas(regras, {
      ...comReputacao(regras, estado),
      essenciais: mostrarContas(estado.essenciais, fluxos, estado.tesouro),
      pops: pops(regras, estado),
    }),
  );
  // As contas de novo, com a rede de saúde do turno 0 já montada: sem isso o
  // gasto do turno 1 parece um salto (estoura o teto, puxa a inflação).
  const comPops = {
    ...comReputacao(regras, montado),
    essenciais: mostrarContas(
      montado.essenciais,
      fluxosDoTurno(regras, montado),
      montado.tesouro,
    ),
    // Índice que o motor calcula (déficit da previdência) já sai da conta no
    // turno 0, não do valor declarado.
    jogabilidade: {
      ...comReputacao(regras, montado).jogabilidade,
      ...indicesDoFisco(regras, montado),
    },
  };
  const marco = marcoDoTurnoZero(regras, comPops);
  return invariantes(
    regras,
    {
      ...comPops,
      marco,
      grupos: grupos(regras, comPops, marco),
      // O rombo normal é o do turno 0, antes de qualquer decisão do jogador.
      ...(regras.fisco?.inflacao
        ? {
            inflacao: {
              rombo0: comPops.essenciais.resultado_primario,
              herdado: Math.max(0, -comPops.essenciais.resultado_fiscal),
              perda: 0,
            },
          }
        : {}),
    },
    [],
  );
}
