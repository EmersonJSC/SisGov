import { useState } from "react";
import {
  avancar,
  carregarPartida,
  criarPartida,
  type ComecoDoJogador,
  type OpcoesPartida,
  type Partida,
  type Pedido,
  type PedidoMudarLei,
} from "../partida";
import { TelaInicio } from "./inicio/TelaInicio";
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
  const [fila, setFila] = useState<PedidoMudarLei[]>([]);
  const [extras, setExtras] = useState<Pedido[]>([]);
  const [aviso, setAviso] = useState("");

  const trocar = (p: Partida | null, texto = "") => {
    setPartida(p);
    setFila([]);
    setExtras([]);
    setAviso(texto);
  };

  const comecar = (
    pais: string,
    semente: number,
    comeco: ComecoDoJogador,
    teste: Pick<OpcoesPartida, "semCongresso" | "semSenado">,
  ) => {
    try {
      trocar(criarPartida(pais, semente, { ...teste, comeco }));
    } catch (e) {
      setAviso((e as Error).message);
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
      trocar(avancar(partida, [...fila, ...extras]));
    } catch (e) {
      setAviso((e as Error).message);
    }
  };

  if (!partida)
    return (
      <TelaInicio
        podeCarregar={lerSalvo() !== null}
        aviso={aviso}
        onCarregar={carregar}
        onComecar={comecar}
      />
    );

  return (
    <TelaMapa
      partida={partida}
      fila={fila}
      setFila={setFila}
      extras={extras}
      setExtras={setExtras}
      onPassar={passar}
      aviso={aviso}
    />
  );
}
