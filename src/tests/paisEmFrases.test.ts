/**
 * País em frases, parte 1 (28/out): o mapa mostra o país, não a conta.
 *
 * Os passos de conta do motor (o hiato da meta, o primário antes do corte, o
 * salário mínimo em vigor) saíram do mapa pela área "Dados internos", que já
 * era a convenção para isso. O motor continua calculando todos: o que mudou é
 * só quem o jogador vê.
 *
 * Marca `medida.tecnico` NÃO quer dizer "esconder": quer dizer "sem
 * estatística real". A aprovação do governo é técnica nesse sentido (é
 * construto do jogo, não número do IBGE) e continua sendo a bolha mais
 * importante da tela.
 */
import { describe, expect, it } from "vitest";
import { criarPartida, verPartida } from "../app/partida";

const criada = criarPartida({ ocorrencias: false });
if (!criada.ok) throw new Error(criada.erros.join(" "));
const partida = criada.value;
const visao = verPartida(partida);
const noMapa = new Set(visao.bolhas.map((b) => b.id));
const calculados = partida.game.execution.values;

/**
 * Encanamento de verdade: nenhum deles é origem de seta para bolha visível.
 * São três bandeiras tiradas de lei e uma contagem usada como escala.
 *
 * A lista começou com onze (28/out) e encolheu para quatro. Sete eram
 * explicação de bolha visível, e o teste `naoEsconderSeta` é quem mostrou —
 * não o meu julgamento sobre o que "parece conta".
 */
const ENCANAMENTO = [
  "beneficios_atrelados_ao_minimo",
  "existe_salario_minimo",
  "reajuste_segue_crescimento",
  "subordinacao_bc",
] as const;

/**
 * Construtos do jogo: não têm estatística real, mas são coisas do país.
 *
 * Os cinco últimos pareciam passo de conta e ficaram fora do mapa num
 * primeiro momento (28/out). Eram origem de seta para bolha visível, e a visão
 * descarta a ligação quando uma das pontas está fora: esconder o nó apagava a
 * explicação da causa, que é a premissa do jogo. Ver `naoEsconderSeta` abaixo.
 */
const COISAS_DO_PAIS = [
  "popularidade_governo",
  "base_congresso",
  "margem_manobra_governo",
  "capacidade_inteligencia",
  "tensao_internacional",
  "salario_minimo_efetivo",
  "reajuste_nominal_do_minimo",
  "juros_hiato",
  "carga_evento_demanda",
  // A regra fiscal explicada: o jogador põe a meta, o motor calcula o
  // primário sem corte, a diferença dispara o contingenciamento. Esconder
  // qualquer um deixa o congelamento de gasto sem explicação.
  "meta_primario",
  "primario_sem_corte",
  "hiato_da_meta",
] as const;

describe("país em frases — parte 1: o encanamento sai do mapa", () => {
  it("nenhum passo de conta tem bolha no mapa", () => {
    expect(ENCANAMENTO.filter((id) => noMapa.has(id))).toEqual([]);
  });

  it("o motor continua calculando cada passo de conta", () => {
    expect(ENCANAMENTO.filter((id) => calculados[id] === undefined)).toEqual(
      [],
    );
  });

  it("as coisas do país ficam no mapa, mesmo sem estatística real", () => {
    expect(COISAS_DO_PAIS.filter((id) => !noMapa.has(id))).toEqual([]);
  });

  it("a aprovação do governo continua na tela, com valor", () => {
    const aprovacao = visao.bolhas.find((b) => b.id === "popularidade_governo");
    expect(aprovacao).toBeDefined();
    expect(aprovacao!.valor).toBeGreaterThan(0);
  });

  it("toda bolha do mapa tem nome e área", () => {
    const semNome = visao.bolhas.filter((b) => !b.nome || !b.area);
    expect(semNome.map((b) => b.id)).toEqual([]);
  });

  /**
   * A regra que faltava na primeira tentativa: a visão descarta a ligação
   * quando origem ou alvo está fora do mapa, então esconder um nó esconde as
   * setas que passam por ele. Nó que explica uma bolha visível fica.
   */
  it("naoEsconderSeta: nó fora do mapa não explica bolha visível", () => {
    // Olha o conteúdo, não a visão: a visão já descartou as ligações, então
    // dela não se vê o que ficou faltando. A regra é da rede.
    const escondidas = new Set(
      partida.content.variables.variaveis
        .filter((v) => v.tipo !== "controle" && !noMapa.has(v.id))
        .map((v) => v.id),
    );
    const apagadas = partida.graph.relations
      .filter((r) => escondidas.has(r.originId) && noMapa.has(r.targetId))
      .map((r) => `${r.originId} → ${r.targetId}`);
    expect([...new Set(apagadas)]).toEqual([]);
  });

  it("a seta do salário mínimo para o desemprego continua visível", () => {
    const ligacao = visao.ligacoes.find(
      (l) => l.id === "salario-minimo--desemprego",
    );
    expect(ligacao).toBeDefined();
  });
});
