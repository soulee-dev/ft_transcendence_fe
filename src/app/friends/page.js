"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Friends() {
  const [friends, setFriends] = useState({});

  console.log(process.env.NEXT_PUBLIC_API_URL);
  //   useEffect(() => {
  //     const access_token = Cookies.get("access_token");
  //     fetch("http://");
  //   }, []);
}
