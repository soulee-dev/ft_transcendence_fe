import { useEffect, useRef } from "react";
import Ball from "./Ball";

const CANVAS_WIDTH: number = 504;
const CANVAS_HEIGHT: number = 724;

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function Pong() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	let isPlaying: boolean = true;
	let lastPressedKey: string = "";

	const ball = new Ball(
		CANVAS_WIDTH / 2,
		CANVAS_HEIGHT / 2,
		8,
		0.2,
		0.2,
		"green"
	);
	const myPaddleRef = useRef({
		x: CANVAS_WIDTH / 2,
		y: CANVAS_HEIGHT - 10,
		width: 200,
		height: 10,
		dx: 0,
	});
	const opponentPaddle = useRef({
		x: CANVAS_WIDTH / 2,
		y: 0,
		width: 200,
		height: 10,
		dx: 0,
	});

	const scoreRef = useRef({ player1: 0, player2: 0 });
	let FPS: number = 0;
	let lastTime: number = 0;

	function draw(context: CanvasRenderingContext2D) {
		if (isPlaying) {
			context.clearRect(
				0,
				0,
				context.canvas.width,
				context.canvas.height
			);
			context.fillStyle = ball.color;
			context.beginPath();
			context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
			context.fill();
			ball.color = "green";

			context.fillRect(
				myPaddleRef.current.x,
				myPaddleRef.current.y,
				myPaddleRef.current.width,
				myPaddleRef.current.height
			);
			context.fillRect(
				opponentPaddle.current.x,
				opponentPaddle.current.y,
				opponentPaddle.current.width,
				opponentPaddle.current.height
			);

			context.font = "20px Arial";
			//show both scores
			context.fillText(
				"player 1| " +
					scoreRef.current.player1 +
					" : " +
					scoreRef.current.player2 +
					" |player 2",
				200,
				400
			);
			context.font = "10px Arial";
			context.fillText("FPS: " + FPS, 280, 420);
		}
	}

	function update(deltaTime: number) {
		const CollisionwithPaddle = (ball: Ball) => {
			if (
				ball.y + ball.radius > myPaddleRef.current.y &&
				ball.x > myPaddleRef.current.x &&
				ball.x < myPaddleRef.current.x + myPaddleRef.current.width
			) {
				ball.dx *= 1.1;
				ball.dy = -ball.dy * 1.1;
			}
			if (
				ball.y - ball.radius <
					opponentPaddle.current.y + opponentPaddle.current.height &&
				ball.x > opponentPaddle.current.width &&
				ball.x < opponentPaddle.current.x + opponentPaddle.current.width
			) {
				ball.dx *= 1.1;
				ball.dy = -ball.dy * 1.1;
			}
		};
		CollisionwithPaddle(ball);

		const CollisionwithWall = (ball: Ball, canvas: any) => {
			if (ball.y + ball.radius > canvas.height) {
				ball.color = "red";
				scoreRef.current.player1 += 1;
				// ballRef.current.x = 200;
				// ballRef.current.y = 150;
				ball.dy = -ball.dy;
			} else if (ball.y - ball.radius < 0) {
				ball.color = "red";
				scoreRef.current.player2 += 1;
				// ballRef.current.x = 200;
				// ballRef.current.y = 150;
				ball.dy = -ball.dy;
			}
			if (
				ball.x + ball.radius > canvas.width ||
				ball.x - ball.radius < 0
			) {
				ball.dx = -ball.dx;
			}
			if (
				scoreRef.current.player1 >= 5 ||
				scoreRef.current.player2 >= 5
			) {
				isPlaying = false;
			}
		};
		CollisionwithWall(ball, canvasRef.current);
		ball.x += ball.dx * deltaTime;
		ball.y += ball.dy * deltaTime;
		myPaddleRef.current.x = clamp(
			myPaddleRef.current.x + myPaddleRef.current.dx * deltaTime,
			0,
			400
		);
		opponentPaddle.current.x = clamp(
			opponentPaddle.current.x + opponentPaddle.current.dx * deltaTime,
			0,
			400
		);
	}

	useEffect(() => {
		const canvas = canvasRef.current!;
		const context = canvas.getContext("2d");

		let animationID: number;

		function renderer(time: number) {
			let worldTime = Math.floor(time);
			let deltaTime = worldTime - lastTime;
			lastTime = worldTime;
			if (deltaTime > 0) {
				FPS = Math.floor(1000 / deltaTime);
			}
			update(deltaTime);
			draw(context!);

			window.requestAnimationFrame(renderer);
		}
		animationID = window.requestAnimationFrame(renderer);

		function handleKeydown(e: KeyboardEvent) {
			lastPressedKey = e.key;
			switch (e.key) {
				case "ArrowLeft":
					console.log("Pressed key : left");
					myPaddleRef.current.dx = -0.25;
					break;
				case "ArrowRight":
					console.log("Pressed key : right");
					myPaddleRef.current.dx = 0.25;
					break;
				case "q":
					console.log("Pressed key : Q");
					opponentPaddle.current.dx = -0.25;
					break;
				case "w":
					console.log("Pressed key : w");
					opponentPaddle.current.dx = 0.25;
					break;
				default:
					break;
			}
		}

		function handleKeyup(e: KeyboardEvent) {
			console.log("Released key : " + e.key);
			if (lastPressedKey === e.key) {
				myPaddleRef.current.dx = 0;
				opponentPaddle.current.dx = 0;
			}
		}

		//Attach event listener to window
		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("keyup", handleKeyup);

		return () => window.cancelAnimationFrame(animationID);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			style={{ border: 1 + "px solid black" }}
		/>
	);
}
export default Pong;
