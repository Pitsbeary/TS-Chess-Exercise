import { BoardFactory, BoardType } from "../factory/BoardFactory";
import { Board } from "./Board";

export class Game {
    public board: Board

    constructor() {
        this.board = this.createBoard();
    }

    createBoard() {
        const boardFactory = new BoardFactory();
        return boardFactory.createBoard(BoardType.Default);
    }
}