import { Piece, PiecePosition } from "./Piece"

export type PieceMove = {
    from: PiecePosition;
    to: PiecePosition;
    piece: Piece;
    isTaking: boolean;
}

export class PieceMoveHistory {
    private moves: PieceMove[];

    constructor()
    {
        this.moves = [];
    }

    addMove(move: PieceMove) 
    {
        this.moves.push(move);
    }

    getMoves(): PieceMove[] 
    {
        return this.moves;
    }
}