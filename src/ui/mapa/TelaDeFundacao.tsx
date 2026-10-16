/**
 * Primeira tela (V1-39), no estilo "Dossiê Tropical" (docs/arte/PROMPTS.md):
 * a mesa do presidente. O jogador preenche a ficha de registro do partido e
 * escolhe quem vai governar entre as polaroides do dossiê. Ninguém diz de
 * que lado está.
 */
import { useMemo, useState } from "react";
import { primeirosCandidatos } from "../../app/partida";
import { Arte } from "./Arte";
import { Dossie } from "./Dossie";

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
  const marca = sigla.trim() || iniciais(nome) || "?";
  const pronto = nome.trim().length > 1 && presidente !== null;
  return (
    <main className="fd-tela ds-mesa">
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

        <section
          className="ds-papel fd-registro"
          aria-label="Ficha de registro do partido"
        >
          <header className="fd-cabecalho">
            <span>Ficha de registro de partido político</span>
            <span>Nº 0001 · via única</span>
          </header>
          <div className="fd-partido">
            <div className="fd-emblema" aria-hidden>
              <Arte caminho="logo/emblema.png" className="fd-emblema-arte" />
              <span>{marca}</span>
            </div>
            <label className="fd-campo fd-campo-nome">
              Nome do partido
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

        <section className="fd-dossie" aria-label="Candidatos à Presidência">
          <h2 className="ds-aba">Dossiê: quem vai governar</h2>
          <p className="ds-dica">
            Ninguém diz de que lado está. Leia o que cada um pensa.
          </p>
          <Dossie
            personagens={nomes}
            escolhido={presidente}
            onEscolher={setPresidente}
            escolherNoClique
            vazio
          />
        </section>

        <footer className="fd-pe">
          {!pronto ? (
            <span className="fd-falta">
              {nome.trim().length < 2
                ? "Falta o nome do partido."
                : "Falta escolher quem vai governar."}
            </span>
          ) : null}
          <button
            type="button"
            className="ds-placa fd-comecar"
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
            <span className="ds-lampada" aria-hidden />
            Tomar posse
          </button>
        </footer>
      </div>
    </main>
  );
}
