import {
  Box,
  Text,
  Flex,
  Image,
  Stack,
  Button,
  keyframes,
  useColorModeValue,
  useColorMode,
  IconButton,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

import { Link } from "@chakra-ui/next-js";

import { SunIcon, MoonIcon } from "@chakra-ui/icons";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  const ConnectButtonCustom = () => {
    return (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,

          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;
          return (
            <Box
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      fontSize={{ base: "md" }}
                      color={"white"}
                      backgroundColor={"#0e68e1"}
                      border={"2px solid black"}
                      _hover={{
                        cursor: "pointer",
                      }}
                      onClick={openConnectModal}
                    >
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      fontSize={{ base: "md" }}
                      color={"white"}
                      backgroundColor={"#fa433c"}
                      border={"2px solid black"}
                      _hover={{
                        cursor: "pointer",
                      }}
                      onClick={openChainModal}
                    >
                      Wrong network
                    </Button>
                  );
                }

                return (
                  <Flex gap={6}>
                    <Button
                      onClick={openAccountModal}
                      fontSize={{ base: "md" }}
                      color={"white"}
                      backgroundColor={"#0e68e1"}
                      border={"2px solid black"}
                      _hover={{
                        cursor: "pointer",
                      }}
                    >
                      {account.displayName}
                      <Text display={{ base: "none", lg: "block" }}>
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </Text>
                    </Button>
                  </Flex>
                );
              })()}
            </Box>
          );
        }}
      </ConnectButton.Custom>
    );
  };
  const globalColor = useColorModeValue("black", "white");

  const ColorModeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";
    return (
      <IconButton
        // color={colorMode === "light" ? "red" : "blue"}
        // bg={colorMode === "light" ? "blue" : "red"}
        // _hover={{ color: "yellow", bg: "green" }}
        icon={isDark ? <SunIcon /> : <MoonIcon />}
        aria-label="Toggle Theme"
        onClick={toggleColorMode}
      />
    );
  };
  const MoreInfoButton = () => {
    return <Box>...</Box>;
  };
  return (
    <Box color={globalColor}>
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Flex alignItems={"center"} gap={4}>
          <Link href="/" _hover={{ color: "teal.300" }}>
            <Image w={"30px"} alt="logo" src="logo.png"></Image>
          </Link>
          <Link
            href="/bridge"
            _hover={{ color: "teal.300" }}
            fontWeight={"semibold"}
            fontSize={"xl"}
          >
            BRIDGE
          </Link>
        </Flex>
        <Flex alignItems={"center"} gap={4}>
          <ConnectButtonCustom></ConnectButtonCustom>
          <ColorModeToggle></ColorModeToggle>
          {/* <MoreInfoButton></MoreInfoButton> */}
        </Flex>
      </Flex>
    </Box>
  );
}
