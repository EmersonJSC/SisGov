// Partida: monta o jogo (mundo + país), chama o motor, salva e carrega.
// Única porta entre a tela e o motor.
import {
  avancarTurno,
  entradaDoCongresso,
  estadoInicial,
  gastoDasLeis,
  INDICES_ESSENCIAIS,
  lerLei,
  motivoGovernoInvalido,
  indiceDaReputacao,
  indicesDeDefesa,
  lerPotencias,
  lerMercado,
  lerProducaoDoMundo,
  lerCobertura,
  lerOcupacao,
  type Congresso,
  colisoesDe,
  valoresComPedidos,
  type Colisao,
  type Deriva,
  type GovernoDoPais,
  type Molde,
  type RegrasGoverno,
  type Estado,
  type IndicesEssenciais,
  type Lei,
  type ParametrosPais,
  type Pedido,
  type PedidoMudarLei,
  type Regras,
  type TipoGrupo,
  type TipoPop,
  type Oferta,
  type Votacao,
  motivoEscadasInvalidas,
  type ValorLei,
  ehEstrato,
  placarPrevisto,
  satisfacaoMedia,
  turnosMandato,
  motivoProgramasInvalidos,
  type FormadoDoPais,
  type Programa,
  type RegrasProgramas,
} from "../motor";
import colisoes from "../conteudo/mundo/colisoes/colisoes.json";
import moldesDeMinisterio from "../conteudo/mundo/ministerios/moldes.json";
import programasDoMundo from "../conteudo/mundo/programas/programas.json";
import nomesDeProgramas from "../conteudo/mundo/programas/nomes.json";
import derivas from "../conteudo/mundo/indicadores/derivas.json";
import moradia from "../conteudo/mundo/moradia/moradia.json";
import saneamento from "../conteudo/mundo/saneamento/saneamento.json";
import atendimento from "../conteudo/mundo/atendimento/atendimento.json";
import variaveis from "../conteudo/mundo/indicadores/variaveis.json";
import tiposPops from "../conteudo/mundo/pops/pops.json";
import tiposGrupos from "../conteudo/mundo/grupos/grupos.json";
import potencias from "../conteudo/mundo/potencias/potencias.json";
import produtos from "../conteudo/mundo/mercado/produtos.json";
import produtores from "../conteudo/mundo/mercado/produtores.json";

const arquivosLeis = import.meta.glob("../conteudo/mundo/leis/*.json", {
  eager: true,
  import: "default",
});
const arquivosPaises = import.meta.glob("../conteudo/paises/*/*.json", {
  eager: true,
  import: "default",
});

export interface Partida {
  /** Como a partida nasceu: é o que o arquivo salvo guarda, com o estado. */
  pais: string;
  semente: number;
  opcoes: OpcoesPartida;
  /** Símbolo da moeda do país, só para a tela. */
  moeda: string;
  regras: Regras;
  estado: Estado;
}

interface EstadoInicialPais {
  versao: 1;
  id: string;
  /** Símbolo da moeda (inventado); sem ele, "¤". */
  moeda?: string;
  essenciais: IndicesEssenciais;
  jogabilidade: Record<string, number>;
  /** Opinião de partida de cada potência, 0 a 100 (motor/mundo). */
  opinioes: Record<string, number>;
  parametros: ParametrosPais;
}

interface LeisVigentes {
  versao: 1;
  leis: Record<string, ValorLei>;
}

/** Partidos do país: nomes, cadeiras e quem é a base. */
interface CongressoPais {
  versao: 1;
  maioria: number;
  governo: string;
  coligacao: string[];
  senado?: Congresso["senado"];
  carga?: number;
  leis?: Congresso["leis"];
  ignorar?: Congresso["ignorar"];
  partidos: (Congresso["partidos"][number] & { nome: string })[];
}

const jogabilidade = variaveis.variaveis.filter(
  (v) => v.camada !== "essencial",
);

/**
 * Valor de partida que o mundo dá aos índices exportados da planilha; o país
 * que declarar o seu valor vence.
 */
const inicioDoMundo: Record<string, number> = Object.fromEntries(
  jogabilidade.flatMap((v) =>
    "inicial" in v && typeof v.inicial === "number" ? [[v.id, v.inicial]] : [],
  ),
);

let leisCarregadas: Record<string, Lei> | undefined;

/** Lê e valida as leis do mundo uma vez só: são as mesmas em toda partida. */
function carregarLeis(): Record<string, Lei> {
  if (leisCarregadas) return leisCarregadas;
  const ids = jogabilidade.map((v) => v.id);
  const leis: Record<string, Lei> = {};
  for (const [arquivo, dado] of Object.entries(arquivosLeis)) {
    const lei = lerLei(dado, arquivo, ids);
    leis[lei.id] = lei;
  }
  leisCarregadas = leis;
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
  const tipos = tiposPops.pops.map((t) => ({
    id: t.id,
    estrato: t.estrato as TipoPop["estrato"],
    bussola: t.bussola,
    sobe: "sobe" in t ? (t.sobe as TipoPop["sobe"]) : undefined,
    desce: "desce" in t ? (t.desce as string) : undefined,
  }));
  const motivo = motivoEscadasInvalidas(tipos);
  if (motivo) throw new Error(`mundo/pops/pops.json › ${motivo}`);
  return tipos;
}

/** Nome de cada tipo de pop, para scripts e tela. */
export const nomesPops: Record<string, string> = Object.fromEntries(
  tiposPops.pops.map((t) => [t.id, t.nome]),
);

/** Produção declarada pelo país; sem arquivo, ele compra tudo do mundo. */
function declaracaoDoPais(pais: string): unknown {
  const caminho = `../conteudo/paises/${pais}/producao.json`;
  return arquivosPaises[caminho]
    ? arquivoPais(pais, "producao")
    : { versao: 1, cobertura: {} };
}

/** Ministros do país (governo.json), se ele declara; confere o que o país diz. */
function carregarGoverno(
  pais: string,
  partidos: string[],
): { regras: RegrasGoverno; declarado: GovernoDoPais } | null {
  if (!arquivosPaises[`../conteudo/paises/${pais}/governo.json`]) return null;
  const declarado = arquivoPais<GovernoDoPais>(pais, "governo");
  const regras: RegrasGoverno = {
    moldes: moldesDeMinisterio.moldes as Molde[],
    pessoas: declarado.pessoas,
    ...(declarado.leis ? { leis: declarado.leis } : {}),
  };
  const motivo = motivoGovernoInvalido(regras, declarado, partidos);
  if (motivo) throw new Error(`país "${pais}" › governo: ${motivo}`);
  return { regras, declarado };
}

/** Programas do mundo e os nomes próprios que o país deu (programas.json, opcional). */
function carregarProgramas(
  pais: string,
  leis: Record<string, Lei>,
): RegrasProgramas {
  const doPais = arquivosPaises[`../conteudo/paises/${pais}/programas.json`]
    ? arquivoPais<{
        nomes?: Record<string, string>;
        formados?: FormadoDoPais[];
      }>(pais, "programas")
    : {};
  const regras: RegrasProgramas = {
    programas: programasDoMundo.programas as Programa[],
    moldes: nomesDeProgramas.moldes,
    nomesDoPais: doPais.nomes ?? {},
    formados: doPais.formados ?? [],
  };
  const motivo = motivoProgramasInvalidos(regras, leis);
  if (motivo) throw new Error(`país "${pais}" › programas: ${motivo}`);
  return regras;
}

export interface NomesDoGoverno {
  /** Nome de cada caixa (id do molde). */
  caixas: Record<string, string>;
  /** Nome de cada esfera, que é também o nome do órgão dela. */
  esferas: Record<string, string>;
  /** Nome de cada pessoa. */
  pessoas: Record<string, string>;
}

/** Nomes para a tela; o motor só guarda ids. */
export function nomesDoGoverno(partida: Partida): NomesDoGoverno {
  const g = partida.regras.governo;
  return {
    caixas: Object.fromEntries((g?.moldes ?? []).map((m) => [m.id, m.nome])),
    esferas: moldesDeMinisterio.esferas,
    pessoas: Object.fromEntries((g?.pessoas ?? []).map((f) => [f.id, f.nome])),
  };
}

function carregarMercado(pais: string): Regras["mercado"] {
  const mercado = lerMercado(produtos);
  const ids = lerPotencias(potencias).map((p) => p.id);
  const declarado = declaracaoDoPais(pais) as {
    capacidade?: Record<string, number>;
  };
  return {
    mercado,
    producao: lerProducaoDoMundo(produtores, mercado, ids),
    cobertura: lerCobertura(declarado, mercado),
    capacidade: declarado.capacidade ?? {},
    ocupacao: lerOcupacao(tiposPops.pops, mercado),
    populacaoBase: arquivoPais<{ essenciais: { populacao: number } }>(
      pais,
      "estado-inicial",
    ).essenciais.populacao,
  };
}

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
      bussola: g.bussola,
      peso: g.peso,
    };
  });
}

/** Nome de cada tipo de grupo, para scripts e tela. */
export const nomesGrupos: Record<string, string> = Object.fromEntries(
  tiposGrupos.grupos.map((g) => [g.id, g.nome]),
);

export interface DescricaoIndice {
  id: string;
  nome: string;
  essencial: boolean;
  /** Texto da unidade, para a tela. */
  unidade: string;
}

/** Índices do mundo na ordem do arquivo, para a tela. */
export const indicesDoMundo: DescricaoIndice[] = variaveis.variaveis.map(
  (v) => ({
    id: v.id,
    nome: v.nome,
    essencial: v.camada === "essencial",
    unidade: v.medida.unidade,
  }),
);

/** Apoio que o governo teria se a eleição fosse hoje. */
export function apoioAtual(estado: Estado): number {
  return satisfacaoMedia(estado.grupos) - estado.desgaste;
}

/** Meses até a próxima eleição, ou null se o país não tem eleição. */
export function mesesParaEleicao(partida: Partida): number | null {
  const { regras, estado } = partida;
  const mandato = turnosMandato(regras.leis, estado.leis);
  if (mandato === null) return null;
  return (estado.inicio_mandato + mandato - estado.turno) * 2;
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

/** Nome de cada partido do país, para scripts e tela. */
export function nomesPartidos(pais: string): Record<string, string> {
  const { partidos } = arquivoPais<CongressoPais>(pais, "congresso");
  return Object.fromEntries(partidos.map((p) => [p.id, p.nome]));
}

export interface OpcoesPartida {
  /** Troca essenciais declarados pelo país (cenários de script). */
  ajustes?: Partial<IndicesEssenciais>;
  /** Todo pedido passa sem voto (scripts que medem a economia). */
  semCongresso?: boolean;
}

/** Faixa de cada índice de jogabilidade. */
function dominiosDosIndices(): Regras["dominios"] {
  return Object.fromEntries(
    jogabilidade.map((v) => [
      v.id,
      { min: v.dominio.minimo ?? -Infinity, max: v.dominio.maximo ?? Infinity },
    ]),
  );
}

/** O Congresso que o motor lê, a partir do que o país declara. */
function congressoDasRegras(
  c: CongressoPais,
): NonNullable<Regras["congresso"]> {
  return {
    maioria: c.maioria,
    governo: c.governo,
    ...(c.senado ? { senado: c.senado } : {}),
    ...(c.carga ? { carga: c.carga } : {}),
    ...(c.leis ? { leis: c.leis } : {}),
    ...(c.ignorar ? { ignorar: c.ignorar } : {}),
    partidos: c.partidos.map((p) => ({
      id: p.id,
      cadeiras: p.cadeiras,
      defende: p.defende,
      ...(p.coesao !== undefined ? { coesao: p.coesao } : {}),
      ...(p.contas !== undefined ? { contas: p.contas } : {}),
    })),
  };
}

/** O gasto que o país declara fecha com as leis de gasto mais o que ainda não virou lei. */
function conferirGasto(
  pais: string,
  regras: Regras,
  vigentes: LeisVigentes,
  declarado: number,
) {
  const gasto =
    gastoDasLeis(regras, vigentes.leis) + regras.pais.gasto_fora_das_leis;
  if (Math.abs(gasto - declarado) > 1e-6)
    throw new Error(
      `país "${pais}" › gasto_publico (${declarado}) ≠ leis de gasto + gasto_fora_das_leis (${gasto})`,
    );
}

export function criarPartida(
  pais: string,
  semente: number,
  opcoes: OpcoesPartida = {},
): Partida {
  const { ajustes = {}, semCongresso = false } = opcoes;
  const declarado = arquivoPais<EstadoInicialPais>(pais, "estado-inicial");
  const inicial = {
    ...declarado,
    essenciais: { ...declarado.essenciais, ...ajustes },
  };
  const vigentes = arquivoPais<LeisVigentes>(pais, "leis-vigentes");
  const congresso = arquivoPais<CongressoPais>(pais, "congresso");
  const governo = carregarGoverno(
    pais,
    congresso.partidos.map((p) => p.id),
  );
  for (const id of INDICES_ESSENCIAIS)
    if (typeof inicial.essenciais[id] !== "number")
      throw new Error(`país "${pais}" › essenciais.${id}: precisa ser número`);

  const leis = carregarLeis();
  const regras: Regras = {
    leis,
    dominios: dominiosDosIndices(),
    pops: carregarPops(),
    grupos: carregarGrupos(),
    potencias: lerPotencias(potencias),
    indiceReputacao: indiceDaReputacao(potencias),
    indicePoderDefensivo: indicesDeDefesa(potencias).poderDefensivo,
    indiceSegurancaExterna: indicesDeDefesa(potencias).segurancaExterna,
    pais: inicial.parametros,
    mercado: carregarMercado(pais),
    derivas: derivas.derivas as Deriva[],
    moradia,
    saneamento,
    atendimento,
    colisoes: colisoes.colisoes.map(([a, b]): Colisao => [a, b]),
    programas: carregarProgramas(pais, leis),
    ...(governo ? { governo: governo.regras } : {}),
    congresso: semCongresso ? undefined : congressoDasRegras(congresso),
  };
  conferirGasto(pais, regras, vigentes, inicial.essenciais.gasto_publico);
  const estado = estadoInicial(regras, {
    semente,
    essenciais: inicial.essenciais,
    jogabilidade: { ...inicioDoMundo, ...inicial.jogabilidade },
    leis: vigentes.leis,
    coligacao: congresso.coligacao,
    opinioes: inicial.opinioes,
    ...(governo ? { governo: governo.declarado } : {}),
  });
  return {
    pais,
    semente,
    opcoes,
    moeda: declarado.moeda ?? "¤",
    regras,
    estado,
  };
}

/**
 * Placar de hoje para uma lei no valor dado: o mesmo que a votação vai dar
 * (sem sorteio). Nulo sem Congresso ou se o valor é o que vale.
 */
export function placarDaLei(
  partida: Partida,
  lei: string,
  valor: ValorLei,
  ofertas: Oferta[] = [],
): Votacao | null {
  const { regras, estado } = partida;
  if (!regras.congresso || estado.leis[lei] === valor) return null;
  return placarPrevisto(
    entradaDoCongresso(regras, estado),
    lei,
    valor,
    ofertas,
  );
}

export function avancar(partida: Partida, pedidos: Pedido[] = []): Partida {
  return {
    ...partida,
    estado: avancarTurno(partida.regras, partida.estado, pedidos),
  };
}

/** A lei não pode sair do "nada": outra, em vigor ou na fila, não vale junto. */
export function leiTravada(
  partida: Partida,
  lei: string,
  fila: readonly PedidoMudarLei[],
): boolean {
  const { regras, estado } = partida;
  const outros = fila.filter((p) => p.lei !== lei);
  const valores = valoresComPedidos(regras.leis, estado.leis, outros);
  return (
    colisoesDe(lei, regras.colisoes ?? [], regras.leis, valores).length > 0
  );
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

export { carregarPartida, salvarPartida } from "./salvar";
export { montarVisao } from "./visao";
export { previaDaLei, valorDoNivel, type PreviaLei } from "./previa";
export type {
  Estado,
  Pedido,
  PedidoCongresso,
  PedidoMudarLei,
  PedidoNomear,
  PedidoOferecer,
  Votacao,
} from "../motor";
export type {
  VisaoArea,
  VisaoBolha,
  VisaoGrupo,
  VisaoLei,
  VisaoLigacao,
  VisaoMercado,
  VisaoMundoMercado,
  VisaoPrecoMundo,
  VisaoProduto,
  VisaoSetor,
  VisaoMinisterio,
  VisaoOpcao,
  VisaoPartida,
  VisaoPotencia,
} from "./tiposVisao";

/** Empresa do país que entra na bolsa (nomes inventados; blocos de 2%, soma 50). */
export interface EmpresaDoPais {
  id: string;
  nome: string;
  setor: string;
  /** Valor da empresa em fração do PIB. */
  valor: number;
  /** Blocos de 2% que o Estado tem hoje (0 a 50). */
  estado: number;
}

export function empresasDoPais(pais: string): EmpresaDoPais[] {
  const caminho = `../conteudo/paises/${pais}/empresas.json`;
  if (!arquivosPaises[caminho]) return [];
  return arquivoPais<{ empresas: EmpresaDoPais[] }>(pais, "empresas").empresas;
}
