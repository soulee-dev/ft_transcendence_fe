import CollisionBox from "../../core/engine/CollisionBox";
import GameObject from "../../core/gameobject/GameObject";
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
		this.collisionBox = new CollisionBox(x, y, width, height);
	}

	render = (context: CanvasRenderingContext2D) => {
		context.fillStyle = "blue";
		context.fillRect(this._x, this._y, this.width, this.height);
	};

	update = (deltaTime: number) => {
		this._x = clamp(this._x + this.dx * deltaTime, 0, 502 - this.width);
	};
}

export default Paddle;
