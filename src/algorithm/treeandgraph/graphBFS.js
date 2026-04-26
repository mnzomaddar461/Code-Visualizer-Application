/**
 * Graph BFS
 * animations: ["enqueue",id] | ["visit",id] | ["edge",a,b] | ["done",id]
 */
export function getGraphBFSAnimations(nodes, edges, startId) {
  const animations = [];
  if (!nodes.length) return animations;

  const sid = startId ?? nodes[0].id;
  const adj = {};
  nodes.forEach(n => (adj[n.id] = []));
  edges.forEach(([a, b]) => {
    if (adj[a]) adj[a].push(b);
    if (adj[b]) adj[b].push(a);
  });

  const visited = new Set([sid]);
  const queue   = [sid];
  animations.push(["enqueue", sid]);

  while (queue.length > 0) {
    const curr = queue.shift();
    animations.push(["visit", curr]);
    for (const nb of (adj[curr] || [])) {
      if (!visited.has(nb)) {
        visited.add(nb);
        animations.push(["edge", curr, nb]);
        animations.push(["enqueue", nb]);
        queue.push(nb);
      }
    }
    animations.push(["done", curr]);
  }
  return animations;
}