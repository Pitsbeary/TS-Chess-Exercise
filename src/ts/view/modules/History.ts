import { PieceMove } from "../../model/History";
import { Document } from "../../utils/Document";
import { Notation } from "./Notation";

export type HistoryOptions = {
    selector: string;
}

export class History {
    constructor(private readonly options: HistoryOptions) 
    {
        this.options = options;
    }

    init()
    {
        const element = document.querySelector(this.options.selector);

        if(!element) {
            return;
        }

        document.addEventListener('PieceMoveHistory.MoveAdded', (e) => {
            element.appendChild(this.createMoveElement((e as CustomEvent).detail as PieceMove));
        })
    }

    createMoveElement(pieceMove: PieceMove): HTMLElement
    {
        const moveElement = Document.createElement('div', {
            className: 'move-history__move'
        });
        moveElement.innerHTML = Notation.getMove(pieceMove);

        return moveElement;
    }
}