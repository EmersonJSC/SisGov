/**
 * Janela "Mercado": por setor, o que o país produz, compra e vende (motor/mercado,
 * fatia 2). Papel da janela da lei; só leitura.
 */
import { useState } from "react";
import type { VisaoPartida, VisaoPrecoMundo } from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { porAnoEPorTurno } from "./formatos";
import { ICONE_INTERFACE } from "./icones";

const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

const um1 = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

const preco = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

function Variacao({ v }: { v: number }) {
  const sinal = v > 0.05 ? "alta" : v < -0.05 ? "baixa" : "estavel";
  return (
    <em className={`mercado-var ${sinal}`}>
      {sinal === "alta" ? "▲" : sinal === "baixa" ? "▼" : "•"}{" "}
      {v.toLocaleString("pt-BR", {
        maximumFractionDigits: 1,
        signDisplay: "exceptZero",
      })}
      %
    </em>
  );
}

function Linha({ p }: { p: VisaoPrecoMundo }) {
  return (
    <li>
      <strong>{p.nome}</strong>
      <span className="mercado-produz">{preco(p.preco)}</span>
      <Variacao v={p.variacao} />
    </li>
  );
}

export function Mercado({
  visao,
  moeda,
  pib,
  onFechar,
  ...janela
}: JanelaProps & {
  visao: VisaoPartida;
  moeda: string;
  pib: number;
  onFechar: () => void;
}) {
  const mercado = visao.mercado;
  const [aba, setAba] = useState<"pais" | "mundo">("pais");
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
        <div className="mercado-abas" role="tablist">
          {(["pais", "mundo"] as const).map((a) => (
            <button
              key={a}
              role="tab"
              aria-selected={aba === a}
              className={aba === a ? "ativa" : ""}
              onClick={() => setAba(a)}
            >
              {a === "pais" ? "Do país" : "Do mundo"}
            </button>
          ))}
        </div>
        {aba === "mundo" && mercado ? (
          <>
            <section>
              <h2>Em alta</h2>
              {mercado.mundo.emAlta.length ? (
                <ul className="mercado-produtos mundo">
                  {mercado.mundo.emAlta.map((p) => (
                    <Linha key={p.id} p={p} />
                  ))}
                </ul>
              ) : (
                <p>Nada subiu neste turno.</p>
              )}
            </section>
            <section>
              <h2>Mais em conta</h2>
              <ul className="mercado-produtos mundo">
                {mercado.mundo.maisEmConta.map((p) => (
                  <Linha key={p.id} p={p} />
                ))}
              </ul>
            </section>
            {mercado.mundo.setores.map((setor) => (
              <section key={setor.id}>
                <h2>{setor.nome}</h2>
                <ul className="mercado-produtos mundo">
                  {setor.produtos.map((p) => (
                    <li key={p.id}>
                      <strong>{p.nome}</strong>
                      <span className="mercado-produz">{preco(p.preco)}</span>
                      <Variacao v={p.variacao} />
                      <small>
                        {p.maisBarato ? `mais barato: ${p.maisBarato}` : ""}
                      </small>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="folha-explica">
              Preço base 100 = o mundo produz o que consome. Falta produto, o
              preço sobe; sobra, desce.
            </p>
          </>
        ) : null}
        {aba === "pais"
          ? mercado?.setores.map((setor) => (
              <section key={setor.id}>
                <h2>{setor.nome}</h2>
                {mercado.emprego.find((e) => e.id === setor.id) ? (
                  <p className="mercado-emprego">
                    {(() => {
                      const e = mercado.emprego.find((x) => x.id === setor.id)!;
                      const din = (pct: number) =>
                        porAnoEPorTurno(pct, pib, moeda);
                      return `Empregos: ${um(e.empregos)}% da população · salário ${um1(e.salario)}× a média · salários ${din(e.massa)} · lucro ${din(e.lucro)}`;
                    })()}
                  </p>
                ) : null}
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
                          style={{
                            width: `${Math.min(p.cobertura, 200) / 2}%`,
                          }}
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
            ))
          : null}
        {aba === "pais" && mercado ? (
          <p className="folha-explica">
            Sem emprego formal: {um(mercado.semEmprego)}% da população. Salário
            em vezes a renda média por pessoa; o dono do negócio vive de lucro.
          </p>
        ) : null}
        {aba === "pais" && mercado?.dependencia.length ? (
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
      </div>
    </Documento>
  );
}
