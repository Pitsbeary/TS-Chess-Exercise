import { Piece, PiecePosition } from "../../model/Piece";
import { TakeValidatorAbstract } from "../move/base/TakeValidatorAbstract";
import { TakeValidatorInterface } from "../move/base/TakeValidatorInterface";
import { TakeValidation } from "../utils/TakeValidation";



export class DefaultTakeValidator extends TakeValidatorAbstract implements TakeValidatorInterface {
    canTake(from: PiecePosition, to: PiecePosition, takingPiece: Piece, takedPiece: Piece): boolean {
        if(!TakeValidation.validateTaking(from, to, takingPiece, takedPiece)) {
            return false;
        }

        return true;
    }
}