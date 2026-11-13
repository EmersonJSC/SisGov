/**
 * Janela das leis ainda não promulgadas: as que o país não tem e o presidente
 * pode propor. Escolher uma abre a janela da lei, onde ela é promulgada.
 */
import type { VisaoPartida } from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { ICONE_INTERFACE } from "./icones";
import "./NaoPromulgadas.css";

/** As leis do mapa que o país ainda não tem. */
export const naoPromulgadas = (visao: VisaoPartida) =>
  visao.leis.filter((l) => l.naoLegislada);

export function NaoPromulgadas({
  visao,
  onEscolher,
  onFechar,
  ...janela
}: JanelaProps & {
  visao: VisaoPartida;
  onEscolher: (id: string) => void;
  onFechar: () => void;
}) {
  const leis = naoPromulgadas(visao);
  const porMinisterio = new Map<string, typeof leis>();
  for (const lei of leis)
    porMinisterio.set(lei.ministerio, [
      ...(porMinisterio.get(lei.ministerio) ?? []),
      lei,
    ]);

  return (
    <Documento
      orgao="Congresso"
      setor="Leis não promulgadas"
      numero={`${leis.length} leis`}
      cor="#7a5a2a"
      icone={ICONE_INTERFACE.lei}
      onFechar={onFechar}
      rotulo="Leis não promulgadas"
      {...janela}
    >
      <div className="folha np-janela">
        {leis.length === 0 ? (
          <p className="vazio">Todas as leis já foram promulgadas.</p>
        ) : null}
        {[...porMinisterio].map(([ministerio, doMinisterio]) => (
          <section key={ministerio}>
            <h2>{ministerio}</h2>
            <ul className="np-lista">
              {doMinisterio.map((lei) => (
                <li key={lei.id}>
                  <button type="button" onClick={() => onEscolher(lei.id)}>
                    {lei.nome}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Documento>
  );
}
