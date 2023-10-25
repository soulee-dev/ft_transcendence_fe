"use client";

import { useState } from "react";
import axios from "axios";

export default function TwoFA({ params }) {
  const [code, setCode] = useState("");

  const handleCodeChange = (event) => {
    event.preventDefault();
    setCode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}/auth/validate-otp`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      data: {
        userId: params.id,
        otp: code,
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.redirectURI) {
          window.location = response.data.redirectURI;
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>2FA</h1>
      <h1>userId: {params.id}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={code} onChange={handleCodeChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
