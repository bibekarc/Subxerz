import {
  Box,
  IconButton,
  Text,
  useColorMode,
  useBreakpointValue,
  Flex,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  Modal,
} from "@chakra-ui/react";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdExplore, MdOutlineSettings } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { RxAvatar, RxPlusCircled } from "react-icons/rx";
import CreatePostForm from "./CreatePostForm";

const LeftBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode } = useColorMode();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useRecoilValue(userAtom);
  const leftBarWidth = "500px"; // Width of the LeftBar
  const containerPadding = { base: "16px", md: "24px" }; // Adjust as needed

  if (!isDesktop) return null; // Only render on desktop

  // Determine active path
  const isActive = (path) => location.pathname === path;

  return (
    <Box
      position="fixed"
      top={20}
      left={`calc(0px + ${containerPadding.md})`} // Adjust margin to fit design
      height="100vh"
      width={leftBarWidth}
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={4}
      zIndex={1}
    >
      <Flex direction="column" alignItems="center" w="full">
        <Flex
          direction="row"
          align="center"
          mb={4}
          onClick={() => navigate("/")}
          p={2}
          borderRadius="md"
          bg={isActive("/") ? "blue.500" : "transparent"}
          color={
            isActive("/")
              ? "white"
              : colorMode === "dark"
              ? "gray.300"
              : "gray.700"
          }
          _hover={{ bg: "blue.500", color: "white" }}
          transition="background-color 0.2s"
        >
          <IconButton
            aria-label="Home"
            icon={<AiFillHome size={24} />}
            variant="ghost"
            color={
              isActive("/")
                ? "white"
                : colorMode === "dark"
                ? "gray.300"
                : "gray.700"
            }
          />
          <Text ml={2} display={{ base: "none", md: "block" }}>
            Home
          </Text>
        </Flex>

        <Flex
          direction="row"
          align="center"
          mb={4}
          onClick={() => navigate("/search")}
          p={2}
          borderRadius="md"
          bg={isActive("/search") ? "blue.500" : "transparent"}
          color={
            isActive("/search")
              ? "white"
              : colorMode === "dark"
              ? "gray.300"
              : "gray.700"
          }
          _hover={{ bg: "blue.500", color: "white" }}
          transition="background-color 0.2s"
        >
          <IconButton
            aria-label="Search"
            icon={<AiOutlineSearch size={24} />}
            variant="ghost"
            color={
              isActive("/search")
                ? "white"
                : colorMode === "dark"
                ? "gray.300"
                : "gray.700"
            }
          />
          <Text ml={2} display={{ base: "none", md: "block" }}>
            Search
          </Text>
        </Flex>

        <Flex
          direction="row"
          align="center"
          mb={4}
          onClick={onOpen}
          p={2}
          borderRadius="md"
          bg={isActive(open) ? "blue.500" : "transparent"}
          color={
            isActive(open)
              ? "white"
              : colorMode === "dark"
              ? "gray.300"
              : "gray.700"
          }
          _hover={{ bg: "blue.500", color: "white" }}
          transition="background-color 0.2s"
        >
          <IconButton
            aria-label="Create"
            icon={<RxPlusCircled size={24} />}
            variant="ghost"
            color={
              isActive(open)
                ? "white"
                : colorMode === "dark"
                ? "gray.300"
                : "gray.700"
            }
          />

          <Text ml={2} display={{ base: "none", md: "block" }}>
            Create
          </Text>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <CreatePostForm isOpen={isOpen} onClose={onClose} />
            </ModalContent>
          </Modal>
        </Flex>

        <Flex
          direction="row"
          align="center"
          mb={4}
          onClick={() => navigate("/chat")}
          p={2}
          borderRadius="md"
          bg={isActive("/chat") ? "blue.500" : "transparent"}
          color={
            isActive("/chat")
              ? "white"
              : colorMode === "dark"
              ? "gray.300"
              : "gray.700"
          }
          _hover={{ bg: "blue.500", color: "white" }}
          transition="background-color 0.2s"
        >
          <IconButton
            aria-label="Chat"
            icon={<BsFillChatQuoteFill size={24} />}
            variant="ghost"
            color={
              isActive("/chat")
                ? "white"
                : colorMode === "dark"
                ? "gray.300"
                : "gray.700"
            }
          />
          <Text ml={2} display={{ base: "none", md: "block" }}>
            Chat
          </Text>
        </Flex>

        <Flex
          direction="row"
          align="center"
          mb={4}
          onClick={() => navigate("/explore")}
          p={2}
          borderRadius="md"
          bg={isActive("/explore") ? "blue.500" : "transparent"}
          color={
            isActive("/explore")
              ? "white"
              : colorMode === "dark"
              ? "gray.300"
              : "gray.700"
          }
          _hover={{ bg: "blue.500", color: "white" }}
          transition="background-color 0.2s"
        >
          <IconButton
            aria-label="Explore"
            icon={<MdExplore size={24} />}
            variant="ghost"
            color={
              isActive("/explore")
                ? "white"
                : colorMode === "dark"
                ? "gray.300"
                : "gray.700"
            }
          />
          <Text ml={2} display={{ base: "none", md: "block" }}>
            Explore
          </Text>
        </Flex>

        <Flex
          direction="row"
          align="center"
          mb={4}
          onClick={() => navigate(`/${user.username}`)}
          p={2}
          borderRadius="md"
          bg={isActive(`/${user.username}`) ? "blue.500" : "transparent"}
          color={
            isActive(`/${user.username}`)
              ? "white"
              : colorMode === "dark"
              ? "gray.300"
              : "gray.700"
          }
          _hover={{ bg: "blue.500", color: "white" }}
          transition="background-color 0.2s"
        >
          <IconButton
            aria-label="Profile"
            icon={<RxAvatar size={24} />}
            variant="ghost"
            color={
              isActive(`/${user.username}`)
                ? "white"
                : colorMode === "dark"
                ? "gray.300"
                : "gray.700"
            }
          />
          <Text ml={2} display={{ base: "none", md: "block" }}>
            Profile
          </Text>
        </Flex>

        <Flex
          direction="row"
          align="center"
          onClick={() => navigate("/settings")}
          p={2}
          borderRadius="md"
          bg={isActive("/settings") ? "blue.500" : "transparent"}
          color={
            isActive("/settings")
              ? "white"
              : colorMode === "dark"
              ? "gray.300"
              : "gray.700"
          }
          _hover={{ bg: "blue.500", color: "white" }}
          transition="background-color 0.2s"
        >
          <IconButton
            aria-label="Settings"
            icon={<MdOutlineSettings size={24} />}
            variant="ghost"
            color={
              isActive("/settings")
                ? "white"
                : colorMode === "dark"
                ? "gray.300"
                : "gray.700"
            }
          />
          <Text ml={2} display={{ base: "none", md: "block" }}>
            Settings
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default LeftBar;
