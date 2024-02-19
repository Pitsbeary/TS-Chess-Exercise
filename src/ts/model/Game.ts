import { BoardFactory, BoardType } from "../factory/BoardFactory";
import { Board } from "./Board";
import { PieceColor } from "./Piece";
import { Player } from "./Player";
import { PlayerFactory } from '../factory/PlayerFactory';

export type GameConfig = {
    board: BoardConfig;
    players: PlayersConfig; 
}

export type BoardConfig = {
    type: BoardType;
}

export type PlayersConfig = PlayerConfig[];

export type PlayerConfig = {
    color: PieceColor;
    timer: number;
    
    name: string;
    id: string;

    caption?: string;
    avatar?: string;
}

export type Players = Map<PieceColor, Player>;

export class Game {
    public board: Board
    public players: Players;

    constructor(config: GameConfig) {
        const board = this.createBoard(config.board);

        this.board = board;
        this.players = this.createPlayers(config.players, board);
    }

    createBoard(boardConfig: BoardConfig): Board 
    {
        const boardFactory = new BoardFactory();
        return boardFactory.createBoard(boardConfig);
    }

    createPlayers(playersConfig: PlayersConfig, board: Board): Players
    {
        const players: Players = new Map<PieceColor, Player>();
        const playerFactory = new PlayerFactory();

        playersConfig.forEach((playerConfig) => {
            players.set(playerConfig.color, playerFactory.createPlayer(playerConfig, board));
        });

        return players;
    }
}