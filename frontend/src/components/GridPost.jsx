import { Image, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const GridPost = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user) return null;

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Box
        borderRadius="sm" // Reduced rounding for the container
        overflow="hidden"
        bg="rgba(255, 255, 255, 0.1)" // Glass effect background
        backdropFilter="blur(10px)" // Glassmorphism effect
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        position="relative"
        cursor="pointer"
        mb={0} // Remove bottom margin
        p={0} // Remove padding
        transition="transform 0.3s, box-shadow 0.3s"
        _hover={{
          transform: "scale(1.02)",
          boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        {post.img && (
          <Image
            src={post.img}
            alt="Post image"
            width="100%"
            height="auto"
            objectFit="cover"
            borderRadius="0" // Ensure no rounding on image
          />
        )}
        {post.videoUrl && (
          <video
            src={post.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            controls // Add controls to debug
            style={{ width: "100%", height: "auto", borderRadius: "0" }} // Ensure no rounding on video
            onError={(e) => {
              console.error('Error loading video:', e);
              showToast("Error", "Failed to load video", "error");
            }}
          >
            Your browser does not support the video tag.
          </video>
        )}
        {currentUser?._id === user._id && (
          <Box
            position="absolute"
            top={2}
            right={2}
            background="rgba(0, 0, 0, 0.6)"
            borderRadius="full"
            p={1}
            cursor="pointer"
            onClick={handleDeletePost}
          >
            <DeleteIcon color="white" />
          </Box>
        )}
      </Box>
    </Link>
  );
};

export default GridPost;
