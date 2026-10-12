import type {
  ConsequenceFile,
  ContentDiagnostic,
  OccurrenceFile,
  PackageFiles,
  PressureGroupManifest,
  PressureGroupsManifest,
  ValidationResult,
  VariableDefinition,
} from "../../../engine";
import { atendeRequer } from "../configuracao/expandirPais";
import type {
  AcaoDoMundo,
  GrupoDoMundo,
  Limites,
  PatrocinadoresDoMundo,
  PressaoDoMundo,
  PressaoDoPais,
  Vigia,
} from "./tipos";

type Json = Record<string, unknown>;

function parse(text: string | undefined): Json | undefined {
  if (text === undefined) return undefined;
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Json)
      : undefined;
  } catch {
    return undefined;
  }
}

/** Nó constante (valor 1): leva a parte fixa de cada conta (V1-09). */
export const NO_CONSTANTE = "pressao_constante";
/** Área dos nós dos grupos: a tela os mostra na aba Pressão, não no mapa. */
export const AREA_PRESSAO = "Grupos de pressão";
export const AREA_PATROCINIO = "Patrocínio";
/** Limites até o país calibrar (`npm run pressao:calibrar`). */
export const LIMITES_PROVISORIOS: Limites = [
  { entrada: 45, saida: 39 },
  { entrada: 55, saida: 49 },
  { entrada: 65, saida: 59 },
];

export const pressaoDe = (grupo: string) => `pressao_${grupo}`;
export const nivelDe = (grupo: string) => `nivel_${grupo}`;
export const interesseDe = (patrocinador: string) =>
  `interesse_${patrocinador}`;
const acessoDe = (grupo: string, patrocinador: string) =>
  `acesso_${grupo}__${patrocinador}`;
const reveladoDe = (grupo: string) => `revelado_${grupo}`;
const kebab = (id: string) => id.replaceAll("_", "-");

/** Pontos extras no grupo do outro lado, por ação leve e pesada (3.6). */
const CONTRAMOVIMENTO = { leve: 3, pesada: 6 };
const POLARIZACAO = { leve: 0.3, pesada: 0.6 };
/** Chance por turno e intervalo, por ação leve e pesada (3.3). */
const CHANCE = { leve: 0.3, pesada: 0.25, calmo: 0.15 };
const INTERVALO = { leve: 2, pesada: 4 };
/** A chance vai de ×1 na entrada do nível a ×2,5 quinze pontos acima. */
const FATOR_DA_PRESSAO = { acima: 15, multiplica: 2.5 };

type Linear = {
  origem: string;
  coeficiente: number;
  constante: number;
  normalizacao?: ConsequenceFile["normalizacao"];
};

/** Lei ou índice vigiado vira reta: 0 numa ponta da faixa, o peso na outra. */
function reta(
  vigia: Vigia,
  controleDaLei: (lei: string) => string | undefined,
  fator = 1,
): Linear | string {
  const origem = vigia.lei ? controleDaLei(vigia.lei) : vigia.indice;
  if (!origem) return `A lei ${vigia.lei} não está no catálogo.`;
  const [a, b] = vigia.faixa ?? [0, 100];
  const largura = b - a;
  const sobe = vigia.sobe === "alto";
  return {
    origem,
    coeficiente: ((sobe ? 1 : -1) * vigia.peso * fator) / largura,
    constante: sobe ? (-vigia.peso * a) / largura : (vigia.peso * b) / largura,
    ...(vigia.porPib
      ? { normalizacao: { divisor: "pib_nominal", multiplicador: 100 } }
      : {}),
  };
}

const arredonda = (x: number) => Math.round(x * 1e6) / 1e6;

/**
 * Grupos de pressão e patrocinadores (V1-09) viram nós, setas e eventos do
 * pacote: pressão de cada grupo (base + o que vigia + patrocínio), nível em
 * situação de níveis, ações como eventos com causa, contramovimento e o
 * dinheiro dos patrocinadores, que a revelação corta. O manifesto ganha o
 * mapa que a partida usa. Pacote sem `pressao` no mundo volta igual.
 */
export function expandirPressao(
  manifestPath: string,
  files: PackageFiles,
): ValidationResult<PackageFiles> {
  const manifesto = parse(files[manifestPath]);
  if (manifesto?.tipo !== "cenario" || typeof manifesto.mundo !== "string")
    return { ok: true, value: files };
  const mundoPath = manifesto.mundo;
  const mundo = parse(files[mundoPath]);
  if (!mundo || typeof mundo.pressao !== "string")
    return { ok: true, value: files };

  const diagnostics: ContentDiagnostic[] = [];
  const erro = (
    file: string,
    field: string,
    message: string,
    code: ContentDiagnostic["code"] = "VALOR_INVALIDO",
  ) => diagnostics.push({ code, file, field, message });
  const pasta = manifestPath.slice(0, manifestPath.lastIndexOf("/") + 1);
  const pressaoDoMundo = parse(files[mundo.pressao]) as
    PressaoDoMundo | undefined;
  const patrocinadoresDoMundo =
    typeof mundo.patrocinadores === "string"
      ? (parse(files[mundo.patrocinadores]) as
          PatrocinadoresDoMundo | undefined)
      : undefined;
  const paisPath = `${pasta}pressao.json`;
  const doPais = parse(files[paisPath]) as PressaoDoPais | undefined;
  if (pressaoDoMundo?.tipo !== "mundo-pressao")
    erro(
      mundo.pressao,
      "tipo",
      "O tipo deve ser mundo-pressao.",
      "TIPO_INVALIDO",
    );
  if (
    typeof mundo.patrocinadores === "string" &&
    patrocinadoresDoMundo?.tipo !== "mundo-patrocinadores"
  )
    erro(
      mundo.patrocinadores,
      "tipo",
      "O tipo deve ser mundo-patrocinadores.",
      "TIPO_INVALIDO",
    );
  if (doPais?.tipo !== "pais-pressao")
    erro(
      paisPath,
      "$",
      files[paisPath] === undefined
        ? "O mundo tem grupos de pressão; o país precisa de pressao.json."
        : "O tipo deve ser pais-pressao.",
      files[paisPath] === undefined ? "ARQUIVO_AUSENTE" : "TIPO_INVALIDO",
    );
  const variaveisPath =
    typeof mundo.variaveis === "string" ? mundo.variaveis : "";
  const variaveisFile = parse(files[variaveisPath]);
  const estadoPath =
    typeof manifesto.estadoInicial === "string" ? manifesto.estadoInicial : "";
  const estado = parse(files[estadoPath]);
  if (!variaveisFile || !estado)
    erro(manifestPath, "mundo", "Variáveis ou estado inicial não encontrados.");
  if (diagnostics.length > 0) return { ok: false, diagnostics };
  const pressao = pressaoDoMundo!;
  const pais = doPais!;

  const variaveis = new Map(
    ((variaveisFile!.variaveis ?? []) as VariableDefinition[]).map((v) => [
      v.id,
      v,
    ]),
  );
  // Leis do catálogo (já no formato do motor): controle, nome e caminho.
  const catalogoPath =
    typeof mundo.catalogoPoliticas === "string" ? mundo.catalogoPoliticas : "";
  const leis = new Map<
    string,
    { path: string; json: Json; controle: string; nome: string }
  >();
  for (const path of (parse(files[catalogoPath])?.politicas ??
    []) as string[]) {
    const json = parse(files[path]);
    const controle = (json?.controle as { variavel?: string } | undefined)
      ?.variavel;
    if (json && typeof json.id === "string" && controle)
      leis.set(json.id, {
        path,
        json,
        controle,
        nome: String(json.nome ?? json.id),
      });
  }
  const controleDaLei = (lei: string) => leis.get(lei)?.controle;
  const caminhoDoEvento = new Map<string, string>();
  for (const path of (mundo.eventos ?? []) as string[]) {
    const id = parse(files[path])?.id;
    if (typeof id === "string") caminhoDoEvento.set(id, path);
  }
  const caracteristicas = new Set(
    (parse(files[`${pasta}pais.json`])?.caracteristicas ?? []) as string[],
  );

  // Grupos que o país comporta; os por região, um para cada região.
  const grupos: (GrupoDoMundo & { fatorDaRegiao?: number })[] = [];
  for (const grupo of pressao.grupos)
    if (atendeRequer(grupo.requer as never, caracteristicas))
      grupos.push(grupo);
  for (const molde of pressao.porRegiao ?? []) {
    if (!atendeRequer(molde.requer as never, caracteristicas)) continue;
    for (const regiao of pais.regioes ?? [])
      grupos.push({
        ...molde,
        id: `${molde.id}_${regiao.id}`,
        nome: molde.nome.replace("{regiao}", regiao.nome),
        visto: regiao.visto,
        fatorDaRegiao: regiao.aprovacao / (pais.aprovacaoNacional ?? 50),
      });
  }
  const nomeDoGrupo = (g: GrupoDoMundo) => pais.nomes?.[g.id] ?? g.nome;
  const idsDosGrupos = new Set(grupos.map((g) => g.id));
  for (const id of Object.keys(pais.turno0 ?? {}))
    if (!idsDosGrupos.has(id))
      erro(paisPath, `turno0.${id}`, `O grupo ${id} não existe neste país.`);
  const patrocinadores = new Map(
    (patrocinadoresDoMundo?.patrocinadores ?? []).map((p) => [p.id, p]),
  );

  const novasVariaveis: VariableDefinition[] = [
    {
      id: NO_CONSTANTE,
      tipo: "estoque",
      nome: "Base fixa dos grupos de pressão",
      unidade: "indice_0_100",
      dominio: { minimo: 1, maximo: 1 },
      area: AREA_PRESSAO,
      avaliacao: "neutra",
      medida: { unidade: "constante", tecnico: true },
    },
  ];
  const consequencias: ConsequenceFile[] = [];
  const eventos: OccurrenceFile[] = [];
  const paraLei = new Map<string, string[]>();
  const eventosAlterados = new Map<string, OccurrenceFile>();
  const constantes = new Map<string, number>();

  const seta = (
    id: string,
    origem: string,
    alvo: string,
    coeficiente: number,
    extra: Partial<ConsequenceFile> = {},
  ) => {
    consequencias.push({
      id,
      tipo: "consequencia",
      versaoEsquema: 1,
      origem,
      alvo,
      mecanismo: "afim",
      parametros: { coeficiente: arredonda(coeficiente), termoConstante: 0 },
      unidade:
        variaveis.get(alvo)?.unidade ??
        novasVariaveis.find((v) => v.id === alvo)?.unidade ??
        "indice_0_100",
      atrasoPassos: 0,
      duracao: { modo: "continuo" },
      ...extra,
    });
    return id;
  };
  // Vigia: a parte que varia sai da origem; a fixa vai para o nó constante.
  const vigiar = (
    prefixo: string,
    alvo: string,
    vigia: Vigia,
    fator?: number,
  ): Linear | undefined => {
    const r = reta(vigia, controleDaLei, fator);
    if (typeof r === "string") {
      erro(mundo.pressao as string, prefixo, r, "REFERENCIA_QUEBRADA");
      return undefined;
    }
    const id = seta(
      `${prefixo}--${kebab(vigia.lei ?? vigia.indice!)}`,
      r.origem,
      alvo,
      r.coeficiente,
      r.normalizacao ? { normalizacao: r.normalizacao } : {},
    );
    if (vigia.lei)
      paraLei.set(vigia.lei, [...(paraLei.get(vigia.lei) ?? []), id]);
    constantes.set(alvo, (constantes.get(alvo) ?? 0) + r.constante);
    return r;
  };

  // Patrocinadores: interesse ameaçado de cada um (0 a 100).
  const interesses: PressureGroupsManifest["patrocinadores"][number][] = [];
  for (const p of patrocinadores.values()) {
    const no = interesseDe(p.id);
    novasVariaveis.push({
      id: no,
      tipo: "calculado",
      nome: `Interesse ameaçado: ${p.nome}`,
      unidade: "indice_0_100",
      dominio: { minimo: 0, maximo: 100 },
      area: AREA_PATROCINIO,
      avaliacao: "neutra",
      medida: { unidade: "interesse ameaçado (0 a 100)", tecnico: true },
    });
    for (const vigia of p.interesses)
      vigiar(`patrocinio-${kebab(p.id)}`, no, vigia);
    interesses.push({
      id: p.id,
      nome: p.nome,
      tipo: p.tipo,
      descricao: p.descricao,
      poder: p.poder,
      interesse: no,
      ...(p.tipo === "pais"
        ? { eventoRevelado: `patrocinio-revelado-${kebab(p.id)}` }
        : {}),
    });
  }

  const niveis = pressao.niveis.length - 1;
  const mapa: PressureGroupManifest[] = [];
  const temas = new Map<string, Set<string>>();
  for (const g of grupos)
    temas.set(
      g.id,
      new Set(g.reage.map((v) => v.lei ?? v.indice!).filter(Boolean)),
    );
  const lado = (g: GrupoDoMundo) =>
    g.visto === "esquerda" ? 1 : g.visto === "direita" ? -1 : 0;
  // Do outro lado: visto ao contrário e vigiando um tema igual, ou na lista
  // `contra` de um dos dois (3.6).
  const opositores = (g: GrupoDoMundo) =>
    grupos.filter(
      (o) =>
        o.id !== g.id &&
        lado(o) * lado(g) < 0 &&
        ([...temas.get(g.id)!].some((t) => temas.get(o.id)!.has(t)) ||
          g.contra?.includes(o.id) ||
          o.contra?.includes(g.id)),
    );

  for (const g of grupos) {
    const nome = nomeDoGrupo(g);
    const noPressao = pressaoDe(g.id);
    const noNivel = nivelDe(g.id);
    const limites = pais.limites?.[g.id] ?? LIMITES_PROVISORIOS;
    if (limites.length !== niveis)
      erro(
        paisPath,
        `limites.${g.id}`,
        `O grupo tem ${niveis} passagens de nível; aqui há ${limites.length}.`,
      );
    novasVariaveis.push(
      {
        id: noPressao,
        tipo: "calculado",
        nome: `Pressão: ${nome}`,
        unidade: "indice_0_100",
        dominio: { minimo: 0, maximo: 100 },
        area: AREA_PRESSAO,
        avaliacao: "maior_pior",
        medida: { unidade: "pressão do grupo (0 a 100)", tecnico: true },
      },
      {
        id: noNivel,
        tipo: "situacao",
        nome: `Nível: ${nome}`,
        unidade: "nivel",
        dominio: { minimo: 0, maximo: niveis },
        area: AREA_PRESSAO,
        avaliacao: "maior_pior",
        niveis: limites,
      },
    );
    const prefixo = `pressao-${kebab(g.id)}`;
    const causas: PressureGroupManifest["causas"][number][] = [];
    // Base: insatisfação dos segmentos (100 − satisfação), peso da base.
    for (const [segmento, peso] of Object.entries(g.base ?? {})) {
      const pontos = pressao.pesoDaBase * peso;
      const r = vigiar(prefixo, noPressao, {
        indice: segmento,
        sobe: "baixo",
        peso: pontos,
      });
      if (r)
        causas.push({
          origem: segmento,
          nome: `insatisfação da base (${variaveis.get(segmento)?.nome ?? segmento})`,
          coeficiente: arredonda(r.coeficiente),
          constante: arredonda(r.constante),
          peso: pontos,
        });
    }
    for (const vigia of g.reage) {
      const fator =
        vigia.fator === "aprovacaoDaRegiao" ? g.fatorDaRegiao : undefined;
      const r = vigiar(prefixo, noPressao, vigia, fator);
      if (!r) continue;
      const alvo = vigia.lei ?? vigia.indice!;
      const nomeDoAlvo = vigia.lei
        ? `${leis.get(vigia.lei)?.nome ?? alvo} (quer ${vigia.sobe === "baixo" ? "mais" : "menos"})`
        : `${variaveis.get(alvo)?.nome ?? alvo.replace(/^pressao_/, "")} em ${vigia.sobe === "alto" ? "alta" : "baixa"}`;
      causas.push({
        origem: r.origem,
        nome: nomeDoAlvo,
        coeficiente: arredonda(r.coeficiente),
        constante: arredonda(r.constante),
        peso: vigia.peso,
        ...(vigia.porPib ? { porPib: true } : {}),
      });
    }
    seta(`${prefixo}--nivel`, noPressao, noNivel, 1);

    // Patrocínio: k × interesse × poder ÷ 5 × escala, enquanto houver acesso.
    const patrocinio: PressureGroupManifest["patrocinio"][number][] = [];
    for (const p of g.patrocinio ?? []) {
      const quem = patrocinadores.get(p.patrocinador);
      if (!quem) {
        erro(
          mundo.pressao as string,
          `grupos.${g.id}.patrocinio`,
          `O patrocinador ${p.patrocinador} não existe.`,
          "REFERENCIA_QUEBRADA",
        );
        continue;
      }
      const acesso = acessoDe(g.id, p.patrocinador);
      novasVariaveis.push({
        id: acesso,
        tipo: "controle",
        nome: `Dinheiro de ${quem.nome} para ${nome}`,
        unidade: "indice_0_1",
        dominio: { minimo: 0, maximo: 1 },
        valorInicial: 1,
        area: AREA_PATROCINIO,
      });
      const coeficiente =
        (p.k * quem.poder * (patrocinadoresDoMundo?.escala ?? 0)) / 5;
      seta(
        `${prefixo}--patrocinio-${kebab(p.patrocinador)}`,
        interesseDe(p.patrocinador),
        noPressao,
        coeficiente,
        { normalizacao: { fator: acesso } },
      );
      patrocinio.push({
        patrocinador: p.patrocinador,
        k: p.k,
        publico: p.publico === true,
        acesso,
        coeficiente: arredonda(coeficiente),
      });
    }
    let revelado: string | undefined;
    if (patrocinio.some((p) => !p.publico)) {
      revelado = reveladoDe(g.id);
      novasVariaveis.push({
        id: revelado,
        tipo: "controle",
        nome: `Patrocínio revelado: ${nome}`,
        unidade: "indice_0_1",
        dominio: { minimo: 0, maximo: 1 },
        valorInicial: 0,
        area: AREA_PATROCINIO,
      });
      seta(
        `${prefixo}--legitimidade`,
        NO_CONSTANTE,
        noPressao,
        -(patrocinadoresDoMundo?.investigacao.legitimidade ?? 0),
        { normalizacao: { fator: revelado } },
      );
    }

    // Ações: um evento por ação, com causa, efeito e contramovimento.
    const outros = opositores(g);
    const acoes: PressureGroupManifest["acoes"][number][] = [];
    for (const acao of g.acoes) {
      if (typeof acao !== "string") {
        const path = caminhoDoEvento.get(acao.evento);
        const original = path
          ? (parse(files[path]) as OccurrenceFile)
          : undefined;
        if (!path || !original) {
          erro(
            mundo.pressao as string,
            `grupos.${g.id}.acoes`,
            `O evento ${acao.evento} não existe.`,
            "REFERENCIA_QUEBRADA",
          );
          continue;
        }
        const pesada = acao.nivel >= 3;
        const extras = [
          ...outros.map((o) =>
            seta(
              `${acao.evento}--contra-${kebab(o.id)}`,
              original.controle!,
              pressaoDe(o.id),
              pesada ? CONTRAMOVIMENTO.pesada : CONTRAMOVIMENTO.leve,
            ),
          ),
        ];
        eventosAlterados.set(path, {
          ...original,
          origem: "grupo",
          gatilho: {
            ...original.gatilho!,
            fatores: [
              ...(original.gatilho?.fatores ?? []),
              {
                variavel: noPressao,
                de: limites[acao.nivel - 1]?.entrada ?? 0,
                ate:
                  (limites[acao.nivel - 1]?.entrada ?? 0) +
                  FATOR_DA_PRESSAO.acima,
                multiplica: FATOR_DA_PRESSAO.multiplica,
              },
            ],
          },
          consequencias: [...original.consequencias, ...extras],
        });
        acoes.push({ evento: acao.evento, nivel: acao.nivel });
        continue;
      }
      const molde: AcaoDoMundo | undefined = pressao.acoes[acao];
      if (!molde) {
        erro(
          mundo.pressao as string,
          `grupos.${g.id}.acoes`,
          `A ação ${acao} não existe.`,
          "REFERENCIA_QUEBRADA",
        );
        continue;
      }
      const id = `${prefixo}-${kebab(acao)}`;
      const controle = `ocorrencia_pressao_${g.id}_${acao}`;
      const pesada = molde.nivel >= 3;
      const calmo = molde.quando === "calmo";
      novasVariaveis.push({
        id: controle,
        tipo: "controle",
        nome: `Ação: ${molde.nome} (${nome})`,
        unidade: "indice_0_1",
        dominio: { minimo: 0, maximo: 1 },
        valorInicial: 0,
        area: AREA_PRESSAO,
      });
      // Recursos (3.2): 1 = metade do efeito, 2 = o efeito, 3 = uma vez e meia.
      const recurso = g.recursos[molde.recurso] / 2;
      const efeitos = Object.entries(molde.efeitos).map(([alvo, pontos]) =>
        seta(`${id}--${kebab(alvo)}`, controle, alvo, pontos * recurso),
      );
      if (!calmo) {
        if (lado(g) !== 0 && molde.efeitos.polarizacao === undefined)
          efeitos.push(
            seta(
              `${id}--polarizacao`,
              controle,
              "polarizacao",
              pesada ? POLARIZACAO.pesada : POLARIZACAO.leve,
            ),
          );
        for (const o of outros)
          efeitos.push(
            seta(
              `${id}--contra-${kebab(o.id)}`,
              controle,
              pressaoDe(o.id),
              pesada ? CONTRAMOVIMENTO.pesada : CONTRAMOVIMENTO.leve,
            ),
          );
      }
      const entrada = limites[molde.nivel - 1]?.entrada ?? 0;
      eventos.push({
        id,
        tipo: "evento",
        versaoEsquema: 1,
        nome: `${molde.nome}: ${nome}`,
        descricao: molde.descricao,
        area: AREA_PRESSAO,
        avaliacao: calmo ? "positiva" : "negativa",
        manchete: (g.plural
          ? molde.manchete.plural
          : molde.manchete.singular
        ).replace("{grupo}", nome),
        origem: "grupo",
        nivel: pesada ? 3 : 2,
        intervaloMinimoTurnos: pesada ? INTERVALO.pesada : INTERVALO.leve,
        gatilho: calmo
          ? {
              chance: CHANCE.calmo,
              condicao: {
                tipo: "comparacao",
                variavel: noNivel,
                operador: "menor_que",
                valor: 1,
              },
            }
          : {
              chance: pesada ? CHANCE.pesada : CHANCE.leve,
              condicao: {
                tipo: "comparacao",
                variavel: noNivel,
                operador: "maior_ou_igual",
                valor: molde.nivel,
              },
              fatores: [
                {
                  variavel: noPressao,
                  de: entrada,
                  ate: entrada + FATOR_DA_PRESSAO.acima,
                  multiplica: FATOR_DA_PRESSAO.multiplica,
                },
              ],
            },
        consequencias: efeitos,
        controle,
        duracaoMeses: molde.meses,
      });
      acoes.push({ evento: id, nivel: calmo ? 0 : molde.nivel });
    }

    mapa.push({
      id: g.id,
      nome,
      plural: g.plural,
      secao: g.secao,
      visto: g.visto === "regiao" ? "nenhum" : g.visto,
      recursos: g.recursos,
      pressao: noPressao,
      nivel: noNivel,
      limites,
      acoes,
      causas,
      patrocinio,
      ...(revelado ? { revelado } : {}),
    });
  }

  // Revelar o dinheiro de um país piora a relação com ele (4.3).
  for (const p of interesses) {
    if (!p.eventoRevelado) continue;
    const controle = `ocorrencia_${p.eventoRevelado.replaceAll("-", "_")}`;
    novasVariaveis.push({
      id: controle,
      tipo: "controle",
      nome: `Evento: patrocínio revelado (${p.nome})`,
      unidade: "indice_0_1",
      dominio: { minimo: 0, maximo: 1 },
      valorInicial: 0,
      area: AREA_PATROCINIO,
    });
    eventos.push({
      id: p.eventoRevelado,
      tipo: "evento",
      versaoEsquema: 1,
      // Sem artigo antes do nome ("de Liberdolândia", "da União…"): o
      // nome vai entre parênteses ou depois de dois-pontos.
      nome: `Dinheiro estrangeiro revelado: ${p.nome}`,
      descricao: `A investigação mostra dinheiro secreto de um governo estrangeiro (${p.nome}) por trás de grupos do país. A relação entre os dois países azeda.`,
      area: AREA_PATROCINIO,
      avaliacao: "negativa",
      manchete: `Investigação revela dinheiro estrangeiro por trás de grupos do país: ${p.nome}`,
      origem: "grupo",
      nivel: 3,
      gatilho: { chance: 0 },
      consequencias: [
        seta(
          `${p.eventoRevelado}--tensao`,
          controle,
          "tensao_internacional",
          3,
        ),
      ],
      controle,
      duracaoMeses: 6,
    });
  }

  // A parte fixa de cada conta sai do nó constante.
  for (const [alvo, valor] of [...constantes].sort(([a], [b]) =>
    a.localeCompare(b),
  ))
    if (Math.abs(valor) > 1e-12)
      seta(`${kebab(alvo)}--constante`, NO_CONSTANTE, alvo, valor);

  for (const c of consequencias)
    if (
      !variaveis.has(c.origem) &&
      !novasVariaveis.some((v) => v.id === c.origem)
    )
      erro(
        mundo.pressao as string,
        c.id,
        `A origem ${c.origem} não existe.`,
        "REFERENCIA_QUEBRADA",
      );
  if (diagnostics.length > 0) return { ok: false, diagnostics };

  const out: Record<string, string> = { ...files };
  const base = `${mundo.pressao}#`;
  const caminhos = consequencias.map((c) => {
    out[`${base}${c.id}`] = JSON.stringify(c);
    return `${base}${c.id}`;
  });
  const caminhosDeEvento = eventos.map((e) => {
    out[`${base}evento/${e.id}`] = JSON.stringify(e);
    return `${base}evento/${e.id}`;
  });
  for (const [path, evento] of eventosAlterados)
    out[path] = JSON.stringify(evento);
  for (const [lei, ids] of paraLei) {
    const l = leis.get(lei)!;
    out[l.path] = JSON.stringify({
      ...l.json,
      consequencias: [...((l.json.consequencias as string[]) ?? []), ...ids],
    });
  }
  const novoMundo: Json = {
    ...mundo,
    consequencias: [...((mundo.consequencias as string[]) ?? []), ...caminhos],
    eventos: [...((mundo.eventos as string[]) ?? []), ...caminhosDeEvento],
  };
  delete novoMundo.pressao;
  delete novoMundo.patrocinadores;
  out[mundoPath] = JSON.stringify(novoMundo);
  out[variaveisPath] = JSON.stringify({
    ...variaveisFile,
    variaveis: [
      ...((variaveisFile!.variaveis as VariableDefinition[]) ?? []),
      ...novasVariaveis,
    ],
  });
  out[estadoPath] = JSON.stringify({
    ...estado,
    valores: { ...(estado!.valores as object), [NO_CONSTANTE]: 1 },
  });
  const gruposDePressao: PressureGroupsManifest = {
    niveis: pressao.niveis,
    secoes: pressao.secoes,
    grupos: mapa,
    patrocinadores: interesses,
    investigacao: {
      c: patrocinadoresDoMundo?.investigacao.c ?? 20,
      turnos: patrocinadoresDoMundo?.investigacao.turnos ?? 4,
      aoMesmoTempo: patrocinadoresDoMundo?.investigacao.aoMesmoTempo ?? 2,
      capacidade: "capacidade_inteligencia",
    },
  };
  out[manifestPath] = JSON.stringify({ ...manifesto, gruposDePressao });
  return { ok: true, value: out };
}
