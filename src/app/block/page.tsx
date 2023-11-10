"use client";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError, AxiosResponse } from "axios";

export default function Block() {
  const [blockList, setBlockList] = useState<string[]>([]);
  const [block, setBlock] = useState<string>("");

  const fetchBlockList = () => {
    const access_token = Cookies.get("access_token");

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/blocked`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response: AxiosResponse) => {
        // fetch user info using user id
        const fetchUserInfosPromises = response.data.map((blockData: any) => {
          return axios
            .get(
              `${process.env.NEXT_PUBLIC_API_URL}/users/id/${blockData.user_id}`,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
            .then((userInfoResponse) => {
              return { blockData: blockData, userData: userInfoResponse.data };
            });
        });
        return Promise.all(fetchUserInfosPromises);
      })
      .then((usersData) => {
        setBlockList(usersData);
      })
      .catch((error: AxiosError) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  };

  useEffect(() => fetchBlockList(), []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const access_token = Cookies.get("access_token");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/blocked/add?name=${block}`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((response: AxiosResponse) => {
        toast.success("차단되었습니다.");
        fetchBlockList();
      })
      .catch((error: AxiosError) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  };

  const handleUnBlock = (id: string) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/blocked/${id}/delete`,
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
        }
      )
      .then((response: AxiosResponse) => {
        toast.success("차단이 해제되었습니다.");
        fetchBlockList();
      })
      .catch((error: AxiosError) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  };
  return (
    <div className="banPage">
      <h1>차단 목록</h1>
      <ul>
        {blockList &&
          blockList.length > 0 &&
          blockList.map((block: any, index) => (
            <li key={block.userData.name}>
              <span>{block.userData.name}</span>
              <button onClick={() => handleUnBlock(block.blockData.id)}>
                삭제
              </button>
            </li>
          ))}
      </ul>
      <h1>차단하기</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={block}
          onChange={(e) => setBlock(e.target.value)}
        />
        <button type="submit">차단</button>
      </form>
    </div>
  );
}
