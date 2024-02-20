import { Board, BoardSquare } from "../model/Board";
import { Game, Players } from "../model/Game";
import { Piece, PieceColor } from "../model/Piece";
import { Player } from "../model/Player";
import { Move } from "./modules/Move";
import { Document } from "../utils/Document";
import { GameViewInterface } from "./GameViewInterface";
import { Timer } from "./modules/Timer";
import { Notation } from "./modules/Notation";
import { Actions } from "./modules/Actions";
import { History } from "./modules/History";

export type GameViewHTMLConfig = {
    elementParentId: string;
    elementId: string;
}

export class GameViewHTML implements GameViewInterface {
    private element: HTMLElement|null = null;
    private elementParent: HTMLElement|null = null;

    constructor(public config: GameViewHTMLConfig) {
        this.config = config;
    }

    public init(game: Game) {        
        this.element = document.getElementById(this.config.elementId);

        if(!this.element) {
            console.error('Element not found');
            return;
        }

        this.elementParent = document.getElementById(this.config.elementParentId);

        if(!this.elementParent) {
            console.error('Element parent not found');
            return;
        }

        this.getElementParentClasses(game).forEach((elementClass) => {
            this.elementParent!.classList.add(elementClass);
        });        

        this.element.appendChild(this.createRanks(game.board));
        this.element.appendChild(this.createFiles(game.board));
        this.element.appendChild(this.createBoard(game.board));

        this.elementParent.appendChild(this.createHistory());

        const pieceDrag = new Move({
            dragSelector: '.piece',
            dropSelector: '.square'
        });
    
        pieceDrag.init();

        for(const playerElement of this.createPlayers(game.players)) {
            this.elementParent.appendChild(playerElement);
        }

        const timers = new Timer({
            selector: '.player__timer'
        });

        timers.init();

        const actions = new Actions({
            selector: '.btn-action[data-action]'
        });
        actions.init();

        const history = new History({
            selector: '.move-history'
        });
        history.init();
    }

    public getElementParentClasses(game: Game): string[] {
        const classes: string[] = [];

        if(game.config.playerCurrent === PieceColor.Black) {
            classes.push('reversed');
        }

        return classes;
    }

    public createBoard(board: Board): HTMLElement {
        const boardElement: HTMLElement = Document.createElement('div', {
            id: `board`,
            className: `board board--main`
        });

        board.squares.forEach((rank, rankIndex) => {
            rank.forEach((square, fileIndex) => {
                boardElement.appendChild(this.createSquare(square, rankIndex, fileIndex));
            })
        });

        return boardElement;
    }

    public createSquare(square: BoardSquare, rankIndex: number, fileIndex: number): HTMLElement {
        const squareElement: HTMLElement = Document.createElement('div', {
            id: `square-${rankIndex}-${fileIndex}`,
            className: `square ${(rankIndex + fileIndex) % 2 === 0 ? 'square--white' : 'square--black'}`
        });

        squareElement.dataset.rank = rankIndex.toString();
        squareElement.dataset.file = fileIndex.toString();

        if(square.piece) {
            squareElement.appendChild(this.createPiece(square.piece));
        }

        return squareElement;
    }

    public createPiece(piece: Piece): HTMLElement {
        const pieceElement: HTMLImageElement = Document.createElement('img', {
            id: piece.id,
            className: `piece piece--${piece.type} piece--${piece.color}`
        }) as HTMLImageElement;

        pieceElement.draggable = true;
        pieceElement.src = `src/assets/pieces/${piece.color}/${piece.type}.svg`;

        return pieceElement;
    }

    public createRanks(board: Board): HTMLElement {
        const ranksElement: HTMLElement = Document.createElement('div', {
            id: `ranks`,
            className: `ranks`
        });

        for(let i = 0; i < board.squares.length; i++) {
            const rankElement = Document.createElement('div', {
                id: `rank-${i}`,
                className: `ranks__rank`
            });
            rankElement.innerHTML = Notation.getRank(i, board.squares.length);
            ranksElement.appendChild(rankElement);
        }

        return ranksElement;
    }

    public createFiles(board: Board): HTMLElement {
        const filesElement: HTMLElement = Document.createElement('div', {
            id: `files`,
            className: `files`
        });

        for(let i = 0; i < board.squares.length; i++) {
            const fileElement = Document.createElement('div', {
                id: `file-${i}`,
                className: `files__file`
            });
            fileElement.innerHTML = Notation.getFile(i);
            filesElement.appendChild(fileElement);
        }

        return filesElement;
    }

    public createPlayers(players: Players): HTMLElement[] {
        const playerElements: HTMLElement[] = [];

        for(const player of players.values()) {
            playerElements.push(this.createPlayer(player));
        }

        return playerElements;
    }

    public createPlayer(player: Player): HTMLElement {
        const playerElement: HTMLElement = Document.createElement('div', {
            id: `player`,
            className: `player player--${player.config.color}`
        });

        const playerAvatarElement: HTMLImageElement = Document.createElement('img', {
            className: `player__avatar`
        }) as HTMLImageElement;
        playerAvatarElement.src = player.config.avatar ? player.config.avatar : 'https://placehold.co/64x64/png';
        playerElement.appendChild(playerAvatarElement);

        const playerContentElement: HTMLElement = Document.createElement('span', {
            className: `player__content`
        });

        const playerNameElement: HTMLElement = Document.createElement('span', {
            className: `player__name`
        });
        playerNameElement.innerHTML = player.config.name;
        playerContentElement.appendChild(playerNameElement);

        const playerCaptionElement: HTMLElement = Document.createElement('span', {
            className: `player__caption`
        });
        playerCaptionElement.innerHTML = player.config.caption ?? '...';
        playerContentElement.appendChild(playerCaptionElement);

        const playerTimerElement: HTMLElement = Document.createElement('span', {
            className: `player__timer`
        });
        playerTimerElement.innerHTML = Timer.prepareTimeValue(player.config.timer);
        playerTimerElement.id = player.config.id; 

        playerElement.appendChild(playerContentElement);
        playerElement.appendChild(playerTimerElement);

        return playerElement;
    }

    public createHistory(): HTMLElement {
        const historyElement = Document.createElement('div', {
            className: `move-history`
        });
        
        return historyElement;
    }
}