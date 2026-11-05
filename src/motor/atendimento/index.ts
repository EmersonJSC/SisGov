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
  /** Lei contínua (fração do PIB) que paga o atendimento básico. */
  lei_basica: string;
  /**
   * Leis de opções que esticam o profissional da rede pública; cada opção traz
   * `valores.alcance`, `valores.fraco` e `valores.abandono`.
   */
  leis_alcance: string[];
  /** Pessoas que um profissional atende. */
  pessoas_por_profissional: number;
  /** Índice que recebe a verba parada em vagas sem atendimento. */
  indice_desvio: string;
  /** Verba por ano (fração do PIB) que cobre 63% do país; cada vaga custa mais que a anterior. */
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
  /** Turnos para a instrução de hoje virar profissional formado. */
  formatura: number;
  /** Pontos do índice de desvio por ponto da população em vagas paradas. */
  desvio: number;
  /** Índice que perde com o atendimento esticado. */
  indice_vida: string;
  /** Verba por ano (fração do PIB) que paga 63% do `basico_teto`. */
  custo_basico: number;
  /** Parte da fila que o atendimento básico alcança, no máximo (0 a 1). */
  basico_teto: number;
  /** Índice que sobe quando quem paga é atendido e o resto fica na fila. */
  indice_desigualdade: string;
  /** Pontos do índice por ponto de "com plano × na fila", em % ao quadrado ÷ 100. */
  desigualdade: number;
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
  /** Instrução das turmas que se formam ÷ a do turno 0. */
  turmas: number;
  /** Índices contados no último turno. */
  indice: number;
  indice_profissionais: number;
  /** Pontos que a verba parada soma ao índice de desvio. */
  desvio: number;
  /** Pontos que a saúde de dois andares soma ao índice de desigualdade. */
  desigualdade: number;
  /** Parte da fila no atendimento básico, hoje (0 a 1). */
  cobertura: number;
  /** Quanto a mais o profissional da rede pública atende, hoje (0,2 = 20%). */
  alcance: number;
  /** Pontos que o atendimento esticado tira do índice de vida. */
  fraqueza: number;
}

/** O que as leis em vigor pedem, em números. */
export interface LeisDoAtendimento {
  /** Fração do PIB. */
  verba: number;
  /** Parte do mercado de planos aberta e parte limitada (0 a 1). */
  abertura: number;
  limite: number;
  /** Fração do PIB. */
  basica: number;
  /** Quanto a mais o profissional atende, somando as leis. */
  alcance: number;
  /** Pontos do índice de vida perdidos por ponto de gente no atendimento esticado. */
  fraco: number;
  /** Parte dos profissionais que larga a profissão por ano (0 a 1). */
  abandono: number;
}

export interface Rede {
  populacao: number;
  profissionais: number;
  vagas: number;
  planos: number;
  alcance?: number;
  cobertura?: number;
  fraco?: number;
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

/**
 * Vagas que a verba paga. O retorno cai: a vaga nova custa mais que a anterior,
 * porque atende quem está mais longe. A corrupção encarece.
 */
const vagasDaVerba = (
  regra: RegraDoAtendimento,
  populacao: number,
  verba: number,
  atraso: number,
) =>
  populacao *
  (1 - Math.exp(-verba / (regra.custo_vaga * atrasoDasObras(atraso).custo)));

/** Parte da fila que o atendimento básico alcança, com esta verba. */
const coberturaAlvo = (
  regra: RegraDoAtendimento,
  verba: number,
  atraso: number,
) =>
  regra.basico_teto *
  (1 - Math.exp(-verba / (regra.custo_basico * atrasoDasObras(atraso).custo)));

/**
 * Quem o plano e a rede pública atendem. O plano vem primeiro: paga mais e fica
 * com os profissionais; a rede pública atende com o que sobra. O atendimento
 * básico alcança parte de quem sobrou, sem vaga e sem profissional.
 */
function contaDaRede(
  regra: RegraDoAtendimento,
  { populacao, profissionais, vagas, planos, alcance = 0, cobertura = 0 }: Rede,
) {
  const porProfissional = regra.pessoas_por_profissional;
  const clientes = populacao * planos;
  const noPlano = Math.min(
    profissionais,
    (clientes * regra.peso_plano) / porProfissional,
  );
  const doPlano = (noPlano * porProfissional) / regra.peso_plano;
  const semEsticar = (profissionais - noPlano) * porProfissional;
  const teto = Math.min(populacao - doPlano, vagas);
  const publico = Math.min(teto, semEsticar * (1 + alcance));
  const basico = (populacao - doPlano - publico) * cobertura;
  return {
    doPlano,
    publico,
    basico,
    esticado: publico - Math.min(teto, semEsticar),
  };
}

/** Quem é atendido hoje, em % da população. */
export function indiceDoAtendimento(
  regra: RegraDoAtendimento,
  rede: Rede,
): number {
  const { doPlano, publico, basico } = contaDaRede(regra, rede);
  return ((doPlano + publico + basico) / rede.populacao) * 100;
}

/** Pontos do índice de desvio: verba em vagas que ninguém atende. */
export function desvioDaRede(regra: RegraDoAtendimento, rede: Rede): number {
  const paradas = rede.vagas - contaDaRede(regra, rede).publico;
  return (Math.max(0, paradas) / rede.populacao) * 100 * regra.desvio;
}

/** Pontos que o índice de vida perde: gente atendida às pressas. */
export function fraquezaDaRede(regra: RegraDoAtendimento, rede: Rede): number {
  const { esticado } = contaDaRede(regra, rede);
  return (esticado / rede.populacao) * 100 * (rede.fraco ?? 0);
}

/**
 * Pontos do índice de desigualdade: a saúde de dois andares. Pesa quando há gente
 * com plano e gente na fila; sem fila, ou sem plano, não há dois andares.
 */
export function desigualdadeDaRede(
  regra: RegraDoAtendimento,
  rede: Rede,
): number {
  const fila = 1 - indiceDoAtendimento(regra, rede) / 100;
  return rede.planos * fila * 100 * regra.desigualdade;
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
    turmas: 1,
    indice: pais.atendimento,
    indice_profissionais: indiceDosProfissionais(
      regra,
      profissionais,
      populacao,
    ),
    desvio: 0,
    desigualdade: desigualdadeDaRede(regra, {
      populacao,
      profissionais,
      vagas,
      planos,
    }),
    cobertura: 0,
    alcance: 0,
    fraqueza: 0,
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
    cobertura:
      s.cobertura +
      regra.velocidade *
        (coberturaAlvo(regra, turno.leis.basica, turno.atraso) - s.cobertura),
    alcance: s.alcance + regra.velocidade * (turno.leis.alcance - s.alcance),
  };
}

/**
 * Quem entra e quem sai da profissão num turno, em pessoas. A instrução melhor
 * só forma mais depois de `formatura`; quem perde renda real emigra.
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
    /** Parte que larga a profissão por ano, pelas leis (0 a 1). */
    abandono: number;
  },
) {
  const perda = Math.min(1, Math.max(0, 1 - turno.renda));
  const turmas = s.turmas + (turno.instrucao - s.turmas) / regra.formatura;
  return {
    turmas,
    formados: s.formacao * turmas * turno.populacao,
    param:
      (turno.profissionais * (regra.aposentadoria + turno.abandono)) /
      TURNOS_POR_ANO,
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
 * pelos planos, e pelo cuidado esticado ou básico. Sem profissional para atender, a vaga nova não dá ponto e vira
 * desvio.
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
  const rede = (vagas: number, planos: number, cuidado: LeisDoAtendimento) => ({
    populacao,
    profissionais,
    vagas,
    planos,
    alcance: cuidado.alcance,
    cobertura: coberturaAlvo(regra, cuidado.basica, atraso),
    fraco: cuidado.fraco,
  });
  const redeAntes = rede(vagasCom(antes), planosCom(antes), antes);
  const redeDepois = rede(vagasCom(depois), planosCom(depois), depois);
  const hoje = indiceDoAtendimento(regra, redeAntes);
  const comMudanca = (mudanca: Partial<Rede>) =>
    indiceDoAtendimento(regra, { ...redeAntes, ...mudanca }) - hoje;
  const { vagas, planos, alcance, cobertura } = redeDepois;
  const diferenca = (
    conta: (regra: RegraDoAtendimento, rede: Rede) => number,
  ) => conta(regra, redeDepois) - conta(regra, redeAntes);
  return {
    rede: comMudanca({ vagas }),
    planos: comMudanca({ planos }),
    cuidado: comMudanca({ alcance, cobertura }),
    desvio: diferenca(desvioDaRede),
    desigualdade: diferenca(desigualdadeDaRede),
    fraqueza: diferenca(fraquezaDaRede),
  };
}
