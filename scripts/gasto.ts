// Passo 6a: gasto vira lei. Rodar: npm run gasto
//
// Esperado (escrito antes), país de teste, um mandato (24 turnos):
// - saúde em 4% do PIB (o que o país já gasta): nada muda, gasto fica em 30%
//   e a saúde fica onde estava;
// - saúde em 8%: o gasto sobe 4 pontos na hora, o déficit cresce, e a saúde
//   sobe aos poucos até chegar inteira em 1 ano (6 turnos);
// - saúde em 0%: o gasto cai 4 pontos, sobra vai para o cofre e a saúde cai.
import { criarPartida, jogar, type Estado } from "../src/partida";

const TURNOS_MANDATO = 24;
const SAUDE = [0.04, 0.08, 0];

export function comSaude(valor: number, turnos: number, semente = 42): Estado {
  return jogar(criarPartida("teste", semente), turnos, [
    { tipo: "mudar_lei", lei: "gasto-saude", valor },
  ]).estado;
}

if (import.meta.env.MODE !== "test") {
  const n = (v: number) => v.toFixed(1).padStart(5);
  for (const valor of SAUDE) {
    console.log(`\nSaúde em ${valor * 100}% do PIB`);
    for (const t of [0, 1, 3, 6, TURNOS_MANDATO]) {
      const e = t === 0 ? criarPartida("teste", 42).estado : comSaude(valor, t);
      const c = e.essenciais;
      console.log(
        `  turno ${String(t).padStart(2)}`,
        ` gasto ${n(c.gasto_publico)}  nominal ${n(c.resultado_fiscal)}`,
        ` cofre ${n(c.cofre)}  dívida ${n(c.divida_publica)}`,
        ` saúde ${n(e.jogabilidade.saude)}`,
      );
    }
  }
}
