"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect, ChangeEvent, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { SocketContext } from "../../contexts/SocketContext";

type ChatData = {
  sent_by_id: number;
  id: number;
  message: string;
};

type UserData = {
  name: string;
  id: number;
};

type ChannelData = {
  id: number;
  name: string;
};

export default function () {
  const [joinedChannels, setJoinedChannels] = useState<ChannelData[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<number>(0);
  const [messages, setMessages] = useState<
    { chat: ChatData; sender: UserData }[]
  >([]);
  const [messageText, setMessageText] = useState<string>("");
  const [publicChannels, setPublicChannels] = useState<ChannelData[]>([]);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userList, setUserList] = useState<string[]>([]);
  const selectOption: string[] = ["PUBLIC", "PRIVATE"];
  const [selected, setSelected] = useState<string>(selectOption[0]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      console.log("socket on");
      socket.on("notification", (message: any) => {
        console.log(message);
        toast.success(message.message);
        if (
          message.type == "REQUESTED_FRIEND" ||
          message.type == "DELETED_FRIEND" ||
          message.type == "ACCEPTED_YOUR_REQ" ||
          message.type == "DECLINED_YOUR_REQ" ||
          message.type == "ADDED_TO_CHANNEL"
        ) {
        }
      });
    }

    return () => {
      if (socket) {
        console.log("socket off");
        socket.off("notification");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      joinedChannels.forEach((channel) => {
        console.log(`Joining channel socket ${channel.id}`);
        socket.emit("joinChannel", channel.id, (response: any) => {
          console.log(
            "Server acknowledged joinChannel with response:",
            response
          );
        });
      });
      socket.on("newMessage", (message: any) => {
        toast.success(`새로운 메시지가 도착했습니다. ${message}`);
        console.log(message);
      });
    }
    return () => {
      if (socket) {
        console.log("socket off channel notification");
        joinedChannels.forEach((channel) => {
          socket.off("joinChannel", channel.id);
        });
        socket.emit("logout");
      }
    };
  }, [socket, joinedChannels]);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
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
        fetchJoinedChannels();
      })
      .catch((error) => {
        console.error("채팅방 생성 중 오류 발생:", error);
        toast.error(error.message);
      });
  };

  const fetchJoinedChannels = () => {
    const access_token = Cookies.get("access_token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/channels/joined`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setJoinedChannels(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  useEffect(() => {
    fetchJoinedChannels();
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
        const fetchUserInfosPromises = data.map((chatData: ChatData) => {
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

  const handleSelectChannel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const channelId = event.currentTarget.value;
    setSelectedChannel(parseInt(channelId));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

  const handleSelectPublicChannel = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const channelId = event.currentTarget.value;

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
        fetchJoinedChannels();
        setSelectedChannel(parseInt(channelId));
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

  const handleLeaveChannel = (event: React.MouseEvent<HTMLButtonElement>) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/${event.currentTarget.value}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("채널에서 나갔습니다.");
        fetchJoinedChannels();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

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
        {joinedChannels &&
          joinedChannels.length > 0 &&
          joinedChannels.map((channel) => (
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button>전송</button>
      </form>
    </div>
  );
}
