import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

const Player: React.FC<{
  sport: SportInterface;
  isOpen: boolean;
  onClose: () => void;
}> = ({ sport, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent
        p="0"
        m="0"
        h="100vh"
        w="100vw"
        overflow="hidden"
        bg="black"
      >
        <ModalHeader
          position="fixed"
          bg="transparent"
          top="0"
          left="0"
          w="90%"
          color="white"
          fontSize={{ base: "1.3rem", md: "1.6rem" }}
        >
          {sport.title}
        </ModalHeader>
        <ModalCloseButton
          bg="transparent"
          _hover={{ color: "red" }}
          fontSize={{ base: "1rem", md: "1.5rem" }}
          right="1rem"
          top="1rem"
          color="white"
        />
        <ModalBody p="0" m="0">
          <Box
            h="100vh"
            w="100vw"
            as="iframe"
            src={sport.url}
            title={sport.title}
          ></Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Player;
