import { useState, useEffect } from "react";
import { Avatar } from "@chakra-ui/react";

import { supabaseClient } from "supabaseClient";

export function UserAvatar({ size = "md", avatarUrl = "" }) {
  const [userProfile, setUserProfile] = useState({
    name: "Loading...",
    avatarUrl: null,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user) {
        setUserProfile({
          name: user?.user_metadata?.full_name || "",
          avatarUrl: avatarUrl != "" ? avatarUrl : user?.user_metadata?.avatar_url || "",
        });
      }
    };

    fetchUserProfile();
  }, [avatarUrl]);

  return (
    <Avatar
      size={size}
      name={userProfile?.name}
      src={userProfile?.avatarUrl || ""}
      bgColor={"#D9D9D9"}
    />
  );
}
