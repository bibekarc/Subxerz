import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast]);

  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
          <>
            <Text mb={4} fontWeight={"bold"}>
              Follow some users to see the feed
            </Text>
            <SuggestedUsers />
          </>

        <SuggestedUsers />
        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
