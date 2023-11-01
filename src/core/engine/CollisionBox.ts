import GameObject from "../gameobject/GameObject";

//AABB
type hitResult = {
	isHit: boolean;
	x: boolean;
	y: boolean;
	dx?: number;
	// dy?: number;
};

class CollisionBox {
	owner: GameObject;
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(
		owner: GameObject,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.owner = owner;
		this.x = x;
		this.y = y;
		this.width = width || 0;
		this.height = height || 0;
	}
	checkCollision(objects: GameObject[]) {
		let hitResult = { isHit: false, x: false, y: false, dx: 0 };
		for (var box of objects) {
			if (
				this.x < box.collisionBox.x + box.collisionBox.width &&
				this.x + this.width > box.collisionBox.x &&
				this.y < box.collisionBox.y + box.collisionBox.height &&
				this.y + this.height > box.collisionBox.y
			) {
				hitResult = {
					isHit: true,
					x: true,
					y: true,
					dx: -box.collisionBox.owner.dx,
				};
				break;
			}
		}
		if (hitResult.isHit) {
			this.owner.dx! = hitResult.dx;
			this.owner.dy *= -1;
		}
	}

	checkCollisionWithWall(width: number, height: number): hitResult {
		if (this.y + this.height / 2 > height || this.y - this.height / 2 < 0) {
			return { isHit: true, x: false, y: true };
		}
		if (this.x + this.width / 2 > width || (this.x - this.width) / 2 < 0) {
			return { isHit: true, x: true, y: false };
		}
		return { isHit: false, x: false, y: false };
	}
}

export default CollisionBox;
