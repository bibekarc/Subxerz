import { useEffect, useState, useRef } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "./Post";
import SuggestedUsers from "./SuggestedUsers";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const VideoSection = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setPosts([]);
      const url = "/api/posts/following";
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data.filter((post) => post.video)); // Filter out non-video posts
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [showToast, setPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Adjust the threshold as needed
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, [posts]);

  return (
    <Box flex={70}>
      {!user ? (
        <>
          <Text mb={4} fontWeight={"bold"}>
            Log in to see who you follow
          </Text>
          <SuggestedUsers />
        </>
      ) : (
        <>
          {loading ? (
            <Flex justify="center">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <>
              {posts.map((post, index) => (
                <Post
                  key={post._id}
                  post={post}
                  postedBy={post.postedBy}
                  videoRef={(el) => (videoRefs.current[index] = el)} // Pass video ref to Post component
                />
              ))}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default VideoSection;
