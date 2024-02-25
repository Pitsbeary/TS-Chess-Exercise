import { Board } from "../../model/Board";
import { MoveHistory } from "../../model/History";
import { Piece, PiecePosition } from "../../model/Piece";
import { Player } from "../../model/Player";
import { BoardAnalyzer } from "./BoardAnalyzer";

export type MoveDetail = {
    from: PiecePosition,
    to: PiecePosition,

    player: Player,
}

export class MoveAnalyzer {
    public static isValidMove(detail: MoveDetail, board: Board, history: MoveHistory) {
        const movedPiece: Piece | null = board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;

        if(!movedPiece) {
            return false;
        }

        return movedPiece.getMoveValidator(board, history).canMove(movedPiece, detail.from, detail.to);
    }

    public static isValidCapture(detail: MoveDetail, board: Board, history: MoveHistory) {
        const movedPiece: Piece|null = board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;
        const capturedPiece: Piece|null = board.squares[detail.to.rankIndex][detail.to.fileIndex].piece;    

        if(!capturedPiece || !movedPiece) {
            return false;
        }

        return movedPiece.getTakeValidator(board, history).canTake(detail.from, detail.to, movedPiece, capturedPiece);
    }

    public static isSelfCheck(detail: MoveDetail, board: Board, history: MoveHistory) {
        const pieceBackup: Piece | null = board.squares[detail.to.rankIndex][detail.to.fileIndex].piece;

        board.squares[detail.to.rankIndex][detail.to.fileIndex].piece = board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;
        board.squares[detail.from.rankIndex][detail.from.fileIndex].piece = null

        const isInCheck: boolean = BoardAnalyzer.isPlayerInCheck(detail.player, board, history);

        board.squares[detail.from.rankIndex][detail.from.fileIndex].piece = board.squares[detail.to.rankIndex][detail.to.fileIndex].piece;
        board.squares[detail.to.rankIndex][detail.to.fileIndex].piece = pieceBackup;

        return isInCheck;
    }    
}