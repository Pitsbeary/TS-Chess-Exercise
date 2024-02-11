import { GameController } from "./controller/GameController";
import { Game } from "./model/Game";
import { PieceMove } from "./modules/PieceMove";
import { GameViewHTML } from "./view/GameViewHTML";


document.addEventListener('DOMContentLoaded', () => {
    const gameModel = new Game();
    const gameView = new GameViewHTML({
        elementId: 'game'
    });

    const gameController = new GameController(
        gameModel,
        gameView
    );
    
    gameController.init();
});