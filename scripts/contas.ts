// Passo 5: contas do país de teste em um mandato. Rodar: npm run contas
//
// Esperado (escrito antes):
// - imposto de renda a 10%: déficit, a dívida sobe e o cofre se esvazia;
//   a 50%: a sobra vai para o cofre e a dívida cai em % do PIB;
// - dívida inicial de 40, 80 e 120% do PIB (tolerância do país: 60%): os
//   juros sobem mais quanto mais a dívida passa da tolerância; a 40% ficam
//   perto de neutro + inflação (8%);
// - a contabilidade fecha todo turno (senão o motor para com erro).
import { criarPartida, jogar, type Estado } from "../src/partida";

// Não importa de mandato.ts: importar aquele script imprime a saída dele.
const TURNOS_MANDATO = 24;

export const DIVIDAS = [40, 80, 120];

export function comImposto(aliquota: number, semente = 42): Estado {
  return jogar(
    criarPartida("teste", semente, { semCongresso: true }),
    TURNOS_MANDATO,
    [{ tipo: "mudar_lei", lei: "imposto-renda", valor: aliquota }],
  ).estado;
}

export function comDivida(divida: number, semente = 42): Estado {
  return jogar(
    criarPartida("teste", semente, {
      ajustes: { divida_publica: divida },
      semCongresso: true,
    }),
    TURNOS_MANDATO,
  ).estado;
}

if (import.meta.env.MODE !== "test") {
  const n = (v: number) => v.toFixed(1).padStart(5);
  const linha = (rotulo: string, e: Estado) => {
    const c = e.essenciais;
    console.log(
      rotulo.padEnd(20),
      `receita ${n(c.arrecadacao)}  gasto ${n(c.gasto_publico)}`,
      ` juros pagos ${n(c.juros_pagos)}  primário ${n(c.resultado_primario)}`,
      ` nominal ${n(c.resultado_fiscal)}  cofre ${n(c.cofre)}`,
      ` dívida ${n(c.divida_publica)}  taxa ${n(c.taxa_juros)}%`,
    );
  };
  console.log("Contas em % do PIB (fluxos ao ano)\n");
  linha(
    "início (IR 20%)",
    criarPartida("teste", 42, { semCongresso: true }).estado,
  );
  linha("IR 20%, turno 24", comImposto(0.2));
  linha("IR 10%, turno 24", comImposto(0.1));
  linha("IR 50%, turno 24", comImposto(0.5));
  console.log("\nDívida inicial diferente, IR 20%, turno 24:\n");
  for (const d of DIVIDAS) {
    linha(
      `dívida ${d}%, início`,
      criarPartida("teste", 42, {
        ajustes: { divida_publica: d },
        semCongresso: true,
      }).estado,
    );
    linha(`dívida ${d}%, turno 24`, comDivida(d));
  }
}
