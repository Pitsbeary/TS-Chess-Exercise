import { Piece, PiecePosition } from "../../../model/Piece";

export interface PieceValidatorInterface {
    canMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean;
}