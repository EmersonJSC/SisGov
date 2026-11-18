# Fase 3: auditoria do motor (um agente por lote)

Projeto em `/home/emerson_costa/Documentos/SisGov`. Leia antes
`docs/jogo/requisitos-rascunho/00-ficha.md`.

**Não edite nenhum arquivo além da sua saída.** Não abra `docs/v1/desenho/`,
`docs/referencia/`, `docs/arte/PROMPTS.md`, `docs/conteudo/rede.md`,
`docs/Exemplos/`. Não confie nos comentários, nos `.md` do motor, nos ✅ do
`requisitos.md` nem nos testes que passam: eles mostram o que alguém achou num
dia. Só o código prova.

As leis JSON (`src/conteudo/mundo/leis/`) serão reconstruídas: não as avalie.
Elas só servem de amostra do formato que o motor lê hoje.

---

## 3a: mapa do código (o mesmo agente da 3b, antes de dar o veredito)

Ache no `src/` o código que trata dos requisitos do lote. Não julgue se está
certo. Só aponte onde está.

Para cada requisito, liste:
- `arquivo:linha` de cada função, tipo ou campo de estado ligado a ele;
- quem chama a função (grep) e se o resultado é lido por alguém;
- o teste que cobre (`arquivo:linha`) ou "nenhum";
- o leitor do motor que lê o JSON das leis e dos países para esta regra;
- até 5 leis de amostra que tocam a regra (só o nome do arquivo e os campos
  que ela tem).

Requisito de tela (só diz que dado a tela recebe) ou de conteúdo: aponte onde o
dado sai do motor para a tela (`src/partida/`), sem descer na tela.

Depois, à parte:
- **CÓDIGO SEM DONO:** funções e campos nas pastas que você visitou que não batem
  com nenhum requisito do lote;
- **DUPLICADOS:** dois lugares que parecem calcular a mesma coisa.

Não escreva o mapa num arquivo à parte: ele entra na Prova de cada veredito.

---

## 3b: veredito (Sonnet, o mesmo agente)

Para cada requisito, leia o código que você achou e dê UM veredito. Para
economizar: requisito de princípio, texto ou tela sem código no motor recebe
NÃO SE APLICA numa linha, sem busca longa; use grep antes de abrir arquivo e
leia só o trecho.

Veredito:

- **CERTO:** faz o que a regra e o aceite pedem. Mostre o trecho que prova
  (`arquivo:linha` e as linhas copiadas).
- **ERRADO:** existe, mas faz outra coisa. Diga a diferença com números ("o
  código usa a renda do turno passado; o GDD L1402 manda usar a atual").
- **PELA METADE:** faz parte. Diga o que falta.
- **VELHO:** segue uma regra que o GDD de hoje não tem mais. Cite o trecho.
- **DUPLICADO:** há mais de uma implementação. Diga qual está em uso de fato
  (quem chama) e qual está morta.
- **FALTA:** não existe.
- **NÃO SE APLICA:** o requisito é de conteúdo, texto ou tela e não tem código
  no motor (diga por quê numa linha).

Para CÓDIGO SEM DONO, diga: está morto (ninguém chama) / está vivo mas sem regra
no GDD / é de uma versão antiga.

Leis de amostra: diga só se o leitor do motor usa cada campo que elas têm, e que
campo o leitor espera que elas não têm. Não julgue a lei.

Para cada teste encontrado: confere a regra de hoje ou a antiga?

Proibido: dar CERTO porque existe ou porque o teste passa. Sem trecho que prove,
não é CERTO. Não proponha conserto.

Formato por requisito:

```
### [ID] Título
- Veredito: CERTO | ERRADO | PELA METADE | VELHO | DUPLICADO | FALTA | NÃO SE APLICA
- Prova: arquivo:linha + trecho, ou a diferença
- Teste: arquivo:linha (regra de hoje | antiga) ou nenhum
```

Fim do arquivo: `## Contagem` (por veredito), `## Código sem dono`,
`## Duplicados`, `## Campos das leis` (usados, ignorados, esperados e ausentes).

Saída: `docs/jogo/requisitos-rascunho/saidas/<lote>-auditoria.md`. No chat, só a
contagem por veredito.
