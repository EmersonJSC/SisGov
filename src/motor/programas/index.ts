// Programas: jeitos de governar feitos de várias leis. Forma-se quando a maior
// parte das leis anda o mínimo na direção dele dentro do mandato; desfaz-se se
// elas voltam. O motor não conhece nomes: programas e moldes são do mundo, o
// nome próprio é do país. Comportamento em programas.md.
import type { Fato } from "../fatos";
import type { Lei, ValorLei } from "../leis";
import { andarPrograma, situacaoDoPrograma } from "./vida";
import type {
  EntradaProgramas,
  EstadoProgramas,
  RegrasProgramas,
  SaidaProgramas,
  SituacaoDoPrograma,
} from "./tipos";

export * from "./tipos";
export { andou, posicaoNaRegua } from "./direcao";
export { nomeDoPrograma, preencher } from "./nomes";
export { situacaoDoPrograma } from "./vida";

const CHAVES_DE_NOME = ["tema", "bem", "mal", "publico"];

/** Começo da partida: as leis de hoje são o ponto de partida do mandato. */
export function iniciarProgramas(
  mandato: number,
  valores: Record<string, ValorLei>,
): EstadoProgramas {
  return { mandato, referencia: valores, formando: {}, vidas: {} };
}

/** Mandato novo: as leis de hoje passam a ser o ponto de partida. */
function renovarMandato(e: EntradaProgramas): EstadoProgramas {
  if (e.mandato === e.estado.mandato) return e.estado;
  return {
    ...e.estado,
    mandato: e.mandato,
    referencia: e.valores,
    formando: {},
  };
}

/** Um turno: cada programa se forma, espera, se desfaz ou segue como está. */
export function andarProgramas(e: EntradaProgramas): SaidaProgramas {
  const fatos: Fato[] = [];
  const estado = e.regras.programas.reduce((atual, programa) => {
    const passo = andarPrograma(e, atual, programa);
    if (passo.fato) fatos.push(passo.fato);
    return passo.estado;
  }, renovarMandato(e));
  return { estado, fatos };
}

/** Como cada programa está hoje (leis andadas e leis que faltam), para a tela. */
export function situacoesDosProgramas(
  regras: RegrasProgramas,
  estado: EstadoProgramas,
  leis: Record<string, Lei>,
  valores: Record<string, ValorLei>,
): SituacaoDoPrograma[] {
  return regras.programas.map((p) => {
    const vida = estado.vidas[p.id];
    const base =
      vida?.situacao === "formado" ? vida.referencia : estado.referencia;
    return situacaoDoPrograma(p, leis, base, valores);
  });
}

/** Motivo de os programas não servirem ao mundo, ou null se servem. */
export function motivoProgramasInvalidos(
  regras: RegrasProgramas,
  leis: Record<string, Lei>,
): string | null {
  const ids = new Set<string>();
  for (const p of regras.programas) {
    if (ids.has(p.id)) return `programa "${p.id}" repetido`;
    ids.add(p.id);
    const faltando = p.leis.find((l) => !leis[l.lei]);
    if (faltando) return `${p.id}: a lei "${faltando.lei}" não existe`;
    if (new Set(p.leis.map((l) => l.lei)).size !== p.leis.length)
      return `${p.id}: lei repetida`;
    if (!(p.minimo >= 1 && p.minimo <= p.leis.length))
      return `${p.id}: forma-se com ${p.minimo}, mas tem ${p.leis.length} leis`;
  }
  const alheio = Object.keys(regras.nomesDoPais).find((id) => !ids.has(id));
  if (alheio) return `nome do país para programa que não existe: "${alheio}"`;
  for (const molde of regras.moldes)
    for (const [, chave] of molde.matchAll(/\{(\w+)\}/g))
      if (!CHAVES_DE_NOME.includes(chave))
        return `molde "${molde}": palavra {${chave}} desconhecida`;
  return null;
}
