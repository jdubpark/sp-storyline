import { Button, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";

import { MOCK_NFT_ADDRESS } from "@/constants";

export type ViewNFTProps = {
  tokenId?: string;
};

export function ViewNFT(props: ViewNFTProps) {
  if (!props.tokenId) return <></>;

  return (
    <Stack direction="column" spacing={2} mt={6} alignItems="center">
      <Text fontWeight="bold">View NFT Token ID {props.tokenId}</Text>
      <NextLink
        href={`https://testnets.opensea.io/assets/sepolia/${MOCK_NFT_ADDRESS.toLowerCase()}/${props.tokenId}`}
        passHref
        target="_blank"
      >
        <Button as="a" colorScheme="blue" variant="outline">
          View on OpenSea
        </Button>
      </NextLink>
    </Stack>
  );
}
