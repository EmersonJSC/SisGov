# Próxima fase: turnos, orçamento e capacidade de execução

Revisão de 3 de outubro de 2026, solicitada pelo usuário. Complementa SG057–SG064,
SG069 e SG077–SG080 sem renumerar os 96 chamados. Estado: plano de implementação;
as mecânicas econômicas abaixo ainda não foram implementadas.

## Onde estamos

O motor numérico, o carregamento, a bancada e o primeiro recorte em JSON existem.
As fases 03–06 possuem entregas e testes registrados. O mapa com mais de cem
políticas é um laboratório gerado para escala visual, não um país economicamente
calibrado nem a partida integrada da Fase 07. Sua conta de saldo é demonstrativa;
ainda não financia déficit, não mantém dívida e não representa bancos.

A próxima fase é a **Fase 07 — Partida completa**, começando por SG057-A (tempo e
ordem do turno) e pelo contrato fiscal de SG060-A. A apresentação espacial fica
mantida enquanto validamos escolhas com consequências contábeis e sociais.

## O que o planejamento já cobria e o que faltava

| Tema | Cobertura anterior | Complemento desta revisão |
|---|---|---|
| Turnos e falhas atômicas | SG057 e SG061 | Diagnóstico visível, registro da partida e recuperação de erro |
| Receitas, despesas, déficit, dívida e juros | SG060 | Separar estoque/fluxo, resultado primário/nominal, caixa e refinanciamento |
| Disponibilidade de ações | SG058–SG059 | Separar autorização, liquidez, financiamento e capacidade operacional |
| Bancos, crédito e mercado de títulos | Sem recorte explícito | SG060-C: agentes agregados, solvência/liquidez e canais para a economia |
| Limites de políticas | Domínio numérico genérico | SG058-C: limite legal, execução física, saturação e retornos decrescentes |
| Corrupção e superfaturamento | Sem mecanismo explícito | SG058-D: governança, perda de eficiência e risco; sem associação automática entre gasto e corrupção |
| Ampliação das variáveis | Recorte inicial pequeno | Ondas com dependências, unidade, procedência e testes antes da expansão |

## Sequência de execução

1. **SG043-R — Reparar o laboratório e registrar o turno.** Corrigir os parâmetros
   demonstrativos que impedem o primeiro avanço, preservar decisões em erro,
   liberar o botão após falha e mostrar um diário. Não declarar a Fase 07 concluída.
2. **SG057-A — Fechar o contrato temporal.** Fixar duração do turno, quantos passos
   ele executa, calendário de cobrança, aplicação de decisões, fatos descobertos
   ao final e ordem de confirmação. Proposta para avaliação: trimestre por turno;
   ainda não adotada. Taxas anuais precisam ser convertidas explicitamente.
3. **SG060-A/B — Núcleo fiscal e financiamento mínimo.** Primeiro demonstrar contas
   à mão; depois implementar a conta fiscal independente da interface, cenários
   com déficit e superávit e regras de financiamento. Expor restrições à decisão.
4. **SG058-C/D — Uma política completa de Saúde.** Validar demanda, capacidade,
   orçamento executado, entrega e saturação, incluindo desvios e fiscalização
   apenas após o modelo básico. Expandir outras políticas usando os mesmos mecanismos.
5. **SG060-C — Bancos e crédito agregados.** Acrescentar o canal financeiro quando
   a contabilidade fiscal estiver reconciliada. Essa extensão não bloqueia o
   teste inicial Tesouro–mercado de títulos, mas deve preceder a declaração de
   que o sistema econômico completo da versão está pronto.
6. **SG057-B e SG058-A/B — Autorização política.** Definir Senado e eleições;
   integrar aprovação, implantação e orçamento sem usar dinheiro como apoio político.
7. **SG061–SG064 — Confirmar a partida completa.** Um turno confirma todas as
   etapas ou nenhuma; testar continuidade, eleições e consequências adversas válidas.

O contrato fiscal pode ser desenvolvido e testado isoladamente após SG057-A.
A autorização final das ações aguarda SG057-B e SG058. Não usar o atalho de
aprovação da bancada como regra da partida.

## Quando entram novas variáveis

Entram **já na Fase 07**, por circuitos pequenos. Não esperar a fase de balanceamento
para introduzir dívida e capacidade, nem adicionar dezenas de indicadores de uma vez.

| Onda | Variáveis/estados necessários | Condição para avançar |
|---|---|---|
| Fiscal mínima, SG060-A/B | Receita do período, despesa primária, juros, caixa, estoque de dívida, principal a vencer, emissão e amortização | Identidades reconciliadas por vários turnos; déficit não trava o motor |
| Indicadores fiscais derivados | Resultado primário e nominal, necessidade de financiamento; PIB do período e dívida/PIB quando o denominador estiver definido | Sem misturar PIB trimestral com anual; nenhuma duplicação de fluxos |
| Capacidade de Saúde, SG058-C | Demanda, capacidade instalada, pessoal/insumos agregados, capacidade administrativa, entrega e fila/cobertura | Mais gasto pode ajudar, mas o ganho marginal diminui e a capacidade demora a crescer |
| Governança, SG058-D | Fiscalização, exposição a contratações, perdas por desvio e preço contratado versus referência | Gasto alto sozinho não dispara corrupção; perdas explicáveis sem dupla contagem |
| Financeira ampliada, SG060-C | Taxa básica, prêmio de risco, custo de novas emissões, crédito, inadimplência e condição agregada dos bancos | Distinguir juros da dívida existente, juros de nova dívida e juros ao tomador |
| Macroeconômica seguinte | Base tributável, atividade/PIB, emprego, inflação e reação monetária simplificada | Cada elo tem unidade, atraso e hipótese; trajetórias estáveis antes de ampliar setores |

Cada variável recebe ID, unidade, classe (estoque, fluxo, razão ou controle), domínio,
valor inicial, fonte ou hipótese, causas, destinos e testes de extremos. Fluxos e
razões derivados não precisam virar novos estados persistidos. Nem toda variável
contábil precisa ganhar uma bolinha no mapa.

## Núcleo fiscal: contrato proposto

Todos os valores abaixo são do mesmo período e da mesma base de preços:

- R: receitas; G: despesas primárias; J: juros pagos;
- C: caixa; D: principal da dívida; E: emissões; A: amortização do principal.

Identidades da primeira versão, sem reavaliação cambial nem indexação:

```
resultado_primario = R − G
resultado_nominal = R − G − J
caixa_final = caixa_inicial + resultado_nominal + E − A
divida_final = divida_inicial + E − A
```

Déficit nominal é resultado_nominal negativo; superávit é positivo. Principal
amortizado não é despesa primária nem juros. Emissão não é receita tributária.
Superávit não reduz dívida automaticamente: definir quanto vai para caixa e
quanto financia amortização. Juros pagos com nova emissão entram uma única vez
no estoque, por E; não somar J novamente à dívida.

Necessidade de financiamento inclui vencimentos: mesmo com resultado nominal zero,
um vencimento de 20 exige caixa ou emissão de 20. Uma tabela simples por faixas de
vencimento distingue refinanciamento de dívida nova para cobrir gasto corrente.

Exemplos de aceite com caixa inicial zero e dívida inicial 100:

| R | G | J | A | E | Caixa final | Dívida final | Leitura |
|---:|---:|---:|---:|---:|---:|---:|---|
| 100 | 100 | 5 | 0 | 5 | 0 | 105 | Déficit nominal de 5 financiado |
| 120 | 100 | 5 | 0 | 0 | 15 | 100 | Superávit mantido em caixa |
| 120 | 100 | 5 | 15 | 0 | 0 | 85 | Superávit usado para amortizar |
| 105 | 100 | 5 | 20 | 20 | 0 | 100 | Rolagem, sem aumento líquido da dívida |

Se emissão disponível e caixa não cobrirem os pagamentos, aplicar uma regra de
jogo explícita: limitar novas execuções, adiar despesas permitidas, registrar
atrasados ou produzir crise/inadimplência. Não criar dinheiro, permitir dívida
infinita silenciosamente nem tratar falta de financiamento como erro técnico.

O menu de uma política distingue: autorização, compromisso futuro, caixa disponível,
financiamento possível e custo recorrente. A interface exibe o motivo e estimativas;
a camada de jogo valida novamente ao confirmar o turno.

## Bancos, Tesouro e autoridade monetária

Começar com três papéis agregados:

- Tesouro arrecada, paga e emite dívida.
- Bancos intermedeiam crédito, carregam ativos e têm restrições de liquidez/capital.
- Autoridade monetária define a regra de taxa básica e eventuais instrumentos
  explicitamente modelados; não é uma conta ilimitada do Tesouro.

Mercado de títulos e empréstimos privados não são o mesmo canal. Taxa básica,
prêmio de risco soberano, custo médio da dívida e taxa ao tomador são variáveis
separadas. Uma alta de taxa afeta novas emissões/rolagem conforme vencimentos,
não reprifica automaticamente toda a dívida de taxa fixa.

Primeiro validar relações simples: condição dos bancos → oferta/custo do crédito
→ atividade → base tributável; risco/rolagem → juros futuros → espaço orçamentário.
Definir atrasos e fontes/hipóteses. Não presumir que toda dívida seja detida por
bancos, que todo déficit provoque inflação, nem adotar crowding-out automático.
Balanços individuais, rede interbancária, câmbio e resgates detalhados ficam para
expansão posterior, salvo necessidade demonstrada pelo recorte.

## Uma lei tem limite? Separar quatro limites

1. **Jurídico:** opções admissíveis, vigência, competência e autorização. Uma lei
   que permite/proíbe algo não deve usar um controle de dinheiro sem significado.
2. **Orçamentário:** compromisso autorizado, execução financiável e recorrência.
   Não é um teto arbitrário de 100 para qualquer política monetária.
3. **Operacional:** pessoal, infraestrutura, insumos e capacidade de contratar e
   executar dentro do período. Ampliar capacidade pode ser outra decisão com atraso.
4. **De resultado:** cobertura tem população-alvo finita; uma entrega adicional
   pode ter retorno menor e atacar outra necessidade. Saúde não melhora sem limite
   por repetir a mesma relação linear.

Proposta de curva para testar, não coeficiente já validado:

```
q = capacidade_de_entrega(orçamento_executado, pessoal, infraestrutura, preços, gestão)
beneficio(q) = beneficio_maximo × (1 − exp(−q / escala_de_demanda))
```

O orçamento nominal pode aumentar; a entrega depende de q. Recursos excedentes
podem formar caixa autorizado, financiar capacidade futura ou ser mal utilizados
conforme regras explícitas. Não gerar melhora infinita e não confundir um limite
de demanda com uma proibição universal de investir mais.

Corrupção não decorre inevitavelmente de investir muito. Modelar oportunidades
de contratação, instituições, fiscalização e incentivos. Superfaturamento aumenta
preço por unidade; desvio reduz o que chega à entrega; ineficiência pode ocorrer
sem crime. O gasto pago continua contabilizado uma vez, mesmo quando entrega pouco.
Não subtrair o mesmo desvio duas vezes como gasto adicional e perda de caixa.

Cobrir: pouco gasto, expansão útil, saturação, capacidade ampliada com atraso,
fiscalização forte/fraca, preço elevado sem desvio, e teto legal. Antes de curvas
novas, criar mecanismos declarados com validação e testes; nunca esconder uma
limitação silenciosa no renderizador ou remover a validação de domínio do motor.

## Registro e explicações

O diário deve informar: início, decisão preparada, meta e nível efetivo, avanço,
resultados com causas/atrasos, mudança de situações e falhas com campo/ID/motivo.
Na integração fiscal, incluir receitas, despesas, juros, emissão, amortização,
caixa e dívida antes/depois; distinguir previsto de realizado.

Diário da interface não é o histórico técnico necessário para atrasos. A versão
atual guarda os últimos 100 registros em memória de sessão; recarregar os remove.
Persistência/exportação entram em SG081–SG082 junto do save. Falha técnica não
consome decisões ou avança turno; fatos negativos válidos devem avançar e ser explicados.

## Marco de aceite antes de ampliar o catálogo

- Avançar base, cortes e expansão por 60 turnos de teste sem falha numérica.
- Reconciliar caixa e dívida em cada turno, inclusive déficit, superávit e rolagem.
- Mostrar ao menos uma decisão autorizada mas com execução limitada por capacidade
  ou financiamento, com motivo; evitar dupla cobrança ao tentar novamente.
- Demonstrar retornos decrescentes, capacidade futura e perda de eficiência distintos.
- Demonstrar influências sociais/econômicas, sem transformar finanças no único objetivo.
- Só então adicionar novas políticas/variáveis que usem os contratos já verificados.
