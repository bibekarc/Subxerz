import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Spinner,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  useColorModeValue,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import CreatePost from "../components/CreatePost";
import CreatePostForm from "../components/CreatePostForm";
import TypewriterPlaceholder from "../components/TypewriterPlaceholder ";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeSection, setActiveSection] = useState("feed");

  const borderColor = useColorModeValue("gray.600", "gray.300");
  const backgroundColor = useColorModeValue("#ffffff", "#010c0c");
  const textColor = useColorModeValue("gray.800", "gray.400");
  const caretColor = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setPosts([]);
      const url =
        activeSection === "feed" ? "/api/posts/feed" : "/api/posts/following";
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
  }, [activeSection, showToast, setPosts]);

  const UnderlineButton = ({ label, isActive, onClick, borderColor }) => (
    <Button
      flex={1}
      variant="unstyled"
      onClick={onClick}
      _hover={{ borderBottom: "none" }}
      width="100px"
      mx="auto"
      borderRadius="0"
    >
      <Box
        as="span"
        display="inline-block"
        width="80px"
        borderBottom={isActive ? "3px solid" : "none"}
        borderColor={borderColor}
        mx="auto"
      >
        {label}
      </Box>
    </Button>
  );

  return (
    <Flex direction="column" gap="10" alignItems={"flex-start"}>
      <Flex w="full" mb={1}>
        <UnderlineButton
          label="Feed"
          isActive={activeSection === "feed"}
          onClick={() => setActiveSection("feed")}
          borderColor={borderColor}
        />
        <UnderlineButton
          label="Video"
          isActive={activeSection === "following"}
          onClick={() => setActiveSection("following")}
          borderColor={borderColor}
        />
      </Flex>

      <Box flex={70}>
        <CreatePost />
        {activeSection === "feed" && (
          <>
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
                    {posts.map((post) => (
                      <Post
                        key={post._id}
                        post={post}
                        postedBy={post.postedBy}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}

        {activeSection === "following" && (
          <>
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
                    {posts
                      .filter((post) => post.video) // Filter out non-video posts
                      .map((post) => (
                        <Post
                          key={post._id}
                          post={post}
                          postedBy={post.postedBy}
                        />
                      ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default HomePage;
