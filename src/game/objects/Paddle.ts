import Movable from "./Movable";

class Paddle extends Movable {
	width: number;
	height: number;
	dx: number;
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		dx: number
	) {
		super(x, y);
		this.width = width;
		this.height = height;
		this.dx = dx;
	}
}

export default Paddle;
