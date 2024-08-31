import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text } from "@chakra-ui/react";
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
  
  // State to toggle between Posts and Videos
  const [activeSection, setActiveSection] = useState("posts");

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log("Fetched posts data:", data);
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

  // Filter posts based on type
  const imageTextPosts = posts.filter(post => post.img || post.text); // Posts with image or text
  const videoPosts = posts.filter(post => post.video); // Posts with video

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
          borderBottom={activeSection === "videos" ? "1.5px solid white" : "1px solid gray"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          onClick={() => setActiveSection("videos")}
        >
          <Text fontWeight={"bold"}>Videos</Text>
        </Flex>
      </Flex>

      {activeSection === "posts" && (
        <>
          {!fetchingPosts && imageTextPosts.length === 0 && <h1>User has no image/text posts.</h1>}
          {fetchingPosts && (
            <Flex justifyContent={"center"} my={12}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          {imageTextPosts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </>
      )}

      {activeSection === "videos" && (
        <>
          {!fetchingPosts && videoPosts.length === 0 && <h1>User has no video posts.</h1>}
          {fetchingPosts && (
            <Flex justifyContent={"center"} my={12}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          {videoPosts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </>
      )}
    </>
  );
};

export default UserPage;
