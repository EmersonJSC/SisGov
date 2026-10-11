/**
 * Estrutura do governo (D-64): os ministérios reais do país, agrupados em
 * áreas, e a regra de extinção de cada um. Funções puras sobre o conteúdo;
 * o motor não sabe o que é ministério.
 */

export type AreaDeGoverno = Readonly<{
  id: string;
  titulo: string;
  curto: string;
  /** O que mora na área, numa linha. */
  faz: string;
  /** Ministério que dá o rosto da área no mapa. */
  coordenador: string;
}>;

/**
 * O que acontece com as leis quando o ministério é extinto: vão para o
 * `destino`, salvo as exceções em `leis` (outro ministério, ou `null`: a lei
 * deixa de existir).
 */
export type Extincao = Readonly<{
  destino: string;
  leis?: Readonly<Record<string, string | null>>;
}>;

export type MinisterioDeGoverno = Readonly<{
  id: string;
  nome: string;
  cargo: string;
  area: string;
  leis: readonly string[];
  /** Ausente: núcleo do governo, não pode ser extinto. */
  extincao?: Extincao;
}>;

export type EstruturaDeGoverno = Readonly<{
  areas: readonly AreaDeGoverno[];
  ministerios: readonly MinisterioDeGoverno[];
}>;

/** Erros da estrutura frente às leis do mundo; vazio quando está tudo certo. */
export function validarEstrutura(
  estrutura: EstruturaDeGoverno,
  leis: readonly string[],
): string[] {
  const erros: string[] = [];
  const areas = new Set(estrutura.areas.map((a) => a.id));
  const ministerios = new Map(estrutura.ministerios.map((m) => [m.id, m]));
  const dono = new Map<string, string>();
  const existe = new Set(leis);
  if (areas.size !== estrutura.areas.length) erros.push("área repetida");
  if (ministerios.size !== estrutura.ministerios.length)
    erros.push("ministério repetido");
  for (const area of estrutura.areas) {
    if (ministerios.get(area.coordenador)?.area !== area.id)
      erros.push(`área ${area.id}: coordenador fora da área`);
  }
  for (const m of estrutura.ministerios) {
    if (!areas.has(m.area)) erros.push(`${m.id}: área ${m.area} não existe`);
    for (const lei of m.leis) {
      if (!existe.has(lei)) erros.push(`${m.id}: lei ${lei} não existe`);
      const outro = dono.get(lei);
      if (outro) erros.push(`lei ${lei} em ${outro} e ${m.id}`);
      dono.set(lei, m.id);
    }
    if (!m.extincao) continue;
    const { destino } = m.extincao;
    if (destino === m.id || !ministerios.has(destino))
      erros.push(`${m.id}: destino ${destino} inválido`);
    for (const [lei, para] of Object.entries(m.extincao.leis ?? {})) {
      if (!m.leis.includes(lei))
        erros.push(`${m.id}: exceção para lei de outra pasta (${lei})`);
      if (para !== null && (para === m.id || !ministerios.has(para)))
        erros.push(`${m.id}: lei ${lei} vai para ${para}, que não existe`);
    }
  }
  for (const lei of leis)
    if (!dono.has(lei)) erros.push(`lei ${lei} sem ministério`);
  return erros;
}

export type Extinto = Readonly<{
  estrutura: EstruturaDeGoverno;
  /** Leis que mudaram de pasta. */
  movidas: readonly Readonly<{ lei: string; para: string }>[];
  /** Leis que deixaram de existir com o ministério. */
  extintas: readonly string[];
}>;

/**
 * Extingue um ministério. As leis seguem a regra `extincao`; se o destino já
 * foi extinto, quem chama escolhe outro (`destino`). Uma área que fica sem
 * ministérios some; se o coordenador sai, o próximo da área assume.
 */
export function extinguirMinisterio(
  estrutura: EstruturaDeGoverno,
  id: string,
  destino?: string,
): { ok: true; value: Extinto } | { ok: false; erro: string } {
  const alvo = estrutura.ministerios.find((m) => m.id === id);
  if (!alvo) return { ok: false, erro: `ministério ${id} não existe` };
  if (!alvo.extincao)
    return { ok: false, erro: `${alvo.nome} é do núcleo do governo` };
  const restantes = new Set(
    estrutura.ministerios.filter((m) => m.id !== id).map((m) => m.id),
  );
  const padrao = destino ?? alvo.extincao.destino;
  if (!restantes.has(padrao))
    return { ok: false, erro: `o destino ${padrao} não existe mais` };
  const movidas: { lei: string; para: string }[] = [];
  const extintas: string[] = [];
  for (const lei of alvo.leis) {
    const regra = alvo.extincao.leis?.[lei];
    if (regra === null) extintas.push(lei);
    else
      movidas.push({
        lei,
        para: regra && restantes.has(regra) ? regra : padrao,
      });
  }
  const ministerios = estrutura.ministerios
    .filter((m) => m.id !== id)
    .map((m) => {
      const chegam = movidas.filter((x) => x.para === m.id).map((x) => x.lei);
      return chegam.length ? { ...m, leis: [...m.leis, ...chegam] } : m;
    });
  const areas = estrutura.areas.flatMap((area) => {
    const daArea = ministerios.filter((m) => m.area === area.id);
    if (!daArea.length) return [];
    return area.coordenador === id
      ? [{ ...area, coordenador: daArea[0].id }]
      : [area];
  });
  return {
    ok: true,
    value: { estrutura: { areas, ministerios }, movidas, extintas },
  };
}
