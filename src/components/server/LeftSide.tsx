"use client";

import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { parseJWT } from "../../utils/jwt";

function LeftSide() {
  const updateOfflineStatus = () => {
    const access_token = Cookies.get("access_token");

    if (!access_token) return;
    console.log("offline");
    const userData = {
      status: "offline",
    };
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/me/update`, userData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  };

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const is_2fa =
      parseJWT(Cookies.get("access_token") ?? "")?.payload?.["2fa"] ?? true;
    if (is_2fa) {
      updateOfflineStatus();
    }

    Cookies.remove("access_token");
    toast.success(
      <>
        로그아웃 되었습니다.
        <br />
        잠시 후 메인페이지로 이동합니다.
      </>
    );
    setTimeout(() => {
      location.href = "/";
    }, 1000);
  };

  return (
    <div className="leftSide">
      <ToastContainer />
      <ul>
        <li>
          <Link href="/edit_profile">마이페이지</Link>
        </li>
        <li>
          <Link href="/profile">프로필</Link>
        </li>
        <li>
          <Link href="/channels">채팅방</Link>
        </li>
        <li>
          <Link href="/game">게임</Link>
        </li>
        <li>
          <Link href="/friends">친구</Link>
        </li>
        <li>
          <Link href="/block">차단</Link>
        </li>
        <li>
          <a href="/" onClick={handleLogout}>
            로그아웃
          </a>
        </li>
      </ul>
    </div>
  );
}

export default LeftSide;
