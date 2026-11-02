/**
 * Janela "Setores": a ficha de cada setor (dono, importação, capital de fora,
 * preço). O jogador escolhe, vê o aviso de 6 turnos e propõe: cada mudança vai
 * à fila como projeto de lei e o Congresso vota (fatia 8).
 */
import { useMemo, useState } from "react";
import {
  nomesGrupos,
  previaDaFicha,
  type Partida,
  type Pedido,
  type VisaoFicha,
  type VisaoPartida,
} from "../../partida";
import { comPedido } from "../fila";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { ICONE_INTERFACE } from "./icones";

const PAPEL: Record<string, string> = {
  dono: "Quem é o dono",
  importacao: "Importação",
  estrangeiro: "Capital de fora",
  preco: "Preço",
};

const n1 = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const sinal = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1, signDisplay: "exceptZero" });
const pct = (v: number) => `${Math.round(v * 100)}%`;

type Escolhas = Partial<Record<VisaoFicha["escolhas"][number]["papel"], string>>;

export function Fichas({
  partida,
  visao,
  fila,
  setFila,
  onFechar,
  ...janela
}: JanelaProps & {
  partida: Partida;
  visao: VisaoPartida;
  fila: Pedido[];
  setFila: (f: Pedido[]) => void;
  onFechar: () => void;
}) {
  const [id, setId] = useState(visao.fichas[0]?.id);
  const ficha = visao.fichas.find((f) => f.id === id);
  // o que está na fila ou, sem pedido, o que vale hoje
  const doSetor = (f: VisaoFicha): Escolhas =>
    Object.fromEntries(
      f.escolhas.map((e) => [
        e.papel,
        (fila.find((p) => p.lei === e.lei)?.valor as string) ?? e.vigente,
      ]),
    );
  const [rascunho, setRascunho] = useState<Record<string, Escolhas>>({});
  const escolhas: Escolhas = ficha ? { ...doSetor(ficha), ...rascunho[ficha.id] } : {};
  const previa = useMemo(
    () => (ficha ? previaDaFicha(partida, ficha.id, escolhas) : null),
    [partida, ficha, JSON.stringify(escolhas)],
  );
  if (!ficha || !previa) return null;

  const propor = () => {
    let nova = fila;
    for (const e of ficha.escolhas)
      nova = comPedido(nova, partida, e.lei, escolhas[e.papel] ?? e.vigente);
    setFila(nova);
    setRascunho({ ...rascunho, [ficha.id]: {} });
  };
  const nomeGrupo = (g: string) => nomesGrupos[g] ?? g;
  const muda = previa.mudancas.length > 0;
  const naFila = ficha.escolhas.some((e) => fila.some((p) => p.lei === e.lei));

  return (
    <Documento
      orgao="Setores"
      setor="Propriedade e capital"
      numero={`Ano ${Math.floor(visao.turno / 6) + 1}`}
      cor="#4f7a8c"
      icone={ICONE_INTERFACE.pib}
      onFechar={onFechar}
      rotulo="Setores"
      {...janela}
    >
      <div className="folha mercado-janela ficha-janela">
        <div className="mercado-abas" role="tablist">
          {visao.fichas.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={f.id === id}
              className={f.id === id ? "ativa" : ""}
              onClick={() => setId(f.id)}
            >
              {f.nome}
            </button>
          ))}
        </div>
        <p className="folha-explica">{ficha.descricao}</p>
        <p className="ficha-estado">
          Estado: <strong>{pct(ficha.fatia)}</strong> do setor · Capital de
          fora: <strong>{pct(ficha.estrangeiro)}</strong>
          {ficha.estrategico ? " · Setor estratégico" : ""}
        </p>
        {ficha.escolhas.map((e) => (
          <section key={e.lei}>
            <h2>{PAPEL[e.papel]}</h2>
            <div className="ficha-opcoes" role="radiogroup">
              {e.opcoes.map((o) => (
                <button
                  key={o.id}
                  role="radio"
                  aria-checked={escolhas[e.papel] === o.id}
                  className={`${escolhas[e.papel] === o.id ? "ativa" : ""} ${o.id === e.vigente ? "vigente" : ""}`}
                  onClick={() =>
                    setRascunho({
                      ...rascunho,
                      [ficha.id]: { ...rascunho[ficha.id], [e.papel]: o.id },
                    })
                  }
                >
                  {o.rotulo}
                  {o.id === e.vigente ? <small> (hoje)</small> : null}
                </button>
              ))}
            </div>
          </section>
        ))}
        {muda ? (
          <section className="ficha-aviso">
            <h2>Em 6 turnos, se aprovar</h2>
            {previa.semComprador ? (
              <p className="ficha-alerta">
                Ninguém quer comprar: a venda não anda enquanto as potências
                não gostarem mais do país.
              </p>
            ) : null}
            <ul className="mercado-produtos ficha-produtos">
              {previa.produtos.map((p) => (
                <li key={p.id}>
                  <strong>{p.nome}</strong>
                  <span>
                    Preço {n1(p.preco[0])} → <b>{n1(p.preco[1])}</b>
                  </span>
                  <span>
                    Importa {n1(p.importa[0])} → <b>{n1(p.importa[1])}</b>
                  </span>
                  <span>
                    Falta {n1(p.falta[0])}% → <b>{n1(p.falta[1])}%</b>
                  </span>
                </li>
              ))}
            </ul>
            <ul className="ficha-numeros">
              <li>
                Cofre: <b>{sinal(-previa.custo)}% do PIB</b>
              </li>
              <li>
                PIB: <b>{sinal(previa.pib)}%</b>
              </li>
              <li>
                Investidores: <b>{sinal(previa.investidores)} pts</b>
              </li>
            </ul>
            {previa.grupos.length ? (
              <p>
                Grupos:{" "}
                {[...previa.grupos]
                  .sort((a, b) => Math.abs(b.pontos) - Math.abs(a.pontos))
                  .slice(0, 4)
                  .map((g) => `${nomeGrupo(g.id)} ${sinal(g.pontos)}`)
                  .join(" · ")}
              </p>
            ) : null}
            {previa.votos.map((v) => (
              <p key={v.lei}>
                {v.aprovada ? "Passa" : "Cai"} no Congresso: {v.sim} a favor,{" "}
                {v.nao} contra.
              </p>
            ))}
          </section>
        ) : null}
        <div className="ficha-botoes">
          <button type="button" className="aba-topo" onClick={propor} disabled={!muda && !naFila}>
            {muda ? "Propor ao Congresso" : "Retirar propostas"}
          </button>
        </div>
      </div>
    </Documento>
  );
}
