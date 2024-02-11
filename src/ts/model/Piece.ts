import { PieceValidatorInterface } from "../validation/move/base/PieceValidatorInterface";
import { PawnMoveValidator } from "../validation/move/PawnMoveValidator";
import { Board } from "./Board";

export type PiecePosition = {
    rankIndex: number;
    fileIndex: number;
} 

export enum PieceType {
    Pawn    = 'pawn',
    Rook    = 'rook',
    Knight  = 'knight',
    Bishop  = 'bishop',
    Queen   = 'queen',
    King    = 'king',
    Other   = 'other'
}

export enum PieceColor {
    White    = 'white',
    Black    = 'black',
}

export class Piece {
    public wasMoved: boolean = false;
    
    constructor(public id: string, public type: PieceType, public color: PieceColor) {
        this.id = id;
        this.type = type;
        this.color = color;
    }

    getMoveValidator(board: Board): PieceValidatorInterface | null {
        switch(this.type) {
            case PieceType.Pawn:
                return new PawnMoveValidator(board);
            default:
                return null;
        }
    }
}