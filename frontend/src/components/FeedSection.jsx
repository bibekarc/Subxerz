import { useEffect, useState, useRef } from "react";
import { Box, Flex, Spinner, Text, Divider, Modal, ModalOverlay, ModalContent, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import Post from "./Post";
import SuggestedUsers from "./SuggestedUsers";
import CreatePostForm from "./CreatePostForm";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import TypewriterPlaceholder from "./TypewriterPlaceholder";

const FeedSection = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const videoRefs = useRef([]);

  const borderColor = useColorModeValue("gray.600", "gray.300");
  const backgroundColor = useColorModeValue("#ffffff", "#010c0c");
  const textColor = useColorModeValue("gray.800", "gray.400");
  const caretColor = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setPosts([]);
      const url = "/api/posts/feed";
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
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
      {!loading && posts.length === 0 && !user ? (
        <>
          <Text mb={4} fontWeight={"bold"}>
            Follow some users to see the feed
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
              <TypewriterPlaceholder
                onOpen={onOpen}
                placeholderText="What's on your mind.."
                borderColor={borderColor}
                backgroundColor={backgroundColor}
                textColor={textColor}
                caretColor={caretColor}
              />
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <CreatePostForm isOpen={isOpen} onClose={onClose} />
                </ModalContent>
              </Modal>
              <Divider p={2} />
              <SuggestedUsers />
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

export default FeedSection;
