/**
 * Salvar e carregar (V1-33): aceite do chamado em docs/v1/chamados.md.
 */
import { describe, expect, it } from "vitest";
import {
  VERSAO_DO_SALVO,
  carregarPartida,
  criarPartida,
  encerrarTurno,
  mudarLei,
  salvarPartida,
  type Partida,
} from "../app/partida";

function ok<T>(
  r: { ok: true; value: T } | { ok: false; erros: readonly string[] },
): T {
  if (!r.ok) throw new Error(r.erros.join("\n"));
  return r.value;
}

/** Dois turnos com uma lei mudada: piloto e jogo já são diferentes. */
function partidaAndando(): Partida {
  let p = ok(criarPartida({ semente: 11, ocorrencias: false }));
  const lei = p.content.policies.find(
    (l) =>
      (l.controle.opcoes?.length ?? 0) > 1 &&
      mudarLei(p, l.id, l.controle.opcoes![0].valor).ok,
  )!;
  p = ok(mudarLei(p, lei.id, lei.controle.opcoes![0].valor));
  for (let i = 0; i < 2; i++) p = ok(encerrarTurno(p)).partida;
  return p;
}

describe("salvar e carregar", () => {
  it("partida salva e carregada produz o mesmo próximo turno", () => {
    const p = partidaAndando();
    expect(p.piloto).not.toBe(p.game);
    const carregada = ok(
      carregarPartida(salvarPartida(p, { historico: [1, 2] })),
    );
    expect(carregada.anexos).toEqual({ historico: [1, 2] });
    expect(carregada.partida.modo).toBe(p.modo);
    const a = ok(encerrarTurno(p));
    const b = ok(encerrarTurno(carregada.partida));
    expect(JSON.stringify(b.partida.game)).toBe(JSON.stringify(a.partida.game));
    expect(JSON.stringify(b.partida.piloto)).toBe(
      JSON.stringify(a.partida.piloto),
    );
  }, 60_000);

  it("versão errada, outro arquivo e outro conteúdo são recusados com mensagem", () => {
    const p = ok(criarPartida({ semente: 3, ocorrencias: false }));
    const salva = JSON.parse(salvarPartida(p));
    const erro = (texto: string) => {
      const r = carregarPartida(texto);
      expect(r.ok).toBe(false);
      return r.ok ? "" : r.erros.join(" ");
    };
    expect(
      erro(JSON.stringify({ ...salva, versao: VERSAO_DO_SALVO + 1 })),
    ).toMatch(/formato/);
    expect(erro("isto não é json")).toMatch(/não é uma partida/);
    expect(erro(JSON.stringify({ a: 1 }))).toMatch(/não é uma partida/);
    expect(erro(JSON.stringify({ ...salva, conteudo: "outro" }))).toMatch(
      /outra versão/,
    );
    expect(erro(JSON.stringify({ ...salva, game: null }))).toMatch(
      /corrompida/,
    );
  }, 60_000);
});
