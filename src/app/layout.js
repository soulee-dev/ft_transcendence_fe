import "./globals.css";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import LeftSide from "../components/server/LeftSide";
import RightSide from "../components/server/RightSide";
import TopNavigator from "../components/server/TopNavigator";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "42 Ping Pong",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  return (
    <html lang="en">
      <body className={inter.className}>
        {access_token ? (
          <>
            <TopNavigator />
            <div className="main">
              <LeftSide />
              <div className="center">{children}</div>
              <RightSide />
            </div>
          </>
        ) : (
          <a href="http://localhost:3000/auth">로그인 하기</a>
        )}
      </body>
    </html>
  );
}