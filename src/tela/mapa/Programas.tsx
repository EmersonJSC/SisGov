/**
 * Janela dos Programas: os que já se formaram, os que estão a caminho (com as
 * leis que faltam) e os que se desfizeram e deixaram saudade.
 */
import {
  situacoesDosProgramas,
  type Programa,
  type SituacaoDoPrograma,
  type VidaDoPrograma,
} from "../../motor";
import type { Partida, VisaoPartida } from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { ICONE_INTERFACE } from "./icones";

/** Falta tão pouco quanto isto para o programa aparecer como "a caminho". */
const PERTO = 1;

interface Linha {
  programa: Programa;
  situacao: SituacaoDoPrograma;
  vida?: VidaDoPrograma;
}

const desde = (turno: number) =>
  `ano ${Math.floor(turno / 6) + 1} · mês ${(turno % 6) * 2 + 1}`;

/** Programas de uma lista, com as leis que andaram e as que faltam. */
function Lista({
  titulo,
  vazio,
  linhas,
  nomeDaLei,
}: {
  titulo: string;
  vazio: string;
  linhas: Linha[];
  nomeDaLei: (id: string) => string;
}) {
  return (
    <section>
      <h2>{titulo}</h2>
      {linhas.length === 0 ? <p className="vazio">{vazio}</p> : null}
      <ul className="governo-caixas">
        {linhas.map(({ programa, situacao, vida }) => (
          <li key={programa.id} className="caixa">
            <div className="caixa-titulo">
              <strong>{vida?.nome ?? programa.nome}</strong>
              <span>
                {vida
                  ? `desde ${desde(vida.desde)}`
                  : `${situacao.andadas.length} de ${situacao.minimo} leis`}
              </span>
              <small>{programa.lado}</small>
            </div>
            {situacao.faltam.length && !vida ? (
              <p className="caixa-orgaos">
                Falta andar: {situacao.faltam.map(nomeDaLei).join(", ")}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Programas({
  partida,
  visao,
  onFechar,
  ...janela
}: JanelaProps & {
  partida: Partida;
  visao: VisaoPartida;
  onFechar: () => void;
}) {
  const { regras, estado } = partida;
  const rp = regras.programas;
  const ep = estado.programas;
  if (!rp || !ep) return null;
  const nomeDaLei = (id: string) =>
    visao.leis.find((l) => l.id === id)?.nome ?? id;
  const situacoes = situacoesDosProgramas(rp, ep, regras.leis, estado.leis);
  const linhas: Linha[] = rp.programas.map((programa, i) => ({
    programa,
    situacao: situacoes[i],
    vida: ep.vidas[programa.id],
  }));
  const com = (situacao: VidaDoPrograma["situacao"]) =>
    linhas.filter((l) => l.vida?.situacao === situacao);
  const caminho = linhas
    .filter(
      (l) =>
        !l.vida &&
        l.situacao.andadas.length > 0 &&
        l.situacao.minimo - l.situacao.andadas.length <= PERTO + 1,
    )
    .sort((a, b) => b.situacao.andadas.length - a.situacao.andadas.length);

  return (
    <Documento
      orgao="Presidência"
      setor="Programas"
      numero={`${com("formado").length} formados`}
      cor="#4a7a5e"
      icone={ICONE_INTERFACE.lei}
      onFechar={onFechar}
      rotulo="Programas"
      {...janela}
    >
      <div className="folha governo-janela">
        <Lista
          titulo="Formados"
          vazio="Nenhum programa formado ainda: ande com a maior parte das leis de um programa."
          linhas={com("formado")}
          nomeDaLei={nomeDaLei}
        />
        <Lista
          titulo="A caminho"
          vazio="Nenhum programa perto de se formar."
          linhas={caminho}
          nomeDaLei={nomeDaLei}
        />
        {com("desfeito").length ? (
          <Lista
            titulo="Desfeitos (os grupos lembram)"
            vazio=""
            linhas={com("desfeito")}
            nomeDaLei={nomeDaLei}
          />
        ) : null}
      </div>
    </Documento>
  );
}
