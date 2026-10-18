/** Contrato da fonte canônica usada pelo gerador interno do grafo. */
export type Proveniencia =
  | { estado: "fonte"; referencia: string; unidade?: string; periodo?: string }
  | { estado: "hipotese"; motivo: string };

export type TipoNoGerado =
  | "lei"
  | "indice"
  | "programa"
  | "situacao"
  | "evento"
  | "ator"
  | "conta"
  | "pais"
  | "cenario";

export type NoGerado = {
  id: string;
  tipo: TipoNoGerado;
  nome: string;
  area: string;
  unidade?: string;
  medida?: { zero: number; cem: number; fonte: string };
  decisao?: {
    pergunta: string;
    variavel: string;
    modo: "opcoes" | "faixa";
    opcoes?: readonly { id: string; rotulo: string; valor: number }[];
    faixa?: { minimo?: number; maximo?: number; motivoLimite?: string };
  };
  proveniencia: Proveniencia;
};

export type TipoRelacaoGerada =
  | "altera"
  | "mede"
  | "financia"
  | "limita"
  | "requer"
  | "transfere"
  | "retorna-para";

export type RelacaoGerada = {
  de: string;
  para: string;
  tipo: TipoRelacaoGerada;
  sinal?: -1 | 0 | 1;
  atrasoTurnos: number;
  proveniencia: Proveniencia;
  /** Conta ou fluxo que esta relação altera; usado para detectar duplicidade. */
  fluxo?: string;
};

export type ParametroAjustavel = {
  id: string;
  valor: number;
  passo: number;
  /** Faixa sustentada por domínio ou fonte; ausência impede busca automática. */
  faixa?: { minimo: number; maximo: number; justificativa: string };
  proveniencia: Proveniencia;
};

export type DefinicaoGerador = {
  id: string;
  versao: 1;
  nos: readonly NoGerado[];
  relacoes: readonly RelacaoGerada[];
  parametros: readonly ParametroAjustavel[];
};

export type FalhaGerador = {
  codigo:
    | "ID_DUPLICADO"
    | "ALVO_AUSENTE"
    | "ATRASO_INVALIDO"
    | "PROVENIENCIA_AUSENTE"
    | "HIPOTESE_SEM_MOTIVO"
    | "LEI_SEM_ESCOLHA"
    | "ESCOLHA_SEM_ALTERNATIVAS"
    | "ESCOLHA_SEM_VARIAVEL"
    | "PARAMETRO_SEM_FAIXA"
    | "PARAMETRO_FAIXA_INVALIDA"
    | "FLUXO_DUPLICADO"
    | "CICLO_SEM_FEEDBACK";
  caminho: string;
  mensagem: string;
  bloqueante: boolean;
};

export type RodadaGerador = {
  idDefinicao: string;
  estado: "bloqueada" | "rascunho" | "pronta-para-revisao";
  nos: readonly NoGerado[];
  relacoes: readonly RelacaoGerada[];
  falhas: readonly FalhaGerador[];
};
