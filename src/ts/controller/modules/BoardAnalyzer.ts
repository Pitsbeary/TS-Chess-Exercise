import { Board } from "../../model/Board";
import { MoveHistory } from "../../model/History";
import { Piece, PiecePosition, PieceType } from "../../model/Piece";
import { Player } from "../../model/Player";
import { TakeValidation } from "../../validation/utils/TakeValidation";
import { MoveAnalyzer, MoveDetail } from "./MoveAnalyzer";

export class BoardAnalyzer {
    public static isPlayerInCheck(player: Player, board: Board, history: MoveHistory): boolean 
    {
        const checks = BoardAnalyzer.getChecks(board, history);

        return !!checks.filter((checkedKingPosition: PiecePosition) => {
            return board.squares[checkedKingPosition.rankIndex][checkedKingPosition.fileIndex].piece?.color === player.config.color;
        }).length;
    }

    public static getChecks(board: Board, history: MoveHistory): PiecePosition[]
    {
        const kingsPositions: PiecePosition[] = [];
        const checks: PiecePosition[] = [];

        for(let rankIndex = 0; rankIndex < board.squares.length; rankIndex++) {
            for(let fileIndex = 0; fileIndex < board.squares[rankIndex].length; fileIndex++) {
                if(board.squares[rankIndex][fileIndex].piece?.type === PieceType.King) {
                    kingsPositions.push({
                        rankIndex: rankIndex,
                        fileIndex: fileIndex
                    })
                }
            }
        }

        for(const kingPosition of kingsPositions) {
            if(BoardAnalyzer.canBeTaken(kingPosition, board, history)) {
                checks.push(kingPosition);
            }
        }        

        return checks;
    }

    public static canBeTaken(position: PiecePosition, board: Board, history: MoveHistory): boolean
    {
        let result: boolean = false;

        const piece: Piece|null = board.squares[position.rankIndex][position.fileIndex].piece;

        if(!piece) {
            return false;
        }

        board.squares.forEach((rank, rankIndex) => {
            rank.forEach((square, fileIndex) => {
                const possibleTakerPosition: PiecePosition = {
                    rankIndex: rankIndex,
                    fileIndex: fileIndex
                }

                if(position.fileIndex === possibleTakerPosition.fileIndex && position.rankIndex === possibleTakerPosition.rankIndex) {
                    return;
                }

                const possibleTaker = board.squares[possibleTakerPosition.rankIndex][possibleTakerPosition.fileIndex].piece;

                if(!possibleTaker || possibleTaker.color === piece.color) {
                    return;
                }    

                const canMove: boolean = possibleTaker.getMoveValidator(board, history).canMove(possibleTaker, possibleTakerPosition, position);
                const canTake: boolean = possibleTaker.getTakeValidator(board, history).canTake(possibleTakerPosition, position, possibleTaker, piece);

                if(canMove && canTake) {
                    result = true;
                }
            })
        });

        return result;
    }

    public static isPlayerInCheckMate(player: Player, board: Board, history: MoveHistory): boolean 
    {
        if(!BoardAnalyzer.isPlayerInCheck(player, board, history)) {
            return false;
        }

        if(BoardAnalyzer.canPlayerEscapeCheck(player, board, history)) {
            return false;
        }

        return true;
    }

    public static canPlayerEscapeCheck(player: Player, board: Board, history: MoveHistory): boolean 
    {
        for(let rankIndex = 0; rankIndex < board.squares.length; rankIndex++) {
            for(let fileIndex = 0; fileIndex < board.squares[rankIndex].length; fileIndex++) {
                if(board.squares[rankIndex][fileIndex].piece?.color !== player.config.color) {
                    continue;
                }

                for(let possibleRankIndex = 0; possibleRankIndex < board.squares.length; possibleRankIndex++) {
                    for(let possibleFileIndex = 0; possibleFileIndex < board.squares[possibleRankIndex].length; possibleFileIndex++) {
                        const possibleDetail: MoveDetail = {
                            from: {
                                rankIndex: rankIndex,
                                fileIndex: fileIndex
                            }, to: {
                                rankIndex: possibleRankIndex,
                                fileIndex: possibleFileIndex
                            },
                            player: player
                        };
                        
                        const isTaking: boolean = TakeValidation.isTaking(board, possibleDetail.to);
                        const isValidMove: boolean = isTaking ? MoveAnalyzer.isValidMove(possibleDetail, board, history) && MoveAnalyzer.isValidCapture(possibleDetail, board, history) : MoveAnalyzer.isValidMove(possibleDetail, board, history);
                        
                        if(!isValidMove) {
                            continue;
                        }

                        const pieceBackup: Piece | null = board.squares[possibleDetail.to.rankIndex][possibleDetail.to.fileIndex].piece;

                        board.squares[possibleDetail.to.rankIndex][possibleDetail.to.fileIndex].piece = board.squares[possibleDetail.from.rankIndex][possibleDetail.from.fileIndex].piece;
                        board.squares[possibleDetail.from.rankIndex][possibleDetail.from.fileIndex].piece = null

                        const isInCheck: boolean = BoardAnalyzer.isPlayerInCheck(player, board, history);

                        board.squares[possibleDetail.from.rankIndex][possibleDetail.from.fileIndex].piece = board.squares[possibleDetail.to.rankIndex][possibleDetail.to.fileIndex].piece;
                        board.squares[possibleDetail.to.rankIndex][possibleDetail.to.fileIndex].piece = pieceBackup;

                        if(!isInCheck) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
    
}