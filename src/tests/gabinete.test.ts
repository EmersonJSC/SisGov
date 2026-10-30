import { expect, it } from "vitest";
import { criarPartida, notasDoGabinete, verEleicao } from "../app/partida";
import { valoresComReacao } from "../app/partida/bussola";
import { pacoteVivo } from "../game/congresso";
import {
  ajusteDoGabinete,
  GRUPOS_LEAIS,
  gruposNaBussola,
  notasDosMinistros,
  TETO_DO_GABINETE,
} from "../game/gabinete";

function partida() {
  const p = criarPartida({ semente: 4 });
  if (!p.ok) throw new Error(p.erros.join());
  return p.value;
}

it("M8.3 B: cada ministro nasce com nota dos grupos leais, e não 50 para todos", () => {
  const p = partida();
  const notas = notasDoGabinete(p);
  expect(notas).toHaveLength(11);
  for (const n of notas) {
    expect(n.leais).toHaveLength(GRUPOS_LEAIS);
    expect(n.nota).toBeGreaterThanOrEqual(0);
    expect(n.nota).toBeLessThanOrEqual(100);
  }
  expect(new Set(notas.map((n) => n.nota.toFixed(1))).size).toBeGreaterThan(1);
  // na tela, cada área do gabinete traz a nota e os leais
  const e = verEleicao(p)!;
  expect(e.gabinete.every((a) => a.popularidade !== undefined)).toBe(true);
});

it("M8.3 B: os leais são uma conta pelo lado do ministro, e a nota segue a satisfação deles", () => {
  const p = partida();
  const valores = p.game.execution.values;
  const pacote = pacoteVivo(p.content, valores)!;
  const ministros = p.game.election!.ministros!;
  const [area] = Object.keys(ministros);
  const so = { [area]: ministros[area] };
  const antes = notasDosMinistros(so, pacote, valores)[0];
  // mesma entrada, mesmos leais
  expect(notasDosMinistros(so, pacote, valores)[0]).toEqual(antes);
  // os leais ficam mais satisfeitos: a nota sobe
  const felizes = { ...valores };
  for (const g of antes.leais) felizes[g] = Math.min(100, valores[g] + 20);
  expect(notasDosMinistros(so, pacote, felizes)[0].nota).toBeGreaterThan(
    antes.nota,
  );
  // pesa pelo tamanho: o grupo leal maior pesa mais
  const grupos = new Map(gruposNaBussola(pacote).map((g) => [g.id, g.peso]));
  const [maior, menor] = [...antes.leais].sort(
    (a, b) => grupos.get(b)! - grupos.get(a)!,
  );
  const sobeMaior = { ...valores, [maior]: valores[maior] + 10 };
  const sobeMenor = { ...valores, [menor]: valores[menor] + 10 };
  expect(notasDosMinistros(so, pacote, sobeMaior)[0].nota).toBeGreaterThan(
    notasDosMinistros(so, pacote, sobeMenor)[0].nota,
  );
});

it("M8.3 B: o gabinete soma ou tira da opinião de todos, com teto", () => {
  const nota = (n: number) => [{ area: "a", nota: n, leais: [] }];
  expect(ajusteDoGabinete(nota(50))).toBe(0);
  expect(ajusteDoGabinete(nota(70))).toBeGreaterThan(0);
  expect(ajusteDoGabinete(nota(30))).toBeLessThan(0);
  expect(ajusteDoGabinete(nota(100))).toBe(TETO_DO_GABINETE);
  // e entra na opinião que a eleição lê
  const p = partida();
  const ajuste = ajusteDoGabinete(notasDoGabinete(p));
  const v = valoresComReacao(p);
  const grupo = notasDoGabinete(p)[0].leais[0];
  expect(v[grupo]).toBeCloseTo(
    Math.max(0, Math.min(100, p.game.execution.values[grupo] + ajuste)),
    6,
  );
});
