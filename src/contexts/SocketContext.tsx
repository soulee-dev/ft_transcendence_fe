"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";

interface SocketContextProps {
  on: any;
  off: any;
  emit: any;
}

export const SocketContext = createContext<SocketContextProps | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketContextProps | null>(null);
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
