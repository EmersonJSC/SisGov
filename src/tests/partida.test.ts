import { expect, it } from "vitest";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  preverLei,
  verPartida,
  type Partida,
} from "../app/partida";

function nova(): Partida {
  const criada = criarPartida({ ocorrencias: false });
  if (!criada.ok) throw new Error(criada.erros.join(" "));
  return criada.value;
}

it("cria a partida do Brasil real com as leis das fichas", () => {
  const visao = verPartida(nova());
  expect(visao.turno).toBe(0);
  expect(visao.leis.length).toBeGreaterThan(100);
  expect(visao.bolhas.some((bolha) => bolha.id === "pib")).toBe(true);
  // Orçamento na rede (SG157): contas lidas das bolhas, sem caixa.
  const { contas } = visao;
  expect(contas.receita).toBeGreaterThan(0);
  expect(contas.gasto).toBeGreaterThan(0);
  expect(contas.resultado).toBeCloseTo(
    contas.receita - contas.gasto - contas.juros,
    -1,
  );
  expect(contas.divida).toBeCloseTo((77 * contas.pib) / 100, -3);
  const salario = visao.leis.find((lei) => lei.id === "salario-minimo");
  expect(salario?.opcaoAtual).toBe("piso-moderado");
});

it("quatro turnos mudam bolhas, contas e dívida", () => {
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
  expect(fim.contas.receita).not.toBe(inicio.contas.receita);
  // Começa em déficit: a dívida cresce.
  expect(fim.contas.divida).toBeGreaterThan(inicio.contas.divida);
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

it("a prévia mostra os três meses com e sem a mudança, sem gravar nada", () => {
  const partida = nova();
  const antes = verPartida(partida);
  const salario = antes.leis.find((lei) => lei.id === "salario-minimo")!;
  const alto = salario.opcoes!.at(-1)!.valor;
  const previa = preverLei(partida, "salario-minimo", alto);
  if (!previa.ok) throw new Error(previa.erros.join(" "));
  expect(previa.value.implantacao).toHaveLength(3);
  expect(previa.value.implantacao[2]).toBeGreaterThan(salario.nivel);
  const renda = previa.value.efeitos.find((e) => e.id === "renda_familias");
  expect(renda?.comMudanca).toHaveLength(3);
  expect(renda!.comMudanca[2]).toBeGreaterThan(renda!.semMudanca[2]);
  // nada foi gravado na partida
  expect(verPartida(partida)).toEqual(antes);
  // mesma meta: nenhuma diferença
  const igual = preverLei(partida, "salario-minimo", salario.meta);
  if (!igual.ok) throw new Error(igual.erros.join(" "));
  expect(igual.value.efeitos).toHaveLength(0);
});

it("o atraso das ligações sai em meses, como no conteúdo mensal", () => {
  const visao = verPartida(nova());
  const ligacao = visao.ligacoes.find(
    (l) => l.id === "salario-minimo--desemprego",
  );
  // 4 trimestres na ficha = 12 meses
  expect(ligacao?.atrasoMeses).toBe(12);
  const lei = visao.leis.find((l) => l.id === "reeleicao");
  expect(lei?.processo).toBe("emenda-constitucional");
});

it("a prévia de um ano mostra efeitos que só chegam depois do primeiro turno", () => {
  const partida = nova();
  const previa = preverLei(partida, "politica-de-imigracao", 0, 4);
  if (!previa.ok) throw new Error(previa.erros.join(" "));
  expect(previa.value.implantacao).toHaveLength(12);
  // a polarização reage à lei com atraso de um trimestre
  const crise = previa.value.efeitos.find((e) => e.id === "polarizacao");
  expect(crise?.comMudanca).toHaveLength(12);
  // ainda nada no primeiro turno; diferença clara em um ano
  expect(Math.abs(crise!.comMudanca[2] - crise!.semMudanca[2])).toBeLessThan(
    1e-6,
  );
  expect(
    Math.abs(crise!.comMudanca[11] - crise!.semMudanca[11]),
  ).toBeGreaterThan(0.5);
});
