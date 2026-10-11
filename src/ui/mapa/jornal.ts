/**
 * A página de jornal (pedido do autor, 11/out): o que aconteceu no turno, os
 * principais índices do país e o que dizem as pessoas, o mercado e a
 * imprensa estrangeira. Funções puras sobre a `VisaoPartida`: tudo é lido
 * da rede, nada é inventado fora dela; só o texto é da tela.
 */
import type {
  RelatorioTurno,
  VisaoBolha,
  VisaoEfeitoOcorrencia,
  VisaoGrupo,
  VisaoPartida,
} from "../../app/partida";
import { diferenca, valorDaBolha } from "./formatos";
import { efeitoDe, type Efeito } from "./relacoes";

/** Índices da primeira página, na ordem do quadro. */
export const INDICES_DO_JORNAL: readonly string[] = [
  "pib",
  "inflacao",
  "desemprego",
  "taxa_juros",
  "divida_publica",
  "popularidade_governo",
  "pobreza",
  "violencia_letal",
  "risco_pais",
  "reputacao_internacional",
];

export type IndiceDoJornal = Readonly<{
  id: string;
  nome: string;
  valor: string;
  /** "+0,4 p.p."; vazio quando não há edição anterior ou não mudou. */
  variacao: string;
  efeito: Efeito;
  sobe: boolean;
  /** Posição na escala do índice, de 0 a 1 (a barra). */
  t: number;
  /** 0 = ruim para o país, 1 = bom; `null` se neutro (cor da barra). */
  bondade: number | null;
  /** Valores dos turnos passados até agora, na escala 0–1 (a linha). */
  serie: readonly number[];
}>;

/** Um grupo social no gráfico de barras do humor da rua. */
export type HumorDoGrupo = Readonly<{
  id: string;
  nome: string;
  satisfacao: number;
  /** Mudança no turno, em pontos. */
  delta: number;
}>;

/** Valores das bolhas num turno, para as linhas de evolução do jornal. */
export type FotoDoTurno = ReadonlyMap<string, number>;

export function fotoDoTurno(visao: VisaoPartida): FotoDoTurno {
  return new Map(visao.bolhas.map((b) => [b.id, b.valor]));
}

export type NoticiaDoJornal = Readonly<{
  id: string;
  tipo: "evento" | "dilema" | "situacao";
  manchete: string;
  /** Texto da matéria (descrição da ocorrência), quando há. */
  texto: string;
  nivel: number;
  boa: boolean;
  /** Consequências: o que a ocorrência mexe enquanto dura. */
  efeitos: readonly Readonly<{
    nome: string;
    sobe: boolean;
    efeito: Efeito;
  }>[];
  meses?: number;
}>;

export type OpiniaoDoJornal = Readonly<{
  secao: "povo" | "mercado" | "internacional";
  autor: string;
  texto: string;
  tom: Efeito;
}>;

export type EdicaoDoJornal = Readonly<{
  manchete: string;
  /** A notícia da manchete (clicável), se a manchete é uma ocorrência. */
  principal?: NoticiaDoJornal;
  /** As outras notícias, da maior para a menor. */
  noticias: readonly NoticiaDoJornal[];
  indices: readonly IndiceDoJornal[];
  opinioes: readonly OpiniaoDoJornal[];
  /** Todos os grupos, do mais ao menos satisfeito. */
  humor: readonly HumorDoGrupo[];
}>;

const fmt = (v: number, casas = 1) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: casas });

function efeitos(lista: readonly VisaoEfeitoOcorrencia[]) {
  return lista.map((e) => ({
    nome: e.nome,
    sobe: e.pontos > 0,
    efeito: efeitoDe(Math.sign(e.pontos), e.avaliacao),
  }));
}

/** Notícias: eventos do turno, situações que surgiram e o dilema na mesa. */
function noticias(
  visao: VisaoPartida,
  relatorio: RelatorioTurno | null,
): NoticiaDoJornal[] {
  const emCurso = new Map(visao.ocorrencias.emCurso.map((o) => [o.id, o]));
  const mesa = new Map(visao.ocorrencias.mesa.map((d) => [d.id, d]));
  const saida: NoticiaDoJornal[] = [];
  // sem relatório (início da partida): o que está em curso agora
  const registros = relatorio
    ? [
        ...relatorio.ocorrencias.eventos,
        ...relatorio.ocorrencias.surgiram,
        ...relatorio.ocorrencias.dilemas,
      ]
    : visao.ocorrencias.emCurso.map((o) => ({ ...o, turno: visao.turno }));
  for (const r of registros) {
    const ativa = emCurso.get(r.id);
    const dilema = mesa.get(r.id);
    saida.push({
      id: `${r.tipo}-${r.id}`,
      tipo: r.tipo,
      manchete: r.manchete,
      texto: ativa?.descricao ?? dilema?.descricao ?? "",
      nivel: r.nivel,
      boa: r.avaliacao === "positiva",
      efeitos: ativa ? efeitos(ativa.efeitos) : [],
      ...(ativa ? { meses: ativa.mesesRestantes } : {}),
    });
  }
  for (const s of relatorio?.ocorrencias.acabaram ?? [])
    saida.push({
      id: `fim-${s.id}`,
      tipo: "situacao",
      manchete: `Fim de ${s.nome.toLowerCase()}: o país sai da crise`,
      texto: "",
      nivel: 1,
      boa: true,
      efeitos: [],
    });
  return saida.sort((a, b) => b.nivel - a.nivel);
}

function indices(
  visao: VisaoPartida,
  anterior: VisaoPartida | null,
  historico: readonly FotoDoTurno[],
): IndiceDoJornal[] {
  const agora = new Map(visao.bolhas.map((b) => [b.id, b]));
  const antes = new Map((anterior?.bolhas ?? []).map((b) => [b.id, b]));
  return INDICES_DO_JORNAL.flatMap((id) => {
    const b = agora.get(id);
    if (!b) return [];
    const d = b.valor - (antes.get(id)?.valor ?? b.valor);
    const mudou = Math.abs(d) >= 0.01;
    const amplitude = b.maximo - b.minimo || 1;
    const escala = (v: number) =>
      Math.min(1, Math.max(0, (v - b.minimo) / amplitude));
    const t = escala(b.valor);
    const serie = [
      ...historico.flatMap((foto) => {
        const v = foto.get(id);
        return v === undefined ? [] : [escala(v)];
      }),
      t,
    ];
    return [
      {
        id,
        nome: b.nome,
        valor: valorDaBolha(b.valor, b.unidade),
        variacao: mudou ? diferenca(d, b.unidade) : "",
        efeito: mudou ? efeitoDe(Math.sign(d), b.avaliacao) : "neutro",
        sobe: d > 0,
        t,
        bondade:
          b.avaliacao === "maior_melhor"
            ? t
            : b.avaliacao === "maior_pior"
              ? 1 - t
              : null,
        serie,
      },
    ];
  });
}

/** Quem fala por cada grupo social (personagens de rua, não pessoas reais). */
const VOZ_DO_GRUPO: Readonly<Record<string, string>> = {
  pobres: "Dona Cida, 58, diarista em Recife",
  trabalhadores: "Marcos, 41, metalúrgico no ABC",
  classe_media: "Patrícia, 45, professora em Curitiba",
  jovens: "Lucas, 22, entregador de aplicativo em São Paulo",
  aposentados: "Seu Antônio, 71, aposentado em Belo Horizonte",
  servidores: "Renata, 39, enfermeira do SUS em Brasília",
  pequenos_negocios: "Jorge, 50, dono de padaria em Porto Alegre",
  agro: "Valdir, 63, produtor de soja em Sorriso (MT)",
  empresarios: "Helena, 55, presidente de uma rede de varejo",
  progressistas: "Bianca, 29, ativista no Rio de Janeiro",
  conservadores: "Pastor Elias, 52, de Goiânia",
};

const chaveDoGrupo = (id: string) => id.replace(/^grupo[_-]/, "");

function falaDoGrupo(g: VisaoGrupo, delta: number): OpiniaoDoJornal {
  const autor = VOZ_DO_GRUPO[chaveDoGrupo(g.id)] ?? g.nome;
  const gosta = g.gosta[0]?.nome.toLowerCase();
  const odeia = g.odeia[0]?.nome.toLowerCase();
  const s = g.satisfacao;
  let texto: string;
  if (delta <= -1.5 && odeia)
    texto = `Piorou de uns meses para cá. O que pesa mesmo é ${odeia}.`;
  else if (delta >= 1.5 && gosta)
    texto = `Melhorou, dá para sentir. ${cap(gosta)} fez diferença.`;
  else if (s >= 65)
    texto = gosta
      ? `Está bom assim. Que continuem com ${gosta}.`
      : "Está bom assim, não mexam no que funciona.";
  else if (s >= 40)
    texto = odeia
      ? `Dá para viver, mas ${odeia} incomoda.`
      : "Dá para viver, mas esperava mais.";
  else
    texto = odeia
      ? `Estamos abandonados. ${cap(odeia)} está acabando com a gente.`
      : "Estamos abandonados. Ninguém olha para nós.";
  return {
    secao: "povo",
    autor: `${autor} (${g.nome.toLowerCase()}, satisfação ${Math.round(s)})`,
    texto: `“${texto}”`,
    tom:
      s >= 60 || delta >= 1.5
        ? "melhora"
        : s < 40 || delta <= -1.5
          ? "piora"
          : "neutro",
  };
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Três vozes da rua: quem mais mudou no turno, ou os extremos. */
function povo(
  visao: VisaoPartida,
  anterior: VisaoPartida | null,
): OpiniaoDoJornal[] {
  const antes = new Map((anterior?.grupos ?? []).map((g) => [g.id, g]));
  const delta = (g: VisaoGrupo) =>
    g.satisfacao - (antes.get(g.id)?.satisfacao ?? g.satisfacao);
  const grupos = [...visao.grupos];
  if (!grupos.length) return [];
  const escolhidos = new Set<VisaoGrupo>();
  const porMudanca = [...grupos].sort(
    (a, b) => Math.abs(delta(b)) - Math.abs(delta(a)),
  );
  if (Math.abs(delta(porMudanca[0])) >= 1.5) escolhidos.add(porMudanca[0]);
  escolhidos.add(grupos[grupos.length - 1]); // o menos satisfeito
  escolhidos.add(grupos[0]); // o mais satisfeito
  return [...escolhidos].slice(0, 3).map((g) => falaDoGrupo(g, delta(g)));
}

function valor(visao: VisaoPartida, id: string): VisaoBolha | undefined {
  return visao.bolhas.find((b) => b.id === id);
}

function variou(
  visao: VisaoPartida,
  anterior: VisaoPartida | null,
  id: string,
) {
  const a = anterior && valor(anterior, id);
  const b = valor(visao, id);
  return a && b ? b.valor - a.valor : 0;
}

/** O que dizem os bancos: dívida, juros, inflação e risco. */
function mercado(
  visao: VisaoPartida,
  anterior: VisaoPartida | null,
): OpiniaoDoJornal[] {
  const risco = valor(visao, "risco_pais")?.valor ?? 50;
  const divida = valor(visao, "divida_publica")?.valor;
  const inflacao = valor(visao, "inflacao")?.valor;
  const juros = valor(visao, "taxa_juros")?.valor;
  const dRisco = variou(visao, anterior, "risco_pais");
  const dDivida = variou(visao, anterior, "divida_publica");
  const resultado = visao.contas.resultado;
  const saida: OpiniaoDoJornal[] = [];
  let texto: string;
  let tom: Efeito;
  if (dRisco >= 1 || (dDivida >= 0.5 && resultado < 0)) {
    texto = `O mercado azedou: a dívida chegou a ${fmt(divida ?? 0)}% do PIB e ninguém viu um plano para fechar o déficit. Os juros longos já sobem.`;
    tom = "piora";
  } else if (dRisco <= -1 || resultado > 0) {
    texto = `O humor melhorou. ${resultado > 0 ? "As contas fecharam no azul" : "O risco caiu"} e os investidores voltam a olhar o país com menos desconfiança.`;
    tom = "melhora";
  } else if (risco >= 60) {
    texto = `Ainda é caro emprestar ao governo: o risco do país segue alto e a dívida está em ${fmt(divida ?? 0)}% do PIB.`;
    tom = "piora";
  } else {
    texto = `Sem sustos por ora. Dívida em ${fmt(divida ?? 0)}% do PIB; o mercado espera os próximos passos da equipe econômica.`;
    tom = "neutro";
  }
  saida.push({
    secao: "mercado",
    autor: "Economista-chefe de um grande banco",
    texto,
    tom,
  });
  if (inflacao !== undefined && juros !== undefined)
    saida.push({
      secao: "mercado",
      autor: "Gestora de fundos em São Paulo",
      texto:
        inflacao >= 6
          ? `Com a inflação em ${fmt(inflacao)}%, o Banco Central não tem como aliviar: juros em ${fmt(juros)}% por um bom tempo.`
          : inflacao <= 3.5
            ? `Inflação em ${fmt(inflacao)}% abre espaço para cortar os juros, hoje em ${fmt(juros)}%.`
            : `Inflação em ${fmt(inflacao)}% e juros em ${fmt(juros)}%: nada de muito novo no curto prazo.`,
      tom: inflacao >= 6 ? "piora" : inflacao <= 3.5 ? "melhora" : "neutro",
    });
  return saida;
}

/** O que diz a imprensa estrangeira: reputação, tensão e câmbio. */
function internacional(
  visao: VisaoPartida,
  anterior: VisaoPartida | null,
): OpiniaoDoJornal[] {
  const reputacao = valor(visao, "reputacao_internacional")?.valor ?? 50;
  const tensao = valor(visao, "tensao_internacional")?.valor ?? 0;
  const dReputacao = variou(visao, anterior, "reputacao_internacional");
  const pais = `o ${visao.pais || "país"}`;
  let texto: string;
  let tom: Efeito;
  if (dReputacao <= -1) {
    texto = `A imagem d${pais} lá fora piorou neste trimestre; diplomatas falam em perda de credibilidade.`;
    tom = "piora";
  } else if (dReputacao >= 1) {
    texto = `${cap(pais)} volta a ser elogiado nas capitais estrangeiras; a reputação do país melhora.`;
    tom = "melhora";
  } else if (tensao >= 60) {
    texto = `Tensão alta com outros países: investidores estrangeiros pedem cautela com ${pais}.`;
    tom = "piora";
  } else if (reputacao >= 60) {
    texto = `${cap(pais)} é visto como parceiro confiável; a reputação internacional segue boa.`;
    tom = "melhora";
  } else {
    texto = `Lá fora, ${pais} desperta curiosidade, mas não entusiasmo: reputação em ${Math.round(reputacao)} de 100.`;
    tom = "neutro";
  }
  return [
    {
      secao: "internacional",
      autor: "Correspondente de um jornal europeu",
      texto,
      tom,
    },
  ];
}

export function montarJornal(
  visao: VisaoPartida,
  anterior: VisaoPartida | null,
  relatorio: RelatorioTurno | null,
  /** Fotos dos turnos passados (a mais antiga primeiro), sem o atual. */
  historico: readonly FotoDoTurno[] = [],
): EdicaoDoJornal {
  const lista = noticias(visao, relatorio);
  const quadro = indices(visao, anterior, historico);
  const antes = new Map((anterior?.grupos ?? []).map((g) => [g.id, g]));
  // manchete: a maior notícia; sem notícia, o índice que mais mexeu
  const maior = [...quadro]
    .filter((i) => i.variacao)
    .sort(
      (a, b) => Number(b.efeito !== "neutro") - Number(a.efeito !== "neutro"),
    )[0];
  const manchete =
    lista[0]?.manchete ??
    (maior
      ? `${maior.nome} ${maior.sobe ? "sobe" : "cai"} e vai a ${maior.valor}`
      : "Trimestre calmo em Brasília");
  return {
    manchete,
    ...(lista[0] ? { principal: lista[0] } : {}),
    noticias: lista.slice(1),
    indices: quadro,
    opinioes: [
      ...povo(visao, anterior),
      ...mercado(visao, anterior),
      ...internacional(visao, anterior),
    ],
    humor: visao.grupos.map((g) => ({
      id: g.id,
      nome: g.nome,
      satisfacao: g.satisfacao,
      delta: g.satisfacao - (antes.get(g.id)?.satisfacao ?? g.satisfacao),
    })),
  };
}
