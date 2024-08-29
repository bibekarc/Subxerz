import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text, Box } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  
  // State to toggle between Posts and Replies
  const [activeSection, setActiveSection] = useState("posts");

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, user]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />

      <Flex w={"full"} mb={4}>
        <Flex
          flex={1}
          borderBottom={activeSection === "posts" ? "1.5px solid white" : "1px solid gray"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          onClick={() => setActiveSection("posts")}
        >
          <Text fontWeight={"bold"}>Posts</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={activeSection === "replies" ? "1.5px solid white" : "1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
          onClick={() => setActiveSection("replies")}
        >
          <Text fontWeight={"bold"}>Legacy</Text>
        </Flex>
      </Flex>

      {activeSection === "posts" && (
        <>
          {!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
          {fetchingPosts && (
            <Flex justifyContent={"center"} my={12}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          {posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </>
      )}

      {activeSection === "replies" && (
        <Box mt={4}>
          <Text fontSize={"sm"}>This feature will be available soon.</Text>
        </Box>
      )}
    </>
  );
};

export default UserPage;
