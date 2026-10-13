/**
 * O tablet do turno (pedido do autor, 11/out; virou tablet em 13/out): o que
 * aconteceu no turno, os principais índices do país e os posts das pessoas,
 * dos grupos de pressão, do mercado e da imprensa estrangeira. Funções puras sobre a `VisaoPartida`: tudo é lido
 * da rede, nada é inventado fora dela; só o texto é da tela.
 */
import type {
  RelatorioTurno,
  VisaoBolha,
  VisaoEfeitoOcorrencia,
  VisaoGrupo,
  VisaoPartida,
} from "../../app/partida";
import { diferenca, valorDaBolha, valorReal } from "./formatos";
import { efeitoDe, type Efeito } from "./relacoes";

/** Índices da primeira página: os pilares das áreas, na ordem do quadro. */
export function pilaresDoJornal(visao: VisaoPartida): readonly string[] {
  return visao.bolhas
    .filter((b) => b.pilar !== undefined)
    .sort((a, b) => a.pilar! - b.pilar!)
    .map((b) => b.id);
}

export type IndiceDoJornal = Readonly<{
  id: string;
  nome: string;
  valor: string;
  /** Unidade real quando o valor está convertido (V1-07): "homicídios por 100 mil hab.". */
  unidadeReal?: string;
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

/** Um post na rede: quem fala, de onde e o quê. */
export type OpiniaoDoJornal = Readonly<{
  secao: "povo" | "pressao" | "mercado" | "internacional";
  /** Nome de quem posta. */
  autor: string;
  /** "@cida.diarista". */
  arroba: string;
  /** Quem é: "58, diarista em Recife · Pobres, satisfação 53". */
  quem: string;
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
  /** Posts: a rua, os grupos de pressão, o mercado e quem está fora. */
  opinioes: readonly OpiniaoDoJornal[];
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
  // V1-09: ação de grupo em preocupação nacional é manchete
  const nacional = new Set(visao.pressao?.alertas ?? []);
  for (const r of registros) {
    const ativa = emCurso.get(r.id);
    const dilema = mesa.get(r.id);
    const grupo = "grupo" in r ? r.grupo : undefined;
    saida.push({
      id: `${r.tipo}-${r.id}`,
      tipo: r.tipo,
      manchete: r.manchete,
      texto: ativa?.descricao ?? dilema?.descricao ?? r.descricao ?? "",
      nivel: grupo && nacional.has(grupo) ? Math.max(r.nivel, 3) : r.nivel,
      boa: r.avaliacao === "positiva",
      efeitos: ativa ? efeitos(ativa.efeitos) : [],
      ...(ativa ? { meses: ativa.mesesRestantes } : {}),
    });
  }
  // grupos que mudaram de nível e investigações que acabaram (V1-09)
  for (const n of relatorio?.pressao.niveis ?? [])
    saida.push({
      id: `nivel-${n.grupo}`,
      tipo: "situacao",
      manchete: n.manchete,
      texto: "",
      nivel: n.para > n.de ? Math.max(1, n.para) : 1,
      boa: n.para < n.de,
      efeitos: [],
    });
  for (const i of relatorio?.pressao.investigacoes ?? [])
    saida.push({
      id: `investigacao-${i.grupo}`,
      tipo: "situacao",
      manchete: i.manchete,
      texto: i.achados.length
        ? "O dinheiro é cortado, e o grupo perde parte da força."
        : "",
      nivel: i.achados.length ? 3 : 1,
      boa: i.achados.length > 0,
      efeitos: [],
    });
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
  return pilaresDoJornal(visao).flatMap((id) => {
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
        ...(b.medida?.convertida
          ? { valor: valorReal(b.medida.valor), unidadeReal: b.medida.unidade }
          : { valor: valorDaBolha(b.valor, b.unidade) }),
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

/** Quem posta por cada segmento (personagens de rua, não pessoas reais). */
const VOZ_DO_GRUPO: Readonly<
  Record<string, Readonly<{ nome: string; arroba: string; quem: string }>>
> = {
  pobres: {
    nome: "Dona Cida",
    arroba: "cida.diarista",
    quem: "58, diarista em Recife",
  },
  trabalhadores: {
    nome: "Marcos",
    arroba: "marcos_metalurgico",
    quem: "41, metalúrgico no ABC",
  },
  informais: {
    nome: "Wesley",
    arroba: "wesley_entregas",
    quem: "24, entregador de aplicativo em São Paulo",
  },
  classe_media: {
    nome: "Patrícia",
    arroba: "prof.patricia",
    quem: "45, professora em Curitiba",
  },
  ricos: {
    nome: "Fernando",
    arroba: "fernando.invest",
    quem: "60, investidor em São Paulo",
  },
  jovens: {
    nome: "Lucas",
    arroba: "lucas22",
    quem: "22, estudante em Campinas",
  },
  familias_com_filhos: {
    nome: "Juliana",
    arroba: "ju.mae2",
    quem: "34, mãe de dois em Fortaleza",
  },
  aposentados: {
    nome: "Seu Antônio",
    arroba: "seuantonio71",
    quem: "71, aposentado em Belo Horizonte",
  },
  servidores: {
    nome: "Renata",
    arroba: "renata.enf",
    quem: "39, enfermeira da rede pública em Brasília",
  },
  pequenos_negocios: {
    nome: "Jorge",
    arroba: "padariadojorge",
    quem: "50, dono de padaria em Porto Alegre",
  },
  agro: {
    nome: "Valdir",
    arroba: "valdir.soja",
    quem: "63, produtor de soja em Sorriso (MT)",
  },
  agricultura_familiar: {
    nome: "Seu Zé",
    arroba: "ze.do.sitio",
    quem: "55, agricultor no sertão da Paraíba",
  },
  empresarios: {
    nome: "Helena",
    arroba: "helena_varejo",
    quem: "55, presidente de uma rede de varejo",
  },
  progressistas: {
    nome: "Bianca",
    arroba: "bia.ativista",
    quem: "29, ativista no Rio de Janeiro",
  },
  conservadores: {
    nome: "Rogério",
    arroba: "rogerio.goiania",
    quem: "57, corretor de imóveis em Goiânia",
  },
  evangelicos: {
    nome: "Pastor Elias",
    arroba: "pr.elias",
    quem: "52, pastor em Manaus",
  },
  catolicos: {
    nome: "Dona Lourdes",
    arroba: "lourdes.paroquia",
    quem: "66, catequista em Salvador",
  },
  periferias: {
    nome: "Thaís",
    arroba: "thais.zl",
    quem: "31, moradora da zona leste de São Paulo",
  },
  interior: {
    nome: "Cláudio",
    arroba: "claudio.mc",
    quem: "48, comerciante em Montes Claros (MG)",
  },
  ambientalistas: {
    nome: "Iara",
    arroba: "iara.floresta",
    quem: "36, bióloga em Belém",
  },
};

const chaveDoGrupo = (id: string) => id.replace(/^grupo[_-]/, "");

function falaDoGrupo(g: VisaoGrupo, delta: number): OpiniaoDoJornal {
  const voz = VOZ_DO_GRUPO[chaveDoGrupo(g.id)] ?? {
    nome: g.nome,
    arroba: chaveDoGrupo(g.id),
    quem: "",
  };
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
    autor: voz.nome,
    arroba: `@${voz.arroba}`,
    quem: [voz.quem, `${g.nome}, satisfação ${Math.round(s)}`]
      .filter(Boolean)
      .join(" · "),
    texto,
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
    autor: "Economista-chefe",
    arroba: "@economista.chefe",
    quem: "de um grande banco",
    texto,
    tom,
  });
  if (inflacao !== undefined && juros !== undefined)
    saida.push({
      secao: "mercado",
      autor: "Carla Mendes",
      arroba: "@carla.fundos",
      quem: "gestora de fundos em São Paulo",
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
      autor: "Correspondente estrangeiro",
      arroba: "@correspondente",
      quem: "de um jornal europeu",
      texto,
      tom,
    },
  ];
}

/**
 * Os grupos de pressão mais altos (mobilizados ou mais) postam (V1-09). O
 * crime não posta: aparece pelas ações, nas notícias.
 */
function pressao(visao: VisaoPartida): OpiniaoDoJornal[] {
  return [...(visao.pressao?.grupos ?? [])]
    .filter((g) => g.nivel >= 2 && g.secao !== "crime")
    .sort((a, b) => b.nivel - a.nivel || b.pressao - a.pressao)
    .slice(0, 2)
    .map((g) => ({
      secao: "pressao",
      autor: g.nome,
      arroba: `@${g.id.replace(/_/g, "")}`,
      quem: g.nomeDoNivel.toLowerCase(),
      texto: [
        g.nivel >= 3
          ? "Passou do limite. Não vamos parar."
          : "Estamos mobilizados.",
        g.motivo ? `O motivo: ${g.motivo}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
      tom: "piora" as const,
    }));
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
      ...pressao(visao),
      ...mercado(visao, anterior),
      ...internacional(visao, anterior),
    ],
  };
}
