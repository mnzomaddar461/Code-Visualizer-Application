/**
 * Tree BFS — Level Order Traversal
 * animations: ["enqueue",id] | ["visit",id] | ["edge",pid,cid] | ["done",id]
 */
export function getTreeBFSAnimations(nodes) {
  const animations = [];
  if (!nodes.length) return animations;

  const nodeMap = {};
  nodes.forEach(n => (nodeMap[n.id] = n));

  const queue = [nodes[0].id];
  animations.push(["enqueue", nodes[0].id]);

  while (queue.length > 0) {
    const curr = queue.shift();
    animations.push(["visit", curr]);
    const node = nodeMap[curr];
    if (!node) continue;
    for (const childId of (node.children || [])) {
      animations.push(["edge", curr, childId]);
      animations.push(["enqueue", childId]);
      queue.push(childId);
    }
    animations.push(["done", curr]);
  }
  return animations;
}