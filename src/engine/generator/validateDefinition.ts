import type { DefinicaoGerador, FalhaGerador, RodadaGerador } from "./types";

function provenienciaValida(
  p: { estado: string; referencia?: string; motivo?: string } | undefined,
  caminho: string,
  falhas: FalhaGerador[],
) {
  if (!p) {
    falhas.push({
      codigo: "PROVENIENCIA_AUSENTE",
      caminho,
      mensagem: "Declare uma fonte ou marque explicitamente como hipótese.",
      bloqueante: true,
    });
  } else if (p.estado === "fonte" && !p.referencia?.trim()) {
    falhas.push({
      codigo: "PROVENIENCIA_AUSENTE",
      caminho,
      mensagem: "A fonte precisa de uma referência identificável.",
      bloqueante: true,
    });
  } else if (p.estado === "hipotese" && !p.motivo?.trim()) {
    falhas.push({
      codigo: "HIPOTESE_SEM_MOTIVO",
      caminho,
      mensagem: "Explique por que esta relação ou valor continua hipotético.",
      bloqueante: true,
    });
  }
}

function temCiclo(id: string, adj: ReadonlyMap<string, readonly string[]>) {
  const vistos = new Set<string>();
  const visitar = (atual: string): boolean => {
    for (const proximo of adj.get(atual) ?? []) {
      if (proximo === id) return true;
      if (!vistos.has(proximo)) {
        vistos.add(proximo);
        if (visitar(proximo)) return true;
      }
    }
    return false;
  };
  return visitar(id);
}

function retornaAOutraDecisao(
  id: string,
  adj: ReadonlyMap<string, readonly string[]>,
  decisoes: ReadonlySet<string>,
) {
  const vistos = new Set<string>([id]);
  const fila = (adj.get(id) ?? []).map((no) => ({
    id: no,
    passouPorEstado: !decisoes.has(no),
  }));
  while (fila.length) {
    const atual = fila.shift()!;
    if (decisoes.has(atual.id) && atual.passouPorEstado) return true;
    const chave = `${atual.id}:${atual.passouPorEstado}`;
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    fila.push(
      ...(adj.get(atual.id) ?? []).map((no) => ({
        id: no,
        passouPorEstado: atual.passouPorEstado || !decisoes.has(no),
      })),
    );
  }
  return false;
}

export function validarDefinicao(
  def: DefinicaoGerador,
): readonly FalhaGerador[] {
  const falhas: FalhaGerador[] = [];
  const ids = new Set<string>();
  const nos = new Map(def.nos.map((no) => [no.id, no]));
  for (const [i, no] of def.nos.entries()) {
    if (ids.has(no.id))
      falhas.push({
        codigo: "ID_DUPLICADO",
        caminho: `nos[${i}].id`,
        mensagem: `ID repetido: ${no.id}.`,
        bloqueante: true,
      });
    ids.add(no.id);
    provenienciaValida(no.proveniencia, `nos[${i}].proveniencia`, falhas);
    if (no.tipo === "lei") {
      if (!no.decisao) {
        falhas.push({
          codigo: "LEI_SEM_ESCOLHA",
          caminho: `nos[${i}].decisao`,
          mensagem: "Lei sem decisão explícita do jogador.",
          bloqueante: true,
        });
      } else {
        if (!no.decisao.pergunta.trim() || !no.decisao.variavel.trim())
          falhas.push({
            codigo: "ESCOLHA_SEM_VARIAVEL",
            caminho: `nos[${i}].decisao`,
            mensagem:
              "A escolha precisa dizer o que o jogador decide e qual variável muda.",
            bloqueante: true,
          });
        if (
          no.decisao.modo === "opcoes" &&
          (no.decisao.opcoes?.length ?? 0) < 2
        )
          falhas.push({
            codigo: "ESCOLHA_SEM_ALTERNATIVAS",
            caminho: `nos[${i}].decisao.opcoes`,
            mensagem:
              "Uma escolha por opções precisa oferecer ao menos duas alternativas compreensíveis.",
            bloqueante: true,
          });
        if (no.decisao.modo === "faixa" && !no.decisao.faixa)
          falhas.push({
            codigo: "ESCOLHA_SEM_ALTERNATIVAS",
            caminho: `nos[${i}].decisao.faixa`,
            mensagem:
              "Uma escolha contínua precisa declarar sua faixa natural; o limite superior pode ser aberto.",
            bloqueante: true,
          });
      }
    }
  }

  const adj = new Map<string, string[]>();
  const decisoes = new Set(
    def.nos.filter((no) => no.decisao).map((no) => no.id),
  );
  const fluxos = new Set<string>();
  for (const [i, relacao] of def.relacoes.entries()) {
    if (!nos.has(relacao.de) || !nos.has(relacao.para))
      falhas.push({
        codigo: "ALVO_AUSENTE",
        caminho: `relacoes[${i}]`,
        mensagem: `Relação aponta para nó ausente (${relacao.de} → ${relacao.para}).`,
        bloqueante: true,
      });
    else
      (
        adj.get(relacao.de) ?? (adj.set(relacao.de, []), adj.get(relacao.de)!)
      ).push(relacao.para);
    if (!Number.isInteger(relacao.atrasoTurnos) || relacao.atrasoTurnos < 0)
      falhas.push({
        codigo: "ATRASO_INVALIDO",
        caminho: `relacoes[${i}].atrasoTurnos`,
        mensagem:
          "O atraso deve ser um número inteiro igual ou maior que zero.",
        bloqueante: true,
      });
    provenienciaValida(
      relacao.proveniencia,
      `relacoes[${i}].proveniencia`,
      falhas,
    );
    if (relacao.fluxo && nos.get(relacao.para)?.tipo === "conta") {
      const chave = `${relacao.para}:${relacao.fluxo}`;
      if (fluxos.has(chave))
        falhas.push({
          codigo: "FLUXO_DUPLICADO",
          caminho: `relacoes[${i}].fluxo`,
          mensagem: `Mais de uma relação lança o fluxo ${relacao.fluxo} no mesmo nó ${relacao.para}; verificar dupla contagem.`,
          bloqueante: true,
        });
      fluxos.add(chave);
    }
  }

  for (const [i, parametro] of def.parametros.entries()) {
    provenienciaValida(
      parametro.proveniencia,
      `parametros[${i}].proveniencia`,
      falhas,
    );
    if (
      !Number.isFinite(parametro.valor) ||
      !Number.isFinite(parametro.passo) ||
      parametro.passo <= 0
    )
      falhas.push({
        codigo: "PARAMETRO_FAIXA_INVALIDA",
        caminho: `parametros[${i}]`,
        mensagem:
          "Valor e passo precisam ser finitos; o passo deve ser positivo.",
        bloqueante: true,
      });
    if (!parametro.faixa)
      falhas.push({
        codigo: "PARAMETRO_SEM_FAIXA",
        caminho: `parametros[${i}].faixa`,
        mensagem:
          "Sem faixa justificada, o otimizador não pode alterar este parâmetro.",
        bloqueante: false,
      });
    else if (
      parametro.faixa.minimo > parametro.faixa.maximo ||
      !parametro.faixa.justificativa.trim()
    )
      falhas.push({
        codigo: "PARAMETRO_FAIXA_INVALIDA",
        caminho: `parametros[${i}].faixa`,
        mensagem: "A faixa precisa ser ordenada e justificada.",
        bloqueante: true,
      });
  }

  for (const [i, no] of def.nos.entries()) {
    if (
      no.decisao &&
      !temCiclo(no.id, adj) &&
      !retornaAOutraDecisao(no.id, adj, decisoes)
    )
      falhas.push({
        codigo: "CICLO_SEM_FEEDBACK",
        caminho: `nos[${i}]`,
        mensagem: `A decisão ${no.nome} não percorre consequências até uma decisão futura do ciclo.`,
        bloqueante: true,
      });
  }
  return falhas;
}

export function gerarRodada(def: DefinicaoGerador): RodadaGerador {
  const falhas = validarDefinicao(def);
  const bloqueada = falhas.some((falha) => falha.bloqueante);
  const hipotese = [
    ...def.nos.map((no) => no.proveniencia),
    ...def.relacoes.map((r) => r.proveniencia),
    ...def.parametros.map((p) => p.proveniencia),
  ].some((p) => p.estado === "hipotese");
  return {
    idDefinicao: def.id,
    estado: bloqueada
      ? "bloqueada"
      : hipotese
        ? "rascunho"
        : "pronta-para-revisao",
    nos: def.nos,
    relacoes: def.relacoes,
    falhas,
  };
}
