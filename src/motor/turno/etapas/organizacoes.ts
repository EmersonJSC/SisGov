// Etapas do turno: organizações políticas (passo I2). Comportamento em
// motor/organizacoes/organizacoes.md.
import { novoFato, type Fato } from "../../fatos";
import { tomada } from "../../leis";
import {
  andarOrganizacoes,
  organizacoesIniciais,
  type Acontecido,
} from "../../organizacoes";
import { popsPorTerritorio } from "../../populacao";
import type { Etapa } from "../comum";
import type { Regras } from "../regras";
import type { Estado } from "../../estado";

const TIPO_DO_FATO = {
  nasceu: "organizacao-nasceu",
  cresceu: "organizacao-cresceu",
  rachou: "organizacao-rachou",
  acabou: "organizacao-acabou",
} as const;

/** Gente de cada grupo em cada estado (os pops do estado × a parte deles no grupo) e de cada estado. */
function gruposPorLugar(regras: Regras, estado: Estado) {
  const porLugar = popsPorTerritorio(
    regras.territorios,
    regras.moradia?.pops_campo ?? [],
    estado.pops,
  );
  const lugares = Object.fromEntries(
    Object.entries(porLugar).map(([lugar, pops]) => [
      lugar,
      Object.fromEntries(
        regras.grupos.map((g) => [
          g.id,
          Object.entries(g.membros).reduce(
            (s, [pop, f]) => s + (pops[pop] ?? 0) * f,
            0,
          ),
        ]),
      ),
    ]),
  );
  const pessoas_lugar = Object.fromEntries(
    Object.entries(porLugar).map(([lugar, pops]) => [
      lugar,
      Object.values(pops).reduce((s, n) => s + n, 0),
    ]),
  );
  return { lugares, pessoas_lugar };
}

const fatoDo = (turno: number, a: Acontecido): Fato =>
  novoFato({
    tipo: TIPO_DO_FATO[a.tipo],
    turno,
    tamanho:
      a.organizacao.nivel === "grave" || a.organizacao.nivel === "critica"
        ? "grande"
        : a.tipo === "nasceu" || a.tipo === "acabou"
          ? "pequeno"
          : "medio",
    sobre: a.organizacao.lugar,
    quem: [a.organizacao.id],
  });

/**
 * 8b. Organizações: andam com os radicais dos grupos deste turno; os pontos
 * nos índices entram na base (como no saneamento); a repressão soma radicais
 * nos grupos que alimentam a organização.
 */
export const organizacoes: Etapa = (regras, estado) => {
  const r = regras.organizacoes;
  if (!r) return estado;
  const antes = estado.organizacoes ?? organizacoesIniciais();
  const res = andarOrganizacoes(
    r,
    antes,
    {
      turno: estado.turno,
      populacao: estado.essenciais.populacao,
      grupos: estado.grupos,
      tipos: regras.grupos,
      ...gruposPorLugar(regras, estado),
      repressao: tomada(regras.leis, estado.leis, "repressao"),
      inteligencia: tomada(regras.leis, estado.leis, "inteligencia"),
    },
    estado.acaso,
  );
  const base = { ...estado.base };
  for (const [indice, p] of Object.entries(res.organizacoes.pontos))
    if (indice in base) base[indice] += p - (antes.pontos[indice] ?? 0);
  const grupos = Object.fromEntries(
    Object.entries(estado.grupos).map(([id, g]) => {
      const mais = res.revolta[id] ?? 0;
      if (!mais) return [id, g];
      return [
        id,
        { ...g, radicais: Math.min(100 - g.lealistas, g.radicais + mais) },
      ];
    }),
  );
  return {
    ...estado,
    base,
    grupos,
    acaso: res.acaso,
    organizacoes: res.organizacoes,
    fatos: [
      ...(estado.fatos ?? []),
      ...res.acontecidos.map((a) => fatoDo(estado.turno, a)),
    ],
  };
};
