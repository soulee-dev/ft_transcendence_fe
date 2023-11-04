"use client";

import "../../style/Game.css";
import { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../../contexts/SocketContext";
import Player from "../../game/Player";
import Ball from "../../game/Ball";

export default function Game() {
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const socket = useContext(SocketContext);
  const [isGameStarted, setGameStarted] = useState(false);
  const [playerNo, setPlayerNo] = useState(0);
  const [roomID, setRoomID] = useState(null);
  const [message, setMessage] = useState("");
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [ball, setBall] = useState<Ball | null>(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    socket.on("playerNo", (newPlayerNo: number) => {
      setPlayerNo(newPlayerNo);
    });

    socket.on("startingGame", () => {
      setGameStarted(true);
      setMessage("We are going to start the game...");
    });

    socket.on("startedGame", (room) => {
      setRoomID(room.id);
      setMessage("");

      const p1 = new Player(
        room.players[0].x,
        room.players[0].y,
        20,
        60,
        "red",
        0
      );
      const p2 = new Player(
        room.players[1].x,
        room.players[1].y,
        20,
        60,
        "blue",
        0
      );
      const newBall = new Ball(room.ball.x, room.ball.y, 10, "white");

      p1.score = room.players[0].score;
      p2.score = room.players[1].score;

      setPlayer1(p1);
      setPlayer2(p2);
      setBall(newBall);
    });

    socket.on("updateGame", (room) => {
      setPlayer1((prevPlayer1) => {
        if (!prevPlayer1) return null;

        return new Player(
          prevPlayer1.x,
          room.players[0].y,
          prevPlayer1.width,
          prevPlayer1.height,
          prevPlayer1.color,
          room.players[0].score
        );
      });

      setPlayer2((prevPlayer2) => {
        if (!prevPlayer2) return null;

        return new Player(
          prevPlayer2.x,
          room.players[1].y,
          prevPlayer2.width,
          prevPlayer2.height,
          prevPlayer2.color,
          room.players[1].score
        );
      });

      setBall((prevBall) => {
        if (!prevBall) return null;

        return new Ball(
          room.ball.x,
          room.ball.y,
          prevBall.radius,
          prevBall.color
        );
      });
    });

    //   Clean up on unmount
    return () => {
      console.log("disconnecting...");
      socket.off("playerNo");
      socket.off("startingGame");
      socket.off("startedGame");
      socket.off("updateGame");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("endGame", (room) => {
      setGameStarted(false);
      console.log(room.winner, playerNo);
      setMessage(
        `${room.winner === playerNo ? "You are Winner!" : "You are Loser!"}`
      );
      socket.emit("leave", roomID);

      setTimeout(() => {
        const canvas = canvasRef.current as HTMLCanvasElement | null;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, 800, 500);
      }, 2000);
    });

    return () => {
      console.log("disconnecting...");
      socket.off("endGame");
    };
  }, [socket, playerNo]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isGameStarted && socket) {
      if (event.keyCode === 38) {
        // player move up
        socket.emit("move", {
          roomID: roomID,
          playerNo: playerNo,
          direction: "up",
        });
      } else if (event.keyCode === 40) {
        // player move down
        socket.emit("move", {
          roomID: roomID,
          playerNo: playerNo,
          direction: "down",
        });
      }
    }
  };

  const startGame = () => {
    if (socket && socket.connected) {
      setIsButtonVisible(false);
      socket.emit("join");
      setMessage("Waiting for other player...");
    } else {
      setMessage("Refresh the page and try again...");
    }
  };

  // Draw function to render canvas
  const draw = () => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the entire canvas to start a new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up the styles for the center line
    ctx.strokeStyle = "white";
    ctx.setLineDash([10, 10]); // This creates a dashed line pattern
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0); // Start at the top center of the canvas
    ctx.lineTo(canvas.width / 2, canvas.height); // Draw a line to the bottom center of the canvas
    ctx.stroke();

    // Draw the players and ball using their draw methods
    // Note: We're checking if player1, player2, and ball are initialized before calling draw
    player1?.draw(ctx);
    player2?.draw(ctx);
    ball?.draw(ctx);

    // Draw scores or any other UI elements here
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(400, 5);
    ctx.lineTo(400, 495);
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [player1, player2, ball]);

  useEffect(() => {
    // Attach event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Detach event listener on cleanup
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameStarted, playerNo, roomID]);

  return (
    <div className="container">
      <h1 id="heading">PING PONG</h1>
      <div className="game">
        <canvas id="canvas" ref={canvasRef} width="800" height="500"></canvas>
        <p id="message"> {message}</p>
        {isButtonVisible && (
          <button id="startBtn" onClick={startGame}>
            START GAME
          </button>
        )}
      </div>
    </div>
  );
}
