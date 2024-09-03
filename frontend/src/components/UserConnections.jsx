
import { Box, Flex, Text, Avatar, VStack, Grid, useBreakpointValue } from '@chakra-ui/react';

const UserConnections = ({ followers, following }) => {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <VStack spacing={6} alignItems="start" p={4} border="1px" borderColor="gray.200" bg="white">
      <Box w="full">
        <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={4}>
          Followers
        </Text>
        <Grid
          templateColumns={isSmallScreen ? "repeat(2, 1fr)" : "repeat(3, 1fr)"}
          gap={4}
        >
          {followers.map((user) => (
            <Box key={user._id} p={2} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50">
              <Flex alignItems="center" gap={3}>
                <Avatar name={user.name} src={user.profilePic || "https://bit.ly/broken-link"} />
                <VStack align="start" spacing={1}>
                  <Text fontSize="md" fontWeight="bold" color="gray.800">{user.name}</Text>
                  <Text fontSize="sm" color="gray.600">@{user.username}</Text>
                </VStack>
              </Flex>
            </Box>
          ))}
        </Grid>
      </Box>

      <Box w="full">
        <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={4}>
          Following
        </Text>
        <Grid
          templateColumns={isSmallScreen ? "repeat(2, 1fr)" : "repeat(3, 1fr)"}
          gap={4}
        >
          {following.map((user) => (
            <Box key={user._id} p={2} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50">
              <Flex alignItems="center" gap={3}>
                <Avatar name={user.name} src={user.profilePic || "https://bit.ly/broken-link"} />
                <VStack align="start" spacing={1}>
                  <Text fontSize="md" fontWeight="bold" color="gray.800">{user.name}</Text>
                  <Text fontSize="sm" color="gray.600">@{user.username}</Text>
                </VStack>
              </Flex>
            </Box>
          ))}
        </Grid>
      </Box>
    </VStack>
  );
};

export default UserConnections;
