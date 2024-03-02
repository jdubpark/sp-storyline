"use client";

import { Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { usePublicClient } from "wagmi";

import { useIpAccounts } from "@/hooks";
import { useMockNftImageUrlMulticall } from "@/hooks/useMockNftImageUrl";
import { MOCK_NFT_ADDRESS } from "@/constants";
import { AddIcon } from "@chakra-ui/icons";

export default function GalleryPage() {
  const client = usePublicClient();

  const { data: ipAccounts } = useIpAccounts({
    chainId: "11155111",
    tokenContract: MOCK_NFT_ADDRESS,
  });

  const { dataMapped: imageUrlsMapped } = useMockNftImageUrlMulticall({
    client,
    tokenIds: ipAccounts.map((ipAccount) => ipAccount.tokenId),
  });

  return (
    <Stack direction="column" spacing={4} alignItems="center">
      <Heading>IP Accounts Gallery</Heading>
      <Text>Acquire a license from IP (licensor) to write your NFT story!</Text>
      <Stack direction="column" spacing={2}>
        {ipAccounts.map((ipAccount) => (
          <Box key={ipAccount.id}>
            {imageUrlsMapped && imageUrlsMapped[ipAccount.tokenId] && (
              <Image src={imageUrlsMapped[ipAccount.tokenId]} alt={ipAccount.metadata.name} width={250} height={250} />
            )}
            <Heading size="md" mt={2}>
              {ipAccount.metadata.name}
            </Heading>
            <Text mt={1}>Token ID: {ipAccount.tokenId}</Text>
            <Text>Registrant: {ipAccount.metadata.registrant}</Text>
            <Text>
              Registration Date: {new Date(Number(ipAccount.metadata.registrationDate) * 1000).toLocaleString()}
            </Text>
            <NextLink href={`/write/select?tokenId=${ipAccount.tokenId}`} passHref legacyBehavior>
              <Button as="a" colorScheme="blue" mt={2}>
                Write Story
              </Button>
            </NextLink>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
