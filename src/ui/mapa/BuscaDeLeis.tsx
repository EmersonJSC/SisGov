/**
 * A lupa: procura uma lei (ou um indicador) pelo nome, pelas opções ou por
 * palavras do dia a dia ("privatizar", "juros"). Enter ou clique abre a
 * esfera do ministério e o documento da lei. Abre com o botão da barra, "/"
 * ou Ctrl+K.
 */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { VisaoArea, VisaoBolha, VisaoLei } from "../../app/partida";
import { buscar, type Resultado } from "./busca";
import { Icone } from "./Icone";
import { ICONE_BOLHA, ICONE_INTERFACE, ICONE_LEI } from "./icones";

const SUGESTOES = [
  "privatizar",
  "estatizar",
  "juros",
  "imposto de renda",
  "aposentadoria",
  "salário mínimo",
  "armas",
  "inflação",
];

export function BuscaDeLeis({
  leis,
  bolhas,
  governo,
  corDoMinisterio,
  onEscolher,
  onFechar,
}: {
  leis: readonly VisaoLei[];
  bolhas: readonly VisaoBolha[];
  governo: readonly VisaoArea[];
  corDoMinisterio: (ministerio: string) => string | undefined;
  onEscolher: (r: Resultado) => void;
  onFechar: () => void;
}) {
  const [consulta, setConsulta] = useState("");
  const [ativo, setAtivo] = useState(0);
  const entrada = useRef<HTMLInputElement>(null);
  const resultados = useMemo(
    () => buscar(consulta, leis, bolhas, governo),
    [consulta, leis, bolhas, governo],
  );

  useEffect(() => entrada.current?.focus(), []);
  useEffect(() => setAtivo(0), [consulta]);

  const escolher = (r: Resultado | undefined) => {
    if (!r) return;
    onEscolher(r);
    onFechar();
  };

  return (
    <div
      className="busca-fundo"
      role="dialog"
      aria-label="Buscar lei"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div className="busca">
        <label className="busca-campo">
          <Icone nome={ICONE_INTERFACE.busca} tamanho={24} />
          <input
            ref={entrada}
            value={consulta}
            placeholder="Buscar lei ou indicador: privatizar, juros, imposto de renda…"
            aria-label="Buscar lei ou indicador"
            onChange={(e) => setConsulta(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                onFechar();
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setAtivo((i) => Math.min(resultados.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setAtivo((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter") escolher(resultados[ativo]);
            }}
          />
          <kbd>Esc</kbd>
        </label>

        {consulta.trim().length < 2 ? (
          <div className="busca-vazia">
            <p>Experimente:</p>
            <div className="busca-sugestoes">
              {SUGESTOES.map((s) => (
                <button key={s} type="button" onClick={() => setConsulta(s)}>
                  {s}
                </button>
              ))}
            </div>
            <p className="busca-temas-titulo">Onde fica cada assunto:</p>
            <ul className="busca-temas">
              {governo.map((area) => (
                <li
                  key={area.id}
                  style={{ "--cor": corDoMinisterio(area.id) } as CSSProperties}
                >
                  <strong>
                    <Icone
                      nome={ICONE_INTERFACE[area.id] ?? "bank"}
                      tamanho={18}
                    />
                    {area.titulo}
                  </strong>
                  <span>{area.faz}</span>
                  <span className="busca-pastas">
                    {area.ministerios.map((m) => m.cargo).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : resultados.length === 0 ? (
          <p className="busca-nada">Nada encontrado para “{consulta}”.</p>
        ) : (
          <ul className="busca-resultados" role="listbox">
            {resultados.map((r, i) => (
              <li key={`${r.tipo}-${r.id}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === ativo}
                  className={i === ativo ? "ativo" : undefined}
                  onMouseEnter={() => setAtivo(i)}
                  onClick={() => escolher(r)}
                  style={
                    {
                      "--cor": r.ministerio
                        ? corDoMinisterio(r.ministerio)
                        : "#5f7290",
                    } as CSSProperties
                  }
                >
                  <span className="busca-icone">
                    <Icone
                      nome={
                        r.tipo === "lei"
                          ? (ICONE_LEI[r.id] ?? ICONE_INTERFACE.lei)
                          : (ICONE_BOLHA[r.id] ?? "chart-line")
                      }
                      tamanho={22}
                    />
                  </span>
                  <span className="busca-texto">
                    <strong>{r.nome}</strong>
                    <small>
                      <em className="busca-tema">{r.tema}</em>
                      {r.pasta ? ` · ${r.pasta}` : ""}
                      {r.vigente ? ` · em vigor: ${r.vigente}` : ""}
                    </small>
                    {r.motivo ? (
                      <small className="busca-motivo">{r.motivo}</small>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
