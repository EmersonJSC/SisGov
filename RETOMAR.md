# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**03/nov/2026**

## Onde está

**Premissa (autor, 02/nov):** bolsa moderna no lugar do mercado vitoriano e da
fatia 8. Minigame **Pregão**: blocos de 2%, tudo no mesmo turno, sem efeito
neutro. Quer tudo junto: várias empresas, criar empresa, cofre real.

**Feito nesta rodada (sem commit):**
- Passo 1: fatia 8 apagada (ficha.ts, propriedade.ts, fichas.json, Fichas.tsx,
  botão "Setores", previaDaFicha, 36 leis de setor, 5 leis de propriedade:
  metodo-venda, preco-minimo-venda, setores-do-estado, fabrica-no-exterior,
  acordo-com-potencias). Energia voltou às 3 camadas antigas. tsc e 187 testes ok.
- Ficam 8 leis na área "Propriedade" (indenizacao, prazo-pagamento,
  regra-pos-venda, politica-estatal, triagem-estrangeira, remessa-de-lucro,
  fabrica-de-fora, concorrencia); ainda sem efeito (campo `valores` no motor).
- Passo 2: `empresas.json` por país (teste: 5, teste-pobre: 3; nomes inventados),
  `empresasDoPais` em `src/partida/index.ts`, Pregão com uma aba por empresa.

**GDD reescrito (autor, 02/nov):** `docs/jogo/gdd.md` descreve o **jogo
pronto**, sem plano nem "depois". Entraram: você é o partido (chapa,
presidente do partido, coesão, caixa); sucessão (assassinato; sucessor de
outro partido = desvantagem até a eleição); ministros como fichas de RPG;
mídia com mecânica própria; coligação; campanha; mandatos e reeleição.
O feito e a ordem foram para o plano (seção 1). Ideia nova = GDD seção 18
(Perguntas em aberto).

**Mesa (autor, 03/nov):** GDD seção 17 virou "Tela: mapa e mesa". A mesa
recebe papéis (lei aprovada pelo Congresso, situação, pedido) para assinar,
vetar, recusar, encaminhar ao ministro ou ignorar; ignorar tem consequência.
Respostas do autor na seção 18 foram para os sistemas; a 18 tem só o que
segue aberto.

**Requisitos (03/nov):** `docs/jogo/requisitos.md`, 108 requisitos (R4.1…)
tirados do GDD com status medido no código: 31 feitos, 17 parciais, 60
faltam (~30% do jogo).

## Próximo

Pilar 1 do Mercado fechado (1a, 1b, 1c). Perguntar ao autor: pilar 2
(empresas) e pilar 3 (bolsa) ainda entram na 12b ou o autor muda de frente?
`npm run check` roda ao fechar a mecânica.

**Feito 03/nov: fatia 1a (46799fda), 1b (f8b8a705) e 1c (tela do Mercado: linha "Construções" por setor, lucro × o de antes, aviso de prejuízo e fechamento).**
`construcoes.ts` + `obras` em `produtos.json`; PIB real = capacidade pronta;
investimento privado abre obras (decisão A do autor). 1b: lucro por setor
(receita − salários − imposto), investimento vai para a margem relativa que
melhorou, 3 turnos de prejuízo fecham 5%/turno, setor do Estado não fecha.
Teste 2,0%/ano e teste-pobre 3,3%/ano, iguais ao 1a. Cenários:
`npm run construcoes`; testes `scripts/construcoes.test.ts` (10).

## Pendências do autor

- Jogar o Pregão (botão "Bolsa").
- Commits locais sem push (55eb0ff2, 5adddb3c) (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (talvez 3, GDD seção 18); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Freio do juro nas obras mede contra o juro de equilíbrio do turno 0 (`taxaAlvo`), não o declarado: o teste-pobre declara 10 e anda a 13.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.
