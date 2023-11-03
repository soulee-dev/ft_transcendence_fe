"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const access_token = Cookies.get("access_token");

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      query: { token: access_token },
      withCredentials: true,
    });
    newSocket.emit("joinNotificationChannel", (response: any) => {
      console.log(
        "Server acknowledged joinNotificationChannel with response:",
        response
      );
    });
    setSocket(newSocket);

    return () => {
      newSocket.emit("leaveNotificationChannel");
      newSocket.close();
    };
  }, [access_token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
