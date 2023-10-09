import { useEffect, useRef } from "react";
import Engine from "../game/Engine";

const CANVAS_WIDTH: number = 504;
const CANVAS_HEIGHT: number = 724;

function Game() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const engineRef = useRef<Engine>(new Engine());

	useEffect(() => {
		const canvas = canvasRef.current!;
		engineRef.current.init(canvas);
		return;
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
export default Game;
