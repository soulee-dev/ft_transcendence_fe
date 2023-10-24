"use client";

import { useState, useEffect, useRef } from "react";
import Game from "../../components/client/Game";
import Engine from "../../game/Engine";

const CANVAS_WIDTH: number = 502;
const CANVAS_HEIGHT: number = 727;

export default function GamePage() {
	const [start, setStart] = useState<boolean>(false);

	useEffect(() => {
		window.addEventListener("keydown", (e: KeyboardEvent) => {
			console.log("keydown", e.key);
			if (e.key === " ") {
				setStart(true);
			}
		});
	}, []);

	if (start) {
		return <Game />;
	} else {
		return <div>Press space to start game.</div>;
	}
}
