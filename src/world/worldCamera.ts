import type { WorldPoint } from "./worldViewModel";

export type WorldCamera = Readonly<{ x: number; y: number; scale: number }>;
export type CameraVelocity = Readonly<{ x: number; y: number }>;
export type WorldBounds = Readonly<{
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}>;

export const WORLD_ZOOM_LIMITS = Object.freeze({ min: 0.25, max: 3 });

export function clampWorldZoom(
  zoom: number,
  limits = WORLD_ZOOM_LIMITS,
): number {
  return Math.max(limits.min, Math.min(limits.max, zoom));
}

export function zoomCameraAt(
  camera: WorldCamera,
  requestedScale: number,
  anchor: WorldPoint,
  limits = WORLD_ZOOM_LIMITS,
): WorldCamera {
  const scale = clampWorldZoom(requestedScale, limits);
  const ratio = scale / camera.scale;
  return {
    x: anchor.x - (anchor.x - camera.x) * ratio,
    y: anchor.y - (anchor.y - camera.y) * ratio,
    scale,
  };
}

export function panCamera(camera: WorldCamera, delta: WorldPoint): WorldCamera {
  return { ...camera, x: camera.x + delta.x, y: camera.y + delta.y };
}

export function focusCameraAt(
  camera: WorldCamera,
  point: WorldPoint,
  viewport: WorldPoint,
  requestedScale = camera.scale,
): WorldCamera {
  const scale = clampWorldZoom(requestedScale);
  return {
    x: viewport.x / 2 - point.x * scale,
    y: viewport.y / 2 - point.y * scale,
    scale,
  };
}

export function fitWorldCamera(
  bounds: WorldBounds,
  viewport: WorldPoint,
  limits = { min: 0.65, max: 1 },
  padding = 48,
): WorldCamera {
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const scale = Math.max(
    limits.min,
    Math.min(
      limits.max,
      (viewport.x - padding * 2) / width,
      (viewport.y - padding * 2) / height,
    ),
  );
  return {
    x: (viewport.x - width * scale) / 2 - bounds.minX * scale,
    y: (viewport.y - height * scale) / 2 - bounds.minY * scale,
    scale,
  };
}

export function advanceCameraMomentum(
  camera: WorldCamera,
  velocity: CameraVelocity,
  deltaSeconds: number,
  friction = 8,
): Readonly<{
  camera: WorldCamera;
  velocity: CameraVelocity;
  active: boolean;
}> {
  const elapsed = Math.max(0, Math.min(deltaSeconds, 0.05));
  const decay = Math.exp(-friction * elapsed);
  const nextVelocity = { x: velocity.x * decay, y: velocity.y * decay };
  const nextCamera = {
    ...camera,
    x: camera.x + nextVelocity.x * elapsed,
    y: camera.y + nextVelocity.y * elapsed,
  };
  const active = Math.hypot(nextVelocity.x, nextVelocity.y) >= 8 && elapsed > 0;
  return {
    camera: nextCamera,
    velocity: active ? nextVelocity : { x: 0, y: 0 },
    active,
  };
}
