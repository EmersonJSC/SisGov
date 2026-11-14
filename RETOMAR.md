# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**14/nov/2026**

## Onde está

Nível 3 do grafo (índices e leis). Passo A (todo índice tem dono) commitado em 01749ca1; item 5 das
janelas em ff0c2c18. Medida: `npx vite-node scripts/grafo-nivel3.ts`.

O autor pediu o **Judiciário de verdade** antes dos passos B e C. Fatia 1 **feita, NÃO commitada**
(`src/motor/judiciario`, regras em `judiciario.md`):
- Brasil: só STF (11) e TSE (`cadeiras: 0`, `presidido_por: "stf"`: só o presidente importa); STJ, TST
  e STM saíram (autor: não fazem sentido no jogo). Aposentadoria aos 75; idades declaradas no país
  (`idade_no_comeco`, `idade_do_indicado`). O STF do Brasil é declarado como em jan/2027: 10 juízes com
  nomes parecidos com os reais (Fachini, Morales, Gilmar Menezes…) e a cadeira do Barrosa vaga (Senado
  rejeitou Messias em abr/2026); no mandato abrem Fuchs (2028), Cármen (2029) e Gilmar (2030);
- presidente da corte como no Brasil, regra fixa: mandato de 2 anos, o mais antigo (`posse`) que ainda
  não presidiu; o TSE vem depois do STF, sem repetir o presidente nem quem já presidiu o STF. Fato
  `corte-novo-presidente`;
- lei "Quem escolhe os juízes" (carreira, presidente + Senado, presidente livre);
- vaga vira papel importante: a Mesa abre sozinha, o botão pulsa, 3 cartas com o voto previsto do Senado;
- Independência da Justiça sai de quem senta;
- mapa: a órbita é só o STF; no miolo, STF e TSE à frente do presidente com fio dourado; Eleições
  pendura no TSE; índices do país num anel por fora das cadeiras do Congresso.

## Próximo

**Jeito novo de trabalhar (autor, 14/nov): por mecânica inteira.** O documento das mecânicas está em
[docs/jogo/mecanicas.md](docs/jogo/mecanicas.md) (19 mecânicas, cada uma com submecânicas: já tem,
falta, a pensar). O autor escolhe uma → plano dela → aprova de uma vez → construir até o fim.
Esperando a escolha (recomendação: 3. Opinião, porque as leis padronizadas dependem dela).

## Pendências do autor

- Commit da fatia 1 do Judiciário (só com a palavra dele).
- A base do governo tem 60 de 81 senadores: o Senado aprova quase todo aliado. Ver se o voto deve pesar mais a distância.
- Opinião central: estruturar direito, mecânica própria (não copiar outro jogo), antes do 10b.
- A mídia não pesa em nada (GDD §18): corrigir quando fizermos mídia e polêmica.
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
