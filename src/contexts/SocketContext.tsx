"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import { useNotification } from "@/contexts/NotificationContext";

export const SocketContext = createContext<{
  socket: Socket | null;
  inviteData: any; // Define a more specific type if possible
  isInviteModalOpen: boolean;
  inviteeUserName: string;
  handleInvite: (data: any) => void; // Update this function signature as needed
  closeInviteModal: () => void;
}>({
  socket: null,
  inviteData: null,
  isInviteModalOpen: false,
  inviteeUserName: "",
  handleInvite: () => {},
  closeInviteModal: () => {},
});


export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { dispatchNotificationEvent } = useNotification();
  const access_token = Cookies.get("access_token");
  const [inviteData, setInviteData] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteeUserName, setInviteeUserName] = useState("");

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
      console.log("Received notification:", message);
      if (message.type == "SENT_MESSAGE") {
        toast.success("새 메시지가 왔습니다: " + message.message);
      } else {
        toast.success(message.message);
      }

      if (message.type == "INVITE_CUSTOM_GAME") {
        setInviteData(message);
        setIsInviteModalOpen(true);

        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/users/id/${message.userId}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then((response) => {
            setInviteeUserName(response.data.name);
          })
          .catch((error) => {
            console.error(error);
            toast.error((error.response?.data as { message: string })?.message);
          });
      }
      dispatchNotificationEvent(message);
    });
    setSocket(newSocket);

    return () => {
      newSocket.emit("leaveNotificationChannel");
      newSocket.off("notification");
      newSocket.close();
    };
  }, [access_token, dispatchNotificationEvent]);

  const handleInvite = (data: any) => {
    setInviteData(data);
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        inviteData,
        isInviteModalOpen,
        inviteeUserName,
        handleInvite,
        closeInviteModal,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
