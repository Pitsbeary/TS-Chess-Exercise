import { MoveValidatorInterface } from "../validation/move/base/MoveValidatorInterface";
import { TakeValidatorInterface } from "../validation/move/base/TakeValidatorInterface";
import { BishopMoveValidator } from "../validation/move/BishopMoveValidator";
import { DefaultMoveValidator } from "../validation/move/DefaultMoveValidator";
import { KingMoveValidator } from "../validation/move/KingMoveValidator";
import { KnightMoveValidator } from "../validation/move/KnightMoveValidator";
import { PawnMoveValidator } from "../validation/move/PawnMoveValidator";
import { QueenMoveValidator } from "../validation/move/QueenMoveValidator";
import { RookMoveValidator } from "../validation/move/RookMoveValidator";
import { DefaultTakeValidator } from "../validation/take/DefautTakeValidator";
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

    getMoveValidator(board: Board): MoveValidatorInterface {
        switch(this.type) {
            case PieceType.Pawn:
                return new PawnMoveValidator(board);
            case PieceType.Rook:
                return new RookMoveValidator(board);
            case PieceType.Knight:
                return new KnightMoveValidator(board);
            case PieceType.Bishop:
                return new BishopMoveValidator(board);
            case PieceType.Queen:
                return new QueenMoveValidator(board);
            case PieceType.King:
                return new KingMoveValidator(board);
            default:
                return new DefaultMoveValidator(board);
        }
    }

    getTakeValidator(board: Board): TakeValidatorInterface {
        switch(this.type) {
            case PieceType.Pawn:
                return new DefaultTakeValidator(board);
            case PieceType.Rook:
                return new DefaultTakeValidator(board);
            case PieceType.Knight:
                return new DefaultTakeValidator(board);
            case PieceType.Bishop:
                return new DefaultTakeValidator(board);
            case PieceType.Queen:
                return new DefaultTakeValidator(board);
            case PieceType.King:
                return new DefaultTakeValidator(board);
            default:
                return new DefaultTakeValidator(board);
        }
    }
}