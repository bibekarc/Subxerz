import {
  Box,
  CloseButton,
  IconButton,
  Image,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const SlideComponent = ({
  imgUrls,
  videoUrl,
  setImgUrls,
  setVideoUrl,
  showCloseButton,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imgUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imgUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleRemove = (index) => {
    if (videoUrl && imgUrls.length === 0) {
      setVideoUrl(""); // Clear video if there are no images
    } else {
      setImgUrls((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (imgUrls.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= imgUrls.length) {
      setCurrentIndex(imgUrls.length - 1);
    }
  }, [imgUrls, currentIndex]);

  const showArrows = imgUrls.length > 1;

  return (
    <Box position="relative" width="full" height="full" overflow="hidden">
      {videoUrl ? (
        <Box position="relative" width="full" height="full">
          <video
            src={videoUrl}
            controls
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {showCloseButton && (
            <CloseButton
              position="absolute"
              top="4px"
              right="4px"
              color="red.400"
              onClick={() => setVideoUrl("")}
            />
          )}
        </Box>
      ) : imgUrls.length > 0 ? (
        <Box position="relative" width="full" height="full">
          <Box
            display="flex"
            width="100%"
            height="100%"
            transition="transform 0.5s ease"
            transform={`translateX(-${currentIndex * 100}%)`}
          >
            {imgUrls.map((url, index) => (
              <Box
                key={index}
                flex="none"
                width="100%" // Each image takes full width
                height="100%"
              >
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  boxSize="full"
                  objectFit="cover" // Makes sure the image covers the entire container
                />
              </Box>
            ))}
          </Box>

          {showArrows && (
            <>
              <IconButton
                aria-label="Previous"
                icon={<IoIosArrowBack />}
                position="absolute"
                top="50%"
                left="10px"
                transform="translateY(-50%)"
                backgroundColor="rgba(0, 0, 0, 0.5)"
                color="white"
                onClick={handlePrev}
              />
              <IconButton
                aria-label="Next"
                icon={<IoIosArrowForward />}
                position="absolute"
                top="50%"
                right="10px"
                transform="translateY(-50%)"
                backgroundColor="rgba(0, 0, 0, 0.5)"
                color="white"
                onClick={handleNext}
              />
            </>
          )}

          {/* Show dots for image count */}
          <Box
            position="absolute"
            bottom="10px"
            left="50%"
            transform="translateX(-50%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {imgUrls.map((_, index) => (
              <Box
                key={index}
                w="8px"
                h="8px"
                borderRadius="full"
                bg={currentIndex === index ? "white" : "gray.400"}
                mx="2px"
                transition="background-color 0.3s ease"
              />
            ))}
          </Box>

          {/* Display the current image number in top-right */}
          <Text
            position="absolute"
            top="10px"
            right="10px"
            color="white"
            fontWeight="bold"
            bg="rgba(0, 0, 0, 0.5)"
            borderRadius="md"
            px={2}
            py={1}
            fontSize="sm"
          >
            {currentIndex + 1} / {imgUrls.length}
          </Text>

          {showCloseButton && (
            <CloseButton
              position="absolute"
              top="4px"
              right="4px"
              color="red.400"
              onClick={() => handleRemove(currentIndex)}
            />
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default SlideComponent;
