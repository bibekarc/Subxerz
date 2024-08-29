import React from 'react';
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.light"
        position="relative"
        cursor="pointer"
        mb={4}
        py={5}
        onClick={() => navigate(`/${user.username}/post/${post._id}`)}
      >
        {post.img && (
          <Image src={post.img} alt="Post image" />
        )}
        {currentUser?._id === user._id && (
          <Box
            position="absolute"
            top={2}
            right={2}
            background="rgba(0, 0, 0, 0.5)"
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
