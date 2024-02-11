import { Game } from "../model/Game";
import { Piece, PiecePosition } from "../model/Piece";
import { TakeValidation } from "../validation/utils/TakeValidation";
import { GameViewInterface } from "../view/GameViewInterface";

export type PieceMovedEventDetail = {
    movedPieceId: string,
    from: PiecePosition,
    to: PiecePosition
}

export type PieceValidMoveEventDetail = PieceMovedEventDetail & {
    takenPieceId?: string | undefined;
};

export type PieceInvalidMoveEventDetail = PieceMovedEventDetail;

export class GameController {
    constructor(public gameModel: Game, public gameView: GameViewInterface) {
        this.gameModel = gameModel;
        this.gameView = gameView;
    }

    init() {
        this.gameView.init(this.gameModel);

        document.addEventListener('PieceDropped', (e) => {
            this.onPieceMoved((e as CustomEvent).detail);
        });
    }
    
    onPieceMoved(detail: PieceMovedEventDetail) {
        const isTaking = TakeValidation.isTaking(this.gameModel.board, detail.to);
        const canMove = isTaking ? this.validatePieceMove(detail) && this.validatePieceTaking(detail) : this.validatePieceMove(detail);

        if(!canMove) {
            this.onPieceInvalidMove(detail);
        } else {
            this.onPieceValidMove(detail);
        }
    }

    validatePieceMove(detail: PieceMovedEventDetail): boolean {
        const movedPiece: Piece|null = this.gameModel.board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;

        if(!movedPiece) {
            return false;
        }

        return movedPiece.getMoveValidator(this.gameModel.board).canMove(movedPiece, detail.from, detail.to);
    }

    validatePieceTaking(detail: PieceMovedEventDetail): boolean  {
        const movedPiece: Piece|null = this.gameModel.board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;
        const takenPiece: Piece|null = this.gameModel.board.squares[detail.to.rankIndex][detail.to.fileIndex].piece;    

        if(!takenPiece || !movedPiece) {
            return false;
        }

        return movedPiece.getTakeValidator(this.gameModel.board).canTake(detail.from, detail.to, movedPiece, takenPiece);
    }

    movePiece(from: PiecePosition, to: PiecePosition) {
        this.gameModel.board.squares[to.rankIndex][to.fileIndex].piece = this.gameModel.board.squares[from.rankIndex][from.fileIndex].piece;
        this.gameModel.board.squares[from.rankIndex][from.fileIndex].piece = null;

        if(this.gameModel.board.squares[to.rankIndex][to.fileIndex].piece) {
            this.gameModel.board.squares[to.rankIndex][to.fileIndex].piece!.wasMoved = true;
        }
    }

    onPieceValidMove(detail: PieceValidMoveEventDetail) {
        const eventDetail: PieceValidMoveEventDetail = {
            ...detail,
            takenPieceId: this.gameModel.board.squares[detail.to.rankIndex][detail.to.fileIndex].piece?.id
        };

        this.movePiece(detail.from, detail.to);

        const validMoveEvent = new CustomEvent('PieceValidMove', {
            detail: eventDetail
        });

        document.dispatchEvent(validMoveEvent);
    }

    onPieceInvalidMove(detail: PieceInvalidMoveEventDetail) {
        const invalidMoveEvent = new CustomEvent('PieceInvalidMove', {
            detail: detail as PieceInvalidMoveEventDetail
        });

        document.dispatchEvent(invalidMoveEvent);
    }
}