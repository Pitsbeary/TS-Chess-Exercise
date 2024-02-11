
import { Board } from "../../../model/Board";
import { Piece, PiecePosition } from "../../../model/Piece";
import { PieceValidatorInterface } from "./PieceValidatorInterface";

export abstract class PieceValidatorAbstract implements PieceValidatorInterface {
    constructor(protected readonly board: Board) {
        this.board = board;
    }

    abstract canMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean;
}