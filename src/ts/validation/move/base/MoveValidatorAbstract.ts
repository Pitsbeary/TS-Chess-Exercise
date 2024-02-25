
import { Board } from "../../../model/Board";
import { MoveHistory } from "../../../model/History";
import { Piece, PiecePosition } from "../../../model/Piece";
import { MoveValidatorInterface } from "./MoveValidatorInterface";

export abstract class MoveValidatorAbstract implements MoveValidatorInterface {
    constructor(protected readonly board: Board, protected readonly history: MoveHistory) {
        this.board = board;
        this.history = history;
    }

    abstract canMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean;
}