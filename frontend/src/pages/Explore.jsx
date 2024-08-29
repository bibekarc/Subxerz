import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import Masonry from "react-masonry-css";
import GridPost from "../components/Gridpost";

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

  // Filter posts to only include those with images
  const postsWithImages = posts.filter(post => post.img);

  return (
    <Flex direction="column" gap={10} alignItems="flex-start" p={5}>
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
            {postsWithImages.length === 0 ? (
              <Text fontSize="xl" textAlign="center">
                No results found...
              </Text>
            ) : (
              <Masonry
                breakpointCols={3}  // Adjust the number of columns based on the screen size
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {postsWithImages.map((post) => (
                  <Box key={post._id} borderRadius="md" overflow="hidden" mb={4}>
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
