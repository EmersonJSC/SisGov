/**
 * Barra do topo, herdada do projeto antigo (src/ui/mapa/TelaPrincipal.tsx em
 * f62c3fef): país, data, caixa, dívida e apoio com dica, salvar, carregar e recomeçar, e o
 * botão de passar o turno.
 */
import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { dinheiro, porAnoEPorTurno } from "./formatos";
import {
  apoioAtual,
  mesesParaEleicao,
  nomesGrupos,
  type Partida,
} from "../../partida";

type DicaDoChip = Readonly<{
  titulo: string;
  linhas: readonly (readonly [string, string])[];
  rodape?: string;
}>;

function ChipDado({
  rotulo,
  valor,
  classe,
  dica,
}: {
  rotulo: string;
  valor: string;
  classe?: string;
  dica: DicaDoChip;
}) {
  const [posicao, setPosicao] = useState<{
    esquerda: number;
    topo: number;
  } | null>(null);
  const idDica = useId();
  const mostrarDica = (alvo: HTMLElement) => {
    const rect = alvo.getBoundingClientRect();
    setPosicao({
      esquerda: Math.min(
        Math.max(16, rect.left),
        Math.max(16, window.innerWidth - 296),
      ),
      topo: rect.bottom + 8,
    });
  };
  return (
    <>
      <button
        type="button"
        className={`chip-dado${classe ? ` ${classe}` : ""}`}
        onMouseEnter={(evento) => mostrarDica(evento.currentTarget)}
        onMouseLeave={() => setPosicao(null)}
        onFocus={(evento) => mostrarDica(evento.currentTarget)}
        onBlur={() => setPosicao(null)}
        aria-describedby={posicao ? idDica : undefined}
      >
        <small>{rotulo}</small>
        <strong>{valor}</strong>
      </button>
      {posicao
        ? createPortal(
            <div
              id={idDica}
              className="chip-dica"
              role="tooltip"
              style={{ left: posicao.esquerda, top: posicao.topo }}
            >
              <h4>{dica.titulo}</h4>
              {dica.linhas.map(([rotuloLinha, valorLinha]) => (
                <div className="chip-dica-linha" key={rotuloLinha}>
                  <span>{rotuloLinha}</span>
                  <strong>{valorLinha}</strong>
                </div>
              ))}
              {dica.rodape ? <p>{dica.rodape}</p> : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const comSinal = (v: number, simbolo: string) =>
  `${v < 0 ? "−" : "+"}${dinheiro(Math.abs(v), simbolo)}`;

function prazo(meses: number | null): string {
  if (meses === null) return "sem eleição";
  if (meses <= 0) return "neste turno";
  return `${meses} ${meses === 1 ? "mês" : "meses"}`;
}

export function BarraDoTopo({
  partida,
  pedidos,
  aviso,
  podeCarregar,
  onPassar,
  onSalvar,
  onCarregar,
  onRecomecar,
  onMercado,
  onFichas,
}: {
  partida: Partida;
  pedidos: number;
  aviso: string;
  podeCarregar: boolean;
  onPassar: () => void;
  onSalvar: () => void;
  onCarregar: () => void;
  onRecomecar: () => void;
  onMercado: () => void;
  onFichas: () => void;
}) {
  const { estado } = partida;
  const e = estado.essenciais;
  const moeda = partida.moeda;
  const fluxo = (pct: number) => porAnoEPorTurno(pct, e.pib_nominal, moeda);
  const ano = Math.floor(estado.turno / 6) + 1;
  const mes = (estado.turno % 6) * 2 + 1;
  const apoio = apoioAtual(estado);
  const [idPior, pior] = Object.entries(estado.grupos).reduce((a, b) =>
    b[1].satisfacao < a[1].satisfacao ? b : a,
  );
  const { potencias, indiceReputacao, indiceSegurancaExterna } = partida.regras;
  const reputacao = indiceReputacao
    ? estado.jogabilidade[indiceReputacao]
    : undefined;
  const segExterna = indiceSegurancaExterna
    ? estado.jogabilidade[indiceSegurancaExterna]
    : undefined;
  const classeMundo = (v: number) =>
    v > 70 ? "boa" : v < 40 ? "ruim" : "neutra";
  const plural = pedidos === 1 ? "" : "s";

  return (
    <header className="barra-superior">
      <div className="pais">
        <div>
          <strong>{partida.pais}</strong>
          <small>
            Ano {ano} · mês {mes}
          </small>
        </div>
      </div>
      <div className="metricas" role="group" aria-label="Indicadores do país">
        <ChipDado
          rotulo="Caixa"
          valor={comSinal(estado.tesouro.resultado, moeda)}
          classe={estado.tesouro.resultado < 0 ? "ruim" : "boa"}
          dica={{
            titulo: "Caixa",
            linhas: [
              ["Entra", fluxo(e.arrecadacao)],
              ["Sai com as leis", fluxo(e.gasto_publico)],
              ["Juros da dívida", fluxo(e.juros_pagos)],
              [
                e.resultado_fiscal < 0 ? "Falta" : "Sobra",
                fluxo(Math.abs(e.resultado_fiscal)),
              ],
            ],
            rodape: "No ritmo do último turno.",
          }}
        />
        <ChipDado
          rotulo="Dívida"
          valor={dinheiro(estado.tesouro.divida, moeda)}
          classe="neutra"
          dica={{
            titulo: "Dívida pública",
            linhas: [
              ["Hoje", dinheiro(estado.tesouro.divida, moeda)],
              ...(estado.mudanca
                ? ([
                    ["Neste turno", comSinal(estado.mudanca.divida, moeda)],
                  ] as const)
                : []),
              ["Cofre", dinheiro(estado.tesouro.cofre, moeda)],
              ["Juro", `${um(e.taxa_juros)}% ao ano`],
            ],
          }}
        />
        <ChipDado
          rotulo="PIB"
          valor={`${dinheiro(e.pib_nominal, moeda)}/ano`}
          classe="neutra"
          dica={{
            titulo: "PIB (por ano)",
            linhas: [
              ["Hoje", `${dinheiro(e.pib_nominal, moeda)} por ano`],
              ...(estado.mudanca
                ? ([
                    ["Neste turno", comSinal(estado.mudanca.pib, moeda)],
                  ] as const)
                : []),
              ["Crescimento real", `${um(e.crescimento_real)}% ao ano`],
            ],
          }}
        />
        <ChipDado
          rotulo="Apoio"
          valor={`${Math.round(apoio)}%`}
          classe={apoio > 50 ? "boa" : "ruim"}
          dica={{
            titulo: "Apoio se a eleição fosse hoje",
            linhas: [
              ["Hoje", `${um(apoio)}%`],
              ["Desgaste", `${um(estado.desgaste)} pontos`],
              [
                "Mais insatisfeito",
                `${nomesGrupos[idPior] ?? idPior} (${Math.round(pior.satisfacao)})`,
              ],
              ["Eleição em", prazo(mesesParaEleicao(partida))],
            ],
            rodape: "Acima de 50%, o governo vence.",
          }}
        />
        {potencias && reputacao !== undefined ? (
          <ChipDado
            rotulo="Reputação"
            valor={`${Math.round(reputacao)}`}
            classe={classeMundo(reputacao)}
            dica={{
              titulo: "Reputação internacional",
              linhas: potencias.map((p) => [
                p.nome,
                `${Math.round(estado.opinioes[p.id] ?? 0)}`,
              ]),
              rodape:
                "Média das opiniões das potências, pelo peso de cada uma.",
            }}
          />
        ) : null}
        {segExterna !== undefined ? (
          <ChipDado
            rotulo="Seg. externa"
            valor={`${Math.round(segExterna)}`}
            classe={classeMundo(segExterna)}
            dica={{
              titulo: "Segurança externa",
              linhas: [
                [
                  "Poder defensivo",
                  `${Math.round(estado.jogabilidade[partida.regras.indicePoderDefensivo ?? ""] ?? 0)}`,
                ],
                ["Reputação", `${Math.round(reputacao ?? 0)}`],
              ],
              rodape: "Poder defensivo menos o que falta de reputação.",
            }}
          />
        ) : null}
      </div>
      {aviso ? <span className="aviso-barra">{aviso}</span> : null}
      <nav className="abas-topo" aria-label="Partida">
        <button type="button" className="aba-topo" onClick={onMercado}>
          Mercado
        </button>
        <button type="button" className="aba-topo" onClick={onFichas}>
          Setores
        </button>
        <button type="button" className="aba-topo" onClick={onSalvar}>
          Salvar
        </button>
        <button
          type="button"
          className="aba-topo"
          onClick={onCarregar}
          disabled={!podeCarregar}
        >
          Carregar
        </button>
        <button type="button" className="aba-topo" onClick={onRecomecar}>
          Recomeçar
        </button>
      </nav>
      <button
        type="button"
        className="botao-turno"
        onClick={onPassar}
        disabled={estado.encerrada}
      >
        {estado.encerrada
          ? "Partida encerrada"
          : `Passar o turno (${pedidos} pedido${plural})`}
      </button>
    </header>
  );
}
