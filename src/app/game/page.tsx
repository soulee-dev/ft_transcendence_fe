"use client";

import { useState, useEffect, useRef } from "react";
import Game from "../../components/client/Game";
import socketIOClient, { Socket } from "socket.io-client";

const CANVAS_WIDTH: number = 502;
const CANVAS_HEIGHT: number = 727;
const SOCKET_URL = "http://localhost:5000";

let socket: Socket;

export default function GamePage() {
	const [start, setStart] = useState<boolean>(false);

	// const socket: any | null = useRef(null);

	function handleConnection() {
		socket = socketIOClient(SOCKET_URL);
		socket.on("start", () => {
			console.log("start event received");
			setStart(true);
		});
	}

	if (start) {
		console.log(socket);
		return <Game socket={socket} />;
	} else {
		return <div onClick={handleConnection}>게임 시작</div>;
	}
}
