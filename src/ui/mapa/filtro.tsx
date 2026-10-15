/**
 * Filtro das leis do mapa (pedido do autor, 15/out): mostra só as leis mais
 * populares no país ou num segmento, e as de valor mais alto. As que não
 * passam ficam apagadas, sem sair do lugar.
 */
import type { VisaoLei } from "../../app/partida";
import { nivelRelativo, type ReferenciaLeis } from "./intensidade";

export type FiltroDeLeis = Readonly<{
  /** "pais" ou o id de um segmento (grupo_...). */
  quem: string;
  /** Popularidade mínima, de 0 a 100 (0 = sem filtro). */
  popularidadeMinima: number;
  /** Valor mínimo da lei, de 0 a 100 (0 = sem filtro). */
  valorMinimo: number;
}>;

export const FILTRO_VAZIO: FiltroDeLeis = {
  quem: "pais",
  popularidadeMinima: 0,
  valorMinimo: 0,
};

export const filtroAtivo = (f: FiltroDeLeis) =>
  f.popularidadeMinima > 0 || f.valorMinimo > 0;

/** Popularidade da lei no país ou no segmento (50 = neutra quando não há dado). */
export function popularidadeDaLei(lei: VisaoLei, quem: string): number {
  const p = lei.popularidade;
  if (!p) return 50;
  return quem === "pais" ? p.pais : (p.segmentos[quem] ?? 50);
}

export function leiPassaNoFiltro(
  lei: VisaoLei,
  filtro: FiltroDeLeis,
  referencia: ReferenciaLeis,
): boolean {
  if (!filtroAtivo(filtro)) return true;
  if (
    filtro.popularidadeMinima > 0 &&
    popularidadeDaLei(lei, filtro.quem) < filtro.popularidadeMinima
  )
    return false;
  if (
    filtro.valorMinimo > 0 &&
    nivelRelativo(lei, referencia) * 100 < filtro.valorMinimo
  )
    return false;
  return true;
}

export function PainelDeFiltro({
  aberto,
  onAlternar,
  filtro,
  onMudar,
  segmentos,
  total,
  passam,
}: {
  aberto: boolean;
  onAlternar: () => void;
  filtro: FiltroDeLeis;
  onMudar: (f: FiltroDeLeis) => void;
  segmentos: readonly { id: string; nome: string }[];
  total: number;
  passam: number;
}) {
  return (
    <div
      className={`filtro-leis${aberto ? " aberto" : ""}`}
      onPointerDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={`filtro-leis-botao${filtroAtivo(filtro) ? " ligado" : ""}`}
        onClick={onAlternar}
        aria-expanded={aberto}
      >
        Filtros
        {filtroAtivo(filtro) ? <b>{passam}</b> : null}
      </button>
      {aberto ? (
        <div className="filtro-leis-painel">
          <label>
            Popularidade de
            <select
              value={filtro.quem}
              onChange={(e) => onMudar({ ...filtro, quem: e.target.value })}
            >
              <option value="pais">todo o país</option>
              {segmentos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Popularidade mínima: <b>{filtro.popularidadeMinima}</b>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={filtro.popularidadeMinima}
              onChange={(e) =>
                onMudar({ ...filtro, popularidadeMinima: +e.target.value })
              }
            />
          </label>
          <label>
            Valor mínimo da lei: <b>{filtro.valorMinimo}</b>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={filtro.valorMinimo}
              onChange={(e) =>
                onMudar({ ...filtro, valorMinimo: +e.target.value })
              }
            />
          </label>
          <p>
            {passam} de {total} leis em vigor passam no filtro.
          </p>
          <button type="button" onClick={() => onMudar(FILTRO_VAZIO)}>
            Limpar
          </button>
        </div>
      ) : null}
    </div>
  );
}
