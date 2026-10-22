import type {
  ConsequenceFile,
  PolicyFile,
  PolicyLimits,
  PolicyLinkFile,
  PolicyOption,
  PolicyRequirementFile,
  PolicyTable,
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
  /** Mesa e camada (V1-34, leis-em-camadas.md). */
  mesa?: PolicyTable;
  /** Leis de outras mesas que esta puxa (V1-34). */
  vinculos?: PolicyLinkFile[];
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

/** Família da lei (molde-das-leis.md, 2.1): decide cor, controle e faixa. */
export type Familia =
  "imposto" | "verba" | "programa" | "regra" | "constitucional" | "petrea";

/** As 11 áreas do mundo (molde-das-leis.md, 2.4; `mundo/areas.json`). */
export type AreaId =
  | "contas-publicas"
  | "economia-e-empresas"
  | "trabalho"
  | "protecao-social"
  | "saude"
  | "educacao-e-cultura"
  | "infraestrutura-e-energia"
  | "ambiente-e-campo"
  | "seguranca-e-defesa"
  | "direitos-e-costumes"
  | "governo-e-instituicoes";

/** O que uma opção constitucional trava em outra lei. */
export type TravaV4 = {
  opcao: string;
  lei: string;
  minimo?: number;
  maximo?: number;
  proibe?: true;
};

/** Ficha de lei, formato v4 (molde único): a v3 com família, área e frase. */
export type FichaV4 = Omit<
  FichaV3,
  "versaoEsquema" | "area" | "ministerio" | "fontes" | "controle"
> & {
  versaoEsquema: 4;
  familia: Familia;
  /** O que a lei decide, numa frase afirmativa. */
  decide: string;
  /** Ausente só na pétrea, que fica no centro. */
  area?: AreaId;
  /** Exemplo no país: "No Brasil: Farmácia Popular, desde 2004." */
  exemplo?: string;
  trava?: TravaV4[];
  /** Do formato antigo, mantidos na conversão (mesmo sentido do PolicyFile). */
  implantacaoTurnos?: PolicyFile["implantacaoTurnos"];
  mae?: PolicyFile["mae"];
  /** Só programa: quem recebe e quantas pessoas. */
  publico?: { quem: string; pessoas: number };
  fontes?: FonteV3[];
  ministerio?: string;
  controle: {
    variavel: string;
    unidade: string;
    opcoes?: (PolicyOption & { propoe: string })[];
  };
};
