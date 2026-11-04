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
  type Estado,
  type Lei,
  type Regras,
  type TipoGrupo,
} from "../motor";
import tiposPops from "../conteudo/mundo/pops/pops.json";
import areas from "../conteudo/mundo/areas/areas.json";
import variaveis from "../conteudo/mundo/indicadores/variaveis.json";
import tiposGrupos from "../conteudo/mundo/grupos/grupos.json";
import type { Partida } from ".";
import { mesesDaObra } from "./previa";
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

function visaoDaLei(
  lei: Lei,
  valor: number | string,
  area: (typeof areas.areas)[number],
  alerta: VisaoLei["alerta"],
): VisaoLei {
  const t = textos.get(lei.id) ?? {};
  const comum = {
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
  // sem valor no país: o motor conta a contínua no mínimo da faixa
  if (lei.forma === "continua") {
    const escala = lei.unidade === "fracao" ? 100 : 1;
    const nivel = Number(valor ?? lei.faixa.min) * escala;
    return {
      ...comum,
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
    };
  }
  // opção vale a posição dela na lista; a mandato é da Constituição
  const constitucional = lei.opcoes.some((o) => o.mandato_anos !== undefined);
  const nivel = lei.opcoes.findIndex((o) => o.id === valor);
  return {
    ...comum,
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

/** Pontos (faixa inteira) a partir dos quais a lei liga uma seta ao grupo. */
const SETA_GRUPO = 10;

function ligacoes(
  leis: Lei[],
  indices: Set<string>,
  grupos: TipoGrupo[],
  moradia?: { lei: string; indices: string[]; atrasoMeses: number },
): VisaoLigacao[] {
  const saida: VisaoLigacao[] = [];
  // A verba de casas age pelo estoque, sem efeito declarado na lei.
  if (moradia)
    for (const indice of moradia.indices)
      saida.push({
        id: `${moradia.lei}>${indice}`,
        origem: moradia.lei,
        alvo: indice,
        sinal: -1,
        atrasoMeses: moradia.atrasoMeses,
        mecanismo: "afim",
      });
  for (const lei of leis) {
    // lei de opções: vale o sentido da opção mais alta que cita o índice
    const efeitos =
      lei.forma === "continua"
        ? lei.efeitos
        : lei.opcoes.flatMap((o) => o.efeitos);
    const porIndice = new Map(efeitos.map((e) => [e.indice, e]));
    for (const [indice, e] of porIndice)
      saida.push({
        id: `${lei.id}>${indice}`,
        origem: lei.id,
        alvo: indice,
        sinal: e.sentido,
        atrasoMeses: e.atraso_turnos * 2,
        mecanismo: "afim",
      });
    // seta ao grupo: o que subir a lei do mínimo ao máximo faz com ele
    if (lei.forma === "continua")
      for (const g of grupos) {
        const pontos = pontosLei(g, lei, lei.faixa.max, lei.faixa.min);
        if (Math.abs(pontos) >= SETA_GRUPO)
          saida.push({
            id: `${lei.id}>${g.id}`,
            origem: lei.id,
            alvo: g.id,
            sinal: pontos > 0 ? 1 : -1,
            atrasoMeses: 0,
            mecanismo: "afim",
          });
      }
  }
  for (const g of tiposGrupos.grupos)
    for (const c of g.cobra)
      if (indices.has(c.indice))
        saida.push({
          id: `${c.indice}>${g.id}`,
          origem: c.indice,
          alvo: g.id,
          sinal: c.sentido === 1 ? 1 : -1,
          atrasoMeses: 0,
          mecanismo: "afim",
        });
  return saida;
}

export function montarVisao(partida: Partida): VisaoPartida {
  const { regras, estado } = partida;
  const areaDa = areaDaLei();
  const leis = Object.values(regras.leis);
  for (const lei of leis)
    if (!areaDa.has(lei.id))
      throw new Error(`mundo/areas/areas.json › lei "${lei.id}" sem área`);

  const jogabilidade = variaveis.variaveis.filter(
    (v) => v.camada !== "essencial",
  );
  const bolhas: VisaoBolha[] = [
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
    bolhas,
    ligacoes: ligacoes(
      leis,
      new Set(jogabilidade.map((v) => v.id)),
      regras.grupos,
      regras.moradia && {
        lei: regras.moradia.lei_verba,
        indices: [regras.moradia.indice_deficit, regras.moradia.indice_favela],
        atrasoMeses: mesesDaObra(partida),
      },
    ),
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

function visaoDoMercado(
  regras: Partida["regras"],
  estado: Partida["estado"],
): VisaoMercado | undefined {
  if (!regras.mercado) return undefined;
  const nomes = new Map((regras.potencias ?? []).map((p) => [p.id, p.nome]));
  const nome = (id: string) => nomes.get(id) ?? id;
  const balanco = balancoDoPais(regras.mercado);
  const { mercado, producao, ocupacao } = regras.mercado;
  const emprego = empregoDoPais(mercado, ocupacao, estado.pops, estado.setores);
  const conta = contaDoPais(
    mercado,
    producao,
    regras.mercado.cobertura,
    regras.mercado.populacaoBase,
    estado.essenciais.populacao,
    estado.precos,
  );
  const precos = mercado.setores.map((s) => ({
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
  const todos = precos.flatMap((s) => s.produtos);
  const TOPO = 3;
  return {
    mundo: {
      setores: precos,
      emAlta: todos
        .filter((p) => p.variacao > 0.05)
        .sort((a, b) => b.variacao - a.variacao)
        .slice(0, TOPO),
      maisEmConta: [...todos].sort((a, b) => a.preco - b.preco).slice(0, TOPO),
    },
    setores: balanco.setores.map((s) => ({
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
    })),
    cestas: segurancaDaCesta(mercado, conta, estado.pops).map((c) => ({
      ...c,
      termo: mercado.cestas.find((x) => x.id === c.id)?.termo ?? "carência",
      pops: c.pops.map((p) => ({
        ...p,
        nome: tiposPops.pops.find((t) => t.id === p.id)?.nome ?? p.id,
      })),
    })),
    capacidades: situacoesDeCapacidade(regras, estado).map(
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
    ),
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
