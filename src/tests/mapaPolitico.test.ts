import { describe, expect, it } from "vitest";
import { criarPartida, verPartida } from "../app/partida";
import {
  ESCALA_MAXIMA,
  ESCALA_MINIMA_ABSOLUTA,
  limitar,
  zoomNoPonto,
} from "../ui/mapa/camera";
import {
  BLOCO_PRESIDENCIA_ABERTA,
  PRESIDENCIA,
  blocoCentral,
  caixaDaBolha,
  montarBase,
  montarLayout,
  quebrarNome,
  type PosicaoLei,
} from "../ui/mapa/layout";
import {
  escalaDaLei,
  intensidadeDaBolha,
  nivelRelativo,
  referenciaDasLeis,
} from "../ui/mapa/intensidade";
import { efeitoDe, indexarRelacoes, vizinhanca } from "../ui/mapa/relacoes";
import { MEDIDAS } from "../ui/mapa/tema";

const criada = criarPartida();
if (!criada.ok) throw new Error(criada.erros.join(" "));
const visao = verPartida(criada.value);
const base = montarBase(visao);
const rp = MEDIDAS.raioPresidencia;
const dist = (p: { x: number; y: number }) => Math.hypot(p.x, p.y);

/** Nó + rótulo (abaixo do nó) não podem se cruzar. */
function colisoes(leis: readonly PosicaoLei[]) {
  let n = 0;
  for (let i = 0; i < leis.length; i++)
    for (let j = i + 1; j < leis.length; j++) {
      const a = leis[i];
      const b = leis[j];
      const largura = (46 * Math.min(a.rotulo, b.rotulo)) / 7.25;
      if (Math.abs(a.x - b.x) < largura && Math.abs(a.y - b.y) < 80) n++;
    }
  return n;
}

describe("mapa político: layout", () => {
  it("cria uma esfera por ministério, em anel e sem sobreposição", () => {
    expect(base.ministerios).toHaveLength(10);
    const layout = montarLayout(base, null, new Set());
    const esferas = [...layout.esferas.values()];
    esferas.forEach((a, i) => {
      const b = esferas[(i + 1) % esferas.length];
      expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(
        a.r + b.r - 1,
      );
    });
    // visão geral: nenhuma lei aparece antes de abrir uma área
    expect(layout.leis.size).toBe(0);
  });

  it.each(base.ministerios.map((m) => m.nome))(
    "abrir %s mostra todas as leis, sem duplicar e sem rótulos cruzados",
    (nome) => {
      const ministerio = base.porNome.get(nome)!;
      const layout = montarLayout(base, nome, new Set());
      const esfera = layout.esferas.get(nome)!;
      const leis = [...layout.leis.values()];
      expect(leis.map((l) => l.id).sort()).toEqual([...ministerio.leis].sort());
      expect(colisoes(leis)).toBe(0);
      const bloco = blocoCentral(esfera, ministerio.titulo).caixa;
      for (const lei of leis) {
        expect(Math.hypot(lei.x - esfera.x, lei.y - esfera.y)).toBeLessThan(
          esfera.r,
        );
        const dentroDoBloco =
          lei.x > bloco.minX &&
          lei.x < bloco.maxX &&
          lei.y > bloco.minY &&
          lei.y < bloco.maxY;
        expect(dentroDoBloco).toBe(false);
        if (base.constitucionais.includes(lei.id)) {
          // na lente: também dentro da Presidência
          expect(lei.lugar).toBe("lente");
          expect(dist(lei)).toBeLessThan(rp);
          // não cobre o retrato do Presidente
          const c = BLOCO_PRESIDENCIA_ABERTA;
          const cobre =
            lei.x + 40 > c.minX &&
            lei.x - 40 < c.maxX &&
            lei.y + 50 > c.minY &&
            lei.y - 20 < c.maxY;
          expect(cobre).toBe(false);
        } else {
          expect(lei.lugar).toBe("interna");
          expect(dist(lei)).toBeGreaterThan(rp);
        }
      }
    },
  );

  it("a Presidência aberta reúne as leis constitucionais dentro dela", () => {
    const layout = montarLayout(base, PRESIDENCIA, new Set());
    const leis = [...layout.leis.values()];
    expect(leis).toHaveLength(base.constitucionais.length);
    expect(base.constitucionais.length).toBeGreaterThan(0);
    for (const lei of leis) expect(dist(lei)).toBeLessThan(rp);
    expect(colisoes(leis)).toBe(0);
  });

  it("o foco revela as leis ligadas mesmo com a esfera fechada", () => {
    const indice = indexarRelacoes(visao);
    const viz = vizinhanca(indice, "desemprego", (id) => base.leis.has(id));
    expect(viz.leis.size).toBeGreaterThan(3);
    const layout = montarLayout(base, null, viz.leis);
    const reveladas = [...layout.leis.values()];
    const excedentes = [...layout.excedentes.values()].reduce(
      (s, n) => s + n,
      0,
    );
    expect(reveladas.length + excedentes).toBe(viz.leis.size);
    for (const lei of reveladas) expect(lei.lugar).toBe("revelada");
  });

  it("as bolhas ficam fora do núcleo de esferas", () => {
    expect(base.bolhas.size).toBe(visao.bolhas.length);
    for (const bolha of base.bolhas.values()) {
      expect(Number.isFinite(bolha.x) && Number.isFinite(bolha.y)).toBe(true);
      expect(dist(bolha)).toBeGreaterThan(MEDIDAS.inicioBolhas);
    }
  });

  it("nós e rótulos das bolhas não se cobrem", () => {
    const caixas = visao.bolhas.map((b) => ({
      ...base.bolhas.get(b.id)!,
      ...caixaDaBolha(b.nome),
    }));
    let cobertas = 0;
    for (let i = 0; i < caixas.length; i++)
      for (let j = i + 1; j < caixas.length; j++) {
        const a = caixas[i];
        const b = caixas[j];
        const x = (a.largura + b.largura) / 2 - Math.abs(a.x - b.x);
        const y = (a.altura + b.altura) / 2 - Math.abs(a.y - b.y);
        if (x > 12 && y > 12) cobertas++;
      }
    expect(cobertas).toBe(0);
  });

  it("quebra nomes longos em linhas curtas", () => {
    expect(quebrarNome("Seguro-desemprego", 14)).toEqual([
      "Seguro-",
      "desemprego",
    ]);
    expect(quebrarNome("Reeleição do chefe do Executivo", 14, 2)[1]).toMatch(
      /…$/,
    );
  });
});

describe("mapa político: câmera e relações", () => {
  const tela = { largura: 1600, altura: 900 };

  it("o zoom tem mínimo e máximo, e o mapa não sai da vista", () => {
    expect(limitar({ x: 0, y: 0, k: 99 }, base.limites, tela).k).toBe(
      ESCALA_MAXIMA,
    );
    const longe = limitar({ x: 0, y: 0, k: 0.01 }, base.limites, tela);
    expect(longe.k).toBeGreaterThanOrEqual(ESCALA_MINIMA_ABSOLUTA);
    const fora = limitar({ x: 1e6, y: -1e6, k: 1 }, base.limites, tela);
    expect(fora.x).toBeLessThanOrEqual(base.limites.maxX);
    expect(fora.y).toBeGreaterThanOrEqual(base.limites.minY);
  });

  it("aproximar mantém fixo o ponto sob o cursor", () => {
    const c = { x: 100, y: 50, k: 0.5 };
    const z = zoomNoPonto(c, 2, 1200, 300, tela);
    const antes = c.x + (1200 - 800) / c.k;
    const depois = z.x + (1200 - 800) / z.k;
    expect(depois).toBeCloseTo(antes);
  });

  it("toda seta corresponde a uma consequência do conteúdo", () => {
    const indice = indexarRelacoes(visao);
    expect(indice.todas).toHaveLength(visao.ligacoes.length);
    expect(efeitoDe(1, "maior_pior")).toBe("piora");
    expect(efeitoDe(-1, "maior_pior")).toBe("melhora");
    expect(efeitoDe(1, "neutra")).toBe("neutro");
  });
});

describe("mapa político: intensidade (D-43)", () => {
  const bolha = (id: string) => visao.bolhas.find((b) => b.id === id)!;

  it("bolha com valor maior fica maior", () => {
    const previdencia = intensidadeDaBolha(bolha("cobertura_previdenciaria"));
    const poupanca = intensidadeDaBolha(bolha("poupanca_domestica"));
    expect(bolha("poupanca_domestica").valor).toBeGreaterThan(
      bolha("cobertura_previdenciaria").valor,
    );
    expect(poupanca.escala).toBeGreaterThan(previdencia.escala);
  });

  it("a cor do anel diz se o valor é bom ou ruim para o país", () => {
    const base = bolha("inflacao");
    const alta = intensidadeDaBolha({ ...base, valor: 90 });
    const baixa = intensidadeDaBolha({ ...base, valor: 5 });
    expect(alta.bondade).toBeLessThan(baixa.bondade!);
  });

  it("situação abaixo do surgimento encolhe; acima, cresce e pisca", () => {
    const base = bolha("apagao");
    const dormindo = intensidadeDaBolha({ ...base, valor: 0 });
    const seria = intensidadeDaBolha({ ...base, valor: 90 });
    expect(dormindo.ativa).toBe(false);
    expect(seria.ativa && seria.grave).toBe(true);
    expect(seria.escala).toBeGreaterThan(dormindo.escala);
  });

  it("lei mais ligada fica maior, comparada com as do mesmo tipo", () => {
    const referencia = referenciaDasLeis(visao.leis);
    const saude = visao.leis.find((l) => l.id === "piso-saude")!;
    const farmacia = visao.leis.find((l) => l.id === "farmacia-popular")!;
    expect(escalaDaLei(nivelRelativo(saude, referencia))).toBeGreaterThan(
      escalaDaLei(nivelRelativo(farmacia, referencia)),
    );
  });
});
