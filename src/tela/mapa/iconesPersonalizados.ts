/**
 * Ícones próprios das leis (docs/arte/icones-das-leis.md): imagem pintada
 * (PNG ou WebP) ou SVG em `src/assets/svg/leis/<área>/`, ligada à lei pelo
 * `manifest-leis.json`. Lei sem ícone próprio usa o desenho antigo.
 */
import manifest from "../../assets/svg/manifest-leis.json";
import manifestoIndices from "../../assets/svg/manifest-indices.json";

const arquivos = import.meta.glob<string>(
  "../../assets/svg/leis/**/*.{png,webp}",
  { eager: true, import: "default", query: "?url" },
);

/** SVGs entram como texto: desenhados na tela, herdam a cor da bolha. */
const desenhos = import.meta.glob<string>(
  "../../assets/svg/{leis,indices}/**/*.svg",
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
);

const miolo = (svg: string): string =>
  svg.replace(/^\s*<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

const urlsPorLei = new Map(
  Object.entries(manifest.icons).flatMap(([id, item]) => {
    const url = arquivos[`../../assets/svg/${item.path}`];
    return url ? [[id, url] as const] : [];
  }),
);

const desenhosPorLei = new Map(
  Object.entries(manifest.icons).flatMap(([id, item]) => {
    const svg = desenhos[`../../assets/svg/${item.path}`];
    return svg ? [[id, miolo(svg)] as const] : [];
  }),
);

const desenhosPorIndice = new Map(
  Object.entries(manifestoIndices.icons).flatMap(([id, item]) => {
    const svg = desenhos[`../../assets/svg/${item.path}`];
    return svg ? [[id, miolo(svg)] as const] : [];
  }),
);

const PREFIXO = "sisgov-law:";
const PREFIXO_INDICE = "sisgov-index:";

/** Ícone do índice (game-icons.net); sem ele, usa o desenho reserva. */
export function iconeIndice(id: string, reserva: string): string {
  return desenhosPorIndice.has(id) ? `${PREFIXO_INDICE}${id}` : reserva;
}

export function iconeLei(id: string, reserva: string): string {
  return urlsPorLei.has(id) || desenhosPorLei.has(id)
    ? `${PREFIXO}${id}`
    : reserva;
}

/** Miolo do SVG próprio (traço em `currentColor`), ou nada. */
export function desenhoIconePersonalizado(
  nome: string | undefined,
): string | undefined {
  if (nome?.startsWith(PREFIXO_INDICE))
    return desenhosPorIndice.get(nome.slice(PREFIXO_INDICE.length));
  return nome?.startsWith(PREFIXO)
    ? desenhosPorLei.get(nome.slice(PREFIXO.length))
    : undefined;
}

/** Sem nome (alguns ícones da tela chegam vazios), usa o desenho reserva. */
export function urlIconePersonalizado(
  nome: string | undefined,
): string | undefined {
  return nome?.startsWith(PREFIXO)
    ? urlsPorLei.get(nome.slice(PREFIXO.length))
    : undefined;
}
