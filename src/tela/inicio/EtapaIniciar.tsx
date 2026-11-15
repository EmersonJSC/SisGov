import type { PreparoDoComeco } from "../../partida";
import { Foto } from "./Foto";
import { VAGAS, type Escolhas } from "./escolhas";
import { nomeDoPais } from "../mapa/formatos";

export function EtapaIniciar({
  e,
  mudar,
  preparo,
}: {
  e: Escolhas;
  mudar: (parcial: Partial<Escolhas>) => void;
  preparo: PreparoDoComeco;
}) {
  return (
    <section className="ini-dossie ini-resumo">
      <h2>Termo de posse</h2>
      <p>
        <b>{e.nome}</b> ({e.sigla}) assume o governo de{" "}
        <b>{nomeDoPais(e.pais)}</b>.
      </p>
      <div className="ini-chapa ini-chapa-pequena">
        {VAGAS.map((v, i) => {
          const pessoa = preparo.pessoas.find((p) => p.id === e.chapa[v.chave]);
          return (
            <div key={v.chave} className="ini-vaga">
              <Foto pessoa={pessoa ?? null} inclinacao={[-2, 1, 2.4][i]} />
              <span className="ini-vaga-cargo">{v.nome}</span>
              <b>{pessoa?.nome}</b>
            </div>
          );
        })}
      </div>
      <p className="ini-observacao">
        {preparo.caixas.length} ministérios montados. O Congresso começa como
        está, e o seu partido começa com poucas cadeiras: a base se constrói com
        a coligação.
      </p>
      <details className="ini-testes">
        <summary>Opções de teste</summary>
        <label>
          <input
            type="checkbox"
            checked={e.semCongresso}
            onChange={(x) => mudar({ semCongresso: x.target.checked })}
          />{" "}
          Sem Congresso (toda lei passa)
        </label>
        <label>
          <input
            type="checkbox"
            checked={!e.semSenado}
            onChange={(x) => mudar({ semSenado: !x.target.checked })}
          />{" "}
          Senado (liga e desliga)
        </label>
        <label>
          <input
            type="checkbox"
            checked={e.comJudiciario}
            onChange={(x) => mudar({ comJudiciario: x.target.checked })}
          />{" "}
          Judiciário (liga e desliga; fora da V1)
        </label>
      </details>
    </section>
  );
}
