import { WebSocket } from "ws";
import { INIT_GAME, MOVE, PING, SHOW } from "./Messages";
import { Game } from "./Game";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket;
    private users: WebSocket[];

    constructor() {
        this.pendingUser = null;
        this.games = [];
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addhandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
    }

    private addhandler(socket: WebSocket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    // start the game
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }

            if (message.type === SHOW) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.printBoard();
                }
            }
            if (message.type === PING) {
                socket.send(JSON.stringify({
                    type: "ping",
                    payload: {
                        status: "success"
                    }
                }));
            }
        });
    }
}