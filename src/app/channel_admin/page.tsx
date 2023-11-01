"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function ChannelAdmin() {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(0);

  const fetchChannels = () => {
    const access_token = Cookies.get("access_token");

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/channels/joined`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setChannels(res.data);
      })..;
  };

  return (
    <div>
      <h1>채널 목록</h1>
    </div>
  );
}
