// CreatePostForm.jsx
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import usePreviewVideo from "../hooks/usePreviewVideo";
import { BsFillImageFill, BsFillCameraVideoFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import SlideComponent from "./SlideComponent";

const MAX_CHAR = 2200;

const CreatePostForm = ({ isOpen, onClose }) => {
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

  const modalBgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.1)",
    "rgba(0, 0, 0, 0.1)"
  );
  const borderColor = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(255, 255, 255, 0.5 )"
  );
  const textColor = useColorModeValue("gray.100", "whiteAlpha.900");

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
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor={modalBgColor}
        borderRadius="10px"
        p="4"
        backdropFilter="blur(6px)"
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
      >
        <Box>
        <Box>
        <ModalHeader color={textColor}>Create Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <Textarea
              placeholder="Post content goes here.."
              onChange={handleTextChange}
              value={postText}
              color={textColor}
              borderColor={borderColor}
              backgroundColor={modalBgColor}
              _placeholder={{
                color: useColorModeValue("gray.100", "gray.300"),
              }}
            />
            <Text
              fontSize="xs"
              fontWeight="bold"
              textAlign={"right"}
              m={"1"}
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
              display={"flex"}
              alignItems={"center"}
              flexDirection={"row-reverse"}
              my={4}
              gap={3}
            >
              <BsFillCameraVideoFill
                style={{ marginLeft: "5px", cursor: "pointer", color: "white" }}
                size={16}
                onClick={() => videoRef.current.click()}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer", color: "white" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </Box>
          </FormControl>

          {(imgUrls.length > 0 || videoUrl) && (
            <SlideComponent imgUrls={imgUrls} videoUrl={videoUrl} setImgUrls={setImgUrls} setVideoUrl={setVideoUrl}   showCloseButton={true}/>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleCreatePost}
            isLoading={loading}
            disabled={!postText.trim() && imgUrls.length === 0 && !videoUrl}
          >
            Post
          </Button>
        </ModalFooter>
        </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostForm;
