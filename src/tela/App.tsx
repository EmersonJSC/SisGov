import { useState } from "react";
import {
  avancar,
  carregarPartida,
  criarPartida,
  salvarPartida,
  type ComecoDoJogador,
  type OpcoesPartida,
  type Partida,
  type Pedido,
  type PedidoMudarLei,
} from "../partida";
import { TelaInicio } from "./inicio/TelaInicio";
import { TelaMapa } from "./mapa/TelaMapa";

const CHAVE = "sisgov-partida";

function guardar(partida: Partida): boolean {
  try {
    localStorage.setItem(CHAVE, salvarPartida(partida));
    return true;
  } catch {
    return false;
  }
}

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
      const nova = criarPartida(pais, semente, { ...teste, comeco });
      guardar(nova);
      trocar(nova);
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
      // salva sozinho a cada turno, para não perder a partida
      const depois = avancar(partida, [...fila, ...extras]);
      guardar(depois);
      trocar(depois);
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
      menu={{
        onSalvar: () =>
          setAviso(
            guardar(partida) ? "Partida salva." : "Não deu para salvar.",
          ),
        onCarregar: carregar,
        onRecomecar: () => {
          if (
            window.confirm(
              "Recomeçar? A partida de agora fica no último salvo.",
            )
          )
            trocar(null);
        },
      }}
    />
  );
}
