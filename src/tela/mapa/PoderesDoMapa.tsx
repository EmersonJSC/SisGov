/**
 * Os poderes no miolo do mapa, em camadas em volta do partido (a trindade, o
 * Executivo): os juízes do Judiciário ficam parados em volta dela, e o Congresso é um
 * anel de cadeiras por fora, a Câmara em cima e o Senado embaixo, voltadas para
 * dentro, como quem assiste ao partido e ao Judiciário. As cadeiras são desenhadas
 * no canvas do fundo (`fundoDoMapa.ts`); aqui ficam os juízes, os nomes e as áreas
 * que reagem ao mouse. A órbita é a corte suprema, cada juiz na cor do partido de
 * origem (técnico na cor do papel; vaga tracejada em vermelho). No miolo ficam os
 * tribunais que ela preside, com um fio dourado até o presidente.
 */
import { memo, useMemo } from "react";
import type { VisaoPoderes } from "../../partida";
import { retratoDaPessoa } from "../inicio/aparencia";
import { RECORTE_DO_ROSTO } from "./BolhaDoMapa";
import {
  ANEL_DO_CONGRESSO_ATE,
  ANEL_DO_CONGRESSO_DE,
  PODER_JUDICIARIO,
  PODER_LEGISLATIVO,
  RAIO_DA_ORBITA_DOS_JUIZES,
  RAIO_DO_JUIZ,
  RAIO_DO_TRIBUNAL,
  posicoesDosTribunais,
  posicoesNaOrbita,
} from "./organico";

const PAPEL = "#efe4cc";
const FUNDO = "#14161c";
const AZUL = "#78bef8";
const VERMELHO = "#eb5757";
/** Fio e aro do presidente de tribunal. */
const OURO = "#d9b45a";
const LETRA_DO_TRIBUNAL = 13;
const LETRA_DO_TITULO = 17;
const LETRA_DO_PLACEHOLDER = 11;
const RECUO_DO_TITULO = 20;
const AURA_DO_JUIZ = 1.35;
const METADE = 0.5;
const GIRO = Math.PI * 2;
/** Folga angular nas pontas das metades do anel, em graus. */
const GAP_DAS_METADES = 1;
const GRAUS = 180;
/** Faixa que reage ao mouse em volta da órbita dos juízes. */
const LARGURA_DA_ORBITA = 70;

type Eventos = Readonly<{
  aoEntrar: (id: string) => void;
  aoSair: () => void;
}>;

/** Meia-coroa entre dois raios: `cima` ou `baixo`, com uma folga nas pontas. */
function meiaCoroa(metade: "cima" | "baixo", r0: number, r1: number): string {
  const folga = (GAP_DAS_METADES * Math.PI) / GRAUS;
  const p = (r: number, a: number) =>
    `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  const de = metade === "cima" ? Math.PI + folga : folga;
  const ate = metade === "cima" ? GIRO - folga : Math.PI - folga;
  return `M ${p(r1, de)} A ${r1} ${r1} 0 0 1 ${p(r1, ate)} L ${p(r0, ate)} A ${r0} ${r0} 0 0 0 ${p(r0, de)} Z`;
}

const Legislativo = memo(function Legislativo({
  temSenado,
  eventos,
}: {
  temSenado: boolean;
  eventos: Eventos;
}) {
  const margem = 14;
  const de = ANEL_DO_CONGRESSO_DE - margem;
  const ate = ANEL_DO_CONGRESSO_ATE + margem;
  return (
    <g
      className="poder"
      onPointerEnter={() => eventos.aoEntrar(PODER_LEGISLATIVO)}
      onPointerLeave={eventos.aoSair}
    >
      {/* as áreas do anel que reagem ao mouse: as cadeiras em si ficam no fundo */}
      <path d={meiaCoroa("cima", de, ate)} fill="transparent" />
      {temSenado ? (
        <path d={meiaCoroa("baixo", de, ate)} fill="transparent" />
      ) : null}
      <text
        y={-ate - RECUO_DO_TITULO * METADE}
        fontSize={LETRA_DO_TITULO}
        fontWeight={700}
        fill={PAPEL}
        textAnchor="middle"
        className="bolha-nome"
        pointerEvents="none"
      >
        Câmara
      </text>
      {temSenado ? (
        <text
          y={ate + RECUO_DO_TITULO}
          fontSize={LETRA_DO_TITULO}
          fontWeight={700}
          fill={PAPEL}
          textAnchor="middle"
          className="bolha-nome"
          pointerEvents="none"
        >
          Senado
        </text>
      ) : null}
    </g>
  );
});

const Judiciario = memo(function Judiciario({
  poderes,
  eventos,
}: {
  poderes: VisaoPoderes["judiciario"];
  eventos: Eventos;
}) {
  const R = RAIO_DA_ORBITA_DOS_JUIZES;
  const { juizes } = poderes;
  const quantos = juizes.length;
  const posicoes = useMemo(() => posicoesNaOrbita(juizes, R), [juizes, R]);
  const tribunais = poderes.tribunais ?? [];
  const lugares = useMemo(() => posicoesDosTribunais(poderes), [poderes]);
  const indiceDoJuiz = new Map(juizes.map((j, i) => [j.id, i]));
  return (
    <g
      className="poder"
      onPointerEnter={() => eventos.aoEntrar(PODER_JUDICIARIO)}
      onPointerLeave={eventos.aoSair}
    >
      {/* a órbita: os juízes ficam parados em volta da trindade; relacionam-se com o do lado */}
      <circle
        r={R}
        fill="none"
        stroke={PAPEL}
        strokeOpacity={0.35}
        strokeWidth={1.5}
        strokeDasharray={poderes.pronto ? undefined : "10 8"}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        r={R}
        fill="none"
        stroke="transparent"
        strokeWidth={LARGURA_DA_ORBITA}
      />
      <g>
        {posicoes.map((p, i) => {
          const q = posicoes[(i + 1) % quantos];
          // o fio liga juízes do mesmo tribunal
          if (juizes[(i + 1) % quantos].tribunal !== juizes[i].tribunal)
            return null;
          return (
            <line
              key={juizes[i].id}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke={PAPEL}
              strokeOpacity={0.7}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
          );
        })}
        {juizes.map((j, i) => (
          <g
            key={j.id}
            transform={`translate(${posicoes[i].x} ${posicoes[i].y})`}
          >
            <g>
              <title>{j.rotulo ? `${j.rotulo} · ${j.nome}` : j.nome}</title>
              <circle
                r={RAIO_DO_JUIZ * AURA_DO_JUIZ}
                fill="none"
                stroke={j.vaga ? VERMELHO : PAPEL}
                strokeOpacity={j.vaga ? 0.9 : 0.4}
                strokeDasharray="3 4"
              />
              <circle r={RAIO_DO_JUIZ} fill={FUNDO} />
              {j.vaga ? null : (
                <image
                  href={retratoDaPessoa(j)}
                  x={-RAIO_DO_JUIZ}
                  y={-RAIO_DO_JUIZ}
                  width={RAIO_DO_JUIZ * 2}
                  height={RAIO_DO_JUIZ * 2}
                  clipPath={`url(#${RECORTE_DO_ROSTO})`}
                />
              )}
              <circle
                r={RAIO_DO_JUIZ}
                fill="none"
                stroke={j.vaga ? VERMELHO : j.cor}
                strokeWidth={2.5}
                strokeDasharray={j.vaga ? "4 3" : undefined}
              />
            </g>
          </g>
        ))}
        {/* os tribunais do miolo, cada um ligado ao juiz da órbita que o preside */}
        {tribunais.map((t, i) => {
          const lugar = lugares[i];
          const quem = t.presidente
            ? indiceDoJuiz.get(t.presidente)
            : undefined;
          const ele = quem === undefined ? null : posicoes[quem];
          const presidente = quem === undefined ? null : juizes[quem];
          return (
            <g key={t.id}>
              {ele ? (
                <line
                  x1={lugar.x}
                  y1={lugar.y}
                  x2={ele.x}
                  y2={ele.y}
                  stroke={OURO}
                  strokeOpacity={0.8}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                />
              ) : null}
              {ele ? (
                <circle
                  cx={ele.x}
                  cy={ele.y}
                  r={RAIO_DO_JUIZ + 3}
                  fill="none"
                  stroke={OURO}
                  strokeWidth={2}
                  pointerEvents="none"
                />
              ) : null}
              <g transform={`translate(${lugar.x} ${lugar.y})`}>
                <title>
                  {presidente
                    ? `${t.rotulo} · presidente: ${presidente.nome}`
                    : `${t.rotulo} · sem presidente`}
                </title>
                <circle
                  r={RAIO_DO_TRIBUNAL}
                  fill={FUNDO}
                  stroke={OURO}
                  strokeWidth={2}
                />
                <text
                  y={LETRA_DO_TRIBUNAL * 0.35}
                  fontSize={LETRA_DO_TRIBUNAL}
                  fontWeight={700}
                  fill={PAPEL}
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {t.rotulo}
                </text>
              </g>
            </g>
          );
        })}
      </g>
      <text
        y={R + RAIO_DO_JUIZ * 2 + RECUO_DO_TITULO}
        fontSize={LETRA_DO_TITULO}
        fontWeight={700}
        fill={PAPEL}
        textAnchor="middle"
        className="bolha-nome"
        pointerEvents="none"
      >
        Judiciário
      </text>
      {poderes.pronto ? null : (
        <text
          y={R + RAIO_DO_JUIZ * 2 + RECUO_DO_TITULO + LETRA_DO_PLACEHOLDER + 4}
          fontSize={LETRA_DO_PLACEHOLDER}
          fill={AZUL}
          textAnchor="middle"
          opacity={0.9}
          pointerEvents="none"
        >
          em construção
        </text>
      )}
    </g>
  );
});

export const PoderesDoMapa = memo(function PoderesDoMapa({
  poderes,
  aoEntrar,
  aoSair,
}: {
  poderes: VisaoPoderes;
  aoEntrar: (id: string) => void;
  aoSair: () => void;
}) {
  const eventos = useMemo(() => ({ aoEntrar, aoSair }), [aoEntrar, aoSair]);
  return (
    <g className="poderes">
      <Legislativo
        temSenado={poderes.legislativo.senado !== null}
        eventos={eventos}
      />
      <Judiciario poderes={poderes.judiciario} eventos={eventos} />
    </g>
  );
});
