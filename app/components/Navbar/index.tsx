import {
  Box,
  Flex,
  Button,
  Stack,
  useColorMode,
  Heading,
} from "@chakra-ui/react";
import SoccorLottie from "~/lottie/soccor.json";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import ClientLottie from "~/components/ClientLottie";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
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
              <ClientLottie animationData={SoccorLottie} />
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
