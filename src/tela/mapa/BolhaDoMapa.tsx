/**
 * A bolha do mapa orgânico: um objeto com raio, anel de alcance e reação ao mouse.
 * Os fios entre as bolhas ficam no canvas de fundo (`fundoDoMapa.ts`).
 * A posição é escrita de fora (useMapaVivo); aqui só se lê a posição de agora.
 */
import { memo, type PointerEvent } from "react";
import { IconeSvg } from "./Icone";
import { quebrarNome } from "./layout";
import { transformDoNo, type NoVivo } from "./organico";

const TINTA = "#2a2118";
const PAPEL = "#efe4cc";
const FUNDO_DO_INDICE = "#2b2f3a";
const ESCALA_DO_ICONE = 1.9;
const FOLGA_DO_ANEL = 6;
const LETRA = 12;
const DESCIDA_DO_NOME = 5;

export type Destaque = "foco" | "vizinha" | undefined;

type PropsDaBolha = Readonly<{
  no: NoVivo;
  nome: string;
  icone: string;
  selecionada: boolean;
  destaque: Destaque;
  fraca: boolean;
  pulsa: boolean;
  comNome: boolean;
  /** Contorno que a visão pede (dinheiro: verde arrecada, vermelho gasta). */
  contorno?: string;
  /** Raio, no mundo, da esfera de alcance (só na bolha em foco). */
  alcance: number | null;
  registrar: (el: SVGGElement | null) => void;
  aoApertar: (id: string, e: PointerEvent) => void;
  aoEntrar: (id: string) => void;
  aoSair: () => void;
}>;

export const BolhaDoMapa = memo(function BolhaDoMapa(p: PropsDaBolha) {
  const { no } = p;
  const r = no.raioBase;
  const linhas = quebrarNome(p.nome);
  const fundamental = no.forca === "constitucional" || no.forca === "petrea";
  const k = no.raio / no.raioBase;
  const classes = [
    "bolha",
    `bolha-${no.tipo}`,
    p.destaque ? `destaque ${p.destaque}` : "",
    p.fraca ? "fraca" : "",
    p.selecionada ? "selecionada" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <g
      ref={p.registrar}
      className={classes}
      transform={transformDoNo(no)}
      role="button"
      aria-label={p.nome}
      data-lei={no.id}
      onPointerDown={(e) => p.aoApertar(no.id, e)}
      onPointerEnter={() => p.aoEntrar(no.id)}
      onPointerLeave={p.aoSair}
    >
      {p.alcance !== null ? (
        <circle className="bolha-alcance" r={p.alcance / k} fill={no.cor} />
      ) : null}
      {p.pulsa ? (
        <circle className="bolha-pulso" r={r} stroke={no.cor} />
      ) : null}
      <g className="bolha-corpo">
        {fundamental ? (
          <circle
            r={r + FOLGA_DO_ANEL}
            fill="none"
            stroke={no.cor}
            strokeWidth={2}
          />
        ) : null}
        <circle
          r={r}
          fill={no.tipo === "lei" ? PAPEL : FUNDO_DO_INDICE}
          stroke={p.contorno ?? no.cor}
          strokeWidth={p.selecionada ? 5 : 3}
        />
        <g className="bolha-icone">
          <IconeSvg
            nome={p.icone}
            tamanho={r * ESCALA_DO_ICONE}
            cor={no.tipo === "lei" ? TINTA : PAPEL}
          />
        </g>
        {p.comNome || p.destaque ? (
          <text
            className="bolha-nome"
            y={r + LETRA + DESCIDA_DO_NOME}
            fontSize={LETRA}
            textAnchor="middle"
            pointerEvents="none"
          >
            {linhas.map((t, i) => (
              <tspan key={t} x={0} dy={i ? LETRA + 1 : 0}>
                {t}
              </tspan>
            ))}
          </text>
        ) : null}
      </g>
    </g>
  );
});
