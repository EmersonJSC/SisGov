/**
 * Tela principal: barra superior, mapa político e painel da seleção.
 *
 * Fala com o jogo só pela camada da partida (`src/app/partida.ts`).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  criarPartida,
  encerrarTurno,
  enviarAoCongresso,
  investigarGrupo,
  mudarLei,
  revogarLei,
  responderDilema,
  responderPedido,
  verPartida,
  verBussola,
  verTramitacao,
  type OpcoesDoEnvio,
  type Partida,
  type PrevisaoLei,
  type RelatorioTurno,
  type VisaoPartida,
  BOLHAS_DO_ORCAMENTO,
} from "../../app/partida";
import { Bandeira } from "./Bandeira";
import { diferenca, moeda } from "./formatos";
import { Icone } from "./Icone";
import { ICONE_BOLHA, ICONE_INTERFACE } from "./icones";
import { montarBase } from "./layout";
import { MapaPolitico, type MarcaPrevista } from "./MapaPolitico";
import {
  LARGURA_PAINEL_GRUPOS,
  PainelGrupos,
  type AbaDosGrupos,
} from "./PainelGrupos";
import { useModoNoturno } from "./modoNoturno";
import { BuscaDeLeis } from "./BuscaDeLeis";
import { CatalogoDeLeis } from "./CatalogoDeLeis";
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
import { efeitoDe, indexarRelacoes, ligacoesDeFundo } from "./relacoes";
import { COR_EFEITO } from "./tema";
import "./mapa.css";

/** Mudança mínima (fração da escala) para a bolha ganhar etiqueta no turno. */
const LIMIAR_ETIQUETA = 0.002;

function Metrica({
  icone,
  rotulo,
  valor,
  detalhe,
  classe,
  titulo,
  onClick,
}: {
  icone: string;
  rotulo: string;
  valor: string;
  detalhe?: string;
  classe?: string;
  titulo?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`metrica ${classe ?? ""}${onClick ? " clicavel" : ""}`}
      title={titulo}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      <span className="metrica-icone">
        <Icone nome={icone} tamanho={22} />
      </span>
      <span>
        <small>{rotulo}</small>
        <strong>{valor}</strong>
        {detalhe ? <em>{detalhe}</em> : null}
      </span>
    </div>
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

export function TelaPrincipal() {
  // cada partida nova ganha uma semente própria: eventos diferentes (SG106)
  const inicial = useMemo(
    () =>
      // V1-12: as leis passam pelo Congresso (modo real)
      criarPartida({
        semente: 1 + Math.floor(Math.random() * 0xfffffffe),
        modo: "real",
      }),
    [],
  );
  const [buscaAberta, setBuscaAberta] = useState(false);
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
  const [selecionado, setSelecionado] = useState<string | null>(null);
  // lista dos grupos aberta de saída em telas largas (SG143)
  const [gruposAbertos, setGruposAbertos] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 1200,
  );
  const [abaGrupos, setAbaGrupos] = useState<AbaDosGrupos>("eleitorado");
  const [relatorio, setRelatorio] = useState<RelatorioTurno | null>(null);
  const [aviso, setAviso] = useState<RelatorioTurno | null>(null);
  /** A visão antes do último turno: o jornal compara com ela. */
  const [visaoAnterior, setVisaoAnterior] = useState<VisaoPartida | null>(null);
  /** Valores de cada turno já passado: as linhas de evolução do jornal. */
  const [historico, setHistorico] = useState<readonly FotoDoTurno[]>([]);
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
  // V1-13: dilemas e pedidos do Congresso esperando no tablet
  const avisosNoTablet =
    (visao?.ocorrencias.mesa.length ?? 0) + (congresso?.pedidos.length ?? 0);
  // A estrutura (leis, bolhas, ligações) só muda quando uma lei entra em
  // vigor ou é revogada (D-65): refaz só nessa hora.
  const estrutura = useRef<ReturnType<typeof montarEstrutura> | null>(null);
  const chaveEstrutura = useRef("");
  if (visao) {
    const chave = visao.leis
      .filter((l) => l.emVigor)
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

  const passarTurno = () => {
    if (!partida || passando) return;
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
      setTablet("jornal");
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
  const grupos = visao.bolhas.filter((b) => b.tipo === "grupo");
  const gruposContentes = grupos.filter((g) => g.valor >= 50).length;
  // Os documentos são janelas soltas sobre o mapa: a câmera não desvia para
  // o lado; o mapa só desliza quando a janela da frente esconde a seleção.
  const painel = 0;
  const cobertura =
    selecionado && selecionado === frente
      ? (retangulos.get(selecionado) ?? null)
      : null;
  const bolhaPorId = new Map(visao.bolhas.map((b) => [b.id, b]));

  return (
    <div className="tela">
      <header className="barra-superior" data-borda-rola>
        <div className="pais">
          <Bandeira pais={visao.pais} />
          <div>
            <strong>{visao.pais.toUpperCase()}</strong>
            <small>SisGov</small>
          </div>
        </div>
        <div className="metricas">
          <ContasDoGoverno contas={contas} onAbrir={selecionar} />
          <Metrica
            icone={ICONE_INTERFACE.divida}
            rotulo="Dívida"
            valor={moeda(contas.divida)}
            detalhe={pctPib(contas.percentualPib.divida)}
            classe="ruim"
            titulo={`PIB de ${moeda(contas.pib)}/ano. A lei 'Destino do resultado fiscal' decide quanto do superávit paga a dívida.`}
          />
          {contas.cofre > 0 ? (
            <Metrica
              icone={ICONE_INTERFACE.caixa}
              rotulo="Cofre"
              valor={moeda(contas.cofre)}
              detalhe={pctPib(contas.percentualPib.cofre)}
              classe="boa"
              titulo="Superávit guardado; rende juros. Acima do teto, o que entra vai para a dívida. A lei 'Uso do cofre' decide o que fazer com ele."
            />
          ) : null}
          {aprovacao ? (
            <Metrica
              icone={ICONE_INTERFACE.aprovacao}
              rotulo="Aprovação"
              valor={`${aprovacao.valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%`}
              detalhe={`${gruposContentes}/${grupos.length} segmentos satisfeitos`}
              classe={
                aprovacao.valor >= 50
                  ? "boa"
                  : aprovacao.valor >= 35
                    ? "neutra"
                    : "ruim"
              }
              titulo="Parte do eleitorado que aprova o governo. Cada perfil de eleitor aprova conforme a satisfação dos segmentos em que está (renda, ocupação, valores, religião, território, idade e família, meio ambiente). Clique para ver cada segmento."
              onClick={() => selecionar(aprovacao.id)}
            />
          ) : null}
        </div>
        <button
          type="button"
          className="botao-busca"
          onClick={() => setTablet("inicio")}
          title="Tablet: notificações, jornal, rede, Congresso e bússola"
        >
          <Icone nome={ICONE_INTERFACE.tablet} tamanho={22} />
          <span>Tablet</span>
          {avisosNoTablet ? (
            <span className="tb-contador">{avisosNoTablet}</span>
          ) : null}
        </button>
        <button
          type="button"
          className="botao-busca"
          onClick={() => setBuscaAberta(true)}
          title="Buscar lei ou indicador (atalho: / ou Ctrl+K)"
        >
          <Icone nome={ICONE_INTERFACE.busca} tamanho={22} />
          <span>Buscar lei</span>
        </button>
        <button
          type="button"
          className="botao-busca"
          onClick={() => setCatalogoAberto(true)}
          title="Leis que hoje não valem: aprove uma para pôr no mapa"
        >
          <Icone nome={ICONE_INTERFACE.catalogo} tamanho={22} />
          <span>Leis fora do mapa</span>
        </button>
        <button
          type="button"
          className="botao-busca"
          onClick={() => setSalvarAberto(true)}
          title="Salvar ou carregar a partida"
        >
          <Icone nome={ICONE_INTERFACE.partida} tamanho={22} />
          <span>Salvar</span>
        </button>
        <button
          type="button"
          className="botao-busca botao-tema"
          onClick={alternarTema}
          aria-label={tema === "noturno" ? "Modo claro" : "Modo noturno"}
          title={tema === "noturno" ? "Modo claro" : "Modo noturno"}
        >
          <Icone
            nome={
              tema === "noturno"
                ? ICONE_INTERFACE.claro
                : ICONE_INTERFACE.noturno
            }
            tamanho={22}
          />
        </button>
        <div className="turno">
          <Icone nome={ICONE_INTERFACE.turno} tamanho={20} />
          <span>
            <small>Turno {visao.turno + 1}</small>
            <strong>{trimestre(visao.turno)}</strong>
          </span>
        </div>
      </header>

      {jornalAberto ? (
        <PaginaDeJornal
          edicao={montarJornal(
            visao,
            visaoAnterior,
            relatorio,
            historico,
            visaoDaBussola?.rumo,
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

      <main className="area-mapa">
        <MapaPolitico
          visao={visao}
          base={base}
          indice={indice}
          fundo={fundo}
          aberta={aberta}
          onAbrir={setAberta}
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

        <PainelGrupos
          grupos={visao.grupos}
          aprovacao={aprovacao?.valor}
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

        <button
          type="button"
          className={`botao-turno${passando ? " ocupado" : ""}${visao.ocorrencias.mesa.length ? " travado" : ""}`}
          onClick={passarTurno}
          disabled={passando}
          title={
            visao.ocorrencias.mesa.length
              ? "Responda os dilemas nas notificações do tablet para encerrar o turno"
              : undefined
          }
        >
          <span>
            {passando
              ? "Calculando…"
              : visao.ocorrencias.mesa.length
                ? "Responder dilema"
                : "Encerrar turno"}
          </span>
          <Icone nome={ICONE_INTERFACE.seguir} tamanho={22} />
        </button>
      </main>
    </div>
  );
}

function montarEstrutura(completa: ReturnType<typeof verPartida>) {
  // as leis fora de vigor (catálogo) e as setas delas não entram no mapa
  const fora = new Set(
    completa.leis.filter((l) => !l.emVigor).map((l) => l.id),
  );
  const visao = {
    ...completa,
    leis: completa.leis.filter((l) => l.emVigor),
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
