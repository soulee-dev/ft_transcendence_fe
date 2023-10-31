import GameObject from "../../core/gameobject/GameObject";
import CollisionBox from "../../core/engine/CollisionBox";

class Ball extends GameObject {
	radius: number;

	constructor(
		x: number,
		y: number,
		radius: number,
		dx: number,
		dy: number,
		color: string
	) {
		super(x, y, dx, dy);
		this.radius = radius;
		this.dx = dx;
		this.dy = dy;
		this.collisionBox = new CollisionBox(x, y, radius * 2, radius * 2);
		this.color = color;
	}

	SetDirection = (dx: number, dy: number) => {
		this.dx = dx;
		this.dy = dy;
	};

	render = (context: CanvasRenderingContext2D) => {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this._x, this._y, this.radius, 0, Math.PI * 2);
		context.fill();
	};

	update = (deltaTime: number) => {
		const hitResult = this.collisionBox.checkCollisionWithWall(502, 727);
		if (hitResult.isHit) {
			this.dx = hitResult.x ? -this.dx : this.dx;
			this.dy = hitResult.y ? -this.dy : this.dy;
		}
		this._x += this.dx * deltaTime;
		this.collisionBox.x = this._x;
		this._y += this.dy * deltaTime;
		this.collisionBox.y = this._y;
	};
}

export default Ball;
