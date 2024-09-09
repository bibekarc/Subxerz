import {
  Box,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { MdExplore } from "react-icons/md";
import { RxAvatar, RxPlusCircled } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const user = useRecoilValue(userAtom);

  if (!isMobile) return null; // Only render on mobile

  // Determine the active route
  const activeRoute = location.pathname;

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
      backdropFilter="blur(10px)"
      bg={useColorModeValue("rgba(255, 255, 255, 0.1)", "rgba(0, 0, 0, 0.1)")}
      border={`1px solid ${useColorModeValue(
        "rgba(255, 255, 255, 0.3)",
        "rgba(0, 0, 0, 0.3)"
      )}`}
      borderRadius="md"
    >
      <IconButton
        aria-label="Home"
        icon={<AiFillHome size={24} />}
        onClick={() => navigate("/")}
        bg={
          activeRoute === "/"
            ? useColorModeValue(
                "rgba(255, 255, 255, 0.2)",
                "rgba(0, 0, 0, 0.2)"
              )
            : "transparent"
        }
        _hover={{
          bg: useColorModeValue(
            "rgba(255, 255, 255, 0.3)",
            "rgba(0, 0, 0, 0.3)"
          ),
        }}
      />
      <IconButton
        aria-label="Explore"
        icon={<MdExplore size={24} />}
        onClick={() => navigate("/explore")}
        bg={
          activeRoute === "/explore"
            ? useColorModeValue(
                "rgba(255, 255, 255, 0.2)",
                "rgba(0, 0, 0, 0.2)"
              )
            : "transparent"
        }
        _hover={{
          bg: useColorModeValue(
            "rgba(255, 255, 255, 0.3)",
            "rgba(0, 0, 0, 0.3)"
          ),
        }}
      />
      <IconButton
        aria-label="Create Post"
        icon={<RxPlusCircled size={24} />}
        onClick={() => navigate("/create-post")}
        bg={
          activeRoute === "/create-post"
            ? useColorModeValue(
                "rgba(255, 255, 255, 0.2)",
                "rgba(0, 0, 0, 0.2)"
              )
            : "transparent"
        }
        _hover={{
          bg: useColorModeValue(
            "rgba(255, 255, 255, 0.3)",
            "rgba(0, 0, 0, 0.3)"
          ),
        }}
      />

      {user && (
        <IconButton
          aria-label="Profile"
          icon={<RxAvatar size={24} />}
          onClick={() => navigate(`/${user.username}`)}
          bg={
            activeRoute === `/${user.username}`
              ? useColorModeValue(
                  "rgba(255, 255, 255, 0.2)",
                  "rgba(0, 0, 0, 0.2)"
                )
              : "transparent"
          }
          _hover={{
            bg: useColorModeValue(
              "rgba(255, 255, 255, 0.3)",
              "rgba(0, 0, 0, 0.3)"
            ),
          }}
        />
      )}
    </Box>
  );
};

export default BottomBar;
