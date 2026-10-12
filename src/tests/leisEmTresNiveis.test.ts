/**
 * SG160/SG161 — leis em três níveis e catálogo (D-65), com a Segurança
 * migrada: pétrea não muda nem sai do mapa; lei do catálogo bloqueada pela
 * pétrea fica trancada; derivada aprovada entra no mapa, sai ao ser revogada
 * e sai de vigor quando a base muda.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  leisQueCaem,
  mudarLei,
  revogarLei,
  verPartida,
  type Partida,
} from "../app/partida";
import {
  validatePackageCoherence,
  type PolicyFile,
  type ResolvedPackage,
} from "../engine";
import { relatorioDeMigracao } from "../game/pais/fichaV3";

const fichasV3 = relatorioDeMigracao(
  Object.fromEntries(
    Object.entries(
      import.meta.glob<string>("../conteudo/mundo/**/*.json", {
        eager: true,
        query: "?raw",
        import: "default",
      }),
    ).map(([path, text]) => [path.slice("../conteudo/".length), text]),
  ),
  "mundo/catalogo-leis.json",
);

type Ajuste = Partial<Pick<PolicyFile, "nivelLegal" | "revogavel" | "requer">>;

function comAjustes(
  content: ResolvedPackage,
  ajustes: Readonly<Record<string, Ajuste>>,
): ResolvedPackage {
  return {
    ...content,
    policies: content.policies.map((policy) =>
      ajustes[policy.id] ? { ...policy, ...ajustes[policy.id] } : policy,
    ),
  };
}

function nova(ajustes: Readonly<Record<string, Ajuste>> = {}): Partida {
  const criada = criarPartida({ ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return {
    ...criada.value,
    content: comAjustes(criada.value.content, ajustes),
  };
}

const lei = (partida: Partida, id: string) =>
  verPartida(partida).leis.find((l) => l.id === id)!;

const valor = (partida: Partida, id: string, opcao: string) =>
  lei(partida, id).opcoes!.find((o) => o.id === opcao)!.valor;

function ok<T>(
  resultado: { ok: true; value: T } | { ok: false; erros: readonly string[] },
): T {
  if (!resultado.ok) throw new Error(resultado.erros.join(" "));
  return resultado.value;
}

describe("SG161 — Segurança em três níveis", () => {
  const partida = nova();

  it("cada lei da área tem o seu nível", () => {
    const niveis = Object.fromEntries(
      [
        "policias-dos-estados",
        "garantias-penais",
        "ciclo-policial",
        "maioridade-penal",
        "lei-de-drogas",
        "cameras-corporais",
      ].map((id) => [id, lei(partida, id).nivelLegal]),
    );
    expect(niveis).toEqual({
      "policias-dos-estados": "petrea",
      "garantias-penais": "petrea",
      "ciclo-policial": "constitucional",
      "maioridade-penal": "constitucional",
      "lei-de-drogas": "derivada",
      "cameras-corporais": "derivada",
    });
  });

  it("lei em vigor na opção de valor zero continua valendo", () => {
    // o ciclo dividido (valor 0) carrega a folha das polícias: 1,2% do PIB
    const gasto = (p: Partida) => p.game.execution.values.gasto_publico;
    const depois = encerrarTurno(partida);
    if (!depois.ok) throw new Error(depois.erros.join(" "));
    expect(Math.abs(gasto(depois.value.partida) - gasto(partida))).toBeLessThan(
      0.5,
    );
  });

  it("derivada do formato antigo tem no máximo 3 opções", () => {
    // Ficha v3 segue conteudo.md 1.1 (lei com 2 a 5 opções), conferida pelo
    // verificador da ficha (V1-05).
    const v3 = new Set(fichasV3.migradas);
    for (const l of verPartida(partida).leis)
      if (l.nivelLegal && !v3.has(l.id))
        expect(l.opcoes?.length ?? 0, l.id).toBeLessThan(4);
  });
});

describe("SG160 — pétrea", () => {
  const partida = nova();

  it("não muda de opção nem sai do mapa", () => {
    const pétrea = lei(partida, "garantias-penais");
    expect(pétrea.emVigor).toBe(true);
    expect(pétrea.revogavel).toBe(false);
    expect(pétrea.bloqueio).toMatch(/pétrea/);
    const outra = pétrea.opcoes!.find((o) => o.valor !== pétrea.meta)!;
    const mudou = mudarLei(partida, pétrea.id, outra.valor);
    expect(mudou.ok).toBe(false);
    if (!mudou.ok) expect(mudou.erros[0]).toMatch(/pétrea/);
    expect(revogarLei(partida, pétrea.id).ok).toBe(false);
  });

  it("tranca no catálogo a lei que ela proíbe", () => {
    const morte = lei(partida, "pena-de-morte");
    expect(morte.emVigor).toBe(false);
    expect(morte.bloqueio).toMatch(/Garantias penais/);
    expect(morte.exige?.motivo).toMatch(/cláusula pétrea/);
    const opcao = morte.opcoes![0].valor;
    expect(mudarLei(partida, morte.id, opcao).ok).toBe(false);
  });

  it("o validador recusa pétrea com exigência", () => {
    const content = comAjustes(partida.content, {
      "policias-dos-estados": {
        requer: { lei: "garantias-penais", opcoes: ["sem-pena-de-morte"] },
      },
    });
    const validado = validatePackageCoherence(content);
    expect(validado.ok).toBe(false);
    if (!validado.ok)
      expect(validado.diagnostics.map((d) => d.message)).toContain(
        "Lei pétrea não depende de outra lei.",
      );
  });
});

describe("SG160 — catálogo: aprovar e revogar", () => {
  it("constitucional e derivada fixa não saem do mapa", () => {
    const partida = nova();
    expect(lei(partida, "ciclo-policial").revogavel).toBe(false);
    expect(lei(partida, "lei-de-drogas").revogavel).toBe(false);
    expect(revogarLei(partida, "ciclo-policial").ok).toBe(false);
  });

  it("lei do catálogo aprovada entra no mapa, revogada sai e pode voltar", () => {
    const partida = nova();
    const fora = lei(partida, "cannabis-legal");
    expect(fora.emVigor).toBe(false);
    expect(fora.bloqueio).toBeUndefined();
    expect(fora.revogavel).toBe(false);
    const farmacias = valor(partida, "cannabis-legal", "farmacias");
    const aprovada = ok(mudarLei(partida, "cannabis-legal", farmacias));
    const dentro = lei(aprovada, "cannabis-legal");
    expect(dentro.emVigor).toBe(true);
    expect(dentro.meta).toBe(farmacias);
    expect(dentro.revogavel).toBe(true);
    const revogada = ok(revogarLei(aprovada, "cannabis-legal"));
    expect(lei(revogada, "cannabis-legal").emVigor).toBe(false);
    const voltou = ok(mudarLei(revogada, "cannabis-legal", farmacias));
    expect(lei(voltou, "cannabis-legal").emVigor).toBe(true);
  });

  it("derivada sai de vigor quando a base muda, e a tela avisa antes", () => {
    const partida = nova();
    const farmacias = valor(partida, "cannabis-legal", "farmacias");
    const aprovada = ok(mudarLei(partida, "cannabis-legal", farmacias));
    const guerra = valor(partida, "lei-de-drogas", "guerra-as-drogas");
    expect(leisQueCaem(aprovada, "lei-de-drogas", guerra)).toEqual([
      {
        id: "cannabis-legal",
        nome: lei(partida, "cannabis-legal").nome,
        base: "",
        revogada: true,
      },
    ]);
    const emGuerra = ok(mudarLei(aprovada, "lei-de-drogas", guerra));
    const bloqueada = lei(emGuerra, "cannabis-legal");
    expect(bloqueada.emVigor).toBe(false);
    expect(bloqueada.bloqueio).toMatch(/Lei de drogas/);
    expect(mudarLei(emGuerra, "cannabis-legal", farmacias).ok).toBe(false);
  });
});

describe("SG160 — várias exigências", () => {
  it("vale só com todas as bases certas", () => {
    const partida = nova({
      "cannabis-legal": {
        requer: [
          {
            lei: "lei-de-drogas",
            opcoes: ["usuario-nao-preso", "uso-e-saude"],
          },
          { lei: "policia-militar", opcoes: ["civil"] },
        ],
      },
    });
    const cannabis = lei(partida, "cannabis-legal");
    expect(cannabis.exigencias.map((e) => e.atendida)).toEqual([true, false]);
    expect(cannabis.bloqueio).toMatch(/militar ou civil/);
    expect(
      mudarLei(partida, "cannabis-legal", cannabis.opcoes![0].valor).ok,
    ).toBe(false);
  });

  it("o validador acha ciclo entre várias exigências", () => {
    const partida = nova({
      "lei-de-drogas": {
        requer: [{ lei: "cannabis-legal", opcoes: ["clubes"] }],
      },
    });
    const validado = validatePackageCoherence(partida.content);
    expect(validado.ok).toBe(false);
    if (!validado.ok)
      expect(validado.diagnostics.map((d) => d.message)).toContain(
        "Ciclo de leis mães e filhas.",
      );
  });
});
