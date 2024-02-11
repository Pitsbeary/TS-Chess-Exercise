
import { Piece, PiecePosition } from "../../model/Piece";
import { MoveValidation } from "../utils/MoveValidation";
import { MoveValidatorAbstract } from "./base/MoveValidatorAbstract";
import { MoveValidatorInterface } from "./base/MoveValidatorInterface";

export class DefaultMoveValidator extends MoveValidatorAbstract implements MoveValidatorInterface {
    canMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean {
        if(!MoveValidation.validateMaxDistance(piece, from, to, 1)) {
            return false;
        }

        return true;
    }
}