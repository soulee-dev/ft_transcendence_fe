"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect, ChangeEvent, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { SocketContext } from "../../contexts/SocketContext";
import Modal from "react-modal";

type ChatData = {
  sent_by_id: number;
  id: number;
  message: string;
};

type UserData = {
  name: string;
  id: number;
};

type ChannelUsers = {
  channel_id: number;
  user_id: number;
  admin: boolean;
  id: number;
  name: string;
  status: string;
};

type ChannelData = {
  id: number;
  name: string;
};

interface PasswordModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  joinPassword: string;
  setJoinPassword: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onRequestClose,
  joinPassword,
  setJoinPassword,
  onSubmit,
}) => (
  <Modal
    isOpen={isOpen}
    ariaHideApp={false}
    onRequestClose={onRequestClose}
    contentLabel="비밀번호 입력"
  >
    <h2>비밀번호를 입력해주세요</h2>
    <form onSubmit={onSubmit}>
      <input
        name="joinPassword"
        type="password"
        placeholder="비밀번호"
        value={joinPassword}
        onChange={(e) => setJoinPassword(e.target.value)}
      />
      <button type="submit">입력</button>
    </form>
    <button onClick={onRequestClose}>닫기</button>
  </Modal>
);

export default function Channels() {
  const [userData, setUserData] = useState({} as UserData);
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [privateModalIsOpen, setPrivateModalIsOpen] = useState(false);
  const [joinPassword, setJoinPassword] = useState("");
  const [privateChannelName, setPrivateChannelName] = useState<string>("");
  const [channelUsers, setChannelUsers] = useState<ChannelUsers[]>([]);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function openPrivateModal() {
    setPrivateModalIsOpen(true);
  }

  function closePrivateModal() {
    setPrivateModalIsOpen(false);
  }

  const fetchChannels = () => {
    fetchJoinedChannels();
    fetchPublicChannels();
  };

  const handlePrivatePasswordSubmit = (
    evnet: React.FormEvent<HTMLFormElement>
  ) => {
    evnet.preventDefault();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/join?name=${privateChannelName}&password=${joinPassword}`,
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
        closePrivateModal();
      })
      .catch((error) => {
        console.log(error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/${selectedChannel}/join?password=${joinPassword}`,
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
        closeModal();
      })
      .catch((error) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
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
        toast.error((error.response?.data as { message: string })?.message);
      });
  };

  const fetchPublicChannels = () => {
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
        toast.error((error.response?.data as { message: string })?.message);
      });
  };

  useEffect(() => {
    if (socket) {
      console.log("socket on");
      socket.on("notification", (message: any) => {
        console.log(message);
        toast.success(message.message);
        if (message.type == "PUBLIC_CHANNEL_CREATED") {
          fetchChannels();
        }
        if (message.type == "SENT_MESSAGE") {
          if (message.channelId == selectedChannel) {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_API_URL}/users/id/${message.userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${Cookies.get("access_token")}`,
                  },
                }
              )
              .then((userInfoResponse) => {
                setMessages((prev) => [
                  ...prev,
                  {
                    chat: message,
                    sender: userInfoResponse.data,
                  },
                ]);
              })
              .catch((error) => {
                console.error(error);
                toast.error(
                  (error.response?.data as { message: string })?.message
                );
              });
          }
        }
      });
    }

    return () => {
      if (socket) {
        console.log("socket off");
        socket.off("notification");
      }
    };
  }, [socket, selectedChannel]);

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
        fetchChannels();
      })
      .catch((error) => {
        console.error("채팅방 생성 중 오류 발생:", error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  };

  useEffect(() => {
    fetchChannels();
    const access_token = Cookies.get("access_token");

    axios
      .get<UserData>(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
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
        const fetchUserInfosPromises = data.map((chatData: ChatData) => {
          return axios
            .get(
              `${process.env.NEXT_PUBLIC_API_URL}/users/id/${chatData.sent_by_id}`,
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
              toast.error(
                (error.response?.data as { message: string })?.message
              );
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

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/${selectedChannel}/users`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
        // Store the channel users' data from the response in a map for easy lookup
        const channelUsersMap = new Map(
          response.data.map((user: any) => [user.user_id, user])
        );

        // Generate promises to fetch user information
        const fetchUserInfosPromises = response.data.map((userData: any) => {
          return axios
            .get(
              `${process.env.NEXT_PUBLIC_API_URL}/users/id/${userData.user_id}`,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
            .then((userInfoResponse) => {
              const userInfo = userInfoResponse.data;
              const isAdmin = (
                channelUsersMap.get(userData.user_id) as { admin: boolean }
              ).admin;
              return {
                ...userInfo,
                admin: isAdmin, // Add the admin property here
              };
            })
            .catch((error) => {
              console.error(error);
              toast.error(
                (error.response?.data as { message: string })?.message
              );
            });
        });
        return Promise.all(fetchUserInfosPromises);
      })
      .then((users) => {
        setChannelUsers(users);
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
        setMessages((prev) => [
          ...prev,
          {
            chat: response.data,
            sender: {
              id: response.data.sent_by_id,
              name: userData.name,
            },
          },
        ]);
      })
      .catch((error) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
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
        fetchChannels();
        setSelectedChannel(parseInt(channelId));
      })
      .catch((error) => {
        console.error(error);
        if (error.response?.status == 401) {
          setSelectedChannel(parseInt(channelId));
          openModal();
        } else {
          toast.error((error.response?.data as { message: string })?.message);
        }
      });
  };

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
        fetchChannels();
      })
      .catch((error) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  };

  const handleJoinPrivateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/join?name=${privateChannelName}&password=${password}`,
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
      })
      .catch((error) => {
        console.error(error);
        if (error.response?.status == 401) {
          openPrivateModal();
        } else {
          toast.error((error.response?.data as { message: string })?.message);
        }
      });
  };

  console.log(channelUsers);
  return (
    <div>
      <ToastContainer />
      <PasswordModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        joinPassword={joinPassword}
        setJoinPassword={setJoinPassword}
        onSubmit={handlePasswordSubmit}
      />
      <PasswordModal
        isOpen={privateModalIsOpen}
        onRequestClose={closePrivateModal}
        joinPassword={joinPassword}
        setJoinPassword={setJoinPassword}
        onSubmit={handlePrivatePasswordSubmit}
      />
      <div>
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
      <h1>비공개 채팅방 들어가기</h1>
      <form onSubmit={handleJoinPrivateSubmit}>
        <input
          type="text"
          value={privateChannelName}
          onChange={(e) => setPrivateChannelName(e.target.value)}
        ></input>
        <button>입장</button>
      </form>
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
      <h1>유저 목록</h1>
      <ul>
        {channelUsers &&
          channelUsers.length > 0 &&
          channelUsers.map((user) => (
            <li key={user.id}>
              <a href={`/profile/${user.name}`}>
                [{user.status}] {user.name} {user.admin ? "(관리자)" : ""}{" "}
              </a>
            </li>
          ))}
      </ul>
      <h1>메시지 목록</h1>
      <ul>
        {messages &&
          messages.length > 0 &&
          messages.map((message, index) => (
            <li key={index}>
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
