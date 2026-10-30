import { expect, it } from "vitest";
import {
  criarPartida,
  notasDoGabinete,
  responderAoMinistro,
} from "../app/partida";
import { valoresComReacao } from "../app/partida/bussola";
import { passarPedidos } from "../app/partida/pedidos";
import {
  decairFavores,
  favorDaResposta,
  FAVOR_DO_PEDIDO,
} from "../game/pedidos";

function partida() {
  const p = criarPartida({ semente: 4 });
  if (!p.ok) throw new Error(p.erros.join());
  return p.value;
}

const noTurno = (p: ReturnType<typeof partida>, turno: number) => ({
  ...p,
  game: { ...p.game, currentTurn: turno },
});

it("M8.3 D: de vez em quando um ministro traz um pedido, nunca mais de um, de uma lei da área dele", () => {
  const p = partida();
  const turnos = Array.from({ length: 80 }, (_, t) => t);
  const pedidos = turnos.flatMap((t) => {
    const e = passarPedidos(noTurno(p, t)).election?.pedido;
    return e ? [e] : [];
  });
  // nem todo turno, nem nenhum: "um ou outro"
  expect(pedidos.length).toBeGreaterThan(3);
  expect(pedidos.length).toBeLessThan(60);
  const atual = new Map(
    p.game.policies.map((x) => [x.policyDefinitionId, x.desiredLevel]),
  );
  for (const pedido of pedidos) {
    const policy = p.content.policies.find((x) => x.id === pedido.lei)!;
    expect(policy.controle.opcoes?.some((o) => o.id === pedido.opcao)).toBe(
      true,
    );
    // pede uma mudança, não o que já vale
    expect(atual.get(pedido.lei)).not.toBe(pedido.nivel);
  }
  // o mesmo turno dá sempre o mesmo pedido
  const t = pedidos[0].turno;
  expect(passarPedidos(noTurno(p, t)).election?.pedido).toEqual(pedidos[0]);
});

it("M8.3 D: aceitar agrada os grupos leais ao ministro, recusar desagrada, e o favor decai", () => {
  const p = partida();
  const turno = Array.from({ length: 200 }, (_, t) => t).find(
    (t) => passarPedidos(noTurno(p, t)).election?.pedido,
  )!;
  const comPedido = {
    ...p,
    game: passarPedidos(noTurno(p, turno)),
  };
  const pedido = comPedido.game.election!.pedido!;
  const leais = notasDoGabinete(comPedido).find(
    (n) => n.area === pedido.area,
  )!.leais;
  const base = valoresComReacao(comPedido);

  const recusado = responderAoMinistro(comPedido, false);
  if (!recusado.ok) throw new Error(recusado.erros.join());
  expect(recusado.value.game.election!.pedido).toBeUndefined();
  const depois = valoresComReacao(recusado.value);
  for (const g of leais) expect(depois[g]).toBeLessThan(base[g]);

  const aceito = responderAoMinistro(comPedido, true);
  if (!aceito.ok) throw new Error(aceito.erros.join());
  expect(aceito.value.game.election!.pedido).toBeUndefined();
  const feliz = valoresComReacao(aceito.value);
  for (const g of leais) expect(feliz[g]).toBeGreaterThan(base[g]);

  // sem pedido em aberto, não há o que responder
  expect(responderAoMinistro(p, true).ok).toBe(false);

  // as contas do favor
  const f = favorDaResposta(undefined, ["a", "b"], false);
  expect(f.a).toBe(-FAVOR_DO_PEDIDO);
  expect(decairFavores(f).a).toBe(-FAVOR_DO_PEDIDO / 2);
  expect(decairFavores({ a: 0.4 })).toEqual({});
});
