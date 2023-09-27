import React, { useEffect, useRef} from 'react';

function Pong(props: any) {
	const ref = useRef<HTMLCanvasElement>(null);
	let isPlaying = true;
	let lastPressedKey = useRef("");
	//const [ball, setBall] = useState({ x: 200, y: 150, radius: 8, dx: 2, dy: 2 });
	const ballRef = useRef({
		x: 200,
		y: 150,
		radius: 8,
		dx: 0.1,
		dy: 0.1,
		color: "green",
	});
	// const [myPaddleRef.current, setMyPaddleRef.current] = useState({ x: 0, y: 100, width: 10, height: 100 });
	const myPaddleRef = useRef({ x: 0, y: 100, width: 10, height: 100, dy: 0 });
	const opponentPaddle = useRef({
		x: 390,
		y: 100,
		width: 10,
		height: 100,
		dy: 0,
	});

	// const [score, setScore] = useState({ player1: 0, player2: 0 });
	const scoreRef = useRef({ player1: 0, player2: 0 });
	const FPS = useRef(0);
	const lastTime = useRef(0);

	function draw(context: CanvasRenderingContext2D) {
		if (isPlaying) {
			context.clearRect(
				0,
				0,
				context.canvas.width,
				context.canvas.height
			);
			context.fillStyle = ballRef.current.color;
			context.beginPath();
			context.arc(
				ballRef.current.x,
				ballRef.current.y,
				ballRef.current.radius,
				0,
				Math.PI * 2
			);
			context.fill();
			ballRef.current.color = "green";

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
				100,
				20
			);
			context.font = "10px Arial";
			context.fillText("FPS: " + FPS.current, 340, 20);
		}
	}

	function update(deltaTime: number) {
		//update ball position
		// let updatedBall = { ...ballRef.current};
		const CollisionwithPaddle = (ball: any) => {
			if (
				ball.x - ball.radius <
					myPaddleRef.current.x + myPaddleRef.current.width &&
				ball.y > myPaddleRef.current.y &&
				ball.y < myPaddleRef.current.y + myPaddleRef.current.height
			) {
				ball.dx = -ball.dx;
			}
			if (
				ball.x + ball.radius > opponentPaddle.current.x &&
				ball.y > opponentPaddle.current.y &&
				ball.y <
					opponentPaddle.current.y + opponentPaddle.current.height
			) {
				ball.dx = -ball.dx;
			}
		};
		CollisionwithPaddle(ballRef.current);

		const CollisionwithWall = (ball:any, canvas:any) => {
			if (ball.x + ball.radius > canvas.width) {
				ball.color = "red";
				scoreRef.current.player1 += 1;
				// ballRef.current.x = 200;
				// ballRef.current.y = 150;
				ball.dx = -ball.dx;
			} else if (ball.x - ball.radius < 0) {
				ball.color = "red";
				scoreRef.current.player2 += 1;
				// ballRef.current.x = 200;
				// ballRef.current.y = 150;
				ball.dx = -ball.dx;
			}
			if (
				ball.y + ball.radius > canvas.height ||
				ball.y - ball.radius < 0
			) {
				console.log(ball.y - ball.radius);
				ball.dy = -ball.dy;
			}
			if (
				scoreRef.current.player1 >= 5 ||
				scoreRef.current.player2 >= 5
			) {
				isPlaying = false;
				// window.cancelAnimationFrame(animationID);
			}
		};
		CollisionwithWall(ballRef.current, ref.current);
		if (deltaTime > 100) {
			console.log("dt : " + deltaTime);
		}
		ballRef.current.x += ballRef.current.dx * deltaTime;
		ballRef.current.y += ballRef.current.dy * deltaTime;
		myPaddleRef.current.y += myPaddleRef.current.dy;
		opponentPaddle.current.y += opponentPaddle.current.dy;
	}

	useEffect(() => {
		const canvas = ref.current!;
		const context = canvas.getContext("2d");

		let animationID: number;

		function renderer(time: number) {
			let worldTime = Math.floor(time);
			let deltaTime = worldTime - lastTime.current;
			lastTime.current = worldTime;
			if (deltaTime > 0) {
				FPS.current = Math.floor(1000 / deltaTime);
			}
			draw(context!);
			update(deltaTime);

			window.requestAnimationFrame(renderer);
		}
		animationID = window.requestAnimationFrame(renderer);

		function handleKeydown(e: KeyboardEvent) {
			lastPressedKey.current = e.key;
			switch (e.key) {
				case "ArrowUp":
					console.log("Pressed key : up");
					// myPaddleRef.current.y -= 10;
					myPaddleRef.current.dy = -1;
					break;
				case "ArrowDown":
					console.log("Pressed key : down");
					// myPaddleRef.current.y += 10;
					myPaddleRef.current.dy = 1;
					break;
				case "q":
					console.log("Pressed key : Q");
					opponentPaddle.current.dy = -1;
					break;
				case "a":
					console.log("Pressed key : A");
					opponentPaddle.current.dy = 1;
					break;
				default:
					break;
			}
		}

		function handleKeyup(e : KeyboardEvent) {
			console.log("Released key : " + e.key);
			if (lastPressedKey.current === e.key) {
				myPaddleRef.current.dy = 0;
				opponentPaddle.current.dy = 0;
			}
		}

		//Attach event listener to window
		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("keyup", handleKeyup);

		return () => window.cancelAnimationFrame(animationID);
	}, []);

	return (<canvas ref={ref} {...props} />);
}
export default Pong;