import { useState } from "react";

export const useProfilePicture = () => {
  const [mutation, setMutation] = useState({
    isError: false,
    isSuccess: false,
    status: "uninitialized",
    isLoading: false,
    error: undefined,
    data: undefined,
  });

  const query = (body) => {
    const options = {
      method: "POST",
      credentials: "include",
      body: body,
    };
    setMutation((prev) => ({
      ...prev,
      status: "initialized",
      isLoading: true,
    }));
    fetch("/app/user/updateAvatar", options)
      .then((res) => res.json())
      .then((data) => {
        setMutation({
          status: "resolved",
          isLoading: false,
          isSuccess: true,
          isError: false,
          error: undefined,
          data: data,
        });
      })
      .catch((err) =>
        setMutation({
          status: "rejected",
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: err,
          data: undefined,
        })
      );
    setMutation((prev) => ({
      ...prev,
      status: "pending",
      isLoading: true,
    }));
  };

  return [query, mutation];
};
