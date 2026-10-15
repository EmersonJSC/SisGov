/**
 * Cartão de um personagem (V1-39): biografia e opiniões. O lado e a
 * ideologia nunca aparecem; o jogador deduz pelo que ele diz.
 */
import type { VisaoPersonagem } from "../../app/partida";

const ESTRANHA = [
  "",
  "A base estranha um pouco",
  "A base estranha",
  "A base estranha muito",
];

export function CartaoDePersonagem({
  personagem: p,
  selecionado = false,
  onEscolher,
  rotuloDoBotao = "Escolher",
  selo,
}: {
  personagem: VisaoPersonagem;
  selecionado?: boolean;
  onEscolher?: () => void;
  rotuloDoBotao?: string;
  selo?: string;
}) {
  const estranha = p.estranhamento ? ESTRANHA[p.estranhamento] : "";
  return (
    <article
      className={`ps-cartao${selecionado ? " ps-escolhido" : ""}`}
      aria-label={p.nome}
    >
      <header>
        <strong>{p.nome}</strong>
        <span className="ps-sub">
          {p.idade} anos · {p.estado}
          {p.carreira ? ` · ${p.carreira}` : ""}
          {p.real ? " · pessoa real" : ""}
        </span>
        {selo ? <span className="ps-selo">{selo}</span> : null}
      </header>
      <p className="ps-bio">{p.biografia}</p>
      {p.opinioes.length ? (
        <ul className="ps-opinioes">
          {p.opinioes.map((o) => (
            <li key={o}>“{o}”</li>
          ))}
        </ul>
      ) : null}
      <p className="ps-tracos">
        Carisma {"●".repeat(p.carisma)}
        {"○".repeat(3 - p.carisma)} · Experiência {"●".repeat(p.experiencia)}
        {"○".repeat(3 - p.experiencia)}
      </p>
      {estranha ? <p className="ps-estranha">{estranha}</p> : null}
      {onEscolher ? (
        <button
          type="button"
          className="ps-botao"
          aria-pressed={selecionado}
          onClick={onEscolher}
        >
          {selecionado ? "Escolhido" : rotuloDoBotao}
        </button>
      ) : null}
    </article>
  );
}
