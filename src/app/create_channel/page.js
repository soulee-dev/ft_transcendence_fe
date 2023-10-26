"use client";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

export default function CreateChannel() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userList, setUserList] = useState([]);
  const selectOption = ["PUBLIC", "PRIVATE"];
  const [selected, setSelected] = useState(selectOption[0]);

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  const addUser = () => {
    if (userName) {
      setUserList((prev) => [...prev, userName]);
      setUserName("");
    }
  };
  const createChannel = async () => {
    const access_token = Cookies.get("access_token");

    const payload = {
      name: name,
      password: password,
      option: selected,
      users: userList,
    };
    if (!password) payload.password = ""; // password가 있을 때만 payload에 추가

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/channels/create`, payload, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        toast.success("채널이 생성되었습니다.");
      })
      .catch((error) => {
        console.error("채팅방 생성 중 오류 발생:", error);
        toast.error(error.message);
      });
  };

  return (
    <div>
      <ToastContainer />
      <h1>채팅방 생성하기</h1>
      <input
        name="name"
        type="text"
        placeholder="채팅방 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <select onChange={handleSelect} value={selected}>
        {selectOption.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <br />
      <input
        name="userName"
        type="text"
        placeholder="추가할 유저 이름"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={addUser}>유저 추가하기</button>
      <ul>
        {userList.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
      <button onClick={() => createChannel()}>채팅방 만들기</button>
    </div>
  );
}
