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
import { MoveHistory } from "./History";

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

    getMoveValidator(board: Board, history: MoveHistory): MoveValidatorInterface {
        switch(this.type) {
            case PieceType.Pawn:
                return new PawnMoveValidator(board, history);
            case PieceType.Rook:
                return new RookMoveValidator(board, history);
            case PieceType.Knight:
                return new KnightMoveValidator(board, history);
            case PieceType.Bishop:
                return new BishopMoveValidator(board, history);
            case PieceType.Queen:
                return new QueenMoveValidator(board, history);
            case PieceType.King:
                return new KingMoveValidator(board, history);
            default:
                return new DefaultMoveValidator(board, history);
        }
    }

    getTakeValidator(board: Board, history: MoveHistory): TakeValidatorInterface {
        switch(this.type) {
            case PieceType.Pawn:
                return new DefaultTakeValidator(board, history);
            case PieceType.Rook:
                return new DefaultTakeValidator(board, history);
            case PieceType.Knight:
                return new DefaultTakeValidator(board, history);
            case PieceType.Bishop:
                return new DefaultTakeValidator(board, history);
            case PieceType.Queen:
                return new DefaultTakeValidator(board, history);
            case PieceType.King:
                return new DefaultTakeValidator(board, history);
            default:
                return new DefaultTakeValidator(board, history);
        }
    }
}