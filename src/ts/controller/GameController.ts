import { Game } from "../model/Game";
import { PieceMove, MoveHistory, PieceMoveType } from "../model/History";
import { Piece, PieceColor, PiecePosition, PieceType } from "../model/Piece";
import { Player } from "../model/Player";
import { TakeValidation } from "../validation/utils/TakeValidation";
import { GameViewInterface } from "../view/GameViewInterface";
import { BoardAnalyzer } from "./modules/BoardAnalyzer";
import { MoveAnalyzer } from "./modules/MoveAnalyzer";
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

export type PlayerTimers = Map<PieceColor, Timer>;

export class GameController {
    private playerCurrent: PieceColor = PieceColor.White;
    private playerTimers: PlayerTimers = new Map<PieceColor, Timer>();

    private history: MoveHistory;

    constructor(public game: Game, public gameView: GameViewInterface) 
    {
        this.game = game;
        this.gameView = gameView;

        this.history = new MoveHistory();
    }

    init() 
    {
        const startingPlayer: Player | undefined = this.game.players.get(this.game.config.playersOrder[0]);

        if(!startingPlayer) {
            throw new Error('Starting player not found');
        }

        this.setCurrentPlayer(startingPlayer);

        this.game.players.forEach((player: Player) => {
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

        this.gameView.init(this.game);

        document.addEventListener('PieceDropped', (e) => {
            this.onPieceMoved((e as CustomEvent).detail);
        });
    }
    
    onPieceMoved(detail: PieceMovedEventDetail) 
    {
        const currentPlayer: Player | undefined = this.getCurrentPlayer();

        if(!currentPlayer) {
            throw new Error('Fatal error: Current player is missing!');
        }

        const movedPiece: Piece | null = this.game.board.squares[detail.from.rankIndex][detail.from.fileIndex].piece;

        if(!movedPiece) {
            console.log('Invalid move: There is no piece in the move starting square!');
            
            return this.onPieceInvalidMove(detail);
        }

        if(movedPiece.color !== currentPlayer.config.color) {
            console.log(`Invalid move: Moved piece is: ${movedPiece.color}, current player is: ${currentPlayer.config.color}!`);

            return this.onPieceInvalidMove(detail);
        }

        const moveDetail = {
            from: detail.from,
            to: detail.to,

            player: currentPlayer
        }

        const isValidMove: boolean = MoveAnalyzer.isValidMove(moveDetail, this.game.board, this.history);

        if(!isValidMove) {
            console.log(`Invalid move: Piece is not able to move to that square!`);

            return this.onPieceInvalidMove(detail);
        }

        const isCapture: boolean = TakeValidation.isTaking(this.game.board, detail.to);

        if(isCapture && !MoveAnalyzer.isValidCapture(moveDetail, this.game.board, this.history)) {
            console.log(`Invalid move: Piece is not able to capture that square!`);

            return this.onPieceInvalidMove(detail);
        }

        const isSelfCheck: boolean = MoveAnalyzer.isSelfCheck(moveDetail, this.game.board, this.history);

        if(isSelfCheck) {
            console.log(`Invalid move: This will place current player in check!`);

            return this.onPieceInvalidMove(detail);
        }

        return this.onPieceValidMove(detail);
    }

    onPieceInvalidMove(detail: PieceInvalidMoveEventDetail) 
    {
        console.log('Invalid move!');

        const event = new CustomEvent('PieceInvalidMove', {
            detail: detail as PieceInvalidMoveEventDetail
        });

        document.dispatchEvent(event);
    }

    onPieceValidMove(detail: PieceValidMoveEventDetail) 
    {
        console.log('Valid move!');

        const movedPiece: Piece = this.game.board.squares[detail.from.rankIndex][detail.from.fileIndex].piece!;
        const takenPiece: Piece | null = this.game.board.squares[detail.to.rankIndex][detail.to.fileIndex].piece;

        const isCapture: boolean = !!takenPiece;

        const event = new CustomEvent('PieceValidMove', {
            detail: {
                ...detail,
                takenPieceId: takenPiece ? takenPiece.id : null
            } as PieceValidMoveEventDetail
        });
        document.dispatchEvent(event);

        this.movePiece(detail.from, detail.to);
        this.switchPlayer();

        const currentPlayer: Player | undefined = this.getCurrentPlayer();

        if(!currentPlayer) {
            throw new Error('Current player is missing!');
        }

        const isCheck: boolean = BoardAnalyzer.isPlayerInCheck(currentPlayer, this.game.board, this.history);
        const isCheckMate: boolean = BoardAnalyzer.isPlayerInCheckMate(currentPlayer, this.game.board, this.history);

        this.addMoveToHistory({
            from: detail.from,
            to: detail.to,

            piece: movedPiece,

            type: isCapture ? PieceMoveType.Capture : PieceMoveType.Move,

            isCheck: isCheck,
            isCheckMate: isCheckMate
        });
    }

    movePiece(from: PiecePosition, to: PiecePosition) 
    {
        this.game.board.squares[to.rankIndex][to.fileIndex].piece = this.game.board.squares[from.rankIndex][from.fileIndex].piece;
        this.game.board.squares[from.rankIndex][from.fileIndex].piece = null;

        if(this.game.board.squares[to.rankIndex][to.fileIndex].piece) {
            this.game.board.squares[to.rankIndex][to.fileIndex].piece!.wasMoved = true;
        }
    }

    switchPlayer()
    {
        const currentPlayer: Player | undefined = this.getCurrentPlayer()
        const nextPlayer: Player | undefined = this.getNextPlayer();
     
        if(!nextPlayer || !currentPlayer) {
            return;
        }

        this.playerTimers.get(currentPlayer.config.color)?.stopTimer();
        this.playerTimers.get(nextPlayer.config.color)?.startTimer();

        this.setCurrentPlayer(nextPlayer);
    }

    setCurrentPlayer(player: Player)
    {
        this.playerCurrent = player.config.color;
    }

    getCurrentPlayer(): Player | undefined
    {
        return this.game.players.get(this.playerCurrent);
    }

    getNextPlayer(): Player | undefined
    {
        const currentPlayerIndex = this.game.config.playersOrder.findIndex((value: PieceColor) => {
            return value === this.playerCurrent;
        });

        const currentPlayerColor = currentPlayerIndex === (this.game.config.playersOrder.length - 1) ? this.game.config.playersOrder[0] : this.game.config.playersOrder[currentPlayerIndex + 1];

        return this.game.players.get(currentPlayerColor);
    }

    addMoveToHistory(pieceMove: PieceMove)
    {
        this.history.addMove(pieceMove);

        document.dispatchEvent(new CustomEvent('MoveHistory.MoveAdded', {
            detail: pieceMove
        }));
    }
}