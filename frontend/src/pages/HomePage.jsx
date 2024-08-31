import {
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";
import userAtom from "../atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 2200;

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const imageRef = useRef(null);
  const user = useRecoilValue(userAtom);
  const { username } = useParams();
  const { onClose } = useDisclosure();
  const [activeSection, setActiveSection] = useState("feed");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setPosts([]);
      const url = activeSection === "feed" ? "/api/posts/feed" : "/api/posts/following";
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
  

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });
  
      const data = await res.json();
      console.log("Server Response:", data); // Log server response for debugging
  
      if (res.ok) {
        showToast("Success", "Post created successfully", "success");
        if (username === user.username) {
          setPosts([data, ...posts]);
        }
        onClose();
        setPostText("");
        setImgUrl("");
      } else {
        showToast("Error", data.error || "An error occurred", "error");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <Flex direction="column" gap="10" alignItems={"flex-start"}>
      <Flex w="full" mb={1}>
        <Button
          flex={1}
          variant={activeSection === "feed" ? "solid" : "outline"}
          onClick={() => setActiveSection("feed")}
        >
          Feed
        </Button>
        <Button
          flex={1}
          variant={activeSection === "following" ? "solid" : "outline"}
          onClick={() => setActiveSection("following")}
        >
          Following
        </Button>
      </Flex>

      {activeSection === "feed" && (
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
                  <Box mb={10}>
                    <Text
                      display={"flex"}
                      justifyContent={"center"}
                      mb={6}
                      fontWeight={"bold"}
                    >
                      Create Post
                    </Text>
                    <Textarea
                      placeholder="What's on your mind.."
                      onChange={handleTextChange}
                      value={postText}
                    />
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      textAlign={"right"}
                      m={"1"}
                      color={"gray.200"}
                    >
                      {remainingChar}/{MAX_CHAR}
                    </Text>

                    <Input
                      type="file"
                      hidden
                      ref={imageRef}
                      onChange={handleImageChange}
                    />
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      flexDirection={"row-reverse"}
                      justifyContent={"space-between"}
                    >
                      <BsFillImageFill
                        style={{ marginLeft: "5px", cursor: "pointer" }}
                        size={16}
                        onClick={() => imageRef.current.click()}
                      />
                    </Box>
                    {imgUrl && (
                      <Flex mt={5} w={"full"} position={"relative"}>
                        <Image src={imgUrl} alt="Selected img" />
                        <CloseButton
                          onClick={() => {
                            setImgUrl("");
                          }}
                          bg={"gray.800"}
                          position={"absolute"}
                          top={2}
                          right={2}
                        />
                      </Flex>
                    )}
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={handleCreatePost}
                      isLoading={loading}
                    >
                      Post
                    </Button>
                    <Divider p={2} />
                    <SuggestedUsers />
                  </Box>
                  {posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                  ))}
                </>
              )}
            </>
          )}
        </Box>
      )}

      {activeSection === "following" && (
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
                  <Text mb={4} fontWeight={"bold"}>
                    Following
                  </Text>
                  {posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                  ))}
                </>
              )}
            </>
          )}
        </Box>
      )}
    </Flex>
  );
};

export default HomePage;
