
import { Piece, PiecePosition } from "../../model/Piece";
import { MoveValidation } from "../utils/MoveValidation";
import { PieceValidatorAbstract } from "./base/PieceValidatorAbstract";
import { PieceValidatorInterface } from "./base/PieceValidatorInterface";

export class PawnMoveValidator extends PieceValidatorAbstract implements PieceValidatorInterface {
    canMove(pawn: Piece, from: PiecePosition, to: PiecePosition): boolean {
        if(!MoveValidation.validateForwardMove(pawn, from, to)) {
            return false;
        }

        if(MoveValidation.isTaking(this.board, pawn, from, to)) {
            return MoveValidation.validatePawnTaking(pawn, from, to);
        } else {
            return this.validateMove(pawn, from, to);
        }
    }

    

    validateMove(pawn: Piece, from: PiecePosition, to: PiecePosition): boolean {
        if(!MoveValidation.validateFileLine(pawn, from, to)) {
            return false;
        }

        const maxMoveDistance = pawn.wasMoved ? 1 : 2;

        if(!MoveValidation.validateDistance(pawn, from, to, maxMoveDistance)) {
            return false;
        }

        if(MoveValidation.validateFreePath(this.board, from, to)) {
            return false;
        }

        return true;
    }
}