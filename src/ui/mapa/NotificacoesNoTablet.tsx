/**
 * Notificações do tablet (V1-13, docs/v1/desenho/dilemas.md seção 2): os
 * dilemas esperando resposta e os pedidos das bancadas do Congresso. Nada
 * abre sozinho na tela; o turno espera os dilemas, e os pedidos só seguram
 * o projeto na fila.
 */
import type {
  Partida,
  VisaoDaTramitacao,
  VisaoDilema,
} from "../../app/partida";
import { CartaoDilema, NOME_NIVEL } from "./MesaDoPresidente";

type Pedido = VisaoDaTramitacao["pedidos"][number];

export type Notificacao =
  | Readonly<{ tipo: "dilema"; id: string; dilema: VisaoDilema }>
  | Readonly<{ tipo: "pedido"; id: string; pedido: Pedido }>;

const NOME_PEDIDO: Readonly<Record<string, string>> = {
  ministerio: "um ministério",
  verba: "verba para as bases (emendas)",
  apoio: "apoio a uma lei dela",
};

/** Dilemas primeiro: são eles que seguram o turno. */
export function notificacoesDe(
  dilemas: readonly VisaoDilema[],
  congresso?: VisaoDaTramitacao,
): Notificacao[] {
  return [
    ...dilemas.map((dilema): Notificacao => ({
      tipo: "dilema",
      id: dilema.id,
      dilema,
    })),
    ...(congresso?.pedidos ?? []).map((pedido): Notificacao => ({
      tipo: "pedido",
      id: pedido.id,
      pedido,
    })),
  ];
}

export function TituloDaNotificacao({ n }: { n: Notificacao }) {
  return n.tipo === "dilema" ? (
    <>
      <strong>{n.dilema.manchete}</strong>
      <small>
        {NOME_NIVEL[n.dilema.nivel] ?? "Regional"} · responda para encerrar o
        turno
      </small>
    </>
  ) : (
    <>
      <strong>
        {n.pedido.nomeDaBancada} pede {NOME_PEDIDO[n.pedido.tipo]}
      </strong>
      <small>Congresso · o projeto {n.pedido.projeto} espera</small>
    </>
  );
}

function Pedido({
  pedido,
  onResponder,
}: {
  pedido: Pedido;
  onResponder: (pedidoId: string, aceitar: boolean) => void;
}) {
  return (
    <article className="nt-pedido">
      <p className="nt-origem">Congresso Nacional</p>
      <h2>
        {pedido.nomeDaBancada} pede {NOME_PEDIDO[pedido.tipo]}
      </h2>
      <p>
        A bancada decide a votação de <b>{pedido.projeto}</b>
        {pedido.lei ? ` e quer que ${pedido.lei} entre na sua fila` : ""}. Se
        aceitar, ela tende a votar a favor; se recusar, fica um pouco menos
        disposta a ajudar o governo.
      </p>
      <div className="cg-botoes">
        <button type="button" onClick={() => onResponder(pedido.id, true)}>
          Aceitar
        </button>
        <button
          type="button"
          className="cg-recusar"
          onClick={() => onResponder(pedido.id, false)}
        >
          Recusar
        </button>
      </div>
    </article>
  );
}

export function NotificacoesNoTablet({
  notificacoes,
  selecionada,
  onSelecionar,
  partida,
  onEscolherDilema,
  onResponderPedido,
}: {
  notificacoes: readonly Notificacao[];
  selecionada: string | null;
  onSelecionar: (id: string) => void;
  partida: Partida;
  onEscolherDilema: (dilemaId: string, opcaoId: string) => string | null;
  onResponderPedido: (pedidoId: string, aceitar: boolean) => void;
}) {
  if (!notificacoes.length)
    return (
      <div className="nt-app nt-vazio">
        <p className="tb-calmo">
          Nenhuma notificação. Pode encerrar o turno quando quiser.
        </p>
      </div>
    );
  const atual =
    notificacoes.find((n) => n.id === selecionada) ?? notificacoes[0];
  return (
    <div className="nt-app">
      <ul className="nt-lista" aria-label="Notificações">
        {notificacoes.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              aria-current={n.id === atual.id}
              className={`nt-item nt-${n.tipo}`}
              onClick={() => onSelecionar(n.id)}
            >
              <TituloDaNotificacao n={n} />
            </button>
          </li>
        ))}
      </ul>
      <div className="nt-detalhe">
        {atual.tipo === "dilema" ? (
          // o papel da antiga mesa do presidente, agora dentro do tablet
          <div className="mesa nt-mesa">
            <CartaoDilema
              dilema={atual.dilema}
              partida={partida}
              onEscolher={onEscolherDilema}
            />
          </div>
        ) : (
          <Pedido pedido={atual.pedido} onResponder={onResponderPedido} />
        )}
      </div>
    </div>
  );
}
