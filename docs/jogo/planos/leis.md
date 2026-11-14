# Plano da mecânica: Leis

> Mecânica 6 de [mecanicas.md](../mecanicas.md). Escrito em 14/nov/2026 para o
> autor aprovar de uma vez; as decisões estão no fim.
>
> **Aprovado em 14/nov (as 6 decisões como recomendado).** Base feita em 14/nov:
> canal obrigatório, lei pela instituição, revogar, "como chega a você" na
> folha, abas Leis na `gdd.xlsx` com o exportador. Lei com prazo e Ato nascem
> com a primeira lei que os usa (Anistia fiscal, na onda 1; Graça, na onda 2).

## Onde estamos (medido no código, 14/nov)

- **512 leis** no jogo: 251 de régua, 261 de degraus. Toda lei mora numa
  instituição.
- **100 leis não mexem em nada** (sem efeito, sem dinheiro, sem mecanismo).
  As piores: Saúde 15, Trabalho 12, Infraestrutura 12, Ciência 11, Cultura
  10, Mineração 8, Estatais 6.
- **47 leis no centro da bússola:** nenhum grupo reage a elas.
- **Quase toda lei chega ao jogador só por índice.** Só cerca de 80 têm
  dinheiro de verdade (imposto, gasto, transferência) e umas 30 mexem num
  mecanismo (mercado, moradia, atendimento, saneamento, Judiciário).
- **O acervo (`leis.xlsx`) já pensou muito:** cada lei tem "Chega ao pop por"
  (Direito 130, Serviço 86, Renda 85, Governo 81, Preço 76, Emprego 62), um
  roteiro de 8 passos, ganho, custo, forma, força e atraso. Mas 443 das 529
  estão como "Ideia" e o JSON do jogo foi exportado sem padrão.

**O problema:** a lei existe, mas o jogador não sente. O jogo não se sente
porque a maioria das leis só empurra um número de índice.

## O que esta mecânica entrega

Toda lei do jogo segue **um molde**, mora numa instituição e **chega ao pop por
um canal que o motor calcula**. O jogador vê, na bolha, como a lei chega à vida
das pessoas.

---

## 6.1 O molde da lei

Cada lei passa a ter, sempre:

| Campo         | O que é                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Nome e texto  | Frase de leigo com exemplo do dia a dia (o que muda na vida de quem?)                             |
| Instituição   | Uma das 36, ou Regras dos poderes                                                                 |
| Tipo          | Lei, Lei com prazo ou Ato (Posição por país e Operação ficam marcadas, para o Mundo e a Economia) |
| Forma         | Régua, Degraus, Escolha, Régua por setor ou Divisão de 100%                                       |
| Quórum        | Comum, absoluta, constitucional ou mandato                                                        |
| Bússola       | Um lado só (exceção escrita: leis de valor, como imposto)                                         |
| **Canal**     | **Como chega ao pop** (6.2): obrigatório, um principal                                            |
| Efeitos       | Índices que mexe, com força e atraso (os de hoje, revistos)                                       |
| Ganho e custo | Uma linha cada; toda lei tem os dois                                                              |

Uma lei sem canal não entra no jogo.

## 6.2 Os canais (como a lei chega ao pop)

São os mecanismos genéricos do motor. A lei aponta o canal; o motor calcula. O
motor não conhece a lei.

| Canal               | O que faz no motor                                                                                        | Já existe?                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Imposto**         | Cobra de uma base (renda, consumo, lucro, emissões, terra) pela curva de Laffer; tira renda ou sobe preço | sim (`calculos`)                                                          |
| **Verba**           | Gasto do governo vai à instituição; o rendimento dela vira serviço                                        | em parte (verba e rendimento sim; serviço só em atendimento e saneamento) |
| **Transferência**   | Gasto vira renda de um estrato de pops                                                                    | sim (`para`)                                                              |
| **Preço e custo**   | Mexe no preço ou no custo de um setor do mercado                                                          | sim (`valores` nas fichas de setor)                                       |
| **Regra de módulo** | Muda um número de um módulo (moradia, atendimento, saneamento, Judiciário, Congresso, eleição)            | sim, módulo a módulo                                                      |
| **Direito**         | Muda uma liberdade: índices de liberdade e quem gosta pela bússola                                        | sim (índice + bússola)                                                    |

- **"Emprego"** (62 leis no acervo) não tem canal hoje: depende de prédios
  que contratam (Economia, R16.27).
- **"Governo"** (81 leis no acervo) são as regras do Estado (mandato, quórum,
  decreto, ministérios). O canal delas é **regra de módulo** (Congresso,
  eleição, governo).

## 6.3 A triagem de cada lei

Cada uma das 512 passa pelas 4 perguntas do autor ("quanto? partes ou todo?
processo ou lei? o presidente assinaria e pronto?") e pela página "Lei boa e
lei ruim" (`.claude/skills/sisgov-lei-boa`). Sai com um destes vereditos:

- **Fica**, com o molde preenchido;
- **Junta** com outra que repete;
- **Divide** em leis menores;
- **Vira índice** (é consequência), **evento** (depende de cada caso) ou
  **Ato/Operação/Posição** (é decisão do menu);
- **Espera mecânica** (o canal dela ainda não existe, ver decisão 3);
- **Sai**.

Conferir o equilíbrio de lados de cada instituição antes de fechar (a direita
tem leis próprias).

## 6.4 Lei age pela instituição (R7.11)

O efeito de toda lei passa pelo rendimento da instituição onde ela mora:
instituição com pouca verba faz a lei render menos; com verba demais, a sobra
vira corrupção (isso já existe). Assim a verba de cada órgão importa para todas
as leis dele, e o ministro (que muda o rendimento) também.

## 6.5 Tipos novos (R7.16)

- **Lei com prazo:** acaba sozinha e volta a "não legislada"; a bolha tem um
  relógio. O jogo lembra quantas vezes foi usada (ex.: Anistia fiscal).
- **Ato:** acontece uma vez (Graça, suspender a regra fiscal). Fica como botão
  na instituição, com custo na hora.
- **Posição por país e Operação:** só ficam marcadas na planilha; entram com o
  Mundo e com as Companhias.

## 6.6 Revogar (R7.8)

Na bolha: "Revogar" propõe a volta a "não legislada" e passa pelo Congresso como
qualquer mudança.

## 6.7 Onde a lei mora (fonte da verdade)

A planilha `gdd.xlsx` ganha a aba **Leis** com as colunas do molde. Um
exportador (script) gera os JSONs do jogo e o validador confere. O autor mexe na
planilha; o código lê o JSON. (R4.11, R7.22)

## Fora deste plano

- **Opinião** (mecânica 3): por ora a lei só declara a bússola. Quando a
  Opinião existir, o molde ganha o campo de em que ela mexe.
- **Programas** (lembrança e nostalgia) esperam a Opinião.
- **Caminho do dinheiro** (8.2), **prédios e emprego** (5.2, 5.3).
- **Posição por país e Operação** (Mundo e Economia).
- Números finos: calibração no fim.

---

## Ordem de trabalho

Instituição por instituição, em **4 ondas**. Primeiro as que já têm canal de
dinheiro, porque o jogador sente logo.

| Onda | Instituições                                                                                                                                                                                                           | Por quê                           |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1    | Impostos, Previdência, Assistência social, Orçamento e dívida, Moeda e bancos                                                                                                                                          | dinheiro no bolso, canais prontos |
| 2    | Saúde, Educação, Segurança pública, Justiça e prisões, Moradia, Água e saneamento                                                                                                                                      | serviço: verba → rendimento → pop |
| 3    | Trabalho, Energia, Agricultura e pesca, Indústria, Mineração e petróleo, Comércio exterior, Concorrência e consumidor, Infraestrutura e transporte, Ciência e pesquisa, Comunicação e tecnologia                       | preço e custo dos setores         |
| 4    | Meio ambiente, Terra, Imigração, Cultura, Esporte, Turismo, Religião, Defesa, Defesa civil, Relações exteriores, Estatais, Funcionalismo, Estados e municípios, Controle e transparência, Eleições, Regras dos poderes | o resto                           |

**Antes da onda 1 (a base, uma vez só):**

1. Aba Leis na `gdd.xlsx` com o molde, preenchida com o que já existe no JSON
   e no acervo.
2. Exportador planilha → JSON e validador que exige canal.
3. Lei age pela instituição (6.4), revogar (6.6), lei com prazo e ato (6.5).
4. Na bolha da lei: a linha "como chega a você" (o canal em texto de leigo).

**Cada onda, sem parar no meio:**

1. Eu preencho a triagem e o molde de todas as leis da onda na planilha.
2. O autor revisa a onda inteira de uma vez.
3. Eu exporto, faço o que faltar no motor, testo e mostro na tela.
4. Commit da onda.

## Pronto quando

- Nenhuma lei sem canal; nenhuma lei sem nada; nenhuma no centro da bússola
  sem motivo escrito.
- Planilha → JSON pelo exportador; validador exige o molde.
- Revogar, lei com prazo, ato e lei pela instituição funcionando, com teste.
- Na tela: a bolha diz como a lei chega à vida das pessoas; mexer numa lei de
  cada onda muda algo que o jogador vê.
- Requisitos: R4.11, R7.8, R7.11, R7.12, R7.16 (prazo e ato), R7.22.

---

## Decisões do autor (todas de uma vez)

1. **Fonte da verdade:** a planilha `gdd.xlsx` com exportador para o JSON
   _(recomendado)_, ou o JSON passa a ser a fonte e a planilha vira só leitura?
2. **Revisão:** por onda, 4 revisões no total _(recomendado)_, ou por
   instituição, 37 revisões?
3. **Lei cujo canal ainda não existe** (as de emprego, por exemplo): fica no
   jogo só com o efeito em índice e marcada "espera mecânica"
   _(recomendado)_, ou sai até a mecânica existir?
4. **Direito conta como chegar ao pop?** Sim: muda uma liberdade e quem gosta
   pela bússola _(recomendado)_, ou toda lei precisa de dinheiro, preço ou
   serviço?
5. **Lei pela instituição:** o efeito de toda lei vezes o rendimento da
   instituição, com teto em 100% _(recomendado)_, ou só as leis de regra?
6. **Ordem das ondas:** a da tabela _(recomendado)_, ou outra?
