// Prévia direta de uma lei na janela da tela: o que a própria lei muda nos
// índices (fila de efeitos do motor) e na satisfação dos grupos (pontos de
// lei do motor). Sem efeito em cadeia: isso é a prévia completa, depois.
import {
  ajustesDoEstado,
  contaDoPais,
  enfileirar,
  interesseDosCompradores,
  moverFicha,
  PAPEIS,
  pontosLeis,
  votar,
  type Papel,
  type ValorLei,
} from "../motor";
import { avancar, type Partida, type Pedido } from "./index";

export interface PreviaLei {
  /** Pontos (0–100) que a lei passa a dar a cada índice, contra hoje. */
  indices: { id: string; pontos: number; atrasoMeses: number }[];
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

// --- Ficha do setor (fatia 8) -------------------------------------------
const TURNOS_DA_PREVIA = 6;

export interface PreviaFicha {
  /** Leis da ficha que de fato mudam; vazio = nada a propor. */
  mudancas: { lei: string; de: ValorLei | undefined; para: ValorLei }[];
  /** Custo líquido do cofre nos 6 turnos (% do PIB; negativo = entra dinheiro). */
  custo: number;
  /** Por produto do setor: preço, importação e falta, sem e com a mudança. */
  produtos: {
    id: string;
    nome: string;
    preco: [number, number];
    importa: [number, number];
    falta: [number, number];
  }[];
  /** PIB ao fim dos 6 turnos, variação % contra sem a mudança. */
  pib: number;
  /** Opinião média das potências ("investidores"), pontos contra sem a mudança. */
  investidores: number;
  /** Pontos de satisfação por grupo (soma das leis que mudam). */
  grupos: { id: string; pontos: number }[];
  /** Voto de cada lei que muda. */
  votos: { lei: string; sim: number; nao: number; aprovada: boolean }[];
  /** A venda trava por falta de comprador interessado. */
  semComprador: boolean;
}

const media = (v: number[]) =>
  v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0;

function rodar(partida: Partida, pedidos: Pedido[]) {
  const sem = { ...partida, regras: { ...partida.regras, congresso: undefined } };
  let p: Partida = sem;
  let custo = 0;
  for (let t = 0; t < TURNOS_DA_PREVIA; t++) {
    p = avancar(p, t === 0 ? pedidos : []);
    custo += p.estado.propriedade.gasto - p.estado.propriedade.receita;
  }
  return { p, custo };
}

function contaFinal(p: Partida) {
  const m = p.regras.mercado!;
  return contaDoPais(
    m.mercado,
    m.producao,
    m.cobertura,
    m.populacaoBase,
    p.estado.essenciais.populacao,
    p.estado.precos,
    ajustesDoEstado(p.regras, p.estado),
  );
}

/** O que a ficha muda em 6 turnos, com e sem as escolhas (papel → opção). */
export function previaDaFicha(
  partida: Partida,
  fichaId: string,
  escolhas: Partial<Record<Papel, string>>,
): PreviaFicha {
  const fichas = partida.regras.mercado?.fichas;
  const ficha = fichas?.fichas.find((f) => f.id === fichaId);
  if (!fichas || !ficha) throw new Error(`ficha "${fichaId}" não existe`);
  const { estado, regras } = partida;
  const mudancas = PAPEIS.flatMap((papel) => {
    const lei = ficha.leis[papel];
    const para = escolhas[papel];
    return para !== undefined && para !== estado.leis[lei]
      ? [{ lei, de: estado.leis[lei], para }]
      : [];
  });
  const pedidos: Pedido[] = mudancas.map((m) => ({
    tipo: "mudar_lei",
    lei: m.lei,
    valor: m.para,
  }));
  const sem = rodar(partida, []);
  const com = rodar(partida, pedidos);
  const a = contaFinal(sem.p);
  const b = contaFinal(com.p);
  const linha = (c: typeof a, id: string) => c.produtos[id] ?? c.outros[id];
  const produtos = ficha.produtos.flatMap((id) => {
    const x = linha(a, id);
    const y = linha(b, id);
    if (!x || !y) return [];
    const falta = (l: typeof x) => Math.max(0, 100 - l.cobertura);
    return [
      {
        id,
        nome:
          regras.mercado!.mercado.produtos.find((p) => p.id === id)?.nome ?? id,
        preco: [x.preco, y.preco] as [number, number],
        importa: [x.importa, y.importa] as [number, number],
        falta: [falta(x), falta(y)] as [number, number],
      },
    ];
  });
  const opinioes = (p: Partida) => media(Object.values(p.estado.opinioes));
  const vigentes = { ...estado.leis };
  mudancas.forEach((m) => (vigentes[m.lei] = m.para));
  const noEstado = estado.fichas[fichaId];
  const travou =
    !!noEstado &&
    moverFicha(
      fichas,
      ficha,
      noEstado,
      regras.leis,
      vigentes,
      interesseDosCompradores(estado.opinioes),
    ).semComprador;
  const somaGrupos: Record<string, number> = {};
  mudancas.forEach((m) =>
    previaDaLei(partida, m.lei, m.para).grupos.forEach((g) => {
      somaGrupos[g.id] = (somaGrupos[g.id] ?? 0) + g.pontos;
    }),
  );
  const votos = mudancas.flatMap((m) => {
    if (!regras.congresso) return [];
    const v = votar(
      regras.congresso,
      estado.coligacao,
      regras.grupos,
      regras.leis[m.lei]!,
      m.de,
      m.para,
    );
    return [{ lei: m.lei, sim: v.sim, nao: v.nao, aprovada: v.aprovada }];
  });
  return {
    mudancas,
    custo: com.custo - sem.custo,
    produtos,
    pib: (com.p.estado.essenciais.pib / sem.p.estado.essenciais.pib - 1) * 100,
    investidores: opinioes(com.p) - opinioes(sem.p),
    grupos: Object.entries(somaGrupos).map(([id, pontos]) => ({ id, pontos })),
    votos,
    semComprador: travou,
  };
}
