/**
 * Mede o mapa em uso: quadros por segundo, o pior quadro e quanto o desenho do
 * fundo custa. Só da tela; não guarda nada além da janela de medição atual.
 */
const MS_POR_SEGUNDO = 1000;

export type Medicao = Readonly<{
  fps: number;
  piorQuadroMs: number;
  fundoMs: number;
}>;

export type Medidor = Readonly<{
  /** Chamar uma vez por quadro, com o relógio do `requestAnimationFrame`. */
  quadro: (agora: number) => void;
  /** Chamar com o tempo gasto desenhando o fundo. */
  fundo: (ms: number) => void;
  /** Devolve a medição desde a última leitura e recomeça a janela. */
  ler: () => Medicao;
}>;

export function criarMedidor(): Medidor {
  let anterior = 0;
  let intervalos: number[] = [];
  let tempoDoFundo = 0;
  let desenhos = 0;
  return {
    quadro: (agora) => {
      if (anterior > 0) intervalos.push(agora - anterior);
      anterior = agora;
    },
    fundo: (ms) => {
      tempoDoFundo += ms;
      desenhos += 1;
    },
    ler: () => {
      const total = intervalos.reduce((soma, i) => soma + i, 0);
      const medicao = {
        fps: total > 0 ? (intervalos.length * MS_POR_SEGUNDO) / total : 0,
        piorQuadroMs: Math.max(0, ...intervalos),
        fundoMs: desenhos > 0 ? tempoDoFundo / desenhos : 0,
      };
      intervalos = [];
      tempoDoFundo = 0;
      desenhos = 0;
      return medicao;
    },
  };
}
