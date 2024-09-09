import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  Textarea,
  useColorMode,
  useColorModeValue,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import usePreviewVideo from "../hooks/usePreviewVideo";
import { BsFillImageFill, BsFillCameraVideoFill, BsXCircleFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams, useNavigate } from "react-router-dom";
import SlideComponent from "../components/SlideComponent";

const MAX_CHAR = 2200;

const CreatePostPage = ({ onClose }) => {
  const { colorMode } = useColorMode();
  const modalBgColor = useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(0, 0, 0, 0.9)");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrls, setImgUrls } = usePreviewImg();
  const { handleVideoChange, videoUrl, setVideoUrl } = usePreviewVideo();
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const navigate = useNavigate(); // Use useNavigate hook for navigation

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
    showToast("Posting", "Your post is being uploaded...", "info");

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrls,
          video: videoUrl,
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
      setPostText("");
      setImgUrls([]);
      setVideoUrl("");
      onClose();
      navigate("/"); // Navigate to the home page
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction="column"
      backgroundColor={modalBgColor}
      color={textColor}
      padding={{ base: "2", md: "4" }}
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      <Box
        width={{ base: "90%", md: "80%", lg: "70%" }}
        maxWidth="600px"
        backgroundColor={modalBgColor}
        borderRadius="md"
        padding="6"
        boxShadow="md"
        position="relative"
        overflow="hidden"
      >
        <IconButton
          aria-label="Close"
          icon={<BsXCircleFill />}
          position="absolute"
          top="10px"
          right="10px"
          onClick={onClose}
          variant="outline"
          colorScheme="blue"
          size="lg"
          borderRadius="full"
        />
        <FormControl>
          <Textarea
            placeholder="Post content goes here..."
            onChange={handleTextChange}
            value={postText}
            color={textColor}
            borderColor={borderColor}
            backgroundColor={modalBgColor}
            _placeholder={{
              color: useColorModeValue("gray.600", "gray.300"),
            }}
            mb={3}
            resize="none"
            minHeight="150px"
          />
          <Text
            fontSize="sm"
            fontWeight="bold"
            textAlign="right"
            color={textColor}
          >
            {remainingChar}/{MAX_CHAR}
          </Text>

          <Input
            type="file"
            hidden
            ref={imageRef}
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <Input
            type="file"
            hidden
            ref={videoRef}
            accept="video/*"
            onChange={handleVideoChange}
          />

          <Box
            display="flex"
            alignItems="center"
            flexDirection="row-reverse"
            my={4}
            gap={3}
          >
            <IconButton
              aria-label="Upload Video"
              icon={<BsFillCameraVideoFill />}
              size="lg"
              onClick={() => videoRef.current.click()}
              variant="outline"
              colorScheme="blue"
            />
            <IconButton
              aria-label="Upload Image"
              icon={<BsFillImageFill />}
              size="lg"
              onClick={() => imageRef.current.click()}
              variant="outline"
              colorScheme="blue"
            />
          </Box>
        </FormControl>

        {(imgUrls.length > 0 || videoUrl) && (
          <SlideComponent
            imgUrls={imgUrls}
            videoUrl={videoUrl}
            setImgUrls={setImgUrls}
            setVideoUrl={setVideoUrl}
            showCloseButton={true}
          />
        )}

        <Button
          colorScheme="blue"
          onClick={handleCreatePost}
          isLoading={loading}
          disabled={!postText.trim() && imgUrls.length === 0 && !videoUrl}
          mt={4}
          width="full"
        >
          Post
        </Button>
      </Box>
    </Flex>
  );
};

export default CreatePostPage;
