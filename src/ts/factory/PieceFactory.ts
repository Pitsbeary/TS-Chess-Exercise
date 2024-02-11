import { BoardSquare } from "../model/Board";
import { Piece, PieceColor, PieceType } from "../model/Piece";

export type PieceData = {
    type: PieceType,
    color: PieceColor
}

export class PieceFactory {
    static createPiece(data: PieceData, rankIndex: number, fileIndex: number): Piece {
        return new Piece(
            PieceFactory.createPieceId(data, rankIndex, fileIndex),
            data.type,
            data.color
        )
    }

    static createPieceId(data: PieceData, rankIndex: number, fileIndex: number) {
        return `${data.color}-${data.type}-${rankIndex}-${fileIndex}`;
    }
}