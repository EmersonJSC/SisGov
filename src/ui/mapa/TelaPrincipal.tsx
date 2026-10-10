/**
 * Tela principal: barra superior, mapa político e painel da seleção.
 *
 * Fala com o jogo só pela camada da partida (`src/app/partida.ts`).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  criarPartida,
  encerrarTurno,
  mudarLei,
  verPartida,
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
import { LARGURA_PAINEL_GRUPOS, PainelGrupos } from "./PainelGrupos";
import {
  MES_DO_HORIZONTE,
  type Desvio,
  type Horizonte,
  type Retangulo,
} from "./Documentos";
import { JanelaBolha, JanelaLei, abrirJanela, type Janela } from "./Janelas";
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
  const destino = sobra
    ? contas.divida > 0
      ? "abate a dívida"
      : "vai para o cofre"
    : contas.cofre > 0
      ? "sai do cofre"
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
            ? "Superávit: sobra dinheiro no ano. Primeiro paga a dívida; sem dívida, enche o cofre."
            : "Déficit: falta dinheiro no ano. A falta é paga com dívida nova (ou com o cofre, se houver)."
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
        {aviso.leisAlteradas === 0 ? (
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
              <span className="leis-suas">
                {aviso.leisAlteradas}{" "}
                {aviso.leisAlteradas === 1 ? "lei mudada" : "leis mudadas"}
              </span>
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
  const inicial = useMemo(() => criarPartida(), []);
  const [partida, setPartida] = useState<Partida | null>(
    inicial.ok ? inicial.value : null,
  );
  const [aberta, setAberta] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  // lista dos grupos aberta de saída em telas largas (SG143)
  const [gruposAbertos, setGruposAbertos] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 1200,
  );
  const [relatorio, setRelatorio] = useState<RelatorioTurno | null>(null);
  const [aviso, setAviso] = useState<RelatorioTurno | null>(null);
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
  // A estrutura (leis, bolhas, ligações) não muda entre turnos: calcula uma vez.
  const estrutura = useRef<ReturnType<typeof montarEstrutura> | null>(null);
  if (visao && !estrutura.current) estrutura.current = montarEstrutura(visao);

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

  const aplicar = (leiId: string, nivel: number): string | null => {
    if (!partida) return null;
    const r = mudarLei(partida, leiId, nivel);
    if (!r.ok) return r.erros.join(" ");
    setPartida(r.value);
    return null;
  };

  const passarTurno = () => {
    if (!partida || passando) return;
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
      setPartida(r.value.partida);
      setRelatorio(r.value.relatorio);
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
  // SG143: aprovação = média dos grupos sociais pelo peso no eleitorado
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
      <header className="barra-superior">
        <div className="pais">
          <Bandeira pais={visao.pais} />
          <div>
            <strong>{visao.pais.toUpperCase()}</strong>
            <small>SisGov</small>
          </div>
        </div>
        <div className="metricas">
          <ContasDoGoverno contas={contas} onAbrir={selecionar} />
          {contas.cofre > 0 ? (
            <Metrica
              icone={ICONE_INTERFACE.caixa}
              rotulo="Cofre"
              valor={moeda(contas.cofre)}
              detalhe={pctPib(contas.percentualPib.cofre)}
              classe="boa"
              titulo="A dívida acabou: o superávit fica guardado aqui e rende juros. A lei 'Uso do cofre' decide o que fazer com ele."
            />
          ) : (
            <Metrica
              icone={ICONE_INTERFACE.divida}
              rotulo="Dívida"
              valor={moeda(contas.divida)}
              detalhe={pctPib(contas.percentualPib.divida)}
              classe="ruim"
              titulo={`PIB de ${moeda(contas.pib)}/ano. Quando a dívida acaba, o superávit vai para o cofre.`}
            />
          )}
          {aprovacao ? (
            <Metrica
              icone={ICONE_INTERFACE.aprovacao}
              rotulo="Aprovação do governo"
              valor={`${aprovacao.valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%`}
              detalhe={`${gruposContentes} de ${grupos.length} grupos satisfeitos`}
              classe={
                aprovacao.valor >= 50
                  ? "boa"
                  : aprovacao.valor >= 35
                    ? "neutra"
                    : "ruim"
              }
              titulo="Média da satisfação dos grupos sociais, pelo peso de cada um no eleitorado. Clique para ver cada grupo."
              onClick={() => selecionar(aprovacao.id)}
            />
          ) : null}
        </div>
        <div className="turno">
          <Icone nome={ICONE_INTERFACE.turno} tamanho={20} />
          <span>
            <small>Turno {visao.turno + 1}</small>
            <strong>{trimestre(visao.turno)}</strong>
          </span>
        </div>
      </header>

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
            <ResumoDoTurno
              aviso={aviso}
              variacoes={variacoes}
              variacoesVoce={variacoesVoce}
              bolhaPorId={bolhaPorId}
              onSelecionar={selecionar}
            />
          </div>
        ) : null}

        <button
          type="button"
          className={`botao-turno${passando ? " ocupado" : ""}`}
          onClick={passarTurno}
          disabled={passando}
        >
          <span>{passando ? "Calculando…" : "Encerrar turno"}</span>
          <Icone nome={ICONE_INTERFACE.seguir} tamanho={22} />
        </button>
      </main>
    </div>
  );
}

function montarEstrutura(visao: ReturnType<typeof verPartida>) {
  return {
    base: montarBase(visao),
    indice: indexarRelacoes(visao),
    fundo: ligacoesDeFundo(visao),
  };
}
