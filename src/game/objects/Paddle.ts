import GameObject from "./GameObject";
import { clamp } from "../../utils/clamp";

class Paddle extends GameObject {
	width: number;
	height: number;
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		dx: number,
		dy: number
	) {
		super(x, y, dx, dy);
		this.width = width;
		this.height = height;
	}

	render = (context: CanvasRenderingContext2D) => {
		context.fillStyle = "blue";
		context.fillRect(this._x, this._y, this.width, this.height);
	};

	update = (deltaTime: number) => {
		// console.log(deltaTime);
		this._x = clamp(this._x + this.dx * deltaTime, 0, 502 - this.width);
		// this._x += this.dx * deltaTime;
	};
}

export default Paddle;
