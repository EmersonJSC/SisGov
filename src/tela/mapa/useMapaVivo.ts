/**
 * O mapa vivo: guarda a simulação das bolhas e a faz andar quadro a quadro.
 * As posições são escritas direto nos elementos do SVG (sem passar pelo React) e
 * só quando mudam, então mexer 600 bolhas não refaz a tela inteira.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { VisaoPartida } from "../../partida";
import {
  chaveDoMapa,
  PASSOS_INICIAIS,
  prepararOrganico,
  transformDoNo,
  type Preparo,
} from "./organico";
import { pesosDaVisao, raioDoPeso, type IdDaVisao } from "./visoes";

const ENERGIA_AO_ACORDAR = 0.6;
const ENERGIA_AO_ARRASTAR = 0.25;
/** Quanto do caminho até o raio-alvo a bolha anda a cada quadro. */
const SUAVIDADE = 0.14;
const DIFERENCA_MINIMA = 0.05;
/** Durante o crescimento, as forças são reiniciadas a cada tantos quadros. */
const QUADROS_ENTRE_REINICIOS = 3;
const PESO_SEM_DADO = 0.2;

export type Registro = Readonly<{
  no: (id: string) => (el: SVGGElement | null) => void;
}>;

export type MapaVivo = Readonly<{
  preparo: Preparo;
  registro: Registro;
  /** Muda a cada vez que a simulação assenta (a miniatura se refaz). */
  assentada: number;
  arrastar: (id: string, x: number, y: number) => void;
  soltar: (id: string) => void;
}>;

export function useMapaVivo(visao: VisaoPartida, id: IdDaVisao): MapaVivo {
  const chave = chaveDoMapa(visao);
  const anteriores = useRef<Map<string, { x: number; y: number }> | null>(null);
  const preparo = useMemo(
    () =>
      prepararOrganico(visao, {
        passos: PASSOS_INICIAIS,
        anteriores: anteriores.current ?? undefined,
      }),
    // a chave diz quando o conjunto de bolhas muda; os valores não refazem o mapa
    [chave],
  );
  const nos = useRef(new Map<string, SVGGElement>());
  const escritos = useRef(new Map<string, string>());
  const quadro = useRef<number | null>(null);
  const contagem = useRef(0);
  const [assentada, setAssentada] = useState(0);

  // um callback fixo por bolha: assim as peças memorizadas não se refazem
  const registro = useMemo<Registro>(() => {
    const guardados = new Map<string, (el: SVGGElement | null) => void>();
    return {
      no: (idDoElemento) => {
        const pronto = guardados.get(idDoElemento);
        if (pronto) return pronto;
        const novo = (el: SVGGElement | null) => {
          if (el) nos.current.set(idDoElemento, el);
          else nos.current.delete(idDoElemento);
        };
        guardados.set(idDoElemento, novo);
        return novo;
      },
    };
  }, []);

  /** Escreve só a posição das bolhas que andaram desde o último quadro. */
  const escrever = useCallback(() => {
    preparo.nos.forEach((n) => {
      const el = nos.current.get(n.id);
      if (!el) return;
      const t = transformDoNo(n);
      if (escritos.current.get(n.id) === t) return;
      escritos.current.set(n.id, t);
      el.setAttribute("transform", t);
    });
  }, [preparo]);

  const rodar = useCallback(() => {
    if (quadro.current !== null) return;
    const passo = () => {
      const sim = preparo.simulacao;
      const emTransicao = preparo.nos.some(
        (n) => Math.abs(n.raioAlvo - n.raio) > DIFERENCA_MINIMA,
      );
      if (emTransicao) {
        preparo.nos.forEach((n) => {
          n.raio += (n.raioAlvo - n.raio) * SUAVIDADE;
        });
        // as forças guardam o raio de cada bolha: avisar que mudou (de vez em quando basta)
        contagem.current += 1;
        if (contagem.current % QUADROS_ENTRE_REINICIOS === 0)
          sim.nodes(sim.nodes());
      }
      sim.tick();
      escrever();
      const parada = sim.alpha() < sim.alphaMin() && !emTransicao;
      if (parada) {
        quadro.current = null;
        setAssentada((v) => v + 1);
      } else {
        quadro.current = requestAnimationFrame(passo);
      }
    };
    quadro.current = requestAnimationFrame(passo);
  }, [preparo, escrever]);

  const acordar = useCallback(
    (energia: number) => {
      const sim = preparo.simulacao;
      sim.alpha(Math.max(sim.alpha(), energia));
      rodar();
    },
    [preparo, rodar],
  );

  // começa a andar quando o mapa nasce; ao sair, guarda onde as bolhas estavam
  useEffect(() => {
    escritos.current.clear();
    acordar(ENERGIA_AO_ACORDAR);
    return () => {
      if (quadro.current !== null) cancelAnimationFrame(quadro.current);
      quadro.current = null;
      anteriores.current = new Map(
        preparo.nos.map((n) => [n.id, { x: n.x, y: n.y }]),
      );
    };
  }, [preparo, acordar]);

  // a visão escolhida (e os valores do turno) dá o tamanho de cada bolha
  useEffect(() => {
    const pesos = pesosDaVisao(visao, id);
    preparo.nos.forEach((n) => {
      n.raioAlvo = pesos
        ? raioDoPeso(pesos.get(n.id) ?? PESO_SEM_DADO)
        : n.raioBase;
    });
    acordar(ENERGIA_AO_ACORDAR);
  }, [visao, id, preparo, acordar]);

  const arrastar = useCallback(
    (idDaBolha: string, x: number, y: number) => {
      const n = preparo.nos.find((b) => b.id === idDaBolha);
      if (!n) return;
      n.fx = x;
      n.fy = y;
      preparo.simulacao.alphaTarget(ENERGIA_AO_ARRASTAR);
      acordar(ENERGIA_AO_ARRASTAR);
    },
    [preparo, acordar],
  );
  const soltar = useCallback(
    (idDaBolha: string) => {
      const n = preparo.nos.find((b) => b.id === idDaBolha);
      if (n) {
        n.fx = null;
        n.fy = null;
      }
      preparo.simulacao.alphaTarget(0);
      acordar(ENERGIA_AO_ARRASTAR);
    },
    [preparo, acordar],
  );

  return { preparo, registro, assentada, arrastar, soltar };
}
