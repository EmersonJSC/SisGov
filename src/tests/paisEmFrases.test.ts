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

/** Passos de conta: o motor precisa, o jogador não tem o que fazer com eles. */
const ENCANAMENTO = [
  "hiato_da_meta",
  "meta_primario",
  "primario_sem_corte",
  "juros_hiato",
  "salario_minimo_efetivo",
  "reajuste_nominal_do_minimo",
  "beneficios_atrelados_ao_minimo",
  "carga_evento_demanda",
  "existe_salario_minimo",
  "reajuste_segue_crescimento",
  "subordinacao_bc",
] as const;

/** Construtos do jogo: não têm estatística real, mas são coisas do país. */
const COISAS_DO_PAIS = [
  "popularidade_governo",
  "base_congresso",
  "margem_manobra_governo",
  "capacidade_inteligencia",
  "tensao_internacional",
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
});
