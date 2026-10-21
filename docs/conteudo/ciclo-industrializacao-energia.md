# Ciclo de jogo: energia e industrialização

> **Status: EM REVISÃO.** Primeira leitura por ciclo no índice em 19/out/2026.
> As rotas abaixo são caminhos potenciais, ainda sem aprovação de jogabilidade.

## Cadeia que o jogador precisa controlar

`verba e modelo de geração → capacidade e preço da energia → produção industrial
→ emprego/exportações → arrecadação`, com emissões, dívida e apoio social como
custos ou limites. A consulta compacta é
`python3 scripts/conteudo/indice_leis.py ciclo --ciclo industrializacao-energia`.
Ela lê os campos `jogo` do índice; não modifica os JSONs do motor.

| Projeto | Alavancas já encontradas | Lacuna ou tensão |
| --- | --- | --- |
| Esquerda econômica | Banco de desenvolvimento, ferrovia pública, política industrial setorial, matriz renovável | Falta verba elétrica específica que se converta em capacidade. |
| Direita econômica | Crédito de mercado, concessão ferroviária, abertura comercial, leilão de menor custo | A escolha da fonte da usina precisa depender de investimento real. |
| Progressismo | Indústria limpa, renováveis, ferrovia e regras de emissões | A transição precisa preservar oferta firme ou cobrar o risco de apagão. |
| Conservadorismo | Gás/carvão ou nuclear, proteção industrial e segurança de oferta | O caminho precisa mostrar custo, emissões e reação dos grupos. |

## Decisões desta passagem

- **Juntar:** `fontes-de-energia-favorecidas` repetia as quatro escolhas da
  `matriz-energetica`. A primeira foi removida **pelo índice**; as referências em
  `investimento-em-geracao-por-fonte` e `usinas-a-carvao` passaram à matriz.
  O gerador atualizou catálogo, cenário, estado inicial e bússola. O teste focal
  de carga do cenário passou (8 casos).
- **Manter separadas:** fonte da próxima usina, usinas a carvão e energia nuclear
  representam decisões setoriais diferentes da regra geral da matriz.
- **Ampliar:** `investimento-em-geracao-por-fonte` agora usa a verba elétrica
  como escala dos efeitos. Gás entra em dois turnos, solar/eólica/hídrica em
  oito, nuclear em quarenta; todos os coeficientes são hipóteses de jogo. A
  escolha nuclear exige a opção de expansão da lei nuclear.
- **Criar e separar:** `orcamento-de-expansao-eletrica` foi criada no índice com
  variável de verba própria e custo fiscal. O gerador foi ampliado para publicar
  a variável. `investimento-em-infraestrutura` deixou de produzir capacidade
  elétrica diretamente. A [ANEEL](https://www.gov.br/aneel/pt-br/assuntos/leiloes)
  serve de trilho para a existência de leilões de contratação; não valida os
  coeficientes do jogo.
- **Ainda aberto:** `volume-de-incentivo-a-industria` tem controle sem efeito
  direto. Também falta provar que a nova capacidade altera oferta, preço e
  indústria de maneira perceptível. A lei nova aparece uma vez no Ministério
  das Cidades e a trava nuclear foi publicada; faltam as rotas antes de aprovar
  o ciclo.

O ciclo permanece aberto. Os quatro projetos têm escolhas candidatas, mas ainda
não há prova de que cada rota funcione de ponta a ponta. Próximo passo:
comparar duas rotas focais de
16 turnos, especialmente capacidade → oferta/preço → indústria.

## Ensaio focal de 16 turnos

Mesmo país, semente 7, sem ocorrências ou eleição. Nas rotas solar e gás, o
orçamento elétrico foi 20.000 em moeda anual; só a fonte escolhida mudou.

| Rota, turno 16 | Capacidade elétrica | Oferta | Preço | Emissões | Investimento | Gasto (% PIB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Referência | 76,859 | 69,963 | 41,769 | 56,392 | 27,507 | 30,874 |
| Solar | 76,997 | 69,963 | 41,770 | 56,093 | 27,507 | 31,041 |
| Gás | 77,256 | 69,963 | 41,772 | 56,887 | 27,507 | 31,041 |

As três partidas chegaram ao turno 16. **Hipótese não confirmada:** capacidade
adicional não se propagou perceptivelmente para oferta, preço ou investimento.
O índice de variáveis também não tem produção industrial/manufatura como bolha
separada. Corrigir essas ligações antes de aprovar o ciclo ou marcar as leis como
revisadas. O script do ensaio é `scripts/teste/cicloEnergiaIndustria.ts`.
