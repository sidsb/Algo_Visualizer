import React, { Component, Fragment } from "react";
import Node from "./Node/Node";
import "./PathFindingVisualizer.css";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { dfs, getNodesDfsPathOrder, getdfsnodes } from "../algorithms/dfs";
import { sidAlgo, getsidnodes } from "../algorithms/sid";
import { bestfs, getNodesInBestPathOrder } from "../algorithms/bestfs";
import { astar, getNodesInastarPathOrder } from "../algorithms/astar";
import 'bootstrap/dist/css/bootstrap.css';
import { Button, ButtonGroup, Breadcrumb, Modal, ModalHeader, ModalBody, FormGroup, Form, Input, Label } from 'reactstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { MDBBtn } from "mdbreact";



export class PathFindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      START_NODE_ROW: 5,
      START_NODE_COL: 7,
      FINISH_NODE_ROW: 16,
      FINISH_NODE_COL: 44,
      isModalOpen: false,
      grid: [],
      mouseIsPressed: false,
      vset: new Set(),
      hset: new Set(),
      flagForDfs: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    const grid = getInitialGrid(
      this.state.START_NODE_ROW,
      this.state.START_NODE_COL,
      this.state.FINISH_NODE_ROW,
      this.state.FINISH_NODE_COL);
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateDfs(visitedNodesInOrder, nodesinOrder) {
    for (let i = 0; i < visitedNodesInOrder.length; ++i) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          this.animateShortestPathdfs(nodesinOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);

    }
  }
  animateShortestPathdfs(nodesinOrder) {
    for (let i = 0; i < nodesinOrder.length; i++) {
      setTimeout(() => {
        const node = nodesinOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 20 * i);
    }
  }
  visualizeDFS() {
    const { grid } = this.state;
    dfs(
      grid,
      this.state.START_NODE_ROW,
      this.state.START_NODE_COL,
      this.state.FINISH_NODE_ROW,
      this.state.FINISH_NODE_COL,
      null
    );
    const visitedNodesInOrder = getdfsnodes();
    console.log(visitedNodesInOrder);
    const nodesinOrder = getNodesDfsPathOrder(
      grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL]
    );
    console.log(nodesinOrder);
    this.animateDfs(visitedNodesInOrder, nodesinOrder);
  }
  animateSid(visitedNodes) {
    for (let i = 0; i < visitedNodes.length; ++i) {
      setTimeout(() => {
        const node = visitedNodes[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 20 * i);
    }
  }
  visualizeSidAlgo() {
    const { grid } = this.state;
    sidAlgo(
      grid,
      this.state.START_NODE_ROW,
      this.state.START_NODE_COL,
      this.state.FINISH_NODE_ROW,
      this.state.FINISH_NODE_COL,
      null
    );
    const visitedNodes = getsidnodes();
    console.log(visitedNodes);
    this.animateSid(visitedNodes);
  }
  visualizeBestFS() {
    const heuristic = [];
    for (let i = 0; i < 20; ++i) {
      const tmparray = [];
      for (let j = 0; j < 50; ++j) {
        tmparray[j] =
          (i - this.state.FINISH_NODE_ROW) * (i - this.state.FINISH_NODE_ROW) +
          (j - this.state.FINISH_NODE_COL) * (j - this.state.FINISH_NODE_COL);
      }
      heuristic.push(tmparray);
    }
    const { grid } = this.state;
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    const visitedNodesInOrder = bestfs(grid, startNode, finishNode, heuristic);
    const nodesInBestPathOrder = getNodesInBestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInBestPathOrder);
  }

  visualizeastar() {
    const heuristic = [];
    for (let i = 0; i < 20; ++i) {
      const tmparray = [];
      for (let j = 0; j < 50; ++j) {
        tmparray[j] =
          (i - this.state.FINISH_NODE_ROW) * (i - this.state.FINISH_NODE_ROW) +
          (j - this.state.FINISH_NODE_COL) * (j - this.state.FINISH_NODE_COL);
      }
      heuristic.push(tmparray);
    }
    const { grid } = this.state;
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    const visitedNodesInOrder = astar(grid, startNode, finishNode, heuristic);
    const nodesInastarPathOrder = getNodesInastarPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInastarPathOrder);
  }

  recursive_division(sx, sy, ex, ey) {
    //console.log("inside recursive division");

    let xdist = ex - sx;
    let ydist = ey - sy;
    if (xdist < 2 || ydist < 2)
      return;
    else if ((xdist >= 2 && ydist < 2) || xdist > ydist) {
      let x = Math.floor(Math.random() * (ex - sx - 1)) + sx + 1;
      let count = 0;
      // while (this.state.vset.has(x) === true) {
      //   if (xdist === 2 || count > 10)
      //     return;
      //   console.log("bancho1");
      //   count++;
      //   x = Math.floor(Math.random() * (ex - sx - 1)) + sx + 1;
      // }
      if (this.state.hset.has(x) === true)
        return;
      for (let i = sy; i <= ey; ++i) {

        const newGrid = getNewGridWithWallToggled(this.state.grid, x, i);
        this.setState({ grid: newGrid, mouseIsPressed: true });
      }
      let hole = Math.floor(Math.random() * (ydist + 1) + sy);
      let nset = this.state.vset;
      nset.add(hole);
      let xset = this.state.hset;
      xset.add(x);
      this.setState({
        vset: nset,
        hset: xset,
      });
      const newGrid = getNewGridWithHole(this.state.grid, x, hole);
      this.setState({ grid: newGrid, mouseIsPressed: true });
      this.recursive_division(sx, sy, x - 1, ey);
      this.recursive_division(x + 1, sy, ex, ey);

    }
    else if ((ydist >= 2 && xdist < 2) || ydist > xdist) {
      let x = Math.floor(Math.random() * (ey - sy - 1)) + sy + 1;
      let count2 = 0;
      // while (this.state.hset.has(x) === true) {
      //   if (ydist === 2 || count2 > 10)
      //     return;
      //   console.log("bancho2");
      //   count2++;
      //   x = Math.floor(Math.random() * (ey - sy - 1)) + sy + 1;
      // }
      if (this.state.vset.has(x) === true)
        return;
      for (let i = sx; i <= ex; ++i) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, i, x);
        this.setState({ grid: newGrid, mouseIsPressed: true });
      }
      let hole = Math.floor(Math.random() * (xdist + 1) + sx);
      let nset2 = this.state.hset;
      nset2.add(hole);
      let yset = this.state.vset;
      yset.add(x);
      this.setState({
        hset: nset2,
        vset: yset,
      });
      const newGrid = getNewGridWithHole(this.state.grid, hole, x);
      this.setState({ grid: newGrid, mouseIsPressed: true });
      this.recursive_division(sx, sy, ex, x - 1);
      this.recursive_division(sx, x + 1, ex, ey);

    }

  }
  generateMaze() {

    for (let i = 0; i < 20; ++i) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, i, 0);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
    for (let i = 0; i < 20; ++i) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, i, 49);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
    for (let i = 1; i < 49; ++i) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, 0, i);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
    for (let i = 1; i < 49; ++i) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, 19, i);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
    this.recursive_division(1, 1, 18, 48);


  }
  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    })

  }

  handleLogin(event) {
    this.toggleModal();
    // alert("startnoderow: " + this.startnoderow.value + " startnodercol: " + this.startnodecol.value
    //   + " endnoderow: " + this.endnoderow.value + " endnodercol: " + this.endnodecol.value);

    let sx = this.state.START_NODE_ROW;
    let sy = this.state.START_NODE_COL;
    let ex = this.state.FINISH_NODE_ROW;
    let ey = this.state.FINISH_NODE_COL;
    document.getElementById(`node-${sx}-${sy}`).className =
      "node";
    const { grid } = this.state;
    grid[sx][sy].isStart = false;
    document.getElementById(`node-${ex}-${ey}`).className =
      "node";
    grid[ex][ey].isFinish = false;

    //creating new start and end nodes
    this.setState({
      START_NODE_ROW: this.startnoderow.value,
      START_NODE_COL: this.startnodecol.value,
      FINISH_NODE_ROW: this.endnoderow.value,
      FINISH_NODE_COL: this.endnodecol.value,
    });

    document.getElementById(`node-${this.startnoderow.value}-${this.startnodecol.value}`).className =
      "node node-start";
    grid[this.startnoderow.value][this.startnodecol.value].isStart = false;
    document.getElementById(`node-${this.endnoderow.value}-${this.endnodecol.value}`).className =
      "node node-finish";
    grid[this.endnoderow.value][this.endnodecol.value].isStart = false;


    event.preventDefault();

  }

  render() {

    const { grid, mouseIsPressed } = this.state;

    return (

      <Fragment>
        <Breadcrumb>
          <ButtonGroup className="ml-0">
            <Button className="btn btn-sm bg-primary" onClick={() => this.visualizeDijkstra()}>
              Visualize Dijkstra's Algorithm
          </Button>
            <Button className="btn btn-sm bg-secondary" onClick={() => this.visualizeDFS()}>
              Visualize DFS Algorithm
          </Button>
            <Button className="btn btn-sm bg-success" onClick={() => this.visualizeastar()}>
              A Star
          </Button>
            <Button className="btn btn-sm bg-danger" onClick={() => this.visualizeBestFS()}>
              Best First Search
          </Button>
            <Button className="btn btn-sm bg-info" onClick={() => this.visualizeSidAlgo()}>
              Visualize Siddhartha's Algorithm
          </Button>
          </ButtonGroup>
          <MDBBtn gardient="aqua" onClick={() => this.generateMaze()}>
            Generate Maze
          </MDBBtn>
          <Button outline onClick={this.toggleModal}>
            <span className="fa fa-sign-in fa-lg"></span> Set Nodes
          </Button>
        </Breadcrumb>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Set Nodes</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleLogin}>
              <FormGroup>
                <Label htmlFor="startnoderow">Start Node Row</Label>
                <Input type="number" id="startnoderow" name="startnoderow" placeholder="Between 1-18"
                  innerRef={(input) => this.startnoderow = input}></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="startnodecol">Start Node Col</Label>
                <Input type="number" id="startnodecol" name="startnodecol" placeholder="Between 1-48"
                  innerRef={(input) => this.startnodecol = input}></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="endnoderow">End Node Row</Label>
                <Input type="number" id="endnoderow" name="endnoderow" placeholder="Between 1-18"
                  innerRef={(input) => this.endnoderow = input}></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="endnodecol">End Node Col</Label>
                <Input type="number" id="endnodecol" name="endnodecol" placeholder="Between 1-48"
                  innerRef={(input) => this.endnodecol = input}></Input>
              </FormGroup>
              <Button type="submit" value="submit" color="primary">Set Nodes</Button>
            </Form>
          </ModalBody>
        </Modal>
        <div className="gird">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {
                    row,
                    col,
                    isFinish,
                    isStart,
                    isWall,
                    isVisited,
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isVisited={isVisited}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Fragment>
    );
  }
}

const getInitialGrid = (sx, sy, ex, ey) => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row, sx, sy, ex, ey));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row, sx, sy, ex, ey) => {
  return {
    col,
    row,
    isStart: row === sx && col === sy,
    isFinish: row === ex && col === ey,
    distance: 10000,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithHole = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: false,
  }
  newGrid[row][col] = newNode;
  return newGrid;
}

export default PathFindingVisualizer;

