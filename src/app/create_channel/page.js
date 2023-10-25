"use client";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateChannel() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/friends`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        const data = response.data;

        const fetchUserInfosPromises = data.map((friendData) => {
          return axios
            .get(
              `${process.env.NEXT_PUBLIC_API_URL}/users/${friendData.friend_id}`,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
            .then((userInfoResponse) => userInfoResponse.data);
        });

        return Promise.all(fetchUserInfosPromises);
      })
      .then((usersData) => {
        setFriends(usersData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log(friends);
  return (
    <div>
      <h1>채팅방 생성하기</h1>
      <h1>친구 목록</h1>
      <ul>
        {friends &&
          friends.length > 0 &&
          friends.map((friend) => (
            <li key={friend.name}>
              <span>{friend.name}</span>
              <button onClick={() => handleFriendDelete(friend.name)}>
                추가하기
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
