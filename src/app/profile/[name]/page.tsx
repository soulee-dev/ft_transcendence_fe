"use client";

import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

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
  const [recordData, setRecordData] = useState<any>(null);

  const router = useRouter();

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
        router.push("/profile");
      }
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [profile]);

  const fetchLadderData = () => {
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
  };

  const fetchRecordData = () => {
    const access_token = Cookies.get("access_token");

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/games/user/${profile.id}/record`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
        const records = response.data;
        // Map records to promises to fetch user profiles
        const userPromises = records.map((record: any) => {
          return Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/id/${record.player1_id}`, {
              headers: { Authorization: `Bearer ${access_token}` },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/id/${record.player2_id}`, {
              headers: { Authorization: `Bearer ${access_token}` },
            }),
          ]).then(([player1Response, player2Response]) => {
            return {
              ...record,
              player1: player1Response.data,
              player2: player2Response.data,
            };
          });
        });

        return Promise.all(userPromises);
      })
      .then((recordsWithUsers) => {
        setRecordData(recordsWithUsers);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data.message || "An error occurred");
      });
  };

  useEffect(() => {
    if (!profile) return;

    fetchLadderData();
    fetchRecordData();
  }, [profile]);

  const handleAddFriend = (name: string) => {
    const access_token = Cookies.get("access_token");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/add?name=${name}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response: AxiosResponse) => {
        toast.success("친구 추가에 성공했습니다!");
      })
      .catch((error: AxiosError) => {
        console.error(error);
        toast.error((error.response?.data as { message: string })?.message);
      });
  };

  return (
    <div>
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
          <h2>전적 </h2>
          <table>
            <thead>
              <tr>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {recordData &&
                recordData.length > 0 &&
                recordData.map((record: any, index: number) => (
                  <tr key={index}>
                    <td>{record.player1.name}</td>
                    <td>{record.player2.name}</td>
                    <td>{`${record.score1}:${record.score2}`}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <button onClick={() => handleAddFriend(profile.name)}>
            친구 추가하기
          </button>
        </div>
      )}
    </div>
  );
}
