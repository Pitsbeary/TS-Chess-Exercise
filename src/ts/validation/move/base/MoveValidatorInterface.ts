import { Piece, PiecePosition } from "../../../model/Piece";

export interface MoveValidatorInterface {
    canMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean;
}