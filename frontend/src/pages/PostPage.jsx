import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Input,
  Spinner,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import SlideComponent from "../components/SlideComponent";
import { ArrowBackIcon } from "@chakra-ui/icons";

const PostPage = () => {
  const { user, loading: userLoading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(null);
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const { colorMode } = useColorMode(); // For handling light and dark modes

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setPosts(data);
        const post = data.find((post) => post._id === pid);
        setCurrentPost(post);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    getPost();
  }, [pid, showToast, setPosts]);

  const handleReply = async () => {
    if (!user) {
      return showToast("Error", "You must be logged in to reply to a post", "error");
    }
    if (isReplying) return;
    setIsReplying(true);
    try {
      const res = await fetch(`/api/posts/reply/${currentPost._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      const updatedPosts = posts.map((p) => {
        if (p._id === currentPost._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });
      setPosts(updatedPosts);
      showToast("Success", "Reply posted successfully", "success");
      setReply("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  if (userLoading || !user) {
    return (
      <Flex justifyContent={"center"} p={4}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) {
    return (
      <Flex justifyContent={"center"} p={4}>
        <Text>No post found.</Text>
      </Flex>
    );
  }

  const hasValidImages = currentPost.img && currentPost.img.length > 0;

  return (
    <Flex direction="column" p={4} overflow="hidden">
      <Flex mb={4} p={4} alignItems="center">
        <ArrowBackIcon
          boxSize={6}
          cursor="pointer"
          onClick={() => navigate("/")}
        />
        <Flex ml={4} alignItems="center">
          <Avatar
            size="md"
            name={user?.name || "User"}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user?.username}`);
            }}
          />
          <Flex alignItems={"center"}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user?.username}`);
              }}
            >
              {user?.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={2} />
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              width={36}
              textAlign={"right"}
              color={"gray.500"}
            >
              {currentPost.createdAt
                ? formatDistanceToNow(new Date(currentPost.createdAt))
                : "Unknown date"}{" "}
              ago
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {hasValidImages && (
        <Box overflow="hidden" w="full" mb={3}>
          {currentPost.img.length > 1 ? (
            <SlideComponent imgUrls={currentPost.img} showCloseButton={false} />
          ) : (
            <Image src={currentPost.img[0]} alt="Post image" w="full" />
          )}
        </Box>
      )}

      {currentPost.video && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.200"}
        >
          <video src={currentPost.video} controls width="100%" />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />
      <Text fontSize={"lg"} fontWeight={"bold"}>Comments</Text>
      <Box mb={12}>
      {currentPost.replies && currentPost.replies.length > 0 ? (
        currentPost.replies.map((reply) => (
          <Comment
            key={reply._id}
            reply={reply}
            lastReply={
              reply._id ===
              currentPost.replies[currentPost.replies.length - 1]._id
            }
          />
        ))
      ) : (
        <Flex justifyContent={"center"} p={4}>
          <Text>No comments yet.</Text>
        </Flex>
      )}
      </Box>

      {/* Fixed input area */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        p={4}
        maxW="container.sm" // Adjusted width
        mx="auto" // Center the box
        bg={colorMode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.6)"}
        borderTop="1px solid"
        borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
        boxShadow="md"
        borderRadius="md"
        backdropFilter="blur(10px)" // Glassmorphism effect
      >
        <Flex alignItems="center">
          <Avatar src={user?.profilePic} size="sm" />
          <Input
            ml={2}
            placeholder="Add a comment..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            borderRadius="md"
            variant="outline"
            borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
            _placeholder={{ color: colorMode === "light" ? "gray.500" : "gray.400" }}
          />
          <Button
            colorScheme="blue"
            size="sm"
            ml={2}
            isDisabled={!reply}
            onClick={handleReply}
            isLoading={isReplying}
          >
            Post
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default PostPage;
