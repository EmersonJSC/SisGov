/**
 * A trindade no centro do mapa: presidente do partido, candidato eleito e vice,
 * três rostos em triângulo, ligados entre si, com a sigla do partido no meio.
 * Tudo na cor do partido. Não anda: as posições vêm de `organico.ts`.
 */
import { memo } from "react";
import type { VisaoTrindade } from "../../partida";
import { retratoDaPessoa } from "../inicio/aparencia";
import { RECORTE_DO_ROSTO } from "./BolhaDoMapa";
import {
  CENTRO_DA_TRINDADE,
  PREFIXO_TRINDADE,
  type FixoDoMapa,
} from "./organico";

const PAPEL = "#efe4cc";
const FUNDO = "#14161c";
const LETRA_DA_SIGLA = 21;
const LETRA_DO_CARGO = 11;
const DESCIDA_DO_CARGO = 16;
const ESPESSURA_DO_ANEL = 4;
const ESPESSURA_DO_FIO = 3;

const PAPEIS = [
  {
    id: `${PREFIXO_TRINDADE}candidato`,
    cargo: "Presidente eleito",
    de: "candidato",
  },
  {
    id: `${PREFIXO_TRINDADE}presidente`,
    cargo: "Presidente do partido",
    de: "presidente",
  },
  { id: `${PREFIXO_TRINDADE}vice`, cargo: "Vice", de: "vice" },
] as const;

export const TrindadeDoMapa = memo(function TrindadeDoMapa({
  trindade,
  fixos,
}: {
  trindade: VisaoTrindade;
  fixos: readonly FixoDoMapa[];
}) {
  const centro = fixos.find((f) => f.id === CENTRO_DA_TRINDADE);
  const rostos = PAPEIS.map((p) => ({
    ...p,
    f: fixos.find((f) => f.id === p.id),
    pessoa: trindade[p.de],
  })).filter((r) => r.f);
  if (!centro) return null;
  const contorno = rostos.map((r) => `${r.f!.x},${r.f!.y}`).join(" ");
  return (
    <g className="trindade">
      <polygon
        points={contorno}
        fill={trindade.cor}
        fillOpacity={0.12}
        stroke={trindade.cor}
        strokeWidth={ESPESSURA_DO_FIO}
        strokeLinejoin="round"
        pointerEvents="none"
      />
      <circle
        cx={centro.x}
        cy={centro.y}
        r={centro.raio}
        fill={trindade.cor}
        stroke={PAPEL}
        strokeWidth={ESPESSURA_DO_ANEL}
      />
      <text
        x={centro.x}
        y={centro.y}
        fontSize={LETRA_DA_SIGLA}
        fontWeight={800}
        fill={FUNDO}
        textAnchor="middle"
        dominantBaseline="middle"
        pointerEvents="none"
      >
        {trindade.sigla}
      </text>
      {rostos.map((r) => (
        <g key={r.id} transform={`translate(${r.f!.x} ${r.f!.y})`}>
          <title>{`${r.cargo}: ${r.pessoa.nome}`}</title>
          <circle r={r.f!.raio} fill={FUNDO} />
          <image
            href={retratoDaPessoa(r.pessoa)}
            x={-r.f!.raio}
            y={-r.f!.raio}
            width={r.f!.raio * 2}
            height={r.f!.raio * 2}
            clipPath={`url(#${RECORTE_DO_ROSTO})`}
          />
          <circle
            r={r.f!.raio}
            fill="none"
            stroke={trindade.cor}
            strokeWidth={ESPESSURA_DO_ANEL}
          />
          <text
            y={r.f!.raio + DESCIDA_DO_CARGO}
            fontSize={LETRA_DO_CARGO}
            textAnchor="middle"
            fill={PAPEL}
            className="bolha-nome"
            pointerEvents="none"
          >
            {r.pessoa.nome}
          </text>
        </g>
      ))}
    </g>
  );
});
