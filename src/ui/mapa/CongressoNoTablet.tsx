/**
 * App "Congresso" do tablet (V1-12, docs/v1/desenho/tramitacao.md): as
 * cadeiras de cada bancada na Câmara e no Senado desta partida, a fila de
 * projetos com a previsão de votos, os pedidos das bancadas e o resultado das
 * últimas votações. O Congresso vota sozinho no fim do turno; aqui só se vê.
 */
import type { VisaoDaTramitacao, VisaoDoProjeto } from "../../app/partida";

type Bancada = VisaoDaTramitacao["bancadas"][number];

/** Cores das bancadas: vermelho à esquerda, azul à direita. */
const COR: Readonly<Record<string, string>> = {
  extrema_esquerda: "#9b1c1c",
  esquerda: "#e04b3a",
  centro: "#e0a420",
  centrao: "#3f9f8f",
  direita: "#3c6fd1",
  extrema_direita: "#1f2f7a",
  jogador: "#2f9e44",
};
const corDa = (id: string) => COR[id] ?? "#8b93a0";

const NOME_TIPO: Readonly<Record<string, string>> = {
  "lei-ordinaria": "Lei ordinária",
  "lei-complementar": "Lei complementar",
  emenda: "Emenda à Constituição",
};

const NOME_PEDIDO: Readonly<Record<string, string>> = {
  ministerio: "um ministério",
  verba: "verba para as bases (emendas)",
  apoio: "apoio a uma lei dela",
};

const NOME_RESULTADO: Readonly<Record<string, string>> = {
  avancou: "Aprovado, segue",
  passou: "Aprovado",
  adiou: "Adiado",
  caiu: "Rejeitado",
};

const pct = (v: number) => `${Math.round(v * 100)}%`;

/** Da esquerda para a direita, pelo ponto na bússola. */
function emOrdem(bancadas: readonly Bancada[]): Bancada[] {
  return [...bancadas].sort(
    (a, b) =>
      a.ponto.economia +
      a.ponto.costumes -
      (b.ponto.economia + b.ponto.costumes),
  );
}

/**
 * Semicírculo com um ponto por cadeira, em fileiras: as cadeiras andam do
 * lado esquerdo para o direito, e cada bancada pega as suas na ordem.
 */
function Plenario({
  casa,
  total,
  bancadas,
}: {
  casa: string;
  total: number;
  bancadas: readonly Bancada[];
}) {
  const largura = 300;
  const raio = 140;
  const fileiras = total > 200 ? 9 : 5;
  const interno = raio * 0.42;
  const raios = Array.from(
    { length: fileiras },
    (_, i) => interno + ((raio - interno) * i) / (fileiras - 1),
  );
  const soma = raios.reduce((a, b) => a + b, 0);
  const porFileira = raios.map((r) => Math.round((total * r) / soma));
  porFileira[fileiras - 1] += total - porFileira.reduce((a, b) => a + b, 0);
  const lugares: { angulo: number; x: number; y: number }[] = [];
  raios.forEach((r, i) => {
    const n = porFileira[i];
    for (let k = 0; k < n; k++) {
      const angulo = Math.PI * (1 - (k + 0.5) / n);
      lugares.push({
        angulo,
        x: largura / 2 + r * Math.cos(angulo),
        y: raio + 6 - r * Math.sin(angulo),
      });
    }
  });
  lugares.sort((a, b) => b.angulo - a.angulo);
  const cores: string[] = [];
  for (const b of bancadas)
    for (let i = 0; i < (b.cadeiras[casa] ?? 0); i++) cores.push(corDa(b.id));
  const tamanho = total > 200 ? 3.1 : 6;
  return (
    <svg
      viewBox={`0 0 ${largura} ${raio + 12}`}
      className="cg-plenario"
      aria-hidden
    >
      {lugares.map((l, i) => (
        <circle
          key={i}
          cx={l.x}
          cy={l.y}
          r={tamanho}
          fill={cores[i] ?? "#c7ccd4"}
        />
      ))}
    </svg>
  );
}

function Casa({
  casa,
  bancadas,
  capacidade,
}: {
  casa: VisaoDaTramitacao["casas"][number];
  bancadas: readonly Bancada[];
  capacidade: number;
}) {
  return (
    <section className="cg-casa" aria-label={casa.nome}>
      <h2>
        {casa.nome} <small>{casa.cadeiras} cadeiras</small>
      </h2>
      <Plenario casa={casa.id} total={casa.cadeiras} bancadas={bancadas} />
      <ul className="cg-legenda">
        {bancadas.map((b) => {
          const n = b.cadeiras[casa.id] ?? 0;
          return (
            <li key={b.id}>
              <span
                className="cg-bolinha"
                style={{ background: corDa(b.id) }}
              />
              <span className="cg-nome">{b.nome}</span>
              <strong>{n}</strong>
              <span className="cg-pct">{pct(n / casa.cadeiras)}</span>
            </li>
          );
        })}
      </ul>
      <p className="cg-capacidade">
        {capacidade > 0
          ? `Vota até ${capacidade} projeto${capacidade > 1 ? "s" : ""} no fim do turno.`
          : "Sem apoio: ignora a fila neste turno."}
      </p>
    </section>
  );
}

function Projeto({
  projeto,
  nomeDaCasa,
}: {
  projeto: VisaoDoProjeto;
  nomeDaCasa: (id: string) => string;
}) {
  const proxima = projeto.etapas[0];
  const chega = proxima ? proxima.esperado >= proxima.quorum : false;
  return (
    <li className="cg-projeto">
      <div className="cg-projeto-topo">
        <strong>
          {projeto.revogar ? `Revogar: ${projeto.nome}` : projeto.nome}
        </strong>
        <span className="cg-tipo">
          {NOME_TIPO[projeto.tipo] ?? projeto.tipo}
        </span>
        {projeto.medidaProvisoria ? (
          <span className="cg-selo">Medida provisória, já vale</span>
        ) : null}
        {projeto.pressa !== "normal" ? (
          <span className="cg-selo">
            {projeto.pressa === "urgencia" ? "Urgência" : "Modo emergência"}
          </span>
        ) : null}
      </div>
      <p className="cg-projeto-pe">
        Opinião pública:{" "}
        <b className={projeto.opiniao >= 0 ? "cg-a-favor" : "cg-contra"}>
          {projeto.opiniao >= 0.05
            ? "a favor"
            : projeto.opiniao <= -0.05
              ? "contra"
              : "indiferente"}
        </b>
        {proxima ? (
          <>
            {" · "}
            {nomeDaCasa(proxima.casa)}
            {projeto.tipo === "emenda"
              ? `, ${proxima.rodada}º turno`
              : ""}:{" "}
            <b className={chega ? "cg-a-favor" : "cg-contra"}>
              ~{Math.round(proxima.esperado)} votos
            </b>{" "}
            de {proxima.quorum} necessários
          </>
        ) : null}
        {projeto.aguardando ? " · espera a sua resposta a um pedido" : ""}
      </p>
    </li>
  );
}

export function CongressoNoTablet({
  congresso,
  nomeDaLei,
  onResponder,
}: {
  congresso: VisaoDaTramitacao;
  nomeDaLei: (id: string) => string;
  onResponder: (pedidoId: string, aceitar: boolean) => void;
}) {
  const bancadas = emOrdem(congresso.bancadas);
  const nomeDaCasa = (id: string) =>
    congresso.casas.find((c) => c.id === id)?.nome ?? id;
  const nomeDaBancada = (id: string) =>
    congresso.bancadas.find((b) => b.id === id)?.nome ?? id;
  return (
    <div className="cg-app">
      <div className="cg-casas">
        {congresso.casas.map((casa) => (
          <Casa
            key={casa.id}
            casa={casa}
            bancadas={bancadas}
            capacidade={congresso.capacidade[casa.id] ?? 0}
          />
        ))}
      </div>

      <div className="cg-colunas">
        <section aria-label="Fila do Congresso">
          {congresso.pedidos.length ? (
            <>
              <h2>Pedidos das bancadas</h2>
              <ul className="cg-pedidos">
                {congresso.pedidos.map((p) => (
                  <li key={p.id} className="cg-pedido">
                    <p>
                      <b>{p.nomeDaBancada}</b> pede {NOME_PEDIDO[p.tipo]}
                      {p.lei ? ` (${p.lei})` : ""} para votar a favor de{" "}
                      <b>{p.projeto}</b>.
                    </p>
                    <div className="cg-botoes">
                      <button
                        type="button"
                        onClick={() => onResponder(p.id, true)}
                      >
                        Aceitar
                      </button>
                      <button
                        type="button"
                        className="cg-recusar"
                        onClick={() => onResponder(p.id, false)}
                      >
                        Recusar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <h2>Fila de votação</h2>
          {congresso.fila.length ? (
            <ul className="cg-fila">
              {congresso.fila.map((p) => (
                <Projeto key={p.id} projeto={p} nomeDaCasa={nomeDaCasa} />
              ))}
            </ul>
          ) : (
            <p className="tb-calmo">
              Nenhum projeto na fila. Mude uma lei no mapa ou aprove uma lei
              fora do mapa para mandar ao Congresso.
            </p>
          )}
        </section>

        <section aria-label="Últimas votações">
          <h2>Últimas votações</h2>
          {congresso.votacoes.length ? (
            <ul className="cg-votacoes">
              {congresso.votacoes.map((v) => {
                const total = Object.values(v.porBancada).reduce(
                  (s, b) => s + b.cadeiras,
                  0,
                );
                return (
                  <li key={`${v.projeto}-${v.casa}-${v.rodada}`}>
                    <div className="cg-projeto-topo">
                      <strong>{nomeDaLei(v.lei)}</strong>
                      <span className={`cg-resultado cg-${v.resultado}`}>
                        {NOME_RESULTADO[v.resultado]}
                      </span>
                    </div>
                    <p className="cg-projeto-pe">
                      {nomeDaCasa(v.casa)}: {v.sim} sim, {v.nao} não (precisava
                      de {v.quorum})
                    </p>
                    <div
                      className="cg-barra"
                      role="img"
                      aria-label={`${v.sim} votos sim de ${total}`}
                    >
                      {bancadas.map((b) => {
                        const sim = v.porBancada[b.id]?.sim ?? 0;
                        return sim ? (
                          <span
                            key={b.id}
                            title={`${nomeDaBancada(b.id)}: ${sim} de ${v.porBancada[b.id]?.cadeiras ?? 0} votaram sim`}
                            style={{
                              width: `${(100 * sim) / total}%`,
                              background: corDa(b.id),
                            }}
                          />
                        ) : null;
                      })}
                      <i
                        className="cg-quorum"
                        style={{ left: `${(100 * v.quorum) / total}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="tb-calmo">
              Nenhuma votação ainda. O Congresso vota no fim do turno.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
