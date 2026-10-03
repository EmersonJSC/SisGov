# Validação e falhas do motor

**Chamado:** SG013

**Data:** 1 de outubro de 2026

**Estado:** decisão definida

## Rejeição integral de conteúdo inválido

Um pacote de cenário inválido é recusado por inteiro. O motor não tenta estimar quanto o erro interferiria na partida nem carrega apenas os arquivos aparentemente válidos, pois uma referência ausente pode retirar silenciosamente custos, requisitos ou consequências.

O conteúdo será preparado por desenvolvedores. Por isso, a validação deve reunir tantos erros independentes quanto for seguro em uma passagem e informar arquivo, ID, campo e motivo para facilitar a correção. A presença de qualquer erro impede a criação da definição executável.

Se já houver uma partida ou definição válida carregada, uma tentativa de carregar um pacote inválido não altera o estado existente. Nenhuma parte do pacote recusado entra na execução.

## Sem saturação automática

O motor não corta automaticamente um resultado para um mínimo ou máximo. Um domínio descreve valores semanticamente possíveis para a grandeza, não um teto genérico de jogabilidade. Valores sem máximo natural podem omitir esse limite.

Percentuais de cobertura, por exemplo, pertencem ao intervalo de 0 a 100 porque representam uma parcela da população. Valores monetários, taxas, contagens e índices usam domínios próprios. Um indicador chamado saúde não deve ser tratado como percentual da população sem definir exatamente o que esse percentual mede.

Se um cálculo produzir um valor impossível para o domínio declarado, o passo falha e preserva o estado anterior. Quando uma grandeza limitada precisar se aproximar do máximo com retornos decrescentes, isso será responsabilidade de um mecanismo explícito do motor, e não de um corte aplicado depois do cálculo.

Democracy 4 usa valores de simulação abstratos geralmente configurados entre 0 e 1. O SisGov não adota essa escala como regra geral: prefere unidades observáveis ou índices cuja composição e interpretação sejam declaradas.

## Adaptação do indicador de saúde de Democracy 4

Democracy 4 representa `Health` como um valor abstrato da rede, normalmente na escala de 0 a 1. Políticas, eventos e outros valores produzem influências positivas ou negativas, e a inércia distribui a mudança ao longo dos turnos. O valor não corresponde diretamente à porcentagem da população saudável.

O SisGov preserva a rede de causas, a inércia e a possibilidade de inspecionar influências, mas substitui o valor abstrato por uma medida documentada. Para o primeiro cenário, a referência recomendada é o Índice de Cobertura de Serviços de Saúde Universal da OMS, apresentado de 0 a 100 e composto por indicadores de serviços essenciais. Ele será identificado como índice sem unidade, não como percentual de pessoas saudáveis.

```text
políticas e condições sociais
        ↓
contribuições com origem e atraso
        ↓
componentes de cobertura e capacidade
        ↓
índice resumido de cobertura de saúde
        ↓
efeitos posteriores e explicação ao jogador
```

O valor inicial registra fonte, data e limitações. Mudanças simuladas exigem relações justificadas e permanecem hipóteses de design. Quando necessário, medidas concretas como mortalidade, espera, capacidade e gasto ficam separadas do índice resumido.

A escala de 0 a 100 possui significado próprio: 100 representa o valor ótimo da composição do índice, não toda a população saudável. O motor não corta resultados nessa faixa; um mecanismo de resposta limitada deve produzir valores válidos ao se aproximar dos extremos. Resultado fora da escala indica erro de conteúdo ou de cálculo.

## Resultado desfavorável não é falha técnica

O motor faz contas, aplica os mecanismos declarados e devolve resultados e explicações. Ele não decide vitória, derrota, falência, encerramento de mandato ou fim da partida. Essas decisões pertencem à camada de jogo.

Déficit, dívida alta, queda de um indicador, baixa aprovação e qualquer outro resultado desfavorável continuam válidos quando respeitam o contrato de suas grandezas. O estado é confirmado normalmente, e a camada de jogo decide quais consequências políticas ou condições de encerramento se aplicam.

São falhas técnicas dados ausentes, referências quebradas, unidade incompatível, duração inválida, mecanismo desconhecido, versão incompatível, resultado não finito e resultado impossível para o domínio declarado.

## Falha atômica do passo

Todos os resultados de um passo são preparados sobre uma cópia de trabalho. Se qualquer cálculo ou validação falhar, nenhum valor, memória, histórico ou número de passo é confirmado. A execução anterior permanece íntegra para diagnóstico, correção do conteúdo ou nova tentativa controlada pela camada de jogo.

Uma falha técnica também não encerra a partida por decisão do motor. O motor devolve o diagnóstico estruturado, e a camada de jogo apresenta o erro e impede a continuação até existir uma ação válida.

## Diagnósticos estruturados

Um erro identifica pelo menos código, arquivo quando aplicável, ID do elemento, campo e motivo legível. Erros de execução também informam o passo e os valores relevantes que puderem ser apresentados com segurança.

Exemplo de erro de conteúdo:

```json
{
  "codigo": "REFERENCIA_AUSENTE",
  "arquivo": "consequencias/melhoria-educacao.json",
  "elementoId": "melhoria_educacao",
  "campo": "destino",
  "motivo": "O destino 'educacao_publica' não existe no pacote."
}
```

Exemplo de resultado válido e desfavorável:

```json
{
  "saldoFiscal": -20,
  "dividaPublica": 120,
  "resultado": "confirmado"
}
```

O saldo negativo não é erro quando o domínio permite déficit e a camada de jogo possui uma regra de financiamento.

## Resultado da revisão

Conteúdo inválido é recusado integralmente, e falhas durante um passo preservam o estado anterior. O motor não corrige resultados silenciosamente nem encerra partidas. Resultados desfavoráveis são confirmados quando matematicamente válidos; a camada de jogo interpreta suas consequências.
