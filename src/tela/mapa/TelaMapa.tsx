// Moldura do mapa político herdado da tela antiga: monta a visão da partida,
// guarda o que está aberto e selecionado, a janela da lei (fatia 2), a barra
// do topo e o resultado do turno (fatia 3).
import { useEffect, useMemo, useState } from "react";
import {
  montarVisao,
  previaDaLei,
  valorDoNivel,
  type Partida,
  type Pedido,
  type VisaoLei,
} from "../../partida";
import { comPedido } from "../fila";
import { BarraDoTopo } from "./BarraDoTopo";
import { DocumentoLei, type Desvio, type Retangulo } from "./DocumentoLei";
import { montarBase, PRESIDENCIA } from "./layout";
import { Fichas } from "./Fichas";
import { Mercado } from "./Mercado";
import { MapaPolitico } from "./MapaPolitico";
import { ResultadoDoTurno, temResultado } from "./ResultadoDoTurno";
import { indexarRelacoes, ligacoesDeFundo } from "./relacoes";
import "./mapa.css";

const VAZIO_MAPA = new Map();
const VAZIO_SET = new Set<string>();
const CENTRO: Desvio = { x: 0, y: 0 };

interface Props {
  partida: Partida;
  fila: Pedido[];
  setFila: (f: Pedido[]) => void;
  podeCarregar: boolean;
  onPassar: () => void;
  onSalvar: () => void;
  onCarregar: () => void;
  onRecomecar: () => void;
  aviso: string;
}

/** Nível da visão que corresponde a um valor do motor. */
function nivelDe(lei: VisaoLei, valor: Pedido["valor"]): number {
  if (typeof valor === "number") return valor * 100;
  return Math.max(0, lei.opcoes?.findIndex((o) => o.id === valor) ?? 0);
}

export function TelaMapa({
  partida,
  fila,
  setFila,
  podeCarregar,
  onPassar,
  onSalvar,
  onCarregar,
  onRecomecar,
  aviso,
}: Props) {
  const visao = useMemo(() => montarVisao(partida), [partida]);
  const base = useMemo(() => montarBase(visao), [visao]);
  const indice = useMemo(() => indexarRelacoes(visao), [visao]);
  const fundo = useMemo(() => ligacoesDeFundo(visao), [visao]);
  const [aberta, setAberta] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [janela, setJanela] = useState<string | null>(null);
  const [desvio, setDesvio] = useState<Desvio>(CENTRO);
  const [retangulo, setRetangulo] = useState<Retangulo | null>(null);
  const [rascunho, setRascunho] = useState(0);
  const [resultado, setResultado] = useState(() => temResultado(partida));
  const [desvioResultado, setDesvioResultado] = useState<Desvio>(CENTRO);
  const [mercado, setMercado] = useState(false);
  const [desvioMercado, setDesvioMercado] = useState<Desvio>(CENTRO);
  const [fichas, setFichas] = useState(false);
  const [desvioFichas, setDesvioFichas] = useState<Desvio>(CENTRO);

  const lei = visao.leis.find((l) => l.id === janela);
  const pedido = fila.find((p) => p.lei === janela);
  const inicial = (l: VisaoLei) => {
    const p = fila.find((x) => x.lei === l.id);
    // lei de opções sem valor no país começa na primeira opção
    return p ? nivelDe(l, p.valor) : Math.max(0, l.meta);
  };

  // Turno novo: a janela aberta volta ao que vale (ou ao que está na fila)
  // e o resultado do turno abre se houve votação ou eleição.
  useEffect(() => {
    // com resultado na mesa, a janela da lei fecha para não empilhar papel
    if (temResultado(partida)) {
      setResultado(true);
      fechar();
    } else {
      setResultado(false);
      if (lei) setRascunho(inicial(lei));
    }
  }, [partida]);

  const valor = lei ? valorDoNivel(partida, lei.id, rascunho) : null;
  const previa = useMemo(
    () =>
      lei && valor !== null && valor !== partida.estado.leis[lei.id]
        ? previaDaLei(partida, lei.id, valor)
        : null,
    [partida, lei, valor],
  );

  const selecionar = (id: string | null) => {
    setSelecionado(id);
    const l = visao.leis.find((x) => x.id === id);
    if (!l) return;
    if (l.id !== janela) setRascunho(inicial(l));
    setJanela(l.id);
  };

  const fechar = () => {
    setJanela(null);
    setRetangulo(null);
    setSelecionado(null);
  };

  return (
    <div className="tela">
      <BarraDoTopo
        partida={partida}
        pedidos={fila.length}
        aviso={aviso}
        podeCarregar={podeCarregar}
        onPassar={onPassar}
        onSalvar={onSalvar}
        onCarregar={onCarregar}
        onRecomecar={onRecomecar}
        onMercado={() => setMercado(!mercado)}
        onFichas={() => setFichas(!fichas)}
      />
      <main className="area-mapa">
        <MapaPolitico
          visao={visao}
          base={base}
          indice={indice}
          fundo={fundo}
          aberta={aberta}
          onAbrir={(id) => setAberta(id === PRESIDENCIA ? null : id)}
          selecionado={selecionado}
          onSelecionar={selecionar}
          marcas={VAZIO_MAPA}
          pulsos={VAZIO_SET}
          variacoes={VAZIO_MAPA}
          variacoesVoce={VAZIO_MAPA}
          mostrarVariacoes={false}
          onAlternarVariacoes={() => {}}
          painel={0}
          cobertura={selecionado === janela ? retangulo : null}
        />
        {lei && !partida.estado.encerrada ? (
          <DocumentoLei
            key={lei.id}
            lei={lei}
            visao={visao}
            moeda={partida.moeda}
            pib={partida.estado.essenciais.pib_nominal}
            base={base}
            indice={indice}
            rascunho={rascunho}
            onRascunho={setRascunho}
            previa={previa}
            naFila={!!pedido}
            enviado={!!pedido && pedido.valor === valor}
            onEnviar={() =>
              valor !== null && setFila(comPedido(fila, partida, lei.id, valor))
            }
            onTirar={() => {
              setFila(fila.filter((p) => p.lei !== lei.id));
              setRascunho(lei.meta);
            }}
            onFechar={fechar}
            desvio={desvio}
            onDesvio={setDesvio}
            onRetangulo={setRetangulo}
            camada={0}
            ativa
            onFocar={() => setSelecionado(lei.id)}
          />
        ) : null}
        {mercado ? (
          <Mercado
            visao={visao}
            moeda={partida.moeda}
            pib={partida.estado.essenciais.pib_nominal}
            onFechar={() => setMercado(false)}
            desvio={desvioMercado}
            onDesvio={setDesvioMercado}
            onRetangulo={() => {}}
            camada={2}
            ativa
            onFocar={() => {}}
          />
        ) : null}
        {fichas ? (
          <Fichas
            partida={partida}
            visao={visao}
            fila={fila}
            setFila={setFila}
            onFechar={() => setFichas(false)}
            desvio={desvioFichas}
            onDesvio={setDesvioFichas}
            onRetangulo={() => {}}
            camada={3}
            ativa
            onFocar={() => {}}
          />
        ) : null}
        {resultado ? (
          <ResultadoDoTurno
            partida={partida}
            visao={visao}
            onFechar={() => setResultado(false)}
            desvio={desvioResultado}
            onDesvio={setDesvioResultado}
            onRetangulo={() => {}}
            camada={1}
            ativa
            onFocar={() => {}}
          />
        ) : null}
      </main>
    </div>
  );
}
