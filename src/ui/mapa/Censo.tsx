import { emCada } from "../../app/partida/frase";
import type {
  VisaoCensoAtributo,
  VisaoCensoFaixa,
} from "../../app/partida/tipos";
import { retangulos } from "./treemap";

/**
 * O censo: quem mora no país que o jogador governa (Grupos, camada A).
 *
 * Uma ficha por atributo, com a forma que couber: pizza até seis faixas,
 * treemap acima disso. Pizza de nove fatias não se lê — as fatias finas
 * ficam do tamanho da borda —, e é justamente a Ocupação que tem nove.
 *
 * Sem tendência de propósito: os perfis são conteúdo fixo até a camada C
 * (movimento), então seta de "subiu desde o turno passado" seria mentira.
 */

/**
 * Paleta categórica do tema escuro, na ordem fixa da referência de dataviz
 * (validada: banda de luminosidade, piso de croma, separação para daltonismo
 * e contraste no fundo do jogo). Nunca ciclada: da nona faixa em diante a cor
 * dobra para o cinza, mas o nome continua na lista.
 */
const CORES = [
  "#3987e5",
  "#d95926",
  "#199e70",
  "#c98500",
  "#d55181",
  "#008300",
  "#9085e9",
  "#e66767",
] as const;
const SEM_COR = "#6d727c";
/** Acima de seis fatias a pizza deixa de se ler: vira treemap. */
const FATIAS_QUE_CABEM = 6;
const TINTA_ESCURA = "#10131a";
const TINTA_CLARA = "#fbfaf7";

type FaixaPintada = VisaoCensoFaixa & { cor: string };

/** Luminância relativa (WCAG), para escolher a tinta por medida. */
function luminancia(cor: string): number {
  const canal = (i: number) =>
    parseInt(cor.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  const linear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return (
    0.2126 * linear(canal(0)) +
    0.7152 * linear(canal(1)) +
    0.0722 * linear(canal(2))
  );
}

/**
 * A tinta que se lê melhor em cima da cor, pelo contraste calculado e não por
 * um corte de luminância chutado: num amarelo como `#c98500` o branco dá 3:1 e
 * o quase-preto dá 7:1, e um corte mal posto escolhe o branco.
 */
function tintaSobre(cor: string): string {
  const fundo = luminancia(cor);
  const contra = (tinta: string) => {
    const t = luminancia(tinta);
    return (Math.max(fundo, t) + 0.05) / (Math.min(fundo, t) + 0.05);
  };
  return contra(TINTA_ESCURA) >= contra(TINTA_CLARA)
    ? TINTA_ESCURA
    : TINTA_CLARA;
}

function porcento(parte: number): string {
  return `${(parte * 100).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}

const RAIO = 50;

/** Uma fatia da pizza, do ângulo que entra ao ângulo que sai. */
function fatia(de: number, ate: number): string {
  // Fatia inteira não tem corda: vira um círculo, não um arco.
  if (ate - de >= 1)
    return `M ${RAIO} 0 A ${RAIO} ${RAIO} 0 1 1 ${-RAIO} 0 A ${RAIO} ${RAIO} 0 1 1 ${RAIO} 0 Z`;
  const ponto = (v: number) => {
    const a = v * 2 * Math.PI - Math.PI / 2;
    return `${(Math.cos(a) * RAIO).toFixed(3)} ${(Math.sin(a) * RAIO).toFixed(3)}`;
  };
  return `M 0 0 L ${ponto(de)} A ${RAIO} ${RAIO} 0 ${ate - de > 0.5 ? 1 : 0} 1 ${ponto(ate)} Z`;
}

function Pizza({ faixas }: { faixas: readonly FaixaPintada[] }) {
  let anda = 0;
  return (
    <svg viewBox="-54 -54 108 108" className="censo-pizza" aria-hidden="true">
      {faixas.map((faixa) => {
        const de = anda;
        anda += faixa.parte;
        return (
          <path
            key={faixa.id}
            d={fatia(de, anda)}
            fill={faixa.cor}
            /* O vão entre fatias é a cor do fundo: separa sem desenhar linha. */
            stroke="var(--papel, #171511)"
            strokeWidth={1.5}
          >
            <title>{`${faixa.nome}: ${porcento(faixa.parte)}`}</title>
          </path>
        );
      })}
    </svg>
  );
}

const LARGURA_TREEMAP = 100;
const ALTURA_TREEMAP = 74;
/** Abaixo disso o nome não cabe dentro do retângulo. */
const CABE_NOME = 17;

function Treemap({ faixas }: { faixas: readonly FaixaPintada[] }) {
  const caixas = retangulos(
    faixas.map((f) => f.parte),
    { x: 0, y: 0, largura: LARGURA_TREEMAP, altura: ALTURA_TREEMAP },
  );
  return (
    <svg
      viewBox={`0 0 ${LARGURA_TREEMAP} ${ALTURA_TREEMAP}`}
      className="censo-treemap"
      aria-hidden="true"
    >
      {caixas.map((caixa, i) => {
        const faixa = faixas[i];
        return (
          <g key={faixa.id}>
            <rect
              x={caixa.x}
              y={caixa.y}
              width={caixa.largura}
              height={caixa.altura}
              fill={faixa.cor}
              stroke="var(--papel, #171511)"
              strokeWidth={1}
            >
              <title>{`${faixa.nome}: ${porcento(faixa.parte)}`}</title>
            </rect>
            {caixa.largura >= CABE_NOME && caixa.altura >= 9 ? (
              <text
                x={caixa.x + 2.5}
                y={caixa.y + 7}
                fontSize={5}
                fill={tintaSobre(faixa.cor)}
              >
                {porcento(faixa.parte)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function Censo({
  censo,
  habitantes,
  perfis,
}: {
  censo: readonly VisaoCensoAtributo[];
  habitantes?: number;
  perfis?: number;
}) {
  return (
    <section className="pagina-aba pagina-censo" aria-label="População">
      <div className="pagina-aba-cabeca">
        <small>POPULAÇÃO</small>
        <h1>Quem mora no país</h1>
        <p className="nota">
          {habitantes !== undefined
            ? `${(habitantes / 1_000_000).toLocaleString("pt-BR", {
                maximumFractionDigits: 1,
              })} milhões de habitantes`
            : "O eleitorado"}
          {perfis ? `, em ${perfis.toLocaleString("pt-BR")} perfis` : ""}. Cada
          pessoa entra em todos os quadros: uma faixa por atributo.
        </p>
      </div>

      <div className="censo-fichas">
        {censo.map((atributo) => {
          const faixas: FaixaPintada[] = atributo.faixas.map((f, i) => ({
            ...f,
            cor: (CORES[i] as string | undefined) ?? SEM_COR,
          }));
          return (
            <article className="censo-ficha" key={atributo.id}>
              <h2>{atributo.nome}</h2>
              <div className="censo-desenho">
                {faixas.length > FATIAS_QUE_CABEM ? (
                  <Treemap faixas={faixas} />
                ) : (
                  <Pizza faixas={faixas} />
                )}
              </div>
              <ul className="censo-faixas">
                {faixas.map((faixa) => (
                  <li
                    key={faixa.id}
                    className={
                      faixa.grupo ? "censo-faixa" : "censo-faixa sem-grupo"
                    }
                  >
                    <span
                      className="censo-marca"
                      style={{ background: faixa.cor }}
                    />
                    <span className="censo-nome">
                      {faixa.nome}
                      {faixa.grupo ? null : <small>sem grupo no mapa</small>}
                      {/* A mesma frase das bolhas: gente, não porcentagem. */}
                      {emCada(faixa.parte * 100) ? (
                        <em>{emCada(faixa.parte * 100)}</em>
                      ) : null}
                    </span>
                    <strong className="censo-parte">
                      {porcento(faixa.parte)}
                    </strong>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <p className="nota censo-rodape">
        As faixas marcadas como sem grupo existem na simulação e não têm bolha
        no mapa: nenhuma lei as faz mexer à vista de quem joga.
      </p>
    </section>
  );
}
