import { Board } from "../../model/Board";
import { Piece, PieceColor, PiecePosition } from "../../model/Piece";

export class MoveValidation {

    static validateFileLine(pawn: Piece, from: PiecePosition, to: PiecePosition): boolean
    {
        return from.fileIndex === to.fileIndex;
    }

    static validateRankLine(pawn: Piece, from: PiecePosition, to: PiecePosition): boolean
    {
        return from.rankIndex === to.rankIndex;
    }

    static validateDistance(pawn: Piece, from: PiecePosition, to: PiecePosition, distance: number): boolean {
        return Math.abs(from.rankIndex - to.rankIndex) <= distance;
    }

    static validateForwardMove(pawn: Piece, from: PiecePosition, to: PiecePosition): boolean {
        if(pawn.color === PieceColor.White) {
            return Math.sign(to.rankIndex - from.rankIndex) === -1;
        }

        if(pawn.color === PieceColor.Black) {
            return Math.sign(to.rankIndex - from.rankIndex) === 1;
        } 

        return true;
    }

    static validateFreePath(board: Board, from: PiecePosition, to: PiecePosition) 
    {
        const fileDirection = Math.sign(to.fileIndex - from.fileIndex);
        let fileIndex = from.fileIndex;
        
        const rankDirection = Math.sign(to.rankIndex - from.rankIndex);
        let rankIndex = from.rankIndex;

        while( rankIndex !== to.rankIndex || fileIndex !== to.fileIndex) {
            rankIndex += rankDirection;
            fileIndex += fileDirection;

            if(!!board.squares[rankIndex][fileIndex].piece) {
                return true;
            }
        }

        return false;
    }

    static isTaking(board: Board, pawn: Piece, from: PiecePosition, to: PiecePosition): boolean {
        const piece = board.squares[to.rankIndex][to.fileIndex].piece;

        if(!piece) {
            return false;
        }

        return piece.color !== pawn.color;
    }

    static validatePawnTaking(pawn: Piece, from: PiecePosition, to: PiecePosition): boolean {
        return Math.abs(from.rankIndex - to.rankIndex) === 1 && Math.abs(from.fileIndex - to.fileIndex) === 1;
    }
}