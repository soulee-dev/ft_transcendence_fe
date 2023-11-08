"use client";

// import "@/style/Game.css";
import { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "@/contexts/SocketContext";
import Player from "@/game/Player";
import { useSearchParams } from "next/navigation";
import Ball from "@/game/Ball";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import CustomGameModal from "@/components/CustomGameModal";

export default function Game() {
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const socket = useContext(SocketContext);
  const [isGameStarted, setGameStarted] = useState(false);
  const [playerNo, setPlayerNo] = useState(0);
  const [roomId, setRoomID] = useState(0);
  const [message, setMessage] = useState("");
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [ball, setBall] = useState<Ball | null>(null);
  const [isCustomGameModalOpen, setIsCustomGameModalOpen] = useState(false);

  const canvasRef = useRef(null);
  const params = useSearchParams();

  const userIdParam = params.get("userId");
  const roomIdParam = params.get("roomId");
  const spectateUserId = params.get("spectateUserId");

  useEffect(() => {
    if (!socket) return;

    socket.on("invitedPlayerHasArrived", () => {
      toast.success("상대방이 입장했습니다!");
      setIsCustomGameModalOpen(true);
    });

    // socket.on("거절 소켓")

    socket.on("playerNo", (newPlayerNo: number) => {
      setPlayerNo(newPlayerNo);
    });

    socket.on("startingGame", () => {
      setGameStarted(true);
      setMessage("게임이 곧 시작합니다!");
    });

    socket.on("startedGame", (room) => {
      setRoomID(room.id);
      setMessage("");

      const p1 = new Player(
        room.players[0].x,
        room.players[0].y,
        10,
        60,
        "red",
        0
      );
      const p2 = new Player(
        room.players[1].x,
        room.players[1].y,
        10,
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
      socket.off("invitedPlayerHasArrived");
      socket.off("playerNo");
      socket.off("startingGame");
      socket.off("startedGame");
      socket.off("updateGame");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    if (userIdParam) {
      socket.emit("custom", userIdParam);
      setGameStarted(true);
      setIsButtonVisible(false);
      setMessage("상대방을 기다리고 있습니다...");
    }

    if (roomIdParam) {
      socket.emit("acceptInvite", roomIdParam);
      setGameStarted(true);
      setIsButtonVisible(false);
      setMessage("방장을 기다리고 있습니다...");
    }

    if (spectateUserId) {
      socket.emit("joinAsSpectator", spectateUserId);
      setGameStarted(true);
      setIsButtonVisible(false);
      setMessage("게임을 기다리고 있습니다...");
    }

    socket.on("roomId", (roomId) => {
      console.log("roomId", parseInt(roomId));
      setRoomID(roomId);
    });

    return () => {
      socket.off("roomId");
    };
  }, [socket, userIdParam, roomIdParam, spectateUserId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("endGame", (room) => {
      setGameStarted(false);
      setMessage(
        `${
          room.winner === playerNo
            ? "이겼습니다! 3초 뒤 메인페이지로 돌아갑니다"
            : "졌습니다! 3초 뒤 메인페이지로 돌아갑니다"
        }`
      );
      socket.emit("leave", roomId);

      setTimeout(() => {
        const canvas = canvasRef.current as HTMLCanvasElement | null;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, 800, 500);
      }, 2000);

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    });

    return () => {
      console.log("disconnecting...");
      socket.off("endGame");
    };
  }, [socket, playerNo]);

  const onSubmitCustomGameSetting = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsCustomGameModalOpen(false);
    console.log(event.target);
    const speed = event.currentTarget.speed.value;

    if (socket && socket.connected) {
      socket.emit("setCustom", roomId, speed);
      console.log(`setCustom ${roomId} ${speed}`);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isGameStarted && socket) {
      if (event.key === "ArrowUp") {
        // player move up
        socket.emit("move", {
          roomID: roomId,
          playerNo: playerNo,
          direction: "up",
        });
      } else if (event.key === "ArrowDown") {
        // player move down
        socket.emit("move", {
          roomID: roomId,
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
      setMessage("다른 플레이어를 기다리는 중입니다...");
    } else {
      setMessage("화면을 새로고침하고 다시 시도해주세요...");
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
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

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
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameStarted, playerNo, roomId]);

  return (
    <div className="container">
      <ToastContainer />
      <CustomGameModal
        isOpen={isCustomGameModalOpen}
        onRequestClose={() => setIsCustomGameModalOpen(false)}
        onSubmit={onSubmitCustomGameSetting}
      />
      <h1 id="heading">PONG</h1>
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
