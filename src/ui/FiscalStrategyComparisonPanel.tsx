import type { FiscalStrategyComparisonResult } from "../domain/fiscal";

type FiscalStrategyComparisonPanelProps = Readonly<{
  comparison: FiscalStrategyComparisonResult;
  unit?: string;
}>;

const numberFormat = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

function amount(value: number, unit: string) {
  return `${numberFormat.format(value)} ${unit}`;
}

export function FiscalStrategyComparisonPanel({
  comparison,
  unit = "unid.",
}: FiscalStrategyComparisonPanelProps) {
  return (
    <section
      className="fiscal-comparison"
      aria-label="Comparação de estratégias fiscais"
    >
      <div className="fiscal-panel__heading">
        <div>
          <p className="eyebrow">Laboratório fiscal</p>
          <h2>Comparar estratégias</h2>
        </div>
        <span className="fiscal-panel__badge">Prévia</span>
      </div>
      <p className="fiscal-comparison__help">
        Todas as alternativas partem do mesmo caixa e da mesma dívida. Nenhuma
        altera a partida até o jogador confirmar o turno.
      </p>
      <div className="fiscal-comparison__table" role="table">
        <div
          className="fiscal-comparison__row fiscal-comparison__row--header"
          role="row"
        >
          <span role="columnheader">Estratégia</span>
          <span role="columnheader">Emissão</span>
          <span role="columnheader">Caixa final</span>
          <span role="columnheader">Dívida final</span>
        </div>
        {comparison.strategies.map(({ strategy, accounting }) => (
          <div className="fiscal-comparison__row" key={strategy.id} role="row">
            <strong role="cell">{strategy.label}</strong>
            <span role="cell">
              {amount(accounting.state.debtIssuedDuringGame, unit)}
            </span>
            <span role="cell">{amount(accounting.state.cash, unit)}</span>
            <span role="cell">{amount(accounting.state.totalDebt, unit)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
