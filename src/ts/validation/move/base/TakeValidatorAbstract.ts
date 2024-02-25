
import { Board } from "../../../model/Board";
import { MoveHistory } from "../../../model/History";
import { Piece, PiecePosition } from "../../../model/Piece";
import { TakeValidatorInterface } from "./TakeValidatorInterface";

export abstract class TakeValidatorAbstract implements TakeValidatorInterface {
    constructor(protected readonly board: Board, protected readonly history: MoveHistory) {
        this.board = board;
        this.history = history;
    }

    abstract canTake(from: PiecePosition, to: PiecePosition, takingPiece: Piece, takedPiece: Piece): boolean;
}