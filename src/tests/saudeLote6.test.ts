import { describe, expect, it } from "vitest";
import { criarPartida, verPartida } from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";

function nova() {
  const result = criarPartida({ ocorrencias: false });
  if (!result.ok) throw new Error(result.erros.join(" "));
  return result.value;
}

function meta(partida: ReturnType<typeof nova>, id: string) {
  return verPartida(partida).leis.find((lei) => lei.id === id)!;
}

describe("Lote 6: saúde pública", () => {
  it("o piso constitucional limita a verba executada", () => {
    let partida = nova();
    expect(meta(partida, "piso-saude").minimo).toBe(13.69);
    expect(aplicarMeta(partida, "piso-saude", 10).ok).toBe(false);

    const ampliado = aplicarMeta(partida, "piso-de-gasto-em-saude", 75);
    if (!ampliado.ok) throw new Error(ampliado.erros.join(" "));
    partida = ampliado.value;
    expect(meta(partida, "piso-saude").minimo).toBe(18);
    expect(meta(partida, "piso-saude").meta).toBe(18);

    const livre = aplicarMeta(partida, "piso-de-gasto-em-saude", 0);
    if (!livre.ok) throw new Error(livre.erros.join(" "));
    partida = livre.value;
    expect(meta(partida, "piso-saude").minimo).toBe(0);
    expect(aplicarMeta(partida, "piso-saude", 10).ok).toBe(true);
  });
});
