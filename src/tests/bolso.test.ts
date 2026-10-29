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
import { rendasDosPerfis } from "../app/partida/bolso";
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
