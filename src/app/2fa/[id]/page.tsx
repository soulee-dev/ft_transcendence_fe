"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";

interface TwoFAProps {
  params: {
    id: string;
  };
}

interface ResponseData {
  redirectURI?: string;
}

export default function TwoFA({ params }: TwoFAProps) {
  const [code, setCode] = useState<string>("");

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
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
      .then((response: AxiosResponse<ResponseData>) => {
        console.log(response.data);
        if (response.data.redirectURI) {
          window.location.href = response.data.redirectURI;
        }
      })
      .catch((error: AxiosError) => {
        toast.error((error.response?.data as { message: string })?.message);
        console.error(error);
      });
  };

  return (
    <div>
      <ToastContainer />
      <h1>2FA</h1>
      <h1>userId: {params.id}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={code} onChange={handleCodeChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
