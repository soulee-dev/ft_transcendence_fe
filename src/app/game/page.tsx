"use client";

import { useState, useEffect, useRef } from "react";
import Game from "../../components/client/Game";
import socketIOClient, { Socket } from "socket.io-client";
import axios from "axios";

const CANVAS_WIDTH: number = 502;
const CANVAS_HEIGHT: number = 727;

let socket: Socket;

function SelectGameMode(props: any) {
	return (
		<div>
			<button
				onClick={() => {
					axios.get(`${process.env.NEXT_PUBLIC_API_URL}/game/start`);
				}}
			>
				Game Start
			</button>
			<button>Custom Game</button>
			<button
				onClick={(event) => {
					event.preventDefault();
					props.onChangeMode();
				}}
			>
				일단 하기
			</button>
		</div>
	);
}

export default function GamePage() {
	const [start, setStart] = useState<boolean>(false);

	function handleConnection() {
		socket = socketIOClient();
		socket.on("start", () => {
			console.log("start event received");
			setStart(true);
		});
	}

	if (start) {
		return <Game socket={socket} />;
	} else {
		return (
			<SelectGameMode
				onChangeMode={() => {
					handleConnection();
				}}
			></SelectGameMode>
		);
	}
	// socket = socketIOClient(SOCKET_URL);
	// socket.on("start", () => {
	// 	console.log("start event received");
	// 	setStart(true);
	// });
	return <Game socket={socket} />;
}
