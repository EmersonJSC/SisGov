/**
 * Tramitação (V1-12, docs/v1/desenho/tramitacao.md): mandar a lei ao
 * Congresso, a votação no fim do turno, a medida provisória e os pedidos das
 * bancadas. O Congresso não aparece: recebe a lei e devolve o resultado.
 */
import type { PolicyFile, ResolvedPackage } from "../../engine";
import type { GameState } from "../../game/createGame";
import {
  bussolaDoMundo,
  distancia,
  faixaDaLei,
  importancia,
  pontoAtual,
  vetorNoNivel,
  type PontoDaBussola,
} from "../../game/bussola";
import {
  JOGADOR,
  chanceDeSim,
  congressoDoPacote,
  danoDasLeis,
  retratoDoCongresso,
  satisfacaoDoPerfil,
  type CongressoDoPacote,
  type EstadoDoCongresso,
  type RetratoDaBancada,
} from "../../game/congresso";
import { pressureGroups } from "../../game/pressao";
import {
  applyRequirementFalls,
  policyInForce,
  requirementBlock,
  revokePolicyState,
} from "../../game/policyRequirements";
import { roll } from "../../game/randomState";
import {
  etapasDo,
  etapasPorTurno,
  nivelNoCongresso,
  ordemDaFila,
  quorum,
  tramitacaoVazia,
  votacoesNoTurno,
  votosSim,
  type EstadoDaTramitacao,
  type Pedido,
  type Pressa,
  type PrevisaoDoProjeto,
  type Projeto,
  type Saida,
  type TipoDePedido,
  type Votacao,
} from "../../game/tramitacao";
import type { Partida, Resultado } from "./tipos";
import { aplicarMeta } from "./leis";
import { serieSemMudanca, simularTrimestres } from "./previsao";

type RegraDeVotacao = Readonly<{
  quorum: "maioria-dos-votos" | "maioria-absoluta" | number;
  rodadas: number;
}>;

const erro = <T>(mensagem: string): Resultado<T> => ({
  ok: false,
  erros: [mensagem],
});

/** A fila do Congresso da partida (vazia se nada foi mandado). */
export function estadoDaTramitacao(game: GameState): EstadoDaTramitacao {
  return game.bills ?? tramitacaoVazia;
}

/** Quórum e rodadas do nível, como o país escreveu (`politica.json`). */
function regraDe(content: ResolvedPackage, tipo: Projeto["tipo"]) {
  const votacao = content.manifest.congresso?.votacao ?? {};
  const regra = votacao[tipo] as RegraDeVotacao | undefined;
  if (regra) return regra;
  return tipo === "emenda"
    ? { quorum: 0.6, rodadas: 2 }
    : { quorum: "maioria-dos-votos" as const, rodadas: 1 };
}

function areasSemMedidaProvisoria(content: ResolvedPackage): string[] {
  const votacao = content.manifest.congresso?.votacao ?? {};
  const mp = votacao.medidaProvisoria as
    Readonly<{ proibidaNasAreas?: readonly string[] }> | undefined;
  return [...(mp?.proibidaNasAreas ?? [])];
}

function pontoDoJogador(
  content: ResolvedPackage,
  game: GameState,
): PontoDaBussola {
  return game.compass
    ? pontoAtual(content, game.compass, game.policies)
    : { economia: 0, costumes: 0 };
}

const turnosPorAno = (pacote: CongressoDoPacote) =>
  pacote.regras.trocaTroca.turnosPorAno;

/** Soma pontos de humor às bancadas (todas, menos o partido do jogador). */
function comHumor(
  estado: EstadoDoCongresso,
  pacote: CongressoDoPacote,
  pontos: (bancada: string) => number,
): EstadoDoCongresso {
  const humor: Record<string, number> = { ...estado.humor };
  for (const b of pacote.bancadas) {
    const p = pontos(b.id);
    if (p !== 0) humor[b.id] = (humor[b.id] ?? 0) + p;
  }
  return { ...estado, humor };
}

/**
 * O que a lei faria no horizonte da previsão (com − sem): humor dos
 * segmentos, opinião pública, bússola e dano a cada grupo de pressão.
 */
function prever(
  partida: Partida,
  depois: Partida,
  pacote: CongressoDoPacote,
): Resultado<PrevisaoDoProjeto> {
  const { content } = partida;
  const horizonte = pacote.regras.tramitacao.turnosDaPrevisao;
  const base = serieSemMudanca(partida, horizonte);
  if (!base.ok) return base;
  const alt = simularTrimestres(depois, horizonte);
  if (!alt.ok) return alt;
  const n = Math.min(base.value.valores.length, alt.value.valores.length);
  const sem = base.value.valores[n - 1];
  const com = alt.value.valores[n - 1];
  const segmentos = Object.fromEntries(
    Object.keys(pacote.pesoDoSegmento).map((s) => [
      s,
      (com[s] ?? 50) - (sem[s] ?? 50),
    ]),
  );
  let soma = 0;
  let pesos = 0;
  for (const perfil of pacote.perfis) {
    soma +=
      perfil.peso *
      (satisfacaoDoPerfil(perfil, pacote.pesoDoSegmento, com) -
        satisfacaoDoPerfil(perfil, pacote.pesoDoSegmento, sem));
    pesos += perfil.peso;
  }
  const leis = new Set(content.policies.map((p) => p.controle.variavel));
  const dano = Object.fromEntries(
    (pressureGroups(content)?.grupos ?? []).map((g) => [
      g.id,
      danoDasLeis(g.causas, leis, com) - danoDasLeis(g.causas, leis, sem),
    ]),
  );
  return {
    ok: true,
    value: {
      segmentos,
      opiniao: pesos > 0 ? soma / pesos : 0,
      antes: pontoDoJogador(content, partida.game),
      depois: pontoDoJogador(content, depois.game),
      dano,
    },
  };
}

/** Chance de cada cadeira de cada bancada votar sim no projeto (camada 2). */
export function chancesDoProjeto(
  pacote: CongressoDoPacote,
  retrato: readonly RetratoDaBancada[],
  previsao: PrevisaoDoProjeto,
): Readonly<Record<string, number>> {
  const v = pacote.regras.voto;
  return Object.fromEntries(
    retrato.map((b) => {
      if (b.id === JOGADOR) return [b.id, v.disciplinaDoJogador];
      let parte = 0;
      let efeito = 0;
      for (const [s, w] of Object.entries(b.eleitor)) {
        parte += w;
        efeito += w * (previsao.segmentos[s] ?? 0);
      }
      const frentes = pacote.regras.frentes.reduce((total, f) => {
        const ajuda =
          f.grupos.reduce((t, g) => t - (previsao.dano[g] ?? 0), 0) /
          Math.max(1, f.grupos.length);
        return total + (b.frentes[f.id] ?? 0) * ajuda;
      }, 0);
      return [
        b.id,
        chanceDeSim(pacote.regras, {
          segmentos: parte > 0 ? efeito / parte / v.escalaDosSegmentos : 0,
          bussola:
            (distancia(previsao.antes, b.ponto) -
              distancia(previsao.depois, b.ponto)) /
            v.escalaDaBussola,
          disposicao: (b.disposicao - 50) / 50,
          frentes: frentes * v.escalaDasFrentes,
        }),
      ];
    }),
  );
}

export type OpcoesDoEnvio = Readonly<{
  pressa?: Pressa;
  /** Vale já; se cair ou caducar, a lei volta ao que era (art. 62). */
  medidaProvisoria?: boolean;
}>;

/**
 * Manda a lei ao Congresso: entra na fila com a previsão. Medida provisória
 * já vale; urgência, modo emergência e medida provisória irritam as bancadas.
 */
export function enviarAoCongresso(
  partida: Partida,
  leiId: string,
  nivel: number,
  opcoes: OpcoesDoEnvio = {},
): Resultado<Partida> {
  const { content, game } = partida;
  const pacote = congressoDoPacote(content);
  if (!pacote || !game.congress) return erro("Este país não tem Congresso.");
  const policy = content.policies.find((p) => p.id === leiId);
  if (!policy) return erro(`A lei ${leiId} não existe.`);
  const tipo = nivelNoCongresso(policy);
  if (tipo === "petrea")
    return erro("Cláusula pétrea não muda por votação (art. 60, § 4º).");
  if (tipo === "decreto")
    return erro("Esta lei não precisa do Congresso: ela muda por decreto.");
  const estado = estadoDaTramitacao(game);
  if (estado.fila.some((p) => p.lei === leiId))
    return erro("Esta lei já está na fila do Congresso.");
  const atual = policyInForce(game.policies, leiId);
  if (atual && Math.abs(atual.desiredLevel - nivel) < 1e-9)
    return erro("Esta lei já vale nessa opção.");
  const livre = estado.bloqueadas[leiId];
  if (livre !== undefined && game.currentTurn < livre)
    return erro("Emenda rejeitada só volta no ano seguinte (art. 60, § 5º).");
  const { tramitacao } = pacote.regras;
  const pressa = opcoes.pressa ?? "normal";
  if (pressa === "urgencia" && tipo === "emenda")
    return erro("Emenda não tem urgência; use o modo emergência.");
  const ano = String(Math.floor(game.currentTurn / turnosPorAno(pacote)));
  if (
    pressa === "emergencia" &&
    (estado.emergencias[ano] ?? 0) >= tramitacao.emergenciasPorAno
  )
    return erro(
      `O modo emergência só pode ser usado ${tramitacao.emergenciasPorAno} vezes por ano.`,
    );
  const mp = opcoes.medidaProvisoria === true;
  if (mp && tipo !== "lei-ordinaria")
    return erro("Medida provisória só serve para o que seria lei ordinária.");
  if (
    mp &&
    policy.area &&
    areasSemMedidaProvisoria(content).includes(policy.area)
  )
    return erro(
      "Medida provisória não trata de direito penal, eleições, direitos políticos e nacionalidade (art. 62, § 1º).",
    );
  // medida provisória da lei que o Congresso acabou de derrubar: vale no
  // jogo (na Constituição, não na mesma sessão, art. 62, § 10), mas irrita mais
  const derrotadaNoAno = estado.saidas.some(
    (s) =>
      s.lei === leiId &&
      s.motivo === "caiu" &&
      Math.floor(s.turno / turnosPorAno(pacote)) === Number(ano),
  );
  // valida a lei (filhas, pétrea) e dá o país com a mudança, para prever
  const depois = aplicarMeta(partida, leiId, nivel);
  if (!depois.ok) return depois;
  const previsao = prever(partida, depois.value, pacote);
  if (!previsao.ok) return previsao;
  const projeto: Projeto = {
    id: `projeto-${estado.proximoId}`,
    lei: leiId,
    nivel,
    tipo,
    pressa,
    enviadoNoTurno: game.currentTurn,
    etapas: etapasDo(
      tipo,
      pacote.casas.map((c) => c.id),
      regraDe(content, tipo).rodadas,
    ),
    previsao: previsao.value,
    ...(mp
      ? {
          medidaProvisoria: {
            emVigor: atual !== undefined,
            nivel: atual?.desiredLevel ?? 0,
          },
        }
      : {}),
  };
  const custo =
    (pressa === "urgencia"
      ? tramitacao.humor.urgencia
      : pressa === "emergencia"
        ? tramitacao.humor.emergencia
        : 0) +
    (!mp
      ? 0
      : derrotadaNoAno
        ? tramitacao.humor.medidaProvisoriaDepoisDaDerrota
        : tramitacao.humor.medidaProvisoria);
  // a medida provisória já vale: segue do país com a mudança
  const base = mp ? depois.value.game : game;
  const congress = custo
    ? comHumor(base.congress!, pacote, () => custo)
    : base.congress!;
  const bills: EstadoDaTramitacao = {
    ...estado,
    fila: [...estado.fila, projeto],
    emergencias:
      pressa === "emergencia"
        ? { ...estado.emergencias, [ano]: (estado.emergencias[ano] ?? 0) + 1 }
        : estado.emergencias,
    proximoId: estado.proximoId + 1,
  };
  return {
    ok: true,
    value: {
      ...partida,
      game: { ...base, congress, bills },
      acoes: partida.acoes + 1,
    },
  };
}

/** Medida provisória que caiu ou caducou: a lei volta ao que era. */
function desfazerMedida(partida: Partida, projeto: Projeto): Partida {
  const mp = projeto.medidaProvisoria;
  if (!mp) return partida;
  if (mp.emVigor) {
    const volta = aplicarMeta(partida, projeto.lei, mp.nivel);
    return volta.ok ? { ...volta.value, acoes: partida.acoes } : partida;
  }
  const { content, game } = partida;
  const index = game.policies.findIndex(
    (s) => s.policyDefinitionId === projeto.lei,
  );
  if (index < 0) return partida;
  const revogada = revokePolicyState(
    content,
    game.policies[index],
    game.currentTurn,
  );
  if (!revogada) return partida;
  const mudadas = [...game.policies];
  mudadas[index] = revogada;
  const { policies } = applyRequirementFalls(
    content,
    mudadas,
    game.currentTurn,
  );
  return { ...partida, game: { ...game, policies } };
}

/**
 * A lei que a bancada pede em troca do apoio: a lei ordinária (fora da fila)
 * cuja opção mais aproxima o país do ponto da bancada na bússola.
 */
function leiDaBancada(
  content: ResolvedPackage,
  game: GameState,
  bancada: PontoDaBussola,
): Readonly<{ lei: string; nivel: number }> | undefined {
  const ponto = pontoDoJogador(content, game);
  const rumo = [
    bancada.economia - ponto.economia,
    bancada.costumes - ponto.costumes,
  ];
  const naFila = new Set(estadoDaTramitacao(game).fila.map((p) => p.lei));
  let melhor: { lei: string; nivel: number; ganho: number } | undefined;
  for (const policy of content.policies) {
    if (nivelNoCongresso(policy) !== "lei-ordinaria" || naFila.has(policy.id))
      continue;
    const dados = bussolaDoMundo.leis[policy.id];
    if (!dados) continue;
    const faixa = faixaDaLei(content, policy.id);
    const opcoes = policy.controle.opcoes;
    const niveis = opcoes?.length
      ? opcoes.map((o) => o.valor)
      : faixa
        ? [faixa.minimo, faixa.maximo]
        : [];
    const estado = policyInForce(game.policies, policy.id);
    const agora = estado
      ? vetorNoNivel(dados, opcoes, estado.desiredLevel, faixa)
      : (dados.foraDeVigor ?? [0, 0]);
    const peso = importancia(bussolaDoMundo, policy.processoAutorizacao);
    for (const nivel of niveis) {
      if (estado && Math.abs(estado.desiredLevel - nivel) < 1e-9) continue;
      const v = vetorNoNivel(dados, opcoes, nivel, faixa);
      const ganho =
        peso * ((v[0] - agora[0]) * rumo[0] + (v[1] - agora[1]) * rumo[1]);
      if (ganho <= (melhor?.ganho ?? 0)) continue;
      if (requirementBlock(content, game.policies, policy.id, nivel)) continue;
      melhor = { lei: policy.id, nivel, ganho };
    }
  }
  return melhor && { lei: melhor.lei, nivel: melhor.nivel };
}

export type ResultadoDoCongresso = Readonly<{
  votacoes: readonly Votacao[];
  pedidos: readonly Pedido[];
  saidas: readonly Saida[];
}>;

/** Votações por casa no turno, pelo apoio (popularidade + disposição). */
function capacidades(
  pacote: CongressoDoPacote,
  retrato: readonly RetratoDaBancada[],
  popularidade: number,
): Record<string, number> {
  const { maximoPorCasa, apoioMinimo } = pacote.regras.tramitacao.fila;
  return Object.fromEntries(
    pacote.casas.map((casa) => {
      let cadeiras = 0;
      let soma = 0;
      for (const b of retrato) {
        const n = b.cadeiras[casa.id] ?? 0;
        cadeiras += n;
        soma += n * b.disposicao;
      }
      const disposicao = cadeiras > 0 ? soma / cadeiras : 50;
      return [
        casa.id,
        votacoesNoTurno(
          (popularidade + disposicao) / 2,
          maximoPorCasa,
          apoioMinimo,
        ),
      ];
    }),
  );
}

/**
 * Fim do turno: o Congresso vota a fila, na ordem e na quantidade que o
 * apoio permite. A bancada decisiva pode pedir algo antes de votar; a medida
 * provisória que não passa no prazo caduca.
 */
export function votarNoCongresso(
  partida: Partida,
): Readonly<{ partida: Partida; resultado: ResultadoDoCongresso }> {
  const vazio = { votacoes: [], pedidos: [], saidas: [] };
  const { content } = partida;
  const pacote = congressoDoPacote(content);
  const inicio = partida.game;
  const estado = estadoDaTramitacao(inicio);
  if (!pacote || !inicio.congress || estado.fila.length === 0)
    return { partida, resultado: vazio };
  const { tramitacao } = pacote.regras;
  const turno = inicio.currentTurn;
  const seed = inicio.random?.seed ?? 1;
  const retrato = retratoDoCongresso({
    content,
    estado: inicio.congress,
    valores: inicio.execution.values,
    pontoDoJogador: pontoDoJogador(content, inicio),
  });
  const capacidade = capacidades(
    pacote,
    retrato,
    inicio.execution.values.popularidade_governo ?? 50,
  );
  const cadeirasDa = (casa: string) =>
    pacote.casas.find((c) => c.id === casa)?.cadeiras ?? 0;
  const votacoes: Votacao[] = [];
  const pedidos: Pedido[] = [];
  const saidas: Saida[] = [];
  const bloqueadas: Record<string, number> = { ...estado.bloqueadas };
  let proximoId = estado.proximoId;
  // uma bancada só tem um pedido aberto por vez
  const pedindo = new Set(estado.pedidos.map((p) => p.bancada));
  let atual = partida;
  const fila = new Map(estado.fila.map((p) => [p.id, p]));
  const ordem = ordemDaFila(
    estado.fila.filter((p) => !p.aguardando),
    turno,
    {
      urgencia: tramitacao.fila.prioridadeDaUrgencia,
      emergencia: tramitacao.fila.prioridadeDaEmergencia,
    },
    tramitacao.prazoDaMedidaProvisoria,
  );
  for (const inicial of ordem) {
    let p = inicial;
    let passos = etapasPorTurno(p.tipo, p.pressa);
    const chances = chancesDoProjeto(pacote, retrato, p.previsao);
    const regra = regraDe(content, p.tipo);
    let fim: Saida["motivo"] | undefined;
    while (passos > 0 && p.etapas.length > 0) {
      const { casa, rodada } = p.etapas[0];
      if ((capacidade[casa] ?? 0) <= 0) break;
      const total = cadeirasDa(casa);
      const q = quorum(regra.quorum, total);
      const esperado = retrato.reduce(
        (s, b) => s + (chances[b.id] ?? 0) * (b.cadeiras[casa] ?? 0),
        0,
      );
      // a bancada decisiva, quase meio a meio, pede algo antes de votar
      if (!p.pediu && esperado < q) {
        const { chanceMinima, chanceMaxima } = tramitacao.pedidos;
        const decisiva = retrato
          .filter((b) => {
            const c = chances[b.id] ?? 0;
            const n = b.cadeiras[casa] ?? 0;
            return (
              b.id !== JOGADOR &&
              !pedindo.has(b.id) &&
              c >= chanceMinima &&
              c <= chanceMaxima &&
              esperado + n * (0.95 - c) >= q
            );
          })
          .sort((a, b) => (b.cadeiras[casa] ?? 0) - (a.cadeiras[casa] ?? 0))[0];
        if (decisiva) {
          const id = `pedido-${proximoId++}`;
          const grande = (decisiva.cadeiras[casa] ?? 0) >= 0.15 * total;
          let tipo: TipoDePedido = grande
            ? "ministerio"
            : roll(seed, turno, id) < 0.5
              ? "verba"
              : "apoio";
          const desejo =
            tipo === "apoio"
              ? leiDaBancada(content, atual.game, decisiva.ponto)
              : undefined;
          if (tipo === "apoio" && !desejo) tipo = "verba";
          pedidos.push({
            id,
            projeto: p.id,
            bancada: decisiva.id,
            tipo,
            turno,
            ...(desejo ?? {}),
          });
          pedindo.add(decisiva.id);
          p = { ...p, aguardando: id, pediu: true };
          break;
        }
      }
      capacidade[casa] -= 1;
      const porBancada: Record<string, { sim: number; cadeiras: number }> = {};
      let sim = 0;
      for (const b of retrato) {
        const n = b.cadeiras[casa] ?? 0;
        if (n === 0) continue;
        const s = votosSim(
          chances[b.id] ?? 0,
          n,
          seed,
          turno,
          `${p.id}:${casa}:${rodada}:${b.id}`,
        );
        porBancada[b.id] = { sim: s, cadeiras: n };
        sim += s;
      }
      const placar = {
        turno,
        projeto: p.id,
        lei: p.lei,
        casa,
        rodada,
        sim,
        nao: total - sim,
        quorum: q,
        porBancada,
      };
      if (sim >= q) {
        p = { ...p, etapas: p.etapas.slice(1), adiou: false };
        passos -= 1;
        const passou = p.etapas.length === 0;
        votacoes.push({ ...placar, resultado: passou ? "passou" : "avancou" });
        if (passou) fim = "passou";
      } else if (!p.adiou && sim >= q * (1 - tramitacao.adiaSeFaltarAte)) {
        votacoes.push({ ...placar, resultado: "adiou" });
        p = { ...p, adiou: true };
        break;
      } else {
        votacoes.push({ ...placar, resultado: "caiu" });
        fim = "caiu";
        break;
      }
    }
    if (fim === "passou" && !p.medidaProvisoria) {
      const aplicada = aplicarMeta(atual, p.lei, p.nivel);
      if (aplicada.ok) atual = { ...aplicada.value, acoes: atual.acoes };
      else fim = "caiu";
    }
    if (fim === "caiu") {
      if (p.tipo === "emenda")
        bloqueadas[p.lei] =
          (Math.floor(turno / turnosPorAno(pacote)) + 1) * turnosPorAno(pacote);
      atual = desfazerMedida(atual, p);
    }
    if (fim) {
      fila.delete(p.id);
      saidas.push({ turno, projeto: p.id, lei: p.lei, motivo: fim });
    } else fila.set(p.id, p);
  }
  // medida provisória fora do prazo caduca (art. 62, § 3º)
  for (const p of [...fila.values()])
    if (
      p.medidaProvisoria &&
      turno - p.enviadoNoTurno >= tramitacao.prazoDaMedidaProvisoria
    ) {
      atual = desfazerMedida(atual, p);
      fila.delete(p.id);
      saidas.push({ turno, projeto: p.id, lei: p.lei, motivo: "caducou" });
    }
  const bills: EstadoDaTramitacao = {
    ...estado,
    fila: [...fila.values()],
    votacoes: [...estado.votacoes, ...votacoes],
    pedidos: [...estado.pedidos, ...pedidos],
    saidas: [...estado.saidas, ...saidas],
    bloqueadas,
    proximoId,
  };
  return {
    partida: { ...atual, game: { ...atual.game, bills } },
    resultado: { votacoes, pedidos, saidas },
  };
}

/**
 * Responde o pedido de uma bancada. Aceitar sobe a disposição dela (e muda o
 * voto dela no projeto); recusar desce um pouco. Ministério deixa as outras
 * com ciúme; a verba sai do cofre (o que faltar vira dívida); o apoio põe a
 * lei da bancada na sua fila.
 */
export function responderPedido(
  partida: Partida,
  pedidoId: string,
  aceitar: boolean,
): Resultado<Partida> {
  const { content, game } = partida;
  const pacote = congressoDoPacote(content);
  const estado = estadoDaTramitacao(game);
  const pedido = estado.pedidos.find((p) => p.id === pedidoId);
  if (!pacote || !game.congress || !pedido)
    return erro("Esse pedido não existe ou já foi respondido.");
  const regras = pacote.regras.tramitacao.pedidos;
  const pontos = aceitar ? regras[pedido.tipo] : regras.recusa;
  const congress = comHumor(game.congress, pacote, (id) =>
    id === pedido.bancada
      ? pontos
      : aceitar && pedido.tipo === "ministerio"
        ? regras.ciume
        : 0,
  );
  let execution = game.execution;
  if (aceitar && pedido.tipo === "verba") {
    const values = { ...execution.values };
    const cofre = Math.max(0, values.cofre ?? 0);
    const paga = Math.min(cofre, regras.verbaEmPctDoPib);
    values.cofre = cofre - paga;
    values.divida_publica =
      (values.divida_publica ?? 0) + (regras.verbaEmPctDoPib - paga);
    execution = { ...execution, values };
  }
  const bills: EstadoDaTramitacao = {
    ...estado,
    pedidos: estado.pedidos.filter((p) => p.id !== pedidoId),
    fila: estado.fila.map((p) =>
      p.aguardando === pedidoId ? { ...p, aguardando: undefined } : p,
    ),
    acordos: [
      ...estado.acordos,
      {
        turno: game.currentTurn,
        bancada: pedido.bancada,
        tipo: pedido.tipo,
        aceito: aceitar,
      },
    ],
  };
  let resposta: Partida = {
    ...partida,
    game: { ...game, congress, execution, bills },
    acoes: partida.acoes + 1,
  };
  if (aceitar && pedido.tipo === "apoio" && pedido.lei !== undefined) {
    const enviada = enviarAoCongresso(resposta, pedido.lei, pedido.nivel ?? 0);
    if (enviada.ok) resposta = enviada.value;
  }
  return { ok: true, value: resposta };
}

export type VisaoDoProjeto = Readonly<{
  id: string;
  lei: string;
  nome: string;
  tipo: Projeto["tipo"];
  pressa: Pressa;
  medidaProvisoria: boolean;
  /** Opinião pública prevista (pontos de humor do eleitorado todo). */
  opiniao: number;
  /** Votações que faltam, com os votos esperados contra o quórum. */
  etapas: readonly Readonly<{
    casa: string;
    rodada: number;
    esperado: number;
    quorum: number;
  }>[];
  aguardando?: string;
}>;

export type VisaoDaTramitacao = Readonly<{
  /** Votações que o Congresso aceita fazer por casa no próximo turno. */
  capacidade: Readonly<Record<string, number>>;
  fila: readonly VisaoDoProjeto[];
  pedidos: readonly Readonly<{
    id: string;
    bancada: string;
    nomeDaBancada: string;
    tipo: TipoDePedido;
    /** A lei que espera a resposta. */
    projeto: string;
    /** No pedido de apoio: a lei que a bancada quer. */
    lei?: string;
  }>[];
  /** Votações do último turno. */
  votacoes: readonly Votacao[];
  saidas: readonly Saida[];
}>;

/** O que o tablet mostra da fila: previsão, pedidos e últimos resultados. */
export function verTramitacao(partida: Partida): VisaoDaTramitacao {
  const { content, game } = partida;
  const estado = estadoDaTramitacao(game);
  const pacote = congressoDoPacote(content);
  const vazia = {
    capacidade: {},
    fila: [],
    pedidos: [],
    votacoes: [],
    saidas: [],
  };
  if (!pacote || !game.congress) return vazia;
  const retrato = retratoDoCongresso({
    content,
    estado: game.congress,
    valores: game.execution.values,
    pontoDoJogador: pontoDoJogador(content, game),
  });
  const nomeDa = (id: string) =>
    content.policies.find((p: PolicyFile) => p.id === id)?.nome ?? id;
  const ultimo = estado.votacoes.at(-1)?.turno;
  return {
    capacidade: capacidades(
      pacote,
      retrato,
      game.execution.values.popularidade_governo ?? 50,
    ),
    fila: estado.fila.map((p) => {
      const chances = chancesDoProjeto(pacote, retrato, p.previsao);
      const regra = regraDe(content, p.tipo);
      return {
        id: p.id,
        lei: p.lei,
        nome: nomeDa(p.lei),
        tipo: p.tipo,
        pressa: p.pressa,
        medidaProvisoria: p.medidaProvisoria !== undefined,
        opiniao: p.previsao.opiniao,
        etapas: p.etapas.map(({ casa, rodada }) => ({
          casa,
          rodada,
          esperado: retrato.reduce(
            (s, b) => s + (chances[b.id] ?? 0) * (b.cadeiras[casa] ?? 0),
            0,
          ),
          quorum: quorum(
            regra.quorum,
            pacote.casas.find((c) => c.id === casa)?.cadeiras ?? 0,
          ),
        })),
        ...(p.aguardando ? { aguardando: p.aguardando } : {}),
      };
    }),
    pedidos: estado.pedidos.map((p) => ({
      id: p.id,
      bancada: p.bancada,
      nomeDaBancada: retrato.find((b) => b.id === p.bancada)?.nome ?? p.bancada,
      tipo: p.tipo,
      projeto: nomeDa(estado.fila.find((f) => f.id === p.projeto)?.lei ?? ""),
      ...(p.lei ? { lei: nomeDa(p.lei) } : {}),
    })),
    votacoes: estado.votacoes.filter((v) => v.turno === ultimo),
    saidas: estado.saidas.filter((s) => s.turno === ultimo),
  };
}
