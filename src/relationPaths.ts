export type RelationPoint = Readonly<{ x: number; y: number }>;

function formatCoordinate(value: number): string {
  return Number(value.toFixed(2)).toString();
}

/** A stable quadratic curve for a directed map relation. */
export function relationPath(
  start: RelationPoint,
  end: RelationPoint,
  parallelIndex = 0,
  parallelCount = 1,
  startRadius = 0,
  endRadius = 0,
): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 0.001) {
    const loop = 3 + Math.max(0, parallelIndex) * 1.5;
    return `M ${formatCoordinate(start.x)} ${formatCoordinate(start.y)} C ${formatCoordinate(start.x + loop)} ${formatCoordinate(start.y - loop)} ${formatCoordinate(start.x - loop)} ${formatCoordinate(start.y - loop)} ${formatCoordinate(end.x)} ${formatCoordinate(end.y)}`;
  }

  const startTrim = Math.min(Math.max(0, startRadius), distance * 0.45);
  const endTrim = Math.min(Math.max(0, endRadius), distance * 0.45);
  const unitX = dx / distance;
  const unitY = dy / distance;
  const pathStart = {
    x: start.x + unitX * startTrim,
    y: start.y + unitY * startTrim,
  };
  const pathEnd = {
    x: end.x - unitX * endTrim,
    y: end.y - unitY * endTrim,
  };
  const pathDx = pathEnd.x - pathStart.x;
  const pathDy = pathEnd.y - pathStart.y;
  const pathDistance = Math.hypot(pathDx, pathDy);
  const spread = parallelIndex - (parallelCount - 1) / 2;
  const bend = Math.max(1.5, Math.min(10, pathDistance * 0.14)) + spread * 2;
  const midpointX = (pathStart.x + pathEnd.x) / 2;
  const midpointY = (pathStart.y + pathEnd.y) / 2;
  const controlX = midpointX - (pathDy / pathDistance) * bend;
  const controlY = midpointY + (pathDx / pathDistance) * bend;

  return `M ${formatCoordinate(pathStart.x)} ${formatCoordinate(pathStart.y)} Q ${formatCoordinate(controlX)} ${formatCoordinate(controlY)} ${formatCoordinate(pathEnd.x)} ${formatCoordinate(pathEnd.y)}`;
}
