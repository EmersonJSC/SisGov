// Monta a VisaoPartida (formato da tela antiga do mapa) a partir da partida
// nova. Só lê: nomes e textos vêm do JSON das leis e do mundo.
import {
  balancoDoPais,
  contaDoPais,
  segurancaDaCesta,
  empregoDoPais,
  maisBarata,
  arrecadacao,
  BASES,
  gastoDasLeis,
  situacoesDeCapacidade,
  pontosLei,
  impostoSobreLucro,
  lucroDosSetores,
  precoDosSetores,
  obrasPorSetor,
  TURNOS_ATE_FECHAR,
  type Deriva,
  type RegraDoAtendimento,
  type RegraDoSaneamento,
  type Estado,
  type Lei,
  type LeiContinua,
  type LeiOpcoes,
  type Regras,
  type TipoGrupo,
} from "../motor";
import tiposPops from "../conteudo/mundo/pops/pops.json";
import areas from "../conteudo/mundo/areas/areas.json";
import variaveis from "../conteudo/mundo/indicadores/variaveis.json";
import tiposGrupos from "../conteudo/mundo/grupos/grupos.json";
import type { Partida } from ".";
import { mesesDaObra, mesesDaRede, mesesDaSaude } from "./previa";
import type {
  VisaoArea,
  VisaoBolha,
  VisaoConstrucao,
  VisaoLei,
  VisaoLigacao,
  VisaoMercado,
  VisaoPartida,
} from "./tiposVisao";

interface Textos {
  nome?: string;
  descricao?: string;
  opcoes?: { id: string; rotulo?: string }[];
}

const textosDasLeis = import.meta.glob<Textos>(
  "../conteudo/mundo/leis/*.json",
  { eager: true, import: "default" },
);
const textos = new Map(
  Object.values(textosDasLeis).map((t) => [(t as { id: string }).id, t]),
);

const nomeDoId = (id: string) => {
  const t = id.replace(/-/g, " ");
  return t[0].toUpperCase() + t.slice(1);
};

function areaDaLei(): Map<string, (typeof areas.areas)[number]> {
  if (areas.versao !== 1)
    throw new Error("mundo/areas/areas.json › versao: precisa ser 1");
  return new Map(areas.areas.flatMap((a) => a.leis.map((id) => [id, a])));
}

function governo(): VisaoArea[] {
  return areas.areas.map((a) => ({
    id: a.id,
    titulo: a.titulo,
    curto: a.curto,
    faz: a.faz,
    cargo: a.cargo,
    ministerios: [
      {
        id: a.id,
        nome: a.titulo,
        cargo: a.cargo,
        leis: a.leis,
        extinguivel: false,
      },
    ],
  }));
}

/**
 * Zona de alerta do controle, em % (imposto: o pico da receita que o país
 * declara; verba: o valor em que o gasto total iguala a receita de hoje, ou o valor
 * em vigor se já há déficit).
 */
function alertaDaLei(
  lei: Lei,
  regras: Regras,
  estado: Estado,
): VisaoLei["alerta"] {
  if (lei.forma !== "continua" || lei.unidade !== "fracao") return undefined;
  if (lei.calculo) {
    const base = lei.calculo.base;
    const pico = regras.pais.bases[base]?.pico ?? BASES[base].padrao.pico;
    return { tipo: "imposto", limite: pico * 100 };
  }
  if (lei.conta !== "gasto") return undefined;
  const receita =
    arrecadacao(regras, estado.leis, estado.essenciais) +
    regras.pais.receita_fora_das_leis;
  const gasto =
    gastoDasLeis(regras, estado.leis) + regras.pais.gasto_fora_das_leis;
  const nivel = Number(estado.leis[lei.id] ?? lei.faixa.min) * 100;
  // com déficit, o valor em vigor já é o limite: cortar verba nunca piora
  return { tipo: "verba", limite: nivel + Math.max(0, receita - gasto) };
}

/**
 * Receita do imposto em % do PIB para as alíquotas de 0 a 100% (de 1 em 1
 * ponto): a curva não é linear, então a tela lê o ponto do pino.
 */
function curvaDoImposto(lei: Lei, regras: Regras, estado: Estado): number[] {
  if (lei.forma !== "continua" || !lei.calculo) return [];
  const base = lei.calculo.base;
  const parametros = regras.pais.bases[base] ?? {
    ...BASES[base].padrao,
    parcela_pib: 0,
  };
  const pib = estado.essenciais.pib_nominal;
  return Array.from(
    { length: 101 },
    (_, i) =>
      (BASES[base].arrecadar(
        i / 100,
        pib * parametros.parcela_pib,
        parametros,
      ) /
        pib) *
      100,
  );
}

/** Diz à tela o que o valor da lei rende ou custa no caixa (só leis em %). */
function comFluxo(
  visao: VisaoLei,
  lei: Lei,
  regras: Regras,
  estado: Estado,
): VisaoLei {
  if (lei.forma !== "continua") return visao;
  if (lei.calculo)
    return {
      ...visao,
      fluxo: { tipo: "imposto", curva: curvaDoImposto(lei, regras, estado) },
    };
  if (lei.conta === "gasto") return { ...visao, fluxo: { tipo: "verba" } };
  return visao;
}

type Area = (typeof areas.areas)[number];
type TextosDaLei = NonNullable<ReturnType<typeof textos.get>>;

/** Campos que toda lei tem na tela, de régua ou de degraus. */
function visaoComumDaLei(
  lei: Lei,
  valor: number | string,
  area: Area,
  t: TextosDaLei,
) {
  return {
    id: lei.id,
    nome: t.nome ?? nomeDoId(lei.id),
    descricao: t.descricao ?? "",
    area: area.id,
    ministerios: [area.titulo],
    ministerio: area.titulo,
    ministerioId: area.id,
    areas: [area.id],
    alteradaPorVoce: false,
    saldoAnual: 0,
    emVigor: true,
    revogavel: false,
    exigencias: [],
    filhas: [],
    ...(valor === undefined ? { naoLegislada: true } : {}),
  };
}

/** Lei de régua: sem valor no país, o motor a conta no mínimo da faixa. */
function visaoDaRegua(
  lei: LeiContinua,
  valor: number | string,
  alerta: VisaoLei["alerta"],
) {
  const escala = lei.unidade === "fracao" ? 100 : 1;
  const nivel = Number(valor ?? lei.faixa.min) * escala;
  return {
    grupo: lei.calculo
      ? "tributaria"
      : lei.conta
        ? "orcamentaria"
        : "regulatoria",
    familia: lei.calculo ? "imposto" : lei.conta ? "verba" : "regra",
    processo: "lei-ordinaria",
    nivel,
    meta: nivel,
    minimo: lei.faixa.min * escala,
    maximo: lei.faixa.max * escala,
    passo: lei.passo * escala,
    ...(alerta ? { alerta } : {}),
    unidade: lei.unidade === "fracao" ? "percentual_0_100" : lei.unidade,
    ...(lei.rotulo_unidade ? { rotuloUnidade: lei.rotulo_unidade } : {}),
  };
}

/** Lei de degraus: a opção vale a posição dela na lista; a de mandato é da Constituição. */
function visaoDosDegraus(
  lei: LeiOpcoes,
  valor: number | string,
  t: TextosDaLei,
) {
  const constitucional = lei.opcoes.some((o) => o.mandato_anos !== undefined);
  const nivel = lei.opcoes.findIndex((o) => o.id === valor);
  return {
    grupo: constitucional ? "institucional" : "regulatoria",
    familia: constitucional ? "constitucional" : "regra",
    processo: constitucional ? "emenda-constitucional" : "lei-ordinaria",
    nivel,
    meta: nivel,
    unidade: "opcao",
    opcoes: lei.opcoes.map((o, i) => ({
      id: o.id,
      rotulo: t.opcoes?.find((x) => x.id === o.id)?.rotulo ?? nomeDoId(o.id),
      valor: i,
      saldoAnual: 0,
    })),
    opcaoAtual: valor === undefined ? undefined : String(valor),
  };
}

function visaoDaLei(
  lei: Lei,
  valor: number | string,
  area: Area,
  alerta: VisaoLei["alerta"],
): VisaoLei {
  const t = textos.get(lei.id) ?? {};
  const comum = visaoComumDaLei(lei, valor, area, t);
  return {
    ...comum,
    ...(lei.forma === "continua"
      ? visaoDaRegua(lei, valor, alerta)
      : visaoDosDegraus(lei, valor, t)),
  } as VisaoLei;
}

/** Pontos (faixa inteira) a partir dos quais a lei liga uma seta ao grupo. */
const SETA_GRUPO = 10;

type Seta = [origem: string, alvo: string, sinal: 1 | -1];

const ligacao = (
  origem: string,
  alvo: string,
  sinal: 1 | -1,
  atrasoMeses = 0,
): VisaoLigacao => ({
  id: `${origem}>${alvo}`,
  origem,
  alvo,
  sinal,
  atrasoMeses,
  mecanismo: "afim",
});

/** As leis da saúde agem pela contagem, sem efeito declarado na lei. */
function ligacoesDaSaude(
  leis: Lei[],
  saude: { regra: RegraDoAtendimento; atrasoMeses: number },
): VisaoLigacao[] {
  const r = saude.regra;
  const alcance = r.leis_alcance.flatMap((id): Seta[] => {
    const lei = leis.find((l) => l.id === id);
    return [
      [id, r.indice, 1],
      ...(lei?.forma === "opcoes" && lei.opcoes.some((o) => o.valores?.fraco)
        ? ([[id, r.indice_vida, -1]] as Seta[])
        : []),
      ...(lei?.forma === "opcoes" && lei.opcoes.some((o) => o.valores?.abandono)
        ? ([[id, r.indice_profissionais, -1]] as Seta[])
        : []),
    ];
  });
  const setas: Seta[] = [
    [r.lei_verba, r.indice, 1],
    [r.lei_verba, r.indice_desvio, 1],
    [r.lei_abertura, r.indice, 1],
    [r.lei_abertura, r.indice_profissionais, -1],
    [r.lei_abertura, r.indice_desigualdade, 1],
    [r.lei_limite, r.indice, -1],
    [r.lei_limite, r.indice_desigualdade, -1],
    [r.lei_basica, r.indice, 1],
    [r.lei_seguro, r.indice, 1],
    [r.lei_seguro, r.indice_profissionais, -1],
    [r.lei_seguro, r.indice_desigualdade, 1],
    [r.lei_seguro, r.indice_informal, 1],
    [r.lei_gratuidade, r.indice, -1],
    [r.lei_gratuidade, r.indice_vida, 1],
    [r.lei_gratuidade, r.indice_desigualdade, -1],
    [r.lei_cobranca, r.indice, 1],
    [r.lei_cobranca, r.indice_vida, -1],
    [r.lei_cobranca, r.indice_desigualdade, 1],
    [r.lei_deducao, r.indice, 1],
    [r.lei_deducao, r.indice_profissionais, -1],
    [r.lei_deducao, r.indice_desigualdade, 1],
    [r.lei_conta, r.indice, 1],
    [r.lei_conta, r.indice_desigualdade, 1],
    [r.lei_conta, r.indice_informal, 1],
    [r.lei_filantropia, r.indice, 1],
    [r.lei_filantropia, r.indice_desigualdade, 1],
    [r.lei_missao, r.indice, -1],
    [r.lei_missao, r.indice_profissionais, -1],
    [r.lei_missao, r.indice_reputacao, 1],
    [r.lei_ambiental, r.indice_vida, 1],
    [r.lei_ambiental, r.indice_industria, -1],
    [r.lei_vacina, r.indice_vacina, 1],
    [r.lei_vacina, r.indice_liberdade, -1],
    [r.lei_recusa, r.indice_vacina, -1],
    [r.lei_recusa, r.indice_liberdade, 1],
    [r.indice, r.indice_vacina, 1],
    ...alcance,
    [r.indice_profissionais, r.indice, 1],
    [r.indice_instrucao, r.indice_profissionais, 1],
  ];
  return setas.map(([o, a, sinal]) => ligacao(o, a, sinal, saude.atrasoMeses));
}

/** As leis da rede de água e esgoto agem pela contagem, sem efeito na lei. */
function ligacoesDaRede(rede: {
  regra: RegraDoSaneamento;
  atrasoMeses: number;
}): VisaoLigacao[] {
  const r = rede.regra;
  const setas: Seta[] = [
    [r.lei_verba, r.indice, 1],
    [r.lei_concessao, r.indice, 1],
    [r.lei_concessao, r.indice_vida, -1],
    [r.lei_teto, r.indice, -1],
    [r.lei_teto, r.indice_vida, 1],
    [r.lei_tratamento, r.indice, -1],
    [r.lei_tratamento, r.indice_ambiente, 1],
  ];
  return setas.map(([o, a, sinal]) => ligacao(o, a, sinal, rede.atrasoMeses));
}

type Moradia = {
  lei: string;
  indices: string[];
  atrasoMeses: number;
  terra: string;
  deficit: string;
  preco: string;
  favela: string;
};

/** A verba de casas age pelo estoque; o êxodo e o bolso movem déficit e favela. */
function ligacoesDaMoradia(m: Moradia): VisaoLigacao[] {
  return [
    ...m.indices.map((indice) => ligacao(m.lei, indice, -1, m.atrasoMeses)),
    // O êxodo: quem sai do campo entra no déficit.
    ligacao(m.terra, m.deficit, 1),
    // O bolso: quem não paga o preço perde a casa.
    ligacao(m.preco, m.favela, 1),
  ];
}

/** A deriva: um índice empurra o outro, turno a turno. */
const ligacoesDeDeriva = (derivas: Deriva[], indices: Set<string>) =>
  derivas
    .filter((d) => indices.has(d.por) && indices.has(d.indice))
    .map((d) => ligacao(d.por, d.indice, d.sentido));

/** Efeitos declarados da lei e a seta ao grupo que ela mais mexe. */
function ligacoesDaLei(lei: Lei, grupos: TipoGrupo[]): VisaoLigacao[] {
  // lei de opções: vale o sentido da opção mais alta que cita o índice
  const efeitos =
    lei.forma === "continua"
      ? lei.efeitos
      : lei.opcoes.flatMap((o) => o.efeitos);
  const dosIndices = [...new Map(efeitos.map((e) => [e.indice, e]))].map(
    ([indice, e]) => ligacao(lei.id, indice, e.sentido, e.atraso_turnos * 2),
  );
  if (lei.forma !== "continua") return dosIndices;
  // seta ao grupo: o que subir a lei do mínimo ao máximo faz com ele
  const dosGrupos = grupos.flatMap((g) => {
    const pontos = pontosLei(g, lei, lei.faixa.max, lei.faixa.min);
    return Math.abs(pontos) >= SETA_GRUPO
      ? [ligacao(lei.id, g.id, pontos > 0 ? 1 : -1)]
      : [];
  });
  return [...dosIndices, ...dosGrupos];
}

/** O que cada grupo cobra de um índice. */
const ligacoesDosGrupos = (indices: Set<string>) =>
  tiposGrupos.grupos.flatMap((g) =>
    g.cobra
      .filter((c) => indices.has(c.indice))
      .map((c) => ligacao(c.indice, g.id, c.sentido === 1 ? 1 : -1)),
  );

function ligacoes(
  leis: Lei[],
  indices: Set<string>,
  grupos: TipoGrupo[],
  derivas: Deriva[],
  moradia?: Moradia,
  rede?: { regra: RegraDoSaneamento; atrasoMeses: number },
  saude?: { regra: RegraDoAtendimento; atrasoMeses: number },
): VisaoLigacao[] {
  return [
    ...(saude ? ligacoesDaSaude(leis, saude) : []),
    ...(rede ? ligacoesDaRede(rede) : []),
    ...(moradia ? ligacoesDaMoradia(moradia) : []),
    ...ligacoesDeDeriva(derivas, indices),
    ...leis.flatMap((lei) => ligacoesDaLei(lei, grupos)),
    ...ligacoesDosGrupos(indices),
  ];
}

/** A medida real da bolha, quando o índice declara as balizas 0 e 100. */
function medidaReal(
  medida: Readonly<{ unidade: string; zero?: number; cem?: number }>,
  pontos: number,
): VisaoBolha["medida"] {
  const { unidade, zero, cem } = medida;
  if (zero === undefined || cem === undefined) return undefined;
  const valor = zero + ((cem - zero) * pontos) / 100;
  return { valor, unidade, convertida: true, zero, cem };
}

/** Índices de jogabilidade e satisfação dos grupos, como bolhas. */
function bolhasDaPartida(estado: Partida["estado"]): VisaoBolha[] {
  const jogabilidade = variaveis.variaveis.filter(
    (v) => v.camada !== "essencial",
  );
  return [
    ...jogabilidade.map((v) => ({
      id: v.id,
      nome: v.nome,
      tipo: v.tipo,
      unidade: v.unidade,
      area: v.area,
      avaliacao: v.avaliacao,
      valor: estado.jogabilidade[v.id] ?? 0,
      minimo: v.dominio.minimo ?? 0,
      maximo: v.dominio.maximo ?? 100,
      medida: medidaReal(v.medida, estado.jogabilidade[v.id] ?? 0),
    })),
    ...tiposGrupos.grupos.map((g) => ({
      id: g.id,
      nome: g.nome,
      tipo: "grupo",
      unidade: "indice_0_100",
      area: "Grupos",
      avaliacao: "maior_melhor",
      valor: estado.grupos[g.id]?.satisfacao ?? 50,
      minimo: 0,
      maximo: 100,
    })),
  ];
}

/** Setas entre leis, índices e grupos, com as regras de moradia, rede e saúde. */
function ligacoesDaPartida(partida: Partida): VisaoLigacao[] {
  const { regras } = partida;
  const indices = variaveis.variaveis
    .filter((v) => v.camada !== "essencial")
    .map((v) => v.id);
  return ligacoes(
    Object.values(regras.leis),
    new Set(indices),
    regras.grupos,
    regras.derivas ?? [],
    regras.moradia && {
      lei: regras.moradia.lei_verba,
      indices: [regras.moradia.indice_deficit, regras.moradia.indice_favela],
      atrasoMeses: mesesDaObra(partida),
      terra: regras.moradia.indice_terra,
      deficit: regras.moradia.indice_deficit,
      preco: regras.moradia.indice_preco,
      favela: regras.moradia.indice_favela,
    },
    regras.saneamento && {
      regra: regras.saneamento,
      atrasoMeses: mesesDaRede(partida),
    },
    regras.atendimento && {
      regra: regras.atendimento,
      atrasoMeses: mesesDaSaude(partida),
    },
  );
}

export function montarVisao(partida: Partida): VisaoPartida {
  const { regras, estado } = partida;
  const areaDa = areaDaLei();
  for (const lei of Object.values(regras.leis))
    if (!areaDa.has(lei.id))
      throw new Error(`mundo/areas/areas.json › lei "${lei.id}" sem área`);

  return {
    pais: partida.pais,
    cenario: partida.pais,
    turno: estado.turno,
    leis: areas.areas.flatMap((a) =>
      a.leis.map((id) =>
        comFluxo(
          visaoDaLei(
            regras.leis[id],
            estado.leis[id],
            areaDa.get(id)!,
            alertaDaLei(regras.leis[id], regras, estado),
          ),
          regras.leis[id],
          regras,
          estado,
        ),
      ),
    ),
    bolhas: bolhasDaPartida(estado),
    ligacoes: ligacoesDaPartida(partida),
    grupos: [],
    potencias: (regras.potencias ?? []).map((p) => ({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao,
      opiniao: estado.opinioes[p.id] ?? 50,
      peso: p.peso,
    })),
    mercado: regras.mercado && visaoDoMercado(regras, estado),
    governo: governo(),
  };
}

type RegrasDoMercado = NonNullable<Partida["regras"]["mercado"]>;
type ContaDoPais = ReturnType<typeof contaDoPais>;

/** Preço de cada produto no mundo e quem vende mais barato. */
function precosDoMundo(
  regras: RegrasDoMercado,
  estado: Partida["estado"],
  nome: (id: string) => string,
) {
  const { mercado, producao } = regras;
  const setores = mercado.setores.map((s) => ({
    id: s.id,
    nome: s.nome,
    produtos: mercado.produtos
      .filter((p) => p.setor === s.id)
      .map((p) => {
        const barata = maisBarata(producao, p.id);
        return {
          id: p.id,
          nome: p.nome,
          preco: estado.precos[p.id]?.valor ?? 100,
          variacao: estado.precos[p.id]?.variacao ?? 0,
          maisBarato: barata && nome(barata),
        };
      }),
  }));
  const todos = setores.flatMap((s) => s.produtos);
  const TOPO = 3;
  return {
    setores,
    emAlta: todos
      .filter((p) => p.variacao > 0.05)
      .sort((a, b) => b.variacao - a.variacao)
      .slice(0, TOPO),
    maisEmConta: [...todos].sort((a, b) => a.preco - b.preco).slice(0, TOPO),
  };
}

/** Cobertura, importação e conta de cada produto, com os fornecedores. */
function setoresDoMercado(
  balanco: ReturnType<typeof balancoDoPais>,
  conta: ContaDoPais,
  nome: (id: string) => string,
) {
  return balanco.setores.map((s) => ({
    ...s,
    produtos: s.produtos.map((p) => {
      const c = conta.produtos[p.id];
      return {
        ...p,
        ...(c && {
          cobertura: c.cobertura,
          importa: c.demanda > 0 ? (100 * c.importa) / c.demanda : 0,
          exporta: Math.max(0, c.cobertura - 100),
          conta: {
            demanda: c.demanda,
            producao: c.producao,
            importa: c.importa,
            preco: c.preco,
            unidades: c.unidades,
          },
        }),
        fornecedores: p.fornecedores.map((f) => ({
          id: f.potencia,
          nome: nome(f.potencia),
          parte: f.parte,
        })),
      };
    }),
  }));
}

function capacidadesDoMercado(
  regras: Partida["regras"],
  estado: Partida["estado"],
) {
  return situacoesDeCapacidade(regras, estado).map(
    ({ capacidade: c, situacao: s }) => ({
      ...s,
      fontes: s.fontes.map((f) => {
        const lei = c.fontes.find((x) => x.id === f.id)!.lei;
        return {
          ...f,
          lei,
          investimento: Number(estado.leis[lei] ?? 0) * 100,
        };
      }),
    }),
  );
}

function visaoDoMercado(
  regras: Partida["regras"],
  estado: Partida["estado"],
): VisaoMercado | undefined {
  const m = regras.mercado;
  if (!m) return undefined;
  const nomes = new Map((regras.potencias ?? []).map((p) => [p.id, p.nome]));
  const nome = (id: string) => nomes.get(id) ?? id;
  const balanco = balancoDoPais(m);
  const emprego = empregoDoPais(
    m.mercado,
    m.ocupacao,
    estado.pops,
    estado.setores,
  );
  const conta = contaDoPais(
    m.mercado,
    m.producao,
    m.cobertura,
    m.populacaoBase,
    estado.essenciais.populacao,
    estado.precos,
  );
  return {
    mundo: precosDoMundo(m, estado, nome),
    setores: setoresDoMercado(balanco, conta, nome),
    cestas: segurancaDaCesta(m.mercado, conta, estado.pops).map((c) => ({
      ...c,
      termo: m.mercado.cestas.find((x) => x.id === c.id)?.termo ?? "carência",
      pops: c.pops.map((p) => ({
        ...p,
        nome: tiposPops.pops.find((t) => t.id === p.id)?.nome ?? p.id,
      })),
    })),
    capacidades: capacidadesDoMercado(regras, estado),
    emprego: emprego.setores,
    construcoes: construcoesDoPais(regras, estado),
    semEmprego: emprego.semEmprego,
    dependencia: Object.entries(balanco.dependencia)
      .map(([id, valor]) => ({ id, nome: nome(id), valor }))
      .sort((a, b) => b.valor - a.valor),
  };
}

function construcoesDoPais(
  regras: Partida["regras"],
  estado: Partida["estado"],
): VisaoConstrucao[] {
  const c = estado.construcoes;
  if (!c || !regras.mercado) return [];
  const lucro = lucroDosSetores(
    c,
    precoDosSetores(regras.mercado.mercado, estado.precos),
    impostoSobreLucro(regras, estado.leis),
    impostoSobreLucro(regras, estado.marco.leis),
  );
  const obras = obrasPorSetor(c);
  return Object.entries(c.prontas).map(([id, pronta]) => {
    const seguidos = c.lucro?.seguidos[id] ?? 0;
    return {
      id,
      pronta,
      emObra: obras[id]?.volume ?? 0,
      lucro: lucro[id]?.relativa,
      prejuizo: seguidos,
      fechando: seguidos >= TURNOS_ATE_FECHAR,
    };
  });
}
