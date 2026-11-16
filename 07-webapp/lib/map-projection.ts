export const MAP_BOUNDS = {
  minLat: -6.9340,
  maxLat: -6.9230,
  minLng: 107.7685,
  maxLng: 107.7805,
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
  scale = 20
): [number, number] {
  const { minLat, maxLat, minLng, maxLng } = MAP_BOUNDS;
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;

  const x = (lng - midLng) * scale * 800;
  const z = (lat - midLat) * scale * 800; // inverted for 3D coordinates

  return [x, z];
}
