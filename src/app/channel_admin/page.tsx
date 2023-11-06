"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect } from "react";

export default function ChannelAdmin() {
  const [userData, setUserDaa] = useState<any>({});
  const [adminChannels, setAdminChannels] = useState([]);

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setUserDaa(response.data);
        return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/channels/joined`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
      })
      .then((response) => {
        const channels = response.data;
        const adminOrOwnerChannels: any = [];

        channels.forEach((channel: any) => {
          axios
            .get(
              `${process.env.NEXT_PUBLIC_API_URL}/channels/${channel.id}/users`,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
            .then((userResponse) => {
              const userAdminOrOwner = userResponse.data.find(
                (user: any) =>
                  user.user_id === userData.id && (user.admin || user.owner)
              );

              console.log(userAdminOrOwner);

              if (userAdminOrOwner) {
                adminOrOwnerChannels.push(channel);
                setAdminChannels(adminOrOwnerChannels);
              }
            })
            .catch((error) => {
              toast.error(
                (error.response?.data as { message: string })?.message
              );
              console.error(error);
            });
        });
      })
      .catch((error) => {
        toast.error((error.response?.data as { message: string })?.message);
        console.error(error);
      });
  }, []);

  return (
    <div>
      <ToastContainer />
      <ul>
        {adminChannels.map((channel: any) => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul>
    </div>
  );
}
