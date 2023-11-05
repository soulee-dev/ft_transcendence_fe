"use client";

import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const LadderPage = () => {
  const [ladder, setLadder] = useState<string[]>([]);

  useEffect(() => {
    const access_token = Cookies.get("access_token");

    // Fetch player rank data, and fetch user data using userId
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/games/ladder`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res: AxiosResponse) => {
        const fetchUserInfosPromises = res.data.map((ladderData: any) => {
          return axios
            .get(
              `${process.env.NEXT_PUBLIC_API_URL}/users/id/${ladderData.userId}`,
              {
                headers: { Authorization: `Bearer ${access_token}` },
              }
            )
            .then((userInfoResponse) => {
              return {
                ladderData: ladderData,
                userData: userInfoResponse.data,
              };
            });
        });
        return Promise.all(fetchUserInfosPromises);
      })
      .then((usersData) => {
        setLadder(usersData);
      })
      .catch((error) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  }, []);

  return (
    // Render user rank using table format
    <div>
      <h1>랭킹</h1>
      <table>
        <thead>
          <tr>
            <th>순위</th>
            <th>이름</th>
            <th>승</th>
          </tr>
        </thead>
        <tbody>
          {ladder.map((ladderData: any, index: number) => (
            <tr key={ladderData.ladderData.userId}>
              <td>{ladderData.ladderData.rank}</td>
              <td>{ladderData.userData.name}</td>
              <td>{ladderData.ladderData.winCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LadderPage;
