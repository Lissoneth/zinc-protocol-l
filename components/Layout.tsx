import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { Box, Flex, useColorMode, useColorModeValue } from "@chakra-ui/react";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      w={"full"}
      backgroundImage={useColorModeValue(
        "linear-gradient(rgba(0,0,0,0.05) 3px, transparent 3px), linear-gradient(to right, rgba(0,0,0,0.05) 3px, transparent 3px)",
        "linear-gradient(rgba(255,255,255,0.05) 3px, transparent 3px), linear-gradient(to right, rgba(255,255,255,0.05) 3px, transparent 3px)"
      )}
      backgroundSize={"70px 70px"}
    >
      <Flex
        w={"full"}
        h={"100vh"}
        maxW={"7xl"}
        mx={"auto"}
        flexDirection={"column"}
        px={6}
        py={6}
      >
        <Navbar />
        <Box flex={"1 1 0%"} minH={"min-content"}>
          {children}
        </Box>
        <Footer />
      </Flex>
    </Box>
  );
};

export default Layout;
