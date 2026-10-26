import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  test: {
    // Os testes longos de partida estouram a comunicação do pool de processos.
    // Threads com paralelismo limitado concluem sem esse timeout.
    pool: "threads",
    maxWorkers: 2,
    // V1-34: o pacote do Brasil cresceu (mais de 200 leis); criar uma partida
    // leva alguns segundos, e 5 s estoura quando a suíte roda inteira.
    testTimeout: 120000,
    hookTimeout: 120000,
  },
});
