import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import SlideComponent from "./SlideComponent";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Fetch user data based on postedBy
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        if (!res.ok) throw new Error("Failed to fetch user profile");
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

    fetchUser();
  }, [postedBy, showToast]);

  // IntersectionObserver to handle video autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsAutoplay(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoRef]);

  // Handle video autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.loop = true;
      isAutoplay ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [isAutoplay]);

  // Handle post deletion
  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
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

  // Handle video click
  const handleVideoClick = (e) => {
    e.stopPropagation();
    navigate(`/${user?.username}/post/${post._id}`);
  };

  // Check if there is a valid image to display
  const hasValidImages = post.img && post.img.length > 0;

  return (
    <Flex mb={4} py={5} flexDirection="column">
      {/* Post header */}
      <Flex flexDirection="column" w="full" alignItems="center" gap={5} mb={5}>
        <Flex w="full" gap={5}>
          <Avatar
            size="md"
            name={user?.name || "User"}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user?.username}`);
            }}
          />
          <Flex justifyContent="space-between" w="full">
            <Flex w="full" alignItems="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user?.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} alt="Verified" />
            </Flex>
            <Flex gap={4} alignItems="center">
              <Text fontSize="xs" width={36} textAlign="right" color="gray.500">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === user?._id && (
                <DeleteIcon
                  size={20}
                  onClick={handleDeletePost}
                  cursor="pointer"
                />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* Post content */}
      <Flex flexDirection="column" gap={2} w="full">
        {/* Conditionally render images or gallery */}
        {hasValidImages && (
          <Box overflow="hidden" w="full" mb={3}>
            {post.img.length > 1 ? (
              <SlideComponent imgUrls={post.img} showCloseButton={false} />
            ) : (
              <Image src={post.img[0]} alt="Post image" w="full" />
            )}
          </Box>
        )}

        {/* Conditionally render video */}
        {post.video && (
          <Link to={`/${user?.username}/post/${post._id}`}>
            <Box
              borderRadius={1}
              overflow="hidden"
              w="full"
              h="auto"
              mb={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg="black"
            >
              <video
                ref={videoRef}
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  backgroundColor: "black",
                }}
                autoPlay={isAutoplay}
                loop
                onClick={handleVideoClick}
              >
                <source src={post.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          </Link>
        )}

        {/* Actions and other details */}
        <Flex gap={3} my={1} w="full" justifyContent="flex-start">
          <Actions post={post} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Post;
