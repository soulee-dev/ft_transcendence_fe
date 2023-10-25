import Paddle from "./Paddle";
import Movable from "./Movable";

class Ball extends Movable {
	radius: number;
	dx: number;
	dy: number;
	color: string;

	constructor(
		x: number,
		y: number,
		radius: number,
		dx: number,
		dy: number,
		color: string
	) {
		super(x, y);
		this.radius = radius;
		this.dx = dx;
		this.dy = dy;
		this.color = color;
	}

	collisionDetection = (
		myPaddle: Paddle,
		opponentPaddle: Paddle,
		width: number,
		height: number
	) => {
		this.collisionDetectionWithPaddle(myPaddle, opponentPaddle);
		this.collisionDetectionWithWall(width, height);
	};

	private collisionDetectionWithPaddle = (
		myPaddle: Paddle,
		opponentPaddle: Paddle
	) => {
		if (
			this._y + this.radius > myPaddle._y &&
			this._x > myPaddle._x &&
			this._x < myPaddle._x + myPaddle.width
		) {
			this.dx *= 1.1;
			this.dy = -this.dy;
		}
		if (
			this._y - this.radius < opponentPaddle._y + opponentPaddle.height &&
			this._x > opponentPaddle.width &&
			this._x < opponentPaddle._x + opponentPaddle.width
		) {
			this.dx *= 1.1;
			this.dy = -this.dy;
		}
	};

	private collisionDetectionWithWall = (width: number, height: number) => {
		if (this._y + this.radius > height) {
			this.color = "red";
			this.dy = -this.dy;
		} else if (this._y - this.radius < 0) {
			this.color = "red";
			this.dy = -this.dy;
		}
		if (this._x + this.radius > width || this._x - this.radius < 0) {
			this.dx = -this.dx;
		}
		// if (scoreRef.current.player1 >= 5 || scoreRef.current.player2 >= 5) {
		// 	isPlaying = false;
		// }
	};

	SetDirection = (dx: number, dy: number) => {
		this.dx = dx;
		this.dy = dy;
	};
}

export default Ball;
