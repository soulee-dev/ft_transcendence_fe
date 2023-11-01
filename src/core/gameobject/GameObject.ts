import CollisionBox from "../engine/CollisionBox";

class GameObject {
	_x: number;
	_y: number;
	dx: number;
	dy: number;
	collisionBox: CollisionBox;
	color: string = "white";

	constructor(x: number, y: number, dx: number, dy: number) {
		this._x = x;
		this._y = y;
		this.dx = dx;
		this.dy = dy;
		this.collisionBox = new CollisionBox(this, x, y, 0, 0);
	}

	render = (context: CanvasRenderingContext2D) => {};

	update = (deltaTime: number) => {};
}

export default GameObject;
