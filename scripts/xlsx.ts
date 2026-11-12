// Leitor mínimo de .xlsx (só valores, sem fórmula nem estilo), sem
// dependência: o .xlsx é um zip de XMLs. Usado pelo exportador da planilha.
import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

// Formato zip (PKWARE APPNOTE): fim do diretório central e entradas.
const FIM_ASSINATURA = 0x06054b50;
const FIM_TAMANHO = 22;
const FIM_TOTAL = 10;
const FIM_INICIO = 16;
const CENTRAL_METODO = 10;
const CENTRAL_TAMANHO = 20;
const CENTRAL_NOME = 28;
const CENTRAL_EXTRA = 30;
const CENTRAL_COMENTARIO = 32;
const CENTRAL_LOCAL = 42;
const CENTRAL_FIXO = 46;
const LOCAL_NOME = 26;
const LOCAL_EXTRA = 28;
const LOCAL_FIXO = 30;
const SEM_COMPRESSAO = 0;

function lerZip(arquivo: string): Map<string, string> {
  const buf = readFileSync(arquivo);
  let fim = buf.length - FIM_TAMANHO;
  while (fim >= 0 && buf.readUInt32LE(fim) !== FIM_ASSINATURA) fim--;
  if (fim < 0) throw new Error(`${arquivo}: não é um zip`);
  const total = buf.readUInt16LE(fim + FIM_TOTAL);
  let p = buf.readUInt32LE(fim + FIM_INICIO);
  const arquivos = new Map<string, string>();
  for (let i = 0; i < total; i++) {
    const metodo = buf.readUInt16LE(p + CENTRAL_METODO);
    const tamanho = buf.readUInt32LE(p + CENTRAL_TAMANHO);
    const nomeLen = buf.readUInt16LE(p + CENTRAL_NOME);
    const extraLen = buf.readUInt16LE(p + CENTRAL_EXTRA);
    const comLen = buf.readUInt16LE(p + CENTRAL_COMENTARIO);
    const local = buf.readUInt32LE(p + CENTRAL_LOCAL);
    const nome = buf.toString(
      "utf8",
      p + CENTRAL_FIXO,
      p + CENTRAL_FIXO + nomeLen,
    );
    const ini =
      local +
      LOCAL_FIXO +
      buf.readUInt16LE(local + LOCAL_NOME) +
      buf.readUInt16LE(local + LOCAL_EXTRA);
    const dado = buf.subarray(ini, ini + tamanho);
    const bruto = metodo === SEM_COMPRESSAO ? dado : inflateRawSync(dado);
    arquivos.set(nome, bruto.toString("utf8"));
    p += CENTRAL_FIXO + nomeLen + extraLen + comLen;
  }
  return arquivos;
}

// Entidades do XML: "&lt;b&gt;" vira "<b>"; "&#233;" vira "é".
const desescapar = (s: string): string =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");

// Junta os <t>…</t> de uma célula rica: "<r><t>Ver</t></r><r><t>ba</t></r>"
// dá "Verba"; "<v>3</v>" sozinho não tem texto.
const textoDe = (xml: string): string =>
  desescapar(
    [...xml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(""),
  );

const LETRAS = 26;
const ANTES_DO_A = 64;

/** "A1" → 0, "AB7" → 27 (as letras viram base 26; os dígitos saem). */
function coluna(ref: string): number {
  let n = 0;
  for (const c of ref.replace(/\d+/g, ""))
    n = n * LETRAS + c.charCodeAt(0) - ANTES_DO_A;
  return n - 1;
}

export type Linha = Record<string, string>;

function valorDaCelula(
  tipo: string | undefined,
  dentro: string,
  comuns: string[],
): string {
  // Valor guardado: "<v>12</v>" dá "12"; "<is><t>a</t></is>" não tem <v>.
  const v = /<v>([\s\S]*?)<\/v>/.exec(dentro)?.[1];
  if (tipo === "s") return comuns[Number(v)] ?? "";
  if (tipo === "inlineStr") return textoDe(dentro);
  return desescapar(v ?? "");
}

/** Abas da planilha: nome da aba → linhas, com o cabeçalho como chave. */
export function lerPlanilha(arquivo: string): Map<string, Linha[]> {
  const zip = lerZip(arquivo);
  // Cada texto comum: "<si><t>Saúde</t></si>".
  const comuns = [
    ...(zip.get("xl/sharedStrings.xml") ?? "").matchAll(
      /<si>([\s\S]*?)<\/si>/g,
    ),
  ].map((m) => textoDe(m[1]));
  // Id da relação → arquivo da aba, em qualquer ordem de atributos:
  // <Relationship Target="/xl/worksheets/sheet1.xml" Id="rId1" />.
  const rels = new Map(
    [
      ...(zip.get("xl/_rels/workbook.xml.rels") ?? "").matchAll(
        /<Relationship\b[^>]*>/g,
      ),
    ].map((m) => [
      / Id="([^"]+)"/.exec(m[0])?.[1] ?? "",
      (/ Target="([^"]+)"/.exec(m[0])?.[1] ?? "").replace(/^\/?(xl\/)?/, "xl/"),
    ]),
  );
  const abas = new Map<string, Linha[]>();
  // Aba: <sheet name="Leis" sheetId="1" r:id="rId1"/>.
  for (const m of (zip.get("xl/workbook.xml") ?? "").matchAll(
    /<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g,
  )) {
    const xml = zip.get(rels.get(m[2]) ?? "") ?? "";
    const grade: string[][] = [];
    // Linha: <row r="2">…</row>.
    for (const lin of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const cel: string[] = [];
      // Célula: <c r="B2" t="s"><v>4</v></c> ou vazia <c r="C2"/>.
      for (const c of lin[1].matchAll(
        /<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g,
      ))
        cel[coluna(c[1])] = valorDaCelula(
          /t="(\w+)"/.exec(c[2])?.[1],
          c[3] ?? "",
          comuns,
        );
      grade.push(cel);
    }
    const [cab = [], ...resto] = grade;
    abas.set(
      desescapar(m[1]),
      resto.map((cel) =>
        Object.fromEntries(
          cab.map((nome, i) => [nome ?? `col${i}`, (cel[i] ?? "").trim()]),
        ),
      ),
    );
  }
  return abas;
}
