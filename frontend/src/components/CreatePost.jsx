import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import CreatePostForm from "./CreatePostForm";


const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <CreatePostForm isOpen={isOpen} onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
