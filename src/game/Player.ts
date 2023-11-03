export default class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    score: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.score = score;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw score
    ctx.font = "20px Arial";
    ctx.fillText(
      this.score.toString(),
      this.x < 400 ? 370 - (this.score.toString().length - 1) * 12 : 420,
      30
    );
    ctx.fillRect(this.x < 400 ? 790 : 0, 0, 10, 500);
  }
}
