/**
 * O bolso do perfil (População, camada B).
 *
 * O agregado manda e o perfil divide: o motor calcula a massa salarial como
 * sempre, e uma tabela de conteúdo reparte entre os 2.090 perfis por ocupação
 * e faixa de renda. O teste prende o que não pode mudar — que a repartição
 * não cria nem some dinheiro — e não os números, que ainda vão ser calibrados.
 */
import { describe, expect, it } from "vitest";
import type { ResolvedPackage } from "../engine";
import {
  bolsosDosPerfis,
  quemPagouAConta,
  rendasDosPerfis,
} from "../app/partida/bolso";
import { criarPartida } from "../app/partida";

let guardada: ReturnType<typeof criarPartida> | undefined;
function pacote(): ResolvedPackage {
  guardada ??= criarPartida({ ocorrencias: false, eleicao: false });
  if (!guardada.ok) throw new Error(guardada.erros.join(" "));
  return guardada.value.content;
}

/** O mesmo pacote com o congresso trocado, para testar conteúdo faltando. */
function comCongresso(
  mudar: (c: Record<string, unknown>) => Record<string, unknown>,
): ResolvedPackage {
  const p = pacote();
  const congresso = mudar({
    ...(p.manifest.congresso as unknown as Record<string, unknown>),
  });
  return {
    ...p,
    manifest: { ...p.manifest, congresso },
  } as unknown as ResolvedPackage;
}

const SALARIO = 40000;

/** Índice do atributo no perfil (a coluna 0 é o peso). */
function coluna(atributo: string): number {
  const atributos = pacote().manifest.congresso!.atributos;
  return atributos.indexOf(atributo) + 1;
}

/** A renda do primeiro perfil que tem esse valor de atributo. */
function rendaDe(atributo: string, valor: string, salario = SALARIO): number {
  const c = pacote().manifest.congresso!;
  const i = c.perfis.findIndex(
    (p) => c.valores[atributo]?.[p[coluna(atributo)]] === valor,
  );
  if (i < 0) throw new Error(`nenhum perfil com ${atributo}=${valor}`);
  return rendasDosPerfis(pacote(), salario)[i].porAno;
}

/** Média ponderada da renda entre quem ganha alguma coisa do trabalho. */
function mediaDeQuemTrabalha(
  content: ResolvedPackage,
  salario: number,
): number {
  const rendas = rendasDosPerfis(content, salario);
  const perfis = content.manifest.congresso!.perfis;
  let soma = 0;
  let pesos = 0;
  for (const [i, perfil] of perfis.entries()) {
    if (rendas[i].porAno <= 0) continue;
    soma += perfil[0] * rendas[i].porAno;
    pesos += perfil[0];
  }
  return pesos > 0 ? soma / pesos : 0;
}

describe("a renda de cada perfil", () => {
  it("a renda média de quem trabalha fecha com o salário médio", () => {
    // É o que impede a repartição de criar ou sumir dinheiro.
    expect(mediaDeQuemTrabalha(pacote(), SALARIO)).toBeCloseTo(SALARIO, 0);
  });

  it("quem não trabalha não tira do bolo do trabalho", () => {
    expect(rendaDe("ocupacao", "aposentado")).toBe(0);
    expect(rendaDe("ocupacao", "fora")).toBe(0);
  });

  it("a fonte do dinheiro tem nome, e não é a ocupação crua", () => {
    const c = pacote().manifest.congresso!;
    const i = c.perfis.findIndex(
      (p) => c.valores.ocupacao?.[p[coluna("ocupacao")]] === "servidor",
    );
    const fonte = rendasDosPerfis(pacote(), SALARIO)[i].fonte;
    expect(fonte.id).toBe("servidor");
    expect(fonte.nome).toBe("Servidores públicos");
  });

  it("quem ganha mais dentro da mesma ocupação tem renda maior", () => {
    // Com carteira, para a comparação ser dentro da mesma fonte: comparar
    // faixas de renda sem prender a ocupação pega aposentado dos dois lados,
    // que ganha zero do trabalho nas duas pontas.
    const comCarteira = (faixa: string) => {
      const c = pacote().manifest.congresso!;
      const i = c.perfis.findIndex(
        (p) =>
          c.valores.ocupacao?.[p[coluna("ocupacao")]] === "carteira" &&
          c.valores.renda?.[p[coluna("renda")]] === faixa,
      );
      if (i < 0) throw new Error(`nenhum perfil com carteira e renda ${faixa}`);
      return rendasDosPerfis(pacote(), SALARIO)[i].porAno;
    };
    expect(comCarteira("rica")).toBeGreaterThan(comCarteira("pobre"));
  });

  it("sem tabela no mundo, não há renda nenhuma — e nada quebra", () => {
    const sem = comCongresso((c) => {
      delete c.bolso;
      return c;
    });
    expect(rendasDosPerfis(sem, SALARIO)).toEqual([]);
  });

  it("salário médio zero não divide por zero", () => {
    expect(rendasDosPerfis(pacote(), 0).every((r) => r.porAno === 0)).toBe(
      true,
    );
  });

  it("combinação fora da tabela vale 1 e não desequilibra a massa", () => {
    const furado = comCongresso((c) => {
      const bolso = c.bolso as { fontes: Record<string, unknown> };
      return {
        ...c,
        bolso: {
          ...bolso,
          fontes: Object.fromEntries(
            Object.entries(bolso.fontes).filter(([id]) => id !== "servidor"),
          ),
        },
      };
    });
    expect(mediaDeQuemTrabalha(furado, SALARIO)).toBeCloseTo(SALARIO, 0);
  });
});

/** Os valores do motor que o bolso lê, na partida de verdade. */
function valores(): Record<string, number> {
  const criada = criarPartida({ ocorrencias: false, eleicao: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return { ...criada.value.game.execution.values };
}

let cache: Record<string, number> | undefined;
function osValores(): Record<string, number> {
  cache ??= valores();
  return cache;
}

/** O bolso do primeiro perfil que tem esse valor de atributo. */
function bolsoDe(atributo: string, valor: string, vs = osValores()) {
  const c = pacote().manifest.congresso!;
  const i = c.perfis.findIndex(
    (p) => c.valores[atributo]?.[p[coluna(atributo)]] === valor,
  );
  if (i < 0) throw new Error(`nenhum perfil com ${atributo}=${valor}`);
  return bolsosDosPerfis(pacote(), vs)[i];
}

describe("o que o perfil paga e o que lhe sobra", () => {
  it("a sobra é o que ganha menos o que paga", () => {
    for (const b of bolsosDosPerfis(pacote(), osValores()))
      expect(b.sobra).toBeCloseTo(b.ganha - b.paga, 6);
  });

  it("quem ganha mais paga mais imposto", () => {
    const comCarteira = (faixa: string) => {
      const c = pacote().manifest.congresso!;
      const i = c.perfis.findIndex(
        (p) =>
          c.valores.ocupacao?.[p[coluna("ocupacao")]] === "carteira" &&
          c.valores.renda?.[p[coluna("renda")]] === faixa,
      );
      return bolsosDosPerfis(pacote(), osValores())[i].paga;
    };
    expect(comCarteira("rica")).toBeGreaterThan(comCarteira("pobre"));
  });

  it("aposentado não ganha do trabalho e mesmo assim tem o que gastar", () => {
    const b = bolsoDe("ocupacao", "aposentado");
    expect(b.ganha).toBeGreaterThan(0);
  });

  it("o benefício do aposentado segue o reajuste que o motor aplica", () => {
    // O motor paga aposentados × benefício × reajuste/100. Ler o benefício
    // cru punha o aposentado acima do servidor na tela, e fazia a lei de
    // reajuste de benefícios não bater em ninguém.
    const vs = osValores();
    const reajuste = vs.nivel_reajuste_de_beneficios;
    expect(reajuste).toBeGreaterThan(0);
    const base = bolsoDe("ocupacao", "aposentado", vs).ganha;
    expect(base).toBeCloseTo(
      (vs.beneficio_anual_aposentadoria * reajuste) / 100,
      6,
    );
    const dobrado = bolsoDe("ocupacao", "aposentado", {
      ...vs,
      nivel_reajuste_de_beneficios: reajuste / 2,
    }).ganha;
    expect(dobrado).toBeCloseTo(base / 2, 6);
  });

  it("a soma do que os perfis pagam fecha com o que o motor arrecadou", () => {
    // O agregado manda e o perfil divide: nem a base de consumo nem os
    // lucros podem fazer o eleitorado pagar mais (ou menos) do que o
    // orçamento recebe ao lado.
    const vs = osValores();
    const perfis = pacote().manifest.congresso!.perfis;
    const bolsos = bolsosDosPerfis(pacote(), vs);
    const rendas = rendasDosPerfis(
      pacote(),
      vs.salario_medio,
      vs.lucros / vs.massa_salarial,
    );
    const media = (v: (i: number) => number) =>
      perfis.reduce((soma, p, i) => soma + p[0] * v(i), 0) /
      perfis.reduce((soma, p) => soma + p[0], 0);
    const pessoas = vs.massa_salarial / media((i) => rendas[i].porAno);
    const pago = pessoas * media((i) => bolsos[i].paga);
    const arrecadado =
      vs.arrecadacao_consumo +
      vs.arrecadacao_renda_pessoas +
      vs.arrecadacao_renda_empresas +
      vs.arrecadacao_dividendos;
    expect(pago / arrecadado).toBeCloseTo(1, 6);
  });

  it("os lucros fecham: quem vive de capital reparte exatamente o que o motor lucrou", () => {
    const vs = osValores();
    const perfis = pacote().manifest.congresso!.perfis;
    const rendas = rendasDosPerfis(
      pacote(),
      vs.salario_medio,
      vs.lucros / vs.massa_salarial,
    );
    const total = (v: (i: number) => number) =>
      perfis.reduce((soma, p, i) => soma + p[0] * v(i), 0);
    expect(
      total((i) => rendas[i].capitalPorAno) / total((i) => rendas[i].porAno),
    ).toBeCloseTo(vs.lucros / vs.massa_salarial, 6);
  });

  it("empresário vive de lucros: imposto sobre lucro bate nele, salário médio não", () => {
    const vs = osValores();
    const empresario = bolsoDe("ocupacao", "empresario", vs);
    const comMenosImposto = bolsoDe("ocupacao", "empresario", {
      ...vs,
      arrecadacao_renda_empresas: 0,
    });
    expect(comMenosImposto.sobra).toBeGreaterThan(empresario.sobra);
    // Com o PIB parado, salário maior é massa maior e lucro menor.
    const comSalarioMaior = bolsoDe("ocupacao", "empresario", {
      ...vs,
      salario_medio: vs.salario_medio * 2,
      massa_salarial: vs.massa_salarial * 2,
      lucros: vs.lucros - vs.massa_salarial,
    });
    expect(comSalarioMaior.ganha).toBeLessThan(empresario.ganha);
  });

  it("sem arrecadação sobre consumo, some só essa parte da conta", () => {
    const sem = bolsosDosPerfis(pacote(), {
      ...osValores(),
      arrecadacao_consumo: 0,
    });
    const com = bolsosDosPerfis(pacote(), osValores());
    const i = com.findIndex((b) => b.paga > 0);
    expect(sem[i].paga).toBeLessThan(com[i].paga);
    expect(sem[i].ganha).toBeCloseTo(com[i].ganha, 6);
  });

  it("a contribuição sobre a folha não sai do bolso de quem trabalha", () => {
    // `arrecadacao_salarios` é encargo do empregador sobre a folha — o jogo
    // já a mostra como "Custo de contratar". Cobrá-la de novo do salário
    // punha 21,6 pontos a mais na conta de cada trabalhador.
    const b = bolsosDosPerfis(pacote(), osValores());
    const semEncargo = bolsosDosPerfis(pacote(), {
      ...osValores(),
      arrecadacao_salarios: 0,
    });
    // Num perfil que trabalha: no que não trabalha não há encargo a sumir, e
    // o teste passaria sem provar nada.
    const i = b.findIndex(
      (x, j) => rendasDosPerfis(pacote(), 40000)[j].porAno > 0,
    );
    expect(semEncargo[i].paga).toBeCloseTo(b[i].paga, 6);
  });

  it("o imposto cabe no que se ganha", () => {
    // Antes de calibrar, o teto frouxo que denuncia conta errada: ninguém
    // entrega mais da metade do que ganha.
    const fora = bolsosDosPerfis(pacote(), osValores()).filter(
      (b) => b.ganha > 0 && b.paga / b.ganha > 0.5,
    );
    expect(fora).toEqual([]);
  });

  it("quem não tem benefício declarado não recebe nada por fora", () => {
    expect(bolsoDe("ocupacao", "fora").ganha).toBe(0);
  });
});

describe("quem pagou a conta", () => {
  it("lei que não mexe em dinheiro não tem quem pague a conta", () => {
    expect(quemPagouAConta(pacote(), osValores(), osValores())).toEqual([]);
  });

  it("mais imposto sobre consumo aparece como perda, e a maior vem antes", () => {
    const conta = quemPagouAConta(pacote(), osValores(), {
      ...osValores(),
      arrecadacao_consumo: osValores().arrecadacao_consumo * 1.2,
    });
    expect(conta.length).toBeGreaterThan(0);
    expect(conta[0].porMes).toBeLessThan(0);
    const perdas = conta.map((c) => c.porMes);
    expect(perdas).toEqual([...perdas].sort((a, b) => a - b));
  });

  it("a conta diz de que tamanho é a gente que pagou", () => {
    const conta = quemPagouAConta(pacote(), osValores(), {
      ...osValores(),
      arrecadacao_consumo: osValores().arrecadacao_consumo * 1.2,
    });
    for (const linha of conta) {
      expect(linha.parte).toBeGreaterThan(0);
      expect(linha.parte).toBeLessThanOrEqual(1);
      expect(linha.faixa).toBeTruthy();
    }
  });

  it("separa a mesma ocupação por faixa de renda, e mostra poucas linhas", () => {
    // Por ocupação só, o informal pobre sumia na média dos informais.
    const conta = quemPagouAConta(pacote(), osValores(), {
      ...osValores(),
      arrecadacao_consumo: osValores().arrecadacao_consumo * 1.2,
    });
    expect(conta.length).toBeGreaterThan(0);
    expect(conta.length).toBeLessThanOrEqual(6);
    expect(conta.every((c) => c.faixa.includes(" · "))).toBe(true);
    expect(new Set(conta.map((c) => c.faixa)).size).toBe(conta.length);
  });

  it("salário médio maior aparece como ganho, não como perda", () => {
    const conta = quemPagouAConta(pacote(), osValores(), {
      ...osValores(),
      salario_medio: osValores().salario_medio * 1.1,
    });
    expect(conta.some((c) => c.porMes > 0)).toBe(true);
  });
});
