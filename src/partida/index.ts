// Partida: monta o jogo (mundo + país), chama o motor, salva e carrega.
// Única porta entre a tela e o motor.
import {
  avancarTurno,
  estadoInicial,
  INDICES_ESSENCIAIS,
  lerLei,
  type Estado,
  type IndicesEssenciais,
  type Lei,
  type ParametrosPais,
  type Pedido,
  type Regras,
  type ValorLei,
} from "../motor";
import variaveis from "../conteudo/mundo/indicadores/variaveis.json";

const arquivosLeis = import.meta.glob("../conteudo/mundo/leis/*.json", {
  eager: true,
  import: "default",
});
const arquivosPaises = import.meta.glob("../conteudo/paises/*/*.json", {
  eager: true,
  import: "default",
});

export interface Partida {
  regras: Regras;
  estado: Estado;
}

interface EstadoInicialPais {
  versao: 1;
  id: string;
  essenciais: IndicesEssenciais;
  jogabilidade: Record<string, number>;
  parametros: ParametrosPais;
}

interface LeisVigentes {
  versao: 1;
  leis: Record<string, ValorLei>;
}

const jogabilidade = variaveis.variaveis.filter(
  (v) => v.camada !== "essencial",
);

function carregarLeis(): Record<string, Lei> {
  const ids = jogabilidade.map((v) => v.id);
  const leis: Record<string, Lei> = {};
  for (const [arquivo, dado] of Object.entries(arquivosLeis)) {
    const lei = lerLei(dado, arquivo, ids);
    leis[lei.id] = lei;
  }
  return leis;
}

function arquivoPais<T>(pais: string, nome: string): T {
  const caminho = `../conteudo/paises/${pais}/${nome}.json`;
  const dado = arquivosPaises[caminho] as { versao?: unknown } | undefined;
  if (!dado) throw new Error(`país "${pais}": falta ${nome}.json`);
  if (dado.versao !== 1) throw new Error(`${caminho} › versao: precisa ser 1`);
  return dado as T;
}

export function paisesDisponiveis(): string[] {
  return [
    ...new Set(
      Object.keys(arquivosPaises).map((c) => c.split("/").at(-2) as string),
    ),
  ];
}

export function criarPartida(pais: string, semente: number): Partida {
  const inicial = arquivoPais<EstadoInicialPais>(pais, "estado-inicial");
  const vigentes = arquivoPais<LeisVigentes>(pais, "leis-vigentes");
  for (const id of INDICES_ESSENCIAIS)
    if (typeof inicial.essenciais[id] !== "number")
      throw new Error(`país "${pais}" › essenciais.${id}: precisa ser número`);

  const dominios: Regras["dominios"] = {};
  for (const v of jogabilidade)
    dominios[v.id] = {
      min: v.dominio.minimo ?? -Infinity,
      max: v.dominio.maximo ?? Infinity,
    };

  const regras: Regras = {
    leis: carregarLeis(),
    dominios,
    pais: inicial.parametros,
  };
  const estado = estadoInicial(regras, {
    semente,
    essenciais: inicial.essenciais,
    jogabilidade: inicial.jogabilidade,
    leis: vigentes.leis,
  });
  return { regras, estado };
}

export function avancar(partida: Partida, pedidos: Pedido[] = []): Partida {
  return {
    ...partida,
    estado: avancarTurno(partida.regras, partida.estado, pedidos),
  };
}

/** Joga `turnos` turnos; os pedidos entram no primeiro. */
export function jogar(
  partida: Partida,
  turnos: number,
  pedidos: Pedido[] = [],
): Partida {
  let p = partida;
  for (let t = 0; t < turnos; t++) p = avancar(p, t === 0 ? pedidos : []);
  return p;
}

export type { Estado, Pedido } from "../motor";
