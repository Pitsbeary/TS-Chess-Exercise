import { Game } from "../model/Game";
import { Piece, PieceColor, PiecePosition } from "../model/Piece";
import { Player } from "../model/Player";
import { TakeValidation } from "../validation/utils/TakeValidation";
import { GameViewInterface } from "../view/GameViewInterface";
import { Timer } from "./modules/Timer";

export type PieceMovedEventDetail = {
    movedPieceId: string,
    from: PiecePosition,
    to: PiecePosition
}

export type PieceValidMoveEventDetail = PieceMovedEventDetail & {
    takenPieceId?: string | undefined;
};

export type PieceInvalidMoveEventDetail = PieceMovedEventDetail;

export type GameConfig = {
    playersOrder: PieceColor[];
}

export type PlayerTimers = Map<PieceColor, Timer>;

export class GameController {
    private playerCurrent: PieceColor = PieceColor.White;
    private playerTimers: PlayerTimers = new Map<PieceColor, Timer>();

    constructor(public gameModel: Game, public gameView: GameViewInterface, public readonly options: GameConfig) 
    {
        this.gameModel = gameModel;
        this.gameView = gameView;

        this.options = options;
    }

    init() 
    {
        this.setCurrentPlayer(this.options.playersOrder[0]);

        this.gameModel.players.forEach((player: Player) => {
            const playerColor = player.config.color;

            this.playerTimers?.set(playerColor, new Timer((timer) => {
                const event = new CustomEvent('TimerUpdate', {
                    detail: {
                        id: player.config.id,
                        value: player.timer - (new Date().getTime() - timer.timestamp) / 1000
                    }
                });
        
                document.dispatchEvent(event);
            }));
        });

        this.gameView.init(this.gameModel);

        document.addEventListener('PieceDropped', (e) => {
            this.onPieceMoved((e as CustomEvent).detail);
        });
    }
    
    onPieceMoved(detail: PieceMovedEventDetail) 
    {
        const isTaking = TakeValidation.isTaking(this.gameModel.board, detail.to);
        const canMove = isTaking ? this.validatePieceMove(detail) && this.validatePieceTaking(detail) : this.validatePieceMove(detail);

        if(!canMove) {
            this.onPieceInvalidMove(detail);
        } else {
            this.onPieceValidMove(detail);
        }
    }

    validatePieceMove(detail: PieceMovedEventDetail): boolean 
    {
        const movedPiece: Piece|null = this.gameModel.board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;

        if(!movedPiece) {
            return false;
        }

        if(movedPiece.color !== this.getCurrentPlayer()) {
            return false;
        }

        return movedPiece.getMoveValidator(this.gameModel.board).canMove(movedPiece, detail.from, detail.to);
    }

    validatePieceTaking(detail: PieceMovedEventDetail): boolean  
    {
        const movedPiece: Piece|null = this.gameModel.board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;
        const takenPiece: Piece|null = this.gameModel.board.squares[detail.to.rankIndex][detail.to.fileIndex].piece;    

        if(!takenPiece || !movedPiece) {
            return false;
        }

        return movedPiece.getTakeValidator(this.gameModel.board).canTake(detail.from, detail.to, movedPiece, takenPiece);
    }

    onPieceInvalidMove(detail: PieceInvalidMoveEventDetail) 
    {
        const event = new CustomEvent('PieceInvalidMove', {
            detail: detail as PieceInvalidMoveEventDetail
        });

        document.dispatchEvent(event);
    }

    onPieceValidMove(detail: PieceValidMoveEventDetail) 
    {
        const event = new CustomEvent('PieceValidMove', {
            detail: {
                ...detail,
                takenPieceId: this.gameModel.board.squares[detail.to.rankIndex][detail.to.fileIndex].piece?.id
            } as PieceValidMoveEventDetail
        });

        document.dispatchEvent(event);

        this.movePiece(detail.from, detail.to);
        this.switchPlayer();
    }

    movePiece(from: PiecePosition, to: PiecePosition) 
    {
        this.gameModel.board.squares[to.rankIndex][to.fileIndex].piece = this.gameModel.board.squares[from.rankIndex][from.fileIndex].piece;
        this.gameModel.board.squares[from.rankIndex][from.fileIndex].piece = null;

        if(this.gameModel.board.squares[to.rankIndex][to.fileIndex].piece) {
            this.gameModel.board.squares[to.rankIndex][to.fileIndex].piece!.wasMoved = true;
        }
    }

    switchPlayer()
    {
        const currentPlayer: Player | undefined = this.gameModel.players.get(this.getCurrentPlayer());
        const nextPlayer: Player | undefined = this.gameModel.players.get(this.getNextPlayer());
     
        if(!nextPlayer || !currentPlayer) {
            return;
        }

        this.playerTimers.get(currentPlayer.config.color)?.stopTimer();
        this.playerTimers.get(nextPlayer.config.color)?.startTimer();

        this.setCurrentPlayer(nextPlayer.config.color);
    }

    setCurrentPlayer(color: PieceColor)
    {
        this.playerCurrent = color;
    }

    getCurrentPlayer(): PieceColor
    {
        return this.playerCurrent;
    }

    getNextPlayer(): PieceColor 
    {
        const currentPlayerIndex = this.options.playersOrder.findIndex((value: PieceColor) => {
            return value === this.playerCurrent;
        });

        return currentPlayerIndex === (this.options.playersOrder.length - 1) ? this.options.playersOrder[0] : this.options.playersOrder[currentPlayerIndex + 1];
    }
}