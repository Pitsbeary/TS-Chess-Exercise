import { Piece } from "./Piece";

export class BoardSquare {
    constructor(public piece: Piece|null = null) {
        this.piece = piece;
    }
}

export class Board {
    constructor(public squares: BoardSquare[][]) {
        this.squares = squares;
    }
}