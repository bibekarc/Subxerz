import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import Masonry from "react-masonry-css";
import GridPost from "../components/GridPost";

const ExplorePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

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

  // Filter posts to only include those with images or videos
  const postsWithMedia = posts.filter(post => post.img || post.videoUrl);

  return (
    <Flex direction="column" gap={1} alignItems="flex-start" p={1}>
      <Text fontSize="3xl" fontWeight="bold" mb={5}>
        Explore
      </Text>
      <Flex flex={70} direction="column" gap={5}>
        {loading ? (
          <Flex justify="center">
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
                  <Box key={post._id} borderRadius="md" overflow="hidden" mb={1}>
                    <GridPost post={post} postedBy={post.postedBy} />
                  </Box>
                ))}
              </Masonry>
            )}
          </>
        )}
      </Flex>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
      </Box>
    </Flex>
  );
};

export default ExplorePage;
