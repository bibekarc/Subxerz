import { Box, Button, Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import CustomButton from "../components/CustomButton";
import { FiLogOut } from "react-icons/fi";

export const SettingsPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account?"))
      return;

    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      if (data.success) {
        await logout();
        showToast("Success", "Your account has been frozen", "success");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  const modeText = colorMode === "dark" ? "Light Mode" : "Dark Mode";

  return (
    <>
      <Flex justifyContent={"space-between"} mb={8} fontWeight={"bold"}>
        <Text>{modeText}</Text>
        <Image
          cursor={"pointer"}
          alt="logo"
          w={7}
          src={colorMode === "dark" ? "/on.png" : "/off.png"}
          onClick={toggleColorMode}
        />
      </Flex>

      <Text my={1} fontWeight={"bold"}>
        Freeze Your Account
      </Text>
      <Text my={1}>
        ( You can unfreeze your account anytime by logging in. )
      </Text>
      <Box mt={8}>
        <CustomButton onClick={freezeAccount} title="Freeze" />
        <Flex
        mt={10}
        gap={5}
        >
          <Text fontWeight={"bold"}>LogOut</Text>
        <Button size={"xs"} onClick={logout}>
          <FiLogOut size={20} />
        </Button>
        </Flex>
      </Box>
    </>
  );
};
