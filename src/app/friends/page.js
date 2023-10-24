"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Friends() {
  const [friends, setFriends] = useState({});
  const [friendRequests, setFriendRequests] = useState([]);
  const [name, setName] = useState("");
  const notify = () => toast.success("Wow so easy!");

  const handleFriendRequest = (event) => {
    event.preventDefault();

    const access_token = Cookies.get("access_token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends/add?name=${name}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("친구 요청을 보냈습니다.");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
      });
  };

  const handleFriendRequestAccept = (requestId) => {
    const access_token = Cookies.get("access_token");

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/request/${requestId}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        toast.success("친구 요청을 승락했습니다.");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
      });
  };

  const handleFriendRequestReject = (requestId) => {
    const access_token = Cookies.get("access_token");

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/request/${requestId}/decline`,
      { method: "POST", headers: { Authorization: `Bearer ${access_token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        toast.success("친구 요청을 거절했습니다.");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
      });
  };

  const handleFriendDelete = (name) => {
    const access_token = Cookies.get("access_token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends/delete/?name=${name}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("친구를 삭제했습니다.");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
      });
  };

  const handleCreateDM = (friendId) => {
    const access_token = Cookies.get("access_token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/channels/create/${friendId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("DM을 만들었습니다.");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);
      });
  };

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const fetchUserInfos = data.map((data) => {
          return fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${data.friend_id}`,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          ).then((res) => res.json());
        });
        return Promise.all(fetchUserInfos);
      })
      .then((usersData) => {
        setFriends(usersData);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const access_token = Cookies.get("access_token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends/requests`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((requests) => {
        const fetchUserInfos = requests.map((request) => {
          return fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${request.sender_id}`,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          )
            .then((res) => res.json())
            .then((userData) => {
              return {
                id: request.id,
                userData,
              };
            });
        });
        return Promise.all(fetchUserInfos);
      })
      .then((usersDataWithIds) => {
        setFriendRequests(usersDataWithIds);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <ToastContainer />
      <h1>친구 목록</h1>
      <ul>
        {friends &&
          friends.length > 0 &&
          friends.map((friend) => (
            <li key={friend.name}>
              <span>{friend.name}</span>
              <button onClick={() => handleFriendDelete(friend.name)}>
                삭제
              </button>
              <button onClick={() => handleCreateDM(friend.id)}>
                채팅 만들기
              </button>
            </li>
          ))}
      </ul>
      <h1>친구 요청 목록</h1>
      <ul>
        {friendRequests &&
          friendRequests.length > 0 &&
          friendRequests.map((friendRequest) => (
            <li key={friendRequest.userData.name}>
              <span>{friendRequest.userData.name}</span>
              <button
                onClick={() => handleFriendRequestAccept(friendRequest.id)}
              >
                수락
              </button>
              <button
                onClick={() => handleFriendRequestReject(friendRequest.id)}
              >
                거절
              </button>
            </li>
          ))}
      </ul>
      <h1>친구 요청</h1>
      <form onSubmit={handleFriendRequest}>
        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
