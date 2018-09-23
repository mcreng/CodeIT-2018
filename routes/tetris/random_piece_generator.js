const Piece = require('./piece')

const pieceDict = {
    O:0,
    J:1,
    L:2,
    Z:3,
    S:4,
    T:5,
    I:6
}
function LoadSequence(str){
    return str.split('').map(s=>pieceDict[s])
}

function RandomPieceGenerator(sequence){
    Math.seed
    this.bag = [0, 1, 2, 3, 4, 5, 6];
    this.shuffleBag();
    this.index = -1;
    this.sequence = LoadSequence(sequence)
};

RandomPieceGenerator.prototype.nextPiece = function(){
    // const R = Piece.fromIndex(this.bag[this.index]);
    if(this.sequence.length === 0 )return false
    const R = Piece.fromIndex(this.sequence.shift())
    // console.log('next peice',R)
    return R
};

RandomPieceGenerator.prototype.shuffleBag = function() {
    var currentIndex = this.bag.length
        , temporaryValue
        , randomIndex
        ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = this.bag[currentIndex];
        this.bag[currentIndex] = this.bag[randomIndex];
        this.bag[randomIndex] = temporaryValue;
    }
};

module.exports = RandomPieceGenerator