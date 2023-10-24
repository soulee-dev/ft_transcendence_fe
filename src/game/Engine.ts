import Ball from "./Ball";
import Paddle from "./Paddle";
import { clamp } from "../utils/clamp";

class Engine {
	private _canvas: HTMLCanvasElement | null = null;
	private _background: HTMLCanvasElement | null = null;
	private _context: CanvasRenderingContext2D | null = null;
	private _animationID: number;
	private _bisPlaying: boolean;
	private _lastPressedKey: string;
	private _lastTime: number = 0;

	private _ball: Ball | null = null;
	private _myPaddle: Paddle | null = null;
	private _opponentPaddle: Paddle | null = null;

	count: number = 0;

	constructor() {
		this._animationID = 0;
		this._bisPlaying = false;
		this._lastPressedKey = "";

		console.log("Engine constructor");
	}

	init(canvas: HTMLCanvasElement, background: HTMLCanvasElement) {
		console.log("Engine init");
		this._canvas = canvas;
		this._background = background;
		this._context = canvas.getContext("2d");
		this._ball = new Ball(
			this._canvas.width / 2,
			this._canvas.height / 2,
			8,
			0,
			0,
			"green"
		);
		this._myPaddle = new Paddle(
			this._canvas.width / 2,
			this._canvas.height - 10,
			200,
			10,
			0
		);
		this._opponentPaddle = new Paddle(
			this._canvas.width / 2,
			0,
			200,
			10,
			0
		);
		this._ball?.SetDirection(0, 0.1);
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);
	}

	start = () => {
		console.log("Engine start");
		this._bisPlaying = true;
		this._lastTime = Math.floor(performance.now());
		this._animationID = window.requestAnimationFrame(this.renderer);
	};

	stop = () => {
		console.log("Engine stop");
		this._bisPlaying = false;
		window.cancelAnimationFrame(this._animationID);
	};

	renderer = (time: number) => {
		let worldTime = Math.floor(time);
		let deltaTime = worldTime - this._lastTime;
		this._lastTime = worldTime;
		this.update(deltaTime);
		this.draw(this._context!);
		if (this._bisPlaying) {
			window.requestAnimationFrame(this.renderer);
		}
	};

	update = (deltaTime: number) => {
		if (deltaTime > 0) {
			this._ball!.collisionDetection(
				this._myPaddle!,
				this._opponentPaddle!,
				this._canvas!.width,
				this._canvas!.height
			);
			this._ball!.x += this._ball!.dx * deltaTime;
			this._ball!.y += this._ball!.dy * deltaTime;
			this._myPaddle!.x = clamp(
				this._myPaddle!.x + this._myPaddle!.dx * deltaTime,
				0,
				400
			);
			this._opponentPaddle!.x = clamp(
				this._opponentPaddle!.x + this._opponentPaddle!.dx * deltaTime,
				0,
				400
			);
		}
	};

	draw = (context: CanvasRenderingContext2D) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		context.fillStyle = this._ball!.color;
		context.beginPath();
		context.arc(
			this._ball!.x,
			this._ball!.y,
			this._ball!.radius,
			0,
			Math.PI * 2
		);
		context.fill();
		this._ball!.color = "green";

		context.fillRect(
			this._myPaddle!.x,
			this._myPaddle!.y,
			this._myPaddle!.width,
			this._myPaddle!.height
		);
		context.fillRect(
			this._opponentPaddle!.x,
			this._opponentPaddle!.y,
			this._opponentPaddle!.width,
			this._opponentPaddle!.height
		);

		// context.font = "20px Arial";
		// //show both scores
		// context.fillText(
		//     "player 1| " +
		//         scoreRef.current.player1 +
		//         " : " +
		//         scoreRef.current.player2 +
		//         " |player 2",
		//     200,
		//     400
		// );
		// context.font = "10px Arial";
		// context.fillText("FPS: " + FPS, 280, 420);
	};

	handleKeyDown = (event: KeyboardEvent) => {
		// event.preventDefault();
		this._lastPressedKey = event.key;
		switch (event.key) {
			case "ArrowLeft":
				console.log("Pressed key : left");
				this._myPaddle!.dx = -0.25;
				break;
			case "ArrowRight":
				console.log("Pressed key : right");
				this._myPaddle!.dx = 0.25;
				break;
			case "q":
				console.log("Pressed key : Q");
				this._opponentPaddle!.dx = -0.25;
				break;
			case "w":
				console.log("Pressed key : w");
				this._opponentPaddle!.dx = 0.25;
				break;
			//case esc
			case "Escape":
				console.log("Pressed key : Escape");
				this.stop();
				break;
			case "e":
				console.log("Pressed key : e");
				this.start();
				break;
			default:
				break;
		}
	};

	handleKeyUp = (event: KeyboardEvent) => {
		console.log("Released key : " + event.key);
		if (this._lastPressedKey === event.key) {
			this._myPaddle!.dx = 0;
			this._opponentPaddle!.dx = 0;
		}
	};
}

export default Engine;
