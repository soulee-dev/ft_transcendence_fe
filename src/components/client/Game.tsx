import { useState, useEffect, useRef, useContext } from "react";
import Engine from "../../core/engine/Engine";
import { SocketContext } from "../../contexts/SocketContext";
import GameModeClient from "../../core/gameplay/GameModeClient";

const CANVAS_WIDTH: number = 502;
const CANVAS_HEIGHT: number = 727;

function Game() {
	const socket = useContext(SocketContext);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const backgroundRef = useRef<HTMLCanvasElement | null>(null);
	const engineRef = useRef<Engine>(new Engine());
	const gameModeRef = useRef<GameModeClient>(
		new GameModeClient(engineRef.current)
	);

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current!;
			const backgroundCtx = backgroundRef.current!.getContext("2d")!;
			backgroundCtx.strokeStyle = "white";
			backgroundCtx.setLineDash([10, 10]);
			backgroundCtx.beginPath();
			backgroundCtx.moveTo(0, CANVAS_HEIGHT / 2);
			backgroundCtx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
			backgroundCtx.stroke();
			engineRef.current.init(canvas, backgroundRef.current!);
			gameModeRef.current.startMatch();
		}

		return () => {
			gameModeRef.current.endMatch();
		};
	}, [canvasRef]);

	return (
		<div className="Canvas">
			<canvas
				ref={backgroundRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
				style={{ backgroundColor: "black" }}
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
