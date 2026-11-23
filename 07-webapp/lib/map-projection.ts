export const MAP_BOUNDS = {
  minLat: -6.9455,
  maxLat: -6.9080,
  minLng: 107.7585,
  maxLng: 107.7825,
};

export function projectLatLngTo2D(
  lat: number,
  lng: number,
  width = 540,
  height = 380,
  padding = 48
): [number, number] {
  const { minLat, maxLat, minLng, maxLng } = MAP_BOUNDS;
  const xSpan = maxLng - minLng;
  const ySpan = maxLat - minLat;

  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const nx = (lng - minLng) / xSpan;
  const ny = (maxLat - lat) / ySpan;

  const x = padding + nx * innerW;
  const y = padding + ny * innerH;

  return [Math.round(x), Math.round(y)];
}

export function projectLatLngTo3D(
  lat: number,
  lng: number,
  scale = 6
): [number, number] {
  const { minLat, maxLat, minLng, maxLng } = MAP_BOUNDS;
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const xSpan = maxLng - minLng;
  const ySpan = maxLat - minLat;

  const x = ((lng - midLng) / xSpan) * scale * 11;
  const z = ((midLat - lat) / ySpan) * scale * 8.5;

  return [x, z];
}
