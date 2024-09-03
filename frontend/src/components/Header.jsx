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


// {        glassmorphism       }

// import React, { useEffect, useState } from "react";
// import {
//   Flex,
//   Image,
//   Link,
//   useColorMode,
// } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import authScreenAtom from "../atoms/authAtom";
// import { AiOutlineSearch } from "react-icons/ai";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { Link as RouterLink } from "react-router-dom";
// import { MdOutlineSettings } from "react-icons/md";

// const Header = () => {
//   const { colorMode, toggleColorMode } = useColorMode();
//   const user = useRecoilValue(userAtom);
//   const setAuthScreen = useSetRecoilState(authScreenAtom);

//   const [isVisible, setIsVisible] = useState(true);
//   let lastScrollTop = 0;

//   const handleScroll = () => {
//     const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

//     if (currentScrollTop > lastScrollTop) {
//       // Scrolling down
//       setIsVisible(false);
//     } else {
//       // Scrolling up
//       setIsVisible(true);
//     }
//     lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <Flex
//       justifyContent="center"
//       mx="auto"
//       px={4}
//       py={4}
//       position="fixed"
//       top={0}
//       left={0}
//       width="100%"
//       maxW={{ base: "100%", md: "700px" }}
//       zIndex={1000}
//       transition="transform 0.3s ease"
//       transform={isVisible ? "translateY(0)" : "translateY(-100%)"}
//       backdropFilter="blur(10px)"
//       bgColor="rgba(0, 0, 0, 0.4)" // Dark semi-transparent background
//       borderRadius="md"
//       boxShadow="0 4px 6px rgba(0, 0, 0, 0.6)" // Darker shadow for depth
//     >
//       <Flex
//         alignItems="center"
//         justifyContent="space-between"
//         width="100%"
//         maxW="700px" // Ensure maximum width for centering
//       >
//         <Image
//           cursor="pointer"
//           alt="logo"
//           w={7}
//           src={colorMode === "dark" ? "/light-logo.png" : "/dark-logo.png"}
//           onClick={toggleColorMode}
//         />

//         {user && (
//           <Flex gap={4} align="center">
//             <Link as={RouterLink} to="/search">
//               <AiOutlineSearch size={24} color={colorMode === "dark" ? "white" : "black"} />
//             </Link>
//           </Flex>
//         )}

//         <Flex alignItems="center" gap={4}>
//           {user ? (
//             <Flex gap={20}>
//               <Link
//                 as={RouterLink}
//                 to="/chat"
//                 display={{ base: "block", md: "none" }}
//               >
//                 <BsFillChatQuoteFill size={20} color={colorMode === "dark" ? "white" : "black"} />
//               </Link>

//               <Link as={RouterLink} to="/settings">
//                 <MdOutlineSettings size={20} color={colorMode === "dark" ? "white" : "black"} />
//               </Link>
//             </Flex>
//           ) : (
//             <>
//               <Link
//                 as={RouterLink}
//                 to="/auth"
//                 onClick={() => setAuthScreen("login")}
//                 color={colorMode === "dark" ? "white" : "black"}
//               >
//                 Login
//               </Link>
//               <Link
//                 as={RouterLink}
//                 to="/auth"
//                 onClick={() => setAuthScreen("signup")}
//                 color={colorMode === "dark" ? "white" : "black"}
//               >
//                 Sign up
//               </Link>
//             </>
//           )}
//         </Flex>
//       </Flex>
//     </Flex>
//   );
// };

// export default Header;
