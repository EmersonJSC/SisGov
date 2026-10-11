/**
 * SG160 — leis em três níveis e catálogo (D-65): pétrea não muda nem sai do
 * mapa; derivada com várias exigências sai de vigor quando uma falha; lei
 * revogada volta ao catálogo e pode ser aprovada de novo.
 */
import { describe, expect, it } from "vitest";
import {
  criarPartida,
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

type Ajuste = Partial<Pick<PolicyFile, "nivel" | "revogavel" | "requer">>;

function comNiveis(
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

const AJUSTES: Readonly<Record<string, Ajuste>> = {
  "maioridade-penal": { nivel: "petrea", requer: undefined },
  "modelo-de-policia": { nivel: "constitucional" },
  "politica-de-drogas": { nivel: "derivada", revogavel: false },
  "cameras-corporais": {
    nivel: "derivada",
    requer: [
      {
        lei: "modelo-de-policia",
        opcoes: ["comunitaria-civil", "ciclo-completo", "dual-militarizada"],
        motivo: "Câmera precisa de polícia profissional.",
      },
      {
        lei: "politica-de-drogas",
        opcoes: ["despenalizacao", "descriminalizacao"],
      },
    ],
  },
};

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return {
    ...criada.value,
    content: comNiveis(criada.value.content, AJUSTES),
  };
}

const lei = (partida: Partida, id: string) =>
  verPartida(partida).leis.find((l) => l.id === id)!;

const valor = (partida: Partida, id: string, opcao: string) =>
  lei(partida, id).opcoes!.find((o) => o.id === opcao)!.valor;

function ok<T>(
  resultado: { ok: true; value: T } | { ok: false; erros: string[] },
): T {
  if (!resultado.ok) throw new Error(resultado.erros.join(" "));
  return resultado.value;
}

describe("SG160 — pétrea", () => {
  const partida = nova();

  it("não muda de opção nem sai do mapa", () => {
    const pétrea = lei(partida, "maioridade-penal");
    expect(pétrea.nivelLegal).toBe("petrea");
    expect(pétrea.emVigor).toBe(true);
    expect(pétrea.revogavel).toBe(false);
    expect(pétrea.bloqueio).toMatch(/pétrea/);
    const outra = pétrea.opcoes!.find((o) => o.valor !== pétrea.meta)!;
    const mudou = mudarLei(partida, pétrea.id, outra.valor);
    expect(mudou.ok).toBe(false);
    if (!mudou.ok) expect(mudou.erros[0]).toMatch(/pétrea/);
    expect(revogarLei(partida, pétrea.id).ok).toBe(false);
  });

  it("o validador recusa pétrea com exigência", () => {
    const content = comNiveis(partida.content, {
      ...AJUSTES,
      "maioridade-penal": {
        nivel: "petrea",
        requer: { lei: "modelo-de-policia", opcoes: ["ciclo-completo"] },
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

describe("SG160 — catálogo: revogar e aprovar", () => {
  it("constitucional e derivada marcada não saem do mapa", () => {
    const partida = nova();
    expect(lei(partida, "modelo-de-policia").revogavel).toBe(false);
    expect(lei(partida, "politica-de-drogas").revogavel).toBe(false);
    expect(revogarLei(partida, "modelo-de-policia").ok).toBe(false);
  });

  it("derivada revogada sai do mapa e pode voltar", () => {
    const partida = nova();
    expect(lei(partida, "cameras-corporais").revogavel).toBe(true);
    const revogada = ok(revogarLei(partida, "cameras-corporais"));
    const fora = lei(revogada, "cameras-corporais");
    expect(fora.emVigor).toBe(false);
    expect(fora.revogavel).toBe(false);
    expect(fora.bloqueio).toBeUndefined();
    const continua = valor(revogada, "cameras-corporais", "gravacao-continua");
    const voltou = ok(mudarLei(revogada, "cameras-corporais", continua));
    const dentro = lei(voltou, "cameras-corporais");
    expect(dentro.emVigor).toBe(true);
    expect(dentro.meta).toBe(continua);
  });
});

describe("SG160 — derivada com duas exigências", () => {
  it("sai de vigor quando uma exigência falha e volta quando ela vale", () => {
    const partida = nova();
    const cameras = lei(partida, "cameras-corporais");
    expect(cameras.exigencias.map((e) => e.lei)).toEqual([
      "modelo-de-policia",
      "politica-de-drogas",
    ]);
    expect(cameras.exigencias.every((e) => e.atendida)).toBe(true);

    const guerra = valor(partida, "politica-de-drogas", "guerra-total");
    expect(leisQueCaem(partida, "politica-de-drogas", guerra)).toEqual([
      {
        id: "cameras-corporais",
        nome: cameras.nome,
        base: "",
        revogada: true,
      },
    ]);
    const emGuerra = ok(mudarLei(partida, "politica-de-drogas", guerra));
    const bloqueada = lei(emGuerra, "cameras-corporais");
    expect(bloqueada.emVigor).toBe(false);
    expect(bloqueada.bloqueio).toMatch(/Política de drogas/);
    expect(bloqueada.exigencias[1].atendida).toBe(false);
    expect(
      mudarLei(
        emGuerra,
        "cameras-corporais",
        valor(partida, "cameras-corporais", "gravacao-continua"),
      ).ok,
    ).toBe(false);

    const despenaliza = valor(partida, "politica-de-drogas", "despenalizacao");
    const depois = ok(mudarLei(emGuerra, "politica-de-drogas", despenaliza));
    expect(lei(depois, "cameras-corporais").bloqueio).toBeUndefined();
    const aprovada = ok(mudarLei(depois, "cameras-corporais", cameras.meta));
    expect(lei(aprovada, "cameras-corporais").emVigor).toBe(true);
  });

  it("o validador acha ciclo entre várias exigências", () => {
    const partida = nova();
    const content = comNiveis(partida.content, {
      ...AJUSTES,
      "politica-de-drogas": {
        nivel: "derivada",
        requer: [{ lei: "cameras-corporais", opcoes: ["a-criterio"] }],
      },
    });
    const validado = validatePackageCoherence(content);
    expect(validado.ok).toBe(false);
    if (!validado.ok)
      expect(validado.diagnostics.map((d) => d.message)).toContain(
        "Ciclo de leis mães e filhas.",
      );
  });
});
