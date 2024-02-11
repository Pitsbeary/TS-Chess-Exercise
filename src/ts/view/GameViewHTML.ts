import { Board, BoardSquare } from "../model/Board";
import { Game } from "../model/Game";
import { Piece } from "../model/Piece";
import { PieceMove } from "../modules/PieceMove";
import { Document } from "../utils/Document";
import { GameViewInterface } from "./GameViewInterface";

export type GameViewHTMLConfig = {
    elementId: string;
}

export class GameViewHTML implements GameViewInterface {
    private element: HTMLElement|null = null

    constructor(public config: GameViewHTMLConfig) {
        this.config = config;
    }

    public init(game: Game) {
        this.element = document.getElementById(this.config.elementId);

        if(!this.element) {
            return;
        }

        this.element.innerHTML = '';

        if(!this.element) {
            throw new Error('Element not found');
        }

        this.element.appendChild(this.createRanks(game.board));
        this.element.appendChild(this.createFiles(game.board));
        this.element.appendChild(this.createBoard(game.board));

        const pieceDrag = new PieceMove({
            dragSelector: '.piece',
            dropSelector: '.square'
        });
    
        pieceDrag.init();
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
            ranksElement.appendChild(Document.createElement('div', {
                id: `rank-${i}`,
                className: `ranks__rank`
            }));
        }

        return ranksElement;
    }

    public createFiles(board: Board): HTMLElement {
        const filesElement: HTMLElement = Document.createElement('div', {
            id: `files`,
            className: `files`
        });

        for(let i = 0; i < board.squares.length; i++) {
            filesElement.appendChild(Document.createElement('div', {
                id: `file-${i}`,
                className: `files__file`
            }));
        }

        return filesElement;
    }
}