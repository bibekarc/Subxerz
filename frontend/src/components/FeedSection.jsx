import { useEffect, useState, useRef } from "react";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import Post from "./Post";
import SuggestedUsers from "./SuggestedUsers";
import CreatePostForm from "./CreatePostForm";
import useShowToast from "../hooks/useShowToast";
import TypewriterPlaceholder from "./TypewriterPlaceholder";

const FeedSection = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const videoRefs = useRef([]);
  const observerRef = useRef(null);

  const borderColor = useColorModeValue("gray.600", "gray.300");
  const backgroundColor = useColorModeValue("#ffffff", "#010c0c");
  const textColor = useColorModeValue("gray.800", "gray.400");
  const caretColor = useColorModeValue("gray.800", "gray.100");

  // Function to fetch posts
  const fetchPosts = async (pageNumber) => {
    setIsFetchingMore(true);
    try {
      const res = await fetch(`/api/posts/feed?page=${pageNumber}&limit=10`);
      if (!res.ok) {
        const error = await res.json();
        showToast("Error", error.message || "Failed to fetch posts", "error");
        return;
      }
      const data = await res.json();

      // Append new posts to the existing posts without duplicating
      if (pageNumber === 1) {
        setPosts(data.posts); // First page, reset posts
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]); // Append new posts
      }

      // Check if there are fewer than 10 posts, meaning no more pages
      if (data.posts.length < 10) setHasMorePosts(false);
    } catch (error) {
      showToast("Error", error.message || "Failed to fetch posts", "error");
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Load initial posts when component mounts
  useEffect(() => {
    fetchPosts(1); // Initial page load
  }, []);

  // Observe the last post and load more when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMorePosts && !isFetchingMore) {
          setPage((prevPage) => prevPage + 1); // Trigger page increment when last post is visible
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [isFetchingMore, hasMorePosts]);

  // Fetch new posts whenever page changes
  useEffect(() => {
    if (page > 1) fetchPosts(page);
  }, [page]);

  // Video autoplay logic when posts are in the viewport
  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) video.play();
          else video.pause();
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) videoObserver.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) videoObserver.unobserve(video);
      });
    };
  }, [posts]);

  return (
    <Box flex={70} mb={40}>
      {!loading && posts.length === 0 && !user ? (
        <>
          <Text mb={4} fontWeight="bold">
            Follow some users to see the feed
          </Text>
          <SuggestedUsers />
        </>
      ) : (
        <>
          {loading && posts.length === 0 ? (
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
                  videoRef={(el) => (videoRefs.current[index] = el)}
                />
              ))}

              {isFetchingMore && (
                <Flex justify="center" mt={4}>
                  <Spinner size="lg" />
                </Flex>
              )}

              {hasMorePosts && <div ref={observerRef} />} {/* Last post observer */}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default FeedSection;
