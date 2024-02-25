import { Board } from "../../model/Board";
import { Piece, PiecePosition, PieceType } from "../../model/Piece";

export class TakeValidation {
    static isTaking(board: Board, takePosition: PiecePosition): boolean {
        return !!board.squares[takePosition.rankIndex][takePosition.fileIndex].piece;
    }

    static validateTaking(from: PiecePosition, to: PiecePosition, takingPiece: Piece, takedPiece: Piece) {
        if(!TakeValidation.validateColor(takingPiece, takedPiece)) {
            return false;
        }

        return true;
    }

    static validateColor(takingPiece: Piece, takedPiece: Piece) {
        return takingPiece.color !== takedPiece.color;
    }
}