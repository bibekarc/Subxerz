import { ArrowBackIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import { HamburgerIcon } from "@chakra-ui/icons";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode(); // Get current color mode
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        onClose(); // Close the drawer when a conversation is selected
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
      onClose(); // Close the drawer when a conversation is selected
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
    >

      {/* Back To Home */}
      <IconButton
        display={{ base: "block", md: "none" }}
        icon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        aria-label="Open Conversations"
        mb={4}
      />

      {/* Mobile Hamburger Icon for Opening Drawer */}
      <IconButton
        display={{ base: "block", md: "none" }}
        icon={<HamburgerIcon />}
        onClick={onOpen}
        aria-label="Open Conversations"
        mb={4}
      />

      {/* Drawer for Mobile View */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent
      bg={useColorModeValue("rgba(255, 255, 255, 0.15)", "rgba(0, 0, 0, 0.15)")} // Light: transparent white, Dark: transparent black
      backdropFilter="blur(10px)" // Blur effect
      border={`1px solid ${useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(0, 0, 0, 0.3)")}`} // Light: white border, Dark: black border
      borderRadius="md"
    >
      <DrawerCloseButton />
      <DrawerHeader
        color={useColorModeValue("black", "white")} // Text color for visibility
      >
        Conversations
      </DrawerHeader>
      <DrawerBody>
        <form onSubmit={handleConversationSearch}>
          <Flex alignItems={"center"} gap={2} mb={4}>
            <Input
              placeholder="Search for a user"
              onChange={(e) => setSearchText(e.target.value)}
              bg={useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(0, 0, 0, 0.7)")} // Input background color
              color={useColorModeValue("black", "white")} // Input text color
            />
            <Button
              size={"sm"}
              type="submit"
              isLoading={searchingUser}
              color={useColorModeValue("black", "white")} // Button text color
            >
              <SearchIcon />
            </Button>
          </Flex>

          {loadingConversations &&
            [0, 1, 2].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"5"}
                borderRadius={"md"}
                bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(0, 0, 0, 0.2)")} // Loading item background
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
                conversation={conversation}
                onClick={onClose} // Close the drawer when a conversation is selected
              />
            ))}
        </form> {/* Added closing tag */}
      </DrawerBody>
    </DrawerContent>
      </Drawer>
      {/* Removed stray </Flex> here */}

      {/* Desktop Layout */}
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
          display={{ base: "none", md: "flex" }} // Hide on mobile, show on desktop
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={"sm"}
                type="submit" 
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"5"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
                conversation={conversation}
              />
            ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
          >
            <GiConversation size={"6rem"} />
            <Text
              fontSize={"lg"}
              fontWeight={700}
              textAlign={"center"}
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Select a conversation to start chatting
            </Text>
          </Flex>
        )}
        {selectedConversation._id && (
          <MessageContainer selectedConversation={selectedConversation} />
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;
