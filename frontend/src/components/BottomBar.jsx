import {
  Box,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { MdExplore } from "react-icons/md";
import { RxAvatar, RxPlusCircled } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CreatePostForm from "./CreatePostForm";

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const isMobile = useBreakpointValue({ base: true, md: false });
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!isMobile) return null; // Only render on mobile

  // Determine the active route
  const activeRoute = location.pathname;

  return (
    <Box
      position="fixed"
      bottom={0}
      width="full"
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      py={2}
      zIndex={1}
      backdropFilter="blur(10px)"
      bg={useColorModeValue("rgba(255, 255, 255, 0.1)", "rgba(0, 0, 0, 0.1)")} // Glassmorphism effect
      border={`1px solid ${useColorModeValue(
        "rgba(255, 255, 255, 0.3)",
        "rgba(0, 0, 0, 0.3)"
      )}`}
      borderRadius="md"
    >
      <IconButton
        aria-label="Home"
        icon={<AiFillHome size={24} />}
        onClick={() => navigate("/")}
        bg={
          activeRoute === "/"
            ? useColorModeValue(
                "rgba(255, 255, 255, 0.2)",
                "rgba(0, 0, 0, 0.2)"
              )
            : "transparent"
        }
        _hover={{
          bg: useColorModeValue(
            "rgba(255, 255, 255, 0.3)",
            "rgba(0, 0, 0, 0.3)"
          ),
        }}
      />
      <IconButton
        aria-label="Explore"
        icon={<MdExplore size={24} />}
        onClick={() => navigate("/explore")}
        bg={
          activeRoute === "/explore"
            ? useColorModeValue(
                "rgba(255, 255, 255, 0.2)",
                "rgba(0, 0        , 0, 0.2)"
              )
            : "transparent"
        }
        _hover={{
          bg: useColorModeValue(
            "rgba(255, 255, 255, 0.3)",
            "rgba(0, 0, 0, 0.3)"
          ),
        }}
      />
      <IconButton
        aria-label="Create Post"
        icon={<RxPlusCircled size={24} />}
        onClick={onOpen}
        bg="transparent" // No background
        _hover={{
          bg: useColorModeValue(
            "rgba(255, 255, 255, 0.3)",
            "rgba(0, 0, 0, 0.3)"
          ),
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <CreatePostForm isOpen={isOpen} onClose={onClose} />
        </ModalContent>
      </Modal>
      {user && (
        <IconButton
          aria-label="Profile"
          icon={<RxAvatar size={24} />}
          onClick={() => navigate(`/${user.username}`)}
          bg={
            activeRoute === `/${user.username}`
              ? useColorModeValue(
                  "rgba(255, 255, 255, 0.2)",
                  "rgba(0, 0, 0, 0.2)"
                )
              : "transparent"
          }
          _hover={{
            bg: useColorModeValue(
              "rgba(255, 255, 255, 0.3)",
              "rgba(0, 0, 0, 0.3)"
            ),
          }}
        />
      )}
    </Box>
  );
};

export default BottomBar;
