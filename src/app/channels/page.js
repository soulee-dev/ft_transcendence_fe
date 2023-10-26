"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function Channels() {
  const [data, setData] = useState({});
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/channels/joined`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (selectedChannel === 0) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${selectedChannel}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        const fetchUserInfosPromises = data.map((chatData) => {
          return axios
            .get(
              `${process.env.NEXT_PUBLIC_API_URL}/users/${chatData.sent_by_id}`,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
            .then((userInfoResponse) => {
              return {
                chat: chatData,
                sender: userInfoResponse.data,
              };
            });
        });

        return Promise.all(fetchUserInfosPromises);
      })
      .then((userInfos) => {
        setMessages(userInfos);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedChannel]);

  const handleSelectChannel = (event) => {
    event.preventDefault();
    const channelId = event.target.value;
    setSelectedChannel(channelId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const access_token = Cookies.get("access_token");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${selectedChannel}`,
        {
          message: messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setMessageText("");
      })
      .catch((error) => {
        console.error(error);
      });
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
