/**
 * Régua da lei (leis com controle deslizante): a escala com faixas, a marca
 * de hoje e a da nova redação (ou do índice no horizonte da prévia), a frase
 * do estado e os valores em dinheiro. Os efeitos ficam no relatório ao lado.
 */
import type { ReactNode } from "react";
import { moeda, nivelDaLei } from "./formatos";
import {
  faixaDe,
  casasPara,
  marcasDaEscala,
  notaDoPais,
  referenciasDoPais,
  valorDaLeiNaRegua,
  valorDerivado,
  type LeituraDerivada,
  type Regua,
  type PrevisaoLei,
  type Tom,
  type VisaoBolha,
  type VisaoLei,
} from "../../app/partida";
import { efeitoDe, type Efeito } from "./relacoes";

// Desenho da régua, em unidades do viewBox.
const LARGURA = 480;
const ALTURA = 104;
const MARGEM = 22;
const TOPO_DA_FAIXA = 34;
const ALTURA_DA_FAIXA = 14;
const FIM_DO_TRACO = 54;
const LINHA_DAS_MARCAS = 68;
const LINHA_DO_HOJE = 22;
const INICIO_DO_HOJE = 28;
const PONTA_DA_SETA = 80;
const BASE_DA_SETA = 92;
const MEIA_SETA = 7;
const LINHA_DA_NOVA = 104;
const INICIO_DA_NOVA = 30;

const CASAS_DO_NUMERO = 2;

const numero = (valor: number, casas = 1): string =>
  valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: casas,
  });

const reais = (valor: number): string =>
  `R$ ${Math.round(valor).toLocaleString("pt-BR")}`;

const COR_DO_TOM: Readonly<Record<Tom, string>> = {
  bom: "var(--regua-bom)",
  atencao: "var(--regua-atencao)",
  ruim: "var(--regua-ruim)",
};

const CLASSE_DO_EFEITO: Readonly<Record<Efeito, string>> = {
  melhora: "melhora",
  piora: "piora",
  neutro: "",
};

type Props = Readonly<{
  regua: Regua;
  lei: VisaoLei;
  rascunho: number;
  mudou: boolean;
  previsao: PrevisaoLei | null;
  mes: number;
  bolhas: ReadonlyMap<string, VisaoBolha>;
  pib: number;
  pais: string;
  /** "em 1 ano", "no próximo turno". */
  quando: string;
  /** A prévia está sendo calculada. */
  calculando: boolean;
}>;

/** Valor de um índice no horizonte, com e sem a mudança (null sem prévia). */
function noHorizonte(
  previsao: PrevisaoLei | null,
  id: string,
  mes: number,
): Readonly<{ com: number; sem: number }> | null {
  const efeito = previsao?.efeitos.find((e) => e.id === id);
  if (!efeito || !efeito.comMudanca.length) return null;
  const i = Math.min(mes, efeito.comMudanca.length - 1);
  return { com: efeito.comMudanca[i], sem: efeito.semMudanca[i] };
}

function formatoDaRegua(regua: Regua, lei: VisaoLei, valor: number): string {
  if (regua.mede === "pib") return `${numero(valor, casasPara(valor))}% do PIB`;
  if (regua.mede === "controle") return nivelDaLei(valor, lei.unidade);
  return `${numero(valor, 0)}${regua.sufixo ?? ""}`;
}

function rotuloDaMarca(regua: Regua, lei: VisaoLei, valor: number): string {
  if (regua.mede === "controle" && lei.unidade === "moeda_ano")
    return moeda(valor);
  const sufixo = regua.mede === "variavel" ? (regua.sufixo ?? "") : "%";
  return `${numero(valor, casasPara(valor))}${sufixo}`;
}

export function ReguaDaLei({
  regua,
  lei,
  rascunho,
  mudou,
  previsao,
  mes,
  bolhas,
  pib,
  pais,
  quando,
  calculando,
}: Props) {
  const [minimo, maximo] = regua.escala;
  const xDe = (valor: number): number =>
    MARGEM +
    ((Math.max(minimo, Math.min(maximo, valor)) - minimo) /
      (maximo - minimo || 1)) *
      (LARGURA - MARGEM - MARGEM);

  const indiceDaRegua = regua.variavel ?? "";
  const hoje =
    regua.mede === "variavel"
      ? (bolhas.get(indiceDaRegua)?.valor ?? 0)
      : valorDaLeiNaRegua(regua, lei.nivel, pib);
  const projetado = noHorizonte(previsao, indiceDaRegua, mes);
  const depois = ((): number | null => {
    if (!mudou) return null;
    if (regua.mede !== "variavel")
      return valorDaLeiNaRegua(regua, rascunho, pib);
    return projetado?.com ?? null;
  })();
  const rotuloDepois = regua.mede === "variavel" ? quando : "nova lei";
  const referencia = depois ?? hoje;
  const faixa = faixaDe(regua, referencia);

  const faixas = regua.faixas.map((f, i) => {
    const inicio = i === 0 ? minimo : regua.faixas[i - 1].ate;
    return (
      <rect
        key={`f${i}`}
        x={xDe(inicio)}
        y={TOPO_DA_FAIXA}
        width={Math.max(0, xDe(f.ate) - xDe(inicio))}
        height={ALTURA_DA_FAIXA}
        fill={COR_DO_TOM[f.tom]}
      >
        <title>{f.rotulo}</title>
      </rect>
    );
  });
  const marcas = marcasDaEscala(minimo, maximo).map((m) => (
    <g key={`m${m}`}>
      <line
        x1={xDe(m)}
        y1={TOPO_DA_FAIXA + ALTURA_DA_FAIXA}
        x2={xDe(m)}
        y2={FIM_DO_TRACO}
        stroke="var(--tinta-suave)"
      />
      <text
        x={xDe(m)}
        y={LINHA_DAS_MARCAS}
        textAnchor="middle"
        className="regua-marca"
      >
        {rotuloDaMarca(regua, lei, m)}
      </text>
    </g>
  ));

  const xHoje = xDe(hoje);
  const xDepois = depois === null ? null : xDe(depois);

  const frase = ((): string => {
    const texto = formatoDaRegua(regua, lei, referencia);
    if (depois === null) return `Hoje: ${texto}, ${faixa.rotulo}.`;
    const mesmaFaixa = faixaDe(regua, hoje) === faixa;
    const comparacao = mesmaFaixa ? "na mesma faixa de hoje" : "muda de faixa";
    const abertura =
      regua.mede === "variavel"
        ? `${quando.charAt(0).toUpperCase()}${quando.slice(1)}`
        : "Com a nova lei";
    return `${abertura}: ${texto}, ${faixa.rotulo} (${comparacao}).`;
  })();

  const referencias = referenciasDoPais(pais);
  const nota = notaDoPais(pais, lei.id);
  const cartoes: ReactNode[] = [];

  (regua.leituras ?? []).forEach((leitura) => {
    cartoes.push(
      <CartaoDerivado
        key={leitura.rotulo}
        leitura={leitura}
        hoje={bolhas.get(leitura.de)?.valor ?? null}
        depois={
          mudou ? (noHorizonte(previsao, leitura.de, mes)?.com ?? null) : null
        }
        referencias={referencias}
        quando={quando}
      />,
    );
  });

  const alerta =
    regua.alerta && mudou
      ? noHorizonte(previsao, regua.alerta.variavel, mes)
      : null;
  const mostraAlerta =
    !!regua.alerta && !!alerta && alerta.com < regua.alerta.abaixoDe;

  return (
    <section className="regua-lei" aria-label={regua.rotulo}>
      <h3 className="regua-titulo">{regua.rotulo}</h3>
      <div className="regua-corpo">
        <svg
          viewBox={`0 0 ${LARGURA} ${ALTURA + MEIA_SETA}`}
          role="img"
          aria-label={frase}
        >
          {faixas}
          {marcas}
          <line
            x1={xHoje}
            y1={INICIO_DO_HOJE}
            x2={xHoje}
            y2={FIM_DO_TRACO}
            stroke="var(--tinta)"
            strokeWidth={2}
            strokeDasharray="3 2"
          />
          <text
            x={xHoje}
            y={LINHA_DO_HOJE}
            textAnchor="middle"
            className="regua-hoje"
          >
            hoje {rotuloDaMarca(regua, lei, hoje)}
          </text>
          {xDepois !== null && depois !== null ? (
            <g className="regua-nova">
              <path
                d={`M${xDepois - MEIA_SETA} ${BASE_DA_SETA} L${xDepois + MEIA_SETA} ${BASE_DA_SETA} L${xDepois} ${PONTA_DA_SETA} Z`}
              />
              <line
                x1={xDepois}
                y1={INICIO_DA_NOVA}
                x2={xDepois}
                y2={PONTA_DA_SETA}
              />
              <text x={xDepois} y={LINHA_DA_NOVA} textAnchor="middle">
                {rotuloDepois} {rotuloDaMarca(regua, lei, depois)}
              </text>
            </g>
          ) : null}
        </svg>
      </div>
      <p className="regua-estado">
        <i style={{ background: COR_DO_TOM[faixa.tom] }} aria-hidden="true" />
        {frase}
      </p>
      {mostraAlerta && regua.alerta ? (
        <p className="regua-alerta" role="alert">
          {regua.alerta.texto}
        </p>
      ) : null}
      {cartoes.length ? <div className="regua-cartoes">{cartoes}</div> : null}
      {mudou && calculando && !previsao ? (
        <p className="regua-nota">Calculando o que muda…</p>
      ) : null}
      {nota ? <p className="regua-nota">No país: {nota}</p> : null}
      <p className="regua-fonte" title={regua.fonte}>
        Faixas: {regua.fonte}
      </p>
    </section>
  );
}

function CartaoDerivado({
  leitura,
  hoje,
  depois,
  referencias,
  quando,
}: Readonly<{
  leitura: LeituraDerivada;
  hoje: number | null;
  depois: number | null;
  referencias: Readonly<Record<string, number>>;
  quando: string;
}>) {
  if (hoje === null) return null;
  const valorHoje = valorDerivado(leitura, hoje, referencias);
  if (valorHoje === null) return null;
  const valorDepois =
    depois === null ? null : valorDerivado(leitura, depois, referencias);
  const mostrar = (v: number): string =>
    leitura.formato === "moeda" ? reais(v) : numero(v, CASAS_DO_NUMERO);
  const delta = valorDepois === null ? 0 : valorDepois - valorHoje;
  const classe =
    delta === 0
      ? ""
      : CLASSE_DO_EFEITO[efeitoDe(Math.sign(delta), "maior_melhor")];
  return (
    <div className="regua-cartao">
      <span className="regua-cartao-rotulo">{leitura.rotulo}</span>
      <span className="regua-cartao-numero">
        {mostrar(valorDepois ?? valorHoje)}
      </span>
      <span
        className={`regua-cartao-mudanca ${valorDepois === null ? "" : classe}`}
      >
        {valorDepois === null
          ? "hoje"
          : `hoje ${mostrar(valorHoje)} · ${quando}`}
      </span>
    </div>
  );
}
