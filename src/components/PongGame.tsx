import React, { useEffect, useRef, useState } from "react";
import { socketService } from "../tmp/SocketService";

interface Props {
	player: "A" | "B";
}

const PongGame: React.FC<Props> = ({ player }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ball, setBall] = useState({ x: 150, y: 100, dx: 2, dy: 2 });
	const [paddleA, setPaddleA] = useState({ y: 95, height: 30, width: 5 });
	const [paddleB, setPaddleB] = useState({
		y: 95,
		height: 30,
		width: 5,
		x: 285,
	});
	const [score, setScore] = useState({ playerA: 0, playerB: 0 });

	useEffect(() => {
		socketService.onMovePaddle((data) => {
			if (data.player === "A") {
				setPaddleA((prev) => ({ ...prev, y: data.y }));
			} else if (data.player === "B") {
				setPaddleB((prev) => ({ ...prev, y: data.y }));
			}
		});

		socketService.onMove((data) => {
			console.log("Received data:", data);
			setBall(data.ball);
			setScore(data.score);
		});
	}, []);

	const handleMove = (direction: "up" | "down") => {
		let newY = 0;

		if (direction === "up") {
			if (player === "A" && paddleA.y > 0) {
				newY = paddleA.y - 10;
				setPaddleA((prev) => ({ ...prev, y: newY }));
			} else if (player === "B" && paddleB.y > 0) {
				newY = paddleB.y - 10;
				setPaddleB((prev) => ({ ...prev, y: newY }));
			}
		} else if (direction === "down") {
			if (player === "A" && paddleA.y + paddleA.height < 200) {
				newY = paddleA.y + 10;
				setPaddleA((prev) => ({ ...prev, y: newY }));
			} else if (player === "B" && paddleB.y + paddleB.height < 200) {
				newY = paddleB.y + 10;
				setPaddleB((prev) => ({ ...prev, y: newY }));
			}
		}

		socketService.movePaddle({ player, y: newY });
	};

	const updateGameLogic = () => {
		let updatedBall = { ...ball };
		let updatedScore = { ...score };

		updatedBall.x += updatedBall.dx;
		updatedBall.y += updatedBall.dy;

		if (
			updatedBall.y + updatedBall.dy > 200 ||
			updatedBall.y + updatedBall.dy < 0
		) {
			updatedBall.dy = -updatedBall.dy;
		}

		if (updatedBall.x + updatedBall.dx > 300) {
			updatedBall.dx = -updatedBall.dx;
			updatedScore.playerA++;
		} else if (updatedBall.x - 10 < 0) {
			updatedBall.dx = -updatedBall.dx;
			updatedScore.playerB++;
		}

		if (
			updatedBall.x - 10 < paddleA.width + 10 &&
			updatedBall.y > paddleA.y &&
			updatedBall.y < paddleA.y + paddleA.height
		) {
			updatedBall.dx = -updatedBall.dx;
		}

		if (
			updatedBall.x + 10 > paddleB.x &&
			updatedBall.y > paddleB.y &&
			updatedBall.y < paddleB.y + paddleB.height
		) {
			updatedBall.dx = -updatedBall.dx;
		}

		setBall(updatedBall);
		setScore(updatedScore);
	};

	useEffect(() => {
		const canvas = canvasRef.current!;
		const ctx = canvas.getContext("2d")!;

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.beginPath();
			ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
			ctx.fillStyle = "white";
			ctx.fill();

			ctx.fillRect(10, paddleA.y, paddleA.width, paddleA.height);
			ctx.fillRect(paddleB.x, paddleB.y, paddleB.width, paddleB.height);
			ctx.font = "20px Arial";
			ctx.fillText(
				`Player A: ${score.playerA} | Player B: ${score.playerB}`,
				50,
				20
			);

			updateGameLogic();

			requestAnimationFrame(draw);
		};

		const frameId = requestAnimationFrame(draw);

		return () => cancelAnimationFrame(frameId);
	}, [ball, paddleA, paddleB, score]);

	return (
		<div>
			<canvas
				ref={canvasRef}
				width="300"
				height="200"
				style={{ background: "black" }}
			></canvas>
			<button onClick={() => handleMove("up")}>Up</button>
			<button onClick={() => handleMove("down")}>Down</button>
		</div>
	);
};

export default PongGame;
