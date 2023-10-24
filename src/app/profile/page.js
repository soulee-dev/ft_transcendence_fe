"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [is2fa, setIs2fa] = useState(false);
  const [userData, setUserData] = useState({});

  const fetchUser = () => {
    const access_token = Cookies.get("access_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setIs2fa(data.is_2fa);
        setUserData(data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => fetchUser(), []);

  const handleUpdate = (event) => {
    event.preventDefault();
    const access_token = Cookies.get("access_token");
    const updateData = { name, email, is_2fa: is2fa };
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchUser();
      })
      .catch((error) => console.error(error));
  };
  return (
    <div>
      <img src={userData.profile_image} width={100} height={100}></img>
      <form onSubmit={handleUpdate}>
        <label htmlFor="name">이름</label>
        <br />
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <br />
        <label htmlFor="is_2fa">이차인증 여부</label>
        <br />
        <input
          type="checkbox"
          id="is_2fa"
          checked={is2fa}
          onChange={(e) => setIs2fa(e.target.checked)}
        />
        <br />
        <label htmlFor="email">이메일</label>
        <br />
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <button type="submit">저장하기</button>
      </form>
    </div>
  );
}
