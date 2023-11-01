import GameObject from "../gameobject/GameObject";
import Ball from "../../game/objects/Ball";

class Engine {
	public _canvas: HTMLCanvasElement | null = null;
	private _background: HTMLCanvasElement | null = null;
	private _context: CanvasRenderingContext2D | null = null;
	private _animationID: number;
	private _bisPlaying: boolean;
	private _lastTime: number = 0;
	private _pawns: GameObject[] = [];
	public _ball: Ball;

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
			this._ball.collisionBox.checkCollision(this._pawns);
			this._ball.update(deltaTime);
			this._pawns.forEach((pawn) => {
				pawn.update(deltaTime);
			});
		}
	};

	draw = (context: CanvasRenderingContext2D) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		this._ball.render(context);
		this._pawns.forEach((pawn) => {
			pawn.render(context);
		});
	};

	spawnObject = (pawn: GameObject) => {
		this._pawns.push(pawn);
	};
}

export default Engine;
