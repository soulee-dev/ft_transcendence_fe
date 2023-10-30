"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect, FormEvent } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError, AxiosResponse } from "axios";

interface ProfileProps {
  params: {
    name: string;
  };
}

export default function Profile({ params }: ProfileProps) {
  const [profile, setProfile] = useState<any>({});

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

  return (
    <div>
      <ToastContainer />
      <h1>Profile</h1>
      <img src={profile.profile_image} width={100} height={100} alt="profile" />
      <h2>이름: {profile.name}</h2>
      <h2>상태: {profile.status}</h2>
    </div>
  );
}
