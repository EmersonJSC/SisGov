/**
 * Tela principal: barra superior, mapa político e painel da seleção.
 *
 * Fala com o jogo só pela camada da partida (`src/app/partida.ts`).
 */
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  criarPartida,
  encerrarTurno,
  enviarAoCongresso,
  escolherCandidato,
  investigarGrupo,
  mudarLei,
  revogarLei,
  responderDilema,
  responderPedido,
  verPartida,
  verBussola,
  verTramitacao,
  verEleicao,
  type OpcoesDoEnvio,
  type Partida,
  type PrevisaoLei,
  type RelatorioTurno,
  type VisaoPartida,
  type VisaoResultado,
  BOLHAS_DO_ORCAMENTO,
} from "../../app/partida";
import { Bandeira } from "./Bandeira";
import { diferenca, moeda, valorNaTela } from "./formatos";
import { Icone } from "./Icone";
import { ICONE_BOLHA, ICONE_INTERFACE } from "./icones";
import { montarBase, PRESIDENCIA } from "./layout";
import { MapaPolitico, type MarcaPrevista } from "./MapaPolitico";
import {
  PainelDaArea,
  destaqueDaAba,
  leisDaArea,
  type FiltroDaArea,
} from "./PainelDaArea";
import {
  LARGURA_PAINEL_GRUPOS,
  PainelGrupos,
  type AbaDosGrupos,
} from "./PainelGrupos";
import { useModoNoturno } from "./modoNoturno";
import { BuscaDeLeis } from "./BuscaDeLeis";
import { CatalogoDeLeis } from "./CatalogoDeLeis";
import { CongressoNoTablet } from "./CongressoNoTablet";
import { AcontecendoAgora, JornalDoTurno } from "./Jornal";
import { fotoDoTurno, montarJornal, type FotoDoTurno } from "./jornal";
import { PaginaDeJornal, type AppDoTablet } from "./PaginaDeJornal";
import {
  MES_DO_HORIZONTE,
  type Desvio,
  type Horizonte,
  type Retangulo,
} from "./Documentos";
import { JanelaBolha, JanelaLei, abrirJanela, type Janela } from "./Janelas";
import { JanelaPartida, type PartidaCarregada } from "./JanelaPartida";
import { TelaDeFundacao, type Fundacao } from "./TelaDeFundacao";
import { faltaCandidato } from "./EleicaoNoTablet";
import { Censo } from "./Censo";
import { MenuPrincipal } from "./MenuPrincipal";
import { NoiteDaApuracao } from "./NoiteDaApuracao";
import { efeitoDe, indexarRelacoes, ligacoesDeFundo } from "./relacoes";
import { COR_EFEITO } from "./tema";
import "./mapa.css";

/** Mudança mínima (fração da escala) para a bolha ganhar etiqueta no turno. */
const LIMIAR_ETIQUETA = 0.002;

type DicaDoChip = Readonly<{
  titulo: string;
  linhas: readonly (readonly [string, string])[];
  rodape?: string;
}>;

function ChipDado({
  rotulo,
  valor,
  classe,
  tendencia,
  titulo,
  dica,
  onClick,
}: {
  rotulo: string;
  valor: string;
  classe?: string;
  tendencia?: "sobe" | "desce";
  titulo?: string;
  dica?: DicaDoChip;
  onClick?: () => void;
}) {
  const [posicao, setPosicao] = useState<{
    esquerda: number;
    topo: number;
  } | null>(null);
  const idDica = useId();
  const mostrarDica = (alvo: HTMLElement) => {
    if (!dica) return;
    const rect = alvo.getBoundingClientRect();
    setPosicao({
      esquerda: Math.min(
        Math.max(16, rect.left),
        Math.max(16, window.innerWidth - 296),
      ),
      topo: rect.bottom + 8,
    });
  };
  return (
    <>
      <button
        type="button"
        className={`chip-dado${classe ? ` ${classe}` : ""}`}
        onClick={() => {
          setPosicao(null);
          onClick?.();
        }}
        onMouseEnter={(evento) => mostrarDica(evento.currentTarget)}
        onMouseLeave={() => setPosicao(null)}
        onFocus={(evento) => mostrarDica(evento.currentTarget)}
        onBlur={() => setPosicao(null)}
        title={dica ? undefined : titulo}
        aria-describedby={posicao && dica ? idDica : undefined}
      >
        <small>{rotulo}</small>
        <strong>{valor}</strong>
        {tendencia ? (
          <span
            className={`chip-seta ${tendencia}`}
            aria-label={tendencia === "sobe" ? "Subindo" : "Caindo"}
          >
            {tendencia === "sobe" ? "▲" : "▼"}
          </span>
        ) : null}
      </button>
      {dica && posicao
        ? createPortal(
            <div
              id={idDica}
              className="chip-dica"
              role="tooltip"
              style={{ left: posicao.esquerda, top: posicao.topo }}
            >
              <h4>{dica.titulo}</h4>
              {dica.linhas.map(([rotuloLinha, valorLinha]) => (
                <div className="chip-dica-linha" key={rotuloLinha}>
                  <span>{rotuloLinha}</span>
                  <strong>{valorLinha}</strong>
                </div>
              ))}
              {dica.rodape ? <p>{dica.rodape}</p> : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

const pctPib = (valor: number) =>
  `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% do PIB`;

/**
 * As contas como uma conta de escola: ENTRA − SAI = FALTA (ou SOBRA).
 * "Sai" já inclui os juros, então os três números sempre fecham à vista
 * (SG159). Cada parte abre o boletim da bolha correspondente.
 */
function ContasDoGoverno({
  contas,
  onAbrir,
}: {
  contas: VisaoPartida["contas"];
  onAbrir: (id: string) => void;
}) {
  const sai = contas.gasto + contas.juros;
  const sobra = contas.resultado >= 0;
  // V1-07: dívida e cofre convivem; a lei do destino reparte o resultado.
  const destino = sobra
    ? contas.divida > 0
      ? "abate a dívida e enche o cofre"
      : "vai para o cofre"
    : contas.cofre > 0
      ? "sai do cofre e vira dívida"
      : "vira dívida";
  const juros =
    contas.juros >= 0
      ? `+ juros ${moeda(contas.juros)}`
      : `− rendimento ${moeda(-contas.juros)}`;
  return (
    <div
      className="contas-governo"
      role="group"
      aria-label={`Contas do governo por ano: entra ${moeda(contas.receita)}, sai ${moeda(sai)}, ${sobra ? "sobra" : "falta"} ${moeda(Math.abs(contas.resultado))}`}
    >
      <button
        type="button"
        className="conta entra"
        onClick={() => onAbrir(BOLHAS_DO_ORCAMENTO.receita)}
        title="Tudo o que o governo arrecada por ano: impostos, contribuições, royalties, estatais."
      >
        <span className="metrica-icone">
          <Icone
            nome={ICONE_BOLHA.arrecadacao ?? "cash-register"}
            tamanho={20}
          />
        </span>
        <span>
          <small>Entra</small>
          <strong>{moeda(contas.receita)}</strong>
          <em>{pctPib(contas.percentualPib.receita)} · por ano</em>
        </span>
      </button>
      <span className="operador" aria-hidden="true">
        −
      </span>
      <button
        type="button"
        className="conta sai"
        onClick={() => onAbrir(BOLHAS_DO_ORCAMENTO.gasto)}
        title="Tudo o que sai por ano: o custo das leis mais os juros da dívida."
      >
        <span>
          <small>Sai</small>
          <strong>{moeda(sai)}</strong>
          <em>
            leis {moeda(contas.gasto)} {juros}
          </em>
        </span>
      </button>
      <span className="operador" aria-hidden="true">
        =
      </span>
      <button
        type="button"
        className={`conta resultado ${sobra ? "boa" : "ruim"}`}
        onClick={() => onAbrir(BOLHAS_DO_ORCAMENTO.resultado)}
        title={
          sobra
            ? "Superávit: sobra dinheiro no ano. A lei 'Destino do resultado fiscal' reparte entre pagar a dívida e encher o cofre."
            : "Déficit: falta dinheiro no ano. Parte sai do cofre (a mesma parte da lei 'Destino do resultado fiscal'); o resto vira dívida nova."
        }
      >
        <span>
          <small>{sobra ? "Sobra · superávit" : "Falta · déficit"}</small>
          <strong>{moeda(Math.abs(contas.resultado))}</strong>
          <em>{destino}</em>
        </span>
      </button>
    </div>
  );
}

function trimestre(turno: number) {
  return `${(turno % 4) + 1}º trimestre · ano ${Math.floor(turno / 4) + 1}`;
}

type Bolha = VisaoPartida["bolhas"][number];

/**
 * Resumo do turno: primeiro o que o jogador fez acontecer (em destaque),
 * depois, menor, o que o país fez sozinho.
 */
function ResumoDoTurno({
  aviso,
  variacoes,
  variacoesVoce,
  bolhaPorId,
  onSelecionar,
}: {
  aviso: RelatorioTurno;
  variacoes: ReadonlyMap<string, number>;
  variacoesVoce: ReadonlyMap<string, number>;
  bolhaPorId: ReadonlyMap<string, Bolha>;
  onSelecionar: (id: string) => void;
}) {
  const efeito = (id: string, d: number) =>
    efeitoDe(Math.sign(d), bolhaPorId.get(id)?.avaliacao);
  const contar = (mapa: ReadonlyMap<string, number>, qual: string) =>
    [...mapa].filter(([id, d]) => efeito(id, d) === qual).length;
  const suas = [...variacoesVoce]
    .map(([id, d]) => {
      const b = bolhaPorId.get(id);
      return {
        id,
        d,
        b,
        peso: Math.abs(d) / ((b?.maximo ?? 100) - (b?.minimo ?? 0) || 1),
      };
    })
    .sort((a, b) => b.peso - a.peso)
    .slice(0, 4);
  const marcaContas = aviso.contas.resultado - aviso.contasSemVoce.resultado;
  const naturais = new Map(
    [...variacoes].filter(([id]) => !variacoesVoce.has(id)),
  );
  return (
    <>
      <section className="resumo-suas">
        <h3>
          <Icone nome={ICONE_INTERFACE.caneta} tamanho={16} /> Suas decisões
        </h3>
        {aviso.leisAlteradas === 0 && aviso.dilemasDiferentes === 0 ? (
          <p className="vazio-suas">
            Você ainda não mudou nenhuma lei: o país andou sozinho. Abra uma
            esfera, escolha uma lei e assine uma nova redação.
          </p>
        ) : (
          <>
            <div className="aviso-placar">
              <span className="melhora">
                ▲ {contar(variacoesVoce, "melhora")} melhoraram
              </span>
              <span className="piora">
                ▼ {contar(variacoesVoce, "piora")} pioraram
              </span>
              {aviso.leisAlteradas > 0 ? (
                <span className="leis-suas">
                  {aviso.leisAlteradas}{" "}
                  {aviso.leisAlteradas === 1 ? "lei mudada" : "leis mudadas"}
                </span>
              ) : null}
              {aviso.dilemasDiferentes > 0 ? (
                <span className="leis-suas">
                  {aviso.dilemasDiferentes}{" "}
                  {aviso.dilemasDiferentes === 1
                    ? "decisão própria na mesa"
                    : "decisões próprias na mesa"}
                </span>
              ) : null}
            </div>
            {suas.length ? (
              <ul>
                {suas.map(({ id, d, b }) => (
                  <li key={id}>
                    <button type="button" onClick={() => onSelecionar(id)}>
                      {b?.nome ?? id}
                      <span style={{ color: COR_EFEITO[efeito(id, d)] }}>
                        {diferenca(d, b?.unidade ?? "")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="vazio-suas">
                Suas leis ainda estão chegando: o efeito aparece nos próximos
                meses.
              </p>
            )}
            {Math.abs(marcaContas) >= 100 ? (
              <p className="contas-suas">
                Nas contas: {marcaContas > 0 ? "+" : "−"}
                {moeda(Math.abs(marcaContas))}/ano{" "}
                {marcaContas > 0 ? "a mais" : "a menos"} no resultado do que sem
                você.
              </p>
            ) : null}
          </>
        )}
      </section>
      <p className="resumo-sozinho">
        <b>O país sozinho:</b> ▲ {contar(naturais, "melhora")} · ▼{" "}
        {contar(naturais, "piora")} ·{" "}
        {aviso.contas.resultado >= 0 ? "superávit" : "déficit"} de{" "}
        {moeda(Math.abs(aviso.contas.resultado))}/ano;{" "}
        {aviso.contas.cofre > 0
          ? `cofre de ${moeda(aviso.contas.cofre)}`
          : `dívida de ${moeda(aviso.contas.divida)}`}
        .
      </p>
    </>
  );
}

type Inicial = ReturnType<typeof criarPartida>;

/**
 * Carrega o conteúdo (validar ~3.800 arquivos leva alguns segundos): mostra
 * uma tela de carregamento primeiro e só então cria a partida, para a página
 * não ficar em branco (15/out).
 */
type Tela =
  | Readonly<{ nome: "menu" }>
  | Readonly<{ nome: "fundacao"; semente: number }>
  | Readonly<{ nome: "criando"; fundacao: Fundacao }>
  | Readonly<{
      nome: "jogo";
      id: number;
      inicial: Inicial;
      anexos?: Readonly<Record<string, unknown>>;
    }>;

// cada partida nova ganha uma semente própria: eventos diferentes (SG106)
// e personagens diferentes na primeira tela (V1-39)
const novaSemente = () => 1 + Math.floor(Math.random() * 0xfffffffe);

export function TelaPrincipal() {
  const [tela, setTela] = useState<Tela>({ nome: "menu" });
  useEffect(() => {
    if (tela.nome !== "criando") return;
    const { fundacao } = tela;
    const id = window.setTimeout(
      () =>
        // V1-12: as leis passam pelo Congresso (modo real); V1-39: o
        // jogador é o partido e já começa no governo
        setTela({
          nome: "jogo",
          id: Date.now(),
          inicial: criarPartida({
            semente: fundacao.semente,
            modo: "real",
            partido: fundacao.partido,
            presidente: fundacao.presidente,
          }),
        }),
      60,
    );
    return () => window.clearTimeout(id);
  }, [tela]);
  const novo = () => setTela({ nome: "fundacao", semente: novaSemente() });
  const menu = () => setTela({ nome: "menu" });
  if (tela.nome === "menu")
    return (
      <MenuPrincipal
        onNovo={novo}
        onCarregar={({ partida, anexos }) =>
          setTela({
            nome: "jogo",
            id: Date.now(),
            inicial: { ok: true, value: partida },
            anexos,
          })
        }
      />
    );
  if (tela.nome === "fundacao")
    return (
      <TelaDeFundacao
        semente={tela.semente}
        onComecar={(fundacao) => setTela({ nome: "criando", fundacao })}
      />
    );
  if (tela.nome === "criando")
    return (
      <div className="carregando" role="status" aria-live="polite">
        <div className="carregando-giro" aria-hidden="true" />
        <p>Carregando o governo…</p>
      </div>
    );
  return (
    <TelaPrincipalCarregada
      key={tela.id}
      inicial={tela.inicial}
      anexos={tela.anexos}
      onNovo={novo}
      onMenu={menu}
    />
  );
}

function TelaPrincipalCarregada({
  inicial,
  anexos,
  onNovo,
  onMenu,
}: {
  inicial: Inicial;
  anexos?: Readonly<Record<string, unknown>>;
  onNovo: () => void;
  onMenu: () => void;
}) {
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [abaTopo, setAbaTopo] = useState("Leis");
  const [catalogoAberto, setCatalogoAberto] = useState(false);
  const [salvarAberto, setSalvarAberto] = useState(false);
  // tablet: false fechado; senão, o app que abre (V1-10)
  const [tablet, setTablet] = useState<false | AppDoTablet>(false);
  const jornalAberto = tablet !== false;
  const [tema, alternarTema] = useModoNoturno();
  const fecharJornal = useCallback(() => setTablet(false), []);
  // a lupa abre com "/" ou Ctrl+K (fora de um campo de texto)
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      const escrevendo =
        alvo?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(alvo?.tagName ?? "");
      if (
        (e.key === "/" && !escrevendo) ||
        (e.key.toLowerCase() === "k" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        setBuscaAberta(true);
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);
  const [partida, setPartida] = useState<Partida | null>(
    inicial.ok ? inicial.value : null,
  );
  const [aberta, setAberta] = useState<string | null>(null);
  // aba do painel da área (22/out): acende no mapa as leis daquele grupo
  const [filtroArea, setFiltroArea] = useState<FiltroDaArea>("todas");
  const [filtroDaAreaAberta, setFiltroDaAreaAberta] = useState(aberta);
  if (filtroDaAreaAberta !== aberta) {
    setFiltroDaAreaAberta(aberta);
    setFiltroArea("todas");
  }
  const [selecionado, setSelecionado] = useState<string | null>(null);
  // lista dos grupos aberta de saída em telas largas (SG143)
  const [gruposAbertos, setGruposAbertos] = useState(false);
  const [abaGrupos, setAbaGrupos] = useState<AbaDosGrupos>("eleitorado");
  const [relatorio, setRelatorio] = useState<RelatorioTurno | null>(null);
  const [aviso, setAviso] = useState<RelatorioTurno | null>(null);
  /** A visão antes do último turno: o jornal compara com ela. */
  const [visaoAnterior, setVisaoAnterior] = useState<VisaoPartida | null>(null);
  /** Valores de cada turno já passado: as linhas de evolução do jornal. */
  const [historico, setHistorico] = useState<readonly FotoDoTurno[]>(() =>
    Array.isArray(anexos?.historico)
      ? (anexos.historico as readonly FotoDoTurno[])
      : [],
  );
  const [erroTurno, setErroTurno] = useState<string | null>(null);
  const [pulsos, setPulsos] = useState<ReadonlySet<string>>(new Set());
  const [passando, setPassando] = useState(false);
  const [variacoesVoce, setVariacoesVoce] = useState<
    ReadonlyMap<string, number>
  >(new Map());
  const [variacoes, setVariacoes] = useState<ReadonlyMap<string, number>>(
    new Map(),
  );
  const [horizonte, setHorizonte] = useState<Horizonte>("ano");
  const [mostrarVariacoes, setMostrarVariacoes] = useState(true);
  // Janelas abertas, da mais antiga para a da frente; cada uma lembra onde
  // o jogador a deixou.
  const [janelas, setJanelas] = useState<readonly Janela[]>([]);
  const [retangulos, setRetangulos] = useState<ReadonlyMap<string, Retangulo>>(
    new Map(),
  );
  const [previsoes, setPrevisoes] = useState<ReadonlyMap<string, PrevisaoLei>>(
    new Map(),
  );

  const visao = useMemo(
    () => (partida ? verPartida(partida) : null),
    [partida],
  );
  const congresso = useMemo(
    () => (partida ? verTramitacao(partida) : null),
    [partida],
  );
  const visaoDaBussola = useMemo(
    () => (partida ? verBussola(partida) : undefined),
    [partida],
  );
  const eleicao = useMemo(
    () => (partida ? verEleicao(partida) : undefined),
    [partida],
  );
  // V1-39: a noite da apuração, depois do turno da eleição
  const [apuracao, setApuracao] = useState<VisaoResultado | null>(null);
  // na derrota (ou ao abrir uma partida perdida) a noite fica na tela
  const noite =
    apuracao ?? (eleicao?.encerrada ? eleicao.resultados.at(-1) : undefined);
  // V1-13: dilemas e pedidos do Congresso esperando no tablet
  const avisosNoTablet =
    (visao?.ocorrencias.mesa.length ?? 0) + (congresso?.pedidos.length ?? 0);
  // A estrutura (leis, bolhas, ligações) só muda quando uma lei entra em
  // vigor ou é revogada (D-65): refaz só nessa hora.
  const estrutura = useRef<ReturnType<typeof montarEstrutura> | null>(null);
  const chaveEstrutura = useRef("");
  if (visao) {
    const chave = visao.leis
      .filter((l) => l.emVigor || l.sempreVisivel)
      .map((l) => l.id)
      .join("|");
    if (!estrutura.current || chave !== chaveEstrutura.current) {
      estrutura.current = montarEstrutura(visao);
      chaveEstrutura.current = chave;
    }
  }

  const frente = janelas.at(-1)?.id ?? null;

  /** Clique no mapa: destaca o nó e abre (ou traz para a frente) a janela dele. */
  const selecionar = useCallback((id: string | null) => {
    setSelecionado(id);
    if (id) setJanelas((atuais) => abrirJanela(atuais, id));
  }, []);

  const focar = useCallback((id: string) => {
    setSelecionado(id);
    setJanelas((atuais) => abrirJanela(atuais, id));
  }, []);

  const fechar = useCallback((id: string) => {
    setJanelas((atuais) => {
      const restantes = atuais.filter((j) => j.id !== id);
      setSelecionado((sel) =>
        sel === id ? (restantes.at(-1)?.id ?? null) : sel,
      );
      return restantes;
    });
    setRetangulos((m) => {
      const n = new Map(m);
      n.delete(id);
      return n;
    });
  }, []);

  const mover = useCallback((id: string, desvio: Desvio) => {
    setJanelas((atuais) =>
      atuais.map((j) => (j.id === id ? { ...j, desvio } : j)),
    );
  }, []);

  const medir = useCallback((id: string, r: Retangulo | null) => {
    setRetangulos((m) => {
      const n = new Map(m);
      if (r) n.set(id, r);
      else n.delete(id);
      return n;
    });
  }, []);

  const guardarPrevisao = useCallback((id: string, p: PrevisaoLei | null) => {
    setPrevisoes((m) => {
      if ((m.get(id) ?? null) === p) return m;
      const n = new Map(m);
      if (p) n.set(id, p);
      else n.delete(id);
      return n;
    });
  }, []);

  // As marcas no mapa mostram a prévia da janela em destaque.
  const previsao = selecionado ? (previsoes.get(selecionado) ?? null) : null;
  const marcas = useMemo(() => {
    const mapa = new Map<string, MarcaPrevista>();
    if (!previsao || !visao) return mapa;
    const avaliacao = new Map(visao.bolhas.map((b) => [b.id, b.avaliacao]));
    const mes = MES_DO_HORIZONTE[horizonte];
    for (const efeito of previsao.efeitos.slice(0, 16)) {
      const i = Math.min(mes, efeito.comMudanca.length - 1);
      const d = efeito.comMudanca[i] - efeito.semMudanca[i];
      if (Math.abs(d) < 0.005) continue;
      mapa.set(efeito.id, {
        sobe: d > 0,
        efeito: efeitoDe(Math.sign(d), avaliacao.get(efeito.id)),
      });
    }
    return mapa;
  }, [previsao, visao, horizonte]);

  const aplicar = (
    leiId: string,
    nivel: number,
    opcoes?: OpcoesDoEnvio,
  ): string | null => {
    if (!partida) return null;
    const r = opcoes
      ? enviarAoCongresso(partida, leiId, nivel, opcoes)
      : mudarLei(partida, leiId, nivel);
    if (!r.ok) return r.erros.join(" ");
    setPartida(r.value);
    return null;
  };

  const revogar = (leiId: string): string | null => {
    if (!partida) return null;
    const r = revogarLei(partida, leiId);
    if (!r.ok) return r.erros.join(" ");
    setPartida(r.value);
    return null;
  };

  // V1-33: a partida carregada substitui a atual; a tela recomeça limpa
  const carregar = ({ partida: nova, anexos }: PartidaCarregada) => {
    setPartida(nova);
    setHistorico(
      Array.isArray(anexos.historico)
        ? (anexos.historico as readonly FotoDoTurno[])
        : [],
    );
    setVisaoAnterior(null);
    setRelatorio(null);
    setAviso(null);
    setErroTurno(null);
    setVariacoes(new Map());
    setVariacoesVoce(new Map());
    setPulsos(new Set());
    setJanelas([]);
    setSalvarAberto(false);
    setTablet(false);
  };

  // V1-12: aceitar ou recusar o pedido de uma bancada
  const responderAoPedido = (pedidoId: string, aceitar: boolean) => {
    if (!partida) return;
    const r = responderPedido(partida, pedidoId, aceitar);
    if (!r.ok) {
      setErroTurno(r.erros.join(" "));
      return;
    }
    setPartida(r.value);
    setErroTurno(null);
  };

  const escolherDilema = (dilemaId: string, opcaoId: string): string | null => {
    if (!partida) return null;
    const r = responderDilema(partida, dilemaId, opcaoId);
    if (!r.ok) return r.erros.join(" ");
    setPartida(r.value);
    setErroTurno(null);
    return null;
  };

  // V1-09: investigar quem financia um grupo de pressão
  const investigar = (grupoId: string) => {
    if (!partida) return;
    const r = investigarGrupo(partida, grupoId);
    if (!r.ok) {
      setErroTurno(r.erros.join(" "));
      return;
    }
    setPartida(r.value);
    setErroTurno(null);
  };

  // V1-39: o partido escolhe quem disputa a eleição
  const escolherNoPartido = (id: string): string | null => {
    if (!partida) return null;
    const r = escolherCandidato(partida, id);
    if (!r.ok) return r.erros.join(" ");
    setPartida(r.value);
    setErroTurno(null);
    return null;
  };

  const passarTurno = () => {
    if (!partida || passando) return;
    // V1-39: partida perdida ou sem candidato: o tablet abre na eleição
    if (eleicao?.encerrada) return;
    if (eleicao && faltaCandidato(eleicao) && eleicao.turnosAteAEleicao === 0) {
      setTablet("eleicao");
      return;
    }
    // V1-13: com dilema sem resposta, o botão abre as notificações
    if (visao && visao.ocorrencias.mesa.length > 0) {
      setTablet("notificacoes");
      return;
    }
    setPassando(true);
    // deixa o botão mostrar o estado antes de calcular
    window.setTimeout(() => {
      const r = encerrarTurno(partida);
      setPassando(false);
      if (!r.ok) {
        setErroTurno(r.erros.join(" "));
        if (eleicao && faltaCandidato(eleicao)) setTablet("eleicao");
        return;
      }
      setErroTurno(null);
      const antes = new Map(visao!.bolhas.map((b) => [b.id, b]));
      const mudaram = new Map<string, number>();
      const porVoce = new Map<string, number>();
      for (const b of verPartida(r.value.partida).bolhas) {
        const a = antes.get(b.id);
        const escala = b.maximo - b.minimo || 1;
        const d = b.valor - (a?.valor ?? b.valor);
        if (Math.abs(d) / escala >= LIMIAR_ETIQUETA) mudaram.set(b.id, d);
        // a marca do jogador: o quanto o país se afastou do piloto automático
        const marca = (x?: typeof b) =>
          x ? x.valor - (x.semVoce ?? x.valor) : 0;
        const v = marca(b) - marca(a);
        if (Math.abs(v) / escala >= LIMIAR_ETIQUETA) porVoce.set(b.id, v);
      }
      setVariacoes(mudaram);
      setVariacoesVoce(porVoce);
      setMostrarVariacoes(true);
      setVisaoAnterior(visao);
      setHistorico((h) => [...h, fotoDoTurno(visao!)]);
      setPartida(r.value.partida);
      setRelatorio(r.value.relatorio);
      // o jornal do trimestre chega com o fim do turno; dilemas e pedidos
      // ficam nas notificações do tablet (V1-13)
      // V1-39: no turno da eleição, a noite da apuração vem antes do jornal
      const apurada = r.value.relatorio.eleicao?.resultado;
      if (apurada) setApuracao(apurada);
      else setTablet("jornal");
      setAviso(r.value.relatorio);
      setPulsos(new Set([...mudaram.keys(), ...porVoce.keys()]));
    }, 30);
  };

  useEffect(() => {
    if (!pulsos.size) return;
    const id = window.setTimeout(() => setPulsos(new Set()), 4200);
    return () => window.clearTimeout(id);
  }, [pulsos]);
  useEffect(() => {
    if (!aviso) return;
    const id = window.setTimeout(() => setAviso(null), 9000);
    return () => window.clearTimeout(id);
  }, [aviso]);

  if (!inicial.ok || !partida || !visao || !estrutura.current)
    return (
      <div className="falha">
        <h1>Não foi possível criar a partida</h1>
        <ul>
          {(inicial.ok ? [] : inicial.erros).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    );

  const { base, indice, fundo } = estrutura.current;
  const contas = visao.contas;
  // V1-08: aprovação = parte do eleitorado que aprova, pelos perfis
  const aprovacao = visao.bolhas.find((b) => b.id === "popularidade_governo");
  // Os documentos são janelas soltas sobre o mapa: a câmera não desvia para
  // o lado; o mapa só desliza quando a janela da frente esconde a seleção.
  const painel = 0;
  const cobertura =
    selecionado && selecionado === frente
      ? (retangulos.get(selecionado) ?? null)
      : null;
  const bolhaPorId = new Map(visao.bolhas.map((b) => [b.id, b]));
  const crescimento = bolhaPorId.get("crescimento_real");
  const inflacaoIndice = bolhaPorId.get("inflacao");
  const desempregoIndice = bolhaPorId.get("desemprego");
  const jurosMedios = bolhaPorId.get("juros_implicito");
  const riscoPais = bolhaPorId.get("risco_pais");
  const crescimentoPotencial = bolhaPorId.get("crescimento_potencial");
  const expectativasInflacao = bolhaPorId.get("expectativas_inflacao");
  const ocupados = bolhaPorId.get("ocupados");
  const informalidade = bolhaPorId.get("informalidade");
  const maisInsatisfeito = visao.grupos.reduce<
    (typeof visao.grupos)[number] | null
  >(
    (pior, grupo) =>
      !pior || grupo.satisfacao < pior.satisfacao ? grupo : pior,
    null,
  );
  const textoTurno = (() => {
    if (passando) return "Calculando…";
    if (eleicao?.encerrada) return "Fim da partida";
    if (visao.ocorrencias.mesa.length) return "Responder dilema";
    if (eleicao && faltaCandidato(eleicao) && eleicao.turnosAteAEleicao === 0)
      return "Escolher candidato";
    return "Encerrar turno";
  })();

  return (
    <div className="tela">
      <header className="barra-superior">
        <div className="pais">
          <Bandeira pais={visao.pais} />
          <strong>{visao.pais}</strong>
        </div>
        <div className="metricas" role="group" aria-label="Indicadores do país">
          <ChipDado
            rotulo="Caixa"
            valor={`${contas.resultado < 0 ? "−" : "+"}${moeda(Math.abs(contas.resultado))}`}
            classe={contas.resultado < 0 ? "ruim" : "boa"}
            dica={{
              titulo: "Caixa do ano",
              linhas: [
                ["Entra", moeda(contas.receita)],
                ["Sai com as leis", moeda(contas.gasto)],
                [
                  contas.juros < 0 ? "Rendimento do cofre" : "Juros da dívida",
                  moeda(Math.abs(contas.juros)),
                ],
                [
                  contas.resultado < 0 ? "Falta" : "Sobra",
                  moeda(Math.abs(contas.resultado)),
                ],
              ],
              rodape: "Clique para abrir o orçamento.",
            }}
            onClick={() => setAbaTopo("Orçamento")}
          />
          <ChipDado
            rotulo="Dívida"
            valor={`${contas.percentualPib.divida.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`}
            classe="neutra"
            dica={{
              titulo: "Dívida pública",
              linhas: [
                [
                  "Hoje",
                  `${moeda(contas.divida)} · ${pctPib(contas.percentualPib.divida)}`,
                ],
                ["Juros no ano", moeda(contas.juros)],
                ...(jurosMedios
                  ? [
                      [
                        "Juro médio",
                        `${jurosMedios.valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}% ao ano`,
                      ] as const,
                    ]
                  : []),
                ...(riscoPais
                  ? [
                      [
                        "Risco país",
                        `${riscoPais.valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} pontos`,
                      ] as const,
                    ]
                  : []),
              ],
              rodape: "Clique para abrir o orçamento.",
            }}
            onClick={() => setAbaTopo("Orçamento")}
          />
          {aprovacao ? (
            <ChipDado
              rotulo="Aprovação"
              valor={`${aprovacao.valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%`}
              classe="neutra"
              dica={{
                titulo: "Aprovação do governo",
                linhas: [
                  [
                    "Hoje",
                    `${aprovacao.valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%`,
                  ],
                  [
                    "Grupos satisfeitos",
                    `${visao.grupos.filter((grupo) => grupo.satisfacao >= 50).length} de ${visao.grupos.length}`,
                  ],
                  ...(maisInsatisfeito
                    ? [
                        [
                          "Mais insatisfeito",
                          `${maisInsatisfeito.nome} (${Math.round(maisInsatisfeito.satisfacao)})`,
                        ] as const,
                      ]
                    : []),
                ],
                rodape: "Clique para abrir a política.",
              }}
              onClick={() => setAbaTopo("Política")}
            />
          ) : null}
          {crescimento ? (
            <ChipDado
              rotulo="PIB"
              valor={`${crescimento.valor > 0 ? "+" : ""}${valorNaTela(crescimento, crescimento.valor)}`}
              classe={crescimento.valor >= 0 ? "boa" : "ruim"}
              dica={{
                titulo: "Crescimento do PIB",
                linhas: [
                  [
                    "Em 12 meses",
                    `${crescimento.valor > 0 ? "+" : ""}${valorNaTela(crescimento, crescimento.valor)}`,
                  ],
                  ...(crescimentoPotencial
                    ? [
                        [
                          "Tendência",
                          `${crescimentoPotencial.valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% ao ano`,
                        ] as const,
                      ]
                    : []),
                  ["PIB anual", moeda(contas.pib)],
                ],
                rodape: "Clique para ver o indicador no mapa.",
              }}
              onClick={() => {
                setAbaTopo("Leis");
                selecionar(crescimento.id);
              }}
            />
          ) : null}
          {inflacaoIndice ? (
            <ChipDado
              rotulo="Inflação"
              valor={valorNaTela(inflacaoIndice, inflacaoIndice.valor)}
              classe="neutra"
              dica={{
                titulo: "Inflação",
                linhas: [
                  [
                    "Em 12 meses",
                    valorNaTela(inflacaoIndice, inflacaoIndice.valor),
                  ],
                  ...(expectativasInflacao
                    ? [
                        [
                          "Expectativa",
                          `${expectativasInflacao.valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`,
                        ] as const,
                      ]
                    : []),
                ],
                rodape: "Clique para ver o indicador no mapa.",
              }}
              onClick={() => {
                setAbaTopo("Leis");
                selecionar(inflacaoIndice.id);
              }}
            />
          ) : null}
          {desempregoIndice ? (
            <ChipDado
              rotulo="Desemprego"
              valor={valorNaTela(desempregoIndice, desempregoIndice.valor)}
              dica={{
                titulo: "Desemprego",
                linhas: [
                  [
                    "Hoje",
                    valorNaTela(desempregoIndice, desempregoIndice.valor),
                  ],
                  ...(ocupados
                    ? [
                        [
                          "Pessoas ocupadas",
                          `${Math.round(ocupados.valor).toLocaleString("pt-BR")} pessoas`,
                        ] as const,
                      ]
                    : []),
                  ...(informalidade
                    ? [
                        [
                          "Informalidade",
                          `${informalidade.valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`,
                        ] as const,
                      ]
                    : []),
                ],
                rodape: "Clique para ver o indicador no mapa.",
              }}
              onClick={() => {
                setAbaTopo("Leis");
                selecionar(desempregoIndice.id);
              }}
            />
          ) : null}
        </div>
        <nav className="abas-topo" role="tablist" aria-label="Telas">
          <button
            type="button"
            role="tab"
            className="aba-topo"
            aria-selected={abaTopo === "Leis"}
            onClick={() => setAbaTopo("Leis")}
          >
            Leis
          </button>
          <button
            type="button"
            role="tab"
            className="aba-topo"
            aria-selected={abaTopo === "Política"}
            onClick={() => setAbaTopo("Política")}
          >
            Política
          </button>
          <button
            type="button"
            role="tab"
            className="aba-topo"
            aria-selected={abaTopo === "Orçamento"}
            onClick={() => setAbaTopo("Orçamento")}
          >
            Orçamento
          </button>
          <button
            type="button"
            role="tab"
            className="aba-topo"
            aria-selected={abaTopo === "População"}
            onClick={() => setAbaTopo("População")}
          >
            População
          </button>
          <button
            type="button"
            role="tab"
            className="aba-topo"
            aria-selected="false"
            disabled
            title="Tela ainda não disponível"
          >
            Economia
          </button>
        </nav>
        <span className="turno">
          {(visao.turno % 4) + 1}º tri ·{" "}
          {Number(visao.cenario.match(/20\d{2}/)?.[0] ?? 2026) +
            Math.floor(visao.turno / 4)}
        </span>
        <button
          type="button"
          className={`botao-turno${passando ? " ocupado" : ""}${visao.ocorrencias.mesa.length ? " travado" : ""}`}
          onClick={passarTurno}
          disabled={passando}
          title={
            visao.ocorrencias.mesa.length
              ? "Responda os dilemas nas notificações para encerrar o turno"
              : undefined
          }
        >
          {textoTurno}
        </button>
      </header>

      <details className="acoes-jogo">
        <summary title="Abrir ferramentas">Ferramentas</summary>
        <div>
          <button type="button" onClick={() => setTablet("inicio")}>
            Tablet{avisosNoTablet ? ` (${avisosNoTablet})` : ""}
          </button>
          <button
            type="button"
            onClick={() => {
              setAbaTopo("Leis");
              setBuscaAberta(true);
            }}
          >
            Buscar lei
          </button>
          <button
            type="button"
            onClick={() => {
              setAbaTopo("Leis");
              setCatalogoAberto(true);
            }}
          >
            Leis fora do mapa
          </button>
          <button
            type="button"
            onClick={() => {
              setAbaTopo("Leis");
              setGruposAbertos((aberto) => !aberto);
            }}
          >
            Eleitorado no mapa
          </button>
          <button type="button" onClick={() => setSalvarAberto(true)}>
            Salvar ou carregar
          </button>
          <button type="button" onClick={alternarTema}>
            {tema === "noturno" ? "Modo claro" : "Modo noturno"}
          </button>
        </div>
      </details>

      {abaTopo === "População" ? (
        <Censo
          censo={visao.censo}
          habitantes={visao.bolhas.find((b) => b.id === "populacao")?.valor}
          perfis={visao.perfis}
        />
      ) : null}

      {abaTopo === "Política" ? (
        <section className="pagina-aba" aria-label="Política">
          <div className="pagina-aba-cabeca">
            <small>POLÍTICA</small>
            <h1>Quem está com o governo</h1>
          </div>
          {aprovacao ? (
            <div className="pagina-aba-cartao">
              <small>APROVAÇÃO</small>
              <strong>
                {aprovacao.valor.toLocaleString("pt-BR", {
                  maximumFractionDigits: 0,
                })}
                %
              </strong>
            </div>
          ) : null}
          {congresso ? (
            <CongressoNoTablet
              congresso={congresso}
              nomeDaLei={(id) =>
                visao.leis.find((lei) => lei.id === id)?.nome ?? id
              }
              onResponder={responderAoPedido}
            />
          ) : null}
          <div className="pagina-aba-cartao pagina-aba-grupos">
            <h2>Grupos de interesse</h2>
            <div>
              {visao.grupos.map((grupo) => (
                <button
                  key={grupo.id}
                  type="button"
                  onClick={() => {
                    setAbaTopo("Leis");
                    selecionar(grupo.id);
                  }}
                >
                  <span>{grupo.nome}</span>
                  <strong>
                    {grupo.satisfacao.toLocaleString("pt-BR", {
                      maximumFractionDigits: 0,
                    })}
                  </strong>
                  <small>
                    {(grupo.peso * 100).toLocaleString("pt-BR", {
                      maximumFractionDigits: 0,
                    })}
                    % do eleitorado
                  </small>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {abaTopo === "Orçamento" ? (
        <section className="pagina-aba" aria-label="Orçamento">
          <div className="pagina-aba-cabeca">
            <small>ORÇAMENTO · POR ANO</small>
            <h1>De onde vem e para onde vai</h1>
          </div>
          <div className="pagina-aba-cartao">
            <ContasDoGoverno
              contas={contas}
              onAbrir={(id) => {
                setAbaTopo("Leis");
                selecionar(id);
              }}
            />
          </div>
          <div className="pagina-aba-cartao pagina-aba-divida">
            <span>Dívida pública</span>
            <strong>{moeda(contas.divida)}</strong>
            <span>{pctPib(contas.percentualPib.divida)}</span>
          </div>
          <div className="pagina-aba-listas">
            {(["Entra", "Sai"] as const).map((lado) => (
              <div className="pagina-aba-cartao" key={lado}>
                <h2>{lado}</h2>
                {visao.orcamento
                  .filter((linha) =>
                    lado === "Entra"
                      ? linha.lado === "receita"
                      : linha.lado === "gasto" || linha.lado === "juros",
                  )
                  .map((linha) => (
                    <div className="pagina-aba-linha" key={linha.id}>
                      <span>{linha.nome}</span>
                      <strong>{moeda(Math.abs(linha.valor))}</strong>
                      <small>{linha.conta}</small>
                      <div className="pagina-aba-leis-da-linha">
                        {linha.leis.map((id) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              setAbaTopo("Leis");
                              selecionar(id);
                            }}
                          >
                            {visao.leis.find((lei) => lei.id === id)?.nome ??
                              id}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {jornalAberto ? (
        <PaginaDeJornal
          edicao={montarJornal(
            visao,
            visaoAnterior,
            relatorio,
            historico,
            visaoDaBussola?.rumo,
            visaoDaBussola,
          )}
          data={trimestre(visao.turno)}
          numero={visao.turno + 1}
          onFechar={fecharJornal}
          bussola={visaoDaBussola}
          congresso={congresso?.casas.length ? congresso : undefined}
          nomeDaLei={(id) => visao.leis.find((l) => l.id === id)?.nome ?? id}
          onResponderPedido={responderAoPedido}
          partida={partida ?? undefined}
          dilemas={visao.ocorrencias.mesa}
          onEscolherDilema={escolherDilema}
          appInicial={tablet || "inicio"}
          eleicao={eleicao}
          onEscolherCandidato={escolherNoPartido}
          nomeDoSegmento={(id) =>
            visao.bolhas.find((b) => b.id === id)?.nome ?? id
          }
        />
      ) : null}

      {noite ? (
        <NoiteDaApuracao
          key={noite.turno}
          resultado={noite}
          jaApurada={!apuracao}
          sigla={eleicao?.partido.sigla}
          nomeDoSegmento={(id) =>
            visao.bolhas.find((b) => b.id === id)?.nome ?? id
          }
          onContinuar={() => {
            setApuracao(null);
            setTablet("jornal");
          }}
          onNovo={onNovo}
          onMenu={onMenu}
        />
      ) : null}

      {salvarAberto && partida ? (
        <JanelaPartida
          partida={partida}
          turno={trimestre(visao.turno)}
          anexos={{ historico }}
          onCarregar={carregar}
          onFechar={() => setSalvarAberto(false)}
        />
      ) : null}

      {buscaAberta ? (
        <BuscaDeLeis
          leis={visao.leis}
          bolhas={visao.bolhas}
          governo={visao.governo}
          corDoMinisterio={(m) => base.porNome.get(m)?.cor}
          onFechar={() => setBuscaAberta(false)}
          onEscolher={(r) => {
            if (r.tipo === "lei" && r.ministerio) setAberta(r.ministerio);
            selecionar(r.id);
          }}
        />
      ) : null}

      {catalogoAberto ? (
        <CatalogoDeLeis
          leis={visao.leis}
          governo={visao.governo}
          corDoMinisterio={(m) => base.porNome.get(m)?.cor}
          onFechar={() => setCatalogoAberto(false)}
          onEscolher={(lei) => selecionar(lei.id)}
        />
      ) : null}

      <main className="area-mapa" hidden={abaTopo !== "Leis"}>
        <MapaPolitico
          visao={visao}
          base={base}
          indice={indice}
          fundo={fundo}
          aberta={aberta}
          onAbrir={setAberta}
          destaque={
            aberta && aberta !== PRESIDENCIA
              ? destaqueDaAba(leisDaArea(visao, aberta), filtroArea)
              : null
          }
          selecionado={selecionado}
          onSelecionar={selecionar}
          marcas={marcas}
          pulsos={pulsos}
          variacoes={variacoes}
          variacoesVoce={variacoesVoce}
          mostrarVariacoes={mostrarVariacoes}
          onAlternarVariacoes={() => setMostrarVariacoes((v) => !v)}
          painel={painel}
          painelEsquerdo={
            gruposAbertos && visao.grupos.length ? LARGURA_PAINEL_GRUPOS : 0
          }
          cobertura={cobertura}
        />

        {aberta && aberta !== PRESIDENCIA ? (
          <PainelDaArea
            key={aberta}
            visao={visao}
            aberta={aberta}
            selecionado={selecionado}
            filtro={filtroArea}
            onFiltro={setFiltroArea}
            onSelecionar={selecionar}
            onFechar={() => setAberta(null)}
          />
        ) : null}

        <PainelGrupos
          grupos={visao.grupos}
          aprovacao={aprovacao?.valor}
          humor={visao.humor}
          variacoes={variacoes}
          selecionado={selecionado}
          onSelecionar={selecionar}
          aberto={gruposAbertos}
          onAlternar={() => setGruposAbertos((a) => !a)}
          pressao={visao.pressao}
          onInvestigar={investigar}
          aba={abaGrupos}
          onAba={setAbaGrupos}
        />

        {janelas.map((j, camada) => {
          const comum = {
            visao,
            base,
            indice,
            desvio: j.desvio,
            onDesvio: (d: Desvio) => mover(j.id, d),
            onRetangulo: (r: Retangulo | null) => medir(j.id, r),
            camada,
            ativa: j.id === frente,
            onFocar: () => focar(j.id),
            onFechar: () => fechar(j.id),
            onSelecionar: selecionar,
          };
          const lei = visao.leis.find((l) => l.id === j.id);
          if (lei)
            return (
              <JanelaLei
                {...comum}
                key={j.id}
                partida={partida}
                lei={lei}
                horizonte={horizonte}
                onHorizonte={setHorizonte}
                onAplicar={aplicar}
                onRevogar={revogar}
                onPrevisao={guardarPrevisao}
              />
            );
          const bolha = bolhaPorId.get(j.id);
          if (bolha)
            return (
              <JanelaBolha
                {...comum}
                key={j.id}
                bolha={bolha}
                relatorio={relatorio}
                variacao={variacoes.get(bolha.id)}
              />
            );
          return null;
        })}

        {erroTurno ? (
          <div className="aviso-turno erro-turno" role="alert">
            <strong>O turno não pôde ser encerrado</strong>
            <p>{erroTurno}</p>
          </div>
        ) : null}

        {aviso ? (
          <div className="aviso-turno" role="status">
            <div className="aviso-topo">
              <strong>Turno {aviso.turno} encerrado</strong>
              <button
                type="button"
                onClick={() => setAviso(null)}
                aria-label="Fechar resumo"
              >
                <Icone nome={ICONE_INTERFACE.fechar} tamanho={16} />
              </button>
            </div>
            <JornalDoTurno jornal={aviso.ocorrencias} pressao={aviso.pressao} />
            <ResumoDoTurno
              aviso={aviso}
              variacoes={variacoes}
              variacoesVoce={variacoesVoce}
              bolhaPorId={bolhaPorId}
              onSelecionar={selecionar}
            />
          </div>
        ) : null}

        {visao.pressao?.alertas.length ? (
          <button
            type="button"
            className="alerta-pressao"
            onClick={() => {
              setGruposAbertos(true);
              setAbaGrupos("pressao");
            }}
            title="Grupos em preocupação nacional: clique para ver a pressão de cada um"
          >
            <Icone nome="alert-octagon-outline" tamanho={18} />
            <span>
              <b>Preocupação nacional:</b>{" "}
              {visao.pressao.grupos
                .filter((g) => visao.pressao!.alertas.includes(g.id))
                .map((g) => g.nome)
                .join(" · ")}
            </span>
          </button>
        ) : null}

        <AcontecendoAgora ocorrencias={visao.ocorrencias.emCurso} />
      </main>
    </div>
  );
}

function montarEstrutura(completa: ReturnType<typeof verPartida>) {
  // as leis fora de vigor (catálogo) e as setas delas não entram no mapa
  const fora = new Set(
    completa.leis
      .filter((l) => !l.emVigor && !l.sempreVisivel)
      .map((l) => l.id),
  );
  const visao = {
    ...completa,
    leis: completa.leis.filter((l) => l.emVigor || l.sempreVisivel),
    ligacoes: completa.ligacoes.filter(
      (g) =>
        !fora.has(g.origem) &&
        !fora.has(g.alvo) &&
        !fora.has(g.alvo.replace(/^eficacia:/, "")),
    ),
  };
  return {
    base: montarBase(visao),
    indice: indexarRelacoes(visao),
    fundo: ligacoesDeFundo(visao),
  };
}
