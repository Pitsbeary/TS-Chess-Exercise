
import { Piece, PiecePosition } from "../../model/Piece";
import { MoveValidation } from "../utils/MoveValidation";
import { TakeValidation } from "../utils/TakeValidation";
import { MoveValidatorAbstract } from "./base/MoveValidatorAbstract";
import { MoveValidatorInterface } from "./base/MoveValidatorInterface";

export class PawnMoveValidator extends MoveValidatorAbstract implements MoveValidatorInterface {
    canMove(piece: Piece, from: PiecePosition, to: PiecePosition): boolean {
        if(TakeValidation.isTaking(this.board, to)) {
            return MoveValidation.validatePawnTakeMove(from, to, this.board, this.history);
        }

        if(!MoveValidation.validateForwardMove(piece, from, to)) {
            return false;
        }

        if(!MoveValidation.validateFileLine(piece, from, to)) {
            return false;
        }

        if(!MoveValidation.validateMaxDistance(piece, from, to, piece.wasMoved ? 1 : 2)) {
            return false;
        }

        if(!MoveValidation.validateFreePath(this.board, from, to)) {
            return false;
        }
            
        return true;
    }
}