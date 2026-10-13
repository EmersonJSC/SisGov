/**
 * Salvar e carregar a partida (V1-33): no navegador (comprimida, para caber)
 * ou num arquivo para guardar fora. O jogo em si fica em `app/partida/salvar`.
 */
import { useEffect, useRef, useState } from "react";
import {
  carregarPartida,
  salvarPartida,
  type Partida,
} from "../../app/partida";
import { Icone } from "./Icone";
import { ICONE_INTERFACE } from "./icones";

const CHAVE = "sisgov:partida";

export type PartidaCarregada = Readonly<{
  partida: Partida;
  anexos: Readonly<Record<string, unknown>>;
}>;

async function comprimir(texto: string): Promise<string> {
  const fluxo = new Blob([texto])
    .stream()
    .pipeThrough(new CompressionStream("gzip"));
  const bytes = new Uint8Array(await new Response(fluxo).arrayBuffer());
  let binario = "";
  for (let i = 0; i < bytes.length; i += 0x8000)
    binario += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binario);
}

async function descomprimir(base64: string): Promise<string> {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const fluxo = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return new Response(fluxo).text();
}

type Guardada = Readonly<{ salvoEm: string; turno: string; dados: string }>;

function lerGuardada(): Guardada | null {
  try {
    const texto = localStorage.getItem(CHAVE);
    return texto ? (JSON.parse(texto) as Guardada) : null;
  } catch {
    return null;
  }
}

const quando = (iso: string) =>
  iso
    ? new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export function JanelaPartida({
  partida,
  turno,
  anexos,
  onCarregar,
  onFechar,
}: {
  partida: Partida;
  /** "2º trimestre · ano 1": vai no nome do arquivo e na lista. */
  turno: string;
  anexos: Readonly<Record<string, unknown>>;
  onCarregar: (carregada: PartidaCarregada) => void;
  onFechar: () => void;
}) {
  const [guardada, setGuardada] = useState(lerGuardada);
  const [aviso, setAviso] = useState<{ erro: boolean; texto: string } | null>(
    null,
  );
  const [ocupado, setOcupado] = useState(false);
  const arquivo = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [onFechar]);

  const carregar = (texto: string) => {
    const r = carregarPartida(texto);
    if (!r.ok) {
      setAviso({ erro: true, texto: r.erros.join(" ") });
      return;
    }
    onCarregar({ partida: r.value.partida, anexos: r.value.anexos });
  };

  const tarefa = (fazer: () => Promise<void>) => {
    setOcupado(true);
    setAviso(null);
    // deixa o botão mostrar o estado antes de calcular
    window.setTimeout(() => {
      fazer()
        .catch((e: unknown) =>
          setAviso({ erro: true, texto: `Não deu certo: ${String(e)}` }),
        )
        .finally(() => setOcupado(false));
    }, 30);
  };

  const salvarNoNavegador = () =>
    tarefa(async () => {
      const nova: Guardada = {
        salvoEm: new Date().toISOString(),
        turno,
        dados: await comprimir(salvarPartida(partida, anexos)),
      };
      try {
        localStorage.setItem(CHAVE, JSON.stringify(nova));
      } catch {
        setAviso({
          erro: true,
          texto:
            "Não coube no navegador. Use Baixar arquivo para guardar a partida.",
        });
        return;
      }
      setGuardada(nova);
      setAviso({ erro: false, texto: "Partida salva neste navegador." });
    });

  const carregarDoNavegador = () =>
    tarefa(async () => {
      if (guardada) carregar(await descomprimir(guardada.dados));
    });

  const baixar = () => {
    const url = URL.createObjectURL(
      new Blob([salvarPartida(partida, anexos)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `sisgov-${turno.replace(/[^\p{L}\p{N}]+/gu, "-")}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const abrir = (escolhido: File | undefined) => {
    if (!escolhido) return;
    tarefa(async () => carregar(await escolhido.text()));
  };

  return (
    <div
      className="busca-fundo"
      role="dialog"
      aria-label="Salvar e carregar a partida"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <section className="salvar-janela">
        <header>
          <h2>Partida</h2>
          <button
            type="button"
            className="tb-fechar"
            onClick={onFechar}
            aria-label="Fechar"
          >
            <Icone nome={ICONE_INTERFACE.fechar} tamanho={20} />
          </button>
        </header>

        <h3>Neste navegador</h3>
        <div className="salvar-linha">
          <button type="button" disabled={ocupado} onClick={salvarNoNavegador}>
            Salvar agora
          </button>
          <button
            type="button"
            disabled={ocupado || !guardada}
            onClick={carregarDoNavegador}
          >
            Carregar
          </button>
        </div>
        <p className="salvar-nota">
          {guardada
            ? `Salva: ${guardada.turno}, em ${quando(guardada.salvoEm)}. Salvar de novo troca por esta.`
            : "Nenhuma partida salva neste navegador."}
        </p>

        <h3>Em arquivo</h3>
        <div className="salvar-linha">
          <button type="button" disabled={ocupado} onClick={baixar}>
            <Icone nome={ICONE_INTERFACE.partida} tamanho={18} />
            Baixar arquivo
          </button>
          <button
            type="button"
            disabled={ocupado}
            onClick={() => arquivo.current?.click()}
          >
            <Icone nome={ICONE_INTERFACE.abrirArquivo} tamanho={18} />
            Abrir arquivo
          </button>
          <input
            ref={arquivo}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              abrir(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        {ocupado ? <p className="salvar-nota">Um momento…</p> : null}
        {aviso ? (
          <p
            className={`salvar-aviso${aviso.erro ? " erro" : ""}`}
            role={aviso.erro ? "alert" : "status"}
          >
            {aviso.texto}
          </p>
        ) : null}
      </section>
    </div>
  );
}
