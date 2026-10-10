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
  type PrevisaoLei,
  type RelatorioTurno,
  type VisaoBolha,
  type VisaoLei,
  type VisaoPartida,
} from "../../app/partida";
import {
  NOME_GRUPO,
  NOME_PROCESSO,
  atraso,
  diferenca,
  moeda,
  nivelDaLei,
  valorDaBolha,
} from "./formatos";
import { Icone } from "./Icone";
import { ICONE_BOLHA, ICONE_INTERFACE, ICONE_LEI } from "./icones";
import { corDaBondade, intensidadeDaBolha } from "./intensidade";
import { ehConstitucional, type BaseMapa } from "./layout";
import {
  efeitoDe,
  type Efeito,
  type IndiceRelacoes,
  type Relacao,
} from "./relacoes";
import { COR_EFEITO, COR_PRESIDENCIA, nomeCurto } from "./tema";

export type Horizonte = "turno" | "ano";

/** Mês da série da prévia que corresponde a cada horizonte. */
export const MES_DO_HORIZONTE: Readonly<Record<Horizonte, number>> = {
  turno: 2,
  ano: 11,
};

const NOME_HORIZONTE: Readonly<Record<Horizonte, string>> = {
  turno: "no próximo turno",
  ano: "em 1 ano",
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
      className={`documento${ativa ? " ativa" : ""}`}
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
            <small>República Federativa do Brasil</small>
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

/** 1 a 5 marcas, pela fração da escala que mudou. */
function forca(relativo: number) {
  const degraus = [0.001, 0.005, 0.015, 0.04, 0.1];
  return Math.max(1, degraus.filter((d) => relativo >= d).length);
}

function Marcas({ quantas, cor }: { quantas: number; cor: string }) {
  return (
    <span className="marcas" aria-label={`força ${quantas} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} style={i < quantas ? { background: cor } : undefined} />
      ))}
    </span>
  );
}

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

function CartaoImpacto({
  item,
  ordem,
  onClick,
}: {
  item: ItemImpacto;
  ordem: number;
  onClick: () => void;
}) {
  const cor = COR_EFEITO[item.efeito];
  const sobe = item.delta > 0;
  return (
    <button
      type="button"
      className={`cartao-impacto ${item.efeito}`}
      style={
        {
          "--cor-efeito": cor,
          animationDelay: `${ordem * 40}ms`,
        } as CSSProperties
      }
      onClick={onClick}
    >
      <span className="cartao-icone">
        <Icone nome={item.icone} tamanho={22} />
        <span className="cartao-seta">
          <Icone
            nome={sobe ? ICONE_INTERFACE.subir : ICONE_INTERFACE.descer}
            tamanho={13}
          />
        </span>
      </span>
      <span className="cartao-texto">
        <strong>{item.nome}</strong>
        <small>
          agora {item.atual} · {item.detalhe}
        </small>
      </span>
      <span className="cartao-numeros">
        <b>{diferenca(item.delta, item.unidade)}</b>
        <Marcas quantas={forca(item.relativo)} cor={cor} />
      </span>
    </button>
  );
}

function Placar({ itens }: { itens: readonly ItemImpacto[] }) {
  const melhora = itens.filter((i) => i.efeito === "melhora").length;
  const piora = itens.filter((i) => i.efeito === "piora").length;
  const neutro = itens.length - melhora - piora;
  return (
    <div className="placar">
      <div className="placar-item melhora">
        <Icone nome={ICONE_INTERFACE.subir} tamanho={18} />
        <b>{melhora}</b>
        <span>melhoram</span>
      </div>
      <div className="placar-item piora">
        <Icone nome={ICONE_INTERFACE.descer} tamanho={18} />
        <b>{piora}</b>
        <span>pioram</span>
      </div>
      <div className="placar-item neutro">
        <b>{neutro}</b>
        <span>neutros</span>
      </div>
    </div>
  );
}

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

function faixaNumerica(lei: VisaoLei) {
  const min = lei.minimo ?? 0;
  const referencia = Math.max(lei.nivel, lei.meta);
  if (lei.unidade === "moeda_ano") {
    const max = Math.max(1000, referencia * 3);
    const passo = Math.pow(10, Math.floor(Math.log10(max / 200)));
    return { min, max, passo };
  }
  const teto = lei.maximo ?? 100;
  const max = Math.min(teto, Math.max(2, referencia * 4));
  return { min, max, passo: max <= 5 ? 0.01 : max <= 30 ? 0.1 : 0.5 };
}

function motivoSemEfeito(r: Relacao, meses: number) {
  if (r.atrasoMeses > meses) return `começa ${atraso(r.atrasoMeses)}`;
  if (r.mecanismo === "limiar") return "só reage além de um certo nível";
  return "efeito pequeno demais para aparecer";
}

export function DocumentoLei({
  lei,
  visao,
  base,
  indice,
  rascunho,
  onRascunho,
  previsao,
  calculando,
  erro,
  horizonte,
  onHorizonte,
  onAssinar,
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
  calculando: boolean;
  erro: string | null;
  horizonte: Horizonte;
  onHorizonte: (h: Horizonte) => void;
  onAssinar: () => void;
  onFechar: () => void;
  onSelecionar: (id: string) => void;
}) {
  const bolhas = useMemo(
    () => new Map(visao.bolhas.map((b) => [b.id, b])),
    [visao],
  );
  const leis = useMemo(
    () => new Map(visao.leis.map((l) => [l.id, l])),
    [visao],
  );
  const ministerio = base.porNome.get(lei.ministerios[0]);
  const cor = ministerio?.cor ?? "#666";
  const relacoes = indice.porNo.get(lei.id) ?? [];
  const efeitosDiretos = relacoes.filter((r) => r.de === lei.id);
  const condicoes = relacoes.filter((r) => r.para === lei.id && r.eficacia);
  const mudou = Math.abs(rascunho - lei.meta) > 1e-9;
  const pendente = Math.abs(lei.meta - lei.nivel) > 1e-6;
  const constitucional = ehConstitucional(lei);
  const numero = `Nº ${String(visao.leis.indexOf(lei) + 1).padStart(3, "0")}/${2026 + Math.floor(visao.turno / 4)}`;
  const [carimbo, setCarimbo] = useState(false);
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

  const rotuloOpcao = (valor: number) =>
    lei.opcoes?.reduce((melhor, o) =>
      Math.abs(o.valor - valor) < Math.abs(melhor.valor - valor) ? o : melhor,
    ).rotulo ?? nivelDaLei(valor, lei.unidade);

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

  const semEfeito = useMemo(() => {
    if (!previsao) return [];
    const com = new Set(itens.map((i) => i.id));
    return efeitosDiretos.filter((r) => !r.eficacia && !com.has(r.para));
  }, [previsao, itens, efeitosDiretos]);

  const custoExtra =
    lei.unidade === "moeda_ano" && mudou ? rascunho - lei.meta : 0;
  // Efeito no resultado (receita − gasto − juros), em moeda por ano.
  const efeitoContas = useMemo(() => {
    const e = previsao?.efeitos.find(
      (x) => x.id === BOLHAS_DO_ORCAMENTO.resultado,
    );
    if (!e) return null;
    const i = Math.min(mes, e.comMudanca.length - 1);
    return ((e.comMudanca[i] - e.semMudanca[i]) * visao.contas.pib) / 100;
  }, [previsao, mes, visao.contas.pib]);
  const implantado = previsao
    ? previsao.implantacao[Math.min(mes, previsao.implantacao.length - 1)]
    : null;
  const progresso =
    implantado !== null && Math.abs(rascunho - lei.nivel) > 1e-9
      ? Math.min(
          1,
          Math.max(0, (implantado - lei.nivel) / (rascunho - lei.nivel)),
        )
      : 1;

  const assinar = () => {
    setCarimbo(true);
    temporizadores.current.push(
      window.setTimeout(onAssinar, 650),
      window.setTimeout(() => setCarimbo(false), 1500),
    );
  };

  return (
    <Documento
      orgao={lei.ministerios[0]}
      setor="Gabinete · Proposta de alteração"
      numero={numero}
      cor={cor}
      icone={ICONE_LEI[lei.id] ?? ICONE_INTERFACE.lei}
      onFechar={onFechar}
      rotulo={`Documento da lei ${lei.nome}`}
      {...janela}
      rodape={
        <>
          <div className="assinatura">
            <span className="linha-assinatura" />
            <small>Presidente da República</small>
          </div>
          <div className="acoes-doc">
            <button
              type="button"
              className="botao-arquivar"
              disabled={!mudou}
              onClick={() => onRascunho(lei.meta)}
            >
              Desfazer
            </button>
            <button
              type="button"
              className="botao-assinar"
              disabled={!mudou || carimbo}
              onClick={assinar}
            >
              <Icone nome={ICONE_INTERFACE.assinar} tamanho={18} />
              Assinar
            </button>
          </div>
        </>
      }
    >
      {carimbo ? <div className="carimbo">Assinado</div> : null}
      <p className="tipo-doc">
        {NOME_PROCESSO[lei.processo] ?? lei.processo} ·{" "}
        {NOME_GRUPO[lei.grupo] ?? lei.grupo}
      </p>
      <h1 className="titulo-doc">{lei.nome}</h1>
      <div className="etiquetas">
        {lei.ministerios.map((m) => (
          <span
            key={m}
            className="etiqueta"
            style={{ "--cor": base.porNome.get(m)?.cor } as CSSProperties}
          >
            {nomeCurto(m)}
          </span>
        ))}
        {constitucional ? (
          <span
            className="etiqueta constitucional"
            style={{ "--cor": COR_PRESIDENCIA } as CSSProperties}
          >
            § Também da Presidência
          </span>
        ) : null}
        {lei.alteradaPorVoce ? (
          <span className="marca-sua">
            <Icone nome={ICONE_INTERFACE.caneta} tamanho={13} /> Mudada por você
          </span>
        ) : null}
      </div>
      {lei.descricao ? (
        <p className="ementa">
          <b>Ementa.</b> {lei.descricao}
        </p>
      ) : null}

      <section className="secao-doc">
        <h2>
          <span>I.</span> Situação atual
        </h2>
        <dl className="campos">
          <div>
            <dt>Em vigor</dt>
            <dd>{rotuloOpcao(lei.nivel)}</dd>
          </div>
          {pendente ? (
            <div>
              <dt>Meta (chega mês a mês)</dt>
              <dd className="meta">{rotuloOpcao(lei.meta)}</dd>
            </div>
          ) : null}
          {Math.abs(lei.saldoAnual) >= 1 ? (
            <div>
              <dt>{lei.saldoAnual > 0 ? "Arrecada" : "Custa"}</dt>
              <dd className={lei.saldoAnual > 0 ? "arrecada" : "custa"}>
                {lei.saldoAnual > 0 ? "+" : "−"}
                {moeda(Math.abs(lei.saldoAnual))}/ano
                <small> · {moeda(Math.abs(lei.saldoAnual) / 12)}/mês</small>
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="secao-doc">
        <h2>
          <span>II.</span> Nova redação
        </h2>
        {lei.opcoes?.length ? (
          <div
            className="opcoes-doc"
            role="radiogroup"
            aria-label="Nova redação da lei"
          >
            {lei.opcoes.map((opcao) => {
              const ativa = Math.abs(opcao.valor - rascunho) < 1e-9;
              const vigente = opcao.id === lei.opcaoAtual;
              return (
                <button
                  key={opcao.id}
                  type="button"
                  role="radio"
                  aria-checked={ativa}
                  className={`opcao-doc${ativa ? " ativa" : ""}`}
                  onClick={() => onRascunho(opcao.valor)}
                >
                  <span className="caixinha">{ativa ? "✕" : ""}</span>
                  <span className="opcao-rotulo">{opcao.rotulo}</span>
                  {vigente ? <span className="opcao-tag">em vigor</span> : null}
                  {Math.abs(opcao.saldoAnual) >= 100 ? (
                    <span
                      className={`opcao-custo ${opcao.saldoAnual > 0 ? "arrecada" : "custa"}`}
                      title={
                        opcao.saldoAnual > 0
                          ? "Quanto arrecada por ano nesta opção"
                          : "Quanto custa por ano nesta opção"
                      }
                    >
                      {opcao.saldoAnual > 0 ? "+" : "−"}
                      {moeda(Math.abs(opcao.saldoAnual))}/ano
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : (
          <ControleNumerico lei={lei} valor={rascunho} onValor={onRascunho} />
        )}
        {erro ? <p className="erro">{erro}</p> : null}
      </section>

      <section className="secao-doc impacto" ref={secaoImpacto}>
        <h2>
          <span>III.</span> Impacto previsto
        </h2>
        {!mudou ? (
          <>
            <p className="vazio">
              Marque uma nova redação para o motor simular o país com e sem a
              mudança. Ao reforçar esta lei, ela mexe diretamente com:
            </p>
            <div className="lista-cartoes">
              {efeitosDiretos
                .filter((r) => !r.eficacia)
                .map((r, i) => {
                  const b = bolhas.get(r.para);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={`cartao-impacto ${r.efeito} simples`}
                      style={
                        {
                          "--cor-efeito": COR_EFEITO[r.efeito],
                          animationDelay: `${i * 30}ms`,
                        } as CSSProperties
                      }
                      onClick={() => onSelecionar(r.para)}
                    >
                      <span className="cartao-icone">
                        <Icone
                          nome={ICONE_BOLHA[r.para] ?? "chart-line"}
                          tamanho={22}
                        />
                        <span className="cartao-seta">
                          <Icone
                            nome={
                              r.sinal > 0
                                ? ICONE_INTERFACE.subir
                                : ICONE_INTERFACE.descer
                            }
                            tamanho={13}
                          />
                        </span>
                      </span>
                      <span className="cartao-texto">
                        <strong>{b?.nome ?? r.para}</strong>
                        <small>
                          {r.sinal > 0 ? "sobe" : "desce"} ·{" "}
                          {atraso(r.atrasoMeses)}
                          {r.mecanismo === "limiar"
                            ? " · além de um certo nível"
                            : ""}
                        </small>
                      </span>
                    </button>
                  );
                })}
            </div>
          </>
        ) : (
          <>
            <Abas horizonte={horizonte} onHorizonte={onHorizonte} />
            {calculando && !previsao ? (
              <p className="vazio">O motor está simulando o país…</p>
            ) : previsao ? (
              <>
                {efeitoContas !== null && Math.abs(efeitoContas) >= 100 ? (
                  <div
                    className={`contas-impacto ${efeitoContas > 0 ? "melhora" : "piora"}`}
                  >
                    <Icone
                      nome={
                        ICONE_BOLHA[BOLHAS_DO_ORCAMENTO.resultado] ??
                        "calculator-variant-outline"
                      }
                      tamanho={22}
                    />
                    <span>
                      <small>Contas públicas {NOME_HORIZONTE[horizonte]}</small>
                      <b>
                        {efeitoContas > 0 ? "+" : "−"}
                        {moeda(Math.abs(efeitoContas))}/ano
                      </b>
                    </span>
                    <em>
                      {efeitoContas > 0
                        ? "o resultado melhora: menos déficit"
                        : "o resultado piora: mais déficit"}
                    </em>
                  </div>
                ) : null}
                <Placar itens={itens} />
                <div className="resumo-impacto">
                  {custoExtra ? (
                    <span className={custoExtra > 0 ? "custo" : "economia"}>
                      {custoExtra > 0 ? "Custo extra" : "Economia"}:{" "}
                      {moeda(Math.abs(custoExtra))}/ano
                    </span>
                  ) : null}
                  <span>
                    Implantação {NOME_HORIZONTE[horizonte]}:
                    <span className="barra-implantacao">
                      <i
                        style={{
                          width: `${progresso * 100}%`,
                          background: cor,
                        }}
                      />
                    </span>
                    {Math.round(progresso * 100)}%
                  </span>
                </div>
                {itens.length ? (
                  <div className="lista-cartoes">
                    {itens.slice(0, 14).map((item, i) => (
                      <CartaoImpacto
                        key={item.id}
                        item={item}
                        ordem={i}
                        onClick={() => onSelecionar(item.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="vazio">
                    Nada muda de forma visível {NOME_HORIZONTE[horizonte]}.
                  </p>
                )}
                {itens.length > 14 ? (
                  <p className="nota">
                    E mais {itens.length - 14} efeitos menores.
                  </p>
                ) : null}
                {semEfeito.length ? (
                  <div className="sem-efeito">
                    <h3>Ainda sem efeito {NOME_HORIZONTE[horizonte]}</h3>
                    <ul>
                      {semEfeito.map((r) => (
                        <li key={r.id}>
                          <Icone
                            nome={ICONE_BOLHA[r.para] ?? "chart-line"}
                            tamanho={15}
                          />
                          <b>{bolhas.get(r.para)?.nome ?? r.para}</b>
                          <span>
                            {motivoSemEfeito(
                              r,
                              MES_DO_HORIZONTE[horizonte] + 1,
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <p className="nota">
                  Diferença entre o país com e sem a mudança, simulada pelo
                  motor. As marcas mostram a força do efeito na escala de cada
                  indicador.
                </p>
              </>
            ) : null}
          </>
        )}
      </section>

      {condicoes.length ? (
        <section className="secao-doc">
          <h2>
            <span>IV.</span> O que muda a eficácia desta lei
          </h2>
          <div className="fichas">
            {condicoes.map((r) => (
              <button
                key={r.id}
                type="button"
                className="ficha"
                onClick={() => onSelecionar(r.de)}
              >
                <Icone
                  nome={
                    leis.has(r.de)
                      ? (ICONE_LEI[r.de] ?? ICONE_INTERFACE.lei)
                      : (ICONE_BOLHA[r.de] ?? "chart-line")
                  }
                  tamanho={15}
                />
                {leis.get(r.de)?.nome ?? bolhas.get(r.de)?.nome ?? r.de}
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

function ControleNumerico({
  lei,
  valor,
  onValor,
}: {
  lei: VisaoLei;
  valor: number;
  onValor: (v: number) => void;
}) {
  const { min, max, passo } = faixaNumerica(lei);
  return (
    <div className="controle-doc">
      <div className="controle-topo">
        <span>Novo valor</span>
        <strong>{nivelDaLei(valor, lei.unidade)}</strong>
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
};

function Regua({ bolha }: { bolha: VisaoBolha }) {
  const i = intensidadeDaBolha(bolha);
  const amplitude = bolha.maximo - bolha.minimo || 1;
  const surge =
    bolha.surgimento !== undefined && bolha.surgimento > bolha.minimo
      ? (bolha.surgimento - bolha.minimo) / amplitude
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
        <span>{valorDaBolha(bolha.minimo, bolha.unidade)}</span>
        {surge !== null ? (
          <span>surge em {valorDaBolha(bolha.surgimento!, bolha.unidade)}</span>
        ) : null}
        <span>{valorDaBolha(bolha.maximo, bolha.unidade)}</span>
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

  const cartaoCausa = (r: Relacao, i: number) => {
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
                  "--cor-efeito": base.porNome.get(lei.ministerios[0])?.cor,
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
            {lei ? `Lei · ${nomeCurto(lei.ministerios[0])}` : "Indicador"} ·{" "}
            {atraso(r.atrasoMeses)}
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
          {valorDaBolha(bolha.valor, bolha.unidade)}
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
            {d > 0 ? "▲" : "▼"} {diferenca(d, bolha.unidade)} no último turno
          </span>
        ) : null}
      </div>
      <Regua bolha={bolha} />
      <p className="nota">{avaliacao}.</p>
      {bolha.semVoce !== undefined &&
      Math.abs(bolha.valor - bolha.semVoce) /
        (bolha.maximo - bolha.minimo || 1) >=
        0.002 ? (
        <p className="sem-voce-boletim">
          <b>Sua marca:</b> {bolha.valor > bolha.semVoce ? "+" : "−"}
          {diferenca(
            Math.abs(bolha.valor - bolha.semVoce),
            bolha.unidade,
          ).slice(1)}
          . Sem as suas decisões, estaria em{" "}
          {valorDaBolha(bolha.semVoce, bolha.unidade)}.
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
