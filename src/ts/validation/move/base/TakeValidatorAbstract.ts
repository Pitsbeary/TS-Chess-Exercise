
import { Board } from "../../../model/Board";
import { Piece, PiecePosition } from "../../../model/Piece";
import { TakeValidatorInterface } from "./TakeValidatorInterface";

export abstract class TakeValidatorAbstract implements TakeValidatorInterface {
    constructor(protected readonly board: Board) {
        this.board = board;
    }

    abstract canTake(from: PiecePosition, to: PiecePosition, takingPiece: Piece, takedPiece: Piece): boolean;
}