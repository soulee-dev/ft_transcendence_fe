"use client";

import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useEffect, FormEvent } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError, AxiosResponse } from "axios";

interface UserData {
  name: string;
  email: string;
  is_2fa: boolean;
  profile_image: string;
}

export default function EditProfile() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [is2fa, setIs2fa] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    is_2fa: false,
    profile_image: "",
  });

  const params = useSearchParams();
  const newUserParam = params.get("newUser");

  const fetchUser = () => {
    const access_token = Cookies.get("access_token");

    axios
      .get<UserData>(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response: AxiosResponse<UserData>) => {
        const data = response.data;
        setName(data.name);
        setEmail(data.email);
        setIs2fa(data.is_2fa);
        setProfileImage(data.profile_image);
        setUserData(data);
      })
      .catch((error: AxiosError) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (newUserParam === "true") {
      toast.success(
        <>
          회원가입에 성공했습니다.
          <br />
          프로필을 꾸며보세요!
        </>
      );
    }
  }, [newUserParam]);

  useEffect(() => fetchUser(), []);

  const handleUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const access_token = Cookies.get("access_token");
    const updateData = {
      name,
      email,
      is_2fa: is2fa,
      profile_image: profileImage,
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/me/update`, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response: AxiosResponse) => {
        toast.success("프로필을 업데이트했습니다.");
        fetchUser();
      })
      .catch((error: AxiosError) => {
        console.error(error);
      });
  };

  return (
    <div>
      <img
        src={userData.profile_image}
        width={100}
        height={100}
        alt="Profile"
      />
      <form onSubmit={handleUpdate}>
        <label htmlFor="name">이름</label>
        <br />
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <br />
        <label htmlFor="is_2fa">이차인증 여부</label>
        <br />
        <input
          type="checkbox"
          id="is_2fa"
          checked={is2fa}
          onChange={(e) => setIs2fa(e.target.checked)}
        />
        <br />
        <label htmlFor="email">이메일</label>
        <br />
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="profile_image">프로필 이미지</label>
        <br />
        <input
          type="text"
          id="profile_image"
          value={profileImage}
          onChange={(e) => setProfileImage(e.target.value)}
        />

        <br />
        <button type="submit">저장하기</button>
      </form>
    </div>
  );
}
