/** Extremos legais dos quatro controles tributários no motor real, por 16 turnos. */
import {
  criarPartida,
  encerrarTurno,
  verPartida,
  type Partida,
} from "../../src/app/partida";
import { saldoDasLeis } from "../../src/app/partida/contas";
import { aplicarMeta } from "../../src/app/partida/leis";

const MARCOS = new Set([1, 4, 8, 16]);
const ROTAS: Record<string, [string, number][]> = {
  referencia: [],
  irpf_zero: [["imposto-renda-pessoas", 0]],
  irpf_maximo_legal: [["imposto-renda-pessoas", 60]],
  irpj_zero: [["imposto-renda-empresas", 0]],
  irpj_maximo_legal: [["imposto-renda-empresas", 40]],
  iva_zero: [["imposto-sobre-consumo", 0]],
  iva_cashback: [["imposto-sobre-consumo", 26.5]],
  iva_maximo_legal: [["imposto-sobre-consumo", 30]],
  seletivo_zero: [["imposto-seletivo", 0]],
  seletivo_maximo: [["imposto-seletivo", 100]],
};

const arredondar = (n: number | undefined) =>
  n === undefined ? null : Math.round(n * 1000) / 1000;

function foto(partida: Partida, turno: number) {
  const vista = verPartida(partida);
  const ids = ["pib", "inflacao", "consumo", "pobreza", "desigualdade"];
  const indicadores = Object.fromEntries(
    vista.bolhas
      .filter((b) => ids.includes(b.id))
      .map((b) => [b.id, arredondar(b.valor)]),
  );
  const c = vista.contas.percentualPib;
  const leis = [
    "imposto-renda-pessoas",
    "imposto-renda-empresas",
    "imposto-sobre-consumo",
    "imposto-seletivo",
  ];
  const saldo = saldoDasLeis(partida, partida.game.execution.values);
  return {
    turno,
    indicadores,
    contasPercentualPib: {
      receita: arredondar(c.receita),
      gasto: arredondar(c.gasto),
      juros: arredondar(c.juros),
      resultado: arredondar(c.resultado),
      divida: arredondar(c.divida),
      cofre: arredondar(c.cofre),
    },
    saldoFiscalDiretoAnualMoedaNominal: Object.fromEntries(
      leis.map((id) => [id, arredondar(saldo(id))]),
    ),
  };
}

function executar(nome: string, escolhas: [string, number][]) {
  const criada = criarPartida({
    modo: "real",
    semente: 7,
    ocorrencias: false,
    eleicao: false,
  });
  if (!criada.ok) throw new Error(criada.erros.join("; "));
  let partida = criada.value;
  for (const [lei, nivel] of escolhas) {
    const alterada = aplicarMeta(partida, lei, nivel);
    if (!alterada.ok)
      throw new Error(`${nome} ${lei}=${nivel}: ${alterada.erros.join("; ")}`);
    partida = alterada.value;
  }
  const fotos = [foto(partida, 0)];
  for (let t = 1; t <= 16; t++) {
    const rodada = encerrarTurno(partida);
    if (!rodada.ok)
      throw new Error(`${nome} T${t}: ${rodada.erros.join("; ")}`);
    partida = rodada.value.partida;
    if (
      Object.values(partida.game.execution.values).some(
        (v) => !Number.isFinite(v),
      )
    )
      throw new Error(`${nome} T${t}: valor não finito`);
    if (MARCOS.has(t)) fotos.push(foto(partida, t));
  }
  return { estrategia: nome, semente: 7, recusas: [], fotos };
}

for (const [nome, escolhas] of Object.entries(ROTAS))
  console.log(JSON.stringify(executar(nome, escolhas)));
