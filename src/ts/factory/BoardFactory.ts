import { Board, BoardSquare } from "../model/Board";
import { GameConfig } from "../model/Game";
import { PieceColor, PieceType } from "../model/Piece";
import { BoardSquareFactory } from "./BoardSquareFactory";
import { PieceFactory } from "./PieceFactory";

export const BOARD_DEFAULT = [
    [ {type: PieceType.Rook, color: PieceColor.Black}, {type: PieceType.Knight, color: PieceColor.Black}, {type: PieceType.Bishop, color: PieceColor.Black}, {type: PieceType.Queen, color: PieceColor.Black}, {type: PieceType.King, color: PieceColor.Black}, {type: PieceType.Bishop, color: PieceColor.Black}, {type: PieceType.Knight, color: PieceColor.Black}, {type: PieceType.Rook, color: PieceColor.Black} ],
    [ {type: PieceType.Pawn, color: PieceColor.Black}, {type: PieceType.Pawn, color: PieceColor.Black}, {type: PieceType.Pawn, color: PieceColor.Black}, {type: PieceType.Pawn, color: PieceColor.Black}, null, {type: PieceType.Pawn, color: PieceColor.Black}, {type: PieceType.Pawn, color: PieceColor.Black}, {type: PieceType.Pawn, color: PieceColor.Black} ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ {type: PieceType.Pawn, color: PieceColor.White}, null, {type: PieceType.Pawn, color: PieceColor.White}, {type: PieceType.Pawn, color: PieceColor.White}, null, {type: PieceType.Pawn, color: PieceColor.White}, {type: PieceType.Pawn, color: PieceColor.White}, {type: PieceType.Pawn, color: PieceColor.White} ],
    [ {type: PieceType.Rook, color: PieceColor.White}, {type: PieceType.Knight, color: PieceColor.White}, {type: PieceType.Bishop, color: PieceColor.White}, {type: PieceType.Queen, color: PieceColor.White}, {type: PieceType.King, color: PieceColor.White}, {type: PieceType.Bishop, color: PieceColor.White}, {type: PieceType.Knight, color: PieceColor.White}, {type: PieceType.Rook, color: PieceColor.White} ],
];

export const BOARD_EMPTY = [
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
];

export enum BoardType {
    Empty = 'empty',
    Default = 'default'
}

export class BoardFactory {
    createBoard(config: GameConfig): Board {
        switch(config.board.type) {
            case BoardType.Empty:
                return this.createBoardModel(BOARD_EMPTY);
            case BoardType.Default:
                return this.createBoardModel(BOARD_DEFAULT);
            default:
                throw new Error(`Unknown board type: ${config.board.type}`);
        }
    }

    createBoardModel(data: any[][]): Board {
        const squares: BoardSquare[][] = [];

        data.forEach((rank, rankIndex) => {
            squares[rankIndex] = [];

            rank.forEach((piece, fileIndex) => {
                squares[rankIndex][fileIndex] = BoardSquareFactory.createEmptyBoardSquare();

                if(piece) {
                    squares[rankIndex][fileIndex].piece = PieceFactory.createPiece(data[rankIndex][fileIndex], rankIndex, fileIndex);
                }
            })
        });


        return new Board(squares);
    }
}