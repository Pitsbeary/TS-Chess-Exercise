
import { Piece, PiecePosition } from "../../../model/Piece";

export interface TakeValidatorInterface {
    canTake(from: PiecePosition, to: PiecePosition, takingPiece: Piece, takedPiece: Piece): boolean;
}