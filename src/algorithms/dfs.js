const visitedNodesinorder = [];
let flag = true;
export function dfs(grid, str, stc, fr, fc, parent) {
  if (
    str >= 0 &&
    stc >= 0 &&
    str < 20 &&
    stc < 50 &&
    fr >= 0 &&
    fr < 20 &&
    fc >= 0 &&
    fc < 50 &&
    flag === true
  ) {
    if (str === fr && stc === fc) {
      visitedNodesinorder.push(grid[fr][fc]);
      grid[str][stc].previousNode = parent;
      flag = false;
      console.log("found finish node\n");
      //console.log(grid[fr][fc]);
    }
    if (
      grid[str][stc].isVisited === false &&
      grid[str][stc].isWall === false &&
      flag === true
    ) {
      grid[str][stc].isVisited = true;
      grid[str][stc].previousNode = parent;
      //console.log(grid[str][stc]);

      visitedNodesinorder.push(grid[str][stc]);
      dfs(grid, str, stc + 1, fr, fc, grid[str][stc]);
      dfs(grid, str, stc - 1, fr, fc, grid[str][stc]);
      dfs(grid, str + 1, stc, fr, fc, grid[str][stc]);
      dfs(grid, str - 1, stc, fr, fc, grid[str][stc]);
    }
  }
}
export function getdfsnodes() {
  return visitedNodesinorder;
}
// Backtracks from the finishNode to find the shortest path.
//  Only works when called *after* the dfs method above.
export function getNodesDfsPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
