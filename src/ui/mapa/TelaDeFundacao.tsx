/**
 * Primeira tela (V1-39): o jogador é um partido. Funda o partido e escolhe
 * quem vai à Presidência, como numa seleção de personagem: os rostos em
 * fila e a ficha de quem está em foco. Ninguém diz de que lado está.
 */
import { useMemo, useState } from "react";
import { primeirosCandidatos } from "../../app/partida";
import { Arte, Retrato } from "./Arte";

export type Fundacao = Readonly<{
  semente: number;
  partido: Readonly<{ nome: string; sigla: string }>;
  presidente: string;
}>;

/** "Partido da Reconstrução Nacional" → "PRN". */
const iniciais = (nome: string) =>
  nome
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .map((p) => p[0].toUpperCase())
    .join("")
    .slice(0, 5);

function Medidor({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="fd-medidor">
      <span>{rotulo}</span>
      <span className="fd-pips" aria-label={`${valor} de 3`}>
        {[1, 2, 3].map((i) => (
          <i key={i} className={i <= valor ? "fd-cheio" : undefined} />
        ))}
      </span>
    </div>
  );
}

export function TelaDeFundacao({
  semente,
  onComecar,
}: {
  semente: number;
  onComecar: (f: Fundacao) => void;
}) {
  const nomes = useMemo(() => primeirosCandidatos({ semente }), [semente]);
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [presidente, setPresidente] = useState<string | null>(null);
  const [emFoco, setEmFoco] = useState<string | null>(null);
  const ficha = nomes.find((p) => p.id === (emFoco ?? presidente));
  const marca = sigla.trim() || iniciais(nome) || "?";
  const pronto = nome.trim().length > 1 && presidente !== null;
  return (
    <main className="fd-tela">
      <div className="fd-conteudo">
        <header className="fd-topo">
          <Arte
            caminho="logo/sisgov.png"
            className="fd-logo"
            alt="SisGov"
            substituto={<span className="fd-marca">SisGov</span>}
          />
          <p className="fd-chamada">
            Você não é o presidente. Você é o partido.
          </p>
        </header>

        <section className="fd-passo" aria-label="Funde o seu partido">
          <h2>
            <span className="fd-numero">I</span> Funde o seu partido
          </h2>
          <div className="fd-partido">
            <div className="fd-emblema" aria-hidden>
              <Arte caminho="logo/emblema.png" className="fd-emblema-arte" />
              <span>{marca}</span>
            </div>
            <label className="fd-campo fd-campo-nome">
              Nome
              <input
                value={nome}
                maxLength={60}
                placeholder="Partido da Reconstrução Nacional"
                onChange={(e) => setNome(e.target.value)}
              />
            </label>
            <label className="fd-campo fd-campo-sigla">
              Sigla
              <input
                value={sigla}
                maxLength={8}
                placeholder={iniciais(nome) || "PRN"}
                onChange={(e) => setSigla(e.target.value.toUpperCase())}
              />
            </label>
          </div>
        </section>

        <section className="fd-passo" aria-label="Quem vai governar">
          <h2>
            <span className="fd-numero">II</span> Escolha quem vai governar
          </h2>
          <p className="fd-dica">
            Ninguém diz de que lado está. Leia o que cada um pensa.
          </p>
          <div className="fd-elenco" role="radiogroup">
            {nomes.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={presidente === p.id}
                className={`fd-rosto${presidente === p.id ? " fd-escolhido" : ""}`}
                style={{ animationDelay: `${i * 70}ms` }}
                onClick={() => setPresidente(p.id)}
                onMouseEnter={() => setEmFoco(p.id)}
                onMouseLeave={() => setEmFoco(null)}
                onFocus={() => setEmFoco(p.id)}
                onBlur={() => setEmFoco(null)}
              >
                <Retrato retrato={p.retrato} className="fd-retrato" />
                <span className="fd-placa">
                  <strong>{p.nome}</strong>
                  <small>
                    {p.idade} anos · {p.carreira || "pessoa real"}
                  </small>
                </span>
              </button>
            ))}
          </div>

          <article className="fd-ficha" aria-live="polite">
            {ficha ? (
              <>
                <header>
                  <h3>{ficha.nome}</h3>
                  <p>
                    {ficha.idade} anos · {ficha.estado}
                    {ficha.carreira ? ` · ${ficha.carreira}` : ""}
                    {ficha.real ? " · pessoa real" : ""}
                  </p>
                </header>
                <p className="fd-bio">{ficha.biografia}</p>
                {ficha.opinioes.length ? (
                  <ul className="fd-falas">
                    {ficha.opinioes.map((o) => (
                      <li key={o}>“{o}”</li>
                    ))}
                  </ul>
                ) : null}
                <div className="fd-medidores">
                  <Medidor rotulo="Carisma" valor={ficha.carisma} />
                  <Medidor rotulo="Experiência" valor={ficha.experiencia} />
                </div>
              </>
            ) : (
              <p className="fd-vazia">
                Passe o mouse num rosto para ler a ficha.
              </p>
            )}
          </article>
        </section>

        <footer className="fd-pe">
          <button
            type="button"
            className="fd-comecar"
            disabled={!pronto}
            onClick={() =>
              presidente &&
              onComecar({
                semente,
                partido: {
                  nome: nome.trim(),
                  sigla: sigla.trim() || iniciais(nome),
                },
                presidente,
              })
            }
          >
            Começar o mandato
          </button>
          {!pronto ? (
            <span className="fd-falta">
              {nome.trim().length < 2
                ? "Falta o nome do partido."
                : "Falta escolher o presidente."}
            </span>
          ) : null}
        </footer>
      </div>
    </main>
  );
}
