# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**15/nov/2026**

## Onde está

**Fase dos pops (15/nov, frente atual).** Combinado: requisitos se fazem por mecânica, na hora de construir (o molde do `prompt-requisitos.md` foi aposentado; Parte 1 fica como está). Antes de rever as leis, fechar o motor dos pops para receber as tomadas (canais). Decisões no GDD 2.1, 2.3, 2.7 e 2.9 ("Decidido em 15/nov"). Ordem: A 31 pops no conteúdo (Crianças vão no E) → B renda por fonte (setor paga salário e lucro; Estudantes/Aposentados com divisão pobre/médio/rico por dentro; quem não tem setor segue a renda de quem paga) → C desemprego → D cesta pela renda e padrão de vida por pop → E demografia e Crianças → F estados → G saída → H lugar das tomadas de serviço e direito → I organizações com radicais pela piora. Sonnet faz A, E, F, H com instrução fechada; Opus faz B e confere. **Feitos (15/nov):** A 31 pops (95261171), B1 renda por fonte (8e7bcabb), B2 desvio (9aa66e4c), B3 aposentadoria/bolsa/família e Brasil com 12% de aposentados (4aa87186), B4 divisão por estrato dentro do pop (6a67aeb9), B5 troca na mesma faixa (sem commit ainda). Próximo: C desemprego (com seguro-desemprego, que precisa do tempo sem emprego). Limite assumido: verba muda quem recebe, não o PIB.

Depois dos pops: revisar todas as leis (não estão jogáveis), cada uma dizendo em qual tomada liga. Canais hoje: imposto e transferência chegam ao pop; verba some no órgão; preço e direito sem leitor.

**GDD por mecânica commitado (8bbe87da).** Autor leu só a Parte 1. `docs/jogo/gdd-novo/` fica até ele ler tudo.

**Onda 1 das leis commitada (30b0ae69).** Ficaram para depois: janela "Leis para propor" (frase, lado, Atos à parte, relógio da lei com prazo) e coluna "Brasil tem?" na aba Leis. Avisar: preço/câmbio/crédito em "espera" (11 leis), poder-de-decreto com 7 degraus quebrados (onda 4).

## Pendências do autor

- A base do governo tem 60 de 81 senadores: o Senado aprova quase todo aliado. Ver se o voto deve pesar mais a distância.
- Opinião central: estruturar direito, mecânica própria (não copiar outro jogo), antes do 10b.
- A mídia não pesa em nada: é lente sobre os fatos (GDD 6.1); estudar como mexe em cada mecânica.
- Conferir [docs/jogo/codigo-a-conferir.md](docs/jogo/codigo-a-conferir.md).

## Armadilhas

- Não abrir docs/v1/desenho, docs/referencia, docs/arte/PROMPTS.md, docs/conteudo/rede.md, docs/Exemplos.
- Nada é commitado sem a palavra do autor; nunca `git push`. `arquivo/`, `public/arte`, `public/demos`,
  `docs/arte/*` e `docs/jogo/interface/*` ficam fora dos commits.
- `npm run icones` está quebrado: 90 leis mudaram de esfera e o mapa de ícones não acompanhou. Ícone de
  índice novo foi gravado à parte; consertar é pedido à parte.
- "Lei sem nada" conta só efeito, dinheiro e módulo do motor: lei que só está num programa conta como sem nada.
- `npm run format:check` falha em 16 arquivos antigos (scripts de ícones, JSONs do Brasil): não são da
  rodada; formatar é pedido à parte.
- Vite às vezes serve módulo vazio ("does not provide an export"): `touch` no arquivo e recarregar.
- Pacote novo deixa o `npm run dev` em branco ("Outdated Optimize Dep"): reiniciar o servidor.
- `tsx` não roda scripts com `import.meta.glob`; usar `vite-node`.
- Classes CSS da tela inicial levam `ini-`, as da barra `topo-`; não usar `<main>` fora do mapa.
- `manifest-leis.json` tem 220 ids de leis que não existem mais; limpar é pedido à parte.
- O scratchpad de /tmp some sem aviso: script de medida fica em `scripts/`.
