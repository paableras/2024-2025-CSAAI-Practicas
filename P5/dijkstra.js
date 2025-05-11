
function dijkstra(graph, start, end) {
  const distances = {};
  const prev = {};
  const visited = new Set();
  const pq = new Map();

  for (let node in graph) {
    distances[node] = Infinity;
    prev[node] = null;
    pq.set(node, Infinity);
  }
  distances[start] = 0;
  pq.set(start, 0);

  while (pq.size > 0) {
    let currentNode = [...pq.entries()].reduce((a, b) => a[1] < b[1] ? a : b)[0];
    pq.delete(currentNode);

    if (currentNode === end) break;

    visited.add(currentNode);
    for (let neighbor in graph[currentNode]) {
      if (visited.has(neighbor)) continue;
      let alt = distances[currentNode] + graph[currentNode][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = currentNode;
        pq.set(neighbor, alt);
      }
    }
  }

  const path = [];
  let node = end;
  while (node !== null) {
    path.unshift(node);
    node = prev[node];
  }

  return path;
}
