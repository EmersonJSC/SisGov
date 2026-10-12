import type {
  ConsequenceFile,
  PolicyFile,
  PolicyLimits,
  PolicyOption,
  PolicyRequirementFile,
} from "../../../engine";

/** Nível da lei na versão 1 (conteudo.md 1.1). */
export type NivelDaLei = "constituicao" | "lei" | "decreto";

/** Um efeito da lei: vira uma consequência do motor (conteudo.md 1.2). */
export type EfeitoV3 = {
  /** Padrão: `<lei>--<alvo com hífens>`. Só quando dois efeitos têm o mesmo alvo. */
  id?: string;
  alvo: string;
  mecanismo: ConsequenceFile["mecanismo"];
  parametros: ConsequenceFile["parametros"];
  /** Em turnos (trimestres), como `atrasoPassos`. */
  atraso: number;
  /** Padrão: contínuo. */
  duracao?: ConsequenceFile["duracao"];
  /** Padrão: o controle da lei. */
  origem?: string;
  normalizacao?: ConsequenceFile["normalizacao"];
  leitura?: ConsequenceFile["leitura"];
  escala?: ConsequenceFile["escala"];
  /** Padrão: a unidade do alvo (taxa por passo quando o alvo é estoque). */
  unidade?: string;
};

export type DinheiroV3 =
  | {
      tipo: "gasto";
      modo: NonNullable<PolicyFile["orcamento"]>["modo"];
      base?: "receita_total";
      limites?: PolicyLimits;
    }
  | { tipo: "receita"; base: string; limites?: PolicyLimits };

export type FonteV3 = { titulo: string; url: string; usadoPara?: string };

/** Ficha de lei, formato v3. O JSON do motor (lei v2 + consequências) sai dela. */
export type FichaV3 = {
  id: string;
  tipo: "lei";
  versaoEsquema: 3;
  nome: string;
  descricao: string;
  area: string;
  ministerio: string;
  nivel: NivelDaLei;
  /** Só constituição: cláusula que não muda por votação. */
  petrea?: boolean;
  /** Padrão do motor: só leis derivadas saem do mapa (D-65). */
  revogavel?: boolean;
  /** Padrão: deduzido do nível e do dinheiro. Só quando o padrão não serve. */
  grupo?: PolicyFile["grupo"];
  controle: { variavel: string; unidade: string; opcoes?: PolicyOption[] };
  /** Pontos de capital (V1-10); aceito e ainda não usado. */
  custoPolitico?: {
    aprovar: number;
    revogar: number;
    subir: number;
    baixar: number;
  };
  dinheiro?: DinheiroV3;
  /** Fração do caminho por turno, ao subir (entrada) e ao descer (saída). */
  implantacao?: { entrada: number; saida: number };
  /** Outras leis exigidas (vira `requer` da lei v2). */
  dependeDe?: PolicyRequirementFile[];
  /** Leis que não convivem com esta; verificado, ainda sem regra no jogo. */
  excludentes?: string[];
  /** Características do país (V1-06); aceito e ainda não usado. */
  requer?: { exige?: string[]; proibe?: string[] };
  efeitos: EfeitoV3[];
  /** Segmentos que gostam e que não gostam (V1-08); aceito e ainda não usado. */
  populacao?: {
    gostam?: { segmento: string; intensidade: number }[];
    naoGostam?: { segmento: string; intensidade: number }[];
  };
  /** Países que usam cada opção e o caso brasileiro. */
  historia?: { opcoes?: Record<string, string[]>; brasil?: string };
  fontes: FonteV3[];
};
