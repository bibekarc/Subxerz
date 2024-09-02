import {
  Box,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { MdExplore } from "react-icons/md";
import { RxAvatar, RxPlusCircled } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CreatePostForm from "./CreatePostForm";

const BottomBar = () => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!isMobile) return null; // Only render on mobile

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
    >
      <IconButton
        aria-label="Home"
        icon={<AiFillHome size={24} />}
        onClick={() => navigate("/")}
      />
      <IconButton
        aria-label="Explore"
        icon={<MdExplore size={24} />}
        onClick={() => navigate("/explore")}
      />
      <IconButton
        aria-label="Create Post"
        icon={<RxPlusCircled size={24} />}
        onClick={onOpen}
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
        />
      )}
    </Box>
  );
};

export default BottomBar;
