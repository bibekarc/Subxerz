import { useEffect, useState, useRef } from "react";
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
  const [activeSection, setActiveSection] = useState("posts");
  const [autoplayPostId, setAutoplayPostId] = useState(null);

  const postRefs = useRef([]);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.dataset.postId;
          if (entry.isIntersecting) {
            setAutoplayPostId(postId);
          }
        });
      },
      { threshold: 0.5 } // Adjust the threshold as needed
    );

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      postRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [posts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  const imageTextPosts = posts.filter(post => post.img || post.text);
  const videoPosts = posts.filter(post => post.video);

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
          {!fetchingPosts && imageTextPosts.length === 0 && <h1>No Posts</h1>}
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
          {!fetchingPosts && videoPosts.length === 0 && <h1>No Posts</h1>}
          {fetchingPosts && (
            <Flex justifyContent={"center"} my={12}>
              <Spinner size={"xl"} />
            </Flex>
          )}
          {videoPosts.map((post) => (
            <Post
              key={post._id}
              post={post}
              postedBy={post.postedBy}
              videoRef={(el) => (postRefs.current[post._id] = el)}
              autoplay={post._id === autoplayPostId}
            />
          ))}
        </>
      )}
    </>
  );
};

export default UserPage;
