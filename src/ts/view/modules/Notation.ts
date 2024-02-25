import { Board } from "../../model/Board";
import { PieceMove, PieceMoveType } from "../../model/History";
import { PieceType } from "../../model/Piece";

const LETTER_INDEX_START = 97;
const DEFAULT_RANKS_LENGTH = 8;

export class Notation {
    public static getRank(rankIndex: number, ranksLength: number): string {
        return String(ranksLength - rankIndex);
    }

    public static getFile(fileIndex: number): string {
        return String.fromCharCode(LETTER_INDEX_START + fileIndex);
    }

    public static getMove(pieceMove: PieceMove, ranksLength: number = DEFAULT_RANKS_LENGTH): string {
        let moveNotation = pieceMove.piece.type === PieceType.Pawn ? '' 
        : (pieceMove.piece.type === PieceType.Knight ? 'N' : pieceMove.piece.type.charAt(0).toLocaleUpperCase());

        if(pieceMove.type === PieceMoveType.Capture) {
            moveNotation += pieceMove.piece.type === PieceType.Pawn ? `${Notation.getFile(pieceMove.from.fileIndex)}` : 'x';
        }

        moveNotation += `${Notation.getFile(pieceMove.to.fileIndex)}${Notation.getRank(pieceMove.to.rankIndex, ranksLength)}`;

        if(pieceMove.isCheck) {

            if(pieceMove.isCheckMate) {
                moveNotation += '++';
            } else {
                moveNotation += '+';
            }
            
        }

        

        return moveNotation;
    }
}