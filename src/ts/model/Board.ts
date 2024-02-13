import { Piece, PieceColor } from "./Piece";

export class BoardSquare {
    constructor(public piece: Piece|null = null) {
        this.piece = piece;
    }
}

export class Board {
    constructor(public squares: BoardSquare[][]) {
        this.squares = squares;
    }

    getPieces(color: PieceColor) {
        const flatSquares = this.squares.flat();

        return flatSquares.reduce((pieces, square) => {
            if(square.piece && square.piece.color === color) {
                pieces.push(square.piece);
            }

            return pieces;
        }, [] as Piece[]);
    }
}