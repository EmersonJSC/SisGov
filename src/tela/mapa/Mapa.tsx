import { mapaDoMundo } from "../../partida";
import { nomeDaLei } from "../Leis";
import { montarLayout, RAIOS, ponto, type NoMapa } from "./layout";

const layout = montarLayout(mapaDoMundo);
const LIMITE = 760;

const corDaArea = new Map(mapaDoMundo.leis.map((l) => [l.id, l.area]));
const cores = new Map(mapaDoMundo.areas.map((a) => [a.id, a.cor]));

/** Fatia do anel das leis (setor entre dois raios). */
function setor(inicio: number, fim: number, de: number, ate: number) {
  const a = ponto(inicio, ate);
  const b = ponto(fim, ate);
  const c = ponto(fim, de);
  const d = ponto(inicio, de);
  const grande = fim - inicio > Math.PI ? 1 : 0;
  return `M${a.x},${a.y} A${ate},${ate} 0 ${grande} 1 ${b.x},${b.y} L${c.x},${c.y} A${de},${de} 0 ${grande} 0 ${d.x},${d.y} Z`;
}

/** Rótulo radial, para os nomes de um anel nunca se cruzarem. */
function Rotulo({ no, texto }: { no: NoMapa; texto: string }) {
  const direita = Math.sin(no.angulo) >= 0;
  const graus = (no.angulo * 180) / Math.PI - 90 + (direita ? 0 : 180);
  return (
    <text
      transform={`translate(${no.x} ${no.y}) rotate(${graus})`}
      x={direita ? 12 : -12}
      y={4}
      textAnchor={direita ? "start" : "end"}
      className="mapa-rotulo"
    >
      {texto}
    </text>
  );
}

export function Mapa() {
  const nomes = new Map(mapaDoMundo.indices.map((i) => [i.id, i.nome]));
  const gruposNome = new Map(mapaDoMundo.grupos.map((g) => [g.id, g.nome]));
  return (
    <svg
      className="mapa"
      viewBox={`${-LIMITE} ${-LIMITE} ${LIMITE * 2} ${LIMITE * 2}`}
      role="img"
      aria-label="Mapa: leis no centro, índices no meio, grupos por fora"
    >
      {[RAIOS.indices, RAIOS.grupos].map((r) => (
        <circle key={r} r={r} className="mapa-anel" />
      ))}
      {layout.fatias.map((f) => (
        <path
          key={f.id}
          d={setor(f.inicio, f.fim, 90, RAIOS.leis + 12)}
          fill={cores.get(f.id)}
          className="mapa-fatia"
        />
      ))}
      <circle r={80} className="mapa-presidencia" />
      <text className="mapa-presidencia-texto" textAnchor="middle" y={5}>
        Presidência
      </text>
      {layout.leis.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r={7}
            fill={cores.get(corDaArea.get(n.id) as string)}
          />
          <Rotulo no={n} texto={nomeDaLei(n.id)} />
        </g>
      ))}
      {layout.indices.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={6} className="mapa-indice" />
          <Rotulo no={n} texto={nomes.get(n.id) as string} />
        </g>
      ))}
      {layout.grupos.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={10} className="mapa-grupo" />
          <Rotulo no={n} texto={gruposNome.get(n.id) as string} />
        </g>
      ))}
    </svg>
  );
}
