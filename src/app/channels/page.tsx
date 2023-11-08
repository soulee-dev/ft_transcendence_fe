"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect, ChangeEvent, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { SocketContext } from "../../contexts/SocketContext";
import PasswordModal from "../../components/PasswordModal";
import InviteModal from "@/components/InviteModal";
import { useRouter } from "next/navigation";

interface ChatData {
  sent_by_id: number;
  id: number;
  message: string;
}

interface UserData {
  name: string;
  id: number;
  status: string;
}

interface ChannelUsers {
  channel_id: number;
  user_id: number;
  admin: boolean;
  owner: boolean;
  id: number;
  name: string;
  status: string;
}

interface ChannelData {
  id: number;
  name: string;
}

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
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({} as any);
  const [inviteeUserName, setInviteeUserName] = useState("");

  const router = useRouter();

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
        setPrivateModalIsOpen(false);
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
        setModalIsOpen(false);
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
        if (message.type === "PUBLIC_CHANNEL_CREATED") {
          fetchChannels();
        }
        if (message.type === "INVITE_CUSTOM_GAME") {
          setInviteData(message);
          const access_token = Cookies.get("access_token");

          axios
            .get(
              `${process.env.NEXT_PUBLIC_API_URL}/users/id/${message.userId}`,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
            .then((response) => {
              setInviteeUserName(response.data.name);
            })
            .catch((error) => {
              console.error(error);
              toast.error(
                (error.response?.data as { message: string })?.message
              );
            });
          setIsInviteModalOpen(true);
        }
        if (message.type === "SENT_MESSAGE") {
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
        setUserList([]);
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
        const channelUsersMap = new Map(
          response.data.map((user: any) => [user.user_id, user])
        );

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
              const isOwner = (
                channelUsersMap.get(userData.user_id) as { owner: boolean }
              ).owner;
              return {
                ...userInfo,
                admin: isAdmin,
                owner: isOwner,
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
              status: userData.status,
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
          setModalIsOpen(true);
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
          setPrivateModalIsOpen(true);
        } else {
          toast.error((error.response?.data as { message: string })?.message);
        }
      });
  };

  const handleAcceptInvite = () => {
    toast.success(
      <>
        초대를 수락했습니다.
        <br />곧 게임을 시작합니다.
      </>
    );
    // redirect after 3 sconds
    router.push(`/game?roomId=${inviteData.channelId}`);
  };

  const handleRejectInvite = () => {
    if (!socket) return;
    socket.emit("declineInvite", inviteData.channelId);
    toast.success("초대를 거절했습니다.");
    setIsInviteModalOpen(false);
  };

  return (
    <div>
      <ToastContainer />
      <InviteModal
        isOpen={isInviteModalOpen}
        onReuqestClose={() => setIsInviteModalOpen(false)}
        handleAcceptInvite={handleAcceptInvite}
        handleRejectInvite={handleRejectInvite}
        inviteeUserName={inviteeUserName}
      />
      <PasswordModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        joinPassword={joinPassword}
        setJoinPassword={setJoinPassword}
        onSubmit={handlePasswordSubmit}
      />
      <PasswordModal
        isOpen={privateModalIsOpen}
        onRequestClose={() => setPrivateModalIsOpen(false)}
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
                [{user.status}] {user.name}{" "}
                {user.owner ? "(방장)" : user.admin ? "(관리자)" : ""}
              </a>
              {userData.id !== user.id && (
                <button>
                  <a href={`/game?userId=${user.id}`}>게임 초대</a>
                </button>
              )}
              {userData.id !== user.id && userData.status == "in_game" && (
                <button>
                  <a href={`/game?spectateUserId=${user.id}`}>게임 관전</a>
                </button>
              )}
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
