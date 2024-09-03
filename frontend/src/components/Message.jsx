import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Flex direction={"column"} alignItems={ownMessage ? "flex-end" : "flex-start"} mb={4}>
      <Flex gap={2} alignItems={"center"}>
        {ownMessage ? (
          <>
            {message.text && (
              <Flex
                bg="rgba(190, 150, 410, 50.6)" // Semi-transparent background for own messages
                backdropFilter={"blur(15px)"} // Glassmorphism effect
                maxW={"300px"}
                p={3}
                borderRadius={"md"}
                boxShadow="0 4px 8px rgba(0, 0, 0, 0.3)" // Shadow for depth
                direction={"column"}
              >
                <Text color={"white"} fontSize="sm">{message.text}</Text>
              </Flex>
            )}
            {message.img && !imgLoaded && (
              <Flex mt={3} w={"150px"}>
                <Image
                  src={message.img}
                  hidden
                  onLoad={() => setImgLoaded(true)}
                  alt="Message image"
                  borderRadius={4}
                />
                <Skeleton w={"150px"} h={"150px"} />
              </Flex>
            )}

            {message.img && imgLoaded && (
              <Flex mt={3} w={"150px"}>
                <Image src={message.img} alt="Message image" borderRadius={4} />
              </Flex>
            )}

            <Avatar src={user.profilePic} w="6" h={6} />
          </>
        ) : (
          <>
            <Avatar src={selectedConversation.userProfilePic} w="6" h={6} />
            {message.text && (
              <Flex
                bg="rgba(255, 255, 255, 0.1)" // Semi-transparent background for other messages
                backdropFilter={"blur(15px)"} // Glassmorphism effect
                maxW={"300px"}
                p={3}
                borderRadius={"md"}
                boxShadow="0 4px 8px rgba(0, 0, 0, 0.3)" // Shadow for depth
                direction={"column"}
              >
                <Text color={"white"} fontSize="sm">{message.text}</Text>
              </Flex>
            )}
            {message.img && !imgLoaded && (
              <Flex mt={3} w={"150px"}>
                <Image
                  src={message.img}
                  hidden
                  onLoad={() => setImgLoaded(true)}
                  alt="Message image"
                  borderRadius={4}
                />
                <Skeleton w={"150px"} h={"150px"} />
              </Flex>
            )}

            {message.img && imgLoaded && (
              <Flex mt={3} w={"150px"}>
                <Image src={message.img} alt="Message image" borderRadius={4} />
              </Flex>
            )}
          </>
        )}
      </Flex>

      {/* Status text */}
      <Text color={"white"} fontSize="xs" mt={1} alignSelf={ownMessage ? "flex-end" : "flex-start"}>
        {message.seen ? "Seen" : "Sent"}
      </Text>
    </Flex>
  );
};

export default Message;
