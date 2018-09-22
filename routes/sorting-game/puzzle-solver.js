const { Grid, Solver } = require("sliding-puzzle-solver");

const solve = ({ puzzle }) => {
  // console.log(puzzle, puzzle.length, puzzle.join());
  const gridModel = Grid.buildFromSize(puzzle.length);
  gridModel.tiles = puzzle
    .join()
    .split(",")
    .map(Number);
  gridModel.emptyPosition = gridModel.tiles.indexOf(0);
  gridModel.tiles[gridModel.emptyPosition] = "";

  const solution = new Solver(gridModel).solve();

  console.log({ solution });
  const path = run([...solution], [...puzzle]);
  console.log({path});
  return path
};

const dxdy = {
  LEFT: [0, -1],
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0]
};

const run = (rawPath, puzzle) => {
  let x,y,flag=false
  for(x=0;x<puzzle.length;x++){
    for(y=0;y<puzzle.length;y++){
      if(puzzle[x][y]==0){
        console.log('found 0',x,y)
        flag = true
        break
      }
    }
    if(flag)break
  }
  console.log({puzzle,x,y})
  if (!rawPath || rawPath.length === 0) return false;
  const realPath = [];
  rawPath.forEach((dir, s) => {
    const [dx,dy] = dxdy[dir]
    let i=x+dx
    let j=y+dy
    console.log({i,j,x,y,dir})
    const ch = puzzle[i][j];
    puzzle[x][y] = ch;
    realPath.push(ch);
    puzzle[x=i][y=j] = 0;
    
  });
  return realPath
};

module.exports = solve