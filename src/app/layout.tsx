"use client";

// import "./globals.css";
import { Inter } from "next/font/google";
import LeftSide from "../components/server/LeftSide";
import RightSide from "../components/server/RightSide";
import TopNavigator from "../components/server/TopNavigator";
import { SocketProvider } from "../contexts/SocketContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import { parseJWT } from "../utils/jwt";
import { redirect, usePathname } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageName = usePathname().split("/")[1];
  const [accessToken, setAccessToken] = useState({
    raw: "",
    sub: "",
    is_2fa: false,
  });

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (!access_token) return;
    setAccessToken({
      raw: access_token,
      sub: parseJWT(access_token)?.payload?.sub ?? "",
      is_2fa: parseJWT(access_token)?.payload?.["2fa"] ?? true,
    });
  }, []);

  useEffect(() => {
    const updateOnlineStatus = () => {
      if (!accessToken.raw || !accessToken.is_2fa) return;
      console.log("online");
      const userData = {
        status: "online",
      };
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken.raw}`,
          },
        }
      );
    };

    const updateOfflineStatus = () => {
      if (!accessToken.raw || !accessToken.is_2fa) return;
      console.log("offline");
      const userData = {
        status: "offline",
      };
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/update`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken.raw}`,
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
  }, [accessToken]);

  if (accessToken.raw && pageName != "2fa" && !accessToken.is_2fa)
    redirect(`/2fa/${accessToken.sub}`);

  return (
    <html lang="en">
      <body className={inter.className}>
        {accessToken.raw ? (
          <NotificationProvider>
            <SocketProvider>
              <ToastContainer />
              <TopNavigator />
              <div className="main">
                <LeftSide />
                <div className="center">{children}</div>
                <RightSide />
              </div>
            </SocketProvider>
          </NotificationProvider>
        ) : (
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth`}>로그인 하기</a>
        )}
      </body>
    </html>
  );
}
