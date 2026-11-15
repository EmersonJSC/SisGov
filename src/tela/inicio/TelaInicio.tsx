// Tela inicial: mesa do governante. Uma etapa por vez: país → partido → chapa
// → ministérios → iniciar. A partida só nasce no último carimbo.
import { useMemo, useState } from "react";
import {
  TAMANHOS,
  chapaSugerida,
  governoPronto,
  ministrosSugeridos,
  paisesJogaveis,
  prepararComeco,
  type ComecoDoJogador,
  type OpcoesPartida,
} from "../../partida";
import { EtapaChapa } from "./EtapaChapa";
import { EtapaGoverno } from "./EtapaGoverno";
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
import { useCheats } from "../useCheats";
import "./inicio.css";

const PARTIDO_DE_TESTE = { nome: "Partido de Teste", sigla: "PTE" };
const AVISO_DE_TESTE_MS = 2500;
const ETAPAS = [
  "País",
  "Partido",
  "Chapa",
  "Governo",
  "Ministros",
  "Iniciar",
] as const;

interface Props {
  podeCarregar: boolean;
  aviso: string;
  onCarregar: () => void;
  onComecar: (
    pais: string,
    semente: number,
    comeco: ComecoDoJogador,
    teste: Pick<OpcoesPartida, "semCongresso" | "semSenado" | "comJudiciario">,
  ) => void;
}

export function TelaInicio({
  podeCarregar,
  aviso,
  onCarregar,
  onComecar,
}: Props) {
  const [passo, setPasso] = useState(-1);
  const [avisoDeTeste, setAvisoDeTeste] = useState("");
  const avisarDoTeste = (texto: string) => {
    setAvisoDeTeste(texto);
    setTimeout(() => setAvisoDeTeste(""), AVISO_DE_TESTE_MS);
  };
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
  const caixas = e.caixas ?? governoPronto(e.tamanho, preparo.caixas);
  const contagem = TAMANHOS.map(
    (t) => governoPronto(t.id, preparo.caixas).length,
  );
  const trocas = Object.fromEntries(
    Object.entries(e.trocas).filter(([c]) => caixas.some((x) => x.id === c)),
  );
  const ministros = useMemo(
    () =>
      chapa
        ? ministrosSugeridos(e.pais, e.semente, chapa, e.rodada, caixas, trocas)
        : {},
    [
      e.pais,
      e.semente,
      e.rodada,
      JSON.stringify(chapa),
      JSON.stringify(caixas),
      JSON.stringify(trocas),
    ],
  );

  const podeSeguir = [
    true,
    motivoDoPartido(e, preparo.partidos) === null,
    chapa !== null,
    true,
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
        caixas,
        ministros,
      },
      {
        semCongresso: e.semCongresso,
        semSenado: e.semSenado,
        comJudiciario: e.comJudiciario,
      },
    );
  };

  /** Cheat "pular": começa já, com partido de teste e a chapa sugerida. */
  const pular = () => {
    const sugerida = chapaSugerida(e.pais, e.semente);
    onComecar(
      e.pais,
      e.semente,
      {
        partido: PARTIDO_DE_TESTE,
        chapa: sugerida,
        ministros: ministrosSugeridos(e.pais, e.semente, sugerida),
      },
      {
        semCongresso: e.semCongresso,
        semSenado: e.semSenado,
        comJudiciario: e.comJudiciario,
      },
    );
  };

  useCheats((cheat) => {
    if (cheat === "pular") return pular();
    mudar({ semSenado: !e.semSenado });
    avisarDoTeste(e.semSenado ? "Senado ligado" : "Senado desligado (teste)");
  });

  const sugerirChapa = () => {
    const s = chapaSugerida(e.pais, e.semente);
    mudar({ chapa: s });
  };

  return (
    <div className="inicio">
      <div className="ini-quadro">
        {(e.semSenado || avisoDeTeste) && (
          <span className="ini-teste-aviso">
            {avisoDeTeste || "Teste: sem Senado"}
          </span>
        )}
        {passo < 0 ? (
          <div className="ini-abertura">
            <span className="ini-selo ini-selo-titulo">SisGov</span>
            <p className="ini-lema">Governe um país e responda nas urnas.</p>
            <button
              className="placa-ferro placa-ferro-grande"
              onClick={() => setPasso(0)}
            >
              Novo mandato
            </button>
            <button
              className="placa-ferro"
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
                    className="placa-ferro placa-ferro-pequena ini-sugerir"
                    onClick={sugerirChapa}
                  >
                    Sugerir uma chapa
                  </button>
                </>
              )}
              {passo === 3 && (
                <EtapaGoverno
                  e={e}
                  mudar={mudar}
                  caixas={caixas}
                  contagem={contagem}
                />
              )}
              {passo === 4 && (
                <EtapaMinisterios
                  e={e}
                  mudar={mudar}
                  preparo={preparo}
                  caixas={caixas}
                  ministros={ministros}
                  onTrocar={(caixa, pessoa) =>
                    mudar({ trocas: trocarMinistro(ministros, caixa, pessoa) })
                  }
                />
              )}
              {passo === 5 && (
                <EtapaIniciar e={e} mudar={mudar} preparo={preparo} />
              )}
            </div>
            <footer className="ini-rodape">
              <button
                className="placa-ferro"
                onClick={() => setPasso(passo === 0 ? -1 : passo - 1)}
              >
                Voltar
              </button>
              {aviso && <span className="ini-aviso-da-mesa">{aviso}</span>}
              {passo < ETAPAS.length - 1 ? (
                <button
                  className="placa-ferro placa-ferro-grande"
                  disabled={!podeSeguir}
                  onClick={() => setPasso(passo + 1)}
                >
                  Seguir
                </button>
              ) : (
                <button
                  className="placa-ferro placa-ferro-grande"
                  onClick={comecar}
                >
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
