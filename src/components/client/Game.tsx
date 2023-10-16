"use client";

import { useState, useEffect, useRef } from "react";
import Engine from "../../app/game/Engine";

const CANVAS_WIDTH: number = 502;
const CANVAS_HEIGHT: number = 727;

function Game() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const engineRef = useRef<Engine>(new Engine());
	const [start, setStart] = useState<boolean>(false);

	console.log("canvaRef.current outside effect", canvasRef.current);

	useEffect(() => {
		console.log("canvaRef.current inside effect", canvasRef.current);
		if (start && canvasRef.current) {
			const canvas = canvasRef.current!;
			engineRef.current.init(canvas);
		}
	}, [start, canvasRef]);

	useEffect(() => {
		window.addEventListener("keydown", (e: KeyboardEvent) => {
			console.log("keydown", e.key);
			if (e.key === " ") {
				setStart(true);
			}
		});
	}, []);

	if (start) {
		return (
			<canvas
				// className="center"
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
			/>
		);
	} else {
		return <div>Press space to start game.</div>;
	}

	return (
		<canvas
			className="center"
			ref={canvasRef}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
		/>
	);
}
export default Game;
