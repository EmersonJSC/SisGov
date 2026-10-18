import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  revogarLei,
} from "../app/partida";
import {
  auditoriaExcludentesEducacao,
  coberturaPoliticaEducacao,
  montarPacoteEducacao,
} from "../../scripts/gerador/educacaoC1";
import { contrapartesPesquisadas } from "../../scripts/gerador/excludentes";

function jogar(semente: number) {
  const criada = criarPartida({
    pais: "ilha-teste",
    modo: "teste",
    semente,
    ocorrencias: false,
    eleicao: false,
  });
  if (!criada.ok) throw new Error(criada.erros.join("\n"));
  let partida = criada.value;
  const leis = [
    "ensino-obrigatorio",
    "piso-educacao",
    "bolsa-de-permanencia-no-ensino-medio",
  ];
  for (const id of leis) {
    const policy = partida.content.policies.find((law) => law.id === id)!;
    const level = partida.game.policies.find(
      (state) => state.policyDefinitionId === id,
    )?.desiredLevel;
    expect(
      policy.controle.opcoes?.some((option) => option.valor === level),
      `${id}: a situação inicial deve ser uma opção existente`,
    ).toBe(true);
    expect(policy.controle.opcoes?.map((option) => option.id)).not.toContain(
      "manter-situacao",
    );
  }
  for (const id of leis) {
    const alterada = mudarLei(partida, id, 3);
    if (!alterada.ok) throw new Error(alterada.erros.join("\n"));
    partida = alterada.value;
  }
  const trajetoria = [] as Record<string, number>[];
  for (let turno = 0; turno < 8; turno += 1) {
    const resultado = encerrarTurno(partida);
    if (!resultado.ok) throw new Error(resultado.erros.join("\n"));
    partida = resultado.value.partida;
    trajetoria.push({ ...partida.game.execution.values });
  }
  expect(
    partida.content.policies.filter(
      (law) => law.area === "Educação, ciência e cultura",
    ),
  ).toHaveLength(12);
  const leisC1 = partida.content.policies.filter(
    (law) => law.area === "Educação, ciência e cultura",
  );
  for (const lei of leisC1) {
    expect(lei.descricao.trim().length, lei.id).toBeGreaterThan(20);
    expect(lei.controle.opcoes?.length, lei.id).toBe(3);
    expect(
      lei.controle.opcoes?.map((option) => option.valor),
      lei.id,
    ).toEqual([1, 2, 3]);
    const alternativas = lei.controle.opcoes ?? [];
    expect(new Set(alternativas.map((option) => option.id)).size, lei.id).toBe(
      3,
    );
    for (const opcao of alternativas) {
      expect(
        opcao.efeitos?.trim().length,
        `${lei.id}/${opcao.id}`,
      ).toBeGreaterThan(30);
      expect(
        opcao.rotulo.trim().length,
        `${lei.id}/${opcao.id}`,
      ).toBeGreaterThan(10);
    }
  }
  const variaveisExplicadas = partida.content.variables.variaveis.filter(
    (variable) => variable.area === "Educação, ciência e cultura",
  );
  for (const variable of variaveisExplicadas)
    expect(variable.nome.trim().length, variable.id).toBeGreaterThan(30);
  expect(
    partida.content.variables.variaveis.find(
      (variable) => variable.id === "populacao_total",
    )?.nome,
  ).toContain("todas as idades");
  return trajetoria;
}

describe("gerador C1 da Ilha Teste", () => {
  it("mantém o contador de gerações e identifica a execução nos relatórios", () => {
    const manifesto = JSON.parse(
      readFileSync(
        "docs/v1/desenho/rodadas-gerador-educacao/manifesto-gerador.json",
        "utf8",
      ),
    ) as {
      contadorGeracao: number;
      status: string;
      catalogoDeSementes: { fonte: string; leis: string[] }[];
      aprendizados: { rodada: number }[];
    };
    const relatorio = JSON.parse(
      readFileSync(
        "docs/v1/desenho/rodadas-gerador-educacao/rodada-5/relatorio.json",
        "utf8",
      ),
    ) as { contadorGeracao: number };
    expect(manifesto.contadorGeracao).toBeGreaterThanOrEqual(1);
    expect(manifesto.status).toBe("concluida");
    expect(relatorio.contadorGeracao).toBe(manifesto.contadorGeracao);
    expect(manifesto.aprendizados.map((item) => item.rodada)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(manifesto.catalogoDeSementes.length).toBeGreaterThanOrEqual(8);
    expect(
      manifesto.catalogoDeSementes.every(
        (programa) =>
          programa.fonte.startsWith("https://") && programa.leis.length > 0,
      ),
    ).toBe(true);
  });

  it("monta o ecossistema a partir de programas documentados e registra lacunas políticas", () => {
    const rodada1 = JSON.parse(
      readFileSync(
        "docs/v1/desenho/rodadas-gerador-educacao/rodada-1/relatorio.json",
        "utf8",
      ),
    ) as {
      configuracao: {
        programasSemente: {
          id: string;
          leis: string[];
          gruposAfetados: string[];
        }[];
        coberturaDosQuatroQuadrantes: {
          quadrantes: Record<string, { coberto: boolean }>;
        };
      };
      leisAdicionadas: { camada: string; programasSemente: string[] }[];
    };
    expect(rodada1.configuracao.programasSemente.length).toBeGreaterThan(0);
    expect(
      rodada1.leisAdicionadas.every((law) => law.programasSemente.length > 0),
    ).toBe(true);
    expect(
      new Set(rodada1.leisAdicionadas.map((law) => law.camada)).size,
    ).toBeGreaterThan(1);
    expect(
      Object.values(
        rodada1.configuracao.coberturaDosQuatroQuadrantes.quadrantes,
      ).some((quadrant) => !quadrant.coberto),
    ).toBe(true);
  });

  it("guarda cinco rodadas evolutivas de pacotes sem inventar leis", () => {
    const rodada10 = JSON.parse(
      readFileSync(
        "docs/v1/desenho/rodadas-gerador-educacao/rodada-10/relatorio.json",
        "utf8",
      ),
    ) as {
      tipo: string;
      leisNovas: number;
      cenarios: { id: string; trajetoria: unknown[] }[];
      diagnostico: {
        variaveisFinitas: boolean;
        caixaFinalNaoNegativo: boolean;
      };
    };
    expect(rodada10.tipo).toBe("evolucao-de-pacote-programatico");
    expect(rodada10.leisNovas).toBe(0);
    expect(rodada10.cenarios).toHaveLength(3);
    expect(rodada10.diagnostico.variaveisFinitas).toBe(true);
    expect(rodada10.diagnostico.caixaFinalNaoNegativo).toBe(true);
  });

  it("gera as duas leis excludentes e mantém só uma inicialmente em vigor", () => {
    const pacote = montarPacoteEducacao(5);
    const ids = Object.keys(pacote);
    expect(ids).toContain("mundo/leis/piso-educacao.json");
    expect(ids).toContain("mundo/leis/escolha-escolar-financiada.json");
    expect(ids).toContain("mundo/leis/provisao-publica-exclusiva.json");
    const catalogo = pacote["mundo/catalogo-politicas.json"] as {
      politicas: string[];
    };
    expect(catalogo.politicas).toContain(
      "mundo/leis/escolha-escolar-financiada.json",
    );

    const [par] = auditoriaExcludentesEducacao(5);
    expect(par).toMatchObject({
      leiBaseId: "provisao-publica-exclusiva",
      leiContraparteId: "escolha-escolar-financiada",
      regrasDeProvisaoIncompativeis: true,
      posicaoNaBussola: "pendente-de-fundamentacao",
      leiBaseGerada: true,
      leiContraparteGerada: true,
      ambasGeradas: true,
    });
    expect(contrapartesPesquisadas[0].fonte).toContain(
      "ley_de_nacionalizacion",
    );
    const relatorio = JSON.parse(
      readFileSync(
        "docs/v1/desenho/rodadas-gerador-educacao/rodada-5/relatorio.json",
        "utf8",
      ),
    ) as {
      configuracao: {
        paresExcludentesPesquisados: Array<{
          leiBaseId: string;
          leiBaseGerada: boolean;
          posicaoNaBussola: string;
        }>;
      };
    };
    expect(relatorio.configuracao.paresExcludentesPesquisados[0]).toMatchObject(
      {
        leiBaseId: "provisao-publica-exclusiva",
        leiBaseGerada: true,
        posicaoNaBussola: "pendente-de-fundamentacao",
      },
    );
    const cobertura = coberturaPoliticaEducacao(5);
    expect(cobertura.resumo).toMatchObject({
      totalOpcoes: 36,
      quadrantesCobertos: 0,
      totalQuadrantes: 4,
      sobreEixos: 29,
      centro: 1,
      semPosicao: 6,
      vetoresInvalidos: 0,
    });
    expect(
      cobertura.objetos.find(
        (objeto) => objeto.id === "regime-de-provisao-escolar",
      ),
    ).toMatchObject({
      totalOpcoes: 6,
      semPosicao: expect.arrayContaining([
        "escolha-escolar-financiada/rede-publica-com-escolha",
        "escolha-escolar-financiada/contratos-com-metas",
        "escolha-escolar-financiada/prioridade-rede-municipal",
      ]),
    });
    expect(
      cobertura.objetos.find((objeto) => objeto.id === "piso-educacao"),
    ).toMatchObject({ totalOpcoes: 3 });
  });

  it("impede aprovar leis de provisão incompatíveis em ambas as direções", () => {
    const criada = criarPartida({
      pais: "ilha-teste",
      modo: "teste",
      semente: 1,
      ocorrencias: false,
      eleicao: false,
    });
    if (!criada.ok) throw new Error(criada.erros.join("\n"));
    const inicial = criada.value;
    const publica = "provisao-publica-exclusiva";
    const escolha = "escolha-escolar-financiada";
    expect(
      inicial.game.policies.some(
        (p) => p.policyDefinitionId === publica && p.legalStatus === "vigente",
      ),
    ).toBe(false);
    const bloqueada = mudarLei(inicial, publica, 1);
    expect(bloqueada.ok).toBe(false);
    if (bloqueada.ok) return;
    expect(bloqueada.erros.join(" ")).toContain("incompatível");
    const revogada = revogarLei(inicial, escolha);
    if (!revogada.ok) throw new Error(revogada.erros.join("\n"));
    const aprovada = mudarLei(revogada.value, publica, 1);
    if (!aprovada.ok) throw new Error(aprovada.erros.join("\n"));
    const reversa = mudarLei(aprovada.value, escolha, 1);
    expect(reversa.ok).toBe(false);
  });

  it("carrega as leis geradas e produz a mesma trajetória com a mesma semente", () => {
    const primeira = jogar(2718);
    const repetida = jogar(2718);
    expect(repetida).toEqual(primeira);
    for (const id of [
      "grupo_jovens",
      "grupo_familias_com_filhos",
      "grupo_pobres",
      "grupo_interior",
      "grupo_periferias",
      "grupo_servidores",
    ])
      expect(Number.isFinite(primeira.at(-1)?.[id])).toBe(true);
    expect(primeira.at(-1)?.acesso_escolar).toBeGreaterThan(0);
    expect(primeira.at(-1)?.frequencia_escolar).toBeGreaterThan(0);
  });
});
