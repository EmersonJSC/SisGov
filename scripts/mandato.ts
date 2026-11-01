// Passo 4: joga um mandato (24 turnos) do país de teste com o imposto de
// renda em três valores. Rodar: npm run mandato
//
// Esperado (escrito antes): com imposto mais alto,
// - a arrecadação sobe (os três valores estão abaixo do pico do país, 0,5);
// - o padrão de vida cai, e a queda chega inteira em 2 turnos;
// - o resto não muda entre os três, porque a semente é a mesma.
import { criarPartida, jogar, type Estado } from "../src/partida";

export const TURNOS_MANDATO = 24;
export const ALIQUOTAS = [0.1, 0.3, 0.5];

export function mandato(aliquota: number, semente = 42): Estado {
  const partida = criarPartida("teste", semente);
  return jogar(partida, TURNOS_MANDATO, [
    { tipo: "mudar_lei", lei: "imposto-renda", valor: aliquota },
  ]).estado;
}

// Roda a saída só fora do teste (o vite-node não passa o arquivo no argv).
if (import.meta.env.MODE !== "test") {
  const inicio = criarPartida("teste", 42).estado;
  const linha = (rotulo: string, e: Estado) =>
    console.log(
      rotulo.padEnd(18),
      `arrecadação ${e.essenciais.arrecadacao.toFixed(1).padStart(5)}% PIB`,
      ` padrão de vida ${e.jogabilidade.padrao_vida.toFixed(1)}`,
      ` PIB nominal ${(e.essenciais.pib_nominal / 1e12).toFixed(3)} tri`,
    );
  linha("início (IR 20%)", inicio);
  for (const a of ALIQUOTAS) linha(`IR ${a * 100}%, turno 24`, mandato(a));

  const semente = (s: number) => JSON.stringify(mandato(0.3, s));
  console.log(
    "\nmesma semente, mesma partida:",
    semente(7) === semente(7) ? "sim" : "NÃO",
    "| semente diferente muda:",
    semente(7) !== semente(8) ? "sim" : "NÃO",
  );
}
