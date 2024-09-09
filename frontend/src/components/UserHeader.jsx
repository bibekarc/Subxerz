import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { selectedConversationAtom, conversationsAtom } from "../atoms/messagesAtom"; // Import Recoil state

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom); // Manage conversations
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom); // Manage selected conversation
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const navigate = useNavigate();

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/bibekarc/", "_blank");
  };

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const settingnav = () => {
    navigate("/settings");
  };

  const handleMessage = () => {
    // Check if a conversation with this user already exists
    const existingConversation = conversations.find(
      (conv) => conv.participants[0]._id === user._id
    );

    if (existingConversation) {
      setSelectedConversation({
        _id: existingConversation._id,
        userId: user._id,
        username: user.username,
        userProfilePic: user.profilePic,
      });
    } else {
      // Create a new mock conversation
      const newConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
          },
        ],
      };
      setConversations((prev) => [...prev, newConversation]);
      setSelectedConversation({
        _id: newConversation._id,
        userId: user._id,
        username: user.username,
        userProfilePic: user.profilePic,
      });
    }
    
    navigate("/chat"); // Redirect to chat page
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              px={2}
              borderRadius={"full"}
            >
              Subxer
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      <Flex gap={5}>
        {currentUser?._id !== user._id && (
          <>
            <Button
              size={"sm"}
              onClick={handleFollowUnfollow}
              isLoading={updating}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
            <Button size={"sm"} onClick={handleMessage}>
              Message
            </Button>
          </>
        )}
      </Flex>

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Text color={"gray.light"}>{user.following.length} following</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          {/* <Link color={"gray.light"} >subxer.onrender.com</Link> */}
        </Flex>
        <Flex>
          <Box className="icon-container" onClick={handleInstagramClick}>
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                  <MenuItem bg={"gray.dark"} onClick={settingnav}>
                    Setting
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}></Flex>
    </VStack>
  );
};

export default UserHeader;
