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
} from "../../app/partida";
import { Bandeira } from "./Bandeira";
import { diferenca, moeda } from "./formatos";
import { Icone } from "./Icone";
import { ICONE_BOLHA, ICONE_INTERFACE } from "./icones";
import { montarBase } from "./layout";
import { MapaPolitico, type MarcaPrevista } from "./MapaPolitico";
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
}: {
  icone: string;
  rotulo: string;
  valor: string;
  detalhe?: string;
  classe?: string;
  titulo?: string;
}) {
  return (
    <div className={`metrica ${classe ?? ""}`} title={titulo}>
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

function trimestre(turno: number) {
  return `${(turno % 4) + 1}º trimestre · ano ${Math.floor(turno / 4) + 1}`;
}

export function TelaPrincipal() {
  const inicial = useMemo(() => criarPartida(), []);
  const [partida, setPartida] = useState<Partida | null>(
    inicial.ok ? inicial.value : null,
  );
  const [aberta, setAberta] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [relatorio, setRelatorio] = useState<RelatorioTurno | null>(null);
  const [aviso, setAviso] = useState<RelatorioTurno | null>(null);
  const [erroTurno, setErroTurno] = useState<string | null>(null);
  const [pulsos, setPulsos] = useState<ReadonlySet<string>>(new Set());
  const [passando, setPassando] = useState(false);
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
      const antes = new Map(visao!.bolhas.map((b) => [b.id, b.valor]));
      const mudaram = new Map<string, number>();
      for (const b of verPartida(r.value.partida).bolhas) {
        const d = b.valor - (antes.get(b.id) ?? b.valor);
        if (Math.abs(d) / (b.maximo - b.minimo || 1) >= LIMIAR_ETIQUETA)
          mudaram.set(b.id, d);
      }
      setVariacoes(mudaram);
      setMostrarVariacoes(true);
      setPartida(r.value.partida);
      setRelatorio(r.value.relatorio);
      setAviso(r.value.relatorio);
      setPulsos(new Set(mudaram.keys()));
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
          <Metrica
            icone={ICONE_BOLHA.arrecadacao ?? ICONE_INTERFACE.caixa}
            rotulo="Receita"
            valor={`${moeda(contas.receita)}/ano`}
            detalhe={pctPib(contas.percentualPib.receita)}
            classe="neutra"
            titulo="Soma do que os impostos e as outras fontes arrecadam por ano."
          />
          <Metrica
            icone={ICONE_BOLHA.gasto_publico ?? ICONE_INTERFACE.caixa}
            rotulo="Gasto"
            valor={`${moeda(contas.gasto)}/ano`}
            detalhe={pctPib(contas.percentualPib.gasto)}
            classe="neutra"
            titulo="Soma do que as leis custam por ano, sem os juros."
          />
          <Metrica
            icone={ICONE_BOLHA.resultado_fiscal ?? ICONE_INTERFACE.caixa}
            rotulo={contas.resultado >= 0 ? "Superávit" : "Déficit"}
            valor={`${moeda(Math.abs(contas.resultado))}/ano`}
            detalhe={
              contas.juros >= 0
                ? `juros: ${moeda(contas.juros)}/ano`
                : `rendimento do cofre: ${moeda(-contas.juros)}/ano`
            }
            classe={contas.resultado >= 0 ? "boa" : "ruim"}
            titulo={`Receita − gasto − juros = ${moeda(contas.receita)} − ${moeda(contas.gasto)} − ${moeda(contas.juros)}. O déficit soma na dívida; o superávit abate a dívida e, sem dívida, enche o cofre.`}
          />
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
          <Metrica
            icone={ICONE_INTERFACE.aprovacao}
            rotulo="Aprovação do partido"
            valor="—"
            classe="indisponivel"
            titulo="A partida ainda não calcula a aprovação do partido."
          />
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
          mostrarVariacoes={mostrarVariacoes}
          onAlternarVariacoes={() => setMostrarVariacoes((v) => !v)}
          painel={painel}
          cobertura={cobertura}
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
            <p>
              {aviso.contas.resultado >= 0 ? "Superávit" : "Déficit"} de{" "}
              <b>{moeda(Math.abs(aviso.contas.resultado))}/ano</b>
              {Math.abs(aviso.contas.resultado - aviso.contasAntes.resultado) >=
              100 ? (
                <>
                  {" "}
                  (
                  {aviso.contas.resultado > aviso.contasAntes.resultado
                    ? "melhorou "
                    : "piorou "}
                  {moeda(
                    Math.abs(
                      aviso.contas.resultado - aviso.contasAntes.resultado,
                    ),
                  )}
                  )
                </>
              ) : null}
              ; a dívida foi a <b>{moeda(aviso.contas.divida)}</b>.
            </p>
            <div className="aviso-placar">
              <span className="melhora">
                ▲{" "}
                {
                  [...variacoes].filter(
                    ([id, d]) =>
                      efeitoDe(Math.sign(d), bolhaPorId.get(id)?.avaliacao) ===
                      "melhora",
                  ).length
                }{" "}
                melhoraram
              </span>
              <span className="piora">
                ▼{" "}
                {
                  [...variacoes].filter(
                    ([id, d]) =>
                      efeitoDe(Math.sign(d), bolhaPorId.get(id)?.avaliacao) ===
                      "piora",
                  ).length
                }{" "}
                pioraram
              </span>
            </div>
            <ul>
              {aviso.mudancas.slice(0, 4).map((m) => {
                const b = bolhaPorId.get(m.id);
                const d = m.depois - m.antes;
                return (
                  <li key={m.id}>
                    <button type="button" onClick={() => selecionar(m.id)}>
                      {m.nome}
                      <span
                        style={{
                          color:
                            COR_EFEITO[efeitoDe(Math.sign(d), b?.avaliacao)],
                        }}
                      >
                        {diferenca(d, b?.unidade ?? "")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
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
