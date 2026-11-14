/**
 * Mesa do presidente: os papéis que esperam carimbo (assinar, vetar com
 * observação) e os avisos do turno. O texto sai da lei e do valor; o motor
 * só guarda ids (motor/mesa).
 */
import { useState } from "react";
import {
  votoDoSenado,
  type Ficha,
  type MotivoDoAviso,
  type Papel,
  type PapelDaMesa,
  type PapelDeIndicacao,
} from "../../motor";
import {
  nomesPartidos,
  type Partida,
  type Pedido,
  type VisaoPartida,
} from "../../partida";
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

/** Papéis que ainda pedem uma decisão do presidente: sanção e vaga em tribunal. */
export function papeisParaDecidir(partida: Partida): PapelDaMesa[] {
  return (partida.estado.mesa ?? []).filter(
    (p) => p.tipo === "sancao" || p.tipo === "indicacao",
  );
}

/** Vagas em tribunal: papel importante, que abre a mesa sozinho. */
export const vagasNaMesa = (partida: Partida): PapelDeIndicacao[] =>
  (partida.estado.mesa ?? []).filter(
    (p): p is PapelDeIndicacao => p.tipo === "indicacao",
  );

const CARTA = [
  "Aliado do seu partido",
  "Técnico respeitado",
  "Do lado do Senado",
];

/** A vaga num tribunal: quem saiu e as três cartas, com o voto previsto do Senado. */
function Vaga({
  partida,
  papel,
  escolhida,
  escolher,
}: {
  partida: Partida;
  papel: PapelDeIndicacao;
  escolhida: string | null;
  escolher: (pessoa: Ficha | null) => void;
}) {
  const r = partida.regras.judiciario;
  const tribunal =
    r?.tribunais.find((t) => t.id === papel.tribunal)?.rotulo ?? papel.tribunal;
  const modo = r?.modos[String(partida.estado.leis[r.lei_escolha])];
  const congresso = partida.regras.congresso;
  const senado =
    congresso?.senado ??
    Object.fromEntries(
      congresso?.partidos.map((p) => [p.id, p.cadeiras]) ?? [],
    );
  const base = [congresso?.governo ?? "", ...partida.estado.coligacao];
  const partidos = nomesPartidos(partida.pais, partida.opcoes.comeco);
  return (
    <li className="papel papel-vaga">
      <strong>Vaga no {tribunal}</strong>
      <p>
        {papel.saiu} se aposentou.{" "}
        {modo === "senado"
          ? "Você indica e o Senado vota o nome."
          : "Você nomeia direto."}
        {papel.barrados
          ? ` O Senado já barrou ${papel.barrados} ${papel.barrados === 1 ? "nome" : "nomes"}.`
          : ""}
      </p>
      <ul className="vaga-cartas">
        {papel.cartas.map((c, i) => {
          const voto =
            r && modo === "senado" && congresso
              ? votoDoSenado(r, senado, base, c)
              : null;
          return (
            <li key={c.id}>
              <button
                type="button"
                className={escolhida === c.id ? "ativo" : ""}
                onClick={() => escolher(escolhida === c.id ? null : c)}
              >
                <small>{CARTA[i] ?? ""}</small>
                <b>{c.nome}</b>
                <span>
                  {c.origem === "tecnico"
                    ? "sem partido"
                    : (partidos[c.origem] ?? c.origem)}
                  {" · "}
                  {Math.floor(c.idade ?? 0)} anos · competência {c.competencia}
                </span>
                {voto ? (
                  <em className={voto.aprovado ? "passa" : "barra"}>
                    Senado: {voto.aprovado ? "aprova" : "barra"} ({voto.sim} a{" "}
                    {voto.nao})
                  </em>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <small>
        A vaga não vence: enquanto ninguém senta, o tribunal decide com menos
        gente.
      </small>
    </li>
  );
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
  const decisoes = papeis.filter((p): p is Papel => p.tipo === "sancao");
  const avisos = papeis.filter((p): p is Papel => p.tipo === "aviso");
  const vagas = vagasNaMesa(partida);
  const daVaga = (v: PapelDeIndicacao) => (x: Pedido) =>
    x.tipo === "indicar" &&
    x.tribunal === v.tribunal &&
    x.cadeira === v.cadeira;
  const escolhidaDa = (v: PapelDeIndicacao) => {
    const x = extras.find(daVaga(v));
    return x?.tipo === "indicar" ? x.pessoa : null;
  };
  const indicar = (v: PapelDeIndicacao, pessoa: Ficha | null) =>
    setExtras(
      trocar(
        extras,
        daVaga(v),
        pessoa
          ? {
              tipo: "indicar",
              tribunal: v.tribunal,
              cadeira: v.cadeira,
              pessoa: pessoa.id,
            }
          : undefined,
      ),
    );
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
      numero={`${decisoes.length + vagas.length} para decidir`}
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
        {vagas.length ? (
          <section>
            <h2>Importante</h2>
            <ul className="mesa-lista">
              {vagas.map((v) => (
                <Vaga
                  key={v.id}
                  partida={partida}
                  papel={v}
                  escolhida={escolhidaDa(v)}
                  escolher={(pessoa) => indicar(v, pessoa)}
                />
              ))}
            </ul>
          </section>
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
