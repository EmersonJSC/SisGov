# SG053 — Parâmetros do primeiro cenário

**Estado:** Concluído — calibração inicial de jogo, ainda não escrita em JSON.  
**Data:** 3 de outubro de 2026.  
**Dependência:** [SG052](sg052-consequencias-do-primeiro-cenario.md).

Este é um conjunto de parâmetros para tornar o primeiro cenário observável e auditável em um mandato de teste curto. Não é previsão sobre o Brasil. Onde há dado observado, ele continua como estado inicial em SG051; os coeficientes, limites e tempos abaixo são hipóteses de design.

## Como o motor existente será usado

O cenário usa somente mecanismos já implementados no motor:

- **resposta gradual:** o nível em funcionamento aproxima-se da meta financeira a cada turno; não salta para ela;
- **contribuição afim:** uma relação aplica uma contribuição com coeficiente e termo de referência já suportados pelo motor;
- **atraso:** a consequência lê o estado de turnos anteriores quando necessário;
- **duração contínua ou fixa:** políticas ativas contribuem continuamente; o evento tem efeito fixo depois de começar.

O termo de referência faz o estado herdado permanecer coerente: na verba inicial, a contribuição líquida da relação é zero. Por exemplo, R1 não transforma automaticamente 72% de cobertura em outro número só porque P1 já existia antes da partida. Se o jogador aumenta P1, a diferença em relação à verba herdada passa a produzir efeito depois do atraso.

Não haverá fórmulas livres no JSON. SG054 apenas declarará os valores dos mecanismos acima. O código do motor continua sendo o lugar que executa o cálculo.

## Faixas das três políticas

Todos os valores são **R$ milhões de 2024 por ano**, pertencentes exclusivamente ao envelope do recorte.

| Política | Inicial | Faixa permitida | Implantação por turno | Degradação por turno | Motivo de jogo |
| --- | ---: | ---: | ---: | ---: | --- |
| P1 — atenção básica | 4.000 | 2.400–6.000 | 30% da distância até a meta | 18% da distância até a meta | Uma expansão de apoio pode aparecer antes das demais, mas equipes, rede e execução local impedem salto instantâneo. A redução preserva parte da capacidade por algum tempo. |
| P2 — atendimento e proteção às mulheres | 240 | 0–600 | 22% | 12% | A rede depende de articulação, equipe, instrumentos e parceiros. Construir e desmobilizar são lentos. O limite zero significa encerrar a alocação adicional do recorte, não revogar direitos ou apagar a rede real. |
| P3 — prevenção e cooperação em segurança | 600 | 0–1.400 | 18% | 10% | Cooperação e prevenção exigem pactuação e adoção por órgãos com competências próprias; por isso a resposta é a mais lenta. |

As faixas são hipóteses de conteúdo e não limites fiscais brasileiros. SG050 continua valendo: uma meta acima da autorização disponível vira proposta orçamentária futura; um saldo negativo pode existir e não é uma falha técnica.

## Parâmetros das relações

Os coeficientes abaixo produzem contribuição **por turno**. A coluna “referência” é o termo que neutraliza a relação no estado herdado. Ela não é uma fórmula nova no conteúdo: será o `termoConstante` já aceito pelo mecanismo afim.

| Relação | Coeficiente inicial e faixa para teste | Referência inicial | Atraso | Duração | Justificativa e expectativa |
| --- | --- | --- | ---: | --- | --- |
| R1 P1 → V4 cobertura APS | `+0,004` ponto percentual por R$ mi; testar `+0,002` a `+0,006` | em 4.000, contribuição `0` | 1 turno | contínua | Aumentar P1 em 1.000, depois de implantação, tende a acrescentar até 4 pontos de cobertura sobre a base herdada. Não representa uma elasticidade observada nacional. |
| R2 V4 → V6 pressão hospitalar | `−0,30` ponto de pressão por ponto de cobertura; testar `−0,15` a `−0,40` | em 72%, contribuição `0` | 1 turno | contínua | Acesso maior reduz parte da pressão, sem prometer eliminar urgências. Evidência de contexto: internações sensíveis à APS, registrada em SG052. |
| R3 V4 → V5 saúde | `+0,12` ponto de saúde por ponto de cobertura; testar `+0,06` a `+0,18` | em 72%, contribuição `0` | 2 turnos | contínua | O resultado geral aparece depois da ampliação de acesso e deliberadamente menor que o efeito de serviço. |
| R4 V6 → V5 saúde | `−0,12` ponto de saúde por ponto de pressão; testar `−0,06` a `−0,18` | em 54, contribuição `0` | 1 turno | contínua | Sobrecarga reduz a condição agregada de saúde, com incerteza alta. Ela é menor que R2 para impedir que uma única variação domine toda a cadeia. |
| R5 P2 → V8 proteção efetiva | `+0,020` ponto de proteção por R$ mi; testar `+0,010` a `+0,030` | em 240, contribuição `0` | 2 turnos | contínua | Mais recursos elevam gradualmente a capacidade de rede. O ganho máximo de P2 não transforma automaticamente a proteção em 100. |
| R6 P3 → V7 violência letal | `−0,0012` homicídio por 100 mil por R$ mi; testar `−0,0006` a `−0,0020` | em 600, contribuição `0` | 3 turnos | contínua | É a hipótese mais incerta: ampliar P3 em 800 teria efeito de até −0,96 na taxa, após implantação e atraso. A direção vem do objetivo da política; o tamanho não vem de uma estimativa causal nacional. |
| R7 V7 → V6 pressão hospitalar | `+0,50` ponto de pressão por homicídio/100 mil; testar `+0,25` a `+0,75` | em 21,2, contribuição `0` | 1 turno | contínua | V7 é usado como sinal de exposição a violência, não como contagem completa de atendimentos. A influência fica abaixo da do evento de demanda. |
| R8 evento → V6 pressão hospitalar | `+9` pontos; testar `+6` a `+12` | carga auxiliar igual a 1 | 0 turnos | fixa, 3 turnos | O choque é visível logo no turno do evento e continua contribuindo por dois turnos após sua ocorrência. Isso permite que a situação de sobrecarga persista mesmo depois de o evento deixar de aparecer. |

R1 a R7 usam contribuições contínuas enquanto a política ou cadeia correspondente estiver ativa. R8 é diferente: o evento ocorre uma vez, mas sua consequência dura três turnos. O motor já suporta duração fixa; não será criado um mecanismo especial apenas para este caso.

## Limites e situação de sobrecarga

| Elemento | Domínio inicial | Regra de segurança |
| --- | --- | --- |
| V4 cobertura APS | 0–100% | A soma de contribuições não pode sair do domínio; SG054 deve validar o cenário e ajustar faixa antes de aceitar valores extremos. |
| V5 saúde | 0–100 | Sem arredondamento oculto nem “clamp” automático; resultado fora do domínio é erro de conteúdo a corrigir. |
| V6 pressão hospitalar | 0–100 | Situação `sobrecarga do atendimento` entra em `V6 ≥ 62` e sai somente em `V6 < 56`. A diferença evita ligar e desligar a situação na mesma fronteira. |
| V7 violência letal | 0–60 homicídios por 100 mil | A faixa excede a base de 21,2 e comporta o teste sem permitir resultado negativo. |
| V8 proteção efetiva | 0–100 | Continua como índice de jogo, não percentual de mulheres protegidas. |

O evento R8, partindo de V6=54, leva a pressão a aproximadamente 63 antes das demais influências. Assim ele ativa a sobrecarga. Se P1 estiver sendo ampliada, R2 pode amortecer a pressão, mas não apagar a ocorrência instantaneamente. A saída em 56 impede que a situação desapareça no mesmo momento em que o evento termina.

## Variável auxiliar do evento

Para manter as dez variáveis de domínio de SG051 e ainda representar R8 com o motor existente, SG054 declarará uma variável técnica que não é indicador do país nem controle do jogador:

| ID proposto | Nome interno | Unidade | Valor | Uso |
| --- | --- | --- | ---: | --- |
| `carga_evento_demanda` | Carga do evento temporário | unidade de carga | 1 | Origem da contribuição fixa de R8 enquanto a ocorrência estiver ativa. |

Ela permite que a consequência seja auditável sem usar uma variável de saúde como origem artificial do evento. A bolinha não precisa aparecer no mapa normal; os detalhes do evento mostram sua contribuição de `+9` em V6. Esse campo é estado auxiliar, tal como memória de atraso e implantação, e não amplia a contagem dos dez indicadores de domínio.

## Trajetórias de referência a comparar em SG055

Os roteiros não são resultados já calculados; são expectativas que os testes deverão confirmar ou refutar.

| Roteiro de oito turnos | Escolha | O que deve ocorrer |
| --- | --- | --- |
| Base | Manter P1, P2 e P3 nos valores herdados; sem evento | V4=72, V5=60, V6=54, V7=21,2 e V8=42 permanecem na base. O saldo também não muda por nova decisão. |
| Saúde | No turno 1, meta de P1 passa de 4.000 para 5.000 | O gasto/meta começa a mudar no primeiro turno; V4 começa a responder após o atraso; V6 cai depois; V5 melhora por último. Perfil A percebe mais o efeito. |
| Segurança | No turno 1, meta de P3 passa de 600 para 1.000 | A implantação é lenta e V7 só começa a cair depois de três turnos. A melhora é pequena por turno, porém legível; perfil B percebe mais o efeito. |
| Pressão | Aplicar R8 no turno 3 | V6 sobe de modo visível, aciona sobrecarga e continua elevada pela duração fixa. A política de saúde pode amortecer, mas não evitar retroativamente o choque. |

Se a base variar sem decisão, há erro de referência. Se uma mudança de política não puder ser percebida até o turno 8, aumentar somente o parâmetro necessário dentro da faixa registrada. Se um único controle dominar todos os indicadores, reduzir sua faixa ou coeficiente antes de acrescentar outra regra.

## Decisões e limites desta calibração

- Os parâmetros são hipóteses explícitas e devem aparecer na auditoria do mapa e da bancada, com relação, origem e atraso.
- Não há sorteio nesta versão. O mesmo estado e as mesmas decisões produzem a mesma trajetória.
- Não há efeito eleitoral, aprovação ministerial ou satisfação calculada nesta tarefa. As diferenças de perfil registradas em SG052 orientam a futura camada de jogo.
- Não introduzir uma ligação direta de P2 à taxa nacional de homicídios nem uma ligação financeira no grafo para V9→V10.
- Um saldo negativo é uma consequência financeira possível; autorização e cobrança única serão implementadas na Fase 7.

SG053 entrega uma primeira parametrização testável. SG054 escreverá o JSON de cenário; SG055 executará base, aumento e redução para comparar o comportamento real do motor com estas expectativas.
