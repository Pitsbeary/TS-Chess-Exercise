import { PieceMove } from './../../model/History';
import { Board } from "../../model/Board";
import { MoveHistory } from "../../model/History";
import { Piece, PieceColor, PiecePosition } from "../../model/Piece";

export class MoveValidation {
    static validateLine(piece: Piece, from: PiecePosition, to: PiecePosition): boolean {
        return MoveValidation.validateStraightLine(piece, from, to) || MoveValidation.validateDiagonalLine(piece, from, to);
    }

    static validateStraightLine(piece: Piece, from: PiecePosition, to: PiecePosition): boolean
    {
        return MoveValidation.validateFileLine(piece, from, to) || MoveValidation.validateRankLine(piece, from, to);
    }

    static validateDiagonalLine(piece: Piece, from: PiecePosition, to: PiecePosition): boolean
    {
        return Math.abs(to.fileIndex - from.fileIndex) === Math.abs(to.rankIndex - from.rankIndex);
    }
    
    static validateFileLine(piece: Piece, from: PiecePosition, to: PiecePosition): boolean
    {
        return from.fileIndex === to.fileIndex;
    }

    static validateRankLine(piece: Piece, from: PiecePosition, to: PiecePosition): boolean
    {
        return from.rankIndex === to.rankIndex;
    }

    static validateMaxDistance(piece: Piece, from: PiecePosition, to: PiecePosition, distance: number): boolean {
        return Math.abs(from.rankIndex - to.rankIndex) <= distance && Math.abs(from.fileIndex - to.fileIndex) <= distance;
    }

    static validateForwardMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean {
        if(piece.color === PieceColor.White) {
            return Math.sign(to.rankIndex - from.rankIndex) === -1;
        }

        if(piece.color === PieceColor.Black) {
            return Math.sign(to.rankIndex - from.rankIndex) === 1;
        } 

        return true;
    }

    static validateFreePath(board: Board, from: PiecePosition, to: PiecePosition) 
    {
        const fileDirection = Math.sign(to.fileIndex - from.fileIndex);
        let fileIndex = from.fileIndex + fileDirection;
        
        const rankDirection = Math.sign(to.rankIndex - from.rankIndex);
        let rankIndex = from.rankIndex + rankDirection;

        while(rankIndex !== to.rankIndex || fileIndex !== to.fileIndex) {
          
            if(!!board.squares[rankIndex][fileIndex].piece) {
                return false;
            }

            rankIndex += rankDirection;
            fileIndex += fileDirection;
        }

        return true;
    }

    static validateKnigthMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean {    
        
        if(Math.abs(to.rankIndex - from.rankIndex) === 2 && Math.abs(to.fileIndex - from.fileIndex) === 1) {
            return true;
        }

        if(Math.abs(to.rankIndex - from.rankIndex) === 1 && Math.abs(to.fileIndex - from.fileIndex) === 2) {
            return true;
        }

        return false;
    }

    static validatePawnTakeMove(from: PiecePosition, to: PiecePosition, board: Board, history: MoveHistory): boolean {
        if(MoveValidation.validatePawnEnPassantTake(from, to, board, history)) {
            return true
        }

        return MoveValidation.validatePawnNormalTake(from, to);
    }

    static validatePawnEnPassantTake(from: PiecePosition, to: PiecePosition, board: Board, history: MoveHistory): boolean {
        return false;
    }

    static validatePawnNormalTake(from: PiecePosition, to: PiecePosition): boolean {
        return Math.abs(from.rankIndex - to.rankIndex) === 1 && Math.abs(from.fileIndex - to.fileIndex) === 1;
    }
}