import { BoardSquare } from "../model/Board";
import { Game } from "../model/Game";
import { Piece, PiecePosition } from "../model/Piece";
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
        const piece: Piece|null = this.gameModel.board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;    

        if(!piece) {
            return;
        } 

        if(!piece.getMoveValidator(this.gameModel.board)?.canMove(piece, detail.from, detail.to)) {
            this.onPieceInvalidMove(detail);
        } else {
            this.onPieceValidMove(detail);
        }

        this.gameView
    }

    onPieceValidMove(detail: PieceMovedEventDetail) {
        const movedPiece = this.gameModel.board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;
        
        if(!movedPiece) {
            return;
        }

        const takenPiece = this.gameModel.board.squares[detail.to.rankIndex][detail.to.fileIndex].piece;
        
        this.gameModel.board.squares[detail.from.rankIndex][detail.from.fileIndex].piece = null;
        this.gameModel.board.squares[detail.to.rankIndex][detail.to.fileIndex].piece = movedPiece;

        movedPiece.wasMoved = true;

        const validMoveEvent = new CustomEvent('PieceValidMove', {
            detail: {
                ...detail,
                takenPieceId: takenPiece?.id
            } as PieceValidMoveEventDetail
        });

        document.dispatchEvent(validMoveEvent);
    }

    onPieceInvalidMove(detail: PieceMovedEventDetail) {
        const invalidMoveEvent = new CustomEvent('PieceInvalidMove', {
            detail: detail as PieceInvalidMoveEventDetail
        });

        document.dispatchEvent(invalidMoveEvent);
    }
}

// ALL PIECES MOVESET
// REFACTOR CODE
// GITHUB

// ONLY BOARD VISIBLE ON FULL SCREEN