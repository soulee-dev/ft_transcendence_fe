"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import LeftSide from "../components/server/LeftSide";
import RightSide from "../components/server/RightSide";
import TopNavigator from "../components/server/TopNavigator";
import { SocketProvider } from "../contexts/SocketContext";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [access_token, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    const access_token = Cookies.get("access_token");
    setAccessToken(access_token || null);
  }, []);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const access_token = Cookies.get("access_token");
      if (!access_token) return;
      console.log("online");
      const userData = {
        status: "online",
      };
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    };

    const updateOfflineStatus = () => {
      const access_token = Cookies.get("access_token");
      if (!access_token) return;
      console.log("offline");
      const userData = {
        status: "offline",
      };
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOfflineStatus);
    window.addEventListener("beforeunload", updateOfflineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOfflineStatus);
      window.removeEventListener("beforeunload", updateOfflineStatus);
    };
  }, [access_token]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {access_token ? (
          <SocketProvider>
            <TopNavigator />
            <div className="main">
              <LeftSide />
              <div className="center">{children}</div>
              <RightSide />
            </div>
          </SocketProvider>
        ) : (
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth`}>로그인 하기</a>
        )}
      </body>
    </html>
  );
}
