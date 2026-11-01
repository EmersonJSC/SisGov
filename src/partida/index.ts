// Partida: monta o jogo (mundo + país), chama o motor, salva e carrega.
// Única porta entre a tela e o motor.
import {
  avancarTurno,
  estadoInicial,
  gastoDasLeis,
  INDICES_ESSENCIAIS,
  lerLei,
  type Estado,
  type IndicesEssenciais,
  type Lei,
  type ParametrosPais,
  type Pedido,
  type Regras,
  type TipoGrupo,
  type TipoPop,
  type ValorLei,
  ehEstrato,
} from "../motor";
import variaveis from "../conteudo/mundo/indicadores/variaveis.json";
import tiposPops from "../conteudo/mundo/pops/pops.json";
import tiposGrupos from "../conteudo/mundo/grupos/grupos.json";

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

function carregarPops(): TipoPop[] {
  if (tiposPops.versao !== 1)
    throw new Error("mundo/pops/pops.json › versao: precisa ser 1");
  for (const t of tiposPops.pops)
    if (!ehEstrato(t.estrato))
      throw new Error(
        `mundo/pops/pops.json › ${t.id}: estrato "${t.estrato}" não existe`,
      );
  return tiposPops.pops.map((t) => ({
    id: t.id,
    estrato: t.estrato as TipoPop["estrato"],
  }));
}

/** Nome de cada tipo de pop, para scripts e tela. */
export const nomesPops: Record<string, string> = Object.fromEntries(
  tiposPops.pops.map((t) => [t.id, t.nome]),
);

function carregarGrupos(): TipoGrupo[] {
  if (tiposGrupos.versao !== 1)
    throw new Error("mundo/grupos/grupos.json › versao: precisa ser 1");
  return tiposGrupos.grupos.map((g) => {
    for (const c of g.cobra)
      if (c.sentido !== 1 && c.sentido !== -1)
        throw new Error(
          `mundo/grupos/grupos.json › ${g.id}: sentido de ${c.indice} precisa ser 1 ou -1`,
        );
    return {
      id: g.id,
      membros: g.membros as Record<string, number>,
      cobra: g.cobra as TipoGrupo["cobra"],
    };
  });
}

/** Nome de cada tipo de grupo, para scripts e tela. */
export const nomesGrupos: Record<string, string> = Object.fromEntries(
  tiposGrupos.grupos.map((g) => [g.id, g.nome]),
);

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

/** `ajustes` troca essenciais declarados pelo país (cenários de script). */
export function criarPartida(
  pais: string,
  semente: number,
  ajustes: Partial<IndicesEssenciais> = {},
): Partida {
  const declarado = arquivoPais<EstadoInicialPais>(pais, "estado-inicial");
  const inicial = {
    ...declarado,
    essenciais: { ...declarado.essenciais, ...ajustes },
  };
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
    pops: carregarPops(),
    grupos: carregarGrupos(),
    pais: inicial.parametros,
  };
  const gasto =
    gastoDasLeis(regras, vigentes.leis) + regras.pais.gasto_fora_das_leis;
  if (Math.abs(gasto - inicial.essenciais.gasto_publico) > 1e-6)
    throw new Error(
      `país "${pais}" › gasto_publico (${inicial.essenciais.gasto_publico}) ≠ leis de gasto + gasto_fora_das_leis (${gasto})`,
    );
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
