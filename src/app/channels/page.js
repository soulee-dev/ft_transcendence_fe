"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function Channels() {
  const [channels, setChannels] = useState({});
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [publicChannels, setPublicChannels] = useState([]);
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
  const handleCreateChannel = async () => {
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
        fetchChannels();
      })
      .catch((error) => {
        console.error("채팅방 생성 중 오류 발생:", error);
        toast.error(error.message);
      });
  };

  const fetchChannels = () => {
    const access_token = Cookies.get("access_token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/channels/joined`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setChannels(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  useEffect(() => {
    fetchChannels();
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
            })
            .catch((error) => {
              console.error(error);
              toast.error(error.message);
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
        toast.success("메시지를 전송했습니다.");
        setMessageText("");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  const handleSelectPublicChannel = (event) => {
    event.preventDefault();
    const channelId = event.target.value;

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/${channelId}/join?password=${password}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("채널에 참여했습니다.");
        fetchChannels();
        setSelectedChannel(channelId);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/channels`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      })
      .then((response) => {
        setPublicChannels(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  }, []);

  const handleLeaveChannel = (event) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/${event.target.value}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("채널에서 나갔습니다.");
        fetchChannels();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  console.log(publicChannels);
  return (
    <div>
      <ToastContainer />
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
        <button onClick={() => handleCreateChannel()}>채팅방 만들기</button>
      </div>
      <h1>공개 채팅방 목록</h1>
      {
        <ul>
          {publicChannels &&
            publicChannels.length > 0 &&
            publicChannels.map((channel) => (
              <li key={channel.id}>
                <button value={channel.id} onClick={handleSelectPublicChannel}>
                  {channel.name}
                </button>
              </li>
            ))}
        </ul>
      }
      <h1>채널 목록</h1>
      <h1>현재 선택된 채널: {selectedChannel}</h1>
      <ul>
        {channels &&
          channels.length > 0 &&
          channels.map((channel) => (
            <li key={channel.id}>
              <button value={channel.id} onClick={handleSelectChannel}>
                {channel.name}
              </button>
              <button value={channel.id} onClick={handleLeaveChannel}>
                나가기
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
