/** Bandeira do país na barra superior. Por enquanto só o Brasil tem desenho. */
export function Bandeira({ pais }: { pais: string }) {
  if (pais !== "Brasil")
    return (
      <svg viewBox="0 0 30 21" className="bandeira" aria-hidden="true">
        <rect width="30" height="21" rx="2" fill="#5d7088" />
      </svg>
    );
  return (
    <svg viewBox="0 0 30 21" className="bandeira" role="img">
      <title>Bandeira do Brasil</title>
      <rect width="30" height="21" rx="2" fill="#009c3b" />
      <path d="M15 2.4 27.2 10.5 15 18.6 2.8 10.5Z" fill="#ffdf00" />
      <circle cx="15" cy="10.5" r="5.2" fill="#002776" />
      <path
        d="M10.1 9.2c3.4-.5 7.2.2 9.8 1.9"
        stroke="#fff"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
