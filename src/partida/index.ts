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
  type Caixa,
  type Instituicao,
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
  motivoFontesInvalidas,
  type RegraDoEmprego,
  type ValorLei,
  ehEstrato,
  placarPrevisto,
  satisfacaoMedia,
  turnosMandato,
  motivoMidiasInvalidas,
  motivoProgramasInvalidos,
  type FormadoDoPais,
  type Programa,
  type RegrasMidia,
  type RegrasProgramas,
  type Ficha,
  type ModeloDePessoas,
  bussolaDoPartido,
  gerarPessoas,
  motivoModeloInvalido,
  sortearMinistros,
  motivoJudiciarioInvalido,
  type JudiciarioDoPais,
  type RegraDoJudiciario,
  type RegrasJudiciario,
  type RegrasDoFisco,
} from "../motor";
import { arquivoPais, temArquivoDoPais } from "./paises";
import {
  centroDoGoverno,
  comPartidoDoJogador,
  idDoPartidoDoJogador,
  motivoComecoInvalido,
  type ComecoDoJogador,
} from "./comeco";
import colisoes from "../conteudo/mundo/colisoes/colisoes.json";
import moldesDeMinisterio from "../conteudo/mundo/ministerios/moldes.json";
import instituicoesDoMundo from "../conteudo/mundo/ministerios/instituicoes.json";
import principais from "../conteudo/mundo/indicadores/principais.json";
import programasDoMundo from "../conteudo/mundo/programas/programas.json";
import nomesDeProgramas from "../conteudo/mundo/programas/nomes.json";
import derivas from "../conteudo/mundo/indicadores/derivas.json";
import moradia from "../conteudo/mundo/moradia/moradia.json";
import regraDoJudiciario from "../conteudo/mundo/judiciario/judiciario.json";
import saneamento from "../conteudo/mundo/saneamento/saneamento.json";
import fisco from "../conteudo/mundo/fisco/fisco.json";
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
  /** Nome local de algumas leis (ex.: "Selic"); a tela usa no lugar do nome do mundo. */
  nomes?: Record<string, string>;
  /** Só as leis que o país tem; a que falta começa não promulgada. */
  leis: Record<string, ValorLei>;
}

/** Partidos do país: nomes, cadeiras e quem é a base. */
export interface CongressoPais {
  versao: 1;
  maioria: number;
  governo: string;
  coligacao: string[];
  senado?: Congresso["senado"];
  carga?: number;
  leis?: Congresso["leis"];
  ignorar?: Congresso["ignorar"];
  partidos: (Congresso["partidos"][number] & { nome: string; cor?: string })[];
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
    muda: "muda" in t ? (t.muda as TipoPop["muda"]) : undefined,
    publico: "publico" in t ? (t.publico as number) : undefined,
    pago_por: "pago_por" in t ? (t.pago_por as TipoPop["pago_por"]) : undefined,
    desvio: "desvio" in t ? (t.desvio as number) : undefined,
    divisao: "divisao" in t ? (t.divisao as TipoPop["divisao"]) : undefined,
  }));
  const motivo = motivoEscadasInvalidas(tipos) ?? motivoFontesInvalidas(tipos);
  if (motivo) throw new Error(`mundo/pops/pops.json › ${motivo}`);
  return tipos;
}

/** Quem procura trabalho e quem fica fora da força (passo C). */
function carregarEmprego(): RegraDoEmprego {
  const r = tiposPops.emprego as RegraDoEmprego;
  const ids = new Set(tiposPops.pops.map((t) => t.id));
  for (const id of [r.desempregados, ...r.fora_da_forca])
    if (!ids.has(id))
      throw new Error(`mundo/pops/pops.json › emprego: pop "${id}" não existe`);
  return r;
}

/** Nome de cada tipo de pop, para scripts e tela. */
export const nomesPops: Record<string, string> = Object.fromEntries(
  tiposPops.pops.map((t) => [t.id, t.nome]),
);

/** Produção declarada pelo país; sem arquivo, ele compra tudo do mundo. */
function declaracaoDoPais(pais: string): unknown {
  return temArquivoDoPais(pais, "producao")
    ? arquivoPais(pais, "producao")
    : { versao: 1, cobertura: {} };
}

/** Uma caixa como o país a declara: o ministro é opcional (o resto é sorteado). */
type CaixaNoArquivo = Omit<Caixa, "ministro"> & { ministro?: string };

/** O que governo.json declara: caixas e, se quiser, pessoas à mão. */
interface GovernoNoArquivo {
  ministerios: CaixaNoArquivo[];
  pessoas?: GovernoDoPais["pessoas"];
  leis?: GovernoDoPais["leis"];
}

/** Elenco do país: o que ele declara à mão, ou o que o gerador sorteia (pessoas.json). */
export function elencoDoPais(
  pais: string,
  semente: number,
  congresso: CongressoPais,
  grupos: TipoGrupo[],
): Ficha[] {
  if (!temArquivoDoPais(pais, "pessoas")) return [];
  const modelo = arquivoPais<ModeloDePessoas>(pais, "pessoas");
  const motivo = motivoModeloInvalido(modelo);
  if (motivo) throw new Error(`país "${pais}" › pessoas: ${motivo}`);
  return gerarPessoas(
    semente,
    modelo,
    congresso.partidos.map((p) => ({
      id: p.id,
      cadeiras: p.cadeiras,
      bussola: bussolaDoPartido(p.defende, grupos),
    })),
  );
}

/** Tribunais do país (judiciario.json), com os nomes de pessoas.json; sem os dois, não há Judiciário. */
function carregarJudiciario(
  pais: string,
  congresso: CongressoPais,
  grupos: TipoGrupo[],
): RegrasJudiciario | undefined {
  if (
    !temArquivoDoPais(pais, "judiciario") ||
    !temArquivoDoPais(pais, "pessoas")
  )
    return undefined;
  const doPais = arquivoPais<JudiciarioDoPais>(pais, "judiciario");
  const motivo = motivoJudiciarioInvalido(doPais);
  if (motivo) throw new Error(`país "${pais}" › judiciario: ${motivo}`);
  return {
    ...(regraDoJudiciario as RegraDoJudiciario),
    tribunais: doPais.tribunais,
    aposentadoria: doPais.aposentadoria,
    idade_no_comeco: doPais.idade_no_comeco,
    idade_do_indicado: doPais.idade_do_indicado,
    modelo: arquivoPais<ModeloDePessoas>(pais, "pessoas"),
    partidos: congresso.partidos.map((p) => ({
      id: p.id,
      cadeiras: p.cadeiras,
      bussola: bussolaDoPartido(p.defende, grupos),
    })),
  };
}

/** Ministros do país (governo.json), se ele declara; confere o que o país diz. */
function carregarGoverno(
  pais: string,
  partidos: string[],
  pessoasGeradas: Ficha[],
  ministros: Record<string, string>,
  caixas: readonly CaixaNoArquivo[] | undefined,
): { regras: RegrasGoverno; declarado: GovernoDoPais } | null {
  if (!temArquivoDoPais(pais, "governo")) return null;
  const arquivo = arquivoPais<GovernoNoArquivo>(pais, "governo");
  const pessoas = arquivo.pessoas ?? pessoasGeradas;
  const declarado: GovernoDoPais = {
    pessoas,
    ...(arquivo.leis ? { leis: arquivo.leis } : {}),
    ministerios: (caixas ?? arquivo.ministerios).map((c) => ({
      ...c,
      ministro: ministros[c.id] ?? c.ministro ?? "",
    })),
  };
  const regras: RegrasGoverno = {
    instituicoes: instituicoesDoMundo.instituicoes as Instituicao[],
    moldes: moldesDeMinisterio.moldes as Molde[],
    pessoas,
    ...(declarado.leis ? { leis: declarado.leis } : {}),
  };
  const motivo = motivoGovernoInvalido(regras, declarado, partidos);
  if (motivo) throw new Error(`país "${pais}" › governo: ${motivo}`);
  return { regras, declarado };
}

/** Quem ocupa cada caixa: o que o país ou o jogador pôs, e o resto sorteado pela chapa. */
export function ministrosDoComeco(
  semente: number,
  pais: string,
  elenco: Ficha[],
  congresso: CongressoPais,
  grupos: TipoGrupo[],
  comeco: ComecoDoJogador | undefined,
): Record<string, string> {
  if (!temArquivoDoPais(pais, "governo") || elenco.length === 0) return {};
  const doPais = arquivoPais<GovernoNoArquivo>(pais, "governo").ministerios;
  const ministerios = comeco?.caixas ?? doPais;
  const declarados = Object.fromEntries(
    doPais.flatMap((m) => (m.ministro ? [[m.id, m.ministro]] : [])),
  );
  return sortearMinistros(
    semente + 1,
    ministerios,
    elenco,
    centroDoGoverno(comeco, elenco, congresso, grupos),
    { ...declarados, ...comeco?.ministros },
    comeco ? Object.values(comeco.chapa) : [],
  );
}

/** Programas do mundo e os nomes próprios que o país deu (programas.json, opcional). */
function carregarProgramas(
  pais: string,
  leis: Record<string, Lei>,
): RegrasProgramas {
  const doPais = temArquivoDoPais(pais, "programas")
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

/** Mídias do país (midias.json, opcional); sem o arquivo o jornal sai sem mídias. */
function carregarMidias(pais: string, grupos: TipoGrupo[]): RegrasMidia {
  if (!temArquivoDoPais(pais, "midias")) return { midias: [] };
  const regras = arquivoPais<RegrasMidia>(pais, "midias");
  const motivo = motivoMidiasInvalidas(
    regras,
    grupos.map((g) => g.id),
  );
  if (motivo) throw new Error(`país "${pais}" › midias: ${motivo}`);
  return { midias: regras.midias };
}

export interface NomesDoGoverno {
  /** Nome de cada caixa (pelo id). */
  caixas: Record<string, string>;
  /** Nome de cada instituição, que é também o nome do órgão dela. */
  instituicoes: Record<string, string>;
  /** Nome de cada pessoa. */
  pessoas: Record<string, string>;
}

/** Nomes para a tela; o motor só guarda ids. */
export function nomesDoGoverno(partida: Partida): NomesDoGoverno {
  const g = partida.regras.governo;
  return {
    caixas: Object.fromEntries(
      (partida.estado.governo?.caixas ?? []).map((c) => [c.id, c.nome]),
    ),
    instituicoes: Object.fromEntries(
      instituicoesDoMundo.instituicoes.map((i) => [i.id, i.nome]),
    ),
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

export function carregarGrupos(): TipoGrupo[] {
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

/** Nome de cada partido do país, para scripts e tela. */
export function nomesPartidos(
  pais: string,
  comeco?: ComecoDoJogador,
): Record<string, string> {
  const { partidos } = arquivoPais<CongressoPais>(pais, "congresso");
  return {
    ...Object.fromEntries(partidos.map((p) => [p.id, p.nome])),
    ...(comeco
      ? { [idDoPartidoDoJogador(comeco.partido.sigla)]: comeco.partido.nome }
      : {}),
  };
}

export interface OpcoesPartida {
  /** Troca essenciais declarados pelo país (cenários de script). */
  ajustes?: Partial<IndicesEssenciais>;
  /** Todo pedido passa sem voto (scripts que medem a economia). */
  semCongresso?: boolean;
  /** O país joga só com a Câmara, mesmo que declare Senado (teste). */
  semSenado?: boolean;
  /** Partido, chapa e ministros do jogador; sem isto o partido do país governa. */
  comeco?: ComecoDoJogador;
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

/** O Congresso do país sem o Senado: só a Câmara vota. */
function semOSenado(c: CongressoPais): CongressoPais {
  return Object.fromEntries(
    Object.entries(c).filter(([chave]) => chave !== "senado"),
  ) as unknown as CongressoPais;
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
  const {
    ajustes = {},
    semCongresso = false,
    semSenado = false,
    comeco,
  } = opcoes;
  const declarado = arquivoPais<EstadoInicialPais>(pais, "estado-inicial");
  const inicial = {
    ...declarado,
    essenciais: { ...declarado.essenciais, ...ajustes },
  };
  const vigentes = arquivoPais<LeisVigentes>(pais, "leis-vigentes");
  const doPais = arquivoPais<CongressoPais>(pais, "congresso");
  const grupos = carregarGrupos();
  const elenco = elencoDoPais(pais, semente, doPais, grupos);
  if (comeco) {
    const motivo = motivoComecoInvalido(
      comeco,
      elenco,
      doPais.partidos.map((p) => p.id),
    );
    if (motivo) throw new Error(`começo da partida: ${motivo}`);
  }
  const congresso = comeco
    ? comPartidoDoJogador(doPais, comeco, elenco, grupos)
    : doPais;
  const governo = carregarGoverno(
    pais,
    congresso.partidos.map((p) => p.id),
    elenco,
    ministrosDoComeco(semente, pais, elenco, congresso, grupos, comeco),
    comeco?.caixas,
  );
  const judiciario = carregarJudiciario(pais, congresso, grupos);
  for (const id of INDICES_ESSENCIAIS)
    if (typeof inicial.essenciais[id] !== "number")
      throw new Error(`país "${pais}" › essenciais.${id}: precisa ser número`);

  const leis = carregarLeis();
  const regras: Regras = {
    leis,
    dominios: dominiosDosIndices(),
    pops: carregarPops(),
    emprego: carregarEmprego(),
    grupos,
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
    fisco: fisco as RegrasDoFisco,
    colisoes: colisoes.colisoes.map(([a, b]): Colisao => [a, b]),
    indicesPrincipais: principais.indices,
    programas: carregarProgramas(pais, leis),
    midia: carregarMidias(pais, grupos),
    ...(governo ? { governo: governo.regras } : {}),
    ...(judiciario ? { judiciario } : {}),
    congresso: semCongresso
      ? undefined
      : congressoDasRegras(semSenado ? semOSenado(congresso) : congresso),
  };
  conferirGasto(pais, regras, vigentes, inicial.essenciais.gasto_publico);
  for (const id of Object.keys(vigentes.nomes ?? {}))
    if (!leis[id])
      throw new Error(
        `país "${pais}" › leis-vigentes.nomes: lei "${id}" não existe`,
      );
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

export { paisesDisponiveis, paisesJogaveis } from "./paises";
export {
  chapaSugerida,
  ministrosSugeridos,
  perfilDeUmaPessoa,
  prepararComeco,
  type PessoaDaLista,
  type PreparoDoComeco,
} from "./inicio";
export { idDoPartidoDoJogador, type ComecoDoJogador } from "./comeco";
export {
  TAMANHOS,
  atencaoDaCaixa,
  caixaNova,
  governoPronto,
  instituicoesDoGabinete,
  moverInstituicao,
  nomeAutomatico,
  rendeNaCaixa,
  soltasDoGabinete,
  type CaixaDoGabinete,
  type Tamanho,
} from "./gabinete";
export type { PerfilDePessoa } from "./perfil";
export { carregarPartida, salvarPartida } from "./salvar";
export { montarVisao } from "./visao";
export { manchete, type NomesDoJornal } from "./jornal";
export { pesquisaDeVoto, type IntencaoDeVoto } from "./eleicao";
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
  VisaoBolha,
  VisaoGrupo,
  VisaoLei,
  VisaoLigacao,
  VisaoMercado,
  VisaoMundoMercado,
  VisaoPrecoMundo,
  VisaoProduto,
  VisaoSetor,
  VisaoOpcao,
  VisaoPartida,
  VisaoPotencia,
  VisaoHierarquia,
  VisaoInstituicao,
  VisaoMinistro,
  VisaoPessoa,
  VisaoJuiz,
  VisaoTribunal,
  AlertaDoIndice,
  TendenciaDoIndice,
  VisaoCasa,
  VisaoPartidoNaCasa,
  VisaoPoderes,
  VisaoTrindade,
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
  if (!temArquivoDoPais(pais, "empresas")) return [];
  return arquivoPais<{ empresas: EmpresaDoPais[] }>(pais, "empresas").empresas;
}
