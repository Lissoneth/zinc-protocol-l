"use client";

import zincAbi from "./zincAbi.json";

import axios from "axios";

import { ethers } from "ethers";

import React, { useEffect, useState } from "react";

import { useConnectModal, ConnectButton } from "@rainbow-me/rainbowkit";

import {
  useAccount,
  useBalance,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { parseUnits, parseEther, formatUnits } from "viem";

import { SettingsIcon, TriangleDownIcon } from "@chakra-ui/icons";

import {
  Box,
  Stack,
  Button,
  Text,
  Flex,
  Image,
  Input,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import type { NextPage } from "next";

import Head from "next/head";

const iface = new ethers.Interface(zincAbi);

const contractAddress = "0xc4A23281131f450A53D042B94Fd0C886c0aA4FB3";

interface InputComponentProps {
  inputEth: string;
  setInputEth: React.Dispatch<React.SetStateAction<string>>;
  inputSol: string;
  handleEthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputComponent: React.FC<InputComponentProps> = ({
  inputEth,
  setInputEth,
  inputSol,
  handleEthChange,
}) => {
  return (
    <Stack>
      <Flex
        justify={"space-between"}
        alignItems={"center"}
        bg={useColorModeValue("white", "#1e2024")}
        rounded={"lg"}
        py={4}
        px={4}
        gap={4}
      >
        <Flex alignItems={"center"} gap={4}>
          <Box>
            <Image w={"50px"} alt="eth-icon" src="eth-token-icon.png"></Image>
          </Box>
          <Text fontWeight={"semibold"}>ETH</Text>
        </Flex>
        <Box flex={1}>
          <Input
            size={"lg"}
            border={"none"}
            textAlign={"right"}
            focusBorderColor={"none"}
            variant={"unstyled"}
            placeholder={"0.0"}
            fontWeight={"bold"}
            fontSize={"3xl"}
            onChange={handleEthChange}
            value={inputEth}
          />
        </Box>
      </Flex>

      <Flex w={"full"} justify={"center"} alignItems={"center"} py={4}>
        <Image src="arrow.png" alt="arrow" w={"20px"}></Image>
      </Flex>

      <Flex
        justify={"space-between"}
        alignItems={"center"}
        bg={useColorModeValue("white", "#1e2024")}
        rounded={"lg"}
        py={4}
        px={4}
        gap={4}
      >
        <Flex alignItems={"center"} gap={4}>
          <Box>
            <Image w={"50px"} alt="sol-icon" src="sol-token-icon.png"></Image>
          </Box>
          <Text fontWeight={"semibold"}>SOL</Text>
        </Flex>

        <Box flex={1}>
          <Input
            size={"lg"}
            border={"none"}
            textAlign={"right"}
            focusBorderColor={"none"}
            variant={"unstyled"}
            placeholder={"0.0"}
            fontWeight={"bold"}
            fontSize={"3xl"}
            value={inputSol}
            readOnly
          />
        </Box>
      </Flex>
    </Stack>
  );
};

const ConnectButtonCustom = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        return (
          <Box
            my={2}
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
                    w={"full"}
                    fontSize={{ base: "md", lg: "xl" }}
                    px={{ base: 2, lg: 6 }}
                    py={{ base: 0, lg: 6 }}
                    color={"white"}
                    backgroundColor={"#0e68e1"}
                    border={"2px solid black"}
                    boxShadow={"3px 3px 0 black"}
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
                    w={"full"}
                    fontSize={{ base: "md", lg: "xl" }}
                    px={{ base: 2, lg: 10 }}
                    py={{ base: 0, lg: 6 }}
                    color={"white"}
                    backgroundColor={"#ff494a"}
                    border={"2px solid black"}
                    boxShadow={"3px 3px 0 black"}
                    _hover={{
                      cursor: "pointer",
                    }}
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                );
              }

              return <></>;
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};

const Bridge: NextPage = () => {
  const { address, isConnected } = useAccount();

  const { data, isLoading } = useBalance({
    address: address,
  });

  const ethPrice = 1588;

  const solPrice = 19.88;

  const rate = ethPrice / solPrice;

  const [inputEth, setInputEth] = useState("");

  const [inputSol, setInputSol] = useState("");

  const handleEthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputEth = event.target.value;
    setInputEth(inputEth);

    if (!isNaN(parseFloat(inputEth)) && isFinite(parseFloat(inputEth))) {
      setInputSol((parseFloat(inputEth) * rate).toFixed(4).toString());
    } else {
      setInputSol("...");
    }
  };

  function HandleBridgeButton() {
    function formatLog(logsArr: any) {
      for (let i = 0; i < logsArr.length; i++) {
        const log = logsArr[i];
        try {
          const event: any = iface.parseLog(log);
          if (event.name === "BridgeSwapEvent") {
            return Number(event.args.sequence).toString();
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    const { config } = usePrepareContractWrite({
      address: contractAddress,
      abi: zincAbi,
      functionName: "Bridgeandswap",
      args: [address, parseEther(inputEth)],
      value: parseEther(inputEth),
    });

    const { data, isLoading, write } = useContractWrite(config);

    const { isLoading: resultLoading, isSuccess: resultSuccess } =
      useWaitForTransaction({
        hash: data?.hash,
        onSettled(data, error) {
          console.log("Settled", { data, error });
          if (data) {
            const formattedSequence = formatLog(data.logs);
            const postData = {
              userAddress: address,
              amount: inputEth,
              sequence: formattedSequence,
            };

            axios
              .post("http://104.129.182.36/userinfo", postData)
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.error(error);
              });
          }
        },
      });

    return (
      <Box>
        <Button
          w={"full"}
          fontSize={{ base: "md", lg: "xl" }}
          px={{ base: 2, lg: 10 }}
          py={{ base: 0, lg: 6 }}
          color={"white"}
          backgroundColor={"#ff494a"}
          bgImage={
            "linear-gradient( 96.88deg,#3f1979 -3.49%,#ef3c11 76.18%,#ffcd3a 108.99%)"
          }
          border={"2px solid black"}
          boxShadow={"3px 3px 0 black"}
          _hover={{
            cursor: "pointer",
          }}
          size={"lg"}
          _active={{}}
          isDisabled={!write}
          isLoading={isLoading || resultLoading}
          onClick={() => write?.()}
        >
          Send Transction
        </Button>
      </Box>
    );
  }

  function test() {
    const postData = {
      userAddress: 1,
      amount: 2,
      sequence: 3,
    };

    axios
      .post("http://104.129.182.36/userinfo", postData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <Head>
        <title>Bridge - Zinc</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Flex justify={"center"} mt={20}>
        <Stack
          w={["full", "500px"]}
          bg={useColorModeValue("gray.200", "#181a1d")}
          rounded={"lg"}
          p={6}
          gap={4}
        >
          <Flex justify={"space-between"} alignItems={"center"}>
            <Text fontWeight={"bold"} fontSize={"2xl"}>
              Bridge
            </Text>
            <IconButton
              icon={<SettingsIcon />}
              onClick={test}
              aria-label="Settings"
            />
          </Flex>
          {address ? (
            <Stack px={4}>
              <Text textAlign={"right"} fontSize={"sm"}>
                Balance:{" "}
                {isLoading ? "..." : Number(data?.formatted).toFixed(4)} ETH
              </Text>
            </Stack>
          ) : (
            <></>
          )}

          <InputComponent
            inputEth={inputEth}
            setInputEth={setInputEth}
            inputSol={inputSol}
            handleEthChange={handleEthChange}
          ></InputComponent>

          {isConnected ? (
            <HandleBridgeButton></HandleBridgeButton>
          ) : (
            <ConnectButtonCustom></ConnectButtonCustom>
          )}
        </Stack>
      </Flex>
    </>
  );
};

export default Bridge;
