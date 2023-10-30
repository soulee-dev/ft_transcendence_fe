"use client";

import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

function LeftSide() {
  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
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
