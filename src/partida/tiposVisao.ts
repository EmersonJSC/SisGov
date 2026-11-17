// Visão da partida para o mapa (formato herdado da tela antiga, só leitura).
// Tipos copiados do projeto antigo (src/app/partida/tipos.ts); a tela do mapa
// só lê isto. Quem monta é `montarVisao` (visao.ts).

import type { ClasseLei } from "../motor/leis";

export type VisaoOpcao = Readonly<{
  id: string;
  rotulo: string;
  valor: number;
  /**
   * Quanto a lei arrecadaria (+) ou custaria (−) por ano nesta opção, com o
   * país como está agora (moeda do país). 0 se não toca o orçamento.
   */
  saldoAnual: number;
  /** Porquê de cada efeito desta opção, por índice (16/nov). */
  porques?: Readonly<Record<string, string>>;
  /**
   * Trava (V1-34): outra camada da mesa não deixa escolher esta opção agora.
   * `lei` é a lei que trava, para a tela levar até ela.
   */
  trava?: Readonly<{ lei: string; nome: string; motivo: string }>;
}>;

/** Uma camada da mesa (V1-34): Constituição, lei ou alavanca. */
export type VisaoCamada = Readonly<{
  lei: string;
  nome: string;
  camada: "constituicao" | "lei" | "alavanca";
  emVigor: boolean;
  /** Rótulo da opção em vigor. */
  opcao?: string;
}>;

export type VisaoLei = Readonly<{
  id: string;
  nome: string;
  descricao: string;
  grupo: "orcamentaria" | "regulatoria" | "tributaria" | "institucional";
  /** Instituição onde a lei mora (o campo ainda se chama esfera). */
  esfera?: string;
  /** Ministério que cuida da lei; o poder, se a instituição fica com um; vazio sem governo. */
  ministerio: string;
  /** Família declarada pela lei do molde v4; ausente nas leis antigas. */
  familia?:
    "imposto" | "verba" | "programa" | "regra" | "constitucional" | "petrea";
  /** O que a lei decide, numa frase (molde v4). */
  decide?: string;
  /**
   * Como a lei muda: `emenda-constitucional`, `lei-ordinaria`,
   * `execucao-programa-autorizado`… A tela põe as constitucionais também na
   * área da Presidência.
   */
  processo: string;
  /** Nível que já está funcionando (anda até a meta mês a mês). */
  /**
   * Popularidade da opção em vigor (0 a 100, 50 = neutra), pelo "quem apoia /
   * quem rejeita" das fichas: no país (média dos segmentos) e em cada segmento.
   * Ausente quando a lei não tem esses dados.
   */
  popularidade?: Readonly<{
    pais: number;
    segmentos: Readonly<Record<string, number>>;
  }>;
  nivel: number;
  /** Nível escolhido pelo jogador. */
  meta: number;
  minimo?: number;
  maximo?: number;
  /** O país não declarou valor para esta lei. */
  naoLegislada?: boolean;
  /** Passo do controle, na unidade do nível (lei contínua). */
  passo?: number;
  /**
   * Zona de alerta do controle (lei contínua), na mesma unidade do nível:
   * imposto avisa perto do pico da receita e depois dele; verba avisa acima
   * do valor em que o gasto total passa da receita.
   */
  alerta?: Readonly<{ tipo: "imposto" | "verba"; limite: number }>;
  /**
   * Como o valor vira dinheiro no caixa (lei contínua em %): verba é o
   * próprio valor em % do PIB; imposto traz a receita em % do PIB para as
   * alíquotas de 0 a 100% (de 1 em 1 ponto).
   */
  fluxo?: Readonly<
    { tipo: "verba" } | { tipo: "imposto"; curva: readonly number[] }
  >;
  unidade: string;
  /** Nome da unidade quando `unidade` é "livre" ("km/h", "mandatos"). */
  rotuloUnidade?: string;
  opcoes?: readonly VisaoOpcao[];
  /** Opção mais próxima do nível em funcionamento. */
  opcaoAtual?: string;
  /** O jogador mudou a meta desta lei (em relação ao país sozinho). */
  alteradaPorVoce: boolean;
  /**
   * Quanto a lei mexe nas contas por ano, na moeda do país, lido da rede:
   * positivo arrecada (seta para a receita), negativo custa (seta para o
   * gasto). 0 se a lei não toca o orçamento.
   */
  saldoAnual: number;
  /** Perda de compra da verba nominal nos últimos doze meses. */
  poderCompraPerdido?: number;
  /**
   * Nível da lei (D-65): pétrea, constitucional ou derivada. Ausente nas
   * leis do formato antigo (áreas ainda não migradas).
   */
  nivelLegal?: "petrea" | "constitucional" | "derivada";
  /** Porquê de cada efeito da régua, por índice (16/nov). */
  porques?: Readonly<Record<string, string>>;
  /** Tipo da lei (16/nov): quão difícil é mudá-la; o selo da janela. */
  classe?: ClasseLei;
  /**
   * A lei vale hoje (está no mapa). Fora de vigor, ela está no catálogo:
   * pode ser aprovada, se nada a bloqueia.
   */
  emVigor: boolean;
  /** Aparece no mapa mesmo quando a decisão está com outra instituição. */
  sempreVisivel?: boolean;
  /** Pode sair do mapa (revogar) agora. */
  revogavel: boolean;
  /** Como a lei chega à vida das pessoas (o canal dela, em frase de leigo). */
  comoChega: string;
  /** Tipo e jeito em palavra de leigo ("Lei com prazo · Régua"). */
  classificacao: string;
  /**
   * Modo real com Congresso (V1-12): a lei precisa de votação. `tipo` é o
   * caminho (lei ordinária, complementar, emenda); `naFila` diz se já há um
   * projeto dela esperando votação.
   */
  congresso?: Readonly<{ tipo: string; naFila: boolean }>;
  /**
   * Por que a lei não pode entrar em vigor ou mudar agora (exigência não
   * cumprida ou lei pétrea). Ausente se pode.
   */
  bloqueio?: string;
  /**
   * Lei filha (SG138): a primeira lei mãe, as opções dela que liberam esta
   * lei, a opção de base desta (para onde ela cai) e se a exigência está
   * cumprida. Todas as exigências estão em `exigencias`.
   */
  exige?: VisaoExigencia;
  exigencias: readonly VisaoExigencia[];
  /** Leis filhas desta: caem (ou saem de vigor) se esta sair das opções. */
  filhas: readonly VisaoFilha[];
  /** A mesa da lei (V1-34): o assunto e as camadas, de cima para baixo. */
  mesa?: Readonly<{
    id: string;
    nome: string;
    camada: VisaoCamada["camada"];
    camadas: readonly VisaoCamada[];
  }>;
  /** Leis de outras mesas que esta puxa (V1-34). */
  vinculos?: readonly Readonly<{ lei: string; nome: string; motivo: string }>[];
}>;

export type VisaoExigencia = Readonly<{
  lei: string;
  nome: string;
  opcoes: readonly string[];
  /** Opção para onde a filha cai; vazio nas leis de três níveis (sai de vigor). */
  base: string;
  atendida: boolean;
  /** Por que esta lei depende da mãe. */
  motivo?: string;
}>;

export type VisaoFilha = Readonly<{
  id: string;
  nome: string;
  /** Valores desta lei (a mãe) que mantêm a filha. */
  valores: readonly number[];
  /** A filha está fora da base (cairia se a mãe saísse das opções). */
  ativa: boolean;
}>;

/** Como vai um índice: junta o nível (saúde) e a tendência nos últimos turnos (até 8 meses). */
export type AlertaDoIndice = "critico" | "preocupante" | "normal" | "bom";
export type TendenciaDoIndice = "piorando" | "estavel" | "melhorando";

export type VisaoBolha = Readonly<{
  id: string;
  nome: string;
  tipo: string;
  unidade: string;
  /** Quem responde pelo índice: id da instituição, um poder ("judiciario", "legislativo") ou "pais". */
  dono: string;
  avaliacao?: string;
  valor: number;
  /** Escala da bolha (do domínio no conteúdo). */
  minimo: number;
  maximo: number;
  /** Situação: soma a partir da qual ela surge (V1-07). */
  entrada?: number;
  /** Situação: soma em que ela acaba; entre saída e entrada, fica como está. */
  saida?: number;
  /** Situação: existe agora (o motor guarda valor positivo). */
  ativa?: boolean;
  /**
   * Contexto do cenário (D-55): a parte do valor que as leis e a rede não
   * explicam (história, geografia, cultura). Fixo desde o turno 0.
   */
  contexto?: number;
  /**
   * O valor na medida real (V1-07), quando o índice tem `medida` com
   * balizas: a tela mostra isto em vez dos pontos do motor.
   */
  /** Pilar da área: posição na primeira página do jornal (V1-07). */
  pilar?: number;
  /**
   * O país em frases: como está, em uma frase, no lugar do número do motor.
   * Falta quando o jeito da bolha é faixa escrita e a faixa ainda não existe
   * — aí a tela mostra o número, em vez de texto inventado.
   */
  frase?: string;
  medida?: Readonly<{
    valor: number;
    unidade: string;
    /** Tem balizas: o valor real difere dos pontos do motor. */
    convertida: boolean;
    /** Medida real nos pontos 0 e 100 do motor (só quando convertida). */
    zero?: number;
    cem?: number;
  }>;
  /**
   * Valor que a bolha teria sem nenhuma decisão do jogador (o país no
   * piloto automático). Só existe depois que o jogador muda alguma lei.
   */
  semVoce?: number;
  /** Saúde do índice, de 0 (péssimo) a 100 (ótimo), no sentido que o índice declara. */
  saude?: number;
  alerta?: AlertaDoIndice;
  tendencia?: TendenciaDoIndice;
  /** Quanto a saúde mudou na janela da tendência, em pontos (negativo piorou). */
  mudancaDaSaude?: number;
  /** Quantos meses atrás é a comparação da tendência (até 8). */
  mesesDaTendencia?: number;
}>;

export type VisaoLigacao = Readonly<{
  id: string;
  origem: string;
  alvo: string;
  sinal: 1 | -1;
  /** Atraso declarado no conteúdo, convertido para meses. */
  atrasoMeses: number;
  /**
   * `afim` (proporcional), `limiar` (só reage depois de certo ponto),
   * `pontos` (um valor para cada opção da lei, ligado em retas) ou `produto`
   * (a origem multiplica outra: base × alíquota, dívida × taxa, desemprego ×
   * seguro).
   */
  mecanismo: string;
  /**
   * A seta sai de uma ocorrência em curso (SG106): o nome do evento ou da
   * opção de dilema escolhida. Ocorrências paradas não aparecem.
   */
  ocorrencia?: Readonly<{ id: string; nome: string }>;
}>;

/** Uma razão para um grupo estar mais ou menos satisfeito. */
export type VisaoMotivo = Readonly<{
  /** Id da lei ou da bolha que empurra o grupo. */
  id: string;
  nome: string;
  tipo: "lei" | "bolha";
  /** Pontos de satisfação que ela dá (+) ou tira (−) agora. */
  pontos: number;
}>;

/** Grupo social para a lista lateral (SG143). */
export type VisaoGrupo = Readonly<{
  id: string;
  nome: string;
  /** Satisfação de 0 a 100. */
  satisfacao: number;
  /**
   * Parte do eleitorado (0–1) que está no segmento (V1-08). Cada eleitor
   * está em vários segmentos, então as partes não somam 1.
   */
  peso: number;
  /** Eixo do segmento (renda, ocupação, religião…), para a tela agrupar. */
  eixo?: Readonly<{ id: string; nome: string; ordem: number }>;
  /** O que mais aumenta a satisfação, do maior para o menor. */
  gosta: readonly VisaoMotivo[];
  /** O que mais derruba a satisfação, do maior para o menor. */
  odeia: readonly VisaoMotivo[];
}>;

/** Uma pessoa do governo, com o que o retrato precisa. */
export type VisaoPessoa = Readonly<{
  id: string;
  nome: string;
  sexo: "f" | "m";
}>;

/**
 * Um rosto na órbita do Judiciário: um juiz da corte suprema ou uma cadeira
 * vaga.
 */
export type VisaoJuiz = VisaoPessoa &
  Readonly<{
    tribunal: string;
    rotulo: string;
    /** Cor do partido de origem; técnico fica na cor do papel. */
    cor: string;
    vaga: boolean;
  }>;

/** A trindade: presidente do partido, candidato eleito e vice, na cor do partido. */
export type VisaoTrindade = Readonly<{
  sigla: string;
  nome: string;
  cor: string;
  presidente: VisaoPessoa;
  candidato: VisaoPessoa;
  vice: VisaoPessoa;
}>;

/** Um ministério (caixa) e quem o chefia; cuida de algumas instituições. */
export type VisaoMinistro = Readonly<{
  /** Id da caixa do ministério. */
  id: string;
  nome: string;
  pessoa: VisaoPessoa | null;
  /** Ids das instituições que ele cuida. */
  instituicoes: readonly string[];
  /** Verba que as instituições dele recebem das leis de gasto, em % do PIB. */
  verba: number;
}>;

/** Uma instituição: o órgão que executa as leis dela, sob um ministério. */
export type VisaoInstituicao = Readonly<{
  id: string;
  nome: string;
  /** Id da caixa responsável; null se fica com um dos poderes, sem ministro. */
  ministro: string | null;
  /** O poder que fica com ela quando não tem ministro (null se tem ministro). */
  poder: "judiciario" | "legislativo" | null;
  /** Verba que a instituição recebe das leis de gasto, em % do PIB. */
  verba: number;
}>;

/** Quem manda em quem: trindade, ministros, instituições e as leis de cada uma. */
export type VisaoHierarquia = Readonly<{
  trindade: VisaoTrindade | null;
  ministros: readonly VisaoMinistro[];
  instituicoes: readonly VisaoInstituicao[];
  /** Id da lei → id do ministério responsável. */
  ministroDaLei: Readonly<Record<string, string>>;
}>;

/** Um partido numa casa do Congresso. */
export type VisaoPartidoNaCasa = Readonly<{
  id: string;
  nome: string;
  cor: string;
  cadeiras: number;
  /** É o partido do jogador (o que governa). */
  governo: boolean;
}>;

/** Uma casa do Congresso: Câmara ou Senado. */
export type VisaoCasa = Readonly<{
  total: number;
  partidos: readonly VisaoPartidoNaCasa[];
}>;

/** Um tribunal no miolo do mapa, ligado ao juiz da órbita que o preside. */
export type VisaoTribunal = Readonly<{
  id: string;
  rotulo: string;
  /** Id do juiz da órbita que preside; null se a corte está sem ninguém. */
  presidente: string | null;
}>;

/** Os poderes além do Executivo: o Congresso de verdade e o Judiciário ainda de mentira. */
export type VisaoPoderes = Readonly<{
  legislativo: Readonly<{
    camara: VisaoCasa;
    senado: VisaoCasa | null;
    /** Ids das leis esperando voto ou sanção agora. */
    emVotacao: readonly string[];
  }>;
  judiciario: Readonly<{
    /** Juízes na ordem dos tribunais; sem Judiciário no país, rostos só para ocupar o lugar. */
    juizes: readonly VisaoJuiz[];
    pronto: boolean;
    /**
     * Os tribunais presididos por um juiz da órbita (a corte suprema e quem tira
     * o presidente dela), com o id do presidente.
     */
    tribunais?: readonly VisaoTribunal[];
    /** Tribunal que cuida das eleições (o eleitoral; sem ele, o constitucional). */
    eleitoral?: string;
  }>;
}>;

/** Superpotência do mundo, como a tela a desenha. */
export type VisaoPotencia = Readonly<{
  id: string;
  nome: string;
  descricao: string;
  /** O que ela pensa do país, de 0 a 100. */
  opiniao: number;
  /** O quanto conta na reputação (a soma de todas é 1). */
  peso: number;
}>;

export type VisaoProduto = Readonly<{
  id: string;
  nome: string;
  /** Quanto da demanda a produção do país atende, em %. */
  cobertura: number;
  importa: number;
  exporta: number;
  fornecedores: readonly Readonly<{
    id: string;
    nome: string;
    parte: number;
  }>[];
  /** Produto de cesta: demanda dos pops, preço do país e prédios (fatia 6a). */
  conta?: Readonly<{
    demanda: number;
    producao: number;
    importa: number;
    /** 100 = preço base. */
    preco: number;
    unidades?: Readonly<{ nome: string; quantas: number }>;
  }>;
}>;

export type VisaoSetor = Readonly<{
  id: string;
  nome: string;
  descricao: string;
  produtos: readonly VisaoProduto[];
}>;

/** Um produto no mercado do mundo: preço, variação e quem vende mais barato. */
export type VisaoPrecoMundo = Readonly<{
  id: string;
  nome: string;
  preco: number;
  /** % contra o turno anterior. */
  variacao: number;
  maisBarato?: string;
}>;

export type VisaoMundoMercado = Readonly<{
  setores: readonly Readonly<{
    id: string;
    nome: string;
    produtos: readonly VisaoPrecoMundo[];
  }>[];
  emAlta: readonly VisaoPrecoMundo[];
  maisEmConta: readonly VisaoPrecoMundo[];
}>;

/** Emprego, salário e lucro de um setor (motor/mercado, fatia 4). */
export type VisaoEmprego = Readonly<{
  id: string;
  /** Empregos, em % da população. */
  empregos: number;
  /** Salário médio, em vezes a renda média por pessoa. */
  salario: number;
  /** Massa salarial, em % do PIB. */
  massa: number;
  /** Lucro, em % do PIB. */
  lucro: number;
}>;

/** Construções de um setor: capacidade, obras e lucro (12b, fatia 1c). */
export type VisaoConstrucao = Readonly<{
  id: string;
  /** Capacidade pronta, em % do PIB real do turno 0. */
  pronta: number;
  /** Obras andando e na fila, em % do PIB real do turno 0. */
  emObra: number;
  /** Lucro de hoje ÷ lucro do turno 0; ausente em setor sem dono privado. */
  lucro?: number;
  /** Turnos seguidos de prejuízo. */
  prejuizo: number;
  /** Perde capacidade por prejuízo seguido. */
  fechando: boolean;
}>;

/** O que o país produz, compra e vende, por setor (motor/mercado). */
export type VisaoMercado = Readonly<{
  setores: readonly VisaoSetor[];
  /** Preço de cada produto no mundo. */
  mundo: VisaoMundoMercado;
  /** Emprego, salário e lucro por setor; os pops vêm do estado. */
  emprego: readonly VisaoEmprego[];
  /** Construções por setor; vazio sem construções. */
  construcoes: readonly VisaoConstrucao[];
  /** Pessoas sem emprego formal, em % da população. */
  semEmprego: number;
  /** Segurança alimentar por pop, uma entrada por cesta (fatia 6b). */
  cestas: readonly Readonly<{
    id: string;
    nome: string;
    /** Como a falta é chamada ("fome", "carência"). */
    termo: string;
    /** Segurança média da população (0 a 100): o índice do mundo. */
    media: number;
    pops: readonly Readonly<{
      id: string;
      nome: string;
      gasto: number;
      falta: number;
      seguranca: number;
    }>[];
    leve: number;
    grave: number;
  }>[];
  /** Redes de capacidade, como a energia (fatia 7). */
  capacidades: readonly Readonly<{
    id: string;
    nome: string;
    /** Demanda de civis e empresas e capacidade pronta, em pontos (turno 0 = 100). */
    demanda: Readonly<{ pessoas: number; empresas: number; total: number }>;
    capacidade: number;
    /** Falta de cada lado, em % do que pede (civis são atendidos primeiro). */
    faltaCivil: number;
    faltaEmpresas: number;
    /** Preço no país; 100 = base. */
    preco: number;
    fontes: readonly Readonly<{
      id: string;
      nome: string;
      pronta: number;
      emObra: number;
      /** Lei que paga a fonte e quanto ela gasta hoje, em % do PIB ao ano. */
      lei: string;
      investimento: number;
    }>[];
  }>[];
  /** De quanto cada potência fornece ao país, em % da demanda (média dos produtos). */
  dependencia: readonly Readonly<{ id: string; nome: string; valor: number }>[];
}>;

export type VisaoPartida = Readonly<{
  /** Trindade, ministros e instituições; ausente se o país não tem governo declarado. */
  hierarquia?: VisaoHierarquia;
  /** Legislativo e Judiciário; ausente sem Congresso. */
  poderes?: VisaoPoderes;
  pais: string;
  cenario: string;
  turno: number;
  leis: readonly VisaoLei[];
  bolhas: readonly VisaoBolha[];
  ligacoes: readonly VisaoLigacao[];
  grupos: readonly VisaoGrupo[];
  /** Superpotências e a opinião de cada uma; vazio se o mundo não tem. */
  potencias: readonly VisaoPotencia[];
  /** Produção, importação e exportação por setor; ausente se o país não declara. */
  mercado?: VisaoMercado;
}>;
