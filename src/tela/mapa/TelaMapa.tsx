// Moldura do mapa político herdado da tela antiga: monta a visão da partida
// e guarda o que está aberto e selecionado. Fatia 1: só olhar.
import { useMemo, useState } from "react";
import { montarVisao, type Partida } from "../../partida";
import { montarBase, PRESIDENCIA } from "./layout";
import { MapaPolitico } from "./MapaPolitico";
import { indexarRelacoes, ligacoesDeFundo } from "./relacoes";
import "./mapa.css";

const VAZIO_MAPA = new Map();
const VAZIO_SET = new Set<string>();

interface Props {
  partida: Partida;
  onPainel: () => void;
}

export function TelaMapa({ partida, onPainel }: Props) {
  const visao = useMemo(() => montarVisao(partida), [partida]);
  const base = useMemo(() => montarBase(visao), [visao]);
  const indice = useMemo(() => indexarRelacoes(visao), [visao]);
  const fundo = useMemo(() => ligacoesDeFundo(visao), [visao]);
  const [aberta, setAberta] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const ano = Math.floor(visao.turno / 6) + 1;
  const mes = (visao.turno % 6) * 2 + 1;

  return (
    <div className="tela">
      <header className="barra-superior">
        <div className="pais">
          <strong>{visao.pais}</strong>
        </div>
        <span>
          Ano {ano}, mês {mes}
        </span>
        <button className="botao-painel" onClick={onPainel}>
          Painel
        </button>
      </header>
      <main className="area-mapa">
        <MapaPolitico
          visao={visao}
          base={base}
          indice={indice}
          fundo={fundo}
          aberta={aberta}
          onAbrir={(id) => setAberta(id === PRESIDENCIA ? null : id)}
          selecionado={selecionado}
          onSelecionar={setSelecionado}
          marcas={VAZIO_MAPA}
          pulsos={VAZIO_SET}
          variacoes={VAZIO_MAPA}
          variacoesVoce={VAZIO_MAPA}
          mostrarVariacoes={false}
          onAlternarVariacoes={() => {}}
          painel={0}
          cobertura={null}
        />
      </main>
    </div>
  );
}
