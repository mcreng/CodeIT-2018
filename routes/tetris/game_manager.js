const RandomPieceGenerator = require('./random_piece_generator')
const AI = require('./ai')
const Grid = require('./grid')

function getRightShift(piece) {
  let i = 0;
  for (i = 0; i < piece.cells.length; i++) {
    let flag = false;
    for (let j = 0; j < piece.cells.length; j++) {
      if (piece.cells[j][i] !== 0) {
        flag = true;
        // console.log("non zero");
        break;
      }
    }
    if (flag) {
      break;
    }
  }
  return piece.column + i;
}

function GameManager({tetrominoSequence:sequence}) {
  var grid = new Grid(22, 10);
  var rpg = new RandomPieceGenerator(sequence+'O');
  var ai = new AI(0.510066, 0.760666, 0.35663, 0.184483);
  var workingPieces = [null, rpg.nextPiece()];
  var workingPiece = null;
  var score = 0;
  const output = []
  var kill = false
  setTimeout(()=>kill=true,10000)

  // Process start of turn
  var newPiece
  while(true ){
      for (var i = 0; i < workingPieces.length - 1; i++) {
        workingPieces[i] = workingPieces[i + 1];
      }
      workingPieces[workingPieces.length - 1] = newPiece = rpg.nextPiece();
      if(!newPiece)break
      workingPiece = workingPieces[0];
    
      let data = ai.best(grid, workingPieces);
      workingPiece = data.piece;
      // console.log('working column',workingPiece.column=data.column)
      const col = getRightShift(workingPiece);
      // console.log("best piece", workingPiece, data.rotation, col);
      output.push(Number("" + data.rotation + col));
      while (workingPiece.moveDown(grid)); // Drop working piece
      // console.log(workingPieces.length)
      if(!endTurn()||kill){
        console.log('die')
        while(output.length < sequence.length)output.push(0)
        break
      }
  }
    // Shift working pieces
    return output
    // Process end of turn
    function endTurn(){
      // Add working piece
      grid.addPiece(workingPiece);
    
      // Clear lines
      score += grid.clearLines();
    
      // Refresh graphics
      // redrawGridCanvas();
      // updateScoreContainer();
    
      return !grid.exceeded();
    }
}



module.exports = GameManager
