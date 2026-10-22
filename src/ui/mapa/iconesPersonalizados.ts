/**
 * Ícones próprios das leis (docs/arte/icones-das-leis.md): imagem pintada
 * (PNG ou WebP) ou SVG em `src/assets/svg/leis/<área>/`, ligada à lei pelo
 * `manifest-leis.json`. Lei sem ícone próprio usa o desenho antigo.
 */
import manifest from "../../assets/svg/manifest-leis.json";

const arquivos = import.meta.glob<string>(
  "../../assets/svg/leis/**/*.{svg,png,webp}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

const urlsPorLei = new Map(
  Object.entries(manifest.icons).flatMap(([id, item]) => {
    const url = arquivos[`../../assets/svg/${item.path}`];
    return url ? [[id, url] as const] : [];
  }),
);

const PREFIXO = "sisgov-law:";

export function iconeLei(id: string, reserva: string): string {
  return urlsPorLei.has(id) ? `${PREFIXO}${id}` : reserva;
}

/** Sem nome (alguns ícones da tela chegam vazios), usa o desenho reserva. */
export function urlIconePersonalizado(
  nome: string | undefined,
): string | undefined {
  return nome?.startsWith(PREFIXO)
    ? urlsPorLei.get(nome.slice(PREFIXO.length))
    : undefined;
}
