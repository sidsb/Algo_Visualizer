// Performs astar search algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, optimally allowing us to compute the optimal path(may not be shortest)
// by backtracking from the finish node.
export function astar(grid, startNode, finishNode, heuristic) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  let flag = true;
  let i = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length && flag) {
    sortNodesByDistance(unvisitedNodes, heuristic);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) {
      continue;
    }
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) {
      flag = false;
      return visitedNodesInOrder;
    }
    updateUnvisitedNeighbors(closestNode, grid);
    i = i + 1;
  }
}

function sortNodesByDistance(unvisitedNodes, heuristic) {
  unvisitedNodes.sort(
    (a, b) =>
      a.distance +
      heuristic[a.row][a.col] -
      (b.distance + heuristic[b.row][b.col])
  );
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (let i = 1; i <= unvisitedNeighbors.length; ++i) {
    unvisitedNeighbors[i - 1].distance = node.distance + 1;
    unvisitedNeighbors[i - 1].previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(
    (neighbor) => !neighbor.isVisited && !neighbor.isWall
  );
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInastarPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
