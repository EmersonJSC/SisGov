/**
 * Mesa do presidente: os papéis que esperam carimbo (assinar, vetar com
 * observação) e os avisos do turno. O texto sai da lei e do valor; o motor
 * só guarda ids (motor/mesa).
 */
import { useState } from "react";
import type { MotivoDoAviso, Papel } from "../../motor";
import type { Partida, Pedido, VisaoPartida } from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { ICONE_INTERFACE } from "./icones";
import { trocar } from "./pedidos";

const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

const AVISO: Record<MotivoDoAviso, string> = {
  "lei-aprovada": "Lei aprovada",
  "veto-derrubado": "Veto derrubado pelo Congresso",
  "veto-mantido": "Veto mantido pelo Congresso",
  decreto: "Decreto em vigor",
};

/** Papéis que ainda pedem uma decisão do presidente. */
export function papeisParaDecidir(partida: Partida): Papel[] {
  return (partida.estado.mesa ?? []).filter((p) => p.tipo === "sancao");
}

export function MesaDePapeis({
  partida,
  visao,
  extras,
  setExtras,
  onFechar,
  ...janela
}: JanelaProps & {
  partida: Partida;
  visao: VisaoPartida;
  /** Carimbos já marcados neste turno. */
  extras: Pedido[];
  setExtras: (e: Pedido[]) => void;
  onFechar: () => void;
}) {
  const papeis = partida.estado.mesa ?? [];
  const decisoes = papeis.filter((p) => p.tipo === "sancao");
  const avisos = papeis.filter((p) => p.tipo === "aviso");
  const [observacoes, setObservacoes] = useState<Record<string, string>>({});
  const tacita =
    partida.regras.congresso?.ignorar === "veto" ? "veto" : "sanção";
  const lei = (id: string) => visao.leis.find((l) => l.id === id);
  const valorTexto = (id: string, valor: number | string) =>
    typeof valor === "number"
      ? `${um(valor * 100)}%`
      : (lei(id)?.opcoes?.find((o) => o.id === valor)?.rotulo ?? valor);
  const carimboDe = (papel: string) =>
    extras.find((x) => x.tipo === "carimbar" && x.papel === papel);
  const doPapel = (papel: Papel) => (x: Pedido) =>
    x.tipo === "carimbar" && x.papel === papel.id;
  const marcar = (papel: Papel, carimbo: "assinar" | "vetar") => {
    const obs = observacoes[papel.id]?.trim();
    setExtras(
      trocar(extras, doPapel(papel), {
        tipo: "carimbar",
        papel: papel.id,
        carimbo,
        ...(carimbo === "vetar" && obs ? { observacao: obs } : {}),
      }),
    );
  };
  const tirar = (papel: Papel) => setExtras(trocar(extras, doPapel(papel)));

  return (
    <Documento
      orgao="Presidência"
      setor="Mesa"
      numero={`${decisoes.length} para decidir`}
      cor="#6b4e2e"
      icone={ICONE_INTERFACE.lei}
      onFechar={onFechar}
      rotulo="Mesa do presidente"
      {...janela}
    >
      <div className="folha mesa-papeis">
        {papeis.length === 0 ? (
          <p className="vazio">A mesa está vazia.</p>
        ) : null}
        {decisoes.length ? (
          <section>
            <h2>Para decidir</h2>
            <ul className="mesa-lista">
              {decisoes.map((p) => {
                const carimbo = carimboDe(p.id);
                const marcado =
                  carimbo?.tipo === "carimbar" ? carimbo.carimbo : null;
                const hoje = partida.estado.leis[p.lei];
                return (
                  <li
                    key={p.id}
                    className={`papel papel-${marcado ?? "aberto"}`}
                  >
                    <strong>{lei(p.lei)?.nome ?? p.lei}</strong>
                    <p>
                      O Senado mudou a lei e a Câmara aceitou:{" "}
                      {hoje === undefined
                        ? "nova lei"
                        : valorTexto(p.lei, hoje)}{" "}
                      → <b>{valorTexto(p.lei, p.valor)}</b>.
                    </p>
                    <small>
                      Decida ao passar o turno. Se ignorar, vale a {tacita}{" "}
                      tácita.
                    </small>
                    <div className="papel-carimbos">
                      <button
                        type="button"
                        className={marcado === "assinar" ? "ativo" : ""}
                        onClick={() => marcar(p, "assinar")}
                      >
                        Assinar
                      </button>
                      <button
                        type="button"
                        className={marcado === "vetar" ? "ativo" : ""}
                        onClick={() => marcar(p, "vetar")}
                      >
                        Vetar
                      </button>
                      {marcado ? (
                        <button type="button" onClick={() => tirar(p)}>
                          Tirar carimbo
                        </button>
                      ) : null}
                    </div>
                    <input
                      type="text"
                      className="papel-observacao"
                      placeholder="Observação do veto (opcional)"
                      value={observacoes[p.id] ?? ""}
                      onChange={(e) =>
                        setObservacoes({
                          ...observacoes,
                          [p.id]: e.target.value,
                        })
                      }
                      onBlur={() => marcado === "vetar" && marcar(p, "vetar")}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
        {avisos.length ? (
          <section>
            <h2>Avisos do turno</h2>
            <ul className="mesa-lista">
              {avisos.map((p) => (
                <li key={p.id} className="papel papel-aviso">
                  <strong>{AVISO[p.motivo ?? "lei-aprovada"]}</strong>{" "}
                  <span>
                    {lei(p.lei)?.nome ?? p.lei} → {valorTexto(p.lei, p.valor)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </Documento>
  );
}
