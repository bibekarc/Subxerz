import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUserOne = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setSuggestedUsers(data.slice(0, 1)); // Limit to only one user
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, [showToast]);

  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Suggested Users
      </Text>
      <Flex direction={"column"} gap={4}>
        {!loading &&
          suggestedUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))}
        {loading &&
          [0].map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems={"center"}
              p={"1"}
              borderRadius={"md"}
            >
              {/* Avatar skeleton */}
              <Box>
                <SkeletonCircle size={"10"} />
              </Box>
              {/* Username and fullname skeleton */}
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"90px"} />
              </Flex>
              {/* Follow button skeleton */}
              <Flex>
                <Skeleton h={"20px"} w={"60px"} />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default SuggestedUserOne;
