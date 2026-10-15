/**
 * Documentos da seleção: a lei abre como um papel oficial (proposta de
 * alteração, com relatório de impacto e assinatura); o indicador abre como
 * um boletim. A janela flutua sobre o mapa, pode ser arrastada e não cobre
 * o mapa inteiro.
 */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as PointerEventReact,
  type ReactNode,
} from "react";
import {
  BOLHAS_DO_ORCAMENTO,
  type OpcoesDoEnvio,
  type PrevisaoLei,
  type RelatorioTurno,
  type VisaoBolha,
  type VisaoLei,
  type VisaoPartida,
  type VisaoQueda,
} from "../../app/partida";
import {
  NOME_GRUPO,
  atraso,
  moeda,
  nivelDaLei,
  diferencaNaTela,
  valorDaBolha,
  valorNaTela,
  variacaoReal,
} from "./formatos";
import { Icone } from "./Icone";
import { ICONE_BOLHA, ICONE_INTERFACE, ICONE_LEI } from "./icones";
import { corDaBondade, intensidadeDaBolha } from "./intensidade";
import { ficaNaPresidencia, type BaseMapa } from "./layout";

/** O caminho da lei no Congresso (V1-12). */
/** As camadas da mesa (V1-34, leis-em-camadas.md). */
const NOME_DA_CAMADA: Readonly<Record<string, string>> = {
  constituicao: "Constituição: quem decide",
  lei: "Lei: a regra",
  alavanca: "Alavanca: o valor",
};

const NOME_CAMINHO: Readonly<Record<string, string>> = {
  "lei-ordinaria": "lei ordinária (maioria dos votos)",
  "lei-complementar": "lei complementar (maioria absoluta)",
  emenda: "emenda à Constituição (3/5, dois turnos em cada casa)",
};

const NOME_NIVEL_LEGAL: Readonly<Record<string, string>> = {
  petrea: "Cláusula pétrea",
  constitucional: "Constitucional · PEC (60%)",
  derivada: "Lei derivada",
};
import {
  efeitoDe,
  type Efeito,
  type IndiceRelacoes,
  type Relacao,
} from "./relacoes";
import { COR_EFEITO } from "./tema";

export type Horizonte = "turno" | "ano";

/** Mês da série da prévia que corresponde a cada horizonte. */
export const MES_DO_HORIZONTE: Readonly<Record<Horizonte, number>> = {
  turno: 2,
  ano: 11,
};

/** Diferença mínima (fração da escala) para contar como efeito. */
const LIMIAR_EFEITO = 0.0005;

// ---------------------------------------------------------------------------
// Papel, timbre e selo
// ---------------------------------------------------------------------------

function Selo({ icone, cor }: { icone: string; cor: string }) {
  const estrelas = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return { x: 32 + Math.cos(a) * 25, y: 32 + Math.sin(a) * 25 };
  });
  return (
    <svg viewBox="0 0 64 64" className="selo" aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="#fffaf0"
        stroke="#b8933f"
        strokeWidth="2.5"
      />
      <circle cx="32" cy="32" r="21" fill={cor} />
      {estrelas.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.6" fill="#b8933f" />
      ))}
      <g transform="translate(20 20)">
        <Icone nome={icone} tamanho={24} />
      </g>
    </svg>
  );
}

/** Deslocamento da janela a partir do centro da tela, em pixels. */
export type Desvio = Readonly<{ x: number; y: number }>;

/** Retângulo da janela, relativo à área do mapa. */
export type Retangulo = Readonly<{
  left: number;
  top: number;
  right: number;
  bottom: number;
}>;

/** Comportamento comum de janela: posição, arraste e retângulo ocupado. */
export type JanelaProps = Readonly<{
  desvio: Desvio;
  onDesvio: (d: Desvio) => void;
  onRetangulo: (r: Retangulo | null) => void;
  /** Ordem de empilhamento (maior = mais na frente). */
  camada: number;
  /** Janela da frente (a que o mapa destaca). */
  ativa: boolean;
  /** Clicar em qualquer parte traz a janela para a frente. */
  onFocar: () => void;
}>;

/** Quanto da janela precisa continuar visível ao arrastar para a borda. */
const SOBRA_VISIVEL = 140;

function Documento({
  orgao,
  setor,
  numero,
  cor,
  icone,
  onFechar,
  rodape,
  children,
  rotulo,
  duplo = false,
  desvio,
  onDesvio,
  onRetangulo,
  camada,
  ativa,
  onFocar,
}: JanelaProps & {
  orgao: string;
  setor: string;
  numero: string;
  cor: string;
  icone: string;
  onFechar: () => void;
  rodape?: ReactNode;
  children: ReactNode;
  rotulo: string;
  /** Duas páginas lado a lado, como uma pasta aberta (V1-36). */
  duplo?: boolean;
}) {
  const janela = useRef<HTMLElement>(null);
  const arraste = useRef<{
    x: number;
    y: number;
    dx: number;
    dy: number;
  } | null>(null);

  // Informa ao mapa onde a janela está (para não esconder a seleção).
  const medir = () => {
    const el = janela.current;
    const pai = el?.parentElement;
    if (!el || !pai) return;
    const r = el.getBoundingClientRect();
    const p = pai.getBoundingClientRect();
    onRetangulo({
      left: r.left - p.left,
      top: r.top - p.top,
      right: r.right - p.left,
      bottom: r.bottom - p.top,
    });
  };
  useEffect(() => {
    medir();
    const el = janela.current;
    const observador = new ResizeObserver(medir);
    if (el?.parentElement) observador.observe(el.parentElement);
    return () => {
      observador.disconnect();
      onRetangulo(null);
    };
    // mede ao abrir; o arraste mede ao soltar
  }, []);

  /** Mantém pelo menos um pedaço da janela (e o timbre) dentro da tela. */
  const prender = (x: number, y: number): Desvio => {
    const el = janela.current;
    const pai = el?.parentElement;
    if (!el || !pai) return { x, y };
    const largura = el.offsetWidth;
    const altura = el.offsetHeight;
    const meiaW = pai.clientWidth / 2;
    const meiaH = pai.clientHeight / 2;
    const maxX = meiaW + largura / 2 - SOBRA_VISIVEL;
    const maxYbaixo = meiaH + altura / 2 - 70;
    const maxYcima = meiaH - altura / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxYbaixo, Math.max(-maxYcima, y)),
    };
  };

  const pegar = (e: PointerEventReact<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    arraste.current = {
      x: e.clientX,
      y: e.clientY,
      dx: desvio.x,
      dy: desvio.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    janela.current?.classList.add("arrastando");
  };
  const mover = (e: PointerEventReact<HTMLElement>) => {
    const a = arraste.current;
    if (!a) return;
    onDesvio(prender(a.dx + e.clientX - a.x, a.dy + e.clientY - a.y));
  };
  const soltar = () => {
    if (!arraste.current) return;
    arraste.current = null;
    janela.current?.classList.remove("arrastando");
    requestAnimationFrame(medir);
  };
  return (
    <aside
      ref={janela}
      className={`documento${duplo ? " duplo" : ""}${ativa ? " ativa" : ""}`}
      role="dialog"
      aria-label={rotulo}
      style={
        {
          "--cor": cor,
          "--dx": `${desvio.x}px`,
          "--dy": `${desvio.y}px`,
          zIndex: 10 + camada,
        } as CSSProperties
      }
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (!ativa) onFocar();
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="papel">
        <header
          className="timbre"
          onPointerDown={pegar}
          onPointerMove={mover}
          onPointerUp={soltar}
          onPointerCancel={soltar}
          onDoubleClick={() => {
            onDesvio({ x: 0, y: 0 });
            requestAnimationFrame(medir);
          }}
          title="Arraste para mover o documento · clique duas vezes para centralizar"
        >
          <span className="pegador" aria-hidden="true" />
          <Selo icone={icone} cor={cor} />
          <div className="timbre-texto">
            <strong>{orgao}</strong>
            <span>{setor}</span>
          </div>
          <span className="numero-doc">{numero}</span>
          <button
            type="button"
            className="fechar-doc"
            onClick={onFechar}
            aria-label="Fechar documento"
          >
            <Icone nome={ICONE_INTERFACE.fechar} tamanho={20} />
          </button>
        </header>
        <div className="papel-corpo">{children}</div>
        {rodape ? <footer className="despacho">{rodape}</footer> : null}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Peças do relatório de impacto
// ---------------------------------------------------------------------------

type ItemImpacto = Readonly<{
  id: string;
  nome: string;
  icone: string;
  delta: number;
  unidade: string;
  relativo: number;
  efeito: Efeito;
  atual: string;
  detalhe: string;
}>;

function Abas({
  horizonte,
  onHorizonte,
}: {
  horizonte: Horizonte;
  onHorizonte: (h: Horizonte) => void;
}) {
  return (
    <div className="abas" role="tablist" aria-label="Horizonte da previsão">
      {(["turno", "ano"] as const).map((h) => (
        <button
          key={h}
          type="button"
          role="tab"
          aria-selected={horizonte === h}
          className={horizonte === h ? "ativa" : ""}
          onClick={() => onHorizonte(h)}
        >
          {h === "turno" ? "Próximo turno" : "Em 1 ano"}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Documento da lei
// ---------------------------------------------------------------------------

/** "A, B ou C" */
function listaOu(itens: readonly string[]): string {
  if (itens.length <= 1) return itens.join("");
  return `${itens.slice(0, -1).join(", ")} ou ${itens.at(-1)}`;
}

function faixaNumerica(lei: VisaoLei) {
  const min = lei.minimo ?? 0;
  const referencia = Math.max(lei.nivel, lei.meta);
  if (lei.unidade === "moeda_ano") {
    // o teto é o mesmo que a partida aceita (SG159); sem teto, 3× o atual
    const max = lei.maximo ?? Math.max(1000, referencia * 3);
    const passo = Math.pow(10, Math.floor(Math.log10(max / 200)));
    return { min, max, passo };
  }
  const teto = lei.maximo ?? 100;
  if (lei.unidade === "percentual_receita")
    return { min, max: teto, passo: 0.1 };
  const max = Math.min(teto, Math.max(2, referencia * 4));
  return { min, max, passo: max <= 5 ? 0.01 : max <= 30 ? 0.1 : 0.5 };
}

export function DocumentoLei({
  lei,
  visao,
  base,
  indice,
  rascunho,
  onRascunho,
  previsao,
  quedas = [],
  calculando,
  erro,
  horizonte,
  onHorizonte,
  onAssinar,
  onRevogar,
  onFechar,
  onSelecionar,
  ...janela
}: JanelaProps & {
  lei: VisaoLei;
  visao: VisaoPartida;
  base: BaseMapa;
  indice: IndiceRelacoes;
  rascunho: number;
  onRascunho: (valor: number) => void;
  previsao: PrevisaoLei | null;
  /** Leis filhas que cairiam com esta redação (SG138). */
  quedas?: readonly VisaoQueda[];
  calculando: boolean;
  erro: string | null;
  horizonte: Horizonte;
  onHorizonte: (h: Horizonte) => void;
  /** Com Congresso (modo real), as opções do envio vêm junto. */
  onAssinar: (opcoes?: OpcoesDoEnvio) => void;
  /** Revogar a lei (D-65): ausente se ela não pode sair do mapa. */
  onRevogar?: () => void;
  onFechar: () => void;
  onSelecionar: (id: string) => void;
}) {
  const bolhas = useMemo(
    () => new Map(visao.bolhas.map((b) => [b.id, b])),
    [visao],
  );
  const ministerio = base.porNome.get(lei.areas[0]);
  const cor = ministerio?.cor ?? "#666";
  const relacoes = indice.porNo.get(lei.id) ?? [];
  const efeitosDiretos = relacoes.filter((r) => r.de === lei.id);
  // fora do mapa (catálogo), qualquer opção escolhida é uma lei nova
  const mudou = !lei.emVigor || Math.abs(rascunho - lei.meta) > 1e-9;
  const constitucional = ficaNaPresidencia(lei);
  // três níveis: pétrea ou exigência não cumprida trancam a lei inteira
  const travada = !!lei.nivelLegal && !!lei.bloqueio;
  const numero = `Nº ${String(visao.leis.indexOf(lei) + 1).padStart(3, "0")}/${2026 + Math.floor(visao.turno / 4)}`;
  const [carimbo, setCarimbo] = useState(false);
  // V1-12: a lei que precisa de votação vai ao Congresso
  const congresso = lei.congresso;
  const [pressa, setPressa] = useState<"normal" | "urgencia" | "emergencia">(
    "normal",
  );
  const [provisoria, setProvisoria] = useState(false);
  const secaoImpacto = useRef<HTMLElement>(null);
  // Ao marcar uma nova redação, o papel rola até o relatório de impacto.
  useEffect(() => {
    if (mudou)
      secaoImpacto.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [mudou]);
  const temporizadores = useRef<number[]>([]);
  useEffect(() => () => temporizadores.current.forEach(clearTimeout), []);

  const mes = MES_DO_HORIZONTE[horizonte];
  const itens: ItemImpacto[] = useMemo(() => {
    if (!previsao) return [];
    const diretos = new Map(efeitosDiretos.map((r) => [r.para, r]));
    return previsao.efeitos
      .map((e): ItemImpacto | null => {
        const i = Math.min(mes, e.comMudanca.length - 1);
        const delta = e.comMudanca[i] - e.semMudanca[i];
        const b = bolhas.get(e.id);
        const amplitude = b ? b.maximo - b.minimo || 1 : 100;
        const relativo = Math.abs(delta) / amplitude;
        if (relativo < LIMIAR_EFEITO) return null;
        const direta = diretos.get(e.id);
        return {
          id: e.id,
          nome: e.nome,
          icone: ICONE_BOLHA[e.id] ?? "chart-line",
          delta,
          unidade: e.unidade,
          relativo,
          efeito: efeitoDe(Math.sign(delta), e.avaliacao),
          atual: valorDaBolha(e.atual, e.unidade),
          detalhe: direta
            ? `efeito direto${direta.atrasoMeses ? `, ${atraso(direta.atrasoMeses)}` : ""}`
            : "efeito em cadeia",
        };
      })
      .filter((x): x is ItemImpacto => x !== null)
      .sort((a, b) => b.relativo - a.relativo);
  }, [previsao, mes, bolhas, efeitosDiretos]);

  // Efeito no resultado (receita − gasto − juros), em moeda por ano.
  const efeitoContas = useMemo(() => {
    const e = previsao?.efeitos.find(
      (x) => x.id === BOLHAS_DO_ORCAMENTO.resultado,
    );
    if (!e) return null;
    const i = Math.min(mes, e.comMudanca.length - 1);
    return ((e.comMudanca[i] - e.semMudanca[i]) * visao.contas.pib) / 100;
  }, [previsao, mes, visao.contas.pib]);

  const assinar = () => {
    setCarimbo(true);
    temporizadores.current.push(
      window.setTimeout(
        () =>
          onAssinar(
            congresso ? { pressa, medidaProvisoria: provisoria } : undefined,
          ),
        650,
      ),
      window.setTimeout(() => setCarimbo(false), 1500),
    );
  };

  const opcoes = lei.opcoes ?? [];
  const bloqueadaNoIndice = (i: number) =>
    travada ||
    !!opcoes[i].trava ||
    (!!lei.exige && !lei.exige.atendida && i > 0);
  // opção mais perto do rascunho (a lei fora do mapa começa na primeira)
  const indiceAtual = opcoes.length
    ? opcoes.reduce(
        (melhor, o, i) =>
          Math.abs(o.valor - rascunho) <
          Math.abs(opcoes[melhor].valor - rascunho)
            ? i
            : melhor,
        0,
      )
    : -1;
  const camada = lei.mesa?.camada;
  // efeitos curtos: só nomes de índices com a barrinha que sobe ou desce
  const linhasDeEfeito = mudou
    ? itens.slice(0, 12).map((i) => ({
        id: i.id,
        nome: i.nome,
        icone: i.icone,
        delta: i.delta,
        relativo: i.relativo,
        efeito: i.efeito,
      }))
    : efeitosDiretos
        .filter((r) => !r.eficacia)
        .slice(0, 12)
        .map((r) => ({
          id: r.para,
          nome: bolhas.get(r.para)?.nome ?? r.para,
          icone: ICONE_BOLHA[r.para] ?? "chart-line",
          delta: 0,
          relativo: 0,
          efeito: r.efeito,
        }));
  const resumo = (texto: string) => {
    const t = texto.replace(/\s+/g, " ").trim();
    const fim = t.search(/[.?!](\s|$)/);
    const frase = fim > 0 ? t.slice(0, fim + 1) : t;
    return frase.length > 190 ? `${frase.slice(0, 187)}…` : frase;
  };
  const avisos: ReactNode[] = [];
  if (travada && lei.exigencias.every((e) => e.atendida))
    avisos.push(
      <p key="b" className="aviso-folha trava" role="note">
        <Icone nome={ICONE_INTERFACE.cadeado} tamanho={16} />
        {lei.bloqueio}
      </p>,
    );
  const exigencias = lei.nivelLegal
    ? lei.exigencias
    : lei.exige
      ? [{ ...lei.exige }]
      : [];
  for (const exige of exigencias)
    avisos.push(
      <button
        key={`e-${exige.lei}`}
        type="button"
        className={`aviso-folha dep${exige.atendida ? "" : " fora"}`}
        title={`Depende de ${exige.nome} em ${listaOu(exige.opcoes)}${exige.motivo ? `: ${exige.motivo}` : ""}`}
        onClick={() => onSelecionar(exige.lei)}
      >
        <Icone nome={ICONE_INTERFACE.vinculo} tamanho={16} />
        {exige.atendida
          ? `Depende de ${exige.nome}`
          : `Falta ${exige.nome} (${listaOu(exige.opcoes)})`}
      </button>,
    );
  if (quedas.length)
    avisos.push(
      <p key="q" className="aviso-folha queda" role="alert">
        <Icone nome={ICONE_INTERFACE.vinculoQuebrado} tamanho={16} />
        Cai junto:{" "}
        {quedas.map((q, i) => (
          <button key={q.id} type="button" onClick={() => onSelecionar(q.id)}>
            {i ? ", " : ""}
            {q.nome}
          </button>
        ))}
      </p>,
    );

  return (
    <Documento
      duplo
      orgao={lei.ministerios[0]}
      setor={lei.emVigor ? "Alterar lei" : "Nova lei"}
      numero={numero}
      cor={cor}
      icone={ICONE_LEI[lei.id] ?? ICONE_INTERFACE.lei}
      onFechar={onFechar}
      rotulo={`Folha da lei ${lei.nome}`}
      {...janela}
      rodape={
        <div className="acoes-doc">
          {onRevogar ? (
            <button
              type="button"
              className="botao-revogar"
              title="A lei sai do mapa e volta para as leis fora do mapa"
              onClick={onRevogar}
            >
              <Icone nome={ICONE_INTERFACE.revogar} tamanho={18} />
              Revogar
            </button>
          ) : null}
          <button
            type="button"
            className="botao-arquivar"
            disabled={!mudou || !lei.emVigor}
            onClick={() => onRascunho(lei.meta)}
          >
            Desfazer
          </button>
          <button
            type="button"
            className="botao-assinar"
            disabled={
              !mudou ||
              carimbo ||
              travada ||
              !!congresso?.naFila ||
              (!lei.emVigor && !lei.opcoes?.length && rascunho <= 0)
            }
            onClick={assinar}
          >
            <Icone nome={ICONE_INTERFACE.assinar} tamanho={18} />
            {congresso
              ? "Enviar ao Congresso"
              : lei.emVigor
                ? "Assinar"
                : "Aprovar"}
          </button>
        </div>
      }
    >
      {carimbo ? (
        <div className="carimbo">
          {congresso ? "Enviado" : lei.emVigor ? "Assinado" : "Aprovada"}
        </div>
      ) : null}
      <div className="folha">
        <section className="pagina pagina-esquerda" aria-label="A lei">
          <p className="folha-tipo">
            {camada ? NOME_DA_CAMADA[camada] : NOME_GRUPO[lei.grupo]}
            {lei.nivelLegal ? ` · ${NOME_NIVEL_LEGAL[lei.nivelLegal]}` : ""}
            {constitucional ? " · § Presidência" : ""}
            {lei.alteradaPorVoce ? " · mudada por você" : ""}
          </p>
          <h1 className="titulo-doc">{lei.nome}</h1>
          {lei.descricao ? (
            <p className="folha-explica">{resumo(lei.descricao)}</p>
          ) : null}
          {avisos}
          {opcoes.length ? (
            <ControleEmDegraus
              opcoes={opcoes}
              indice={indiceAtual}
              vigente={lei.emVigor ? lei.opcaoAtual : undefined}
              bloqueada={bloqueadaNoIndice}
              motivo={(i) =>
                travada
                  ? lei.bloqueio
                  : opcoes[i].trava
                    ? opcoes[i].trava!.motivo
                    : lei.exige
                      ? `Exige ${lei.exige.nome} em ${listaOu(lei.exige.opcoes)}`
                      : undefined
              }
              onEscolher={(i) => onRascunho(opcoes[i].valor)}
              onSelecionar={onSelecionar}
            />
          ) : (
            <ControleNumerico
              lei={lei}
              valor={rascunho}
              onValor={onRascunho}
              receita={visao.contas.receita}
            />
          )}
          {congresso ? (
            <div className="cg-envio folha-congresso">
              {congresso.naFila ? (
                <p>
                  <span className="cg-selo">Na fila do Congresso</span>
                </p>
              ) : (
                <>
                  <div
                    className="urgencia"
                    role="radiogroup"
                    aria-label="Pressa"
                  >
                    {(
                      [
                        [
                          "normal",
                          "Normal",
                          "urgenciaNormal",
                          "Votação no ritmo normal",
                        ],
                        [
                          "urgencia",
                          "Urgência",
                          "urgenciaAlta",
                          "Passa à frente e irrita as bancadas",
                        ],
                        [
                          "emergencia",
                          "Emergência",
                          "urgenciaMaxima",
                          "Vota primeiro e irrita mais",
                        ],
                      ] as const
                    )
                      .filter(
                        ([nivel]) =>
                          nivel !== "urgencia" || congresso.tipo !== "emenda",
                      )
                      .map(([nivel, nome, icone, dica], i) => (
                        <button
                          key={nivel}
                          type="button"
                          role="radio"
                          aria-checked={pressa === nivel}
                          title={dica}
                          className={`nivel-urgencia n${i}${pressa === nivel ? " ativa" : ""}`}
                          onClick={() => setPressa(nivel)}
                        >
                          <Icone nome={ICONE_INTERFACE[icone]} tamanho={20} />
                          <span>{nome}</span>
                        </button>
                      ))}
                  </div>
                  {congresso.tipo === "lei-ordinaria" ? (
                    <button
                      type="button"
                      className={`botao-mp${provisoria ? " ligado" : ""}`}
                      aria-pressed={provisoria}
                      title="Vale já e cai se o Congresso rejeitar"
                      onClick={() => setProvisoria(!provisoria)}
                    >
                      <Icone
                        nome={ICONE_INTERFACE.medidaProvisoria}
                        tamanho={20}
                      />
                      Medida provisória
                    </button>
                  ) : null}
                  <small className="folha-caminho">
                    {NOME_CAMINHO[congresso.tipo] ?? congresso.tipo}
                  </small>
                </>
              )}
            </div>
          ) : null}
          {erro ? <p className="erro">{erro}</p> : null}
        </section>
        <span className="lombada" aria-hidden="true" />
        <section
          className="pagina pagina-direita impacto"
          aria-label="Efeitos"
          ref={secaoImpacto}
        >
          <div className="folha-efeitos-topo">
            <h2>Efeitos</h2>
            {mudou ? (
              <Abas horizonte={horizonte} onHorizonte={onHorizonte} />
            ) : null}
          </div>
          {mudou && calculando && !previsao ? (
            <p className="vazio">Simulando…</p>
          ) : null}
          {mudou && efeitoContas !== null && Math.abs(efeitoContas) >= 100 ? (
            <div className="efeito-linha contas">
              <Icone
                nome={
                  ICONE_BOLHA[BOLHAS_DO_ORCAMENTO.resultado] ?? "chart-line"
                }
                tamanho={20}
              />
              <span className="efeito-nome">Contas públicas</span>
              <MiniGrafico
                delta={efeitoContas}
                relativo={Math.min(
                  1,
                  (Math.abs(efeitoContas) / (visao.contas.pib || 1)) * 20,
                )}
                efeito={efeitoContas > 0 ? "melhora" : "piora"}
              />
            </div>
          ) : null}
          <ul className="efeitos-folha">
            {linhasDeEfeito.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  className="efeito-linha"
                  onClick={() => onSelecionar(l.id)}
                >
                  <Icone nome={l.icone} tamanho={20} />
                  <span className="efeito-nome">{l.nome}</span>
                  <MiniGrafico
                    delta={l.delta}
                    relativo={l.relativo}
                    efeito={l.efeito}
                  />
                </button>
              </li>
            ))}
          </ul>
          {!linhasDeEfeito.length && !(mudou && calculando) ? (
            <p className="vazio">Sem efeito visível.</p>
          ) : null}
          {lei.mesa ? (
            <nav className="mesa-folha" aria-label={`Mesa: ${lei.mesa.nome}`}>
              {lei.mesa.camadas.map((c) => (
                <button
                  key={c.lei}
                  type="button"
                  aria-current={c.lei === lei.id}
                  className={c.emVigor ? undefined : "fora"}
                  title={`${c.nome}: ${c.emVigor ? (c.opcao ?? "em vigor") : "fora de vigor"}`}
                  onClick={() => {
                    if (c.lei !== lei.id) onSelecionar(c.lei);
                  }}
                >
                  <small>{NOME_DA_CAMADA[c.camada]}</small>
                  <strong>{c.nome}</strong>
                </button>
              ))}
            </nav>
          ) : null}
        </section>
      </div>
    </Documento>
  );
}

/** Barrinha do efeito: sobe (melhora, verde) ou desce (piora, vermelho) da linha. */
function MiniGrafico({
  delta,
  relativo,
  efeito,
}: {
  delta: number;
  relativo: number;
  efeito: Efeito;
}) {
  const altura = delta === 0 ? 0 : 3 + Math.min(11, relativo * 160);
  return (
    <span className="mini-grafico" aria-hidden="true">
      <i className="linha-base" />
      {delta === 0 ? (
        <i className="barra neutra" />
      ) : (
        <i
          className={`barra ${delta > 0 ? "sobe" : "desce"}`}
          style={{
            height: `${altura}px`,
            background: COR_EFEITO[efeito],
          }}
        />
      )}
    </span>
  );
}

/** "Nome (detalhe)": o nome vai em destaque e o detalhe em letra pequena. */
function partirRotulo(rotulo: string): [string, string] {
  const m = rotulo.match(/^(.*?)\s*\(([^)]*)\)\s*(.*)$/);
  if (!m) return [rotulo, ""];
  const nome = `${m[1]} ${m[3]}`.trim();
  const detalhe = m[2].replace(/o país de referência/gi, "").trim();
  return [nome || rotulo, /^[\s\d–-]*$/.test(detalhe) ? "" : detalhe];
}

/** Deslizador com degraus: um pino por opção, do menor ao maior valor. */
function ControleEmDegraus({
  opcoes,
  indice,
  vigente,
  bloqueada,
  motivo,
  onEscolher,
  onSelecionar,
}: {
  opcoes: NonNullable<VisaoLei["opcoes"]>;
  indice: number;
  vigente: string | undefined;
  bloqueada: (i: number) => boolean;
  motivo: (i: number) => string | undefined;
  onEscolher: (i: number) => void;
  onSelecionar: (id: string) => void;
}) {
  const n = opcoes.length;
  const atual = opcoes[indice];
  const proporcao = n > 1 ? indice / (n - 1) : 0;
  // 2 opções: dois botões lado a lado; 3 ou mais: deslizador com degraus
  if (n <= 2)
    return (
      <div className="controle-folha" role="radiogroup" aria-label="Escolha">
        <div className="duas-opcoes">
          {opcoes.map((o, i) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={i === indice}
              disabled={bloqueada(i)}
              title={bloqueada(i) ? motivo(i) : undefined}
              className={i === indice ? "ativa" : ""}
              onClick={() => onEscolher(i)}
            >
              {partirRotulo(o.rotulo)[0]}
              {o.id === vigente ? <small>em vigor</small> : null}
            </button>
          ))}
        </div>
      </div>
    );
  return (
    <div className="controle-folha">
      <div className="degrau-atual" aria-live="polite">
        <strong>{partirRotulo(atual.rotulo)[0]}</strong>
        {atual.id === vigente ? <small>em vigor</small> : null}
        {atual.trava ? (
          <button
            type="button"
            className="trava-chip"
            title={atual.trava.motivo}
            onClick={() => onSelecionar(atual.trava!.lei)}
          >
            <Icone nome={ICONE_INTERFACE.cadeado} tamanho={14} />
            travada
          </button>
        ) : null}
      </div>
      {partirRotulo(atual.rotulo)[1] ? (
        <p className="degrau-detalhe">{partirRotulo(atual.rotulo)[1]}</p>
      ) : null}
      <div className="deslizador" style={{ "--p": proporcao } as CSSProperties}>
        <input
          type="range"
          min={0}
          max={n - 1}
          step={1}
          value={indice}
          aria-label="Nível da lei"
          aria-valuetext={atual.rotulo}
          onChange={(e) => {
            const i = Number(e.target.value);
            if (!bloqueada(i)) onEscolher(i);
          }}
        />
        <div className="degraus" aria-hidden="true">
          {opcoes.map((o, i) => (
            <i
              key={o.id}
              className={`${i <= indice ? "cheio" : ""}${bloqueada(i) ? " trancado" : ""}${o.id === vigente ? " vigente" : ""}`}
              title={o.rotulo}
            />
          ))}
        </div>
      </div>
      <div className="extremos">
        <span>{partirRotulo(opcoes[0].rotulo)[0]}</span>
        <span>{partirRotulo(opcoes[n - 1].rotulo)[0]}</span>
      </div>
      {Math.abs(atual.saldoAnual) >= 100 ? (
        <p
          className={`custo-folha ${atual.saldoAnual > 0 ? "arrecada" : "custa"}`}
        >
          {atual.saldoAnual > 0 ? "+" : "−"}
          {moeda(Math.abs(atual.saldoAnual))}/ano
        </p>
      ) : null}
    </div>
  );
}

function ControleNumerico({
  lei,
  valor,
  onValor,
  receita,
}: {
  lei: VisaoLei;
  valor: number;
  onValor: (v: number) => void;
  /** Receita anual, para mostrar quanto vale a parte vinculada (SG137). */
  receita: number;
}) {
  const { min, max, passo } = faixaNumerica(lei);
  return (
    <div className="controle-doc">
      <div className="controle-topo">
        <span>Novo valor</span>
        <strong>
          {nivelDaLei(valor, lei.unidade)}
          {lei.unidade === "percentual_receita" ? (
            <small> ≈ {moeda((valor / 100) * receita)}/ano</small>
          ) : null}
        </strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={passo}
        value={Math.min(max, valor)}
        onChange={(e) => onValor(Number(e.target.value))}
        aria-label={`Nível de ${lei.nome}`}
      />
      <div className="controle-escala">
        <span>{nivelDaLei(min, lei.unidade)}</span>
        <input
          type="number"
          min={min}
          max={lei.maximo}
          step={passo}
          value={Number(valor.toFixed(4))}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) onValor(v);
          }}
          aria-label="Valor exato"
          title={lei.unidade === "moeda_ano" ? "Em milhões por ano" : undefined}
        />
        <span>{nivelDaLei(max, lei.unidade)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Boletim do indicador
// ---------------------------------------------------------------------------

const NOME_TIPO: Readonly<Record<string, string>> = {
  calculado: "Indicador",
  estoque: "Indicador lento (acumula com o tempo)",
  situacao: "Situação",
  evento: "Evento",
  grupo: "Grupo social (satisfação)",
};

function Regua({ bolha }: { bolha: VisaoBolha }) {
  const i = intensidadeDaBolha(bolha);
  const amplitude = bolha.maximo - bolha.minimo || 1;
  const surge =
    bolha.entrada !== undefined && bolha.entrada > bolha.minimo
      ? (bolha.entrada - bolha.minimo) / amplitude
      : null;
  return (
    <div className="regua" aria-hidden="true">
      <div className="regua-trilha">
        <span
          className="regua-cheio"
          style={{
            width: `${i.t * 100}%`,
            background: corDaBondade(i.bondade),
          }}
        />
        {surge !== null ? (
          <span className="regua-surge" style={{ left: `${surge * 100}%` }} />
        ) : null}
      </div>
      <div className="regua-legenda">
        <span>{valorNaTela(bolha, bolha.minimo)}</span>
        {surge !== null ? (
          <span>surge em {valorNaTela(bolha, bolha.entrada!)}</span>
        ) : null}
        <span>{valorNaTela(bolha, bolha.maximo)}</span>
      </div>
    </div>
  );
}

export function DocumentoBolha({
  bolha,
  visao,
  base,
  indice,
  relatorio,
  variacao,
  onFechar,
  onSelecionar,
  ...janela
}: JanelaProps & {
  bolha: VisaoBolha;
  visao: VisaoPartida;
  base: BaseMapa;
  indice: IndiceRelacoes;
  relatorio: RelatorioTurno | null;
  variacao?: number;
  onFechar: () => void;
  onSelecionar: (id: string) => void;
}) {
  const leis = useMemo(
    () => new Map(visao.leis.map((l) => [l.id, l])),
    [visao],
  );
  const bolhas = useMemo(
    () => new Map(visao.bolhas.map((b) => [b.id, b])),
    [visao],
  );
  const relacoes = indice.porNo.get(bolha.id) ?? [];
  const causas = relacoes.filter((r) => r.para === bolha.id);
  const sobem = causas.filter((r) => r.sinal > 0);
  const descem = causas.filter((r) => r.sinal < 0);
  const consequencias = relacoes.filter((r) => r.de === bolha.id);
  const intensidade = intensidadeDaBolha(bolha);
  const d =
    variacao ??
    (() => {
      const m = relatorio?.mudancas.find((x) => x.id === bolha.id);
      return m ? m.depois - m.antes : undefined;
    })();
  const avaliacao =
    bolha.avaliacao === "maior_melhor"
      ? "Quanto maior, melhor"
      : bolha.avaliacao === "maior_pior"
        ? "Quanto maior, pior"
        : "Nem bom nem ruim em si";

  // SG106: um acontecimento em curso empurrando a bolha
  const cartaoOcorrencia = (r: Relacao, i: number) => (
    <div
      key={r.id}
      className={`cartao-impacto ${r.efeito} simples ocorrencia`}
      style={
        {
          "--cor-efeito": COR_EFEITO[r.efeito],
          animationDelay: `${i * 30}ms`,
        } as CSSProperties
      }
    >
      <span className="cartao-icone">
        <Icone nome={ICONE_INTERFACE.relogio} tamanho={20} />
      </span>
      <span className="cartao-texto">
        <strong>{r.ocorrencia!.nome}</strong>
        <small>Acontecimento em curso · passa com o tempo</small>
      </span>
    </div>
  );

  const cartaoCausa = (r: Relacao, i: number) => {
    if (r.ocorrencia) return cartaoOcorrencia(r, i);
    const lei = leis.get(r.de);
    const cor = COR_EFEITO[r.efeito];
    return (
      <button
        key={r.id}
        type="button"
        className={`cartao-impacto ${r.efeito} simples`}
        style={
          {
            "--cor-efeito": cor,
            animationDelay: `${i * 30}ms`,
          } as CSSProperties
        }
        onClick={() => onSelecionar(r.de)}
      >
        <span
          className="cartao-icone"
          style={
            lei
              ? ({
                  "--cor-efeito": base.porNome.get(lei.areas[0])?.cor,
                } as CSSProperties)
              : undefined
          }
        >
          <Icone
            nome={
              lei
                ? (ICONE_LEI[r.de] ?? ICONE_INTERFACE.lei)
                : (ICONE_BOLHA[r.de] ?? "chart-line")
            }
            tamanho={20}
          />
        </span>
        <span className="cartao-texto">
          <strong>{lei?.nome ?? bolhas.get(r.de)?.nome ?? r.de}</strong>
          <small>
            {lei
              ? `Lei · ${base.porNome.get(lei.areas[0])?.titulo ?? lei.ministerio}`
              : bolhas.get(r.de)?.tipo === "grupo"
                ? `Grupo social · satisfação ${Math.round(bolhas.get(r.de)!.valor)}`
                : "Indicador"}{" "}
            · {atraso(r.atrasoMeses)}
            {r.mecanismo === "limiar" ? " · além de um certo nível" : ""}
            {r.mecanismo === "produto" ? " · multiplica" : ""}
          </small>
        </span>
      </button>
    );
  };

  return (
    <Documento
      orgao="Secretaria de Monitoramento"
      setor="Boletim de acompanhamento"
      numero={`Turno ${visao.turno + 1}`}
      cor={corDaBondade(intensidade.bondade)}
      icone={ICONE_BOLHA[bolha.id] ?? "chart-line"}
      onFechar={onFechar}
      rotulo={`Boletim de ${bolha.nome}`}
      {...janela}
    >
      <p className="tipo-doc">{NOME_TIPO[bolha.tipo] ?? bolha.tipo}</p>
      <h1 className="titulo-doc">{bolha.nome}</h1>
      <div className="valor-boletim">
        <strong style={{ color: corDaBondade(intensidade.bondade) }}>
          {valorNaTela(bolha, bolha.valor)}
        </strong>
        {d !== undefined && Math.abs(d) >= 0.005 ? (
          <span
            className="etiqueta-variacao"
            style={{
              background:
                COR_EFEITO[
                  bolha.avaliacao === "neutra"
                    ? "neutro"
                    : efeitoDe(Math.sign(d), bolha.avaliacao)
                ],
            }}
          >
            {variacaoReal(bolha, d) > 0 ? "▲" : "▼"} {diferencaNaTela(bolha, d)}{" "}
            no último turno
          </span>
        ) : null}
      </div>
      {bolha.medida ? (
        <p className="nota medida-boletim">
          {bolha.medida.convertida ? `Em ${bolha.medida.unidade}. ` : ""}
          Fonte: {bolha.medida.fontes.join("; ")}.
        </p>
      ) : null}
      <Regua bolha={bolha} />
      <p className="nota">{avaliacao}.</p>
      {bolha.semVoce !== undefined &&
      Math.abs(bolha.valor - bolha.semVoce) /
        (bolha.maximo - bolha.minimo || 1) >=
        0.002 ? (
        <p className="sem-voce-boletim">
          <b>Sua marca:</b>{" "}
          {variacaoReal(bolha, bolha.valor - bolha.semVoce) > 0 ? "+" : "−"}
          {diferencaNaTela(bolha, Math.abs(bolha.valor - bolha.semVoce)).slice(
            1,
          )}
          . Sem as suas decisões, estaria em {valorNaTela(bolha, bolha.semVoce)}
          .
        </p>
      ) : null}
      {bolha.contexto !== undefined && Math.abs(bolha.contexto) >= 0.05 ? (
        <p className="contexto-boletim">
          <b>Contexto do {visao.cenario}:</b> {bolha.contexto > 0 ? "+" : "−"}
          {valorDaBolha(Math.abs(bolha.contexto), bolha.unidade)}. É a parte do
          valor que as leis e os outros indicadores não explicam: história,
          geografia, cultura. Não muda durante a partida.
        </p>
      ) : null}

      <section className="secao-doc">
        <h2>
          <span>I.</span> Empurram para cima{" "}
          <i className="contador">{sobem.length}</i>
        </h2>
        <div className="lista-cartoes">{sobem.map(cartaoCausa)}</div>
        {!sobem.length ? (
          <p className="vazio">Nada empurra este indicador para cima.</p>
        ) : null}
      </section>
      <section className="secao-doc">
        <h2>
          <span>II.</span> Empurram para baixo{" "}
          <i className="contador">{descem.length}</i>
        </h2>
        <div className="lista-cartoes">{descem.map(cartaoCausa)}</div>
        {!descem.length ? (
          <p className="vazio">Nada empurra este indicador para baixo.</p>
        ) : null}
      </section>
      {consequencias.length ? (
        <section className="secao-doc">
          <h2>
            <span>III.</span> Este indicador influencia
          </h2>
          <div className="fichas">
            {consequencias.map((r) => (
              <button
                key={r.id}
                type="button"
                className="ficha"
                onClick={() => onSelecionar(r.para)}
              >
                <Icone
                  nome={
                    leis.has(r.para)
                      ? (ICONE_LEI[r.para] ?? ICONE_INTERFACE.lei)
                      : (ICONE_BOLHA[r.para] ?? "chart-line")
                  }
                  tamanho={15}
                />
                {leis.get(r.para)?.nome ?? bolhas.get(r.para)?.nome ?? r.para}
                {r.eficacia ? <em>eficácia</em> : null}
                <i className={r.sinal > 0 ? "sobe" : "desce"}>
                  {r.sinal > 0 ? "▲" : "▼"}
                </i>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </Documento>
  );
}
