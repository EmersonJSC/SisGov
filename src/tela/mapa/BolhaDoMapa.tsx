/**
 * A bolha do mapa orgânico: um objeto com raio, anel de alcance e reação ao mouse.
 * Quatro formas: a lei (papel), o índice (círculo escuro), o ministro (rosto num
 * círculo) e a instituição (escudo com o ícone da esfera).
 * Os fios entre as bolhas ficam no canvas de fundo (`fundoDoMapa.ts`).
 */
import { memo, type PointerEvent } from "react";
import type { AlertaDoIndice, TendenciaDoIndice } from "../../partida";
import { IconeSvg } from "./Icone";
import { quebrarNome } from "./formatos";
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
const VERMELHO_DO_ALERTA = "#ff5a5a";
const VERDE_DO_BOM = "#6fcf97";
const RAIO_DA_SETA = 10;
const POSICAO_DA_SETA = 0.72;

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
  /** Só nos índices: o nível (cor do anel) e a tendência (a seta). */
  alerta?: AlertaDoIndice;
  tendencia?: TendenciaDoIndice;
  /** Raio, no mundo, da esfera de alcance (só na bolha em foco). */
  alcance: number | null;
  registrar: (el: SVGGElement | null) => void;
  aoApertar: (id: string, e: PointerEvent) => void;
  aoEntrar: (id: string) => void;
  aoSair: () => void;
  /** Abre o painel das leis que atrapalham e ajudam (ministro, instituição e índice). */
  aoAbrirPainel: (id: string) => void;
}>;

/** Onde fica o botão do painel, na diagonal de cima, e o tamanho dele (frações do raio). */
const POSICAO_DO_BOTAO = 0.8;
const TAMANHO_DO_BOTAO = 0.36;

/** Botão ao lado da bolha: duas barras, vermelha e verde, como os dois lados do painel. */
function BotaoDoPainel({
  r,
  nome,
  aberto,
}: {
  r: number;
  nome: string;
  aberto: () => void;
}) {
  const t = Math.max(11, r * TAMANHO_DO_BOTAO);
  const d = r * POSICAO_DO_BOTAO;
  return (
    <g
      className="bolha-painel"
      transform={`translate(${d} ${-d})`}
      role="button"
      aria-label={`Leis que ajudam e atrapalham: ${nome}`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        aberto();
      }}
    >
      <title>Ver o que atrapalha e o que ajuda</title>
      <circle r={t} className="bolha-painel-fundo" />
      <rect
        x={-t * 0.62}
        y={-t * 0.5}
        width={t * 0.5}
        height={t}
        rx={1.5}
        fill="#eb5757"
      />
      <rect
        x={t * 0.12}
        y={-t * 0.5}
        width={t * 0.5}
        height={t}
        rx={1.5}
        fill="#6fcf97"
      />
    </g>
  );
}

/** O nível do índice vira a cor do anel: vermelho preocupa, verde vai bem. */
function corDoNivel(alerta: AlertaDoIndice | undefined): string | undefined {
  if (alerta === "critico" || alerta === "preocupante")
    return VERMELHO_DO_ALERTA;
  return alerta === "bom" ? VERDE_DO_BOM : undefined;
}

/** A seta da tendência, no canto da bolha: separada do nível, que é a cor do anel. */
function Seta({
  tendencia,
  r,
}: {
  tendencia: TendenciaDoIndice | undefined;
  r: number;
}) {
  if (tendencia !== "piorando" && tendencia !== "melhorando") return null;
  const piora = tendencia === "piorando";
  const d = RAIO_DA_SETA;
  return (
    <g transform={`translate(${r * POSICAO_DA_SETA} ${-r * POSICAO_DA_SETA})`}>
      <circle r={d + 3} fill={FUNDO_DO_INDICE} />
      <path
        d={
          piora
            ? `M ${-d * 0.7} ${-d * 0.45} L ${d * 0.7} ${-d * 0.45} L 0 ${d * 0.7} Z`
            : `M ${-d * 0.7} ${d * 0.45} L ${d * 0.7} ${d * 0.45} L 0 ${-d * 0.7} Z`
        }
        fill={piora ? VERMELHO_DO_ALERTA : VERDE_DO_BOM}
      />
    </g>
  );
}

function Corpo({ p }: { p: PropsDaBolha }) {
  const { no } = p;
  const r = no.raioBase;
  const contorno = p.contorno ?? corDoNivel(p.alerta) ?? no.cor;
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
      {no.tipo === "indice" ? <Seta tendencia={p.tendencia} r={r} /> : null}
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
    p.alerta && p.alerta !== "normal" ? `alerta-${p.alerta}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const nomeSempre = no.tipo === "ministro" || no.tipo === "instituicao";
  // o título da lei só aparece com o mouse nela (ou quando ela está selecionada)
  const comTitulo =
    no.tipo === "lei"
      ? p.destaque === "foco"
      : p.comNome || p.destaque || nomeSempre;
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
        {comTitulo ? (
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
      {no.tipo !== "lei" ? (
        <BotaoDoPainel
          r={r}
          nome={p.nome}
          aberto={() => p.aoAbrirPainel(no.id)}
        />
      ) : null}
    </g>
  );
});
