/**
 * App "Bússola" do tablet (V1-10, docs/v1/desenho/bussola.md): o ponto do
 * jogador, o caminho desde a posse, as personalidades ou os partidos de
 * referência e as leis que mais puxam o ponto. Cada referência mostra de onde
 * veio o número (fonte, partido e anos).
 */
import { useState } from "react";
import type {
  VisaoBussola,
  VisaoPontoBussola,
  VisaoReferencia,
} from "../../app/partida";

const LADO = 420;
const MARGEM = 26;
const x = (p: VisaoPontoBussola) =>
  MARGEM + ((p.economia + 10) / 20) * (LADO - 2 * MARGEM);
const y = (p: VisaoPontoBussola) =>
  MARGEM + ((10 - p.costumes) / 20) * (LADO - 2 * MARGEM);
const um = (v: number) => (Math.round(v * 10) / 10).toFixed(1);

/** Para onde o ponto puxa, em palavras. */
function sentido(economia: number, costumes: number): string {
  const partes = [];
  if (Math.abs(economia) >= 0.25)
    partes.push(economia < 0 ? "Estado" : "mercado");
  if (Math.abs(costumes) >= 0.25)
    partes.push(costumes < 0 ? "liberdade" : "autoridade");
  return partes.join(" e ");
}

type Caixa = Readonly<{ x: number; y: number; l: number; a: number }>;
type Lugar = Readonly<{
  dx: number;
  dy: number;
  ancora: "start" | "end" | "middle";
}>;
const cruza = (a: Caixa, b: Caixa) =>
  a.x < b.x + b.l && b.x < a.x + a.l && a.y < b.y + b.a && b.y < a.y + a.a;

/**
 * Quais nomes cabem no gráfico sem encostar em outro nome nem em outro
 * ponto: primeiro o escolhido, depois os mais perto de você, depois os mais
 * afastados do centro. Cada nome tenta a direita, a esquerda, acima e abaixo.
 */
function rotulos(
  lista: readonly VisaoReferencia[],
  primeiro: readonly string[],
  voce: VisaoPontoBussola,
): ReadonlyMap<string, Lugar> {
  const ordem = [
    ...primeiro
      .map((id) => lista.find((r) => r.id === id))
      .filter((r): r is VisaoReferencia => r !== undefined),
    ...[...lista].sort(
      (a, b) =>
        Math.hypot(b.economia, b.costumes) - Math.hypot(a.economia, a.costumes),
    ),
  ];
  const ocupado: Caixa[] = [{ x: x(voce) - 22, y: y(voce) - 26, l: 44, a: 36 }];
  const pontos = new Map(
    lista.map((r) => [r.id, { x: x(r) - 4, y: y(r) - 4, l: 8, a: 8 }]),
  );
  const lugar = new Map<string, Lugar>();
  for (const r of ordem) {
    if (lugar.has(r.id)) continue;
    const l = r.nome.length * 6;
    const opcoes: readonly (readonly [Lugar, Caixa])[] = [
      [
        { dx: 7, dy: 3.5, ancora: "start" },
        { x: x(r) + 6, y: y(r) - 7, l, a: 13 },
      ],
      [
        { dx: -7, dy: 3.5, ancora: "end" },
        { x: x(r) - 6 - l, y: y(r) - 7, l, a: 13 },
      ],
      [
        { dx: 0, dy: -8, ancora: "middle" },
        { x: x(r) - l / 2, y: y(r) - 19, l, a: 13 },
      ],
      [
        { dx: 0, dy: 16, ancora: "middle" },
        { x: x(r) - l / 2, y: y(r) + 5, l, a: 13 },
      ],
    ];
    const outros = [...pontos].filter(([id]) => id !== r.id).map(([, c]) => c);
    for (const [qual, caixa] of opcoes) {
      if (caixa.x < 2 || caixa.x + caixa.l > LADO - 2) continue;
      if (caixa.y < 2 || caixa.y + caixa.a > LADO - 2) continue;
      if ([...ocupado, ...outros].some((o) => cruza(o, caixa))) continue;
      ocupado.push(caixa);
      lugar.set(r.id, qual);
      break;
    }
  }
  return lugar;
}

function Ficha({ r }: { r: VisaoReferencia }) {
  return (
    <div className="bs-ficha">
      <strong>{r.nome}</strong>
      <span>
        {[r.pais, r.partido, r.anos.join(", ")].filter(Boolean).join(" · ")}
      </span>
      <span>
        Economia {um(r.economia)} · Costumes {um(r.costumes)}
      </span>
    </div>
  );
}

export function BussolaPolitica({ bussola }: { bussola: VisaoBussola }) {
  const [camada, setCamada] = useState<"personalidades" | "partidos">(
    "personalidades",
  );
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const lista =
    camada === "personalidades" ? bussola.personalidades : bussola.partidos;
  const perto =
    camada === "personalidades"
      ? bussola.pertoPersonalidades
      : bussola.pertoPartidos;
  const comNome = rotulos(
    lista,
    [escolhida ?? "", ...perto.slice(0, 3).map((p) => p.id)],
    bussola.ponto,
  );
  const selecionada = lista.find((r) => r.id === escolhida);
  const caminho = [...bussola.caminho, { turno: -1, ...bussola.ponto }];
  return (
    <div className="bs-app">
      <figure className="bs-grafico">
        <svg
          viewBox={`0 0 ${LADO} ${LADO}`}
          role="img"
          aria-label={`Bússola política: você está em economia ${um(bussola.ponto.economia)} e costumes ${um(bussola.ponto.costumes)}`}
        >
          <rect
            className="bs-q bs-q-ea"
            x={MARGEM}
            y={MARGEM}
            width={LADO / 2 - MARGEM}
            height={LADO / 2 - MARGEM}
          />
          <rect
            className="bs-q bs-q-ma"
            x={LADO / 2}
            y={MARGEM}
            width={LADO / 2 - MARGEM}
            height={LADO / 2 - MARGEM}
          />
          <rect
            className="bs-q bs-q-el"
            x={MARGEM}
            y={LADO / 2}
            width={LADO / 2 - MARGEM}
            height={LADO / 2 - MARGEM}
          />
          <rect
            className="bs-q bs-q-ml"
            x={LADO / 2}
            y={LADO / 2}
            width={LADO / 2 - MARGEM}
            height={LADO / 2 - MARGEM}
          />
          <line
            className="bs-eixo"
            x1={MARGEM}
            x2={LADO - MARGEM}
            y1={LADO / 2}
            y2={LADO / 2}
          />
          <line
            className="bs-eixo"
            y1={MARGEM}
            y2={LADO - MARGEM}
            x1={LADO / 2}
            x2={LADO / 2}
          />
          <text
            className="bs-rotulo-eixo"
            x={LADO / 2}
            y={16}
            textAnchor="middle"
          >
            Autoridade
          </text>
          <text
            className="bs-rotulo-eixo"
            x={LADO / 2}
            y={LADO - 8}
            textAnchor="middle"
          >
            Liberdade
          </text>
          <text className="bs-rotulo-eixo" x={6} y={LADO / 2 - 6}>
            Estado
          </text>
          <text
            className="bs-rotulo-eixo"
            x={LADO - 6}
            y={LADO / 2 - 6}
            textAnchor="end"
          >
            Mercado
          </text>
          {lista.map((r) => (
            <g
              key={r.id}
              className={`bs-ref${r.id === escolhida ? " escolhida" : ""}`}
              onClick={() => setEscolhida(r.id === escolhida ? null : r.id)}
            >
              <title>{`${r.nome} (${[r.pais, r.partido, r.anos.join(", ")].filter(Boolean).join(", ")})`}</title>
              <circle cx={x(r)} cy={y(r)} r={r.id === escolhida ? 5.5 : 4} />
              {comNome.has(r.id) ? (
                <text
                  x={x(r) + comNome.get(r.id)!.dx}
                  y={y(r) + comNome.get(r.id)!.dy}
                  textAnchor={comNome.get(r.id)!.ancora}
                >
                  {r.nome}
                </text>
              ) : null}
            </g>
          ))}
          <polyline
            className="bs-caminho"
            points={caminho.map((p) => `${x(p)},${y(p)}`).join(" ")}
          />
          <g className="bs-inicio">
            <title>Onde as leis do país estavam na posse</title>
            <circle cx={x(bussola.inicio)} cy={y(bussola.inicio)} r={4.5} />
          </g>
          <g className="bs-voce">
            <circle cx={x(bussola.ponto)} cy={y(bussola.ponto)} r={8} />
            <text
              x={x(bussola.ponto)}
              y={y(bussola.ponto) - 13}
              textAnchor="middle"
            >
              Você
            </text>
          </g>
        </svg>
        <figcaption>
          Economia {um(bussola.ponto.economia)} · Costumes{" "}
          {um(bussola.ponto.costumes)}. O círculo vazio é onde as leis do país
          estavam na posse; o que você muda conta{" "}
          {bussola.fatorDoRumo.economia.toLocaleString("pt-BR")} vezes na
          economia e {bussola.fatorDoRumo.costumes.toLocaleString("pt-BR")} nos
          costumes.
        </figcaption>
      </figure>

      <aside className="bs-lado">
        <div className="bs-camadas" role="group" aria-label="Referências">
          <button
            type="button"
            aria-pressed={camada === "personalidades"}
            onClick={() => {
              setCamada("personalidades");
              setEscolhida(null);
            }}
          >
            Personalidades
          </button>
          <button
            type="button"
            aria-pressed={camada === "partidos"}
            onClick={() => {
              setCamada("partidos");
              setEscolhida(null);
            }}
          >
            Partidos
          </button>
        </div>

        {selecionada ? <Ficha r={selecionada} /> : null}

        <section>
          <h2>Mais perto de você</h2>
          <ol className="bs-perto">
            {perto.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => setEscolhida(p.id)}>
                  <strong>{p.nome}</strong>
                  <span>{[p.pais, p.partido].filter(Boolean).join(" · ")}</span>
                </button>
                <span className="bs-distancia">{um(p.distancia)}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2>O que mais puxa o seu ponto</h2>
          <ul className="bs-leis">
            {bussola.leisQueMaisPuxam.map((l) => (
              <li key={l.id} title={l.porque}>
                <strong>{l.nome}</strong>
                <span>para {sentido(l.economia, l.costumes)}</span>
              </li>
            ))}
          </ul>
        </section>

        <details className="bs-fonte">
          <summary>De onde vêm os pontos</summary>
          <p>
            Pessoas e partidos: {bussola.fonte} Uma personalidade fica onde o
            partido dela estava nos anos em que governou ou liderou.
          </p>
          <p>
            Leis: cada opção puxa para um lado conforme os temas do Manifesto
            Project; emenda pesa 3, lei 2 e o resto 1.
          </p>
          {bussola.semMedida.length ? (
            <p>
              Sem medida na base:{" "}
              {bussola.semMedida.map((s) => s.nome).join(", ")}.
            </p>
          ) : null}
        </details>
      </aside>
    </div>
  );
}
