import { Board } from "../model/Board";
import { PlayerConfig } from "../model/Game";
import { Player } from "../model/Player";

export class PlayerFactory {
    createPlayer(config: PlayerConfig, board: Board): Player {
        const player = new Player(config);
        player.pieces = board.getPieces(config.color);

        return player;
    }
}