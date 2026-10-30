export const DEFAULT_CITY_ID = 'cdmx';

export const CITIES = [
  { id: 'cdmx', name: 'Ciudad de México', state: 'CDMX', latitude: 19.4326, longitude: -99.1332 },
  { id: 'puebla', name: 'Puebla', state: 'Puebla', latitude: 19.0414, longitude: -98.2063 },
  { id: 'queretaro', name: 'Querétaro', state: 'Querétaro', latitude: 20.5888, longitude: -100.3899 },
  { id: 'guadalajara', name: 'Guadalajara', state: 'Jalisco', latitude: 20.6597, longitude: -103.3496 },
  { id: 'monterrey', name: 'Monterrey', state: 'Nuevo León', latitude: 25.6866, longitude: -100.3161 },
  { id: 'san-luis', name: 'San Luis Potosí', state: 'San Luis Potosí', latitude: 22.1565, longitude: -100.9855 },
  { id: 'merida', name: 'Mérida', state: 'Yucatán', latitude: 20.9674, longitude: -89.5926 },
];

export const EDGES = [
  ['cdmx', 'puebla', 3],
  ['cdmx', 'queretaro', 4],
  ['cdmx', 'san-luis', 7],
  ['cdmx', 'merida', 12],
  ['queretaro', 'san-luis', 4],
  ['queretaro', 'guadalajara', 6],
  ['san-luis', 'monterrey', 6],
  ['san-luis', 'guadalajara', 5],
  ['puebla', 'merida', 11],
  ['guadalajara', 'monterrey', 10],
  ['monterrey', 'merida', 14],
];

export const cityById = (id) => CITIES.find((city) => city.id === id);

export function shortestPath(startId, endId) {
  if (startId === endId) return [startId];
  const distances = Object.fromEntries(CITIES.map((city) => [city.id, Infinity]));
  const previous = {};
  const pending = new Set(CITIES.map((city) => city.id));
  distances[startId] = 0;

  while (pending.size) {
    let current = null;
    pending.forEach((id) => {
      if (current === null || distances[id] < distances[current]) current = id;
    });
    if (current === null || distances[current] === Infinity) break;
    pending.delete(current);
    if (current === endId) break;

    EDGES.forEach(([from, to, hours]) => {
      if (from !== current && to !== current) return;
      const neighbor = from === current ? to : from;
      if (!pending.has(neighbor)) return;
      const nextDistance = distances[current] + hours;
      if (nextDistance < distances[neighbor]) {
        distances[neighbor] = nextDistance;
        previous[neighbor] = current;
      }
    });
  }

  const path = [];
  let current = endId;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  return path[0] === startId ? path : [startId, endId];
}

export function routeDetails(path) {
  return path.slice(0, -1).map((from, index) => {
    const to = path[index + 1];
    const edge = EDGES.find(([a, b]) => (a === from && b === to) || (a === to && b === from));
    return { from, to, hours: edge ? edge[2] : 8 };
  });
}
