/**
 * Peças do estilo "Dossiê Tropical" (docs/arte/PROMPTS.md): polaroides
 * presas na mesa e a folha do personagem em foco. Usadas na primeira tela
 * e no app da eleição.
 */
import { useState, type CSSProperties, type ReactNode } from "react";
import type { VisaoPersonagem } from "../../app/partida";
import { Retrato } from "./Arte";

/** Inclinação de cada polaroide na mesa, em graus. */
const GIROS = [-2.5, 1.5, -1, 2.2, -1.8, 1];

const ESTRANHA = [
  "",
  "A base estranha um pouco",
  "A base estranha",
  "A base rejeita",
];

function Medidor({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="ds-medidor">
      <span>{rotulo}</span>
      <span className="ds-pips" aria-label={`${valor} de 3`}>
        {[1, 2, 3].map((i) => (
          <i key={i} className={i <= valor ? "ds-cheio" : undefined} />
        ))}
      </span>
    </div>
  );
}

export function Polaroide({
  personagem: p,
  indice = 0,
  escolhido = false,
  carimbo,
  selo,
  grande = false,
  onClick,
  onFoco,
}: {
  personagem: VisaoPersonagem;
  indice?: number;
  escolhido?: boolean;
  /** Carimbo por cima da foto ("Escolhido", "Candidato"). */
  carimbo?: string;
  /** Etiqueta acima do nome ("Presidente"). */
  selo?: string;
  grande?: boolean;
  onClick?: () => void;
  onFoco?: (emFoco: boolean) => void;
}) {
  const estilo = {
    "--giro": `${GIROS[indice % GIROS.length]}deg`,
    animationDelay: `${indice * 70}ms`,
  } as CSSProperties;
  const conteudo = (
    <>
      <span className="ds-alfinete" aria-hidden />
      <Retrato retrato={p.retrato} className="ds-retrato" />
      <span className="ds-legenda">
        {selo ? <em>{selo}</em> : null}
        <strong>{p.nome}</strong>
        <small>
          {p.idade} anos · {p.carreira || "pessoa real"}
        </small>
      </span>
      {carimbo ? (
        <span className="ds-carimbo-foto" aria-hidden>
          {carimbo}
        </span>
      ) : null}
    </>
  );
  const classe = `ds-polaroide${escolhido ? " ds-escolhido" : ""}${grande ? " ds-grande" : ""}`;
  if (!onClick)
    return (
      <div className={classe} style={estilo}>
        {conteudo}
      </div>
    );
  return (
    <button
      type="button"
      className={classe}
      style={estilo}
      aria-pressed={escolhido}
      onClick={onClick}
      onMouseEnter={() => onFoco?.(true)}
      onMouseLeave={() => onFoco?.(false)}
      onFocus={() => onFoco?.(true)}
      onBlur={() => onFoco?.(false)}
    >
      {conteudo}
    </button>
  );
}

/** A folha do dossiê: biografia, falas, traços e o estranhamento da base. */
export function Folha({
  personagem: p,
  carimbo = "Confidencial",
  children,
}: {
  personagem?: VisaoPersonagem;
  carimbo?: string;
  children?: ReactNode;
}) {
  return (
    <article className="ds-papel ds-folha" aria-live="polite">
      {p ? (
        <>
          <span className="ds-carimbo" aria-hidden>
            {carimbo}
          </span>
          <header>
            <h3>{p.nome}</h3>
            <p>
              {p.idade} anos · {p.estado}
              {p.carreira ? ` · ${p.carreira}` : ""}
              {p.real ? " · pessoa real" : ""}
            </p>
          </header>
          <p className="ds-bio">{p.biografia}</p>
          {p.opinioes.length ? (
            <ul className="ds-falas">
              {p.opinioes.map((o) => (
                <li key={o}>“{o}”</li>
              ))}
            </ul>
          ) : null}
          <div className="ds-medidores">
            <Medidor rotulo="Carisma" valor={p.carisma} />
            <Medidor rotulo="Experiência" valor={p.experiencia} />
          </div>
          {p.estranhamento ? (
            <p className="ds-estranha">{ESTRANHA[p.estranhamento]}</p>
          ) : null}
          {children}
        </>
      ) : (
        <p className="ds-vazia">Passe o mouse numa foto para abrir a ficha.</p>
      )}
    </article>
  );
}

/**
 * Polaroides em fila e a folha de quem está em foco (o mouse, senão o
 * escolhido, senão o primeiro). Com `escolherNoClique`, clicar na foto já
 * escolhe; sem ele, clicar só abre a folha e a escolha é pelo botão dela.
 */
export function Dossie({
  personagens,
  escolhido,
  onEscolher,
  escolherNoClique = false,
  rotuloDaEscolha = "Escolher",
  carimboDoEscolhido = "Escolhido",
  selo,
  vazio = false,
}: {
  personagens: readonly VisaoPersonagem[];
  escolhido?: string | null;
  onEscolher?: (id: string) => void;
  escolherNoClique?: boolean;
  rotuloDaEscolha?: string;
  carimboDoEscolhido?: string;
  selo?: (p: VisaoPersonagem) => string | undefined;
  /** Sem ninguém em foco, a folha começa vazia (a primeira tela). */
  vazio?: boolean;
}) {
  const [sobre, setSobre] = useState<string | null>(null);
  const [aberto, setAberto] = useState<string | null>(null);
  const foco =
    personagens.find((p) => p.id === (sobre ?? aberto ?? escolhido)) ??
    (vazio ? undefined : personagens[0]);
  return (
    <div className="ds-dossie">
      <div className="ds-elenco">
        {personagens.map((p, i) => (
          <Polaroide
            key={p.id}
            personagem={p}
            indice={i}
            escolhido={escolhido === p.id}
            carimbo={escolhido === p.id ? carimboDoEscolhido : undefined}
            selo={selo?.(p)}
            onClick={() => {
              setAberto(p.id);
              if (escolherNoClique) onEscolher?.(p.id);
            }}
            onFoco={(sim) => setSobre(sim ? p.id : null)}
          />
        ))}
      </div>
      <Folha personagem={foco}>
        {foco && onEscolher && !escolherNoClique ? (
          <button
            type="button"
            className="ds-assinar"
            disabled={escolhido === foco.id}
            onClick={() => onEscolher(foco.id)}
          >
            {escolhido === foco.id ? carimboDoEscolhido : rotuloDaEscolha}
          </button>
        ) : null}
      </Folha>
    </div>
  );
}
