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
  /**
   * Lei de opções do seguro pago na folha; cada opção traz `valores.parte` (quem
   * da folha entra) e `valores.informal` (quem o custo tira do emprego formal).
   */
  lei_seguro: string;
  /**
   * Lei de opções da gratuidade; cada opção traz `valores.procura` (quanto a mais
   * cada pessoa usa a rede pública) e `valores.saida` (parte que larga o plano).
   */
  lei_gratuidade: string;
  /** Lei de opções da cobrança por consulta; `valores.cobranca` é a parte paga. */
  lei_cobranca: string;
  /** Lei de opções da dedução do plano no imposto; `valores.parte` é o incentivo. */
  lei_deducao: string;
  /** Lei de opções da poupança de saúde; `valores.parte` é a parte da folha, `valores.informal` como no seguro. */
  lei_conta: string;
  /** Lei de opções das entidades; `valores.parte` é a gente que elas comportam. */
  lei_filantropia: string;
  /** Lei de opções da carreira; `valores.parte` é quem o plano não alcança, e `valores.eficiencia` soma à gestão. */
  lei_carreira: string;
  /** Lei de opções da gestão; traz `valores.eficiencia` e `valores.disputa`. */
  lei_gestao: string;
  /** Lei de opções das missões; `valores.parte` é quem vai para fora. */
  lei_missao: string;
  /** Lei de opções da vigilância; `valores.parte` é o alcance dela. */
  lei_ambiental: string;
  /** Pops com salário em folha: quem o seguro cobre. */
  pops_folha: string[];
  /** Pops que perdem emprego formal quando a folha encarece. */
  pops_encargo: string[];
  /** Pop para onde vai quem perde o emprego formal. */
  pop_informal: string;
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
  /** O mesmo, para quem vem do seguro: paga tabela, não luxo. */
  peso_seguro: number;
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
  /** Parte das pessoas no pop informal. */
  indice_informal: string;
  /** Verba por ano (fração do PIB) que paga 63% do `basico_teto`. */
  custo_basico: number;
  /** Pontos do índice de vida por ponto de gente na rede, por 100% de procura. */
  cuidado_cedo: number;
  /** Pontos do índice de desigualdade que cada ponto de gente na rede de graça tira, por 100% de procura. */
  renda_indireta: number;
  /** Parte da fila que o atendimento básico alcança, no máximo (0 a 1). */
  basico_teto: number;
  /** Índice que sobe quando quem paga é atendido e o resto fica na fila. */
  indice_desigualdade: string;
  /** Índice que sobe com as missões. */
  indice_reputacao: string;
  /** Índice que a vigilância ambiental freia. */
  indice_industria: string;
  /** Índice do ambiente: quanto pior, mais a vigilância rende. */
  indice_ambiente: string;
  /** Verba por ano (fração do PIB) que a cobrança traz, com todos pagando tudo. */
  receita_cobranca: number;
  /** Fração do PIB que o governo deixa de arrecadar, por plano e por dedução inteira. */
  custo_deducao: number;
  /** Fração do PIB em isenções, por pessoa nas entidades. */
  custo_filantropia: number;
  /** Pontos de desigualdade por ponto de gente nas entidades: atendem onde estão. */
  desigual_filantropia: number;
  /** Fração do PIB em salários, com todos os profissionais na carreira ou disputados. */
  custo_carreira: number;
  /** Fração do PIB que as missões trazem, com todos os profissionais fora. */
  receita_missao: number;
  /** Pontos do índice de reputação, com todos os profissionais fora. */
  reputacao_missao: number;
  /** Fração do PIB que a vigilância inteira custa. */
  custo_ambiental: number;
  /** Pontos do índice de vida, com a vigilância inteira e o ambiente em zero. */
  vida_ambiental: number;
  /** Pontos do índice de indústria que a vigilância inteira tira. */
  industria_ambiental: number;
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
  /** Parte da população com plano ou seguro (0 a 1). */
  planos: number;
  /** Quantos desses vêm do seguro (0 a 1). */
  seguro: number;
  /** Parte dos `pops_encargo` que o seguro já tirou do emprego formal (0 a 1). */
  encargo: number;
  /** Quanto a mais cada pessoa usa a rede pública, hoje (0,2 = 20%). */
  procura: number;
  /** Parte da população que se forma por turno, no ritmo do turno 0. */
  formacao: number;
  /** Instrução das turmas que se formam ÷ a do turno 0. */
  turmas: number;
  /** Índices contados no último turno. */
  indice: number;
  indice_profissionais: number;
  indice_informal: number;
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
  /** Parte da população nas entidades, hoje (0 a 1). */
  filantropia: number;
  /** Parte dos profissionais que o plano não alcança, hoje (0 a 1). */
  reserva: number;
  /** Quanto a mais o privado ocupa de cada profissional, hoje (0,2 = 20%). */
  disputa: number;
  /** Parte dos profissionais fora do país, hoje (0 a 1). */
  missao: number;
  /** Alcance da vigilância ambiental, hoje (0 a 1). */
  ambiental: number;
  /** Fração do PIB que a rede custa ao governo fora da verba (negativa: traz). */
  custo: number;
  /** Pontos que as missões somam ao índice de reputação. */
  reputacao: number;
  /** Pontos que a vigilância tira do índice de indústria. */
  industria: number;
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
  /** Parte da folha que o seguro cobre (0 a 1). */
  seguro: number;
  /** Parte dos `pops_encargo` que a folha cara tira do emprego formal (0 a 1). */
  informal: number;
  /** Quanto a mais cada pessoa usa a rede pública. */
  procura: number;
  /** Parte de quem tem plano que o larga pela rede de graça (0 a 1). */
  saida: number;
  /** Parte da consulta que quem usa paga (0 a 1). */
  cobranca: number;
  /** Parte de quem não compraria e compra, pela dedução (0 a 1). */
  deducao: number;
  /** Parte da folha que poupa para a saúde (0 a 1). */
  conta: number;
  /** Parte da população que as entidades comportam (0 a 1). */
  filantropia: number;
  /** Parte dos profissionais que o plano não alcança (0 a 1). */
  reserva: number;
  /** Quanto a mais a verba rende com gestão privada. */
  eficiencia: number;
  /** Quanto a mais o privado ocupa de cada profissional. */
  disputa: number;
  /** Parte dos profissionais fora do país (0 a 1). */
  missao: number;
  /** Alcance da vigilância ambiental (0 a 1). */
  ambiental: number;
}

export interface Rede {
  populacao: number;
  profissionais: number;
  vagas: number;
  planos: number;
  /** Parte de `planos` que vem do seguro. */
  seguro?: number;
  alcance?: number;
  cobertura?: number;
  fraco?: number;
  procura?: number;
  filantropia?: number;
  reserva?: number;
  disputa?: number;
  missao?: number;
  ambiental?: number;
  /** Índice do ambiente hoje (0 a 100). */
  ambiente?: number;
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
  /** Parte das pessoas com salário em folha (0 a 1). */
  na_folha: number;
  /** Profissionais do país, dentro e fora. */
  profissionais: number;
}

/** Parte da população que acaba com plano, com estas leis. */
export const planosAlvo = (
  regra: RegraDoAtendimento,
  leis: LeisDoAtendimento,
  comBolso: number,
) =>
  comBolso *
  (regra.plano_livre +
    (1 - (1 - leis.abertura) * (1 - leis.deducao)) * (1 - regra.plano_livre)) *
  (1 - leis.limite) *
  (1 - leis.saida);

/**
 * Parte da população que entra pelo seguro, sem contar quem já tem plano. O seguro
 * vem da folha, não do bolso: o limite aos planos não o toca. A poupança vem da
 * folha também, mas só cobre quem ganha o bastante para juntar.
 */
const seguroAlvo = (
  leis: LeisDoAtendimento,
  planos: number,
  naFolha: number,
  comBolso: number,
) => (1 - planos) * naFolha * (leis.seguro + leis.conta * comBolso);

/**
 * Quanto cada pessoa usa a rede. A cobrança pesa em quem não tem bolso: esse deixa
 * de ir; quem tem paga e continua.
 */
const procuraAlvo = (leis: LeisDoAtendimento, comBolso: number) =>
  leis.procura - leis.cobranca * (1 - comBolso);

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

/**
 * Vagas que as leis pagam: a verba, com o que a cobrança traz de quem pode pagar e
 * o que a gestão faz render, e as entidades, que não pedem verba.
 */
const vagasPagas = (
  regra: RegraDoAtendimento,
  populacao: number,
  leis: LeisDoAtendimento,
  comBolso: number,
  atraso: number,
) =>
  vagasDaVerba(
    regra,
    populacao,
    (leis.verba + regra.receita_cobranca * leis.cobranca * comBolso) *
      (1 + leis.eficiencia),
    atraso,
  ) +
  populacao * leis.filantropia;

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
 * com os profissionais; a rede pública atende com o que sobra, e quem a procura
 * mais ocupa mais. O atendimento básico alcança parte de quem sobrou, sem vaga e
 * sem profissional.
 */
function contaDaRede(
  regra: RegraDoAtendimento,
  {
    populacao,
    profissionais,
    vagas,
    planos,
    seguro = 0,
    alcance = 0,
    cobertura = 0,
    procura = 0,
    reserva = 0,
    disputa = 0,
    missao = 0,
  }: Rede,
) {
  const porProfissional = regra.pessoas_por_profissional;
  const clientes = populacao * planos;
  const presentes = profissionais * (1 - missao);
  const peso =
    (1 + disputa) *
    (planos > 0
      ? ((planos - seguro) * regra.peso_plano + seguro * regra.peso_seguro) /
        planos
      : regra.peso_plano);
  const noPlano = Math.min(
    presentes * (1 - reserva),
    (clientes * peso) / porProfissional,
  );
  const doPlano = (noPlano * porProfissional) / peso;
  const uso = 1 + procura;
  const semEsticar = ((presentes - noPlano) * porProfissional) / uso;
  const teto = Math.min(populacao - doPlano, vagas / uso);
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
  const { publico } = contaDaRede(regra, rede);
  const paradas = rede.vagas - publico * (1 + (rede.procura ?? 0));
  return (Math.max(0, paradas) / rede.populacao) * 100 * regra.desvio;
}

/**
 * Pontos que o índice de vida perde: gente atendida às pressas. Quem procura a
 * rede mais cedo devolve pontos.
 */
export function fraquezaDaRede(regra: RegraDoAtendimento, rede: Rede): number {
  const { esticado, publico } = contaDaRede(regra, rede);
  const pressa = esticado * (rede.fraco ?? 0);
  const cedo = publico * (rede.procura ?? 0) * regra.cuidado_cedo;
  const limpeza =
    (rede.ambiental ?? 0) *
    (1 - (rede.ambiente ?? 100) / 100) *
    regra.vida_ambiental;
  return ((pressa - cedo) / rede.populacao) * 100 - limpeza;
}

/**
 * Pontos do índice de desigualdade: a saúde de dois andares. Pesa quando há gente
 * com plano e gente na fila; sem fila, ou sem plano, não há dois andares. Quem usa
 * a rede sem pagar ganha como se fosse renda. As entidades atendem onde estão, não
 * onde falta.
 */
export function desigualdadeDaRede(
  regra: RegraDoAtendimento,
  rede: Rede,
): number {
  const fila = 1 - indiceDoAtendimento(regra, rede) / 100;
  const { publico } = contaDaRede(regra, rede);
  const deGraca = (publico / rede.populacao) * (rede.procura ?? 0);
  return (
    (rede.planos * fila * regra.desigualdade -
      deGraca * regra.renda_indireta +
      (rede.filantropia ?? 0) * regra.desigual_filantropia) *
    100
  );
}

/** Fração do PIB que a rede custa ao governo fora da verba; negativa, ela traz. */
function custoDaRede(
  regra: RegraDoAtendimento,
  s: Pick<
    AtendimentoNoEstado,
    | "planos"
    | "seguro"
    | "filantropia"
    | "reserva"
    | "disputa"
    | "missao"
    | "ambiental"
  >,
  deducao: number,
  cobertos: number,
) {
  return (
    (s.planos - s.seguro) * deducao * regra.custo_deducao +
    s.filantropia * regra.custo_filantropia +
    (s.reserva + s.disputa) * cobertos * regra.custo_carreira +
    s.ambiental * regra.custo_ambiental -
    s.missao * cobertos * regra.receita_missao
  );
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
    na_folha: number;
    /** Índice do emprego informal. */
    informal: number;
  },
): AtendimentoNoEstado {
  const { populacao, profissionais, leis } = pais;
  const { filantropia, reserva, disputa, missao, ambiental } = leis;
  const privados = planosAlvo(regra, leis, pais.com_bolso);
  const seguro = seguroAlvo(leis, privados, pais.na_folha, pais.com_bolso);
  const planos = privados + seguro;
  const soPlanos = indiceDoAtendimento(regra, {
    populacao,
    profissionais,
    vagas: 0,
    planos,
    seguro,
    reserva,
    disputa,
    missao,
  });
  const procura = procuraAlvo(leis, pais.com_bolso);
  const vagas =
    (Math.max(0, pais.atendimento - soPlanos) / 100) *
    populacao *
    (1 + procura);
  return {
    vagas,
    vagas_fora:
      vagas - vagasPagas(regra, populacao, leis, pais.com_bolso, pais.atraso),
    obras: [],
    planos,
    seguro,
    encargo: leis.informal,
    procura,
    formacao:
      ((profissionais / populacao) * regra.aposentadoria) / TURNOS_POR_ANO,
    turmas: 1,
    indice: pais.atendimento,
    indice_profissionais: indiceDosProfissionais(
      regra,
      profissionais * (1 - missao),
      populacao,
    ),
    indice_informal: pais.informal,
    desvio: 0,
    desigualdade: desigualdadeDaRede(regra, {
      populacao,
      profissionais,
      vagas,
      planos,
      seguro,
      procura,
      filantropia,
      reserva,
      disputa,
      missao,
    }),
    cobertura: 0,
    alcance: 0,
    fraqueza: 0,
    filantropia,
    reserva,
    disputa,
    missao,
    ambiental,
    custo: custoDaRede(
      regra,
      { planos, seguro, filantropia, reserva, disputa, missao, ambiental },
      leis.deducao,
      indiceDosProfissionais(regra, profissionais, populacao) / 100,
    ),
    reputacao: missao * regra.reputacao_missao,
    industria: ambiental * regra.industria_ambiental,
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
      vagasPagas(
        regra,
        turno.populacao,
        turno.leis,
        turno.com_bolso,
        turno.atraso,
      ),
  );
  if (vagas > alvo)
    vagas -= ((vagas - alvo) * regra.fechamento) / TURNOS_POR_ANO;
  const naFila = fila.reduce((soma, o) => soma + o.vagas, 0);
  const novas = alvo - vagas - naFila;
  if (novas > 1e-6) fila.push({ vagas: novas, falta: regra.prazo });
  const privados = planosAlvo(regra, turno.leis, turno.com_bolso);
  const seguro = seguroAlvo(
    turno.leis,
    privados,
    turno.na_folha,
    turno.com_bolso,
  );
  const planos = privados + seguro;
  const anda = (hoje: number, alvoDaLei: number) =>
    hoje + regra.velocidade * (alvoDaLei - hoje);
  const andados = {
    planos: anda(s.planos, planos),
    seguro: anda(s.seguro, seguro),
    filantropia: anda(s.filantropia, turno.leis.filantropia),
    reserva: anda(s.reserva, turno.leis.reserva),
    disputa: anda(s.disputa, turno.leis.disputa),
    missao: anda(s.missao, turno.leis.missao),
    ambiental: anda(s.ambiental, turno.leis.ambiental),
  };
  return {
    ...s,
    ...andados,
    vagas,
    obras: fila,
    custo: custoDaRede(
      regra,
      andados,
      turno.leis.deducao,
      indiceDosProfissionais(regra, turno.profissionais, turno.populacao) / 100,
    ),
    reputacao: andados.missao * regra.reputacao_missao,
    industria: andados.ambiental * regra.industria_ambiental,
    encargo: anda(s.encargo, turno.leis.informal),
    procura: anda(s.procura, procuraAlvo(turno.leis, turno.com_bolso)),
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
    na_folha: number;
    /** Índice do ambiente hoje (0 a 100). */
    ambiente: number;
  },
) {
  const { populacao, profissionais, atraso, com_bolso, na_folha, ambiente } =
    turno;
  const vagasCom = (leis: LeisDoAtendimento) =>
    Math.max(
      0,
      s.vagas_fora + vagasPagas(regra, populacao, leis, com_bolso, atraso),
    );
  const rede = (leis: LeisDoAtendimento) => {
    const privados = planosAlvo(regra, leis, com_bolso);
    const seguro = seguroAlvo(leis, privados, na_folha, com_bolso);
    return {
      populacao,
      profissionais,
      vagas: vagasCom(leis),
      planos: privados + seguro,
      seguro,
      alcance: leis.alcance,
      cobertura: coberturaAlvo(regra, leis.basica, atraso),
      fraco: leis.fraco,
      procura: procuraAlvo(leis, com_bolso),
      filantropia: leis.filantropia,
      reserva: leis.reserva,
      disputa: leis.disputa,
      missao: leis.missao,
      ambiental: leis.ambiental,
      ambiente,
    };
  };
  const redeAntes = rede(antes);
  const redeDepois = rede(depois);
  const hoje = indiceDoAtendimento(regra, redeAntes);
  const comMudanca = (mudanca: Partial<Rede>) =>
    indiceDoAtendimento(regra, { ...redeAntes, ...mudanca }) - hoje;
  const { vagas, planos, seguro, alcance, cobertura, procura } = redeDepois;
  const { reserva, disputa, missao } = redeDepois;
  const diferenca = (
    conta: (regra: RegraDoAtendimento, rede: Rede) => number,
  ) => conta(regra, redeDepois) - conta(regra, redeAntes);
  return {
    rede: comMudanca({ vagas }),
    planos: comMudanca({ planos, seguro, procura, reserva, disputa, missao }),
    cuidado: comMudanca({ alcance, cobertura }),
    desvio: diferenca(desvioDaRede),
    desigualdade: diferenca(desigualdadeDaRede),
    fraqueza: diferenca(fraquezaDaRede),
    reputacao: (depois.missao - antes.missao) * regra.reputacao_missao,
    industria: (depois.ambiental - antes.ambiental) * regra.industria_ambiental,
  };
}
