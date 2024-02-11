import { BoardSquare } from "../model/Board";

export class BoardSquareFactory {
    static createEmptyBoardSquare(): BoardSquare {
        return new BoardSquare();
    }
}