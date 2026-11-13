// Tela inicial: mesa do governante. Uma etapa por vez: país → partido → chapa
// → ministérios → iniciar. A partida só nasce no último carimbo.
import { useMemo, useState } from "react";
import {
  chapaSugerida,
  ministrosSugeridos,
  paisesJogaveis,
  prepararComeco,
  type ComecoDoJogador,
} from "../../partida";
import { EtapaChapa } from "./EtapaChapa";
import { EtapaIniciar } from "./EtapaIniciar";
import { EtapaMinisterios } from "./EtapaMinisterios";
import { EtapaPais } from "./EtapaPais";
import { EtapaPartido } from "./EtapaPartido";
import {
  ESCOLHAS_INICIAIS,
  chapaCompleta,
  motivoDoPartido,
  trocarMinistro,
  type Escolhas,
} from "./escolhas";
import "./inicio.css";

const ETAPAS = ["País", "Partido", "Chapa", "Ministérios", "Iniciar"] as const;

interface Props {
  podeCarregar: boolean;
  aviso: string;
  onCarregar: () => void;
  onComecar: (
    pais: string,
    semente: number,
    comeco: ComecoDoJogador,
    semCongresso: boolean,
  ) => void;
}

export function TelaInicio({
  podeCarregar,
  aviso,
  onCarregar,
  onComecar,
}: Props) {
  const [passo, setPasso] = useState(-1);
  const [e, setE] = useState<Escolhas>(() =>
    ESCOLHAS_INICIAIS(paisesJogaveis()[0]),
  );
  const mudar = (parcial: Partial<Escolhas>) =>
    setE((antes) => ({ ...antes, ...parcial }));
  const preparo = useMemo(
    () => prepararComeco(e.pais, e.semente),
    [e.pais, e.semente],
  );
  const chapa = chapaCompleta(e);
  const sorteados = useMemo(
    () => (chapa ? ministrosSugeridos(e.pais, e.semente, chapa, e.rodada) : {}),
    [e.pais, e.semente, e.rodada, JSON.stringify(chapa)],
  );
  const ministros = { ...sorteados, ...e.trocas };

  const podeSeguir = [
    true,
    motivoDoPartido(e, preparo.partidos) === null,
    chapa !== null,
    true,
    true,
  ][passo];

  const comecar = () => {
    if (!chapa) return;
    onComecar(
      e.pais,
      e.semente,
      {
        partido: { nome: e.nome.trim(), sigla: e.sigla },
        chapa,
        coligarGoverno: e.coligarGoverno,
        ministros,
      },
      e.semCongresso,
    );
  };

  const sugerirChapa = () => {
    const s = chapaSugerida(e.pais, e.semente);
    mudar({ chapa: s });
  };

  return (
    <div className="inicio">
      <div className="ini-quadro">
        {passo < 0 ? (
          <div className="ini-abertura">
            <span className="ini-selo ini-selo-titulo">SisGov</span>
            <p className="ini-lema">Governe um país e responda nas urnas.</p>
            <button
              className="ini-placa ini-grande"
              onClick={() => setPasso(0)}
            >
              Novo mandato
            </button>
            <button
              className="ini-placa"
              onClick={onCarregar}
              disabled={!podeCarregar}
            >
              Carregar partida salva
            </button>
            {aviso && <p className="ini-aviso-da-mesa">{aviso}</p>}
          </div>
        ) : (
          <>
            <header className="ini-fita">
              <ol>
                {ETAPAS.map((nome, i) => (
                  <li
                    key={nome}
                    className={i === passo ? "atual" : i < passo ? "feita" : ""}
                  >
                    {i + 1}. {nome}
                  </li>
                ))}
              </ol>
            </header>
            <div className="ini-mesa-inicial">
              {passo === 0 && <EtapaPais e={e} mudar={mudar} />}
              {passo === 1 && (
                <EtapaPartido e={e} mudar={mudar} preparo={preparo} />
              )}
              {passo === 2 && (
                <>
                  <EtapaChapa e={e} mudar={mudar} preparo={preparo} />
                  <button
                    className="ini-placa ini-pequena ini-sugerir"
                    onClick={sugerirChapa}
                  >
                    Sugerir uma chapa
                  </button>
                </>
              )}
              {passo === 3 && (
                <EtapaMinisterios
                  e={e}
                  mudar={mudar}
                  preparo={preparo}
                  ministros={ministros}
                  onTrocar={(caixa, pessoa) =>
                    mudar({ trocas: trocarMinistro(ministros, caixa, pessoa) })
                  }
                />
              )}
              {passo === 4 && (
                <EtapaIniciar e={e} mudar={mudar} preparo={preparo} />
              )}
            </div>
            <footer className="ini-rodape">
              <button
                className="ini-placa"
                onClick={() => setPasso(passo === 0 ? -1 : passo - 1)}
              >
                Voltar
              </button>
              {aviso && <span className="ini-aviso-da-mesa">{aviso}</span>}
              {passo < ETAPAS.length - 1 ? (
                <button
                  className="ini-placa ini-grande"
                  disabled={!podeSeguir}
                  onClick={() => setPasso(passo + 1)}
                >
                  Seguir
                </button>
              ) : (
                <button className="ini-placa ini-grande" onClick={comecar}>
                  Iniciar mandato
                </button>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
