import {
    Box,
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
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
  
  const MAX_CHAR = 2200;
  
  const CreatePostForm = ({ isOpen, onClose }) => {
    const [postText, setPostText] = useState("");
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const { handleVideoChange, videoUrl, setVideoUrl } = usePreviewVideo();
    const imageRef = useRef(null);
    const videoRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { username } = useParams();
  
    // Hook calls moved to the top level
    const modalBgColor = useColorModeValue("#ffffff", "#010c0c"); // Light mode and Dark mode background colors
    const borderColor = useColorModeValue("#e2e8f0", "#031a1a"); // Light mode and Dark mode border colors
    const textColor = useColorModeValue("gray.800", "whiteAlpha.900"); // Light mode and Dark mode text color
    const closeButtonBgColor = useColorModeValue("gray.200", "gray.800"); // Close button background color based on color mode
  
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
            img: imgUrl,
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
        setImgUrl("");
        setVideoUrl("");
        onClose(); // Close the modal after posting
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
          border={`2px solid ${borderColor}`}
          borderRadius="10px"
          p="4"
        >
          <ModalHeader color={textColor}>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
                color={textColor}
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
                mt={4}
                gap={3}
              >
                <BsFillCameraVideoFill
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  size={16}
                  onClick={() => videoRef.current.click()}
                />
                <BsFillImageFill
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  size={16}
                  onClick={() => imageRef.current.click()}
                />
              </Box>
            </FormControl>
  
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={closeButtonBgColor}
                  color={textColor}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
  
            {videoUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <video width="100%" controls>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <CloseButton
                  onClick={() => {
                    setVideoUrl("");
                  }}
                  bg={closeButtonBgColor}
                  color={textColor}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
  
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleCreatePost}
              isLoading={loading}
              disabled={!postText.trim() && !imgUrl && !videoUrl}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default CreatePostForm;
  