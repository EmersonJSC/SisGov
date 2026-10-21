import { describe, expect, it } from "vitest";
import { criarPartida, verPartida } from "../app/partida";
import { aplicarMeta } from "../app/partida/leis";

function nova() {
  const result = criarPartida({ ocorrencias: false });
  if (!result.ok) throw new Error(result.erros.join(" "));
  return result.value;
}

function mudar(partida: ReturnType<typeof nova>, id: string, nivel: number) {
  const result = aplicarMeta(partida, id, nivel);
  if (!result.ok) throw new Error(result.erros.join(" "));
  return result.value;
}

function meta(partida: ReturnType<typeof nova>, id: string) {
  return verPartida(partida).leis.find((lei) => lei.id === id)!;
}

describe("Lote 5: educação e ciência", () => {
  it("a regra constitucional impõe piso à verba executada e atualiza a meta", () => {
    let partida = nova();
    expect(meta(partida, "piso-educacao").minimo).toBe(17.51);
    expect(aplicarMeta(partida, "piso-educacao", 10).ok).toBe(false);

    partida = mudar(partida, "piso-de-gasto-em-educacao", 75);
    expect(meta(partida, "piso-educacao").minimo).toBe(22);
    expect(meta(partida, "piso-educacao").meta).toBe(22);

    partida = mudar(partida, "piso-de-gasto-em-educacao", 0);
    expect(meta(partida, "piso-educacao").minimo).toBe(0);
    partida = mudar(partida, "piso-educacao", 10);
    expect(meta(partida, "piso-educacao").meta).toBe(10);
  });

  it("a mudança da universidade atualiza opções filhas em cascata", () => {
    let partida = nova();
    expect(aplicarMeta(partida, "credito-estudantil", 100).ok).toBe(false);
    partida = mudar(partida, "acesso-ao-ensino-superior", 0);
    expect(meta(partida, "vagas-publicas-no-ensino-superior").meta).toBe(0);
    partida = mudar(partida, "credito-estudantil", 66.67);
    expect(meta(partida, "credito-estudantil").meta).toBe(66.67);
    partida = mudar(partida, "acesso-ao-ensino-superior", 50);
    expect(meta(partida, "credito-estudantil").meta).toBe(33.33);
  });
});
