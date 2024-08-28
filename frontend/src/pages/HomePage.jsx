import {
  Box,
  Button,
  CloseButton,
  Flex,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { BsFillImageFill } from "react-icons/bs";
import { useRef } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import userAtom from "../atoms/userAtom";
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

  useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
    getFeedPosts();
  }, [showToast, setPosts]);

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
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      if (username === user.username) {
        setPosts([data, ...posts]);
      }
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <>
            <Text mb={4} fontWeight={"bold"}>
              Follow some users to see the feed
            </Text>
            <SuggestedUsers />
          </>
        )}
        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

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
            placeholder="Post content goes here.."
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
            alignItems={"centre"}
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
        </Box>
        <SuggestedUsers />

        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
