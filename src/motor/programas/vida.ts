// A vida de um programa: forma-se, desfaz-se, e os grupos se lembram.
import { novoFato, type Fato } from "../fatos";
import { pontosLei } from "../grupos";
import type { Lei, ValorLei } from "../leis";
import { andou, valorPadrao } from "./direcao";
import { nomeDoPrograma } from "./nomes";
import type {
  EntradaProgramas,
  EstadoProgramas,
  Programa,
  SituacaoDoPrograma,
  VidaDoPrograma,
} from "./tipos";

/** Pontos de uma lei que contam como lembrança cheia (mesma escala do voto). */
const PONTOS_CHEIOS = 3;

/** O mapa sem uma chave. */
const semChave = <T>(mapa: Record<string, T>, chave: string) =>
  Object.fromEntries(Object.entries(mapa).filter(([k]) => k !== chave));

const limitar = (v: number) => Math.max(-1, Math.min(1, v));
const valorDe = (lei: Lei, valores: Record<string, ValorLei>): ValorLei =>
  valores[lei.id] ?? valorPadrao(lei);

/** Quais leis do programa já andaram o que ele pede, e quais faltam. */
export function situacaoDoPrograma(
  programa: Programa,
  leis: Record<string, Lei>,
  referencia: Record<string, ValorLei>,
  valores: Record<string, ValorLei>,
): SituacaoDoPrograma {
  const andadas: string[] = [];
  const faltam: string[] = [];
  for (const pedido of programa.leis) {
    const lei = leis[pedido.lei];
    const passou = andou(
      lei,
      pedido,
      referencia[lei.id] ?? valorPadrao(lei),
      valorDe(lei, valores),
    );
    (passou ? andadas : faltam).push(pedido.lei);
  }
  return { id: programa.id, andadas, faltam, minimo: programa.minimo };
}

/** Quanto cada grupo gostou do que as leis andadas fizeram, de −1 a +1. */
function lembrancaDosGrupos(
  e: EntradaProgramas,
  andadas: string[],
  referencia: Record<string, ValorLei>,
): Record<string, number> {
  return Object.fromEntries(
    e.tipos.map((tipo) => {
      const soma = andadas.reduce((total, id) => {
        const lei = e.leis[id];
        return (
          total + pontosLei(tipo, lei, valorDe(lei, e.valores), referencia[id])
        );
      }, 0);
      return [tipo.id, limitar(soma / andadas.length / PONTOS_CHEIOS)];
    }),
  );
}

/** Turnos que o programa espera: o do ministro mais fraco entre as leis dele. */
const esperaDoPrograma = (e: EntradaProgramas, programa: Programa): number =>
  Math.max(0, ...programa.leis.map((p) => e.atrasoDaLei(e.leis[p.lei])));

interface Passo {
  estado: EstadoProgramas;
  fato?: Fato;
}

function formar(
  e: EntradaProgramas,
  estado: EstadoProgramas,
  programa: Programa,
  andadas: string[],
): Passo {
  const antes = estado.vidas[programa.id];
  const formando = semChave(estado.formando, programa.id);
  const vida: VidaDoPrograma = {
    situacao: "formado",
    desde: e.turno,
    nome: antes?.nome ?? nomeDoPrograma(e.regras, programa),
    lembranca: lembrancaDosGrupos(e, andadas, estado.referencia),
    referencia: estado.referencia,
    vezes: (antes?.vezes ?? 0) + 1,
  };
  return {
    estado: {
      ...estado,
      formando,
      vidas: { ...estado.vidas, [programa.id]: vida },
    },
    fato: novoFato({
      tipo: "programa-formado",
      turno: e.turno,
      tamanho: vida.vezes === 1 ? "grande" : "medio",
      sobre: programa.id,
    }),
  };
}

function desfazer(
  e: EntradaProgramas,
  estado: EstadoProgramas,
  programa: Programa,
  vida: VidaDoPrograma,
): Passo {
  const desfeito: VidaDoPrograma = {
    ...vida,
    situacao: "desfeito",
    desde: e.turno,
  };
  return {
    estado: { ...estado, vidas: { ...estado.vidas, [programa.id]: desfeito } },
    fato: novoFato({
      tipo: "programa-desfeito",
      turno: e.turno,
      tamanho: "medio",
      sobre: programa.id,
    }),
  };
}

/** O mínimo foi cumprido: forma na hora, ou depois de esperar o ministro mais fraco. */
function comecarAFormar(
  e: EntradaProgramas,
  estado: EstadoProgramas,
  programa: Programa,
  andadas: string[],
): Passo {
  const desde = estado.formando[programa.id] ?? e.turno;
  if (e.turno - desde >= esperaDoPrograma(e, programa))
    return formar(e, estado, programa, andadas);
  return {
    estado: {
      ...estado,
      formando: { ...estado.formando, [programa.id]: desde },
    },
  };
}

/** Um turno de um programa. */
export function andarPrograma(
  e: EntradaProgramas,
  estado: EstadoProgramas,
  programa: Programa,
): Passo {
  const vida = estado.vidas[programa.id];
  const formado = vida?.situacao === "formado";
  const { andadas, minimo } = situacaoDoPrograma(
    programa,
    e.leis,
    formado ? vida.referencia : estado.referencia,
    e.valores,
  );
  const cumpre = andadas.length >= minimo;
  if (formado) return cumpre ? { estado } : desfazer(e, estado, programa, vida);
  if (cumpre) return comecarAFormar(e, estado, programa, andadas);
  const formando = semChave(estado.formando, programa.id);
  return { estado: { ...estado, formando } };
}
