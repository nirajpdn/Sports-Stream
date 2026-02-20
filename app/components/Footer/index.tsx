import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box py={4} mt="auto">
      <Flex
        align={"center"}
        _before={{
          content: '""',
          borderBottom: "1px solid",
          borderColor: useColorModeValue("gray.200", "gray.700"),
          flexGrow: 1,
        }}
      ></Flex>
      <Flex alignItems="center" as="span" mt="2" justifyContent="center">
        <Text as="span" fontSize="sm" mr="2">
          &copy; {new Date().getFullYear()} Sports & Stream.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
