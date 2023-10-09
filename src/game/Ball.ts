import Paddle from "./Paddle";

class Ball {
	x: number;
	y: number;
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
		this.x = x;
		this.y = y;
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
			this.y + this.radius > myPaddle.y &&
			this.x > myPaddle.x &&
			this.x < myPaddle.x + myPaddle.width
		) {
			this.dx *= 1.1;
			this.dy = -this.dy * 1.1;
		}
		if (
			this.y - this.radius < opponentPaddle.y + opponentPaddle.height &&
			this.x > opponentPaddle.width &&
			this.x < opponentPaddle.x + opponentPaddle.width
		) {
			this.dx *= 1.1;
			this.dy = -this.dy * 1.1;
		}
	};

	private collisionDetectionWithWall = (width: number, height: number) => {
		console.log(
			this.x +
				this.radius +
				", " +
				this.y +
				this.radius +
				"canvas: " +
				width +
				", " +
				height
		);
		if (this.y + this.radius > height) {
			this.color = "red";
			console.log("hit y");
			// scoreRef.current.player1 += 1;
			// ballRef.current.x = 200;
			// ballRef.current.y = 150;
			this.dy = -this.dy;
		} else if (this.y - this.radius < 0) {
			this.color = "red";
			// scoreRef.current.player2 += 1;
			// ballRef.current.x = 200;
			// ballRef.current.y = 150;
			this.dy = -this.dy;
		}
		if (this.x + this.radius > width || this.x - this.radius < 0) {
			this.dx = -this.dx;
			console.log("hit x ");
		}
		// if (scoreRef.current.player1 >= 5 || scoreRef.current.player2 >= 5) {
		// 	isPlaying = false;
		// }
	};
}

export default Ball;
