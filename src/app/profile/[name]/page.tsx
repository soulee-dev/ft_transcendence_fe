"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect, FormEvent } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError, AxiosResponse } from "axios";
import { redirect } from "next/navigation";

interface ProfileProps {
  params: {
    name: string;
  };
}

interface LadderData {
  userId: number;
  winCount: number;
  rank: number;
}

export default function Profile({ params }: ProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [ladderData, setLadderData] = useState<LadderData>({
    userId: 0,
    winCount: 0,
    rank: 0,
  });

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/name/${params.name}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response: AxiosResponse) => {
        setProfile(response.data);
        console.log(response.data);
      })
      .catch((error: AxiosError) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  }, [params.name]);

  // redirect to /profile if there is no profile data after rendering after 5 second
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!profile) {
        window.location.href = "/profile";
      }
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [profile]);

  useEffect(() => {
    if (!profile) return;

    const access_token = Cookies.get("access_token");

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/games/ladder/${profile.id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response: AxiosResponse) => {
        setLadderData(response.data);
        console.log(response.data);
      })
      .catch((error: AxiosError) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  }, [profile]);

  return (
    <div>
      <ToastContainer />
      <h1>Profile</h1>
      {profile && (
        <div>
          <img
            src={profile.profile_image}
            width={100}
            height={100}
            alt="profile"
          />
          <h2>이름: {profile.name}</h2>
          <h2>상태: {profile.status}</h2>
          <h2>
            등수: {ladderData.rank === 0 ? "순위권 외 입니다" : ladderData.rank}
          </h2>
        </div>
      )}
    </div>
  );
}
