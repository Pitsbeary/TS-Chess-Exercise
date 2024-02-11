import { PieceInvalidMoveEventDetail, PieceValidMoveEventDetail } from "../controller/GameController";

export type PieceMoveOptions = {
    dragSelector: string;
    dropSelector: string;
}

export class PieceMove {
    private draggedElement: HTMLElement|null = null;
    private draggedElementParent: HTMLElement|null = null;

    constructor(private readonly options: PieceMoveOptions) 
    {
        this.options = options;
    }

    public init() 
    {
        const dragElements = document.querySelectorAll(this.options.dragSelector);
        
        for(const element of dragElements) {
            this.initDrag(element as HTMLElement);
        }

        const dropElements = document.querySelectorAll(this.options.dropSelector);
        
        for(const element of dropElements) {
            this.initDrop(element as HTMLElement);
        }
        
        document.addEventListener('PieceInvalidMove', (e) => {
            console.log('INVALID MOVE', e);
            this.onPieceInvalidMove((e as CustomEvent).detail);
        });

        document.addEventListener('PieceValidMove', (e) => {
            console.log('VALID MOVE', e);
            this.onPieceValidMove((e as CustomEvent).detail);
        });
    }

    public initDrag(element: HTMLElement) 
    {
        element.addEventListener('dragstart', (e) => {
            this.draggedElement = e.target as HTMLElement | null;
            this.draggedElementParent = this.draggedElement ? this.draggedElement.parentElement : null;
        });

        element.addEventListener('drag', (e) => {

        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
        });

        element.addEventListener('dragend', (e) => {
            this.draggedElement = null;
            this.draggedElementParent = null;
        });

    }

    public initDrop(element: HTMLElement) 
    {
        element.addEventListener('dragenter', (e) => {
            e.preventDefault();
        });

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        element.addEventListener('dragleave', (e) => {
            
        });

        element.addEventListener('drop', (e) => {
            if(!this.draggedElement || !this.draggedElementParent) {
                return;
            }

            // element.appendChild(this.draggedElement);

            const dropEvent = new CustomEvent('PieceDropped', {
                detail: {
                    movedPieceId: this.draggedElement.id,
                    from: {
                        rankIndex: this.draggedElementParent.dataset.rank ? Number.parseInt(this.draggedElementParent.dataset.rank) : null,
                        fileIndex: this.draggedElementParent.dataset.file ? Number.parseInt(this.draggedElementParent.dataset.file) : null
                    },
                    to: {
                        rankIndex: element.dataset.rank ? Number.parseInt(element.dataset.rank) : null,
                        fileIndex: element.dataset.file ? Number.parseInt(element.dataset.file) : null,
                    }
                }
            });

            document.dispatchEvent(dropEvent)
        });
    }

    public onPieceInvalidMove(detail: PieceInvalidMoveEventDetail) {
        const pieceElement: HTMLElement | null = document.getElementById(detail.movedPieceId);
        
        if(!pieceElement) {
            return;
        }

        const fromSquare: HTMLElement | null = document.querySelector(`.square[data-rank="${detail.from.rankIndex}"][data-file="${detail.from.fileIndex}"]`);
        
        if(!fromSquare) {
            return;
        }
        
        fromSquare.appendChild(pieceElement);
    }

    public onPieceValidMove(detail: PieceValidMoveEventDetail) {
        
        if(detail.takenPieceId) {
            const takenPieceElement: HTMLElement | null = document.getElementById(detail.takenPieceId);
        
            if(!takenPieceElement) {
                return;
            }

            takenPieceElement.remove();
        }
        

        const movedPieceElement: HTMLElement | null = document.getElementById(detail.movedPieceId);
        
        if(!movedPieceElement) {
            return;
        }
        
        const fromSquare: HTMLElement | null = document.querySelector(`.square[data-rank="${detail.to.rankIndex}"][data-file="${detail.to.fileIndex}"]`);
        

        if(!fromSquare) {
            return;
        }

        fromSquare.appendChild(movedPieceElement);
    }
}