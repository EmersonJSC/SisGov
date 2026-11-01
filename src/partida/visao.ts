// Monta a VisaoPartida (formato da tela antiga do mapa) a partir da partida
// nova. Só lê: nomes e textos vêm do JSON das leis e do mundo.
import type { Lei } from "../motor";
import areas from "../conteudo/mundo/areas/areas.json";
import variaveis from "../conteudo/mundo/indicadores/variaveis.json";
import tiposGrupos from "../conteudo/mundo/grupos/grupos.json";
import type { Partida } from ".";
import type {
  VisaoArea,
  VisaoBolha,
  VisaoLei,
  VisaoLigacao,
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

function visaoDaLei(
  lei: Lei,
  valor: number | string,
  area: (typeof areas.areas)[number],
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
    const nivel = Number(valor ?? lei.faixa.min) * 100;
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
      minimo: lei.faixa.min * 100,
      maximo: lei.faixa.max * 100,
      passo: lei.passo * 100,
      unidade: "percentual_0_100",
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

function ligacoes(leis: Lei[], indices: Set<string>): VisaoLigacao[] {
  const saida: VisaoLigacao[] = [];
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
    if (lei.forma === "continua")
      for (const [grupo, quer] of Object.entries(lei.grupos ?? {}))
        saida.push({
          id: `${lei.id}>${grupo}`,
          origem: lei.id,
          alvo: grupo,
          sinal: quer === "mais" ? 1 : -1,
          atrasoMeses: 0,
          mecanismo: "afim",
        });
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
        visaoDaLei(regras.leis[id], estado.leis[id], areaDa.get(id)!),
      ),
    ),
    bolhas,
    ligacoes: ligacoes(leis, new Set(jogabilidade.map((v) => v.id))),
    grupos: [],
    governo: governo(),
  };
}
