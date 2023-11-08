"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect } from "react";

export default function ChannelAdmin() {
  const [adminChannels, setAdminChannels] = useState<any>([]);
  const [selectedChannel, setSelectedChannel] = useState(0);
  const [selectedChannelUsers, setSelectedChannelUsers] = useState<any>([]);
  const [channelName, setChannelName] = useState("");
  const [channelPassword, setChannelPassword] = useState("");
  const [mutedUsers, setMutedUsers] = useState<any>([]);
  const [banList, setBanList] = useState<any>([]);
  const [hasPassword, setHasPassword] = useState(false);

  useEffect(() => {
    fetchChnnelInfo();
  }, []);

  const fetchChnnelInfo = () => {
    const access_token = Cookies.get("access_token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/channels/adminChannelList`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setAdminChannels(response.data);
      })
      .catch((error) => {
        toast.error((error.response?.data as { message: string })?.message);
        console.error(error);
      });
  };

  const fetchChannelUsers = (channelId: number) => {
    const access_token = Cookies.get("access_token");
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
              return { channelData: userData, userData: userInfoResponse.data };
            });
        });
        return Promise.all(fetchUserInfosPromises);
      })
      .then((userInfos) => {
        setSelectedChannelUsers(userInfos);
      })
      .catch((error) => {
        toast.error((error.response?.data as { message: string })?.message);
        console.error(error);
      });
  };

  const fetchMutedUsers = (channelId: number) => {
    const access_token = Cookies.get("access_token");
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/${channelId}/muteList`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
        setMutedUsers(response.data);
      })
      .catch((error) => {
        toast.error((error.response?.data as { message: string })?.message);
        console.error(error);
      });
  };

  const fetchBanUsers = (channelId: number) => {
    const access_token = Cookies.get("access_token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/channels/${channelId}/banList`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setBanList(response.data);
      })
      .catch((error) => {
        toast.error((error.response?.data as { message: string })?.message);
        console.error(error);
      });
  };

  useEffect(() => {
    if (selectedChannel) {
      fetchChannelUsers(selectedChannel);
      fetchMutedUsers(selectedChannel);
      fetchBanUsers(selectedChannel);
    }
  }, [selectedChannel]);

  const handleAdminUser = (userId: number, userAction: string) => {
    const access_token = Cookies.get("access_token");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/channels/${selectedChannel}/admin`,
        {
          id: userId,
          action: userAction,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        toast.success("성공적으로 처리되었습니다.");
        fetchChannelUsers(selectedChannel);
        fetchMutedUsers(selectedChannel);
        fetchBanUsers(selectedChannel);
      })
      .catch((error) => {
        toast.error((error.response?.data as { message: string })?.message);
        console.error(error);
      });
  };

  const handleUpdateChannel = () => {
    const access_token = Cookies.get("access_token");
    let requestData: any = {};
    if (channelName !== "") requestData.name = channelName;
    if (channelPassword !== "") requestData.password = channelPassword;
    if (!hasPassword) requestData.password = "";

    if (Object.keys(requestData).length > 0) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/channels/${selectedChannel}/update`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(() => {
          toast.success("성공적으로 처리되었습니다.");
        })
        .catch((error) => {
          toast.error((error.response?.data as { message: string })?.message);
          console.error(error);
        });
    } else {
      toast.error("수정할 데이터를 입력해주세요.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>채팅방 관리ㅋㅋ</h1>
      <ul>
        {adminChannels.map((channel: any) => (
          <li key={channel.id}>
            <button onClick={() => setSelectedChannel(channel.id)}>
              {channel.name}
            </button>
          </li>
        ))}
      </ul>
      <h2>선택된 채팅방: {selectedChannel}</h2>
      {selectedChannel != 0 && (
        <div>
          <h2>채팅방 수정하기</h2>
          <input
            name="name"
            type="text"
            placeholder="채팅방 이름"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <br />
          비밀번호 여부
          <input
            name="isPassword"
            type="checkbox"
            checked={hasPassword}
            onChange={(e) => setHasPassword(e.target.checked)}
          />
          <br />
          {hasPassword && (
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={channelPassword}
              onChange={(e) => setChannelPassword(e.target.value)}
            />
          )}
          <br />
          <button onClick={handleUpdateChannel}>저장</button>
        </div>
      )}
      {selectedChannel != 0 && <h2>유저 목록</h2>}
      {
        <ul>
          {selectedChannelUsers.map((user: any) => (
            <li key={user.userData.name}>
              {user.userData.name} {user.channelData.admin ? "관리자" : ""}{" "}
              {user.channelData.owner ? "채널 주인" : ""}
              {!user.channelData.owner && (
                <>
                  <button
                    onClick={() => handleAdminUser(user.userData.id, "KICK")}
                  >
                    KICK
                  </button>
                  <button
                    onClick={() => handleAdminUser(user.userData.id, "BAN")}
                  >
                    BAN
                  </button>
                  <button
                    onClick={() => handleAdminUser(user.userData.id, "MUTE")}
                  >
                    MUTE
                  </button>
                  <button
                    onClick={() =>
                      handleAdminUser(user.userData.id, "GIVEADMIN")
                    }
                  >
                    GIVEADMIN
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      }
      <h2>Mute 목록</h2>
      <ul>
        {mutedUsers.map((user: any) => (
          <li key={user.name}>
            {user.name} {user.time}
          </li>
        ))}
      </ul>
      <h2>Ban 목록</h2>
      <ul>
        {banList.map((user: any) => (
          <li key={user.name}>
            {user.name}
            <button onClick={() => handleAdminUser(user.id, "UNBAN")}>
              UNBAN
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
