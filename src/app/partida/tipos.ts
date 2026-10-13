import type { ResolvedPackage, ScenarioGraph } from "../../engine";
import type { GameState } from "../../game/createGame";
import { BOLHAS_DO_ORCAMENTO } from "./contas";
import type { ResultadoDoCongresso } from "./tramitacao";

export type Resultado<T> =
  { ok: true; value: T } | { ok: false; erros: readonly string[] };

/**
 * `teste`: toda mudança de lei vale na hora (o Congresso ainda não vota).
 * `real`: leis que exigem o Congresso vão para a fila dele e só valem se
 * passarem na votação (V1-12).
 */
export type ModoPartida = "teste" | "real";

export type Partida = Readonly<{
  modo: ModoPartida;
  content: ResolvedPackage;
  graph: ScenarioGraph;
  game: GameState;
  /**
   * O mesmo país no piloto automático: sem nenhuma decisão do jogador.
   * Anda junto com a partida e serve só para mostrar a marca do jogador
   * (o que mudou por causa dele, não pelo movimento natural da rede).
   * É o próprio `game` enquanto o jogador não mudou nada.
   */
  piloto: GameState;
  acoes: number;
}>;

export type VisaoOpcao = Readonly<{
  id: string;
  rotulo: string;
  valor: number;
  /**
   * Quanto a lei arrecadaria (+) ou custaria (−) por ano nesta opção, com o
   * país como está agora (moeda do país). 0 se não toca o orçamento.
   */
  saldoAnual: number;
}>;

export type VisaoLei = Readonly<{
  id: string;
  nome: string;
  descricao: string;
  grupo: "orcamentaria" | "regulatoria" | "tributaria" | "institucional";
  area: string;
  /** Ministérios (nome real) a que esta lei pertence; hoje um só. */
  ministerios: readonly string[];
  ministerio: string;
  /** Id do ministério dono da lei (D-64). */
  ministerioId: string;
  /** Áreas do governo (esferas do mapa) onde a lei mora. */
  areas: readonly string[];
  /**
   * Como a lei muda: `emenda-constitucional`, `lei-ordinaria`,
   * `execucao-programa-autorizado`… A tela põe as constitucionais também na
   * área da Presidência.
   */
  processo: string;
  /** Nível que já está funcionando (anda até a meta mês a mês). */
  nivel: number;
  /** Nível escolhido pelo jogador. */
  meta: number;
  minimo?: number;
  maximo?: number;
  unidade: string;
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
  /**
   * Nível da lei (D-65): pétrea, constitucional ou derivada. Ausente nas
   * leis do formato antigo (áreas ainda não migradas).
   */
  nivelLegal?: "petrea" | "constitucional" | "derivada";
  /**
   * A lei vale hoje (está no mapa). Fora de vigor, ela está no catálogo:
   * pode ser aprovada, se nada a bloqueia.
   */
  emVigor: boolean;
  /** Pode sair do mapa (revogar) agora. */
  revogavel: boolean;
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

/** Lei que cai para a base por causa de uma mudança (SG138). */
export type VisaoQueda = Readonly<{
  id: string;
  nome: string;
  base: string;
  /** A lei sai de vigor (três níveis) em vez de cair para a base. */
  revogada: boolean;
}>;

export type VisaoBolha = Readonly<{
  id: string;
  nome: string;
  tipo: string;
  unidade: string;
  area: string;
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
  medida?: Readonly<{
    valor: number;
    unidade: string;
    fontes: readonly string[];
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

export type Contas = Readonly<
  Record<keyof typeof BOLHAS_DO_ORCAMENTO | "cofre", number>
>;

/**
 * As contas do governo, lidas das bolhas do orçamento. Receita, gasto, juros
 * e resultado são por ano; resultado = receita − gasto − juros (positivo é
 * superávit). Dívida e cofre são dois estoques (V1-07): a lei "Destino do
 * resultado fiscal" reparte o superávit entre pagar a dívida e encher o
 * cofre, e o déficit sai do cofre na mesma parte; o resto vira dívida. Os
 * `juros` descontam o rendimento do cofre. `divida` e `cofre` nunca são
 * negativos.
 */
export type VisaoContas = Contas &
  Readonly<{
    /** PIB do país por ano, na moeda do país. */
    pib: number;
    /** As mesmas contas em % do PIB, como estão na rede. */
    percentualPib: Contas;
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

export type VisaoPartida = Readonly<{
  pais: string;
  /** Cenário em jogo (ex.: "Brasil 2026"). */
  cenario: string;
  turno: number;
  contas: VisaoContas;
  leis: readonly VisaoLei[];
  bolhas: readonly VisaoBolha[];
  ligacoes: readonly VisaoLigacao[];
  /** Grupos sociais, do mais satisfeito ao menos satisfeito. */
  grupos: readonly VisaoGrupo[];
  /** Eventos, dilemas e situações (SG106). */
  ocorrencias: VisaoOcorrencias;
  /** Grupos de pressão (V1-09); ausente se o país não tem. */
  pressao?: VisaoPressao;
  /** Áreas do governo e seus ministérios, na ordem do anel (D-64). */
  governo: readonly VisaoArea[];
}>;

export type VisaoMinisterio = Readonly<{
  id: string;
  nome: string;
  cargo: string;
  leis: readonly string[];
  /** Pode ser extinto (não é do núcleo do governo). */
  extinguivel: boolean;
}>;

export type VisaoArea = Readonly<{
  id: string;
  titulo: string;
  curto: string;
  faz: string;
  /** Cargo de quem dá o rosto da área ("Fazenda"). */
  cargo: string;
  ministerios: readonly VisaoMinisterio[];
}>;

/** Seta de uma ocorrência: o que ela mexe enquanto dura. */
export type VisaoEfeitoOcorrencia = Readonly<{
  id: string;
  nome: string;
  unidade: string;
  /** Pontos na unidade da bolha (em estoque, por mês). */
  pontos: number;
  avaliacao?: string;
}>;

export type VisaoOpcaoDilema = Readonly<{
  id: string;
  rotulo: string;
  descricao: string;
  disponivel: boolean;
  /** Por que está indisponível. */
  motivo?: string;
  duracaoMeses: number;
  efeitos: readonly VisaoEfeitoOcorrencia[];
  /** Leis que a opção muda: id, nome e o novo valor (rótulo da opção). */
  leis: readonly Readonly<{ id: string; nome: string; para: string }>[];
  /** O que o piloto automático escolheria (não fazer nada). */
  padrao: boolean;
}>;

export type CamposOcorrencia = Readonly<{
  id: string;
  nome: string;
  manchete: string;
  descricao: string;
  area: string;
  origem: string;
  /** 1 local, 2 regional, 3 nacional, 4 catástrofe. */
  nivel: number;
  avaliacao?: string;
  /** Valores das variáveis do texto (cidade, empresa…). */
  variaveis?: Readonly<Record<string, string>>;
}>;

export type VisaoDilema = CamposOcorrencia &
  Readonly<{
    /** Ocorrência que trouxe o dilema (desdobramento). */
    causa?: Readonly<{ id: string; nome: string }>;
    aberto: number;
    opcoes: readonly VisaoOpcaoDilema[];
  }>;

export type VisaoOcorrenciaAtiva = CamposOcorrencia &
  Readonly<{
    tipo: "evento" | "dilema";
    /** Opção escolhida, se for a resposta a um dilema. */
    opcao?: string;
    mesesRestantes: number;
    inicio: number;
    efeitos: readonly VisaoEfeitoOcorrencia[];
  }>;

export type VisaoRegistro = Readonly<{
  tipo: "evento" | "dilema" | "situacao";
  id: string;
  nome: string;
  manchete: string;
  /** Texto com as variáveis trocadas (inclui "O motivo: …" das ações). */
  descricao?: string;
  /** Ocorrência de grupo de pressão: o grupo (V1-09). */
  grupo?: string;
  nivel: number;
  turno: number;
  fim?: number;
  opcao?: string;
  variaveis?: Readonly<Record<string, string>>;
  automatica?: boolean;
  avaliacao?: string;
}>;

export type VisaoOcorrencias = Readonly<{
  /** Dilemas esperando resposta: o turno não passa enquanto houver. */
  mesa: readonly VisaoDilema[];
  emCurso: readonly VisaoOcorrenciaAtiva[];
  /** Do mais recente ao mais antigo. */
  historico: readonly VisaoRegistro[];
}>;

export type RelatorioTurno = Readonly<{
  turno: number;
  /** Contas antes e depois do trimestre (por ano, na moeda do país). */
  contasAntes: VisaoContas;
  contas: VisaoContas;
  /** Contas como estariam sem as decisões do jogador. */
  contasSemVoce: VisaoContas;
  /** As bolhas que mais mudaram no trimestre, da maior mudança para a menor. */
  mudancas: readonly Readonly<{
    id: string;
    nome: string;
    antes: number;
    depois: number;
    /** Parte da mudança deste turno que veio das decisões do jogador. */
    porVoce: number;
    /** Parte que viria de qualquer jeito (o país andando sozinho). */
    sozinho: number;
  }>[];
  /** Quantas leis estão diferentes do país no piloto automático. */
  leisAlteradas: number;
  /** Respostas a dilemas em curso diferentes da opção padrão (SG106). */
  dilemasDiferentes: number;
  /** O jornal do turno (SG106): o que aconteceu e o que chegou à mesa. */
  ocorrencias: Readonly<{
    eventos: readonly VisaoRegistro[];
    dilemas: readonly VisaoRegistro[];
    surgiram: readonly VisaoRegistro[];
    acabaram: readonly VisaoRegistro[];
  }>;
  /** Grupos que mudaram de nível e investigações que acabaram (V1-09). */
  pressao: Readonly<{
    niveis: readonly VisaoMudancaDeNivel[];
    investigacoes: readonly VisaoInvestigacaoConcluida[];
  }>;
  /** O que o Congresso votou, pediu e tirou da fila no turno (V1-12). */
  congresso: ResultadoDoCongresso;
}>;

/** Nível de um grupo de pressão: 0 sem muitos adeptos … 3 preocupação nacional. */
export type VisaoGrupoPressao = Readonly<{
  id: string;
  nome: string;
  secao: string;
  visto: "esquerda" | "direita" | "nenhum";
  recursos: Readonly<{
    gente: number;
    dinheiro: number;
    midia: number;
    forca: number;
  }>;
  /** Pressão de 0 a 100. */
  pressao: number;
  nivel: number;
  nomeDoNivel: string;
  /** Entrada (sobe) e saída (desce) de cada nível, do 1 ao 3. */
  limites: readonly Readonly<{ entrada: number; saida: number }>[];
  /** O que mais empurra a pressão agora. */
  motivo?: string;
  ultimaAcao?: VisaoRegistro;
  /**
   * Patrocinadores conhecidos: os públicos e os revelados. O oculto não
   * aparece (a tela mostra "?" enquanto ninguém investigou).
   */
  financiadoPor: readonly Readonly<{
    id: string;
    nome: string;
    tipo: string;
    revelado: boolean;
  }>[];
  /** Investigação em curso: turnos que ainda faltam. */
  investigacao?: Readonly<{ turnosRestantes: number }>;
  /** Última investigação concluída sobre o grupo (turno). */
  investigadoEm?: number;
}>;

export type VisaoPressao = Readonly<{
  niveis: readonly string[];
  secoes: readonly Readonly<{ id: string; nome: string }>[];
  /** Na ordem das seções e, dentro delas, do maior nível ao menor. */
  grupos: readonly VisaoGrupoPressao[];
  /** Grupos em preocupação nacional (alerta na barra de cima). */
  alertas: readonly string[];
  investigacao: Readonly<{
    /** Capacidade de investigação (0 a 100). */
    capacidade: number;
    aoMesmoTempo: number;
    emCurso: number;
    turnos: number;
  }>;
}>;

export type VisaoMudancaDeNivel = Readonly<{
  grupo: string;
  nome: string;
  de: number;
  para: number;
  manchete: string;
}>;

export type VisaoInvestigacaoConcluida = Readonly<{
  grupo: string;
  nome: string;
  /** Nomes dos patrocinadores achados (vazio: nada). */
  achados: readonly string[];
  manchete: string;
}>;

/** Trajetória de uma bolha nos três meses do próximo turno. */
export type EfeitoPrevisto = Readonly<{
  id: string;
  nome: string;
  unidade: string;
  avaliacao?: string;
  /** Valor agora, antes do turno. */
  atual: number;
  /** Valor ao fim de cada mês (3 por turno) sem a mudança. */
  semMudanca: readonly number[];
  /** Valor ao fim de cada mês com a mudança. */
  comMudanca: readonly number[];
}>;

export type PrevisaoLei = Readonly<{
  leiId: string;
  nivel: number;
  /** Nível em funcionamento ao fim de cada mês, com a mudança. */
  implantacao: readonly number[];
  /** Bolhas que a mudança altera, da maior diferença (na escala de cada uma) para a menor. */
  efeitos: readonly EfeitoPrevisto[];
  /**
   * A simulação parou antes do horizonte pedido: a prévia mostra só os meses
   * calculados e aqui diz por quê (SG159).
   */
  interrompida?: string;
}>;

/** Um ponto da bússola (V1-10): de −10 a +10 em cada eixo. */
export type VisaoPontoBussola = Readonly<{
  /** − Estado, + mercado. */
  economia: number;
  /** − liberdade, + autoridade. */
  costumes: number;
}>;

/** Personalidade ou partido de referência, com a origem do ponto. */
export type VisaoReferencia = VisaoPontoBussola &
  Readonly<{
    id: string;
    nome: string;
    pais: string;
    /** Sigla do partido da personalidade; vazio num partido. */
    partido: string;
    /** Anos de eleição usados na média. */
    anos: readonly number[];
  }>;

export type VisaoBussola = Readonly<{
  ponto: VisaoPontoBussola;
  /** Onde as leis do país estavam no começo do mandato. */
  inicio: VisaoPontoBussola;
  /** O ponto no fim de cada turno. */
  caminho: readonly (VisaoPontoBussola & Readonly<{ turno: number }>)[];
  personalidades: readonly VisaoReferencia[];
  partidos: readonly VisaoReferencia[];
  pertoPersonalidades: readonly (VisaoReferencia &
    Readonly<{ distancia: number }>)[];
  pertoPartidos: readonly (VisaoReferencia & Readonly<{ distancia: number }>)[];
  /** Leis em vigor que mais puxam o ponto (importância × seta). */
  leisQueMaisPuxam: readonly Readonly<{
    id: string;
    nome: string;
    economia: number;
    costumes: number;
    porque: string;
  }>[];
  fatorDoRumo: Readonly<{ economia: number; costumes: number }>;
  fonte: string;
  semMedida: readonly Readonly<{ nome: string; motivo: string }>[];
}>;
