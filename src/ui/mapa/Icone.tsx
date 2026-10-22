import { DESENHOS } from "./icones";
import { urlIconePersonalizado } from "./iconesPersonalizados";

const RESERVA = "file-document-outline";

/** Ícone dentro de um SVG do mapa, centrado em (x, y). */
export function IconeSvg({
  nome,
  x = 0,
  y = 0,
  tamanho = 24,
  cor = "currentColor",
}: {
  nome: string;
  x?: number;
  y?: number;
  tamanho?: number;
  cor?: string;
}) {
  const url = urlIconePersonalizado(nome);
  if (url) {
    return (
      <image
        href={url}
        x={x - tamanho / 2}
        y={y - tamanho / 2}
        width={tamanho}
        height={tamanho}
        preserveAspectRatio="xMidYMid meet"
        pointerEvents="none"
      />
    );
  }
  const escala = tamanho / 24;
  return (
    <path
      d={DESENHOS[nome] ?? DESENHOS[RESERVA]}
      fill={cor}
      transform={`translate(${x - tamanho / 2} ${y - tamanho / 2}) scale(${escala})`}
      pointerEvents="none"
    />
  );
}

/** Ícone solto no HTML (barra superior, painéis, botões). */
export function Icone({
  nome,
  tamanho = 18,
  className,
  titulo,
}: {
  nome: string;
  tamanho?: number;
  className?: string;
  titulo?: string;
}) {
  const url = urlIconePersonalizado(nome);
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden={titulo ? undefined : true}
      role={titulo ? "img" : undefined}
    >
      {titulo ? <title>{titulo}</title> : null}
      {url ? (
        <image href={url} x="0" y="0" width="24" height="24" />
      ) : (
        <path d={DESENHOS[nome] ?? DESENHOS[RESERVA]} fill="currentColor" />
      )}
    </svg>
  );
}
