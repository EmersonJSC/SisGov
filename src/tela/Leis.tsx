import type { Partida, Pedido } from "../partida";

export const nomeDaLei = (id: string) => {
  const t = id.replace(/-/g, " ");
  return t[0].toUpperCase() + t.slice(1);
};

const texto = (valor: number | string, continua: boolean) =>
  continua
    ? `${(Number(valor) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`
    : String(valor);

interface Props {
  partida: Partida;
  fila: Pedido[];
  setFila: (f: Pedido[]) => void;
}

export function Leis({ partida, fila, setFila }: Props) {
  const { regras, estado } = partida;

  // Um pedido por lei; voltar ao valor vigente tira o pedido da fila.
  const pedir = (lei: string, valor: number | string) => {
    const resto = fila.filter((p) => p.lei !== lei);
    setFila(
      valor === estado.leis[lei]
        ? resto
        : [...resto, { tipo: "mudar_lei", lei, valor }],
    );
  };

  return (
    <section>
      <h2>Leis</h2>
      <table>
        <thead>
          <tr>
            <th>Lei</th>
            <th>Vigente</th>
            <th>Propor</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(regras.leis).map((lei) => {
            const vigente = estado.leis[lei.id];
            const pedido = fila.find((p) => p.lei === lei.id);
            const proposto = pedido ? pedido.valor : vigente;
            return (
              <tr key={lei.id} className={pedido ? "pedido" : ""}>
                <td>{nomeDaLei(lei.id)}</td>
                <td>
                  {vigente === undefined
                    ? "não legislada"
                    : texto(vigente, lei.forma === "continua")}
                </td>
                <td>
                  {lei.forma === "continua" ? (
                    <>
                      <input
                        type="range"
                        min={lei.faixa.min}
                        max={lei.faixa.max}
                        step={lei.passo}
                        value={Number(proposto ?? lei.faixa.min)}
                        onChange={(e) => pedir(lei.id, Number(e.target.value))}
                      />{" "}
                      {texto(Number(proposto ?? lei.faixa.min), true)}
                    </>
                  ) : (
                    <select
                      value={String(proposto ?? "")}
                      onChange={(e) => pedir(lei.id, e.target.value)}
                    >
                      {vigente === undefined && <option value="" />}
                      {lei.opcoes.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.id}
                        </option>
                      ))}
                    </select>
                  )}
                  {pedido && (
                    <button
                      onClick={() => setFila(fila.filter((p) => p !== pedido))}
                    >
                      tirar
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
