/**
 * Janela do Governo: as caixas de ministério com a ficha de quem manda em
 * cada uma, os órgãos (rendimento e corrupção) e o pedido de trocar ministro.
 */
import { useState } from "react";
import {
  caixaDaLei,
  candidatosDoPartido,
  fichaDe,
  situacaoDoOrgao,
  type Ficha,
} from "../../motor";
import {
  nomesDoGoverno,
  nomesPartidos,
  type Partida,
  type Pedido,
} from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { ICONE_INTERFACE } from "./icones";
import { trocar } from "./pedidos";

const FICHA: [keyof Ficha, string][] = [
  ["competencia", "Competência"],
  ["habilidade", "Política"],
  ["carisma", "Carisma"],
  ["honestidade", "Honestidade"],
  ["lealdade", "Lealdade"],
];

const um = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

/** Cor do rendimento: falta verba, rende, ou sobra e vira corrupção. */
const estadoDoOrgao = (rendimento: number) =>
  rendimento < 0.9 ? "falta" : rendimento > 1.1 ? "sobra" : "rende";

export function Governo({
  partida,
  extras,
  setExtras,
  onFechar,
  ...janela
}: JanelaProps & {
  partida: Partida;
  /** Pedidos de nomear já marcados neste turno. */
  extras: Pedido[];
  setExtras: (e: Pedido[]) => void;
  onFechar: () => void;
}) {
  const { regras, estado } = partida;
  const governo = estado.governo;
  const rg = regras.governo;
  const nomes = nomesDoGoverno(partida);
  const partidos = nomesPartidos(partida.pais, partida.opcoes.comeco);
  const [aberta, setAberta] = useState<string | null>(null);
  if (!governo || !rg) return null;

  const origem = (f: Ficha) =>
    f.origem === "tecnico" ? "técnico" : (partidos[f.origem] ?? f.origem);
  const livres = rg.pessoas.filter(
    (p) => !governo.caixas.some((c) => c.ministro === p.id),
  );
  const nomeacao = (caixa: string) =>
    extras.find((x) => x.tipo === "nomear" && x.caixa === caixa);
  const orgaos = Object.entries(governo.orgaos)
    .map(([esfera, o]) => ({
      esfera,
      ministro: caixaDaLei(rg, governo.caixas, { id: esfera, esfera }).molde,
      ...situacaoDoOrgao(o, regras.leis, estado.leis, esfera),
    }))
    .sort((a, b) => b.corrupcao - a.corrupcao);
  const doMinisterio = (caixa: string) =>
    orgaos.filter((o) => o.ministro === caixa);

  return (
    <Documento
      orgao="Presidência"
      setor="Governo"
      numero={`${governo.caixas.length} ministérios`}
      cor="#4a5e7a"
      icone={ICONE_INTERFACE.lei}
      onFechar={onFechar}
      rotulo="Governo"
      {...janela}
    >
      <div className="folha governo-janela">
        <section>
          <h2>Ministérios</h2>
          <ul className="governo-caixas">
            {governo.caixas.map((c) => {
              const f = fichaDe(rg, c.ministro);
              const nova = nomeacao(c.molde);
              const dela = doMinisterio(c.molde);
              return (
                <li key={c.molde} className="caixa">
                  <button
                    type="button"
                    className="caixa-titulo"
                    onClick={() =>
                      setAberta(aberta === c.molde ? null : c.molde)
                    }
                  >
                    <strong>{nomes.caixas[c.molde] ?? c.molde}</strong>
                    <span>
                      {f.nome} · {origem(f)}
                    </span>
                    <small>competência {f.competencia}</small>
                  </button>
                  {aberta === c.molde ? (
                    <div className="caixa-ficha">
                      <ul className="ficha-notas">
                        {FICHA.map(([campo, rotulo]) => (
                          <li key={campo}>
                            <span>{rotulo}</span>
                            <span
                              className="termometro"
                              role="img"
                              aria-label={`${rotulo} ${f[campo] as number}`}
                            >
                              <i style={{ width: `${f[campo] as number}%` }} />
                            </span>
                            <small>{f[campo] as number}</small>
                          </li>
                        ))}
                      </ul>
                      {dela.length ? (
                        <p className="caixa-orgaos">
                          Órgãos:{" "}
                          {dela
                            .map(
                              (o) =>
                                `${nomes.esferas[o.esfera] ?? o.esfera} (corrupção ${um(o.corrupcao)})`,
                            )
                            .join(", ")}
                        </p>
                      ) : null}
                      <label className="caixa-nomear">
                        Trocar por{" "}
                        <select
                          value={nova?.tipo === "nomear" ? nova.ministro : ""}
                          onChange={(e) =>
                            setExtras(
                              trocar(
                                extras,
                                (x) =>
                                  x.tipo === "nomear" && x.caixa === c.molde,
                                e.target.value
                                  ? {
                                      tipo: "nomear",
                                      caixa: c.molde,
                                      ministro: e.target.value,
                                    }
                                  : undefined,
                              ),
                            )
                          }
                        >
                          <option value="">(manter)</option>
                          {livres.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nome} · {origem(p)} · comp. {p.competencia} ·
                              hon. {p.honestidade}
                            </option>
                          ))}
                        </select>
                      </label>
                      {nova ? (
                        <small>
                          Troca ao passar o turno; o partido do demitido fica
                          ressentido.
                        </small>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h2>Órgãos</h2>
          <p className="vazio">
            Rendimento é a verba da lei dividida pelo trabalho que as leis
            pedem. Verba demais, cargos de livre nomeação e ministro desonesto
            viram corrupção.
          </p>
          <ul className="governo-orgaos">
            {orgaos.map((o) => (
              <li
                key={o.esfera}
                className={`orgao orgao-${estadoDoOrgao(o.rendimento)}`}
              >
                <span>{nomes.esferas[o.esfera] ?? o.esfera}</span>
                <small>rende {um(o.rendimento * 100)}%</small>
                <span
                  className="termometro"
                  role="img"
                  aria-label={`Corrupção ${um(o.corrupcao)}`}
                >
                  <i style={{ width: `${o.corrupcao}%` }} />
                </span>
                <small>{um(o.corrupcao)}</small>
              </li>
            ))}
          </ul>
        </section>
        {rg.pessoas.length - governo.caixas.length > 0 ? (
          <p className="vazio">
            {livres.length} pessoas sem cargo; partidos com candidato:{" "}
            {[...new Set(livres.map((p) => p.origem))]
              .filter((o) => candidatosDoPartido(rg, governo.caixas, o).length)
              .map((o) => (o === "tecnico" ? "técnicos" : (partidos[o] ?? o)))
              .join(", ")}
            .
          </p>
        ) : null}
      </div>
    </Documento>
  );
}
