// Lista de pessoas de todos os partidos. Clicar numa pessoa abre o perfil de
// rede dela; escolher é um segundo gesto, com a ficha à vista.
import { useMemo, useState } from "react";
import {
  perfilDeUmaPessoa,
  type PessoaDaLista,
  type PreparoDoComeco,
} from "../../partida";
import { Foto } from "./Foto";

const NOTAS: { chave: keyof PessoaDaLista; nome: string }[] = [
  { chave: "competencia", nome: "Competência" },
  { chave: "habilidade", nome: "Habilidade política" },
  { chave: "carisma", nome: "Carisma" },
  { chave: "honestidade", nome: "Honestidade" },
  { chave: "lealdade", nome: "Lealdade" },
];

interface Props {
  titulo: string;
  pais: string;
  semente: number;
  pessoas: PessoaDaLista[];
  partidos: PreparoDoComeco["partidos"];
  onEscolher: (id: string) => void;
  onFechar: () => void;
}

function Ficha({ pessoa }: { pessoa: PessoaDaLista }) {
  return (
    <dl className="ini-notas-da-ficha">
      {NOTAS.map(({ chave, nome }) => (
        <div key={chave}>
          <dt>{nome}</dt>
          <dd>
            <span
              className="ini-nivel"
              style={{ width: `${pessoa[chave] as number}%` }}
            />
            <b>{pessoa[chave] as number}</b>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Perfil({
  pais,
  semente,
  pessoa,
}: {
  pais: string;
  semente: number;
  pessoa: PessoaDaLista;
}) {
  const perfil = useMemo(
    () => perfilDeUmaPessoa(pais, semente, pessoa.id),
    [pais, semente, pessoa.id],
  );
  if (!perfil) return null;
  return (
    <div className="ini-perfil">
      <div className="ini-perfil-topo">
        <Foto pessoa={pessoa} />
        <div>
          <h3>{pessoa.nome}</h3>
          <p className="ini-usuario">{perfil.usuario}</p>
          <p>
            {pessoa.idade} anos · {pessoa.origemNome}
          </p>
        </div>
      </div>
      <h4>Publicou</h4>
      <ul className="ini-posts">
        {perfil.posts.map((t) => (
          <li key={t}>“{t}”</li>
        ))}
      </ul>
      <h4>Frequenta</h4>
      <p>{perfil.lugares.join(" · ")}</p>
      <h4>Segue</h4>
      <p>{perfil.segue.join(" · ")}</p>
      <h4>Ficha</h4>
      <Ficha pessoa={pessoa} />
    </div>
  );
}

export function ListaDePessoas(p: Props) {
  const [origem, setOrigem] = useState("");
  const [busca, setBusca] = useState("");
  const [aberta, setAberta] = useState<string | null>(null);
  const visiveis = useMemo(
    () =>
      p.pessoas
        .filter((x) => !origem || x.origem === origem)
        .filter((x) => x.nome.toLowerCase().includes(busca.toLowerCase()))
        .sort((a, b) => a.nome.localeCompare(b.nome)),
    [p.pessoas, origem, busca],
  );
  const aberto = p.pessoas.find((x) => x.id === aberta) ?? null;
  return (
    <div className="ini-cortina" role="dialog" aria-label={p.titulo}>
      <section className="ini-dossie ini-lista">
        <header>
          <h2>{p.titulo}</h2>
          <button className="ini-fechar" onClick={p.onFechar}>
            Fechar
          </button>
        </header>
        <div className="ini-lista-corpo">
          <div className="ini-lista-esquerda">
            <div className="ini-filtros">
              <input
                placeholder="Procurar nome"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <select
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
              >
                <option value="">Todos os partidos</option>
                <option value="tecnico">Sem partido</option>
                {p.partidos.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.nome}
                  </option>
                ))}
              </select>
            </div>
            <ul className="ini-pessoas">
              {visiveis.map((x) => (
                <li key={x.id}>
                  <button
                    className={x.id === aberta ? "aberta" : ""}
                    onClick={() => setAberta(x.id)}
                  >
                    <b>{x.nome}</b>
                    <span>
                      {x.idade} anos · {x.origemNome}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="ini-lista-direita">
            {aberto ? (
              <>
                <Perfil pais={p.pais} semente={p.semente} pessoa={aberto} />
                <button
                  className="ini-placa"
                  onClick={() => p.onEscolher(aberto.id)}
                >
                  Escolher {aberto.nome.split(" ")[0]}
                </button>
              </>
            ) : (
              <p className="ini-dica">
                Clique numa pessoa para ver a rede social dela.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
