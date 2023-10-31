import { useState, useEffect, useRef } from "react";
import Engine from "../../game/engine/Engine";
import GameModeClient from "../../game/gamemode/GameModeClient";

const CANVAS_WIDTH: number = 502;
const CANVAS_HEIGHT: number = 727;

function Game(props: any) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const backgroundRef = useRef<HTMLCanvasElement | null>(null);
	const engineRef = useRef<Engine>(new Engine());
	const gameModeRef = useRef<GameModeClient>(
		new GameModeClient(engineRef.current, props.socket)
	);

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
				z-index={1}
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
