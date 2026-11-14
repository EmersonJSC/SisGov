# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**13/nov/2026**

## Onde está

Passo **10a, Mapa da raiz às pontas** (ordem de construir em
[docs/jogo/requisitos.md](docs/jogo/requisitos.md)). Ordem do autor: 10a mapa → 10b leis → 10c dinheiro.

- Item 1, miolo: Eleições e Regras dos poderes ficam com os poderes, sem ministro; no mapa, Regras
  acima do Congresso e Eleições abaixo, do lado do Judiciário (fffa115a). Judiciário segue de mentira.
- Item 2, trocar ministro pelo mapa: painel do ministério clicado; polêmica que cresce no mandato e
  mágoa de 3 turnos nos grupos parecidos com quem saiu (26e14e42).
- Item 3, áreas: mapa por ministério (da3f8e65); refatoração tirou `MapaPolitico.tsx`, `layout.ts` e
  `mundo/areas` (cc4e6108).
- Item 4, seta de tendência: compara com 8 meses atrás (4 turnos), corte de 2 pontos; o motor guarda
  `estado.anteriores`. **Feito e visto na tela, NÃO commitado.**

## Próximo

Item 5 do 10a: onde moram as janelas que saíram da barra (Governo, Programas, Eleição, Mesa, Mercado,
Pregão, Salvar, Carregar, Recomeçar; R17.23). **Espera o autor dizer onde cada uma mora.**
Depois do 10a, e antes do 10b: desenhar com o autor a **opinião central** (GDD §18), uma régua única
de gostar e não gostar para grupo, partido, ministro, juiz, mídia e potência.

## Pendências do autor

- Onde moram as janelas (item 5).
- Opinião central: estruturar direito, mecânica própria (não copiar outro jogo).
- Tribunais no Judiciário (STF, STJ, TSE como rótulos do país; GDD §18), quando o Judiciário for de verdade.
- A mídia não pesa em nada (GDD §18): corrigir quando fizermos mídia e polêmica.
- Conferir [docs/jogo/codigo-a-conferir.md](docs/jogo/codigo-a-conferir.md).

## Armadilhas

- Não abrir docs/v1/desenho, docs/referencia, docs/arte/PROMPTS.md, docs/conteudo/rede.md, docs/Exemplos.
- Nada é commitado sem a palavra do autor; nunca `git push`. `arquivo/`, `public/arte`, `public/demos`,
  `docs/arte/*` e `docs/jogo/interface/*` ficam fora dos commits.
- `npm run format:check` falha em 16 arquivos antigos (scripts de ícones, JSONs do Brasil): não são da
  rodada; formatar é pedido à parte.
- O índice ainda tem `area` = tema (nome de instituição antiga); o mapa usa só para achar o ministro.
- Vite às vezes serve módulo vazio ("does not provide an export"): `touch` no arquivo e recarregar.
- Pacote novo deixa o `npm run dev` em branco ("Outdated Optimize Dep"): reiniciar o servidor.
- `tsx` não roda scripts com `import.meta.glob`; usar `vite-node`.
- Classes CSS da tela inicial levam `ini-`, as da barra `topo-`; não usar `<main>` fora do mapa.
- `manifest-leis.json` tem 220 ids de leis que não existem mais; limpar é pedido à parte.
