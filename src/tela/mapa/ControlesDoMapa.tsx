/**
 * Controles do mapa: escolher a visão (o que dá peso às bolhas), buscar uma bolha
 * pelo nome, enquadrar tudo e a miniatura para se achar. Classes `org-`.
 */
import { memo, useMemo, useState, type RefObject } from "react";
import type { NoVivo, TipoDoNo } from "./organico";
import { VISOES, type IdDaVisao } from "./visoes";

const MAXIMO_DE_RESULTADOS = 8;
const LADO_DA_MINIATURA = 168;
const METADE = 0.5;
const ESPESSURA_DO_QUADRO = 0.012;

export type ItemDeBusca = Readonly<{
  id: string;
  nome: string;
  tipo: TipoDoNo;
}>;

const ROTULO_DO_TIPO: Readonly<Record<TipoDoNo, string>> = {
  lei: "Lei",
  indice: "Índice",
  ministro: "Ministro",
  instituicao: "Órgão",
};

const semAcento = (t: string) =>
  t
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export function ControlesDoMapa({
  visao,
  semDados,
  onVisao,
  itens,
  onEscolher,
  onEnquadrar,
}: {
  visao: IdDaVisao;
  /** Visões sem dado no motor ainda: o botão avisa. */
  semDados: readonly IdDaVisao[];
  onVisao: (v: IdDaVisao) => void;
  itens: readonly ItemDeBusca[];
  onEscolher: (id: string) => void;
  onEnquadrar: () => void;
}) {
  const [busca, setBusca] = useState("");
  const achados = useMemo(() => {
    const q = semAcento(busca.trim());
    return q.length < 2
      ? []
      : itens
          .filter((i) => semAcento(i.nome).includes(q))
          .slice(0, MAXIMO_DE_RESULTADOS);
  }, [busca, itens]);
  const atual = VISOES.find((v) => v.id === visao);
  return (
    <div className="org-controles">
      <div className="org-visoes" role="group" aria-label="Visão do mapa">
        {VISOES.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`${v.id === visao ? "ativa" : ""} ${semDados.includes(v.id) ? "sem-dado" : ""}`}
            title={
              semDados.includes(v.id) ? "Ainda sem dado no motor" : undefined
            }
            onClick={() => onVisao(v.id)}
          >
            {v.rotulo}
          </button>
        ))}
      </div>
      <p className="org-dica-da-visao">{atual?.dica}</p>
      <div className="org-busca">
        <input
          type="search"
          placeholder="Buscar lei ou índice…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar no mapa"
        />
        <button
          type="button"
          onClick={onEnquadrar}
          title="Mostrar todas as bolhas"
        >
          Enquadrar
        </button>
      </div>
      {achados.length ? (
        <ul className="org-achados">
          {achados.map((i) => (
            <li key={i.id}>
              <button
                type="button"
                onClick={() => {
                  onEscolher(i.id);
                  setBusca("");
                }}
              >
                <span className={`org-tipo ${i.tipo}`}>
                  {ROTULO_DO_TIPO[i.tipo]}
                </span>
                {i.nome}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

const Pontos = memo(function Pontos({
  nos,
}: {
  nos: readonly NoVivo[];
  versao: number;
}) {
  return (
    <>
      {nos.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.raio * 1.6}
          fill={n.tipo === "indice" ? "#cfd3dd" : n.cor}
          opacity={0.9}
        />
      ))}
    </>
  );
});

/**
 * Miniatura: pontos de todas as bolhas e o quadro do que se vê agora. O quadro é
 * movido de fora (`retangulo`), sem refazer a miniatura a cada gesto do mouse.
 */
export function Miniatura({
  nos,
  alcance,
  retangulo,
  versao,
  onIr,
}: {
  nos: readonly NoVivo[];
  alcance: number;
  retangulo: RefObject<SVGRectElement | null>;
  /** Muda quando as bolhas assentam. */
  versao: number;
  onIr: (x: number, y: number) => void;
}) {
  return (
    <svg
      className="org-miniatura"
      width={LADO_DA_MINIATURA}
      height={LADO_DA_MINIATURA}
      viewBox={`${-alcance} ${-alcance} ${alcance / METADE} ${alcance / METADE}`}
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onIr(
          ((e.clientX - r.left) / r.width - METADE) * (alcance / METADE),
          ((e.clientY - r.top) / r.height - METADE) * (alcance / METADE),
        );
      }}
    >
      <Pontos nos={nos} versao={versao} />
      <rect
        ref={retangulo}
        fill="none"
        stroke="#fff"
        strokeWidth={alcance * ESPESSURA_DO_QUADRO}
      />
    </svg>
  );
}
