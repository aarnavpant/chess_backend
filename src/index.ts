import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 8080 });
const gm = new GameManager();


wss.on('connection', function connection(ws) {
    gm.addUser(ws);
    ws.on('disconnect', () => {
        gm.removeUser(ws);
    });
});