import { ReactNode } from "react";
import {
  Box,
  Flex,
  Link,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Heading,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import SoccorLottie from "~/lottie/soccor.json";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box
        py="1rem"
        borderBottomWidth="1px"
        color={colorMode === "dark" ? "gray.200" : "gray.500"}
      >
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Box display="flex" alignItems="center">
            <Box w={{ base: "9", sm: "10", md: "12" }}>
              <Lottie animationData={SoccorLottie} />
            </Box>
            <Heading
              fontFamily="Caveat"
              color="primary"
              fontSize={{ base: "1.5rem", md: "2rem" }}
            >
              Sports & Stream
            </Heading>
          </Box>

          <Stack direction={"row"} spacing={7} alignItems="center">
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}
