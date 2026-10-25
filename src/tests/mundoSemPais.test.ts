import { expect, it } from "vitest";

const arquivos = import.meta.glob<string>("../conteudo/mundo/**/*.json", {
  eager: true,
  query: "?raw",
  import: "default",
});

const proibido =
  /\bBrasil\b|brasileir|\bSUS\b|\bSelic\b|Petrobras|pré-sal|\bIBGE\b|\bBNDES\b|\bINSS\b|\bCLT\b|Bolsa Família|\bFGTS\b|Minha Casa|R\$|Constituição de 1988|\bLei \d|planalto\.gov\.br|\breais de\b|milhões de reais|\bsus\b/i;

it("não deixa texto ou IDs de país nos arquivos do mundo", () => {
  const achados: string[] = [];
  const visitar = (valor: unknown, arquivo: string, campo = "$") => {
    if (typeof valor === "string") {
      const achado = valor.match(proibido);
      if (achado)
        achados.push(`${arquivo} · ${campo} · ${achado[0]}`);
    } else if (Array.isArray(valor)) {
      valor.forEach((item, i) => visitar(item, arquivo, `${campo}[${i}]`));
    } else if (typeof valor === "object" && valor !== null) {
      for (const [chave, item] of Object.entries(valor)) {
        const achado = chave.match(proibido);
        if (achado)
          achados.push(`${arquivo} · ${campo}.${chave} · ${achado[0]}`);
        visitar(item, arquivo, `${campo}.${chave}`);
      }
    }
  };

  for (const [arquivo, bruto] of Object.entries(arquivos))
    visitar(JSON.parse(bruto), arquivo);

  expect(achados, achados.join("\n")).toEqual([]);
});
