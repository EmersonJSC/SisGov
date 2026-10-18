export type RegistroOpcaoPolitica = {
  objeto: string;
  lei: string;
  opcao: string;
  vetor?: readonly [number, number] | null;
};

/** Classificação geométrica dos vetores declarados; não valida sua evidência política. */
export function gerarRelatorioPolitico(
  entradas: readonly RegistroOpcaoPolitica[],
) {
  const nomesQuadrantes = [
    "estado_liberdade",
    "estado_autoridade",
    "mercado_liberdade",
    "mercado_autoridade",
  ] as const;
  type Quadrante = (typeof nomesQuadrantes)[number];
  type RegistroOpcao = RegistroOpcaoPolitica;
  const opcoesPorObjeto = new Map<string, RegistroOpcao[]>();
  // Cada opção tem um único objeto principal nesta auditoria.
  const identidades = new Set<string>();
  for (const entrada of entradas) {
    const identidade = JSON.stringify([entrada.lei, entrada.opcao]);
    if (identidades.has(identidade))
      throw new Error(
        `Opção política duplicada: ${entrada.lei}/${entrada.opcao}`,
      );
    identidades.add(identidade);
    const registros = opcoesPorObjeto.get(entrada.objeto) ?? [];
    registros.push(entrada);
    opcoesPorObjeto.set(entrada.objeto, registros);
  }

  const classificacao = (registro: RegistroOpcao) => {
    if (!registro.vetor) return { estado: "sem-posicao" as const };
    const [economia, costumes] = registro.vetor;
    if (
      !Number.isFinite(economia) ||
      !Number.isFinite(costumes) ||
      economia < -2 ||
      economia > 2 ||
      costumes < -2 ||
      costumes > 2
    )
      return { estado: "vetor-invalido" as const };
    if (economia === 0 && costumes === 0) return { estado: "centro" as const };
    if (economia === 0 || costumes === 0)
      return { estado: "sobre-eixo" as const };
    const quadrante: Quadrante = `${economia < 0 ? "estado" : "mercado"}_${costumes < 0 ? "liberdade" : "autoridade"}`;
    return { estado: "quadrante" as const, quadrante };
  };

  const quadrantesGlobais: Record<Quadrante, Set<string>> = {
    estado_liberdade: new Set(),
    estado_autoridade: new Set(),
    mercado_liberdade: new Set(),
    mercado_autoridade: new Set(),
  };
  const contagem = {
    totalOpcoes: 0,
    sobreEixos: 0,
    centro: 0,
    semPosicao: 0,
    vetoresInvalidos: 0,
  };
  const objetos = [...opcoesPorObjeto.entries()].map(([id, registros]) => {
    const quadrantes: Record<Quadrante, Set<string>> = {
      estado_liberdade: new Set(),
      estado_autoridade: new Set(),
      mercado_liberdade: new Set(),
      mercado_autoridade: new Set(),
    };
    const leisPorQuadrante: Record<Quadrante, Set<string>> = {
      estado_liberdade: new Set(),
      estado_autoridade: new Set(),
      mercado_liberdade: new Set(),
      mercado_autoridade: new Set(),
    };
    const sobreEixos: string[] = [];
    const centro: string[] = [];
    const semPosicao: string[] = [];
    const vetoresInvalidos: string[] = [];
    for (const registro of registros) {
      contagem.totalOpcoes += 1;
      const chave = `${registro.lei}/${registro.opcao}`;
      const resultado = classificacao(registro);
      if (resultado.estado === "quadrante") {
        quadrantes[resultado.quadrante].add(chave);
        leisPorQuadrante[resultado.quadrante].add(registro.lei);
        quadrantesGlobais[resultado.quadrante].add(chave);
      } else if (resultado.estado === "sobre-eixo") {
        sobreEixos.push(chave);
        contagem.sobreEixos += 1;
      } else if (resultado.estado === "centro") {
        centro.push(chave);
        contagem.centro += 1;
      } else if (resultado.estado === "sem-posicao") {
        semPosicao.push(chave);
        contagem.semPosicao += 1;
      } else {
        vetoresInvalidos.push(chave);
        contagem.vetoresInvalidos += 1;
      }
    }
    return {
      id,
      leis: [...new Set(registros.map((registro) => registro.lei))],
      totalOpcoes: registros.length,
      quadrantes: Object.fromEntries(
        nomesQuadrantes.map((quadrante) => [
          quadrante,
          {
            coberto: quadrantes[quadrante].size > 0,
            quantidadeOpcoes: quadrantes[quadrante].size,
            quantidadeLeis: leisPorQuadrante[quadrante].size,
            opcoes: [...quadrantes[quadrante]],
            leis: [...leisPorQuadrante[quadrante]],
          },
        ]),
      ),
      sobreEixos,
      centro,
      semPosicao,
      vetoresInvalidos,
    };
  });

  return {
    eixos: {
      economia: "Estado (-) ↔ mercado (+)",
      costumes: "liberdade (-) ↔ autoridade (+)",
    },
    escalaVetores: { minimo: -2, maximo: 2 },
    classificacao:
      "estimativa editorial experimental, não posição partidária medida",
    quadrantes: Object.fromEntries(
      nomesQuadrantes.map((id) => [
        id,
        {
          coberto: quadrantesGlobais[id].size > 0,
          opcoes: [...quadrantesGlobais[id]],
        },
      ]),
    ),
    resumo: {
      ...contagem,
      quadrantesCobertos: nomesQuadrantes.filter(
        (quadrante) => quadrantesGlobais[quadrante].size > 0,
      ).length,
      totalQuadrantes: nomesQuadrantes.length,
    },
    objetos,
    alerta:
      "A cobertura é calculada por objeto de política. Opções sobre eixos, no centro, sem vetor ou com vetor inválido não cobrem quadrantes. Posições são estimativas experimentais e não são deslocadas para preencher lacunas.",
  };
}
