"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useNotification } from "@/contexts/NotificationContext";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { dispatchNotificationEvent } = useNotification();
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

    newSocket.on("notification", (message: any) => {
      dispatchNotificationEvent(message);
    });
    setSocket(newSocket);

    return () => {
      newSocket.emit("leaveNotificationChannel");
      newSocket.off("notification");
      newSocket.close();
    };
  }, [access_token, dispatchNotificationEvent]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
