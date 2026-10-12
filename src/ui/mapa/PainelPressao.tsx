/**
 * Aba "Pressão" da lista lateral (V1-09): os grupos de pressão por seção,
 * com o nível escrito, a barra de pressão com a entrada de cada nível, o
 * motivo, a última ação e quem financia ("?" enquanto ninguém investigou).
 * Níveis 0 e 1 aparecem apagados.
 */
import type { VisaoGrupoPressao, VisaoPressao } from "../../app/partida";
import { Icone } from "./Icone";

const ICONE_NIVEL = [
  "minus",
  "account-clock-outline",
  "bullhorn-outline",
  "alert-octagon-outline",
];

function Financiadores({ g }: { g: VisaoGrupoPressao }) {
  const nomes = g.financiadoPor.map(
    (f) => `${f.nome}${f.revelado ? " (revelado)" : ""}`,
  );
  // O oculto não aparece: sem investigação, fica o "?" de quem ninguém sabe.
  const texto =
    g.investigadoEm === undefined
      ? [...nomes, "?"].join(", ")
      : nomes.length
        ? nomes.join(", ")
        : `nada achado (turno ${g.investigadoEm})`;
  return (
    <small>
      Financiado por: <b>{texto}</b>
    </small>
  );
}

function LinhaPressao({
  g,
  podeInvestigar,
  onInvestigar,
}: {
  g: VisaoGrupoPressao;
  podeInvestigar: boolean;
  onInvestigar: (id: string) => void;
}) {
  return (
    <li className={`pressao-nivel-${g.nivel}`}>
      <div className="grupo-linha">
        <span className="grupo-icone">
          <Icone nome={ICONE_NIVEL[g.nivel] ?? "minus"} tamanho={18} />
        </span>
        <span className="grupo-nome">
          <strong>{g.nome}</strong>
          <small>{g.nomeDoNivel}</small>
        </span>
        <span className="grupo-valor">{Math.round(g.pressao)}</span>
        <span
          className="grupo-barra pressao-barra"
          aria-hidden="true"
          title={g.limites
            .map(
              (l, i) =>
                `Nível ${i + 1}: sobe com ${Math.round(l.entrada)}, desce com ${Math.round(l.saida)}`,
            )
            .join("\n")}
        >
          <i style={{ width: `${Math.min(100, Math.max(0, g.pressao))}%` }} />
          {g.limites.map((l, i) => (
            <b
              key={i}
              style={{ left: `${Math.min(100, Math.max(0, l.entrada))}%` }}
            />
          ))}
        </span>
      </div>
      <div className="pressao-detalhes">
        {g.motivo ? <small>Motivo: {g.motivo}</small> : null}
        {g.ultimaAcao ? (
          <small>
            Última ação: {g.ultimaAcao.manchete} (turno {g.ultimaAcao.turno + 1}
            )
          </small>
        ) : null}
        <Financiadores g={g} />
        {g.investigacao ? (
          <small className="investigando">
            Investigação em curso: até {g.investigacao.turnosRestantes}{" "}
            {g.investigacao.turnosRestantes === 1 ? "turno" : "turnos"}
          </small>
        ) : (
          <button
            type="button"
            className="botao-investigar"
            disabled={!podeInvestigar}
            onClick={() => onInvestigar(g.id)}
            title={
              podeInvestigar
                ? "Abrir uma investigação sobre quem financia este grupo"
                : "Já há investigações demais em curso"
            }
          >
            <Icone nome="magnify" tamanho={12} />
            Investigar
          </button>
        )}
      </div>
    </li>
  );
}

export function PainelPressao({
  pressao,
  onInvestigar,
}: {
  pressao: VisaoPressao;
  onInvestigar: (id: string) => void;
}) {
  const { investigacao } = pressao;
  const podeInvestigar = investigacao.emCurso < investigacao.aoMesmoTempo;
  return (
    <div className="eixos-grupos">
      <p className="pressao-capacidade">
        Capacidade de investigação {Math.round(investigacao.capacidade)} de 100
        · {investigacao.emCurso} de {investigacao.aoMesmoTempo} investigações em
        curso
      </p>
      {pressao.secoes.map((secao) => {
        const lista = pressao.grupos.filter((g) => g.secao === secao.id);
        if (!lista.length) return null;
        return (
          <section key={secao.id} className="eixo-grupos">
            <h4>{secao.nome}</h4>
            <ol className="lista-grupos lista-pressao">
              {lista.map((g) => (
                <LinhaPressao
                  key={g.id}
                  g={g}
                  podeInvestigar={podeInvestigar}
                  onInvestigar={onInvestigar}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
