import { expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
  type Partida,
} from "../app/partida";

function nova(): Partida {
  const criada = criarPartida();
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

it("cria a partida do Brasil real com as leis das fichas", () => {
  const visao = verPartida(nova());
  expect(visao.turno).toBe(0);
  expect(visao.leis.length).toBeGreaterThan(100);
  expect(visao.bolhas.some((bolha) => bolha.id === "pib")).toBe(true);
  expect(visao.caixa).toBeGreaterThan(0);
  const salario = visao.leis.find((lei) => lei.id === "salario-minimo");
  expect(salario?.opcaoAtual).toBe("piso-moderado");
});

it("quatro turnos mudam bolhas, caixa e dívida", () => {
  let partida = nova();
  const inicio = verPartida(partida);
  for (let turno = 1; turno <= 4; turno++) {
    const passou = encerrarTurno(partida);
    if (!passou.ok) throw new Error(passou.erros.join(" "));
    partida = passou.value.partida;
    expect(passou.value.relatorio.turno).toBe(turno);
  }
  const fim = verPartida(partida);
  expect(fim.turno).toBe(4);
  expect(fim.caixa).not.toBe(inicio.caixa);
  expect(fim.divida).not.toBe(inicio.divida);
  const mudou = fim.bolhas.filter(
    (bolha) =>
      Math.abs(
        bolha.valor - inicio.bolhas.find((b) => b.id === bolha.id)!.valor,
      ) > 1e-6,
  );
  expect(mudou.length).toBeGreaterThan(0);
});

it("mudar uma lei anda até a meta aos poucos e muda as bolhas ligadas", () => {
  const partida = nova();
  const lei = verPartida(partida).leis.find((l) => l.id === "salario-minimo")!;
  const alto = lei.opcoes!.at(-1)!.valor;
  const mudada = mudarLei(partida, lei.id, alto);
  if (!mudada.ok) throw new Error(mudada.erros.join(" "));
  const semMudanca = encerrarTurno(partida);
  const comMudanca = encerrarTurno(mudada.value);
  if (!semMudanca.ok || !comMudanca.ok) throw new Error("turno falhou");
  const depois = verPartida(comMudanca.value.partida);
  const leiDepois = depois.leis.find((l) => l.id === lei.id)!;
  expect(leiDepois.meta).toBe(alto);
  expect(leiDepois.nivel).toBeGreaterThan(lei.nivel);
  const renda = (p: Partida) =>
    verPartida(p).bolhas.find((b) => b.id === "renda_familias")!.valor;
  expect(renda(comMudanca.value.partida)).toBeGreaterThan(
    renda(semMudanca.value.partida),
  );
});

it("recusa lei inexistente", () => {
  const resultado = mudarLei(nova(), "lei-que-nao-existe", 10);
  expect(resultado.ok).toBe(false);
});
