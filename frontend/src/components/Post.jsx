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

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
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

    getUser();
  }, [postedBy, showToast]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAutoplay(true);
          } else {
            setIsAutoplay(false);
          }
        });
      },
      { threshold: 0.5 } // Adjust as needed for the center detection
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.loop = true;
      if (isAutoplay) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isAutoplay]);

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

  return (
    <Link to={`/${user?.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection="column" alignItems="center">
          <Avatar
            size="md"
            name={user?.name || "User"}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user?.username}`);
            }}
          />
          <Box w="1px" h="full" bg="gray.200" my={2} />
          <Box position="relative" w="full">
            {post.replies.length === 0 && <Text textAlign="center">🥱</Text>}
            {post.replies.map((reply, index) => (
              <Avatar
                key={index}
                size="xs"
                name={reply.username || "Reply User"}
                src={reply.userProfilePic || "/default-profile-pic.png"}
                position="absolute"
                top={index === 0 ? "0px" : "auto"}
                bottom={index === 1 ? "0px" : "auto"}
                left={index === 2 ? "4px" : "auto"}
                right={index === 1 ? "-5px" : "auto"}
                padding="2px"
              />
            ))}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection="column" gap={2}>
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
          <Text fontSize="sm">{post.text}</Text>
          {post.img && !post.video && (
            <Box
              borderRadius={6}
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
            >
              <Image src={post.img} alt="Post image" w="full" />
            </Box>
          )}
          {post.video && (
            <Box
              borderRadius={6}
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
            >
              <video ref={videoRef} width="100%" autoPlay={isAutoplay} loop>
                <source src={post.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
