// Quem senta em cada cadeira: retratos com o quanto cada ministro rende ali.
// Clicar numa cadeira abre três cartas: o técnico, o aliado e o do seu partido.
import { useState } from "react";
import {
  instituicoesDoGabinete,
  rendeNaCaixa,
  type CaixaDoGabinete,
  type PessoaDaLista,
  type PreparoDoComeco,
} from "../../partida";
import { Foto } from "./Foto";
import { ListaDePessoas } from "./ListaDePessoas";
import type { Escolhas } from "./escolhas";

interface Props {
  e: Escolhas;
  mudar: (parcial: Partial<Escolhas>) => void;
  preparo: PreparoDoComeco;
  caixas: CaixaDoGabinete[];
  /** Quem cuida de cada caixa agora: o sorteio mais o que o jogador trocou. */
  ministros: Record<string, string>;
  onTrocar: (caixa: string, pessoa: string) => void;
}

const TECNICO = "tecnico";
/** Rende abaixo disto é pouco; a partir do segundo, bem. */
const RENDE_POUCO = 40;
const RENDE_BEM = 60;
const LEALDADE_BAIXA = 55;
const LEALDADE_ALTA = 70;

const nota = (v: number) => {
  if (v < RENDE_POUCO) return "ruim";
  return v < RENDE_BEM ? "meio" : "bom";
};

const nomesDe = (ids: string[]) =>
  ids.map(
    (id) => instituicoesDoGabinete().find((i) => i.id === id)?.nome ?? id,
  );

const media = (valores: number[]) =>
  valores.length
    ? Math.round(valores.reduce((a, b) => a + b, 0) / valores.length)
    : 0;

function Carta({
  tipo,
  cor,
  pessoa,
  rende,
  cadeiras,
  onEscolher,
}: {
  tipo: string;
  cor: string;
  pessoa: PessoaDaLista;
  rende: number;
  cadeiras: number;
  onEscolher: () => void;
}) {
  return (
    <button className="ini-carta" onClick={onEscolher}>
      <span className={`ini-carta-tipo ${cor}`}>{tipo}</span>
      <Foto pessoa={pessoa} />
      <b>{pessoa.nome}</b>
      <small>{pessoa.origemNome}</small>
      <span className="ini-tracos">
        <span>
          Rende aqui<i className={nota(rende)}>{rende}</i>
        </span>
        <span>
          Cadeiras do partido<i>{cadeiras}</i>
        </span>
        <span>
          Lealdade<i>{pessoa.lealdade}</i>
        </span>
      </span>
    </button>
  );
}

export function EtapaMinisterios({
  e,
  mudar,
  preparo,
  caixas,
  ministros,
  onTrocar,
}: Props) {
  const [aberta, setAberta] = useState<string | null>(null);
  const [verTodos, setVerTodos] = useState(false);
  const pessoa = (id: string | undefined) =>
    preparo.pessoas.find((p) => p.id === id);
  const daChapa = Object.values(e.chapa);
  const seuPartido = new Set(
    daChapa
      .map((id) => pessoa(id ?? "")?.origem)
      .filter((o): o is string => !!o && o !== TECNICO),
  );
  const cadeirasDe = (origem: string) =>
    preparo.partidos.find((p) => p.id === origem)?.cadeiras ?? 0;

  const sentados = caixas.flatMap((c) => {
    const p = pessoa(ministros[c.id]);
    return p ? [{ c, p, rende: rendeNaCaixa(p.competencia, caixas, c) }] : [];
  });
  const partidosNoGoverno = [
    ...new Set(sentados.map((s) => s.p.origem).filter((o) => o !== TECNICO)),
  ];
  const rende = media(sentados.map((s) => s.rende));
  const lealdade = media(sentados.map((s) => s.p.lealdade));
  const cadeiras = partidosNoGoverno.reduce((t, o) => t + cadeirasDe(o), 0);

  const caixa = caixas.find((c) => c.id === aberta);
  const ocupados = new Set(Object.values(ministros));
  const livres = preparo.pessoas.filter(
    (p) => !daChapa.includes(p.id) && !ocupados.has(p.id),
  );
  const melhorQue = (cabe: (p: PessoaDaLista) => boolean) =>
    livres
      .filter(cabe)
      .reduce<PessoaDaLista | undefined>(
        (a, p) => (a && a.competencia >= p.competencia ? a : p),
        undefined,
      );
  const cartas = [
    {
      tipo: "O técnico",
      cor: "tecnico",
      p: melhorQue((p) => p.origem === TECNICO),
    },
    {
      tipo: "O aliado",
      cor: "aliado",
      p: melhorQue((p) => p.origem !== TECNICO && !seuPartido.has(p.origem)),
    },
    {
      tipo: "O do seu partido",
      cor: "seu",
      p: melhorQue((p) => seuPartido.has(p.origem)),
    },
  ];
  const ordem = [...caixas].sort(
    (a, b) => b.instituicoes.length - a.instituicoes.length,
  );

  const escolher = (id: string) => {
    if (caixa) onTrocar(caixa.id, id);
    setAberta(null);
    setVerTodos(false);
  };

  return (
    <section className="ini-dossie ini-ministerios">
      <header>
        <h2>Quem senta em cada cadeira?</h2>
        <button
          className="placa-ferro placa-ferro-pequena"
          onClick={() => mudar({ rodada: e.rodada + 1, trocas: {} })}
        >
          Sortear de novo
        </button>
      </header>
      <p className="ini-observacao">
        Clique numa cadeira para trocar. O número é quanto o ministro rende ali:
        quem cuida de muitas instituições rende menos.
      </p>
      <div className="ini-efeitos">
        <div
          className={`ini-efeito ${rende < RENDE_POUCO ? "ruim" : ""} ${rende >= RENDE_BEM ? "bom" : ""}`}
        >
          <b>Rendimento</b>média {rende}
        </div>
        <div className="ini-efeito">
          <b>Partidos com ministro</b>
          {partidosNoGoverno.length} partidos, {cadeiras} cadeiras
        </div>
        <div
          className={`ini-efeito ${lealdade < LEALDADE_BAIXA ? "ruim" : ""} ${lealdade >= LEALDADE_ALTA ? "bom" : ""}`}
        >
          <b>Lealdade</b>média {lealdade}
        </div>
      </div>
      {caixa && (
        <div className="ini-escolha">
          <h3>Quem senta em {caixa.nome}?</h3>
          <p>
            {nomesDe(caixa.instituicoes).join(" · ") ||
              "Sem pasta: só um cargo para aliado."}
          </p>
          <div className="ini-cartas">
            {cartas.map(
              ({ tipo, cor, p }) =>
                p && (
                  <Carta
                    key={tipo}
                    tipo={tipo}
                    cor={cor}
                    pessoa={p}
                    rende={rendeNaCaixa(p.competencia, caixas, caixa)}
                    cadeiras={cadeirasDe(p.origem)}
                    onEscolher={() => escolher(p.id)}
                  />
                ),
            )}
          </div>
          <div className="ini-escolha-acoes">
            <button
              className="placa-ferro placa-ferro-pequena"
              onClick={() => setVerTodos(true)}
            >
              Ver todos
            </button>
            <button
              className="placa-ferro placa-ferro-pequena"
              onClick={() => setAberta(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      <div className="ini-cadeiras">
        {ordem.map((c) => {
          const p = pessoa(ministros[c.id]);
          const r = p ? rendeNaCaixa(p.competencia, caixas, c) : 0;
          return (
            <button
              key={c.id}
              className={`ini-cadeira ${aberta === c.id ? "aberta" : ""}`}
              title={nomesDe(c.instituicoes).join(", ") || "sem pasta"}
              onClick={() => setAberta(aberta === c.id ? null : c.id)}
            >
              <Foto pessoa={p ?? null} />
              <b>{c.nome}</b>
              <small>{p?.nome ?? "vaga"}</small>
              {p && <span className={`ini-nota ${nota(r)}`}>{r}</span>}
            </button>
          );
        })}
      </div>
      {caixa && verTodos && (
        <ListaDePessoas
          titulo={caixa.nome}
          pais={e.pais}
          semente={e.semente}
          pessoas={preparo.pessoas.filter((p) => !daChapa.includes(p.id))}
          partidos={preparo.partidos}
          onFechar={() => setVerTodos(false)}
          onEscolher={escolher}
        />
      )}
    </section>
  );
}
