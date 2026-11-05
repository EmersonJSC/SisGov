// Prévia direta de uma lei na janela da tela: o que a própria lei muda nos
// índices (fila de efeitos do motor) e na satisfação dos grupos (pontos de
// lei do motor). Da cadeia, só o êxodo e o bolso; o resto é a prévia completa,
// depois.
import {
  apertoDaMoradia,
  apertoDoBolso,
  atrasoDasObras,
  enfileirar,
  comBolsoParaPlano,
  pessoasNaFolha,
  indiceDoSaneamento,
  leisDoAtendimento,
  leisDoSaneamento,
  pessoasNoCampo,
  pontosDaVerbaPorAno,
  pontosDoAtendimento,
  pontosDoExodo,
  pontosDoSaneamento,
  pontosLeis,
  rendaParaAConta,
  ritmoDasObras,
  TAXA_DERIVA,
  type ValorLei,
} from "../motor";
import type { Partida } from "./index";

export interface PreviaLei {
  /** Pontos (0–100) que a lei passa a dar a cada índice, contra hoje. */
  indices: {
    id: string;
    pontos: number;
    atrasoMeses: number;
    /** Pontos que se repetem a cada ano (ex.: casas construídas). */
    porAno?: boolean;
    /** O efeito chega devagar, depois do atraso (ex.: famílias mudando). */
    aosPoucos?: boolean;
  }[];
  /** Pontos de satisfação que a lei dá a cada grupo, contra hoje. */
  grupos: { id: string; pontos: number }[];
}

const MESES_POR_TURNO = 2;

function leiDe(partida: Partida, leiId: string) {
  const lei = partida.regras.leis[leiId];
  if (!lei) throw new Error(`lei "${leiId}" não existe`);
  return lei;
}

/**
 * Do nível da tela ao valor do motor: % da faixa (contínua, no passo da lei)
 * ou índice da opção.
 */
export function valorDoNivel(
  partida: Partida,
  leiId: string,
  nivel: number,
): ValorLei {
  const lei = leiDe(partida, leiId);
  if (lei.forma === "opcoes") {
    const opcao = lei.opcoes[Math.round(nivel)];
    if (!opcao) throw new Error(`${leiId}: opção ${nivel} não existe`);
    return opcao.id;
  }
  const escala = lei.unidade === "fracao" ? 100 : 1;
  const passos = Math.round((nivel / escala - lei.faixa.min) / lei.passo);
  const valor = lei.faixa.min + passos * lei.passo;
  return Number(
    Math.min(lei.faixa.max, Math.max(lei.faixa.min, valor)).toFixed(6),
  );
}

/** Meses até a obra ficar pronta, com a corrupção de hoje. */
export function mesesDaObra({ regras, estado }: Partida): number {
  const obras = regras.mercado?.mercado.obras;
  if (!obras) return 0;
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  return (
    Math.ceil(
      (obras.prazo * atrasoDasObras(atraso).prazo) /
        ritmoDasObras(regras, estado),
    ) * MESES_POR_TURNO
  );
}

/** Meses até a obra da rede ficar pronta, com a corrupção e o setor de hoje. */
export function mesesDaRede({ regras, estado }: Partida): number {
  const obras = regras.mercado?.mercado.obras;
  if (!obras || !regras.saneamento) return 0;
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  return (
    Math.ceil(
      (regras.saneamento.prazo * atrasoDasObras(atraso).prazo) /
        ritmoDasObras(regras, estado),
    ) * MESES_POR_TURNO
  );
}

/** Meses até a obra de hospital ficar pronta, com a corrupção e o setor de hoje. */
export function mesesDaSaude({ regras, estado }: Partida): number {
  const obras = regras.mercado?.mercado.obras;
  if (!obras || !regras.atendimento) return 0;
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  return (
    Math.ceil(
      (regras.atendimento.prazo * atrasoDasObras(atraso).prazo) /
        ritmoDasObras(regras, estado),
    ) * MESES_POR_TURNO
  );
}

/** O que a verba de casas faz por ano: age pelo estoque, não pela fila de efeitos. */
function previaDaMoradia(
  partida: Partida,
  leiId: string,
  valor: ValorLei,
): PreviaLei["indices"] {
  const { estado, regras } = partida;
  const regra = regras.moradia;
  const obras = regras.mercado?.mercado.obras;
  const m = estado.moradia;
  const atual = estado.leis[leiId] ?? 0;
  if (regra?.lei_verba !== leiId || !obras || !m) return [];
  if (typeof valor !== "number" || typeof atual !== "number") return [];
  const atraso = estado.jogabilidade[obras.indice_atraso] ?? 0;
  const pontos = -pontosDaVerbaPorAno(regra, valor - atual, atraso);
  if (Math.abs(pontos) < 1e-9) return [];
  const atrasoMeses = mesesDaObra(partida);
  return [
    { id: regra.indice_deficit, pontos, atrasoMeses, porAno: true },
    {
      id: regra.indice_favela,
      pontos: pontos * m.parte_precaria,
      atrasoMeses,
      porAno: true,
    },
  ];
}

/** O que as leis da rede fazem: agem pela contagem, e o resto vem pelas setas. */
function previaDoSaneamento(
  partida: Partida,
  leiId: string,
  valor: ValorLei,
): PreviaLei["indices"] {
  const { estado, regras } = partida;
  const regra = regras.saneamento;
  const s = estado.saneamento;
  if (!regra || !s) return [];
  const { lei_verba, lei_concessao, lei_teto, lei_tratamento } = regra;
  if (![lei_verba, lei_concessao, lei_teto, lei_tratamento].includes(leiId))
    return [];
  const { populacao } = estado.essenciais;
  const obras = regras.mercado?.mercado.obras;
  const antes = leisDoSaneamento(regras, regra, estado.leis);
  const depois = leisDoSaneamento(regras, regra, {
    ...estado.leis,
    [leiId]: valor,
  });
  const parte_ligada = indiceDoSaneamento(regra, s, populacao) / 100;
  const pontos = pontosDoSaneamento(regra, antes, depois, {
    atraso: obras ? (estado.jogabilidade[obras.indice_atraso] ?? 0) : 0,
    parte_ligada,
    parte_rede:
      s.ligadas > s.cortadas
        ? (parte_ligada * s.ligadas) / (s.ligadas - s.cortadas)
        : 0,
    ritmo_local: s.ritmo_local,
    populacao,
    aperto: apertoDoBolso(
      estado,
      rendaParaAConta(regra, depois),
      rendaParaAConta(regra, antes),
    ),
  });
  const atrasoMeses = mesesDaRede(partida);
  const linhas: PreviaLei["indices"] = [
    { id: regra.indice, pontos: pontos.indice, atrasoMeses, porAno: true },
    // Quem deixa de pagar é cortado, ou volta: depende da renda do país.
    {
      id: regra.indice,
      pontos: pontos.cortes,
      atrasoMeses: 0,
      aosPoucos: true,
    },
    // A deriva: cada ponto da rede empurra os outros índices, turno a turno.
    ...(regras.derivas ?? [])
      .filter(
        (d) => d.por === regra.indice && d.indice !== regra.indice_ambiente,
      )
      .map((d) => ({
        id: d.indice,
        pontos: d.sentido * TAXA_DERIVA[d.forca] * pontos.indice,
        atrasoMeses,
        aosPoucos: true,
      })),
    {
      id: regra.indice_vida,
      pontos: pontos.vida,
      atrasoMeses: 0,
      aosPoucos: true,
    },
    {
      id: regra.indice_ambiente,
      pontos:
        pontos.ambiente +
        (regras.derivas ?? [])
          .filter(
            (d) => d.por === regra.indice && d.indice === regra.indice_ambiente,
          )
          .reduce(
            (soma, d) =>
              soma + d.sentido * TAXA_DERIVA[d.forca] * pontos.indice,
            0,
          ),
      atrasoMeses,
      aosPoucos: true,
    },
  ];
  return linhas.filter((l) => Math.abs(l.pontos) > 1e-9);
}

/** O que as leis da saúde fazem: agem pela contagem, e o resto vem pelas setas. */
function previaDoAtendimento(
  partida: Partida,
  leiId: string,
  valor: ValorLei,
): PreviaLei["indices"] {
  const { estado, regras } = partida;
  const regra = regras.atendimento;
  const s = estado.atendimento;
  const pop = regra && estado.pops[regra.pop_profissionais];
  if (!regra || !s || !pop) return [];
  const { lei_verba, lei_abertura, lei_limite, lei_basica } = regra;
  const leis = [
    lei_verba,
    lei_abertura,
    lei_limite,
    lei_basica,
    regra.lei_seguro,
    regra.lei_gratuidade,
    regra.lei_cobranca,
    regra.lei_deducao,
    regra.lei_conta,
    regra.lei_filantropia,
    regra.lei_gestao,
    regra.lei_carreira,
    regra.lei_missao,
    regra.lei_ambiental,
    ...regra.leis_alcance,
  ];
  if (!leis.includes(leiId)) return [];
  const obras = regras.mercado?.mercado.obras;
  const antes = leisDoAtendimento(regras, regra, estado.leis);
  const depois = leisDoAtendimento(regras, regra, {
    ...estado.leis,
    [leiId]: valor,
  });
  const pontos = pontosDoAtendimento(regra, s, antes, depois, {
    populacao: estado.essenciais.populacao,
    profissionais: pop.pessoas,
    atraso: obras ? (estado.jogabilidade[obras.indice_atraso] ?? 0) : 0,
    com_bolso: comBolsoParaPlano(regra, estado),
    na_folha: pessoasNaFolha(regra, estado.pops, estado.essenciais.populacao),
    ambiente: estado.jogabilidade[regra.indice_ambiente],
  });
  const atrasoMeses = mesesDaSaude(partida);
  const linhas: PreviaLei["indices"] = [
    { id: regra.indice, pontos: pontos.rede, atrasoMeses },
    {
      id: regra.indice,
      pontos: pontos.planos,
      atrasoMeses: 0,
      aosPoucos: true,
    },
    {
      id: regra.indice,
      pontos: pontos.cuidado,
      atrasoMeses: 0,
      aosPoucos: true,
    },
    {
      id: regra.indice_vida,
      pontos: -pontos.fraqueza,
      atrasoMeses: 0,
      aosPoucos: true,
    },
    {
      id: regra.indice_profissionais,
      pontos: (antes.abandono - depois.abandono) * s.indice_profissionais,
      atrasoMeses: 0,
      porAno: true,
    },
    {
      id: regra.indice_profissionais,
      pontos: (antes.missao - depois.missao) * s.indice_profissionais,
      atrasoMeses: 0,
      aosPoucos: true,
    },
    {
      id: regra.indice_reputacao,
      pontos: pontos.reputacao,
      atrasoMeses: 0,
      aosPoucos: true,
    },
    {
      id: regra.indice_industria,
      pontos: -pontos.industria,
      atrasoMeses: 0,
      aosPoucos: true,
    },
    { id: regra.indice_desvio, pontos: pontos.desvio, atrasoMeses },
    {
      id: regra.indice_desigualdade,
      pontos: pontos.desigualdade,
      atrasoMeses: 0,
      aosPoucos: true,
    },
    {
      id: regra.indice_informal,
      pontos:
        (depois.informal - antes.informal) *
        regra.pops_encargo.reduce(
          (soma, id) => soma + regras.pais.pops[id].parcela_pessoas * 100,
          0,
        ),
      atrasoMeses: 0,
      aosPoucos: true,
    },
    // A deriva: cada ponto de atendimento empurra os outros índices.
    ...(regras.derivas ?? [])
      .filter((d) => d.por === regra.indice)
      .map((d) => ({
        id: d.indice,
        pontos:
          d.sentido *
          TAXA_DERIVA[d.forca] *
          (pontos.rede + pontos.planos + pontos.cuidado),
        atrasoMeses,
        aosPoucos: true,
      })),
  ];
  return linhas.filter((l) => Math.abs(l.pontos) > 1e-9);
}

/** O que a lei faz no déficit ao mudar a concentração de terra (êxodo). */
function previaDoCampo(
  { estado, regras }: Partida,
  indices: PreviaLei["indices"],
): PreviaLei["indices"] {
  const regra = regras.moradia;
  if (!regra) return [];
  const noCampo = pessoasNoCampo(regra, estado.pops);
  return indices
    .filter((e) => e.id === regra.indice_terra)
    .map((e) => ({
      id: regra.indice_deficit,
      pontos: pontosDoExodo(
        regra,
        e.pontos,
        noCampo,
        estado.essenciais.populacao,
      ),
      atrasoMeses: e.atrasoMeses,
      aosPoucos: true,
    }));
}

/** O que a lei faz na favela ao mudar o preço: depende de quem ainda paga. */
function previaDoBolso(
  { estado, regras }: Partida,
  indices: PreviaLei["indices"],
): PreviaLei["indices"] {
  const regra = regras.moradia;
  const m = estado.moradia;
  if (!regra || !m) return [];
  const preco = estado.jogabilidade[regra.indice_preco];
  const semCasa = estado.jogabilidade[regra.indice_deficit] / 100;
  return indices
    .filter((e) => e.id === regra.indice_preco)
    .map((e) => ({
      id: regra.indice_favela,
      pontos:
        (apertoDaMoradia(regra, estado, preco + e.pontos) -
          apertoDaMoradia(regra, estado, preco)) *
        (m.parte_precaria + semCasa) *
        100,
      atrasoMeses: e.atrasoMeses,
      aosPoucos: true,
    }))
    .filter((e) => Math.abs(e.pontos) > 1e-9);
}

export function previaDaLei(
  partida: Partida,
  leiId: string,
  valor: ValorLei,
): PreviaLei {
  const lei = leiDe(partida, leiId);
  const { estado, regras } = partida;
  const fila = enfileirar(estado.efeitos, lei, valor).filter(
    (e) => e.lei === leiId,
  );
  const indices = fila
    .map((e) => ({
      id: e.indice,
      pontos: e.para - e.de,
      atrasoMeses: e.atraso * MESES_POR_TURNO,
    }))
    .filter((e) => Math.abs(e.pontos) > 1e-9);
  indices.push(
    ...previaDaMoradia(partida, leiId, valor),
    ...previaDoSaneamento(partida, leiId, valor),
    ...previaDoAtendimento(partida, leiId, valor),
    ...previaDoCampo(partida, indices),
    ...previaDoBolso(partida, indices),
  );
  const so = { [leiId]: lei };
  const grupos = regras.grupos
    .map((g) => ({
      id: g.id,
      pontos: pontosLeis(
        g,
        so,
        { [leiId]: valor },
        { [leiId]: estado.leis[leiId] },
      ),
    }))
    .filter((g) => Math.abs(g.pontos) > 1e-9);
  return { indices, grupos };
}
