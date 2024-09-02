import {
  Flex,
  Image,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import authScreenAtom from "../atoms/authAtom";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { Link as RouterLink } from "react-router-dom";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <Flex
      justifyContent="space-between"
      mx="auto"
      maxW={{ base: "100%", md: "700px" }}
      px={4}
      py={4}
      position="relative"
      alignItems="center"
    >
      <Image
        cursor="pointer"
        alt="logo"
        w={7}
        src={colorMode === "dark" ? "/light-logo.png" : "/dark-logo.png"}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex gap={4} align="center">
          <Link as={RouterLink} to="/search">
            <AiOutlineSearch size={24} />
          </Link>
        </Flex>
      )}

      <Flex alignItems="center" gap={4}>
        {user ? (
          <Flex gap={20}>
            <Link
              as={RouterLink}
              to="/chat"
              display={{ base: "block", md: "none" }}
            >
              <BsFillChatQuoteFill size={20} />
            </Link>

            <Link as={RouterLink} to="/settings">
              <MdOutlineSettings size={20} />
            </Link>
          </Flex>
        ) : (
          <>
            <Link
              as={RouterLink}
              to="/auth"
              onClick={() => setAuthScreen("login")}
            >
              Login
            </Link>
            <Link
              as={RouterLink}
              to="/auth"
              onClick={() => setAuthScreen("signup")}
            >
              Sign up
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
