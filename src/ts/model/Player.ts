import { PlayerConfig } from "./Game";
import { Piece } from "./Piece";

export class Player {
    public timer: number = 0;
    public pieces: Piece[] = [];

    constructor(public readonly config: PlayerConfig) {
        this.config = config;
        this.resetTimer();
    }

    resetTimer() {
        this.timer = this.config.timer;
    }
}