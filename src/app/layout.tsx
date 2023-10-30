"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import LeftSide from "../components/server/LeftSide";
import RightSide from "../components/server/RightSide";
import TopNavigator from "../components/server/TopNavigator";
import { SocketProvider } from "../contexts/SocketContext";
import Cookies from "js-cookie";
import { useState, useEffect, useContext } from "react";

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
