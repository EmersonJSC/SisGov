import { useState } from "react";
import {
  apoioAtual,
  avancar,
  carregarPartida,
  criarPartida,
  indicesDoMundo,
  nomesGrupos,
  nomesPartidos,
  paisesDisponiveis,
  salvarPartida,
  type Partida,
  type Pedido,
} from "../partida";
import { Leis } from "./Leis";
import { TelaMapa } from "./mapa/TelaMapa";

const CHAVE = "sisgov-partida";

function lerSalvo(): string | null {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

const numero = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

export function App() {
  const [partida, setPartida] = useState<Partida | null>(null);
  const [fila, setFila] = useState<Pedido[]>([]);
  const [aviso, setAviso] = useState("");
  const [pais, setPais] = useState(paisesDisponiveis()[0]);
  const [semente, setSemente] = useState(42);
  const [vista, setVista] = useState<"mapa" | "painel">("mapa");

  const trocar = (p: Partida | null, texto = "") => {
    setPartida(p);
    setFila([]);
    setAviso(texto);
  };

  const comecar = () => {
    try {
      trocar(criarPartida(pais, semente));
    } catch (e) {
      setAviso((e as Error).message);
    }
  };

  const salvar = () => {
    if (!partida) return;
    try {
      localStorage.setItem(CHAVE, salvarPartida(partida));
      setAviso("Partida salva.");
    } catch {
      setAviso("Não foi possível salvar neste navegador.");
    }
  };

  const carregar = () => {
    const texto = lerSalvo();
    if (!texto) return setAviso("Não há partida salva.");
    try {
      trocar(carregarPartida(texto), "Partida carregada.");
    } catch (e) {
      setAviso((e as Error).message);
    }
  };

  const passar = () => {
    if (!partida) return;
    try {
      trocar(avancar(partida, fila));
    } catch (e) {
      setAviso((e as Error).message);
    }
  };

  if (!partida)
    return (
      <main>
        <h1>SisGov</h1>
        <p>Governe um país e responda nas urnas.</p>
        <label>
          País{" "}
          <select value={pais} onChange={(e) => setPais(e.target.value)}>
            {paisesDisponiveis().map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>{" "}
        <label>
          Semente{" "}
          <input
            type="number"
            value={semente}
            onChange={(e) => setSemente(Number(e.target.value))}
          />
        </label>
        <p>
          <button onClick={comecar}>Começar</button>{" "}
          <button onClick={carregar} disabled={!lerSalvo()}>
            Carregar partida salva
          </button>
        </p>
        {aviso && <p className="aviso">{aviso}</p>}
      </main>
    );

  const { estado } = partida;
  const ano = Math.floor(estado.turno / 6) + 1;
  const mes = (estado.turno % 6) * 2 + 1;
  const partidos = nomesPartidos(partida.pais);
  const eleicao = estado.eleicao;

  if (vista === "mapa")
    return (
      <TelaMapa
        partida={partida}
        fila={fila}
        setFila={setFila}
        onPainel={() => setVista("painel")}
      />
    );

  return (
    <main className="painel-rolagem">
      <header>
        <button onClick={() => setVista("mapa")}>Mapa</button>
        <h1>SisGov · {partida.pais}</h1>
        <p>
          Ano {ano}, mês {mes} (turno {estado.turno}) · apoio se a eleição fosse
          hoje: <b>{numero(apoioAtual(estado))}</b> · desgaste{" "}
          {numero(estado.desgaste)}
        </p>
        <button onClick={salvar}>Salvar</button>{" "}
        <button onClick={carregar} disabled={!lerSalvo()}>
          Carregar
        </button>{" "}
        <button onClick={() => trocar(null)}>Recomeçar</button>
        {aviso && <span className="aviso"> {aviso}</span>}
      </header>

      {eleicao && (
        <section className={eleicao.venceu ? "ganhou" : "perdeu"}>
          <h2>
            Eleição no turno {eleicao.turno}:{" "}
            {eleicao.venceu ? "o governo venceu" : "o governo perdeu"}
          </h2>
          <p>
            Apoio {numero(eleicao.apoio)} contra {numero(eleicao.adversario)} do
            adversário (desgaste {numero(eleicao.desgaste)}, margem{" "}
            {numero(eleicao.margem)}).
          </p>
          <ul>
            {Object.entries(eleicao.grupos).map(([id, v]) => (
              <li key={id}>
                {nomesGrupos[id]}: satisfação {numero(v.satisfacao)},{" "}
                {numero(v.pessoas / 1e6)} mi de pessoas
              </li>
            ))}
          </ul>
          {estado.encerrada && <p>A partida terminou.</p>}
        </section>
      )}

      <section>
        <h2>Grupos</h2>
        <table>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Pessoas (mi)</th>
              <th>Satisfação</th>
              <th>Radicais %</th>
              <th>Lealistas %</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(estado.grupos).map(([id, g]) => (
              <tr key={id}>
                <td>{nomesGrupos[id]}</td>
                <td>{numero(g.pessoas / 1e6)}</td>
                <td>{numero(g.satisfacao)}</td>
                <td>{numero(g.radicais)}</td>
                <td>{numero(g.lealistas)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Índices</h2>
        <table>
          <tbody>
            {indicesDoMundo.map((i) => (
              <tr key={i.id}>
                <td>{i.nome}</td>
                <td>
                  {numero(
                    i.essencial
                      ? (estado.essenciais as Record<string, number>)[i.id]
                      : estado.jogabilidade[i.id],
                  )}
                </td>
                <td className="unidade">{i.unidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {estado.votacoes.length > 0 && (
        <section>
          <h2>Votações do último turno</h2>
          <ul>
            {estado.votacoes.map((v, k) => (
              <li key={k}>
                {v.lei} → {String(v.valor)}:{" "}
                <b>{v.aprovada ? "aprovada" : "rejeitada"}</b> ({v.sim} sim ×{" "}
                {v.nao} não){v.exorbitante && " · mudança exorbitante"}
                <br />
                {Object.entries(v.votos).map(([id, voto]) => (
                  <span key={id} className="voto">
                    {partidos[id] ?? id}: {voto}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!estado.encerrada && (
        <Leis partida={partida} fila={fila} setFila={setFila} />
      )}

      {!estado.encerrada && (
        <p>
          <button className="passar" onClick={passar}>
            Passar o turno ({fila.length} pedido{fila.length === 1 ? "" : "s"})
          </button>
        </p>
      )}
    </main>
  );
}
