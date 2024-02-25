import { Piece, PiecePosition } from "./Piece"

export enum PieceMoveType {
    Move        = 'move',
    Capture     = 'capture',
    Castling    = 'castling',
    Passant     = 'passant',
}

export type PieceMove = {
    from: PiecePosition;
    to: PiecePosition;
    
    piece: Piece;
    pieceCaptured?: Piece;

    type: PieceMoveType;
    
    isCheck: boolean;
    isCheckMate: boolean;
}

export class MoveHistory {
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