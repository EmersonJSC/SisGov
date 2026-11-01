// Visão da partida para o mapa (formato herdado da tela antiga, só leitura).
// Tipos copiados do projeto antigo (src/app/partida/tipos.ts); a tela do mapa
// só lê isto. Quem monta é `montarVisao` (visao.ts).

export type VisaoOpcao = Readonly<{
  id: string;
  rotulo: string;
  valor: number;
  /**
   * Quanto a lei arrecadaria (+) ou custaria (−) por ano nesta opção, com o
   * país como está agora (moeda do país). 0 se não toca o orçamento.
   */
  saldoAnual: number;
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
  area: string;
  /** Ministérios (nome real) a que esta lei pertence; hoje um só. */
  ministerios: readonly string[];
  ministerio: string;
  /** Id do ministério dono da lei (D-64). */
  ministerioId: string;
  /** Áreas do governo (esferas do mapa) onde a lei mora. */
  areas: readonly string[];
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
  /** Perda de compra da verba nominal nos últimos doze meses. */
  poderCompraPerdido?: number;
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
  /** Aparece no mapa mesmo quando a decisão está com outra instituição. */
  sempreVisivel?: boolean;
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

export type VisaoPartida = Readonly<{
  pais: string;
  cenario: string;
  turno: number;
  leis: readonly VisaoLei[];
  bolhas: readonly VisaoBolha[];
  ligacoes: readonly VisaoLigacao[];
  grupos: readonly VisaoGrupo[];
  /** Áreas do governo e seus ministérios, na ordem do anel. */
  governo: readonly VisaoArea[];
}>;
