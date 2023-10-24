import { useState, useEffect, useRef } from "react";
import Engine from "../../game/Engine";
import GameMode from "../../game/GameMode";

const CANVAS_WIDTH: number = 502;
const CANVAS_HEIGHT: number = 727;

function Game() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const backgroundRef = useRef<HTMLCanvasElement | null>(null);
	const engineRef = useRef<Engine>(new Engine());
	const gameModeRef = useRef<GameMode>(new GameMode(engineRef.current));

	useEffect(() => {
		console.log("Game component mounted.");
		if (canvasRef.current) {
			const canvas = canvasRef.current!;
			engineRef.current.init(canvas, backgroundRef.current!);
			gameModeRef.current.startMatch();
		}
	}, [canvasRef]);

	return (
		<div className="Canvas">
			<canvas
				ref={backgroundRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{ backgroundColor: "gray" }}
				z-inlist={1}
			/>
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				z-index={2}
			/>
		</div>
	);
}
export default Game;
