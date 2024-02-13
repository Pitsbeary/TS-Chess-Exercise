import { PlayerConfig } from "./Game";
import { Piece } from "./Piece";

export class Player {
    public pieces: Piece[] = [];

    constructor(public readonly config: PlayerConfig) {
        this.config = config;
    }
}