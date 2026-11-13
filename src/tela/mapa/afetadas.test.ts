import { describe, expect, it } from "vitest";
import { criarPartida, montarVisao } from "../../partida";
import { afetadasDe } from "./afetadas";
import { PREFIXO_INSTITUICAO, PREFIXO_MINISTRO } from "./organico";

describe("leis que ajudam e atrapalham", () => {
  const visao = montarVisao(criarPartida("brasil-2026", 1));

  it("um índice separa as leis ligadas a ele em ajudam e atrapalham", () => {
    const alvo = visao.ligacoes.find((l) =>
      visao.leis.some((x) => x.id === l.origem),
    )?.alvo as string;
    const a = afetadasDe(visao, alvo);
    expect(a?.tipo).toBe("indice");
    expect(
      (a?.ajudam.length ?? 0) + (a?.atrapalham.length ?? 0),
    ).toBeGreaterThan(0);
    const ids = [...(a?.ajudam ?? []), ...(a?.atrapalham ?? [])].map(
      (l) => l.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ministério e instituição olham só as próprias leis", () => {
    const h = visao.hierarquia!;
    const m = afetadasDe(visao, `${PREFIXO_MINISTRO}${h.ministros[0].id}`);
    expect(m?.tipo).toBe("ministro");
    [...(m?.ajudam ?? []), ...(m?.atrapalham ?? [])].forEach((l) =>
      expect(h.ministroDaLei[l.id]).toBe(h.ministros[0].id),
    );
    expect(
      afetadasDe(visao, `${PREFIXO_INSTITUICAO}${h.instituicoes[0].id}`)?.tipo,
    ).toBe("instituicao");
  });

  it("id desconhecido não abre painel", () => {
    expect(afetadasDe(visao, "nao-existe")).toBeNull();
  });
});
