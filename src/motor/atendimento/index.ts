// Rede de atendimento: vagas públicas, planos e profissionais de saúde. O índice
// sai dessa conta: quem não é atendido está na fila. Hospital sem profissional
// não atende, e o plano paga mais e tira gente da rede pública.
// O motor não conhece nomes de lei nem de índice. Regras em atendimento.md.
import { atrasoDasObras } from "../mercado/construcoes";

const TURNOS_POR_ANO = 6;

/** O que o mundo declara (`mundo/atendimento/atendimento.json`). */
export interface RegraDoAtendimento {
  indice: string;
  indice_profissionais: string;
  /** Índice de onde saem os novos profissionais. */
  indice_instrucao: string;
  pop_profissionais: string;
  /** Pop de onde vêm os formados e para onde vão os que param. */
  pop_origem: string;
  /** Lei contínua (fração do PIB) que paga a rede pública. */
  lei_verba: string;
  /** Leis de opções; cada opção traz o número em `valores.parte`. */
  lei_abertura: string;
  lei_limite: string;
  /** Pessoas que um profissional atende. */
  pessoas_por_profissional: number;
  /** Verba por ano de uma vaga, em anos de PIB por pessoa. */
  custo_vaga: number;
  /** Trabalho da obra de uma vaga no setor, em anos de PIB por pessoa. */
  custo_obra: number;
  /** Turnos de uma obra, com o setor folgado e sem atraso. */
  prazo: number;
  /** Parte das vagas sem verba que fecha por ano (0 a 1). */
  fechamento: number;
  /** Renda que paga um plano, em vezes a renda média do turno 0. */
  renda_plano: number;
  /** Parte de quem pode pagar que tem plano, sem lei nenhuma (0 a 1). */
  plano_livre: number;
  /** Quanto um cliente de plano ocupa um profissional (1 = como na rede pública). */
  peso_plano: number;
  /** Parte da distância até os planos novos que anda por turno (0 a 1). */
  velocidade: number;
  /** Parte dos profissionais que para de atender por ano (0 a 1). */
  aposentadoria: number;
  /** Parte que emigra por ano, com a renda real zerada (0 a 1). */
  emigracao: number;
}

export interface ObraDoAtendimento {
  vagas: number;
  /** Turnos de trabalho que faltam (pode ser fracionário). */
  falta: number;
}

export interface AtendimentoNoEstado {
  /** Pessoas que a rede pública comporta, com profissional para isso ou não. */
  vagas: number;
  /** Vagas que não dependem da verba (pode ser negativa: a rede custa mais). */
  vagas_fora: number;
  obras: ObraDoAtendimento[];
  /** Parte da população com plano (0 a 1). */
  planos: number;
  /** Parte da população que se forma por turno, no ritmo do turno 0. */
  formacao: number;
  /** Índices contados no último turno. */
  indice: number;
  indice_profissionais: number;
}

/** O que as leis em vigor pedem, em números. */
export interface LeisDoAtendimento {
  /** Fração do PIB. */
  verba: number;
  /** Parte do mercado de planos aberta e parte limitada (0 a 1). */
  abertura: number;
  limite: number;
}

export interface Rede {
  populacao: number;
  profissionais: number;
  vagas: number;
  planos: number;
}

export interface TurnoDoAtendimento {
  populacao: number;
  leis: LeisDoAtendimento;
  /** Índice de atraso de hoje (0 a 100). */
  atraso: number;
  /** Quanto as obras andam por turno, com o setor cheio (0 a 1). */
  ritmo: number;
  /** Parte das pessoas com renda para pagar um plano (0 a 1). */
  com_bolso: number;
}

/** Parte da população que acaba com plano, com estas leis. */
export const planosAlvo = (
  regra: RegraDoAtendimento,
  leis: LeisDoAtendimento,
  comBolso: number,
) =>
  comBolso *
  (regra.plano_livre + leis.abertura * (1 - regra.plano_livre)) *
  (1 - leis.limite);

/** Vagas que a verba paga; a corrupção encarece. */
const vagasDaVerba = (
  regra: RegraDoAtendimento,
  populacao: number,
  verba: number,
  atraso: number,
) => (verba * populacao) / (regra.custo_vaga * atrasoDasObras(atraso).custo);

/**
 * Quem é atendido hoje, em % da população. O plano vem primeiro: paga mais e
 * fica com os profissionais; a rede pública atende com o que sobra.
 */
export function indiceDoAtendimento(
  regra: RegraDoAtendimento,
  { populacao, profissionais, vagas, planos }: Rede,
): number {
  const porProfissional = regra.pessoas_por_profissional;
  const clientes = populacao * planos;
  const noPlano = Math.min(
    profissionais,
    (clientes * regra.peso_plano) / porProfissional,
  );
  const doPlano = (noPlano * porProfissional) / regra.peso_plano;
  const publico = Math.min(
    populacao - doPlano,
    vagas,
    (profissionais - noPlano) * porProfissional,
  );
  return ((doPlano + publico) / populacao) * 100;
}

/** Quantos o país tem de profissionais contra o que precisa, de 0 a 100. */
export const indiceDosProfissionais = (
  regra: RegraDoAtendimento,
  profissionais: number,
  populacao: number,
) =>
  Math.min(
    100,
    ((profissionais * regra.pessoas_por_profissional) / populacao) * 100,
  );

/** Rede do turno 0, contada a partir do índice do país. */
export function atendimentoInicial(
  regra: RegraDoAtendimento,
  pais: {
    populacao: number;
    profissionais: number;
    /** Índice do país (0 a 100). */
    atendimento: number;
    leis: LeisDoAtendimento;
    atraso: number;
    com_bolso: number;
  },
): AtendimentoNoEstado {
  const { populacao, profissionais } = pais;
  const planos = planosAlvo(regra, pais.leis, pais.com_bolso);
  const soPlanos = indiceDoAtendimento(regra, {
    populacao,
    profissionais,
    vagas: 0,
    planos,
  });
  const vagas = (Math.max(0, pais.atendimento - soPlanos) / 100) * populacao;
  return {
    vagas,
    vagas_fora:
      vagas - vagasDaVerba(regra, populacao, pais.leis.verba, pais.atraso),
    obras: [],
    planos,
    formacao:
      ((profissionais / populacao) * regra.aposentadoria) / TURNOS_POR_ANO,
    indice: pais.atendimento,
    indice_profissionais: indiceDosProfissionais(
      regra,
      profissionais,
      populacao,
    ),
  };
}

/**
 * Um turno: as obras prontas abrem vagas, a verba a mais começa obras, a verba a
 * menos fecha vagas aos poucos, e os planos andam com a renda e as leis.
 */
export function andarAtendimento(
  regra: RegraDoAtendimento,
  s: AtendimentoNoEstado,
  turno: TurnoDoAtendimento,
): AtendimentoNoEstado {
  const passo = turno.ritmo / atrasoDasObras(turno.atraso).prazo;
  let { vagas } = s;
  const fila: ObraDoAtendimento[] = [];
  for (const obra of s.obras) {
    const falta = obra.falta - passo;
    if (falta <= 1e-9) vagas += obra.vagas;
    else fila.push({ ...obra, falta });
  }
  const alvo = Math.max(
    0,
    s.vagas_fora +
      vagasDaVerba(regra, turno.populacao, turno.leis.verba, turno.atraso),
  );
  if (vagas > alvo)
    vagas -= ((vagas - alvo) * regra.fechamento) / TURNOS_POR_ANO;
  const naFila = fila.reduce((soma, o) => soma + o.vagas, 0);
  const novas = alvo - vagas - naFila;
  if (novas > 1e-6) fila.push({ vagas: novas, falta: regra.prazo });
  const planos = planosAlvo(regra, turno.leis, turno.com_bolso);
  return {
    ...s,
    vagas,
    obras: fila,
    planos: s.planos + regra.velocidade * (planos - s.planos),
  };
}

/**
 * Quem entra e quem sai da profissão num turno, em pessoas. Forma-se mais com
 * instrução melhor; quem perde renda real emigra.
 */
export function fluxoDeProfissionais(
  regra: RegraDoAtendimento,
  s: AtendimentoNoEstado,
  turno: {
    populacao: number;
    profissionais: number;
    /** Instrução de hoje ÷ a do turno 0. */
    instrucao: number;
    /** Renda real do pop: hoje ÷ turno 0. */
    renda: number;
  },
) {
  const perda = Math.min(1, Math.max(0, 1 - turno.renda));
  return {
    formados: s.formacao * turno.instrucao * turno.populacao,
    param: (turno.profissionais * regra.aposentadoria) / TURNOS_POR_ANO,
    emigrados: (turno.profissionais * regra.emigracao * perda) / TURNOS_POR_ANO,
  };
}

/** Turnos de obra em andamento, em anos de PIB por pessoa, para o setor. */
export const trabalhoDoAtendimento = (
  regra: RegraDoAtendimento,
  obras: readonly ObraDoAtendimento[],
) => obras.reduce((soma, o) => soma + o.vagas, 0) * regra.custo_obra;

/**
 * O que mudar as leis faz, para a ficha: pontos do índice pela rede pública e
 * pelos planos. Sem profissional para atender, a vaga nova não dá ponto.
 */
export function pontosDoAtendimento(
  regra: RegraDoAtendimento,
  s: AtendimentoNoEstado,
  antes: LeisDoAtendimento,
  depois: LeisDoAtendimento,
  turno: {
    populacao: number;
    profissionais: number;
    atraso: number;
    com_bolso: number;
  },
) {
  const { populacao, profissionais, atraso, com_bolso } = turno;
  const vagasCom = (leis: LeisDoAtendimento) =>
    Math.max(
      0,
      s.vagas_fora + vagasDaVerba(regra, populacao, leis.verba, atraso),
    );
  const planosCom = (leis: LeisDoAtendimento) =>
    planosAlvo(regra, leis, com_bolso);
  const indice = (vagas: number, planos: number) =>
    indiceDoAtendimento(regra, { populacao, profissionais, vagas, planos });
  const hoje = indice(vagasCom(antes), planosCom(antes));
  return {
    rede: indice(vagasCom(depois), planosCom(antes)) - hoje,
    planos: indice(vagasCom(antes), planosCom(depois)) - hoje,
  };
}
