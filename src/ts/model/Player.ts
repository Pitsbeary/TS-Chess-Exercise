import { PieceColor } from "./Piece";

export class Player {
    constructor(public color: PieceColor) {
        this.color = color;
    }
}