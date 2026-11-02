/**
 * Janela "Mercado": por setor, o que o país produz, compra e vende (motor/mercado,
 * fatia 2). Papel da janela da lei; só leitura.
 */
import type { VisaoPartida } from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { ICONE_INTERFACE } from "./icones";

const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

export function Mercado({
  visao,
  onFechar,
  ...janela
}: JanelaProps & { visao: VisaoPartida; onFechar: () => void }) {
  const mercado = visao.mercado;
  return (
    <Documento
      orgao="Mercado"
      setor="Produção e comércio"
      numero={`Ano ${Math.floor(visao.turno / 6) + 1}`}
      cor="#3d6b66"
      icone={ICONE_INTERFACE.pib}
      onFechar={onFechar}
      rotulo="Mercado"
      {...janela}
    >
      <div className="folha mercado-janela">
        {mercado?.setores.map((setor) => (
          <section key={setor.id}>
            <h2>{setor.nome}</h2>
            <ul className="mercado-produtos">
              {setor.produtos.map((p) => (
                <li key={p.id}>
                  <strong>{p.nome}</strong>
                  <div
                    className="mercado-barra"
                    title={`O país produz ${um(p.cobertura)}% do que consome`}
                  >
                    <i
                      className={p.cobertura < 100 ? "falta" : "sobra"}
                      style={{ width: `${Math.min(p.cobertura, 200) / 2}%` }}
                    />
                    <b />
                  </div>
                  <span className="mercado-produz">{um(p.cobertura)}%</span>
                  <span className="mercado-fluxo">
                    {p.importa > 0 ? (
                      <>
                        <em className="compra">compra {um(p.importa)}%</em>
                        <small>
                          {p.fornecedores
                            .map((f) => `${f.nome} ${um(f.parte)}%`)
                            .join(" · ")}
                        </small>
                      </>
                    ) : p.exporta > 0 ? (
                      <em className="vende">vende {um(p.exporta)}%</em>
                    ) : (
                      <em>se basta</em>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {mercado?.dependencia.length ? (
          <section>
            <h2>Dependência de potências</h2>
            <ul className="mercado-dependencia">
              {mercado.dependencia.map((d) => (
                <li key={d.id}>
                  <span>{d.nome}</span>
                  <strong>
                    {d.valor.toLocaleString("pt-BR", {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </strong>
                </li>
              ))}
            </ul>
            <p className="folha-explica">
              Média, nos produtos, do que o país compra de cada potência (em %
              do que consome).
            </p>
          </section>
        ) : null}
        {mercado ? null : <p>Este país não declarou produção.</p>}
      </div>
    </Documento>
  );
}
