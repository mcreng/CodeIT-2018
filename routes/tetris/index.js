const GameManager = require('./game_manager')

const testCases = [
  {
    "tetrominoSequence": "IOJLLLTIOOTIOTZSTTTLLIJSZTIT"
}
]

const output = GameManager(testCases[0])
console.log(output, output.length, testCases[0].tetrominoSequence.length)