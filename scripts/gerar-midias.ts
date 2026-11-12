// Gera src/conteudo/paises/<id>/midias.json: as mídias do país (inventadas) com
// a audiência de cada grupo, calculada pela distância entre a bússola do grupo
// e a da mídia. Roda com `npm run midias -- <id>`. Nomes são inventados.
import { readFileSync, writeFileSync } from "node:fs";

const [id = "brasil-2026"] = process.argv.slice(2);
const GRUPOS = "src/conteudo/mundo/grupos/grupos.json";
/** Distância máxima entre dois pontos da bússola (de canto a canto). */
const DISTANCIA_MAXIMA = Math.hypot(2, 2);

interface Modelo {
  id: string;
  nome: string;
  dono: string;
  bussola: { economico: number; social: number };
  /** Parte da população que a mídia alcança, de 0 a 1. */
  alcance: number;
  credibilidade: number;
}

const MODELOS: Modelo[] = [
  {
    id: "rede-aurora",
    nome: "Rede Aurora",
    dono: "privado",
    bussola: { economico: 0.2, social: 0.2 },
    alcance: 1,
    credibilidade: 62,
  },
  {
    id: "canal-nacional",
    nome: "Canal Nacional",
    dono: "estatal",
    bussola: { economico: -0.2, social: 0.1 },
    alcance: 0.6,
    credibilidade: 55,
  },
  {
    id: "jornal-da-capital",
    nome: "Jornal da Capital",
    dono: "privado",
    bussola: { economico: 0.3, social: -0.1 },
    alcance: 0.5,
    credibilidade: 75,
  },
  {
    id: "folha-do-povo",
    nome: "Folha do Povo",
    dono: "privado",
    bussola: { economico: -0.4, social: -0.3 },
    alcance: 0.5,
    credibilidade: 70,
  },
  {
    id: "rede-fe-e-vida",
    nome: "Rede Fé e Vida",
    dono: "privado",
    bussola: { economico: 0.1, social: 0.7 },
    alcance: 0.6,
    credibilidade: 50,
  },
  {
    id: "revista-sul",
    nome: "Revista Sul",
    dono: "privado",
    bussola: { economico: 0.6, social: 0.1 },
    alcance: 0.3,
    credibilidade: 68,
  },
  {
    id: "radio-interior",
    nome: "Rádio Interior",
    dono: "privado",
    bussola: { economico: 0, social: 0.4 },
    alcance: 0.6,
    credibilidade: 58,
  },
  {
    id: "agencia-global",
    nome: "Agência Global",
    dono: "estrangeiro",
    bussola: { economico: 0.4, social: -0.4 },
    alcance: 0.4,
    credibilidade: 72,
  },
  {
    id: "redes",
    nome: "Redes sociais",
    dono: "rede",
    bussola: { economico: 0, social: 0 },
    alcance: 0.7,
    credibilidade: 35,
  },
];

const grupos: { id: string; bussola: Modelo["bussola"] }[] = JSON.parse(
  readFileSync(GRUPOS, "utf8"),
).grupos;

/** Quanto do grupo assiste: perto da bússola da mídia, mais; longe, quase nada. */
const audiencia = (m: Modelo, g: (typeof grupos)[number]) => {
  const longe =
    Math.hypot(
      m.bussola.economico - g.bussola.economico,
      m.bussola.social - g.bussola.social,
    ) / DISTANCIA_MAXIMA;
  return Math.round(m.alcance * (1 - longe) ** 2 * 100) / 100;
};

const midias = MODELOS.map((m) => ({
  id: m.id,
  nome: m.nome,
  dono: m.dono,
  bussola: m.bussola,
  credibilidade: m.credibilidade,
  audiencia: Object.fromEntries(grupos.map((g) => [g.id, audiencia(m, g)])),
}));
writeFileSync(
  `src/conteudo/paises/${id}/midias.json`,
  `${JSON.stringify({ versao: 1, midias }, null, 2)}\n`,
);
console.log(`${midias.length} mídias gravadas em paises/${id}/midias.json`);
