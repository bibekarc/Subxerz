import { Box, Container, Flex } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import Explore from "./pages/Explore";
import SearchPage from "./pages/SearchPage";
import BottomBar from "./components/BottomBar";
import LeftBar from "./components/LeftBar";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  return (
    <Box position="relative" w="full" h="100vh" overflowX="hidden">
      <Header />
      <Flex>
        {user && (
          <Box
            as="aside"
            position="sticky"
            top={0}
            height="100vh"
            width={{ base: "200px", lg: "250px", xl: "300px" }}
            zIndex={1}
            display={{ base: "none", md: "block" }} // Hide LeftBar on small screens
          >
            <LeftBar />
          </Box>
        )}
        <Box
          flex="1"
          overflowY="auto"
          h="100vh" // Full height of viewport to enable scrolling
          p={4}
          overflowX="hidden"
        >
          <Container
            maxW="container.lg"
            pt={{ base: "56px", md: "0" }}
            pl={{ base: "0", md: user ? "70px" : "0" }}
          >
            <Routes>
              <Route
                path="/"
                element={user ? <HomePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/auth"
                element={!user ? <AuthPage /> : <Navigate to="/" />}
              />
              <Route
                path="/update"
                element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/:username"
                element={
                  user ? (
                    <>
                      <UserPage />
                      <CreatePost />
                    </>
                  ) : (
                    <UserPage />
                  )
                }
              />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/:username/post/:pid" element={<PostPage />} />
              <Route
                path="/chat"
                element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
              />
              <Route
                path="/settings"
                element={user ? <SettingsPage /> : <Navigate to={"/auth"} />}
              />
              <Route
                path="/explore"
                element={user ? <Explore /> : <Navigate to={"/auth"} />}
              />
            </Routes>
            {user && <CreatePost />}
          </Container>
        </Box>
      </Flex>
      {user && <BottomBar />} {/* Conditionally render BottomBar */}
    </Box>
  );
}

export default App;
