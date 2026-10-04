import { expect, it } from "vitest";
import {
  advanceCameraMomentum,
  fitWorldCamera,
  focusCameraAt,
  panCamera,
  zoomCameraAt,
} from "../world/worldCamera";

it("keeps the world point under the cursor fixed while zooming", () => {
  const camera = { x: -80, y: 45, scale: 1 };
  const cursor = { x: 240, y: 180 };
  const worldPoint = {
    x: (cursor.x - camera.x) / camera.scale,
    y: (cursor.y - camera.y) / camera.scale,
  };
  const next = zoomCameraAt(camera, 2, cursor);

  expect((cursor.x - next.x) / next.scale).toBeCloseTo(worldPoint.x);
  expect((cursor.y - next.y) / next.scale).toBeCloseTo(worldPoint.y);
  expect(zoomCameraAt(camera, 20, cursor).scale).toBe(3);
});

it("pans, focuses, and fits world bounds to a viewport", () => {
  expect(panCamera({ x: 1, y: 2, scale: 1 }, { x: 4, y: -3 })).toEqual({
    x: 5,
    y: -1,
    scale: 1,
  });
  expect(
    focusCameraAt(
      { x: 0, y: 0, scale: 1 },
      { x: 100, y: 80 },
      { x: 400, y: 300 },
      2,
    ),
  ).toEqual({
    x: 0,
    y: -10,
    scale: 2,
  });
  const fitted = fitWorldCamera(
    { minX: -100, minY: -50, maxX: 100, maxY: 50 },
    { x: 800, y: 600 },
  );
  expect(fitted.scale).toBe(1);
  expect(fitted.x).toBe(400);
  expect(fitted.y).toBe(300);
});

it("applies bounded inertial pan that decays to rest", () => {
  const first = advanceCameraMomentum(
    { x: 0, y: 0, scale: 1 },
    { x: 120, y: 0 },
    1 / 60,
  );
  expect(first.active).toBe(true);
  expect(first.camera.x).toBeGreaterThan(0);
  let motion = first;
  for (let index = 0; index < 120; index++)
    motion = advanceCameraMomentum(motion.camera, motion.velocity, 1 / 60);
  expect(motion.active).toBe(false);
  expect(motion.velocity).toEqual({ x: 0, y: 0 });
});
