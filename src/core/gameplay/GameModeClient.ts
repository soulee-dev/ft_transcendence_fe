import Player from "../../game/player/Player";
import Engine from "../engine/Engine";
import Ball from "../../game/objects/Ball";
import Paddle from "../../game/objects/Paddle";
import socketIOClient, { Socket } from "socket.io-client";

class GameModeClient {
	private _engine: Engine;
	private _playerArray: Player[];
	private _tempPlayer: Player;
	private _lastPressedKey: string;
	private _socket: Socket;

	constructor(engine: Engine, socket: Socket) {
		this._engine = engine;
		this._playerArray = [];
		this._lastPressedKey = "";

		this._tempPlayer = new Player();
		this._socket = socket;
		this._socket.on("ball", (data: Ball) => {
			this.onBallChange(data);
		});
		this._socket.on("move", (data) => {
			this.onPaddleChange(data);
		});
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);
	}

	onBallChange = (data: Ball) => {
		console.log("onBallChange");
		this._engine.getBall().dy = data.dy;
		this._engine.getBall().color = data.color;
	};

	onPaddleChange = (data: number) => {
		console.log("onPaddleChange");
		this._engine.getPaddle().dx = data;
	};

	startMatch = () => {
		this._engine.start();

		const ball = new Ball(
			this._engine._canvas!.width / 2,
			this._engine._canvas!.height / 2,
			8,
			0,
			0.1,
			"white"
		);

		const myPaddle = new Paddle(
			this._engine._canvas!.width / 2,
			this._engine._canvas!.height - 10,
			200,
			10,
			0,
			0
		);

		const opponentPaddle = new Paddle(
			this._engine._canvas!.width / 2,
			0,
			200,
			10,
			0,
			0
		);

		this._tempPlayer.possess(myPaddle);
		// this._engine.spawnObject(ball);
		this._engine._ball = ball;
		this._engine.spawnObject(myPaddle);
		this._engine.spawnObject(opponentPaddle);
		console.log("GameMode startMatch");
	};

	endMatch = () => {
		console.log("GameMode endMatch");
		this._engine.stop();
	};

	handleKeyDown = (event: KeyboardEvent) => {
		event.preventDefault();
		this._lastPressedKey = event.key;

		switch (event.key) {
			case "ArrowLeft":
				console.log("client press key : left");
				this._socket.emit("input", -0.25);
				this._tempPlayer._pawn!.dx = -0.25;
				break;
			case "ArrowRight":
				console.log("client presse key : right");
				this._socket.emit("input", 0.25);
				this._tempPlayer._pawn!.dx = 0.25;
				break;
			default:
				break;
		}
	};

	handleKeyUp = (event: KeyboardEvent) => {
		console.log("Released key : " + event.key);
		if (this._lastPressedKey === event.key) {
			this._socket.emit("input", 0);

			this._tempPlayer._pawn!.dx = 0;
		}
	};
}

export default GameModeClient;
