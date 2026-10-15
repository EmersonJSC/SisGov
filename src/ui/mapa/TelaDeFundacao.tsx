/**
 * Primeira tela (V1-39): o jogador é um partido. Dá o nome e escolhe quem
 * vai à Presidência entre os personagens gerados pela semente da partida.
 */
import { useMemo, useState } from "react";
import { primeirosCandidatos } from "../../app/partida";
import { CartaoDePersonagem } from "./CartaoDePersonagem";

export type Fundacao = Readonly<{
  semente: number;
  partido: Readonly<{ nome: string; sigla: string }>;
  presidente: string;
}>;

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
  const pronto = nome.trim().length > 1 && presidente !== null;
  return (
    <main className="fd-tela">
      <header className="fd-topo">
        <h1>Um novo partido</h1>
        <p>
          Você não é o presidente: você é o partido. Dê um nome a ele e escolha
          quem vai governar. Ninguém aqui diz de que lado está; leia o que cada
          um pensa.
        </p>
      </header>
      <section className="fd-nome" aria-label="Nome do partido">
        <label>
          Nome do partido
          <input
            value={nome}
            maxLength={60}
            placeholder="Partido da Reconstrução Nacional"
            onChange={(e) => setNome(e.target.value)}
          />
        </label>
        <label>
          Sigla (opcional)
          <input
            value={sigla}
            maxLength={8}
            placeholder="PRN"
            onChange={(e) => setSigla(e.target.value.toUpperCase())}
          />
        </label>
      </section>
      <section className="fd-nomes" aria-label="Quem vai à Presidência">
        <h2>Quem vai à Presidência</h2>
        <div className="ps-grade">
          {nomes.map((p) => (
            <CartaoDePersonagem
              key={p.id}
              personagem={p}
              selecionado={presidente === p.id}
              onEscolher={() => setPresidente(p.id)}
            />
          ))}
        </div>
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
              partido: { nome: nome.trim(), sigla: sigla.trim() },
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
    </main>
  );
}
