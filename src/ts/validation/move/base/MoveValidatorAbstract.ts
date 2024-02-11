
import { Board } from "../../../model/Board";
import { Piece, PiecePosition } from "../../../model/Piece";
import { MoveValidatorInterface } from "./MoveValidatorInterface";

export abstract class MoveValidatorAbstract implements MoveValidatorInterface {
    constructor(protected readonly board: Board) {
        this.board = board;
    }

    abstract canMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean;
}