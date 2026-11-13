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
}

/** Esfera, ou subesfera dela, que uma caixa cuida. */
export interface RefEsfera {
  esfera: string;
  subesfera?: string;
}

/** Molde de ministério do mundo (aba Ministérios). */
export interface Molde {
  id: string;
  nome: string;
  tipo: string;
  esferas: RefEsfera[];
  /** Recebe o que nenhuma outra caixa cuida (o gabinete). */
  sobra?: boolean;
}

/** O que o país declara: quais moldes usa, quem manda em cada um e quem existe. */
export interface GovernoDoPais {
  ministerios: { molde: string; ministro: string }[];
  pessoas: Ficha[];
  /** Leis do mundo que o governo lê; o país diz o id. */
  leis?: { cargos?: string };
}

/** Regras fixas na partida: moldes do mundo, pessoas e leis lidas. */
export interface RegrasGoverno {
  moldes: Molde[];
  pessoas: Ficha[];
  leis?: GovernoDoPais["leis"];
}

export interface Caixa {
  molde: string;
  ministro: string;
}

/** Um órgão por esfera: verba da lei, necessidade do trabalho e corrupção. */
export interface Orgao {
  /** Verba que o trabalho pedia no começo, em % do PIB (0 = sem verba em lei). */
  necessidade: number;
  /** Leis ativas da esfera no começo; cada uma a mais pede mais trabalho. */
  leisBase: number;
  /** 0 a 100. */
  corrupcao: number;
}

export interface EstadoGoverno {
  caixas: Caixa[];
  orgaos: Record<string, Orgao>;
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
