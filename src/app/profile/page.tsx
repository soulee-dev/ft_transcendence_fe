"use client";

import { useState } from "react";

export default function ProfileNoParam() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.location.href = `/profile/${username}`;
  };

  return (
    <div className="main">
      <h1>프로필 검색</h1>
      <form onSubmit={handleSubmit}>
        <label>사용자 이름</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">검색</button>
      </form>
    </div>
  );
}
