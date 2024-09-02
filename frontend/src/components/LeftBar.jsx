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
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useRecoilValue(userAtom);

  if (!isDesktop) return null; // Only render on desktop

  // Determine active path
  const isActive = (path) => location.pathname === path;

  return (
    <Box
      top={0}
      left={0}
      height="100vh"
      width={{ base: "200px", lg: "250px", xl: "300px" }} // Responsive width
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={4}
      zIndex={1}
      boxShadow="lg"
      position="sticky"
    >
      <Flex direction="column" alignItems="center" w="full">
        {[
          { path: "/", label: "Home", icon: AiFillHome },
          { path: "/search", label: "Search", icon: AiOutlineSearch },
          { path: "open", label: "Create", icon: RxPlusCircled, isModal: true },
          { path: "/chat", label: "Chat", icon: BsFillChatQuoteFill },
          { path: "/explore", label: "Explore", icon: MdExplore },
          { path: `/${user.username}`, label: "Profile", icon: RxAvatar },
          { path: "/settings", label: "Settings", icon: MdOutlineSettings },
        ].map((item, index) => (
          <Flex
            key={index}
            direction="row"
            align="center"
            mb={4}
            onClick={
              item.isModal ? onOpen : () => navigate(item.path)
            }
            p={3}
            borderRadius="lg"
            bg={isActive(item.path) ? "blue.600" : "transparent"}
            color={
              isActive(item.path)
                ? "white"
                : colorMode === "dark"
                ? "gray.300"
                : "gray.700"
            }
            _hover={{ bg: "blue.500", color: "white" }}
            transition="all 0.3s ease"
            cursor="pointer"
          >
            <IconButton
              aria-label={item.label}
              icon={<item.icon size={24} />}
              variant="ghost"
              color={
                isActive(item.path)
                  ? "white"
                  : colorMode === "dark"
                  ? "gray.300"
                  : "gray.700"
              }
            />
            <Text
              ml={3}
              fontWeight={isActive(item.path) ? "bold" : "normal"}
              display={{ base: "none", md: "block" }} // Hide text on small screens
            >
              {item.label}
            </Text>
          </Flex>
        ))}
      </Flex>

      {/* Modal for Create Post */}
      {isDesktop && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <CreatePostForm isOpen={isOpen} onClose={onClose} />
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default LeftBar;
