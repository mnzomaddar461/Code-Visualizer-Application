/**
 * Graph DFS
 * animations: ["visit",id] | ["edge",a,b] | ["done",id]
 */
export function getGraphDFSAnimations(nodes, edges, startId) {
  const animations = [];
  if (!nodes.length) return animations;

  const sid = startId ?? nodes[0].id;
  const adj = {};
  nodes.forEach(n => (adj[n.id] = []));
  edges.forEach(([a, b]) => {
    if (adj[a]) adj[a].push(b);
    if (adj[b]) adj[b].push(a);
  });

  const visited = new Set();

  function dfs(curr) {
    visited.add(curr);
    animations.push(["visit", curr]);
    for (const nb of (adj[curr] || [])) {
      if (!visited.has(nb)) {
        animations.push(["edge", curr, nb]);
        dfs(nb);
      }
    }
    animations.push(["done", curr]);
  }

  dfs(sid);
  return animations;
}