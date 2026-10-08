export type TurnLogEntry = Readonly<{
  id: number;
  turn: number;
  month?: number;
  period?: "month" | "quarter";
  level: "info" | "success" | "error";
  title: string;
  details: readonly string[];
}>;
export const TURN_LOG_LIMIT = 100;
/** A bounded session journal, independent of the numerical delay history. */
export function appendTurnLog(
  entries: readonly TurnLogEntry[],
  entry: Omit<TurnLogEntry, "id">,
): readonly TurnLogEntry[] {
  return [
    { ...entry, details: [...entry.details], id: (entries[0]?.id ?? 0) + 1 },
    ...entries,
  ].slice(0, TURN_LOG_LIMIT);
}
