# Lote 15: sindicatos e acesso a direitos

> **Status: INTEGRADO E TESTADO FOCALMENTE.** Coeficientes são hipóteses de
> jogo. Os instrumentos políticos já estavam no catálogo e foram tratados
> como decisões separadas.

```text
negociacao-coletiva-e-sindicatos (lei anterior)
  ├─ contribuicao-sindical (quem paga o sindicato)
  └─ direito-de-greve (quando empregados podem parar)

custo-de-processar-na-justica-do-trabalho (acesso ao tribunal)
igualdade-salarial-de-genero (como fiscalizar salário igual)
```

As quatro leis foram **mantidas separadas**. Contribuição financia a
organização, greve define poder de paralisação, custas regulam acesso ao
tribunal e igualdade salarial define fiscalização nas empresas. As opções
agora descrevem ações concretas e seus ganhos e perdas. A lei de custas
ganhou efeito direto em litígio, que antes era prometido somente no texto.

| Lei | Dilema do jogador |
| --- | --- |
| `contribuicao-sindical` | Mensalidade voluntária, taxa com direito de recusa ou desconto obrigatório; capacidade sindical versus liberdade de não pagar. |
| `direito-de-greve` | Proibir paralisações, exigir votação e serviço mínimo ou admitir greve ampla; barganha e liberdade versus produção. |
| `custo-de-processar-na-justica-do-trabalho` | Gratuidade, gratuidade para baixa renda ou cobrar quem perde; filtrar ações fracas versus impedir cobrança legítima. |
| `igualdade-salarial-de-genero` | Sem obrigação, princípio geral, dados públicos ou auditoria com multa; correção de diferenças versus custo de conformidade. |

## Ensaio de 16 turnos

`scripts/teste/setorTrabalhoLote15.ts` compara referência e duas rotas na
mesma semente, sem ocorrências ou eleição. **Empresarial:** mensalidade
voluntária, greve proibida, custas para a parte derrotada e igualdade apenas
declarada. **Direitos:** contribuição obrigatória, greve ampla, gratuidade e
auditoria salarial. A aplicação direta isola a rede; não simula o Congresso.

| Indicador no turno 16 | Referência | Empresarial | Direitos |
| --- | ---: | ---: | ---: |
| Greve geral | 12,018 | 4,120 | 14,021 |
| Litígio trabalhista | 75,027 | 71,110 | 75,031 |
| Diferença salarial por gênero | 20,994 | 21,932 | 20,025 |
| Discriminação | 44,977 | 45,910 | 44,006 |
| Confiança empresarial | 44,249 | 49,916 | 41,307 |
| Produtividade | 18,078 | 27,485 | 17,834 |
| PIB (índice da rede) | 43,461 | 50,277 | 42,920 |
| Liberdade civil | 70,030 | 64,082 | 70,064 |
| Gasto público (% do PIB) | 30,873 | 31,638 | 30,850 |
| Dívida (% do PIB) | 114,847 | 109,837 | 115,065 |
| Satisfação média | 48,930 | 48,707 | 49,245 |

As três partidas acabaram sem travamento ou valor inválido. Greves reagiram
logo; diferença salarial, produtividade e PIB ficaram distintos após os
turnos 4 a 8. O dilema é visível, mas o ganho da rota empresarial de
produtividade (+9,407) e PIB (+6,816) frente à referência parece **forte
demais** para a mudança conjunta e precisa de balanceamento antes de ser
considerado calibrado. As custas reduzem litígios no motor, porém o ensaio não
mede separadamente ações legítimas desestimuladas; esta perda aparece apenas
na narrativa da opção por enquanto.

**Verificação focal:** 3 testes em `src/tests/trabalhoLote15.test.ts`
passaram. A checagem geral segue para o fim da revisão.
