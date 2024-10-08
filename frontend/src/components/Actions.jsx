import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useState } from "react";

const MAX_TEXT_LENGTH = 100; // Maximum length of text before truncating

const Actions = ({ post }) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(
    Array.isArray(post.likes) && post.likes.includes(user?._id || "")
  );
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [isExpanded, setIsExpanded] = useState(false); // To control full-text toggle

  const showToast = useShowToast();
  const { isOpen, onClose } = useDisclosure();

  const handleLikeAndUnlike = async () => {
    if (!user) {
      return showToast(
        "Error",
        "You must be logged in to like a post",
        "error"
      );
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          const updatedLikes = liked
            ? p.likes.filter((id) => id !== user._id)
            : [...p.likes, user._id];
          return { ...p, likes: updatedLikes };
        }
        return p;
      });
      setPosts(updatedPosts);
      setLiked(!liked);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async () => {
    if (!user) {
      return showToast(
        "Error",
        "You must be logged in to reply to a post",
        "error"
      );
    }
    if (isReplying) return;
    setIsReplying(true);
    try {
      const res = await fetch(`/api/posts/reply/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });
      setPosts(updatedPosts);
      showToast("Success", "Reply posted successfully", "success");
      onClose();
      setReply("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  const toggleTextExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (post.text.length <= MAX_TEXT_LENGTH) {
      return <Text fontSize="sm">{post.text}</Text>;
    }

    return (
      <Text fontSize="sm">
        {isExpanded
          ? post.text
          : post.text.slice(0, MAX_TEXT_LENGTH) + "... "}
        <Text
          as="span"
          color="blue.500"
          cursor="pointer"
          fontWeight="bold"
          onClick={toggleTextExpand}
        >
          {isExpanded ? "Show less" : "See more"}
        </Text>
      </Text>
    );
  };

  return (
    <Flex flexDirection="column">
      {renderText()}
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : "currentColor"}
          fill={liked ? "rgb(237, 73, 86)" : "none"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={handleLikeAndUnlike}
          style={{
            transition: "transform 0.3s ease-in-out, color 0.3s ease-in-out",
            transform: liked ? "scale(1.2)" : "scale(1)",
          }}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <Link to={`/${user?.username}/post/${post._id}`}>
          <svg
            aria-label="Comment"
            color="currentColor"
            fill="none"
            height="20"
            role="img"
            viewBox="0 0 24 24"
            width="20"
          >
            <title>Comment</title>
            <path
              d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        </Link>
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {post.likes.length} likes
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {post.replies.length} replies
        </Text>
        {post.replies.length === 0 && <Text textAlign="center">🥱</Text>}
        {post.replies.map((reply, index) => (
          <Avatar
            key={index}
            size="xs"
            name={reply.username || "Reply User"}
            src={reply.userProfilePic || "/default-profile-pic.png"}
          />
        ))}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg="rgba(255, 255, 255, 0.1)" // Glassmorphism background
          backdropFilter="blur(10px)" // Glassmorphism effect
          borderRadius="md" // Rounded corners
          border="1px solid rgba(255, 255, 255, 0.2)" // Light border
          boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" // Soft shadow
        >
          <ModalHeader>Reply</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                placeholder="Reply goes here.."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              size={"sm"}
              mr={3}
              isLoading={isReplying}
              onClick={handleReply}
            >
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;
