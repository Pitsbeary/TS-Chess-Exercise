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
                name: 'White Player',
            },
            {
                timer: 600,
                color: PieceColor.Black,
                name: 'Black Player',
            },
        ]
    });
    const gameView = new GameViewHTML({
        elementId: 'game'
    });

    const gameController = new GameController(
        gameModel,
        gameView
    );
    
    gameController.init();
});