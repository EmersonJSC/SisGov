/**
 * Stress test exploratório: 64 trimestres, mesma semente com e sem decisões.
 * Não é teste de aceite nem modelo de comportamento ótimo do jogador.
 * Uso: npx vite-node scripts/teste/stress64.ts
 */
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  responderDilema,
  responderPedido,
  verPartida,
  verTramitacao,
  type Partida,
} from "../../src/app/partida";

const SEMENTE = 7;
const TURNOS = 64;
const arredondar = (valor: number) => Math.round(valor * 100) / 100;

function fotografia(partida: Partida) {
  const vista = verPartida(partida);
  const valores = partida.game.execution.values;
  const peso = vista.grupos.reduce((soma, grupo) => soma + grupo.peso, 0);
  return {
    pibIndice: valores.pib,
    pibNominal: valores.pib_nominal,
    produtividade: valores.produtividade,
    investimento: valores.investimento,
    exportacoes: valores.exportacoes,
    qualificacaoTrabalho: valores.qualificacao_trabalho,
    divida: vista.contas.percentualPib.divida,
    deficit: vista.contas.percentualPib.resultado,
    inflacao: valores.inflacao,
    desemprego: valores.desemprego,
    satisfacao:
      vista.grupos.reduce(
        (soma, grupo) => soma + grupo.satisfacao * grupo.peso,
        0,
      ) / peso,
  };
}

type Foto = ReturnType<typeof fotografia>;
type Acao = { turno: number; lei: string; nivel: number; resultado: string };

function rodar(adaptativo: boolean) {
  // Sem eleição para observar 64 turnos contínuos mesmo se o partido perderia.
  const criada = criarPartida({
    modo: "real",
    semente: SEMENTE,
    eleicao: false,
  });
  if (!criada.ok) throw new Error(criada.erros.join("\n"));
  let partida = criada.value;
  const fotos: { turno: number; foto: Foto }[] = [
    { turno: 0, foto: fotografia(partida) },
  ];
  const historicoPib = [fotos[0].foto.pibIndice];
  const acoes: Acao[] = [];
  const ultimaTentativa = new Map<string, number>();
  let dilemas = 0;
  let pedidos = 0;

  for (let turno = 1; turno <= TURNOS; turno++) {
    const atual = fotografia(partida);
    const metas = new Map<string, number>();
    if (adaptativo) {
      const pibQuatroTurnosAtras = historicoPib[Math.max(0, turno - 4)];
      if (
        atual.desemprego > 6.5 ||
        (turno >= 4 && atual.pibIndice < pibQuatroTurnosAtras - 0.3)
      ) {
        metas.set("ferrovias-e-terminais-portuarios", 33);
        metas.set("banco-de-desenvolvimento", 100);
        metas.set("ensino-tecnico-e-profissional", 67);
      }
      if (atual.divida > 90) {
        metas.set("idade-minima-aposentadoria", 75);
        metas.set("imposto-renda-pessoas", 40);
        metas.set("imposto-sobre-consumo", 30);
      }
      if (atual.satisfacao < 45) {
        metas.set("salario-minimo", 100);
        metas.set("imposto-sobre-consumo", 26.5);
      }
      const fila = new Set(verTramitacao(partida).fila.map((item) => item.lei));
      for (const [lei, nivel] of metas) {
        const vigente = partida.game.policies.find(
          (item) =>
            item.policyDefinitionId === lei && item.status !== "encerrada",
        );
        if (vigente && Math.abs(vigente.desiredLevel - nivel) < 1e-9) continue;
        if (fila.has(lei)) continue;
        if (turno - (ultimaTentativa.get(lei) ?? -100) < 4) continue;
        ultimaTentativa.set(lei, turno);
        const tentativa = mudarLei(partida, lei, nivel);
        if (!tentativa.ok) {
          acoes.push({
            turno,
            lei,
            nivel,
            resultado: tentativa.erros.join(" "),
          });
          continue;
        }
        partida = tentativa.value;
        acoes.push({ turno, lei, nivel, resultado: "proposta enviada" });
      }
    }
    for (const pedido of verTramitacao(partida).pedidos) {
      const resposta = responderPedido(partida, pedido.id, true);
      if (resposta.ok) {
        partida = resposta.value;
        pedidos++;
      }
    }
    for (const dilema of verPartida(partida).ocorrencias.mesa) {
      const opcao =
        dilema.opcoes.find((item) => item.padrao && item.disponivel) ??
        dilema.opcoes.find((item) => item.disponivel);
      if (!opcao) throw new Error(`Dilema sem opção no turno ${turno}`);
      const resposta = responderDilema(partida, dilema.id, opcao.id);
      if (!resposta.ok) throw new Error(resposta.erros.join("\n"));
      partida = resposta.value;
      dilemas++;
    }
    const encerrado = encerrarTurno(partida);
    if (!encerrado.ok)
      throw new Error(`Turno ${turno}: ${encerrado.erros.join("\n")}`);
    partida = encerrado.value.partida;
    const foto = fotografia(partida);
    const naoFinitos = Object.entries(partida.game.execution.values)
      .filter(([, valor]) => !Number.isFinite(valor))
      .map(([id]) => id);
    if (naoFinitos.length)
      throw new Error(
        `Turno ${turno}: valores não finitos ${naoFinitos.join(", ")}`,
      );
    historicoPib.push(foto.pibIndice);
    if (turno % 8 === 0) fotos.push({ turno, foto });
  }
  const finais = partida.game.policies.filter((item) =>
    [
      "ferrovias-e-terminais-portuarios",
      "banco-de-desenvolvimento",
      "ensino-tecnico-e-profissional",
      "idade-minima-aposentadoria",
      "imposto-renda-pessoas",
      "imposto-sobre-consumo",
      "salario-minimo",
    ].includes(item.policyDefinitionId),
  );
  return {
    fotos: fotos.map(({ turno, foto }) => ({
      turno,
      ...Object.fromEntries(
        Object.entries(foto).map(([chave, valor]) => [
          chave,
          arredondar(valor),
        ]),
      ),
    })),
    acoes,
    leisFinais: finais.map((item) => ({
      lei: item.policyDefinitionId,
      status: item.status,
      desejado: item.desiredLevel,
      implantado: arredondar(item.implementedLevel),
    })),
    dilemas,
    pedidos,
  };
}

for (const [nome, adaptativo] of [
  ["sem_decisoes", false],
  ["adaptativo", true],
] as const) {
  try {
    console.log(JSON.stringify({ cenario: nome, ...rodar(adaptativo) }));
  } catch (erro) {
    console.log(JSON.stringify({ cenario: nome, erro: String(erro) }));
    process.exitCode = 1;
  }
}
