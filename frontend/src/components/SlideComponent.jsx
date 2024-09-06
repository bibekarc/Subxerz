// SlideComponent.jsx
import { Box, CloseButton, IconButton, Image, useBreakpointValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const SlideComponent = ({ imgUrls, videoUrl, setImgUrls, setVideoUrl, showCloseButton }) => {
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
  const previewSize = useBreakpointValue({ base: "50px", md: "80px" });

  return (
    <Box position="relative" width="full" height="300px" overflow="hidden">
      {videoUrl ? (
        <Box position="relative" width="full" height="full">
          <video src={videoUrl} controls style={{ width: "100%", height: "100%" }} />
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
            position="relative"
            width="full"
            height="full"
            overflow="hidden"
          >
            <Box
              display="flex"
              width={`${imgUrls.length * 100}%`}
              height="100%"
              transition="transform 0.5s ease"
              transform={`translateX(-${currentIndex * (100 / imgUrls.length)}%)`}
            >
              {imgUrls.map((url, index) => (
                <Box
                  key={index}
                  flex="none"
                  width={`${100 / imgUrls.length}%`}
                  height="100%"
                >
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    boxSize="full"
                    objectFit="contain"
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
        </Box>
      ) : null}
    </Box>
  );
};

export default SlideComponent;
