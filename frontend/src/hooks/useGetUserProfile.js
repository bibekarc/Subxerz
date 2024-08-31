import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    if (!username) {
      showToast("Error", "Username is missing", "error");
      setLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          setUser(null); // Ensure user state is reset
        } else if (data.isFrozen) {
          showToast("Warning", "User is frozen", "warning"); // Optional: Inform user about being frozen
          setUser(null);
        } else {
          setUser(data);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
        console.error("Error fetching user profile:", error); // Add detailed error logging
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUserProfile;
