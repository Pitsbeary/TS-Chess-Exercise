import { BoardFactory, BoardType } from "../factory/BoardFactory";
import { Board } from "./Board";
import { PieceColor } from "./Piece";
import { Player } from "./Player";
import { PlayerFactory } from '../factory/PlayerFactory';

export type GameConfig = {
    playersConfig: PlayersConfig;
    playersOrder: PieceColor[];
    playerCurrent: PieceColor;

    board: BoardConfig;
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

    constructor(public readonly config: GameConfig) {
        this.config = config;

        const board = this.createBoard();

        this.board = board;
        this.players = this.createPlayers(board);
    }

    createBoard(): Board 
    {
        const boardFactory = new BoardFactory();
        return boardFactory.createBoard(this.config);
    }

    createPlayers(board: Board): Players
    {
        const players: Players = new Map<PieceColor, Player>();
        const playerFactory = new PlayerFactory();

        this.config.playersConfig.forEach((playerConfig) => {
            players.set(playerConfig.color, playerFactory.createPlayer(playerConfig, board));
        });

        return players;
    }
}