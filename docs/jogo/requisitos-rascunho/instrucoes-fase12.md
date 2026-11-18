# Fases 1+2: extrair o GDD e escrever os requisitos (um agente por lote)

Você lê as seções de UM lote do GDD do SisGov (simulador de governo) e escreve
os requisitos delas. Leia antes `docs/jogo/requisitos-rascunho/00-ficha.md`.

**Pode abrir:** a ficha, os arquivos de seção do seu lote
(`docs/jogo/requisitos-rascunho/secoes/`) e `docs/jogo/requisitos.md` (só
para achar o R antigo). **Proibido abrir `src/`** e qualquer outro arquivo. O
requisito diz o que o GDD pede, não o que o motor faz hoje.

Cada linha dos arquivos de seção começa com `L<número>:`, que é a linha no
`gdd.md`. Cite sempre esse número.

## Parte A: buracos (por seção)

Só uma lista curta, cada item com a linha do GDD: o que um programador
precisaria saber e a seção não diz (valor, ordem, caso com 0 ou no máximo,
revogar no meio, duas leis no mesmo alvo). Sem tabelas de entidades, regras e
números: elas já estão no GDD. Proibido inventar número.

## Parte B: requisitos (por seção)

Formato:

```
### [PARTE-SEÇÃO-nº] Título curto      (ex.: ECO-3.7-02; partes: JOGO, SOC, ECO, MAQ, POL, MID, MUN, TELA, NAR)
- R antigo: R__ ou "novo"
- GDD: L____–L____
- Regra: uma frase com sujeito, gatilho e efeito.
- Entra: o dado que a regra lê
- Sai: o que ela grava ou o fato do turno que avisa
- Aceite: um caso com números, de preferência do Brasil-2026
- Extremos: com 0, no máximo e com revogação no meio do turno
- Depende de: IDs de outros requisitos
```

Exemplo bom de Regra: "Ao fim do turno, o pop que gasta mais do que ganha usa a
poupança; quando ela zera, corta o gasto de luxo antes do de comida."
Exemplo ruim: "O sistema deve simular o consumo de forma realista."

Regras:
- Um requisito, uma regra. Se a frase tem "e também", divida em dois.
- Palavras proibidas: intuitivo, realista, equilibrado, dinâmico, robusto,
  imersivo, adequado, eficiente, "de forma a".
- Todo requisito cita um nome concreto do jogo: pop, índice, lei,
  instituição, canal ou fato do turno.
- Nenhum requisito cita uma lei pelo nome nem conta quantas leis existem
  (as leis serão reconstruídas). Descreva o molde.
- Número que o GDD não dá vira `[ABERTO: valor de X]`. O Aceite pode usar um
  número de exemplo marcado "(exemplo)".
- Fora da Parte 8, não descreva tela; diga só que dado a tela recebe.
- Visão, referência e ESTUDAR não viram requisito. "Em aberto" do GDD não vira
  requisito: vira pergunta ou `[ABERTO]`.
- O R antigo: procure em `requisitos.md` o R que trata da mesma regra. Se não
  houver, "novo".

## Fim do arquivo

`## PERGUNTAS AO AUTOR`: até 5 por lote, cada uma com duas opções concretas
(a) e (b), e a linha do GDD.

## Saída

Escreva um arquivo só: `docs/jogo/requisitos-rascunho/saidas/<ID do lote>-requisitos.md`,
com, para cada seção: `## <arquivo da seção>`, a Parte A e a Parte B. Depois
as perguntas. Responda no chat só com: quantos requisitos, quantos [ABERTO],
quantas perguntas.
