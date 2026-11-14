// Tamanho do governo: a régua escolhe um governo pronto; "Ajustar caixas" abre a
// mesa onde o jogador arrasta as instituições entre os ministérios.
import { useState, type DragEvent } from "react";
import {
  TAMANHOS,
  atencaoDaCaixa,
  caixaNova,
  instituicoesDoGabinete,
  moverInstituicao,
  nomeAutomatico,
  soltasDoGabinete,
  type CaixaDoGabinete,
} from "../../partida";
import type { Escolhas } from "./escolhas";

interface Props {
  e: Escolhas;
  mudar: (parcial: Partial<Escolhas>) => void;
  caixas: CaixaDoGabinete[];
  /** Quantos ministérios tem o governo pronto de cada parada da régua. */
  contagem: number[];
}

/** Abaixo disto o governo é pequeno; acima do segundo, grande; do terceiro, inchado. */
const POUCOS = 12;
const MUITOS = 22;
const DEMAIS = 28;
/** Atenção, em %, abaixo da qual o ministro está sobrecarregado. */
const POUCA_ATENCAO = 60;
const ATENCAO_CHEIA = 100;
const POR_CENTO = 100;

const nomeDe = (id: string) =>
  instituicoesDoGabinete().find((i) => i.id === id)?.nome ?? id;

function frase(n: number): string {
  if (n < POUCOS)
    return "Poucos ministros: sai barato de montar, mas cada um cuida de muita coisa e rende menos.";
  if (n < MUITOS)
    return "Equilibrado: ninguém fica sobrecarregado demais e ainda sobram cadeiras para os aliados.";
  if (n < DEMAIS)
    return "Cada ministro com foco, e cadeiras de sobra para dividir com os partidos aliados.";
  return "Ministério para todo aliado: muitas cadeiras sem pasta, só para segurar votos.";
}

function Escudo({ id }: { id: string }) {
  return (
    <span
      className="ini-escudo"
      draggable
      onDragStart={(ev) => ev.dataTransfer.setData("text/plain", id)}
    >
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
      </svg>
      {nomeDe(id)}
    </span>
  );
}

/** Área que recebe um escudo arrastado. */
function useAlvo(soltar: (instituicao: string) => void) {
  const [sobre, setSobre] = useState(false);
  return {
    className: sobre ? "alvo" : "",
    onDragOver: (ev: DragEvent) => {
      ev.preventDefault();
      setSobre(true);
    },
    onDragLeave: () => setSobre(false),
    onDrop: (ev: DragEvent) => {
      ev.preventDefault();
      setSobre(false);
      soltar(ev.dataTransfer.getData("text/plain"));
    },
  };
}

function Cadeira({
  caixa,
  onSoltar,
  onTirar,
  onRenomear,
}: {
  caixa: CaixaDoGabinete;
  onSoltar: (instituicao: string) => void;
  onTirar: () => void;
  onRenomear: (nome: string) => void;
}) {
  const alvo = useAlvo(onSoltar);
  return (
    <div {...alvo} className={`ini-cadeira-caixa ${alvo.className}`}>
      <button
        className="ini-tirar"
        onClick={onTirar}
        title="Tirar o ministério"
      >
        ✕
      </button>
      <input
        className="ini-nome-caixa"
        value={caixa.nome}
        onChange={(ev) => onRenomear(ev.target.value)}
      />
      <div className="ini-escudos">
        {caixa.instituicoes.map((i) => (
          <Escudo key={i} id={i} />
        ))}
        {caixa.instituicoes.length === 0 && (
          <span className="ini-sem-pasta">sem pasta: só um cargo</span>
        )}
      </div>
    </div>
  );
}

function Bandeja({
  sobra,
  soltas,
  onSoltar,
}: {
  sobra: CaixaDoGabinete | undefined;
  soltas: string[];
  onSoltar: (instituicao: string) => void;
}) {
  const alvo = useAlvo(onSoltar);
  const comPoder = instituicoesDoGabinete().filter((i) => i.poder);
  const daSobra = [...(sobra?.instituicoes ?? []), ...soltas];
  return (
    <div {...alvo} className={`ini-bandeja ${alvo.className}`}>
      <h3>{sobra?.nome ?? "Gabinete"}</h3>
      <p>Arraste para cá o que não terá ministério próprio.</p>
      <div className="ini-escudos">
        {daSobra.map((i) => (
          <Escudo key={i} id={i} />
        ))}
        {daSobra.length === 0 && <em>nenhuma</em>}
      </div>
      <p className="ini-observacao">
        Sem ministro:{" "}
        {comPoder
          .map(
            (i) =>
              `${i.nome} fica com ${i.poder === "legislativo" ? "o Congresso" : "o Judiciário"}`,
          )
          .join("; ")}
        .
      </p>
    </div>
  );
}

export function EtapaGoverno({ e, mudar, caixas, contagem }: Props) {
  const [ajustar, setAjustar] = useState(false);
  const parada = TAMANHOS.findIndex((t) => t.id === e.tamanho);
  const soltas = soltasDoGabinete(caixas);
  const sobra = caixas.find((c) => c.sobra);
  const comAtencao = caixas.map((c) => ({
    c,
    atencao: atencaoDaCaixa(caixas, c),
  }));
  const pior = comAtencao.reduce((a, b) => (b.atencao < a.atencao ? b : a));
  const vazias = caixas.filter((c) => !c.sobra && c.instituicoes.length === 0);

  const escolherParada = (i: number) =>
    mudar({
      tamanho: TAMANHOS[i].id,
      caixas: null,
      renomeadas: [],
      trocas: {},
    });

  /** Guarda a montagem; caixa que mudou e não foi renomeada ganha nome novo. */
  const montar = (novas: CaixaDoGabinete[]) =>
    mudar({
      caixas: novas.map((c) => {
        const antes = caixas.find((x) => x.id === c.id);
        const mudou =
          antes?.instituicoes.join() !== c.instituicoes.join() &&
          !c.sobra &&
          !e.renomeadas.includes(c.id);
        return mudou ? { ...c, nome: nomeAutomatico(c.instituicoes) } : c;
      }),
    });

  return (
    <section className="ini-dossie ini-governo">
      <header>
        <h2>Quantos ministérios?</h2>
      </header>
      <p className="ini-observacao">
        Cada ministério é uma cadeira e um ministro cuidando das instituições
        dele. Mais ministérios dão mais atenção a cada instituição e mais
        cadeiras para os aliados; menos deixam cada ministro com mais coisa.
      </p>
      <div className="ini-regua">
        <input
          type="range"
          min={0}
          max={TAMANHOS.length - 1}
          step={1}
          value={parada}
          onChange={(ev) => escolherParada(Number(ev.target.value))}
        />
        <div className="ini-marcas">
          {TAMANHOS.map((t, i) => (
            <button
              key={t.id}
              style={{ left: `${(i * POR_CENTO) / (TAMANHOS.length - 1)}%` }}
              className={!e.caixas && i === parada ? "ativo" : ""}
              onClick={() => escolherParada(i)}
            >
              {t.nome}
              <small>{contagem[i]}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="ini-total">
        {caixas.length} ministérios
        <small>{e.caixas ? "montagem sua" : TAMANHOS[parada].nome}</small>
      </div>
      <p className="ini-frase">{frase(caixas.length)}</p>
      <div className="ini-efeitos">
        <div
          className={`ini-efeito ${pior.atencao < POUCA_ATENCAO ? "ruim" : ""} ${pior.atencao >= ATENCAO_CHEIA ? "bom" : ""}`}
        >
          <b>Ministro mais carregado</b>
          {pior.c.nome}: cada instituição recebe {pior.atencao}% da atenção
        </div>
        <div className={`ini-efeito ${soltas.length ? "ruim" : "bom"}`}>
          <b>Sem ministério próprio</b>
          {soltas.length
            ? `${soltas.map(nomeDe).join(", ")}: com ${sobra?.nome ?? "o gabinete"}`
            : "todas as instituições têm ministério"}
        </div>
        <div className="ini-efeito">
          <b>Sem pasta</b>
          {vazias.length
            ? `${vazias.length} cadeira(s) só para dar cargo a aliado`
            : "nenhuma cadeira vazia"}
        </div>
      </div>
      <button
        className="placa-ferro placa-ferro-pequena ini-ajustar"
        onClick={() => setAjustar(!ajustar)}
      >
        {ajustar ? "Fechar ajuste" : "Ajustar caixas"}
      </button>
      {ajustar && (
        <div className="ini-ajuste">
          <div className="ini-mesa-caixas">
            {caixas
              .filter((c) => !c.sobra)
              .map((c) => (
                <Cadeira
                  key={c.id}
                  caixa={c}
                  onSoltar={(i) => montar(moverInstituicao(caixas, i, c.id))}
                  onTirar={() => montar(caixas.filter((x) => x.id !== c.id))}
                  onRenomear={(nome) =>
                    mudar({
                      caixas: caixas.map((x) =>
                        x.id === c.id ? { ...x, nome } : x,
                      ),
                      renomeadas: [...new Set([...e.renomeadas, c.id])],
                    })
                  }
                />
              ))}
            <button
              className="ini-nova-caixa"
              onClick={() => montar([...caixas, caixaNova(caixas)])}
            >
              + ministério
            </button>
          </div>
          <Bandeja
            sobra={sobra}
            soltas={soltas}
            onSoltar={(i) => montar(moverInstituicao(caixas, i, null))}
          />
        </div>
      )}
    </section>
  );
}
