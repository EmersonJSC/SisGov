/**
 * Janelas abertas sobre o mapa. Cada lei ou indicador clicado abre a sua
 * própria janela; abrir outra não mexe nas que já estão abertas. A janela de
 * lei guarda o próprio rascunho e a própria prévia.
 */
import { useEffect, useMemo, useState } from "react";
import {
  leisQueCaem,
  preverLei,
  type Partida,
  type PrevisaoLei,
  type RelatorioTurno,
  type VisaoLei,
  type VisaoPartida,
} from "../../app/partida";
import {
  DocumentoBolha,
  DocumentoLei,
  type Desvio,
  type Horizonte,
  type JanelaProps,
} from "./Documentos";
import type { BaseMapa } from "./layout";
import type { IndiceRelacoes } from "./relacoes";

export type Janela = Readonly<{ id: string; desvio: Desvio }>;

/** No máximo tantas janelas; abrir mais fecha a mais antiga. */
export const MAXIMO_DE_JANELAS = 8;

/** Passo da cascata: cada janela nova abre um pouco abaixo e à direita. */
const CASCATA = 34;

/** Abre uma janela (ou traz para a frente se já existe). A última é a da frente. */
export function abrirJanela(
  janelas: readonly Janela[],
  id: string,
): readonly Janela[] {
  const existente = janelas.find((j) => j.id === id);
  if (existente) return [...janelas.filter((j) => j.id !== id), existente];
  const frente = janelas.at(-1);
  let desvio = frente
    ? { x: frente.desvio.x + CASCATA, y: frente.desvio.y + CASCATA }
    : { x: 0, y: 0 };
  // a cascata volta ao centro antes de sair da tela
  if (Math.abs(desvio.x) > CASCATA * 6 || Math.abs(desvio.y) > CASCATA * 5)
    desvio = { x: -CASCATA * 2, y: -CASCATA * 2 };
  const proximas = [...janelas, { id, desvio }];
  return proximas.slice(-MAXIMO_DE_JANELAS);
}

export function JanelaLei({
  partida,
  lei,
  visao,
  base,
  indice,
  horizonte,
  onHorizonte,
  onAplicar,
  onRevogar,
  onPrevisao,
  onFechar,
  onSelecionar,
  ...janela
}: JanelaProps & {
  partida: Partida;
  lei: VisaoLei;
  visao: VisaoPartida;
  base: BaseMapa;
  indice: IndiceRelacoes;
  horizonte: Horizonte;
  onHorizonte: (h: Horizonte) => void;
  /** Aplica a mudança; devolve a mensagem de erro, se houver. */
  onAplicar: (leiId: string, nivel: number) => string | null;
  /** Revoga a lei (D-65); devolve a mensagem de erro, se houver. */
  onRevogar: (leiId: string) => string | null;
  onPrevisao: (leiId: string, previsao: PrevisaoLei | null) => void;
  onFechar: () => void;
  onSelecionar: (id: string) => void;
}) {
  // Lei fora do mapa (catálogo): começa na primeira opção, e qualquer
  // escolha é uma proposta nova (não há meta em vigor para comparar).
  const inicial = () => {
    if (lei.emVigor) return lei.meta;
    if (lei.opcoes?.length)
      return lei.opcoes.some((o) => Math.abs(o.valor - lei.meta) < 1e-9)
        ? lei.meta
        : lei.opcoes[0].valor;
    // valor: a revogação zera a meta; propõe um começo modesto
    if (lei.meta > 0) return lei.meta;
    const min = lei.minimo ?? 0;
    return min + ((lei.maximo ?? min) - min) * 0.1;
  };
  const referencia = lei.emVigor ? lei.meta : Number.NaN;
  const igual = (valor: number) => Math.abs(valor - referencia) < 1e-9;
  const [rascunho, setRascunho] = useState(inicial);
  const [previsao, setPrevisao] = useState<PrevisaoLei | null>(null);
  const [calculando, setCalculando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Depois de assinar (ou de outra janela mudar a meta), volta à meta.
  useEffect(() => {
    setRascunho(inicial());
    setErro(null);
  }, [lei.meta, lei.emVigor]);

  // Prévia de 1 ano (4 turnos), um instante depois do jogador parar.
  useEffect(() => {
    // lei trancada (pétrea ou sem a lei de base): não há o que prever
    if (igual(rascunho) || (lei.nivelLegal && lei.bloqueio)) {
      setPrevisao(null);
      setCalculando(false);
      return;
    }
    setCalculando(true);
    const id = window.setTimeout(() => {
      const r = preverLei(partida, lei.id, rascunho, 4);
      setCalculando(false);
      if (r.ok) {
        setPrevisao(r.value);
        setErro(null);
      } else {
        setPrevisao(null);
        setErro(r.erros.join(" "));
      }
    }, 140);
    return () => window.clearTimeout(id);
  }, [partida, lei.id, lei.nivelLegal, lei.bloqueio, referencia, rascunho]);

  // SG138: filhas que cairiam com esta redação, para avisar antes de assinar
  const quedas = useMemo(
    () => (igual(rascunho) ? [] : leisQueCaem(partida, lei.id, rascunho)),
    [partida, lei.id, referencia, rascunho],
  );

  useEffect(() => onPrevisao(lei.id, previsao), [lei.id, previsao, onPrevisao]);
  useEffect(() => () => onPrevisao(lei.id, null), [lei.id, onPrevisao]);

  return (
    <DocumentoLei
      lei={lei}
      visao={visao}
      base={base}
      indice={indice}
      rascunho={rascunho}
      onRascunho={setRascunho}
      previsao={previsao}
      quedas={quedas}
      calculando={calculando}
      erro={erro}
      horizonte={horizonte}
      onHorizonte={onHorizonte}
      onAssinar={() => setErro(onAplicar(lei.id, rascunho))}
      onRevogar={
        lei.emVigor && lei.revogavel
          ? () => setErro(onRevogar(lei.id))
          : undefined
      }
      onFechar={onFechar}
      onSelecionar={onSelecionar}
      {...janela}
    />
  );
}

export function JanelaBolha(
  props: JanelaProps & {
    bolha: VisaoPartida["bolhas"][number];
    visao: VisaoPartida;
    base: BaseMapa;
    indice: IndiceRelacoes;
    relatorio: RelatorioTurno | null;
    variacao?: number;
    onFechar: () => void;
    onSelecionar: (id: string) => void;
  },
) {
  return <DocumentoBolha {...props} />;
}
