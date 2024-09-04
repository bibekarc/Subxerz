import { useState } from "react";
import { Flex, Button, Box, useColorModeValue } from "@chakra-ui/react";
import FeedSection from "../components/FeedSection";
import VideoSection from "../components/VideoSection";

const HomePage = () => {
  const [activeSection, setActiveSection] = useState("feed");

  const borderColor = useColorModeValue("gray.600", "gray.300");

  const UnderlineButton = ({ label, isActive, onClick }) => (
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
        />
        <UnderlineButton
          label="Video"
          isActive={activeSection === "video"}
          onClick={() => setActiveSection("video")}
        />
      </Flex>

      {activeSection === "feed" && <FeedSection borderColor={borderColor} />}
      {activeSection === "video" && <VideoSection />}
    </Flex>
  );
};

export default HomePage;
