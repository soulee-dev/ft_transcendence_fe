import GameObject from "../objects/GameObject";
import Ball from "../objects/Ball";
import Paddle from "../objects/Paddle";

class Engine {
	public _canvas: HTMLCanvasElement | null = null;
	private _background: HTMLCanvasElement | null = null;
	private _context: CanvasRenderingContext2D | null = null;
	private _animationID: number;
	private _bisPlaying: boolean;
	private _lastTime: number = 0;
	private _pawns: GameObject[] = [];

	constructor() {
		this._animationID = 0;
		this._bisPlaying = false;
		console.log("Engine constructor");
	}

	init(canvas: HTMLCanvasElement, background: HTMLCanvasElement) {
		console.log("Engine init");
		this._canvas = canvas;
		this._background = background;
		this._context = canvas.getContext("2d");
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

	getBall = () => {
		return this._pawns[0];
	};

	getPaddle = () => {
		return this._pawns[2];
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
			this._pawns.forEach((pawn) => {
				pawn.update(deltaTime);
			});
			const ball = this._pawns[0] as Ball;
			const myPaddle = this._pawns[1] as Paddle;
			const opponentPaddle = this._pawns[2] as Paddle;
			ball!.collisionDetection(
				myPaddle!,
				opponentPaddle!,
				this._canvas!.width,
				this._canvas!.height
			);
			// ball!._x += ball!.dx * deltaTime;
			// ball!._y += ball!.dy * deltaTime;
		}
	};

	draw = (context: CanvasRenderingContext2D) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		this._pawns.forEach((pawn) => {
			pawn.render(context);
		});

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

	spawnObject = (pawn: GameObject) => {
		this._pawns.push(pawn);
	};
}

export default Engine;
