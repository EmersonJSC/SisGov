// O molde é inverso: toda lei do jogo vira linhas da planilha e volta igual.
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Lei } from "../../src/motor";
import {
  PASTA_DAS_LEIS,
  leisDasAbas,
  linhaDaLei,
  linhasDosDegraus,
  linhasDosEfeitos,
} from "./molde";

const leis: Lei[] = readdirSync(PASTA_DAS_LEIS)
  .filter((a) => a.endsWith(".json"))
  .map((a) => JSON.parse(readFileSync(`${PASTA_DAS_LEIS}/${a}`, "utf8")));

describe("molde da lei na planilha", () => {
  it("toda lei do jogo vai à planilha e volta igual", () => {
    const voltaram = leisDasAbas(
      leis.map(linhaDaLei),
      leis.flatMap(linhasDosDegraus),
      leis.flatMap(linhasDosEfeitos),
    );
    expect(voltaram).toHaveLength(leis.length);
    voltaram.forEach((lei, i) => expect(lei).toEqual(leis[i]));
  });
});
