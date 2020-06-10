const visitedNodesinorder = [];
let flag = true;
export function sidAlgo(grid, str, stc, fr, fc, parent) {
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
      console.log("found finish node");
    }
    if (
      grid[str][stc].isVisited === false &&
      grid[str][stc].isWall === false &&
      flag === true
    ) {
      grid[str][stc].isVisited = true;
      grid[str][stc].previousNode = parent;
      visitedNodesinorder.push(grid[str][stc]);
      if (
        str < fr &&
        grid[str + 1][stc].isWall === false &&
        grid[str + 1][stc].isVisited === false
      ) {
        sidAlgo(grid, str + 1, stc, fr, fc, grid[str][stc]);
      } else if (
        str > fr &&
        grid[str - 1][stc].isWall === false &&
        grid[str - 1][stc].isVisited === false
      ) {
        sidAlgo(grid, str - 1, stc, fr, fc, grid[str][stc]);
      } else if (
        stc < fc &&
        grid[str][stc + 1].isWall === false &&
        grid[str][stc + 1].isVisited === false
      ) {
        sidAlgo(grid, str, stc + 1, fr, fc, grid[str][stc]);
      } else if (
        stc > fc &&
        grid[str][stc - 1].isWall === false &&
        grid[str][stc - 1].isVisited === false
      ) {
        sidAlgo(grid, str, stc - 1, fr, fc, grid[str][stc]);
      } else {
        console.log("exception");

        let loopbreaker = true;
        var x;
        while (loopbreaker) {
          x = Math.floor(Math.random() * 4 + 1);
          if (
            x === 1 &&
            grid[str + 1][stc].isWall === false &&
            grid[str + 1][stc].isVisited === false
          ) {
            loopbreaker = false;
          } else if (
            x === 2 &&
            grid[str - 1][stc].isWall === false &&
            grid[str - 1][stc].isVisited === false
          ) {
            loopbreaker = false;
          } else if (
            x === 3 &&
            grid[str][stc + 1].isWall === false &&
            grid[str][stc + 1].isVisited === false
          ) {
            loopbreaker = false;
          } else if (
            x === 4 &&
            grid[str][stc - 1].isWall === false &&
            grid[str][stc - 1].isVisited === false
          ) {
            loopbreaker = false;
          }
        }
        if (x === 1) {
          sidAlgo(grid, str + 1, stc, fr, fc, grid[str][stc]);
        } else if (x === 2) {
          sidAlgo(grid, str - 1, stc, fr, fc, grid[str][stc]);
        } else if (x === 3) {
          sidAlgo(grid, str, stc + 1, fr, fc, grid[str][stc]);
        } else {
          sidAlgo(grid, str, stc - 1, fr, fc, grid[str][stc]);
        }
      }
    }
  }
}

export function getsidnodes() {
  return visitedNodesinorder;
}
