class GameObject {
	_x: number;
	_y: number;
	dx: number;
	dy: number;
	color: string = "white";

	constructor(x: number, y: number, dx: number, dy: number) {
		this._x = x;
		this._y = y;
		this.dx = dx;
		this.dy = dy;
	}

	render = (context: CanvasRenderingContext2D) => {};

	update = (deltaTime: number) => {};
}

export default GameObject;
