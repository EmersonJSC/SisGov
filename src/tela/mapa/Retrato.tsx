/**
 * Retratos estilizados e provisórios dos ocupantes dos cargos.
 *
 * A `VisaoPartida` ainda não informa quem ocupa cada cargo (SG150 banco de
 * retratos, SG152 rosto do governo). Até lá, cada esfera recebe um retrato
 * fixo desenhado em SVG, só para a tela ter rostos. Não há nome nem
 * mecânica ligada a eles.
 */
import { useId } from "react";

type Cabelo =
  "curto" | "lateral" | "calvo" | "longo" | "coque" | "crespo" | "chanel";

export type Pessoa = Readonly<{
  pele: string;
  cabelo: Cabelo;
  corCabelo: string;
  paleto: string;
  gravata?: string;
  blusa?: string;
  barba?: boolean;
  oculos?: boolean;
  faixa?: boolean;
}>;

const PELE = ["#f3cfb1", "#e3b08a", "#c98d62", "#a46a43", "#7b4b2e"];

/** Pessoas provisórias por ministério (só aparência). */
const PESSOAS: Readonly<Record<string, Pessoa>> = {
  Fazenda: {
    pele: PELE[1],
    cabelo: "lateral",
    corCabelo: "#8c8c8c",
    paleto: "#24324a",
    gravata: "#3f6fb5",
    oculos: true,
  },
  "Indústria e Comércio": {
    pele: PELE[3],
    cabelo: "chanel",
    corCabelo: "#2b1d14",
    paleto: "#2e5856",
    blusa: "#e9e4d8",
  },
  "Meio Ambiente": {
    pele: PELE[3],
    cabelo: "curto",
    corCabelo: "#1d1712",
    paleto: "#3e5a3c",
    barba: true,
  },
  Trabalho: {
    pele: PELE[2],
    cabelo: "longo",
    corCabelo: "#2a1b12",
    paleto: "#7a2e2a",
    blusa: "#f1ebe0",
  },
  Previdência: {
    pele: PELE[0],
    cabelo: "calvo",
    corCabelo: "#9a958d",
    paleto: "#3a3d45",
    gravata: "#8a3d6a",
    oculos: true,
  },
  Saúde: {
    pele: PELE[1],
    cabelo: "coque",
    corCabelo: "#5a3a24",
    paleto: "#f4f2ee",
    blusa: "#c9414f",
  },
  Educação: {
    pele: PELE[4],
    cabelo: "crespo",
    corCabelo: "#1b1410",
    paleto: "#c58a1e",
    blusa: "#f3eee3",
    oculos: true,
  },
  Defesa: {
    pele: PELE[2],
    cabelo: "curto",
    corCabelo: "#2a2a2a",
    paleto: "#4c5a2a",
    gravata: "#2a3218",
  },
  Justiça: {
    pele: PELE[3],
    cabelo: "lateral",
    corCabelo: "#1a1410",
    paleto: "#1f2229",
    gravata: "#5d43a0",
    barba: true,
  },
  Cidades: {
    pele: PELE[2],
    cabelo: "calvo",
    corCabelo: "#3a2c22",
    paleto: "#5a4d40",
    gravata: "#c9a24a",
    barba: true,
  },
  "Direitos Humanos": {
    pele: PELE[4],
    cabelo: "longo",
    corCabelo: "#1b1410",
    paleto: "#7d2f4e",
    blusa: "#f3eee3",
  },
  "Casa Civil": {
    pele: PELE[0],
    cabelo: "chanel",
    corCabelo: "#b9a88a",
    paleto: "#2c3c5c",
    blusa: "#efe9de",
  },
};

export const PRESIDENTE: Pessoa = {
  pele: PELE[1],
  cabelo: "lateral",
  corCabelo: "#d9d6cf",
  paleto: "#1d2738",
  gravata: "#1d2738",
  faixa: true,
};

const RESERVAS: readonly Pessoa[] = Object.values(PESSOAS);

export function pessoaDoCargo(cargo: string, indice: number): Pessoa {
  return PESSOAS[cargo] ?? RESERVAS[indice % RESERVAS.length];
}

function escurecer(cor: string, fator: number) {
  const n = parseInt(cor.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * fator);
  const g = Math.round(((n >> 8) & 255) * fator);
  const b = Math.round((n & 255) * fator);
  return `rgb(${r},${g},${b})`;
}

function CabeloAtras({ p }: { p: Pessoa }) {
  const c = p.corCabelo;
  switch (p.cabelo) {
    case "longo":
      return (
        <path
          d="M-19 -6C-22 -29 -8 -32 0 -32C10 -32 22 -28 19 -6L22 26C14 31 -14 31 -22 26Z"
          fill={c}
        />
      );
    case "chanel":
      return (
        <path
          d="M-20 -6C-22 -29 -8 -32 0 -32C10 -32 22 -29 20 -6L21 9C15 12 -15 12 -21 9Z"
          fill={c}
        />
      );
    case "coque":
      return <circle cx="0" cy="-30" r="8.5" fill={c} />;
    case "crespo":
      return (
        <g fill={c}>
          <ellipse cx="0" cy="-15" rx="25" ry="22" />
          <circle cx="-19" cy="-4" r="8" />
          <circle cx="19" cy="-4" r="8" />
        </g>
      );
    default:
      return null;
  }
}

function CabeloFrente({ p }: { p: Pessoa }) {
  const c = p.corCabelo;
  switch (p.cabelo) {
    case "curto":
      return (
        <path
          d="M-16 -6C-17 -24 -8 -28 0 -28C10 -28 17 -23 16 -6C14 -14 10 -18 3 -19C-4 -18 -10 -17 -14 -12Z"
          fill={c}
        />
      );
    case "lateral":
      return (
        <path
          d="M-16 -4C-18 -25 -5 -29 2 -28.5C12 -27.5 18 -21 16 -5C15 -13 12 -17 8 -19C1 -20.5 -6 -15 -13 -15.5C-14.8 -12 -15.5 -8.5 -16 -4Z"
          fill={c}
        />
      );
    case "calvo":
      return (
        <g fill={c}>
          <path d="M-16 -3C-17 -12 -14.5 -16 -11 -17.5C-13 -12 -13.2 -8 -14 -1Z" />
          <path d="M16 -3C17 -12 14.5 -16 11 -17.5C13 -12 13.2 -8 14 -1Z" />
        </g>
      );
    case "longo":
    case "chanel":
      return (
        <path
          d="M-16 -3C-16 -22 -6 -27 2 -27C12 -26 17 -20 16 -3C12 -15 4 -20 -4 -18.5C-9 -15.5 -13 -10 -16 -3Z"
          fill={c}
        />
      );
    case "coque":
      return (
        <path
          d="M-16 -5C-17 -23 -7 -27 0 -27C8 -27 17 -23 16 -5C13 -15 7 -19 0 -19C-7 -19 -13 -15 -16 -5Z"
          fill={c}
        />
      );
    case "crespo":
      return (
        <path
          d="M-16 -7C-15 -20 -7 -24 0 -24C7 -24 15 -20 16 -7C11 -15 6 -17 0 -17C-6 -17 -11 -15 -16 -7Z"
          fill={c}
        />
      );
  }
}

/** Retrato redondo, centrado em (0, 0), raio 50 (use `transform` para escalar). */
export function Retrato({
  pessoa,
  cor,
  r = 50,
  x = 0,
  y = 0,
}: {
  pessoa: Pessoa;
  /** Cor do fundo (a do ministério). */
  cor: string;
  r?: number;
  x?: number;
  y?: number;
}) {
  const id = useId().replace(/:/g, "");
  const p = pessoa;
  const sombraPele = escurecer(p.pele, 0.82);
  const paletoEscuro = escurecer(p.paleto, 0.72);
  return (
    <g transform={`translate(${x} ${y}) scale(${r / 50})`} pointerEvents="none">
      <defs>
        <radialGradient id={`fundo-${id}`} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.55" stopColor={cor} stopOpacity="0.35" />
          <stop offset="1" stopColor={cor} stopOpacity="0.75" />
        </radialGradient>
        <clipPath id={`corte-${id}`}>
          <circle r="50" />
        </clipPath>
      </defs>
      <circle r="50" fill={`url(#fundo-${id})`} />
      <g clipPath={`url(#corte-${id})`}>
        <g transform="translate(0 6) scale(1.32)">
          <CabeloAtras p={p} />
          {/* pescoço */}
          <path d="M-7 6L-7.5 24Q0 29 7.5 24L7 6Z" fill={sombraPele} />
          {/* tronco */}
          <path
            d="M-48 54C-46 31 -31 24 -14 21L14 21C31 24 46 31 48 54Z"
            fill={p.paleto}
          />
          {p.gravata ? (
            <>
              <path d="M-11 21L0 41L11 21Z" fill="#f6f3ec" />
              <path
                d="M-3 23.5L3 23.5L4.6 40L0 45.5L-4.6 40Z"
                fill={p.gravata}
              />
              <path
                d="M-3.2 23.5L3.2 23.5L2 27.5L-2 27.5Z"
                fill={escurecer(p.gravata, 0.8)}
              />
            </>
          ) : (
            <path d="M-12 21Q0 39 12 21Z" fill={p.blusa ?? "#f3efe6"} />
          )}
          {p.blusa && !p.gravata ? (
            <path
              d="M-6.5 23.5Q0 29 6.5 23.5"
              stroke="#d8c08a"
              strokeWidth="1"
              fill="none"
            />
          ) : null}
          {/* lapelas */}
          <path d="M-14 21L-3.5 44L-9 22.5Z" fill={paletoEscuro} />
          <path d="M14 21L3.5 44L9 22.5Z" fill={paletoEscuro} />
          {p.faixa ? (
            <g>
              <path d="M-33 28L-24 23L34 56L22 58Z" fill="#0f8a4a" />
              <path d="M-29 26L-26.5 24.6L32 56.6L28.8 57.2Z" fill="#f2cb2e" />
              <circle
                cx="7"
                cy="45"
                r="3"
                fill="#f2cb2e"
                stroke="#c99a1a"
                strokeWidth=".7"
              />
            </g>
          ) : null}
          {/* cabeça */}
          <ellipse cx="-15.5" cy="-3" rx="3" ry="5" fill={p.pele} />
          <ellipse cx="15.5" cy="-3" rx="3" ry="5" fill={p.pele} />
          <ellipse cx="0" cy="-6" rx="15.5" ry="19" fill={p.pele} />
          <path
            d="M3 -25C12 -22 16 -14 15.5 -5C15 6 9 13 0 13C8 8 11 -2 9 -12C8 -18 6 -22 3 -25Z"
            fill="#000"
            opacity=".07"
          />
          {p.barba ? (
            <path
              d="M-14.5 1C-13.5 14 -7 19 0 19C7 19 13.5 14 14.5 1C11.5 8 7 10.5 0 10.5C-7 10.5 -11.5 8 -14.5 1Z"
              fill={p.corCabelo}
            />
          ) : null}
          {/* rosto */}
          <ellipse cx="-6" cy="-5.5" rx="1.7" ry="2.1" fill="#2a1d16" />
          <ellipse cx="6" cy="-5.5" rx="1.7" ry="2.1" fill="#2a1d16" />
          <path
            d="M-9.8 -10.8Q-6 -13 -2.6 -11.2M9.8 -10.8Q6 -13 2.6 -11.2"
            stroke={p.cabelo === "calvo" ? "#8a8079" : p.corCabelo}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M0.2 -4.5Q-1.8 1.6 1.2 2.6"
            stroke={sombraPele}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M-4.6 6.6Q0 9.6 4.6 6.6"
            stroke={p.barba ? "#5a2f24" : "#9a4a3c"}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {p.oculos ? (
            <g
              stroke="#2b2b2b"
              strokeWidth="1.2"
              fill="#ffffff"
              fillOpacity=".18"
            >
              <circle cx="-6" cy="-5.5" r="4.4" />
              <circle cx="6" cy="-5.5" r="4.4" />
              <path d="M-1.6 -5.8Q0 -7 1.6 -5.8" fill="none" />
            </g>
          ) : null}
          <CabeloFrente p={p} />
        </g>
      </g>
      <circle r="50" fill="none" stroke="#ffffff" strokeWidth="3.5" />
    </g>
  );
}
