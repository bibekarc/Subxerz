import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import Masonry from "react-masonry-css";
import GridPost from "../components/GridPost";
import userAtom from "../atoms/userAtom";

const ExplorePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  // Filter posts to only include those with images or videos and not by the current user
  const postsWithMedia = posts.filter(post =>
    (post.img || post.video) && post.postedBy !== currentUser._id
  );

  return (
    <Flex direction="column" gap={4} alignItems="center" p={4}>
      <Text fontSize="4xl" fontWeight="bold" mb={6}>
        Explore
      </Text>
      <Flex direction="column" width="100%" maxW="1200px" gap={5}>
        {loading ? (
          <Flex justify="center" align="center" height="100vh">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <>
            {postsWithMedia.length === 0 ? (
              <Text fontSize="xl" textAlign="center">
                No results found...
              </Text>
            ) : (
              <Masonry
                breakpointCols={3}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {postsWithMedia.map((post) => (
                  <Box
                    key={post._id}
                    overflow="hidden"
                    boxShadow="lg"
                    mb={0.5}
                    transition="transform 0.3s"
                    _hover={{ transform: "scale(1.01)" }}
                  >
                    <GridPost post={post} postedBy={post.postedBy} />
                  </Box>
                ))}
              </Masonry>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default ExplorePage;
