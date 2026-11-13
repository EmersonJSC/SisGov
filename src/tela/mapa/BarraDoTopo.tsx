/**
 * Barra do topo: o estado do país de relance, como nos jogos de estratégia.
 * Esquerda o brasão e o país; centro poucos medidores (ícone, número e, onde faz
 * sentido, uma barra que enche); direita a data e a placa de passar o turno. O
 * detalhe vem num bilhete ao passar o mouse. Menus não moram aqui.
 */
import { useId, useState } from "react";
import { createPortal } from "react-dom";
import "./BarraDoTopo.css";
import { dinheiro, nomeDoPais, porAnoEPorTurno } from "./formatos";
import { Icone } from "./Icone";
import {
  apoioAtual,
  mesesParaEleicao,
  nomesGrupos,
  type Partida,
} from "../../partida";

type Linhas = readonly (readonly [string, string])[];
type Estado = "boa" | "ruim" | "neutra";

interface Medida {
  nome: string;
  icone: string;
  valor: string;
  estado: Estado;
  /** 0 a 1: quanto da barra está cheio; ausente = sem barra. */
  nivel?: number;
  /** 0 a 1: risco na barra (a marca da maioria no apoio). */
  marca?: number;
  titulo: string;
  linhas: Linhas;
  rodape?: string;
}

/** Dívida acima desta fração do PIB enche a barra toda. */
const DIVIDA_CHEIA = 1.5;
const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const comSinal = (v: number, simbolo: string) =>
  `${v < 0 ? "−" : "+"}${dinheiro(Math.abs(v), simbolo)}`;
const entre0e1 = (v: number) => Math.max(0, Math.min(1, v));

function prazo(meses: number | null): string {
  if (meses === null) return "sem eleição";
  if (meses <= 0) return "neste turno";
  return `${meses} ${meses === 1 ? "mês" : "meses"}`;
}

function Medidor({ m }: { m: Medida }) {
  const [posicao, setPosicao] = useState<{ x: number; y: number } | null>(null);
  const id = useId();
  const mostrar = (alvo: HTMLElement) => {
    const r = alvo.getBoundingClientRect();
    setPosicao({
      x: Math.min(Math.max(16, r.left), Math.max(16, innerWidth - 296)),
      y: r.bottom + 8,
    });
  };
  return (
    <>
      <button
        type="button"
        className={`topo-medidor topo-${m.estado}`}
        aria-label={`${m.nome}: ${m.valor}`}
        aria-describedby={posicao ? id : undefined}
        onMouseEnter={(e) => mostrar(e.currentTarget)}
        onMouseLeave={() => setPosicao(null)}
        onFocus={(e) => mostrar(e.currentTarget)}
        onBlur={() => setPosicao(null)}
      >
        <span className="topo-rebite">
          <Icone nome={m.icone} tamanho={20} />
        </span>
        <span className="topo-leitura">
          <strong>{m.valor}</strong>
          {m.nivel !== undefined && (
            <span className="topo-barra">
              <span style={{ width: `${entre0e1(m.nivel) * 100}%` }} />
              {m.marca !== undefined && (
                <i style={{ left: `${entre0e1(m.marca) * 100}%` }} />
              )}
            </span>
          )}
        </span>
      </button>
      {posicao &&
        createPortal(
          <div
            id={id}
            role="tooltip"
            className="topo-dica"
            style={{ left: posicao.x, top: posicao.y }}
          >
            <h4>{m.titulo}</h4>
            {m.linhas.map(([rotulo, valor]) => (
              <div className="topo-dica-linha" key={rotulo}>
                <span>{rotulo}</span>
                <strong>{valor}</strong>
              </div>
            ))}
            {m.rodape && <p>{m.rodape}</p>}
          </div>,
          document.body,
        )}
    </>
  );
}

/** Os cinco medidores do país, lidos do estado da partida. */
function medidas(partida: Partida): Medida[] {
  const { estado } = partida;
  const e = estado.essenciais;
  const moeda = partida.moeda;
  const fluxo = (pct: number) => porAnoEPorTurno(pct, e.pib_nominal, moeda);
  const apoio = apoioAtual(estado);
  const meses = mesesParaEleicao(partida);
  const [idPior, pior] = Object.entries(estado.grupos).reduce((a, b) =>
    b[1].satisfacao < a[1].satisfacao ? b : a,
  );
  const peso = estado.tesouro.divida / e.pib_nominal;
  return [
    {
      nome: "Caixa",
      icone: "cash",
      valor: comSinal(estado.tesouro.resultado, moeda),
      estado: estado.tesouro.resultado < 0 ? "ruim" : "boa",
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
    },
    {
      nome: "Dívida",
      icone: "bank",
      valor: dinheiro(estado.tesouro.divida, moeda),
      estado: peso > 1 ? "ruim" : "neutra",
      nivel: peso / DIVIDA_CHEIA,
      titulo: "Dívida pública",
      linhas: [
        ["Hoje", dinheiro(estado.tesouro.divida, moeda)],
        ["Do PIB", `${um(peso * 100)}%`],
        ["Cofre", dinheiro(estado.tesouro.cofre, moeda)],
        ["Juro", `${um(e.taxa_juros)}% ao ano`],
      ],
      rodape: "A barra cheia é dívida de uma vez e meia o PIB.",
    },
    {
      nome: "PIB",
      icone: "chart-line",
      valor: `${dinheiro(e.pib_nominal, moeda)}/ano`,
      estado: e.crescimento_real < 0 ? "ruim" : "neutra",
      titulo: "PIB (por ano)",
      linhas: [
        ["Hoje", `${dinheiro(e.pib_nominal, moeda)} por ano`],
        ["Crescimento real", `${um(e.crescimento_real)}% ao ano`],
      ],
    },
    {
      nome: "Apoio",
      icone: "account-group",
      valor: `${Math.round(apoio)}%`,
      estado: apoio > 50 ? "boa" : "ruim",
      nivel: apoio / 100,
      marca: 0.5,
      titulo: "Apoio se a eleição fosse hoje",
      linhas: [
        ["Hoje", `${um(apoio)}%`],
        ["Desgaste", `${um(estado.desgaste)} pontos`],
        [
          "Mais insatisfeito",
          `${nomesGrupos[idPior] ?? idPior} (${Math.round(pior.satisfacao)})`,
        ],
      ],
      rodape: "Acima de 50%, o governo vence.",
    },
    {
      nome: "Eleição",
      icone: "vote",
      valor: prazo(meses),
      estado: "neutra",
      titulo: "Próxima eleição",
      linhas: [["Em", prazo(meses)]],
      rodape: "O primeiro turno cai um turno antes do fim do mandato.",
    },
  ];
}

export function BarraDoTopo({
  partida,
  pedidos,
  aviso,
  onPassar,
}: {
  partida: Partida;
  pedidos: number;
  aviso: string;
  onPassar: () => void;
}) {
  const { estado } = partida;
  const ano = Math.floor(estado.turno / 6) + 1;
  const mes = (estado.turno % 6) * 2 + 1;
  return (
    <header className="topo">
      <div className="topo-pais">
        <span className="topo-brasao">
          <Icone nome="flag-variant-outline" tamanho={26} />
        </span>
        <strong>{nomeDoPais(partida.pais)}</strong>
      </div>
      <div className="topo-medidores" role="group" aria-label="Estado do país">
        {medidas(partida).map((m) => (
          <Medidor key={m.nome} m={m} />
        ))}
      </div>
      {aviso && <span className="topo-aviso">{aviso}</span>}
      <div className="topo-data">
        <small>Ano {ano}</small>
        <strong>mês {mes}</strong>
      </div>
      <button
        type="button"
        className="placa-ferro topo-turno"
        onClick={onPassar}
        disabled={estado.encerrada}
      >
        {estado.encerrada ? (
          "Partida encerrada"
        ) : (
          <>
            Passar o turno
            <small>
              {pedidos} pedido{pedidos === 1 ? "" : "s"}
            </small>
          </>
        )}
      </button>
    </header>
  );
}
