//AABB
type hitResult = {
	isHit: boolean;
	x: boolean;
	y: boolean;
	dx?: number;
	dy?: number;
};

class CollisionBox {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width || 0;
		this.height = height || 0;
	}
	checkCollision(box: CollisionBox): hitResult {
		if (
			this.x < box.x + box.width &&
			this.x + this.width > box.x &&
			this.y < box.y + box.height &&
			this.y + this.height > box.y
		) {
			return { isHit: true, x: true, y: true };
		}
		return { isHit: false, x: false, y: false };
	}

	checkCollisionWithWall(width: number, height: number): hitResult {
		console.log(this.x, this.y, this.width, this.height);
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
