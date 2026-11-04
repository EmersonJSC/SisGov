import { useState } from "react";
import {
  avancar,
  carregarPartida,
  criarPartida,
  paisesDisponiveis,
  salvarPartida,
  type Partida,
  type Pedido,
} from "../partida";
import { TelaMapa } from "./mapa/TelaMapa";

const CHAVE = "sisgov-partida";

function lerSalvo(): string | null {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

export function App() {
  const [partida, setPartida] = useState<Partida | null>(null);
  const [fila, setFila] = useState<Pedido[]>([]);
  const [aviso, setAviso] = useState("");
  const [pais, setPais] = useState(paisesDisponiveis()[0]);
  const [semente, setSemente] = useState(42);
  const [semCongresso, setSemCongresso] = useState(false);

  const trocar = (p: Partida | null, texto = "") => {
    setPartida(p);
    setFila([]);
    setAviso(texto);
  };

  const comecar = () => {
    try {
      trocar(criarPartida(pais, semente, { semCongresso }));
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
        </label>{" "}
        <label>
          <input
            type="checkbox"
            checked={semCongresso}
            onChange={(e) => setSemCongresso(e.target.checked)}
          />{" "}
          Sem Congresso (teste: toda lei passa)
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

  return (
    <TelaMapa
      partida={partida}
      fila={fila}
      setFila={setFila}
      podeCarregar={lerSalvo() !== null}
      onPassar={passar}
      onSalvar={salvar}
      onCarregar={carregar}
      onRecomecar={() => trocar(null)}
      aviso={aviso}
    />
  );
}
