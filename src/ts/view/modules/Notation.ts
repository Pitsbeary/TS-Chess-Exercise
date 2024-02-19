const LETTER_INDEX_START = 97;

export class Notation {
    public static getRank(rankIndex: number, ranksLength: number): string {
        return String(ranksLength - rankIndex);
    }

    public static getFile(fileIndex: number): string {
        return String.fromCharCode(LETTER_INDEX_START + fileIndex);
    }
}