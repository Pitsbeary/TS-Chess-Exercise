import { GameController } from "./controller/GameController";
import { BoardType } from "./factory/BoardFactory";
import { Game } from "./model/Game";
import { PieceColor } from "./model/Piece";
import { GameViewHTML } from "./view/GameViewHTML";


document.addEventListener('DOMContentLoaded', () => {
    const gameModel = new Game({
        board: {
            type: BoardType.Default
        },
        players: [
            {
                timer: 600,
                color: PieceColor.White,
                name: 'White',
                caption: 'Very good player'
            },
            {
                timer: 600,
                color: PieceColor.Black,
                name: 'Black',
                caption: 'Very good player'
            },
        ]
    });
    const gameView = new GameViewHTML({
        elementId: 'game',
        elementParentId: 'main'
    });

    const gameController = new GameController(
        gameModel,
        gameView
    );
    
    gameController.init();
});