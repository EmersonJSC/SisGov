/**
 * Trocar o ministro pelo mapa: abre no painel do ministério clicado. A troca
 * entra nos pedidos e acontece ao passar o turno; o texto diz o preço (partido
 * ressentido, polêmica que cresce a cada troca do mandato, mágoa dos parecidos).
 */
import { fichaDe, trocasRecentes, type Ficha } from "../../motor";
import { nomesPartidos, type Partida, type Pedido } from "../../partida";
import { trocar } from "./pedidos";

const NOTICIA = ["pequena", "média", "grande"] as const;

type Props = Readonly<{
  partida: Partida;
  caixa: string;
  extras: Pedido[];
  setExtras: (e: Pedido[]) => void;
}>;

export function TrocaDeMinistro({ partida, caixa, extras, setExtras }: Props) {
  const rg = partida.regras.governo;
  const governo = partida.estado.governo;
  const atual = governo?.caixas.find((c) => c.id === caixa);
  if (!rg || !governo || !atual) return null;
  const partidos = nomesPartidos(partida.pais, partida.opcoes.comeco);
  const origem = (f: Ficha) =>
    f.origem === "tecnico" ? "técnico" : (partidos[f.origem] ?? f.origem);
  const ministro = fichaDe(rg, atual.ministro);
  const pedido = extras.find(
    (x): x is Extract<Pedido, { tipo: "nomear" }> =>
      x.tipo === "nomear" && x.caixa === caixa,
  );
  // quem está na chapa, numa caixa ou já foi pedido para outra não aparece
  const ocupados = new Set([
    ...Object.values(partida.opcoes.comeco?.chapa ?? {}),
    ...governo.caixas.map((c) => c.ministro),
    ...extras.flatMap((x) =>
      x.tipo === "nomear" && x.caixa !== caixa ? [x.ministro] : [],
    ),
  ]);
  const livres = rg.pessoas.filter((p) => !ocupados.has(p.id));
  const outrasNoTurno = extras.filter(
    (x) => x.tipo === "nomear" && x.caixa !== caixa,
  ).length;
  const ordem =
    trocasRecentes(governo, partida.estado.turno + 1).length +
    outrasNoTurno +
    1;
  const noticia = NOTICIA[Math.min(ordem, NOTICIA.length) - 1];

  return (
    <section className="troca-ministro">
      <h3>Ministro</h3>
      <p>
        <strong>{ministro.nome}</strong> · {origem(ministro)} · competência{" "}
        {ministro.competencia} · honestidade {ministro.honestidade}
      </p>
      <label>
        Trocar por{" "}
        <select
          value={pedido?.ministro ?? ""}
          onChange={(e) =>
            setExtras(
              trocar(
                extras,
                (x) => x.tipo === "nomear" && x.caixa === caixa,
                e.target.value
                  ? { tipo: "nomear", caixa, ministro: e.target.value }
                  : undefined,
              ),
            )
          }
        >
          <option value="">(manter)</option>
          {livres.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} · {origem(p)} · comp. {p.competencia} · hon.{" "}
              {p.honestidade}
            </option>
          ))}
        </select>
      </label>
      {pedido ? (
        <ul className="troca-preco">
          <li>Troca ao passar o turno.</li>
          <li>
            {ordem}ª troca do mandato: notícia {noticia}.
          </li>
          <li>
            Quem pensa parecido com {ministro.nome} fica magoado por 3 turnos.
          </li>
          {ministro.origem !== "tecnico" ? (
            <li>{origem(ministro)} fica ressentido no Congresso.</li>
          ) : null}
        </ul>
      ) : null}
    </section>
  );
}
