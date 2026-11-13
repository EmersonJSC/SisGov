/**
 * A bolha do mapa orgânico: um objeto com raio, anel de alcance e reação ao mouse.
 * Quatro formas: a lei (papel), o índice (círculo escuro), o ministro (rosto num
 * círculo) e a instituição (escudo com o ícone da esfera).
 * Os fios entre as bolhas ficam no canvas de fundo (`fundoDoMapa.ts`).
 */
import { memo, type PointerEvent } from "react";
import { IconeSvg } from "./Icone";
import { quebrarNome } from "./layout";
import { transformDoNo, type NoVivo } from "./organico";

const TINTA = "#2a2118";
const PAPEL = "#efe4cc";
const FUNDO_DO_INDICE = "#2b2f3a";
const FUNDO_DA_INSTITUICAO = "#1b2230";
const OURO = "#e8c872";
const ESCALA_DO_ICONE = 1.9;
const ESCALA_DO_ICONE_DA_INSTITUICAO = 1.25;
const FOLGA_DO_ANEL = 6;
const LETRA = 12;
/** Ministro e instituição têm nome maior: são o que mais se procura no mapa. */
const LETRA_DO_PESO = 15;
const DESCIDA_DO_NOME = 5;
const BAIXA_DO_ESCUDO = 0.2;
const TOPO_DO_ESCUDO = 0.85;
const FUNDO_DO_ESCUDO = 1.1;
const CURVA_DO_ESCUDO = 0.9;

/** Id do recorte redondo compartilhado por todos os rostos (definido no SVG do mapa). */
export const RECORTE_DO_ROSTO = "recorte-do-rosto";

export type Destaque = "foco" | "vizinha" | undefined;

/** Contorno de um escudo de raio `r`, mais largo em cima e em ponta embaixo. */
function escudo(r: number): string {
  const topo = -r * TOPO_DO_ESCUDO;
  const meio = r * BAIXA_DO_ESCUDO;
  const curva = r * CURVA_DO_ESCUDO;
  return `M ${-r} ${topo} L ${r} ${topo} L ${r} ${meio} Q ${r} ${curva} 0 ${r * FUNDO_DO_ESCUDO} Q ${-r} ${curva} ${-r} ${meio} Z`;
}

type PropsDaBolha = Readonly<{
  no: NoVivo;
  nome: string;
  icone: string;
  /** Retrato (data URI) do ministro. */
  retrato?: string;
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

function Corpo({ p }: { p: PropsDaBolha }) {
  const { no } = p;
  const r = no.raioBase;
  const contorno = p.contorno ?? no.cor;
  const largura = p.selecionada ? 5 : 3;
  if (no.tipo === "ministro")
    return (
      <>
        <circle r={r} fill={FUNDO_DO_INDICE} />
        {p.retrato ? (
          <image
            href={p.retrato}
            x={-r}
            y={-r}
            width={r * 2}
            height={r * 2}
            clipPath={`url(#${RECORTE_DO_ROSTO})`}
            pointerEvents="none"
          />
        ) : null}
        <circle
          r={r}
          fill="none"
          stroke={p.selecionada ? "#fff" : contorno}
          strokeWidth={largura + 1}
        />
      </>
    );
  if (no.tipo === "instituicao")
    return (
      <>
        <path
          d={escudo(r)}
          fill={FUNDO_DA_INSTITUICAO}
          stroke={p.selecionada ? "#fff" : OURO}
          strokeWidth={largura}
          strokeLinejoin="round"
        />
        <path
          d={escudo(r * 0.82)}
          fill="none"
          stroke={contorno}
          strokeWidth={2}
          strokeLinejoin="round"
          opacity={0.9}
        />
        <IconeSvg
          nome={p.icone}
          tamanho={r * ESCALA_DO_ICONE_DA_INSTITUICAO}
          cor={PAPEL}
          y={-r * 0.1}
        />
      </>
    );
  const fundamental = no.forca === "constitucional" || no.forca === "petrea";
  return (
    <>
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
        stroke={p.selecionada ? "#fff" : contorno}
        strokeWidth={largura}
      />
      <g className="bolha-icone">
        <IconeSvg
          nome={p.icone}
          tamanho={r * ESCALA_DO_ICONE}
          cor={no.tipo === "lei" ? TINTA : PAPEL}
        />
      </g>
    </>
  );
}

export const BolhaDoMapa = memo(function BolhaDoMapa(p: PropsDaBolha) {
  const { no } = p;
  const r = no.raioBase;
  const linhas = quebrarNome(p.nome);
  const k = no.raio / no.raioBase;
  const classes = [
    "bolha",
    `bolha-${no.tipo}`,
    p.destaque ? `destaque ${p.destaque}` : "",
    p.fraca ? "fraca" : "",
    p.selecionada ? "selecionada" : "",
    no.semEfeito ? "sem-efeito" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const nomeSempre = no.tipo === "ministro" || no.tipo === "instituicao";
  const letra = nomeSempre ? LETRA_DO_PESO : LETRA;
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
        <Corpo p={p} />
        {p.comNome || p.destaque || nomeSempre ? (
          <text
            className="bolha-nome"
            y={r + letra + DESCIDA_DO_NOME}
            fontSize={letra}
            textAnchor="middle"
            pointerEvents="none"
          >
            {linhas.map((t, i) => (
              <tspan key={t} x={0} dy={i ? letra + 1 : 0}>
                {t}
              </tspan>
            ))}
          </text>
        ) : null}
      </g>
    </g>
  );
});
