/**
 * PROTÓTIPO do Pregão (bolsa moderna, no lugar da fatia 8). Só tela: o motor
 * não sabe dele, o cofre real não muda. Serve para o autor sentir a mecânica.
 *
 * Comportamento:
 * - Cada empresa do país (empresas.json) vale uma fração do PIB; um bloco é 2% dela.
 * - Vender: cada comprador tem um lance por bloco. "Vender 2%" entrega o bloco
 *   àquele comprador, o dinheiro entra no cofre, o lance dele cai e o dos
 *   outros cai um pouco. Estado abaixo de 50% perde o controle.
 * - Comprar: cada dono tem um preço pedido. "Comprar 2%" tira o bloco dele,
 *   o dinheiro sai do cofre e o pedido dele sobe.
 * - Tudo no mesmo turno. No turno seguinte os preços voltam metade do caminho
 *   ao normal: esperar paga melhor, mas é escolha.
 * - Nenhum comprador é neutro: cada bloco agrada um lado e custa outro.
 */
import { useEffect } from "react";
import type { EmpresaDoPais, Partida } from "../../partida";
import { Documento, type JanelaProps } from "./DocumentoLei";
import { dinheiro } from "./formatos";
import { ICONE_INTERFACE } from "./icones";

type Dono = "estado" | "pops" | "fundo" | "multi" | "estrangeira";

interface Ator {
  nome: string;
  quem: string;
  /** lance (venda) e pedido (compra) normais, em vezes o valor justo do bloco */
  lance: number;
  pedido: number;
  /** quanto o lance cai / o pedido sobe a cada bloco com ele */
  passo: number;
  ganho: string;
  custo: string;
}

const ATORES: Record<Exclude<Dono, "estado">, Ator> = {
  pops: {
    nome: "Pops (classe média)",
    quem: "pequenos investidores",
    lance: 0.85,
    pedido: 1.05,
    passo: 0.1,
    ganho: "classe média gosta",
    custo: "paga pouco, cansa rápido",
  },
  fundo: {
    nome: "Fundo de pensão nacional",
    quem: "aposentadoria dos trabalhadores",
    lance: 0.95,
    pedido: 1.0,
    passo: 0.06,
    ganho: "trabalhadores gostam, dividendo fica no país",
    custo: "trava demissões: lucro da empresa cai",
  },
  multi: {
    nome: "Kestra (multinacional)",
    quem: "República do Norte",
    lance: 1.1,
    pedido: 1.15,
    passo: 0.04,
    ganho: "paga bem, República do Norte fica amiga",
    custo: "lucro vai embora (remessa)",
  },
  estrangeira: {
    nome: "Varn Energia (estatal estrangeira)",
    quem: "República Popular do Oriente",
    lance: 1.25,
    pedido: 1.3,
    passo: 0.04,
    ganho: "maior lance",
    custo: "com 10% ou mais, o Oriente ganha voz na empresa",
  },
};
const ORDEM = Object.keys(ATORES) as Exclude<Dono, "estado">[];
const BLOCO = 0.02;

export interface EstadoPregao {
  turno: number;
  /** empresa aberta na janela */
  atual: string;
  /** fatia de cada dono em cada empresa, em blocos de 2% (soma 50) */
  empresas: Record<string, Record<Dono, number>>;
  /** multiplicador atual do preço de cada ator (1 = normal) */
  pressao: Record<Exclude<Dono, "estado">, number>;
  cofre: number;
  efeitos: Record<string, number>;
  registro: string[];
}

/** O que não é do Estado se reparte entre os compradores (5 : 4 : 6 : 4). */
function donos(estado: number): Record<Dono, number> {
  const resto = 50 - estado;
  const peso = { pops: 5, fundo: 4, multi: 6, estrangeira: 4 };
  const total = 19;
  const b = {
    pops: Math.round((resto * peso.pops) / total),
    fundo: Math.round((resto * peso.fundo) / total),
    multi: Math.round((resto * peso.multi) / total),
    estrangeira: 0,
  };
  b.estrangeira = resto - b.pops - b.fundo - b.multi;
  return { estado, ...b };
}

export function pregaoInicial(
  turno: number,
  empresas: EmpresaDoPais[],
): EstadoPregao {
  return {
    turno,
    atual: empresas[0]?.id ?? "",
    empresas: Object.fromEntries(empresas.map((e) => [e.id, donos(e.estado)])),
    pressao: { pops: 1, fundo: 1, multi: 1, estrangeira: 1 },
    cofre: 0,
    efeitos: {},
    registro: [],
  };
}

/** Turno novo: os preços voltam metade do caminho ao normal. */
export function pregaoNoTurno(p: EstadoPregao, turno: number): EstadoPregao {
  if (turno === p.turno) return p;
  const pressao = { ...p.pressao };
  for (const k of ORDEM) pressao[k] = 1 + (pressao[k] - 1) / 2;
  return { ...p, turno, pressao, registro: [] };
}

/** Efeitos em que subir é ruim para o país (os outros: subir é bom). */
const RUINS = new Set([
  "Remessa ao exterior",
  "Voz do Oriente na empresa",
  "Estado perdeu o controle",
]);

const soma = (e: Record<string, number>, mais: Record<string, number>) => {
  const r = { ...e };
  for (const [k, v] of Object.entries(mais)) r[k] = (r[k] ?? 0) + v;
  return r;
};

/** Efeitos de um bloco que muda de mãos (sinal + quando o ator recebe). */
function efeitosDoBloco(
  ator: Exclude<Dono, "estado">,
  s: 1 | -1,
): Record<string, number> {
  switch (ator) {
    case "pops":
      return { "Classe média": 2 * s };
    case "fundo":
      return { Trabalhadores: 2 * s, "Lucro da empresa": -1 * s };
    case "multi":
      return { "República do Norte": 3 * s, "Remessa ao exterior": 1 * s };
    case "estrangeira":
      return { "República Popular do Oriente": 3 * s };
  }
}

export function Pregao({
  partida,
  empresas,
  pregao,
  setPregao,
  onFechar,
  ...janela
}: JanelaProps & {
  partida: Partida;
  empresas: EmpresaDoPais[];
  pregao: EstadoPregao;
  setPregao: (p: EstadoPregao) => void;
  onFechar: () => void;
}) {
  const turno = partida.estado.turno;
  useEffect(() => {
    if (pregao.turno !== turno) setPregao(pregaoNoTurno(pregao, turno));
  }, [turno]);

  const simbolo = partida.moeda;
  const empresa = empresas.find((e) => e.id === pregao.atual) ?? empresas[0];
  if (!empresa) return null;
  const blocos = pregao.empresas[empresa.id]!;
  const justo = partida.estado.essenciais.pib_nominal * empresa.valor * BLOCO;
  const mudaBlocos = (novos: Record<Dono, number>) => ({
    ...pregao.empresas,
    [empresa.id]: novos,
  });
  const din = (v: number) => dinheiro(v, simbolo);
  const { pressao } = pregao;
  const pct = (b: number) => `${b * 2}%`;
  const lance = (a: Exclude<Dono, "estado">) =>
    justo * ATORES[a].lance * pressao[a];
  const pedido = (a: Exclude<Dono, "estado">) =>
    justo * ATORES[a].pedido * (2 - pressao[a]);

  const vender = (a: Exclude<Dono, "estado">) => {
    if (blocos.estado <= 0) return;
    const valor = lance(a);
    const novaPressao = { ...pressao };
    for (const k of ORDEM)
      novaPressao[k] = Math.max(
        0.3,
        novaPressao[k] - (k === a ? ATORES[a].passo : 0.01),
      );
    let efeitos = soma(pregao.efeitos, efeitosDoBloco(a, 1));
    const novos = { ...blocos, estado: blocos.estado - 1, [a]: blocos[a] + 1 };
    if (a === "estrangeira" && novos.estrangeira === 5)
      efeitos = soma(efeitos, { "Voz do Oriente na empresa": 1 });
    if (blocos.estado === 26 && novos.estado === 25)
      efeitos = soma(efeitos, { "Estado perdeu o controle": 1 });
    setPregao({
      ...pregao,
      empresas: mudaBlocos(novos),
      pressao: novaPressao,
      cofre: pregao.cofre + valor,
      efeitos,
      registro: [
        `${empresa.nome}: vendeu 2% a ${ATORES[a].nome} por ${din(valor)}`,
        ...pregao.registro,
      ],
    });
  };

  const comprar = (a: Exclude<Dono, "estado">) => {
    if (blocos[a] <= 0) return;
    const valor = pedido(a);
    const novaPressao = {
      ...pressao,
      [a]: Math.max(0.3, pressao[a] - ATORES[a].passo),
    };
    const novos = { ...blocos, estado: blocos.estado + 1, [a]: blocos[a] - 1 };
    let efeitos = soma(pregao.efeitos, efeitosDoBloco(a, -1));
    // comprar de estrangeiro irrita mais do que só desfaz a amizade
    if (a === "multi" || a === "estrangeira")
      efeitos = soma(efeitos, { "Confiança dos investidores": -1 });
    if (a === "estrangeira" && blocos.estrangeira === 5)
      efeitos = soma(efeitos, { "Voz do Oriente na empresa": -1 });
    if (blocos.estado === 25 && novos.estado === 26)
      efeitos = soma(efeitos, { "Estado perdeu o controle": -1 });
    setPregao({
      ...pregao,
      empresas: mudaBlocos(novos),
      pressao: novaPressao,
      cofre: pregao.cofre - valor,
      efeitos,
      registro: [
        `${empresa.nome}: comprou 2% de ${ATORES[a].nome} por ${din(valor)}`,
        ...pregao.registro,
      ],
    });
  };

  const efeitos = Object.entries(pregao.efeitos).filter(([, v]) => v !== 0);
  const controle = blocos.estado > 25;

  return (
    <Documento
      orgao="Bolsa"
      setor="Pregão (protótipo)"
      numero={`Turno ${turno + 1}`}
      cor="#3d6b66"
      icone={ICONE_INTERFACE.pib}
      onFechar={onFechar}
      rotulo="Pregão"
      {...janela}
    >
      <div className="folha mercado-janela pregao-janela">
        <div className="mercado-abas" role="tablist">
          {empresas.map((e) => (
            <button
              key={e.id}
              role="tab"
              aria-selected={e.id === empresa.id}
              className={e.id === empresa.id ? "ativa" : ""}
              onClick={() => setPregao({ ...pregao, atual: e.id })}
            >
              {e.nome.split(" · ")[0]}
            </button>
          ))}
        </div>
        <h2 className="pregao-titulo">
          {empresa.nome} <small>({empresa.setor})</small>
        </h2>
        <p className="ficha-estado">
          Estado: <strong>{pct(blocos.estado)}</strong>{" "}
          {controle ? (
            "(controla)"
          ) : (
            <b className="ficha-alerta">(sem controle)</b>
          )}
          {" · "}Valor justo do bloco de 2%: <strong>{din(justo)}</strong>
        </p>
        <div className="pregao-barra" aria-hidden>
          {(["estado", ...ORDEM] as Dono[]).map((d) => (
            <span
              key={d}
              className={`pregao-fatia ${d}`}
              style={{ flexGrow: blocos[d] }}
              title={`${d === "estado" ? "Estado" : ATORES[d].nome}: ${pct(blocos[d])}`}
            />
          ))}
          <i className="pregao-meio" />
        </div>
        <table className="pregao-livro">
          <thead>
            <tr>
              <th>Quem</th>
              <th>Tem</th>
              <th>Paga por 2%</th>
              <th />
              <th>Pede por 2%</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {ORDEM.map((a) => (
              <tr key={a}>
                <td>
                  <span className={`pregao-ponto ${a}`} />
                  <strong>{ATORES[a].nome}</strong>
                  <small>
                    <span className="mais">+ {ATORES[a].ganho}</span>
                    <span className="menos">− {ATORES[a].custo}</span>
                  </small>
                </td>
                <td>{pct(blocos[a])}</td>
                <td>{din(lance(a))}</td>
                <td>
                  <button
                    type="button"
                    className="pregao-vender"
                    disabled={blocos.estado <= 0}
                    onClick={() => vender(a)}
                  >
                    Vender 2%
                  </button>
                </td>
                <td>{blocos[a] > 0 ? din(pedido(a)) : "—"}</td>
                <td>
                  <button
                    type="button"
                    className="pregao-comprar"
                    disabled={blocos[a] <= 0}
                    onClick={() => comprar(a)}
                  >
                    Comprar 2%
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <section className="ficha-aviso pregao-saldo">
          <h2>
            Cofre:{" "}
            <span className={pregao.cofre < 0 ? "menos" : "mais"}>
              {pregao.cofre >= 0 ? "+" : ""}
              {din(pregao.cofre)}
            </span>
          </h2>
          {efeitos.length ? (
            <ul className="pregao-efeitos">
              {efeitos.map(([k, v]) => (
                <li
                  key={k}
                  className={v > 0 !== RUINS.has(k) ? "mais" : "menos"}
                >
                  {k} {v > 0 ? "+" : ""}
                  {v}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              Clique em Vender ou Comprar numa linha para negociar um bloco.
            </p>
          )}
          <p className="pregao-dica">
            Cada bloco com o mesmo comprador sai mais barato (venda) ou mais
            caro (compra). No próximo turno os preços voltam metade do caminho.
          </p>
        </section>
        {pregao.registro.length ? (
          <ol className="pregao-registro">
            {pregao.registro.slice(0, 6).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        ) : null}
        <div className="ficha-botoes">
          <button type="button" className="aba-topo" onClick={onFechar}>
            Encerrar pregão
          </button>
        </div>
      </div>
    </Documento>
  );
}
