import { Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      h="fit-content"
      w="full"
      bg={useColorModeValue("light", "dark")}
      px="2rem"
    >
      <Box
        maxW="container.mw"
        minH="100vh"
        mx="auto"
        display="flex"
        flexDir="column"
      >
        <Navbar />
        {children}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
