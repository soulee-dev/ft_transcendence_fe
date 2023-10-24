"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Channels() {
  const [data, setData] = useState({});
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/channels/joined`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (selectedChannel === 0) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${selectedChannel}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const fetchUserInfos = data.map((data) => {
          return fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${data.sent_by_id}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
            .then((res) => res.json())
            .then((userInfo) => {
              return {
                chat: data,
                sender: userInfo,
              };
            });
        });
        return Promise.all(fetchUserInfos);
      })
      .then((userInfos) => setMessages(userInfos))
      .catch((error) => console.error(error));
  }, [selectedChannel]);

  const handleSelectChannel = (event) => {
    event.preventDefault();
    const channelId = event.target.value;
    setSelectedChannel(channelId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const access_token = Cookies.get("access_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${selectedChannel}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessageText("");
      })
      .catch((error) => console.error(error));
  };

  console.log(messages);
  return (
    <div>
      <h1>채널 목록</h1>
      <h1>현재 선택된 채널: {selectedChannel}</h1>
      <ul>
        {data &&
          data.length > 0 &&
          data.map((channel) => (
            <li key={channel.id}>
              <button value={channel.id} onClick={handleSelectChannel}>
                {channel.name}
              </button>
            </li>
          ))}
      </ul>
      <h1>메시지 목록</h1>
      <ul>
        {messages &&
          messages.length > 0 &&
          messages.map((message) => (
            <li key={message.chat.id}>
              {message.sender.name}: {message.chat.message}
            </li>
          ))}
      </ul>
      <form>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button onClick={handleSubmit}>전송</button>
      </form>
    </div>
  );
}
