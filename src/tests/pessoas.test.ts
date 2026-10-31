import { beforeAll, describe, expect, it } from "vitest";
import { criarPartida, type Partida } from "../app/partida";
import { congressoDoPacote, pacoteVivo } from "../game/congresso";
import {
  opiniaoDaPessoa,
  pessoaDaChave,
  sortearPessoa,
  type NomesDoPais,
} from "../game/congresso/pessoas";

const nomes: NomesDoPais = {
  m: ["João", "Pedro"],
  f: ["Maria", "Ana"],
  sobrenomes: ["Silva", "Souza", "Lima"],
};

let partida: Partida;
beforeAll(() => {
  const r = criarPartida({ ocorrencias: false });
  if (!r.ok) throw new Error(r.erros.join("\n"));
  partida = r.value;
});

describe("sortear uma pessoa", () => {
  it("a mesma chave dá a mesma pessoa, e outra chave dá outra", () => {
    const pacote = congressoDoPacote(partida.content)!;
    const a = sortearPessoa(pacote, nomes, "post-1", 7);
    expect(sortearPessoa(pacote, nomes, "post-1", 7)).toEqual(a);
    const outras = ["post-2", "post-3", "post-4", "post-5"].map((c) =>
      sortearPessoa(pacote, nomes, c, 7),
    );
    expect(outras.some((p) => p.perfil !== a.perfil || p.nome !== a.nome)).toBe(
      true,
    );
  });

  it("a idade cai na faixa do perfil", () => {
    const pacote = congressoDoPacote(partida.content)!;
    for (let i = 0; i < 40; i++) {
      const p = sortearPessoa(pacote, nomes, `post-${i}`, 3);
      const faixa = pacote.perfis[p.perfil].atributos.idade;
      const [de, ate] = faixa.split("-").map((n) => Number.parseInt(n, 10));
      expect(p.idade).toBeGreaterThanOrEqual(de);
      if (Number.isFinite(ate)) expect(p.idade).toBeLessThanOrEqual(ate);
    }
  });

  it("guarda a pessoa no estado e devolve a mesma no segundo clique", () => {
    const pacote = congressoDoPacote(partida.content)!;
    const estado = partida.game.congress!;
    const primeira = pessoaDaChave(estado, pacote, nomes, "post-9", 1);
    expect(primeira.estado.pessoas?.["post-9"]).toEqual(primeira.pessoa);
    // mesmo com outra semente, quem já foi sorteada não muda
    const segunda = pessoaDaChave(primeira.estado, pacote, nomes, "post-9", 99);
    expect(segunda.pessoa).toEqual(primeira.pessoa);
    expect(segunda.estado).toBe(primeira.estado);
    // sobrevive a salvar e carregar
    const carregado = JSON.parse(JSON.stringify(primeira.estado));
    expect(
      pessoaDaChave(carregado, pacote, nomes, "post-9", 99).pessoa,
    ).toEqual(primeira.pessoa);
  });

  it("o índice do perfil serve no eleitorado vivo e dá uma opinião", () => {
    const fixo = congressoDoPacote(partida.content)!;
    const valores = partida.game.execution.values;
    const vivo = pacoteVivo(partida.content, valores)!;
    fixo.perfis.forEach((p, i) =>
      expect(vivo.perfis[i].atributos).toEqual(p.atributos),
    );
    const pessoa = sortearPessoa(fixo, nomes, "post-1", 7);
    const o = opiniaoDaPessoa(pessoa, vivo, valores);
    expect(o.satisfacao).toBeGreaterThanOrEqual(0);
    expect(o.satisfacao).toBeLessThanOrEqual(100);
    for (let i = 1; i < o.motivos.length; i++)
      expect(Math.abs(o.motivos[i - 1].pontos)).toBeGreaterThanOrEqual(
        Math.abs(o.motivos[i].pontos),
      );
  });
});
