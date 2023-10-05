class Ball {
    x: number;
    y: number;
    radius: number;
    dx: number;
    dy: number;
    color: string;

    constructor(x: number, y: number, radius: number, dx: number, dy:number, color:string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }
}

export default Ball;