// Tipos do Governo (passo 5). Comportamento em governo.md.
import type { PontoBussola } from "../leis";

/** Ficha de uma pessoa que pode ser ministro (gerada; nunca pessoa real). */
export interface Ficha {
  id: string;
  nome: string;
  /** Técnica da área: adianta e reforça as leis da caixa. */
  competencia: number;
  /** Política: ajuda a aprovar as leis da área (lida pelo Congresso depois). */
  habilidade: number;
  /** Como a mídia e o eleitor o veem (lida pela mídia depois). */
  carisma: number;
  /** Baixa: mais corrupção na área e risco de escândalo. */
  honestidade: number;
  /** Baixa: vaza, sabota ou sai atirando (lida pelos fatos depois). */
  lealdade: number;
  bussola: PontoBussola;
  /** Id do partido ou "tecnico". */
  origem: string;
  /** Aparência e idade, para os retratos e o perfil; fichas escritas à mão podem não ter. */
  sexo?: "f" | "m";
  idade?: number;
  /** Turno em que sentou na corte (juízes); a antiguidade sai daqui. */
  posse?: number;
}

/** Os poderes do miolo que ficam com instituição sem ministro. */
export type Poder = "judiciario" | "legislativo";

/** Instituição do mundo: o órgão que executa as leis que moram nela. */
export interface Instituicao {
  id: string;
  nome: string;
  /** Fica com este poder, sem ministro; nenhuma caixa a leva (eleições, regras dos poderes). */
  poder?: Poder;
}

/** Caixa sugerida do mundo (aba Ministérios geral): o que costuma levar. */
export interface Molde {
  id: string;
  nome: string;
  tipo: string;
  instituicoes: string[];
  sobra?: boolean;
}

/** Um ministério: nome, as instituições dentro e quem o chefia. */
export interface Caixa {
  id: string;
  nome: string;
  instituicoes: string[];
  ministro: string;
  /** Recebe as instituições que nenhuma outra caixa leva (o gabinete). */
  sobra?: boolean;
}

/** O que o país declara: os ministérios do começo e quem existe. */
export interface GovernoDoPais {
  ministerios: Caixa[];
  pessoas: Ficha[];
  /** Leis do mundo que o governo lê; o país diz o id. */
  leis?: { cargos?: string };
}

/** Regras fixas na partida: instituições e moldes do mundo, pessoas e leis lidas. */
export interface RegrasGoverno {
  instituicoes: Instituicao[];
  moldes: Molde[];
  pessoas: Ficha[];
  leis?: GovernoDoPais["leis"];
}

/** Um órgão por instituição: verba da lei, necessidade do trabalho e corrupção. */
export interface Orgao {
  /** Verba que o trabalho pedia no começo, em % do PIB (0 = sem verba em lei). */
  necessidade: number;
  /** Leis ativas da instituição no começo; cada uma a mais pede mais trabalho. */
  leisBase: number;
  /** 0 a 100. */
  corrupcao: number;
}

/** Ministro que o jogador tirou: quando, onde estava na bússola e qual troca do mandato foi. */
export interface Troca {
  turno: number;
  bussola: PontoBussola;
  ordem: number;
}

export interface EstadoGoverno {
  caixas: Caixa[];
  orgaos: Record<string, Orgao>;
  /** Trocas pedidas pelo jogador nos últimos turnos (polêmica e mágoa). */
  trocas?: Troca[];
}

/** Troca o ministro de uma caixa por alguém que está livre. */
export interface PedidoNomear {
  tipo: "nomear";
  caixa: string;
  ministro: string;
}

/** Quanto a ficha muda o efeito de uma lei: turnos a mais e fator de força. */
export interface AjusteDeEfeito {
  atraso: number;
  forca: number;
}
