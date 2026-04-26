/**
 * Tree DFS — Pre-order Traversal
 * animations: ["visit",id] | ["edge",pid,cid] | ["done",id]
 */
export function getTreeDFSAnimations(nodes) {
  const animations = [];
  if (!nodes.length) return animations;

  const nodeMap = {};
  nodes.forEach(n => (nodeMap[n.id] = n));

  function dfs(nodeId) {
    animations.push(["visit", nodeId]);
    const node = nodeMap[nodeId];
    if (!node) return;
    for (const childId of (node.children || [])) {
      animations.push(["edge", nodeId, childId]);
      dfs(childId);
    }
    animations.push(["done", nodeId]);
  }

  dfs(nodes[0].id);
  return animations;
}