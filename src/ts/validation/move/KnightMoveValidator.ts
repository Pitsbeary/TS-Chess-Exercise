
import { Piece, PiecePosition } from "../../model/Piece";
import { MoveValidation } from "../utils/MoveValidation";
import { MoveValidatorAbstract } from "./base/MoveValidatorAbstract";
import { MoveValidatorInterface } from "./base/MoveValidatorInterface";

export class KnightMoveValidator extends MoveValidatorAbstract implements MoveValidatorInterface {
    canMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean {
        if(!MoveValidation.validateKnigthMove(piece, from, to)) {
            return false;
        }

        return true;
    }
}