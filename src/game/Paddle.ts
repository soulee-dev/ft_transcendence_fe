class Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    dx: number;
    constructor(x: number, y: number, width: number, height: number, dx: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
    }
}

export default Paddle;