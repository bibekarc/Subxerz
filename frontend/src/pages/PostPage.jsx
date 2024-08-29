import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      setPosts([]); // Clear previous posts
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        console.log("Fetched post data:", data);

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // Set posts state with the fetched data
        setPosts(data); // Assuming data is an array of posts
        // Find the current post based on pid
        const post = data.find((post) => post._id === pid);
        setCurrentPost(post); // Set the current post state
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    if (!currentPost) {
      showToast("Error", "Post not found", "error");
      return;
    }

    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost)
    return (
      <Flex justifyContent={"center"} p={4}>
        <Text>No post found.</Text>
      </Flex>
    );

  return (
    <>
      <Flex mb={4} p={4} borderBottom={"1px solid"} borderColor={"gray.light"}>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={user.profilePic}
            size={"md"}
            name={user.username}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />

          <Flex alignItems={"center"}>
            <Text
              fontSize={"sm"}
              fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            >
              {user.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={2} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {currentPost.createdAt
              ? formatDistanceToNow(new Date(currentPost.createdAt))
              : "Unknown date"}{" "}
            ago
          </Text>

          {currentUser?._id === user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />
      <Text>Comments</Text>
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
    </>
  );
};

export default PostPage;
