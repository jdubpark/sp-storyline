"use client";

import { Box, Button, FormControl, FormLabel, Heading, Input, Stack, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useReadContract } from "wagmi";

import { ViewNFT } from "@/components/ViewNFT";
import {
  mockERC721ABI,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  MOCK_NFT_ADDRESS,
  STORAGE_KEY__IMAGE_BASE64,
  STORAGE_KEY__TOKEN_ID,
  STORAGE_KEY__IMAGE_URL,
} from "@/constants";
import { imageUrlToBase64, getImageUrlFromMetadata } from "@/utils";

export default function WriteSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [imageBase64, setImageBase64] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();

  const { data: mintedTokenUriMetadata, isFetching } = useReadContract({
    abi: mockERC721ABI,
    address: MOCK_NFT_ADDRESS,
    functionName: "tokenURI",
    args: [tokenId],
  });

  const mintedTokenImageURL = useMemo(
    () => (tokenId && !!mintedTokenUriMetadata ? getImageUrlFromMetadata(mintedTokenUriMetadata as string) : undefined),
    [tokenId, mintedTokenUriMetadata]
  );

  const handleSelectIPAsset = useCallback(async () => {
    if (typeof tokenId === "undefined" || !imageBase64 || !mintedTokenImageURL) return;

    localStorage.setItem(STORAGE_KEY__IMAGE_BASE64, JSON.stringify(imageBase64));
    localStorage.setItem(STORAGE_KEY__IMAGE_URL, JSON.stringify(mintedTokenImageURL));
    localStorage.setItem(STORAGE_KEY__TOKEN_ID, JSON.stringify(tokenId));

    router.push("/write/narrate");
  }, [tokenId, imageBase64, mintedTokenImageURL, router]);

  // Fetch image and convert to base64
  useEffect(() => {
    if (!mintedTokenImageURL || imageBase64) return;
    const fetchImage = async () => {
      try {
        setImageBase64(await imageUrlToBase64(mintedTokenImageURL));
      } catch (error) {
        setImageBase64(undefined);
        console.error(error);
      }
    };
    fetchImage();
  }, [imageBase64, mintedTokenImageURL]);

  useEffect(() => {
    const tokenId = searchParams.get("tokenId");
    if (tokenId) setTokenId(tokenId);
  }, [searchParams]);

  return (
    <Stack direction="column" spacing={4} alignItems="center">
      <Heading>Select IP for a Story</Heading>
      <Text>Load the IP Asset that you want to make a story on!</Text>
      <FormControl isDisabled={true}>
        <FormLabel textAlign="center">NFT Address (Mock)</FormLabel>
        <Input value={MOCK_NFT_ADDRESS} size="md" w="lg" />
      </FormControl>
      <FormControl>
        <FormLabel textAlign="center">Token ID of IP</FormLabel>
        <Input value={tokenId} onChange={(e) => setTokenId(e.target.value)} placeholder="Token ID" size="md" w="lg" />
      </FormControl>
      <Button colorScheme="teal" variant="solid" onClick={() => handleSelectIPAsset()} isDisabled={!imageBase64} w="lg">
        Select IP Asset
      </Button>
      {tokenId && !mintedTokenUriMetadata && (
        <Text color={isFetching ? "inherit" : "red.500"}>
          {isFetching ? "Fetching token metadata..." : "Token ID does not exist... Register NFT as IP first!"}
        </Text>
      )}
      {mintedTokenImageURL && (
        <>
          <Box className="border-4 border-teal-500 rounded-sm overflow-hidden" mt={8}>
            <NextImage src={mintedTokenImageURL} alt="IP Asset" width={IMAGE_WIDTH} height={IMAGE_HEIGHT} />
          </Box>
          <ViewNFT tokenId={tokenId} />
        </>
      )}
    </Stack>
  );
}
