import type { FiscalQuarterReport } from "../game/fiscalReport";

type FiscalQuarterPanelProps = Readonly<{
  report: FiscalQuarterReport;
  unit?: string;
}>;

const numberFormat = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

function amount(value: number, unit: string) {
  return `${numberFormat.format(value)} ${unit}`;
}

export function FiscalQuarterPanel({
  report,
  unit = "unid.",
}: FiscalQuarterPanelProps) {
  return (
    <section className="fiscal-panel" aria-label="Prestação fiscal trimestral">
      <div className="fiscal-panel__heading">
        <div>
          <p className="eyebrow">Prestação fiscal</p>
          <h2>Trimestre preparado</h2>
        </div>
        <span className="fiscal-panel__badge">Prévia · não confirmada</span>
      </div>

      <div className="fiscal-panel__metrics">
        <Metric label="Receitas" value={amount(report.totals.revenue, unit)} />
        <Metric
          label="Despesa primária"
          value={amount(report.totals.primaryExpense, unit)}
        />
        <Metric
          label="Resultado nominal"
          value={amount(report.totals.nominalResult, unit)}
        />
        <Metric
          label="Emissão necessária"
          value={amount(report.totals.issuance, unit)}
        />
        <Metric
          label="Dívida final"
          value={amount(report.finalState.totalDebt, unit)}
        />
        <Metric
          label="Juros adicionais no próximo mês"
          value={amount(report.totals.newDebtInterestNextMonth, unit)}
        />
      </div>

      <div className="fiscal-panel__months">
        {report.months.map((month, index) => (
          <article className="fiscal-month" key={index}>
            <strong>Mês {index + 1}</strong>
            <span>Primário {amount(month.accounting.primaryResult, unit)}</span>
            <span>Juros {amount(month.accounting.interestExpense, unit)}</span>
            <span>Emissão {amount(month.accounting.issuance, unit)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="fiscal-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
