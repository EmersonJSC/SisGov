/**
 * Gerador de personagens (V1-39, docs/v1/desenho/eleicao.md, seção 3).
 *
 * Um personagem tem lado e ideologia só por dentro. O jogador lê a biografia
 * e as opiniões, mais sutis ou mais explícitas conforme a franqueza dele.
 */
import {
  distancia,
  referenciasDaBussola,
  type PontoDaBussola,
} from "../bussola";
import type {
  Carreira,
  EleicaoDoPais,
  Ideologia,
  MundoDosPersonagens,
  Personagem,
  PessoaReal,
} from "./tipos";

/** Sorteio com semente (mulberry32): `usados` diz quantos já saíram. */
export type Sorte = Readonly<{
  numero: () => number;
  normal: () => number;
  inteiro: (min: number, max: number) => number;
  escolher: <T>(lista: readonly T[]) => T;
  usados: () => number;
}>;

export function criarSorte(semente: number, usados = 0): Sorte {
  let estado = semente >>> 0;
  let n = 0;
  const proximo = () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    n += 1;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < usados; i++) proximo();
  const numero = () => proximo();
  return {
    numero,
    normal: () => {
      const u = Math.max(numero(), 1e-12);
      const v = numero();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    inteiro: (min, max) => min + Math.floor(numero() * (max - min + 1)),
    escolher: (lista) => lista[Math.floor(numero() * lista.length)],
    usados: () => n,
  };
}

const limitar = (x: number, min: number, max: number) =>
  Math.max(min, Math.min(max, x));

/** Centro de cada ideologia: a média dos partidos de referência. */
export function centroDaIdeologia(ideologia: Ideologia): PontoDaBussola {
  const partidos = new Map(referenciasDaBussola.partidos.map((p) => [p.id, p]));
  const refs = ideologia.referencias.map((id) => {
    const p = partidos.get(id);
    if (!p)
      throw new Error(
        `Ideologia ${ideologia.id}: referência ${id} não existe.`,
      );
    return p;
  });
  const media = (eixo: "economia" | "costumes") =>
    refs.reduce((s, p) => s + p[eixo], 0) / refs.length;
  return { economia: media("economia"), costumes: media("costumes") };
}

/** A ideologia mais perto de um ponto (para as pessoas reais). */
export function ideologiaMaisPerto(
  mundo: MundoDosPersonagens,
  ponto: PontoDaBussola,
): Ideologia {
  return mundo.ideologias.reduce((melhor, i) =>
    distancia(centroDaIdeologia(i), ponto) <
    distancia(centroDaIdeologia(melhor), ponto)
      ? i
      : melhor,
  );
}

function escolherPeso<T extends { peso: number }>(
  sorte: Sorte,
  lista: readonly T[],
): T {
  const total = lista.reduce((s, x) => s + x.peso, 0);
  let r = sorte.numero() * total;
  for (const x of lista) {
    r -= x.peso;
    if (r <= 0) return x;
  }
  return lista[lista.length - 1];
}

function embaralhar<T>(sorte: Sorte, lista: readonly T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(sorte.numero() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Opiniões: um tema por frase; em cada tema, a frase mais perto do ponto
 * entre as intensidades que a franqueza usa. As mais francas forçam frases
 * explícitas nos temas em que o personagem não está no meio.
 */
export function opinioesDe(
  mundo: MundoDosPersonagens,
  sorte: Sorte,
  ponto: PontoDaBussola,
  franqueza: number,
  ideologia: Ideologia,
): string[] {
  const permitidas = mundo.franqueza[String(franqueza)] ?? [1];
  let explicitas = mundo.explicitasDaFranqueza[String(franqueza)] ?? 0;
  const temas = embaralhar(sorte, [
    ...new Set(mundo.opinioes.map((o) => o.tema)),
  ]);
  const [minimo, maximo] = mundo.opinioesPorPersonagem;
  const quantas = sorte.inteiro(minimo, maximo);
  const frases: string[] = franqueza >= 3 ? [ideologia.explicita] : [];
  for (const tema of temas) {
    if (frases.length >= quantas) break;
    const doTema = mundo.opinioes.filter((o) => o.tema === tema);
    const eixo = doTema[0].eixo;
    const forte = explicitas > 0 && Math.abs(ponto[eixo]) >= 3;
    const candidatas = doTema.filter((o) =>
      forte ? o.intensidade === 3 : permitidas.includes(o.intensidade),
    );
    if (candidatas.length === 0) continue;
    const melhor = candidatas.reduce((a, b) =>
      Math.abs(b.posicao - ponto[eixo]) < Math.abs(a.posicao - ponto[eixo])
        ? b
        : a,
    );
    if (forte) explicitas -= 1;
    frases.push(melhor.texto);
  }
  return frases;
}

const preencher = (molde: string, campos: Record<string, string>) =>
  molde.replace(/\{(\w+)\}/g, (_, k: string) => campos[k] ?? "").trim();

/** Um personagem gerado do nada, do lado pedido (ou de qualquer um). */
export function gerarPersonagem(
  mundo: MundoDosPersonagens,
  pais: EleicaoDoPais,
  sorte: Sorte,
  lado?: string,
): Personagem {
  const doLado = mundo.ideologias.filter((i) => !lado || i.lado === lado);
  const ideologia = sorte.escolher(
    doLado.length > 0 ? doLado : mundo.ideologias,
  );
  const centro = centroDaIdeologia(ideologia);
  const ponto = {
    economia: limitar(centro.economia + sorte.normal() * mundo.desvio, -10, 10),
    costumes: limitar(centro.costumes + sorte.normal() * mundo.desvio, -10, 10),
  };
  const carreiras = new Map(mundo.carreiras.map((c) => [c.id, c]));
  const daIdeologia = ideologia.carreiras
    .map((id) => carreiras.get(id))
    .filter((c): c is Carreira => c !== undefined);
  const carreira =
    sorte.numero() < 0.8 && daIdeologia.length > 0
      ? sorte.escolher(daIdeologia)
      : sorte.escolher(mundo.carreiras);
  const genero = sorte.numero() < 0.5 ? "m" : "f";
  const sobrenome1 = sorte.escolher(pais.sobrenomes);
  let sobrenome2 = sorte.escolher(pais.sobrenomes);
  if (sobrenome2 === sobrenome1) sobrenome2 = sorte.escolher(pais.sobrenomes);
  const nome = `${sorte.escolher(pais.nomes[genero])} ${sobrenome1} ${sobrenome2}`;
  const idade = sorte.inteiro(mundo.idade[0], mundo.idade[1]);
  const estado = escolherPeso(sorte, pais.estados).nome;
  const franqueza = limitar(sorte.inteiro(0, 3) + carreira.franqueza, 0, 3);
  const opinioes = opinioesDe(mundo, sorte, ponto, franqueza, ideologia);
  const biografia = preencher(mundo.molde, {
    nome,
    idade: String(idade),
    estado,
    carreira: carreira.frase,
    caminho: sorte.escolher(mundo.caminhos),
  });
  return {
    id: `p${sorte.usados()}`,
    nome,
    real: false,
    genero,
    nascimento: pais.anoInicial - idade,
    estado,
    carreira: carreira.nome[genero],
    ponto,
    lado: ideologia.lado,
    ideologia: ideologia.id,
    carisma: sorte.inteiro(carreira.carisma[0], carreira.carisma[1]),
    experiencia: sorte.inteiro(
      carreira.experiencia[0],
      carreira.experiencia[1],
    ),
    franqueza,
    biografia,
    opinioes,
    segmentos: carreira.segmentos,
  };
}

/**
 * Uma pessoa real: ponto do V-Party, só fatos públicos. Não ganha frases
 * inventadas: a biografia (cargos e partido) é o que o jogador lê.
 */
export function pessoaReal(
  mundo: MundoDosPersonagens,
  pais: EleicaoDoPais,
  pessoa: PessoaReal,
): Personagem {
  const ref = referenciasDaBussola.personalidades.find(
    (p) => p.id === pessoa.referencia,
  );
  if (!ref) throw new Error(`Pessoa real ${pessoa.id}: sem ponto na bússola.`);
  const ponto = { economia: ref.economia, costumes: ref.costumes };
  const ideologia = ideologiaMaisPerto(mundo, ponto);
  const idade = pais.anoInicial - pessoa.nascimento;
  return {
    id: `real-${pessoa.id}`,
    nome: pessoa.nome,
    real: true,
    genero: pessoa.genero,
    nascimento: pessoa.nascimento,
    estado: pessoa.estado,
    carreira: "",
    ponto,
    lado: ideologia.lado,
    ideologia: ideologia.id,
    carisma: 2,
    experiencia: Math.min(3, pessoa.cargos),
    franqueza: 2,
    biografia: `${pessoa.nome}, ${idade} anos, nasceu em ${pessoa.estado}. ${pessoa.biografia}`,
    opinioes: [],
    segmentos: [],
  };
}

/**
 * Os nomes que o partido pode escolher: pelo menos um de cada lado, mais
 * pessoas reais se o país deixar.
 */
export function gerarEscolha(
  mundo: MundoDosPersonagens,
  pais: EleicaoDoPais,
  sorte: Sorte,
  quantidade = pais.escolha.quantidade,
): Personagem[] {
  const lados = [...new Set(mundo.ideologias.map((i) => i.lado))];
  const reais =
    pais.personagensReais && pais.reais.length > 0
      ? embaralhar(sorte, pais.reais)
          .slice(0, Math.min(pais.escolha.reais, quantidade - lados.length))
          .map((p) => pessoaReal(mundo, pais, p))
      : [];
  const gerados: Personagem[] = [];
  for (let i = 0; gerados.length + reais.length < quantidade; i++)
    gerados.push(
      gerarPersonagem(
        mundo,
        pais,
        sorte,
        i < lados.length ? lados[i] : undefined,
      ),
    );
  return embaralhar(sorte, [...gerados, ...reais]);
}
