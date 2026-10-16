/**
 * Menu principal (V1-39): novo partido, continuar a partida guardada no
 * navegador ou abrir um arquivo salvo.
 */
import { useRef, useState } from "react";
import { carregarPartida } from "../../app/partida";
import { Arte } from "./Arte";
import {
  lerGuardada,
  quando,
  textoDaGuardada,
  type PartidaCarregada,
} from "./JanelaPartida";

export function MenuPrincipal({
  onNovo,
  onCarregar,
}: {
  onNovo: () => void;
  onCarregar: (c: PartidaCarregada) => void;
}) {
  const [guardada] = useState(lerGuardada);
  const [erro, setErro] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const arquivo = useRef<HTMLInputElement>(null);
  const carregar = (pegar: () => Promise<string>) => {
    setOcupado(true);
    setErro(null);
    window.setTimeout(() => {
      pegar()
        .then((texto) => {
          const r = carregarPartida(texto);
          if (!r.ok) setErro(r.erros.join(" "));
          else onCarregar({ partida: r.value.partida, anexos: r.value.anexos });
        })
        .catch((e: unknown) => setErro(`Não deu certo: ${String(e)}`))
        .finally(() => setOcupado(false));
    }, 30);
  };
  return (
    <main className="mn-tela ds-mesa">
      <div className="mn-caixa">
        <Arte
          caminho="logo/sisgov.png"
          className="fd-logo"
          alt="SisGov"
          substituto={<span className="fd-marca">SisGov</span>}
        />
        <p className="fd-chamada">Você não é o presidente. Você é o partido.</p>
        <nav className="mn-botoes" aria-label="Menu">
          <button type="button" className="ds-placa" onClick={onNovo}>
            <span className="ds-lampada" aria-hidden />
            Novo partido
          </button>
          {guardada ? (
            <button
              type="button"
              className="ds-assinar"
              disabled={ocupado}
              onClick={() => carregar(() => textoDaGuardada(guardada))}
            >
              Continuar · {guardada.turno} · {quando(guardada.salvoEm)}
            </button>
          ) : null}
          <button
            type="button"
            className="ds-assinar"
            disabled={ocupado}
            onClick={() => arquivo.current?.click()}
          >
            Abrir partida salva
          </button>
          <input
            ref={arquivo}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) carregar(() => f.text());
            }}
          />
        </nav>
        {ocupado ? <p className="mn-nota">Abrindo a partida…</p> : null}
        {erro ? (
          <p className="mn-erro" role="alert">
            {erro}
          </p>
        ) : null}
      </div>
    </main>
  );
}
