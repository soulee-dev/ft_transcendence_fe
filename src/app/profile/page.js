"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Profile() {
  const [name, setName] = useState("");
  const [data, setData] = useState({});

  const fetchUser = () => {
    const access_token = Cookies.get("access_token");
    fetch("http://localhost:3000/users/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => fetchUser(), []);

  const handleUpdate = (event) => {
    event.preventDefault();
    const access_token = Cookies.get("access_token");
    const userData = { name };
    fetch("http://localhost:3000/users/me/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchUser();
        console.log(data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <img src={data.profile_image} width={100} height={100}></img>
      <p>안녕하세요 {data.name}님!</p>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <button type="submit">저장하기</button>
      </form>
    </div>
  );
}
