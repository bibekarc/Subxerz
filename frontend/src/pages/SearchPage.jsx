import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Avatar,
  Stack,
  Divider,
  useBreakpointValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Define colors based on color mode
  const backgroundColor = useColorModeValue("rgba(255, 255, 255, 0.1)", "rgba(0, 0, 0, 0.6)");
  const cardBackgroundColor = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(10, 10, 10, 0.8)");
  const cardHoverBackgroundColor = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(60, 60, 60, 0.8)");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const maxWidth = useBreakpointValue({ base: "95%", md: "90%", lg: "80%" });
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const userUrl = `/api/users/search?query=${query}`;
      const postUrl = `/api/posts/search?query=${query}`;

      const [userRes, postRes] = await Promise.all([
        fetch(userUrl),
        fetch(postUrl),
      ]);

      if (!userRes.ok || !postRes.ok) {
        throw new Error("Network response was not ok.");
      }

      const [userData, postData] = await Promise.all([
        userRes.json(),
        postRes.json(),
      ]);

      setUsers(userData);
      setPosts(postData);
      setCombinedResults([...userData, ...postData]);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/${username}`);
  };

  const handlePostClick = (post) => {
    setSelectedItem(post);
    onOpen();
  };

  return (
    <Box
      p={6}
      bg={backgroundColor}
      maxW={maxWidth}
      mx="auto"
      borderRadius="md"
      boxShadow="xl"
      backdropFilter="blur(10px)"
      border="1px"
      borderColor={borderColor}
    >
      <Flex direction="column" mb={6} align="center">
        <Input
          placeholder="Search for users and posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          mb={4}
          size="lg"
          variant="outline"
          borderColor={borderColor}
          focusBorderColor="blue.400"
        />
        <Button
          colorScheme="blue"
          onClick={handleSearch}
          isLoading={loading}
          size="lg"
          w="full"
        >
          Search
        </Button>
      </Flex>

      <Tabs variant="enclosed" colorScheme="blue" size="lg">
        <TabList>
          <Tab _selected={{ bg: "blue.500", color: "white" }}>All</Tab>
          <Tab _selected={{ bg: "blue.500", color: "white" }}>Users</Tab>
          <Tab _selected={{ bg: "blue.500", color: "white" }}>Posts</Tab>
        </TabList>
        <TabPanels>
          {/* Combined Results */}
          <TabPanel>
            {loading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" />
              </Flex>
            ) : combinedResults.length > 0 ? (
              combinedResults.map((item) =>
                item.username ? (
                  <Box
                    key={item._id}
                    borderWidth="1px"
                    borderRadius="md"
                    p={4}
                    mb={4}
                    bg={cardBackgroundColor}
                    borderColor={borderColor}
                    shadow="md"
                    _hover={{ bg: cardHoverBackgroundColor, cursor: "pointer" }}
                    onClick={() => handleUserClick(item.username)}
                  >
                    <Flex align="center">
                      <Avatar name={item.name} src={item.profilePic} size="lg" mr={4} />
                      <Stack spacing={1} flex="1">
                        <Text fontWeight="bold" fontSize="lg">{item.name}</Text>
                        <Text color={textColor}>@{item.username}</Text>
                      </Stack>
                    </Flex>
                    <Divider my={3} />
                  </Box>
                ) : (
                  <Box
                    key={item._id}
                    borderWidth="1px"
                    borderRadius="md"
                    p={4}
                    mb={4}
                    bg={cardBackgroundColor}
                    borderColor={borderColor}
                    shadow="md"
                    _hover={{ bg: cardHoverBackgroundColor, cursor: "pointer" }}
                    onClick={() => handlePostClick(item)}
                  >
                    <Text fontWeight="bold" fontSize="lg">{item.title}</Text>
                    <Text color={textColor}>{item.text}</Text>
                    <Divider my={3} />
                  </Box>
                )
              )
            ) : (
              <Text textAlign="center">No results found.</Text>
            )}
          </TabPanel>
          
          {/* Users Only */}
          <TabPanel>
            {loading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" />
              </Flex>
            ) : users.length > 0 ? (
              users.map((user) => (
                <Box
                  key={user._id}
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  mb={4}
                  bg={cardBackgroundColor}
                  borderColor={borderColor}
                  shadow="md"
                  _hover={{ bg: cardHoverBackgroundColor, cursor: "pointer" }}
                  onClick={() => handleUserClick(user.username)}
                >
                  <Flex align="center">
                    <Avatar name={user.name} src={user.profilePic} size="lg" mr={4} />
                    <Stack spacing={1} flex="1">
                      <Text fontWeight="bold" fontSize="lg">{user.name}</Text>
                      <Text color={textColor}>@{user.username}</Text>
                    </Stack>
                  </Flex>
                  <Divider my={3} />
                </Box>
              ))
            ) : (
              <Text textAlign="center">No users found.</Text>
            )}
          </TabPanel>

          {/* Posts Only */}
          <TabPanel>
            {loading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" />
              </Flex>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Box
                  key={post._id}
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  mb={4}
                  bg={cardBackgroundColor}
                  borderColor={borderColor}
                  shadow="md"
                  _hover={{ bg: cardHoverBackgroundColor, cursor: "pointer" }}
                  onClick={() => handlePostClick(post)}
                >
                  <Text fontWeight="bold" fontSize="lg">{post.title}</Text>
                  <Text color={textColor}>{post.text}</Text>
                  <Divider my={3} />
                </Box>
              ))
            ) : (
              <Text textAlign="center">No posts found.</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal for Post Details */}
      {selectedItem && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedItem.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{selectedItem.text}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default SearchPage;
