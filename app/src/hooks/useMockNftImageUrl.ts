import { useEffect, useMemo, useState } from 'react';
import { Hex, PublicClient } from 'viem';
import { usePublicClient, useReadContract } from 'wagmi';

import { mockERC721ABI, MOCK_NFT_ADDRESS } from '@/constants';
import { getImageUrlFromMetadata } from '@/utils';

export type UseMockNftImageUrlMulticallParams = {
  client?: ReturnType<typeof usePublicClient>;
  tokenIds?: string[];
};

export type MockNftImageUri = {
  description: string;
  image: string;
  name: string;
};

export function useMockNftImageUrl({ tokenId }: { tokenId: string | undefined }) {
  const { data: tokenUriMetadata } = useReadContract({
    abi: mockERC721ABI,
    address: MOCK_NFT_ADDRESS,
    functionName: 'tokenURI',
    args: [tokenId],
  });

  const tokenImageURL = useMemo(
    () => (tokenId && !!tokenUriMetadata ? getImageUrlFromMetadata(tokenUriMetadata as string) : undefined),
    [tokenId, tokenUriMetadata]
  );

  return { data: tokenImageURL };
}

export function useMockNftImageUrlMulticall({ client, tokenIds }: UseMockNftImageUrlMulticallParams) {
  const [tokenImageURLs, setTokenImageURLs] = useState<string[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const getTokenUris = async () => {
      if (!client || !tokenIds || !tokenIds.length || isFetched) return;

      try {
        setIsFetched(true);
        console.log('tokenIds', tokenIds);

        const tokenUriCalls = tokenIds.map((tokenId) => {
          return {
            abi: mockERC721ABI as any,
            address: MOCK_NFT_ADDRESS,
            functionName: 'tokenURI',
            args: [tokenId],
          } as const;
        });

        const res = (await client.multicall({
          contracts: tokenUriCalls,
          allowFailure: false,
        })) as string[];
        console.log('res', res);

        const resParsed = res.map((r) => JSON.parse(r) as MockNftImageUri);
        console.log('resParsed', resParsed);

        setTokenImageURLs(resParsed.map((r) => r.image));
      } catch (err) {
        console.error(err);
        setIsFetched(false);
      }
    };

    getTokenUris();
  }, [client, tokenIds, isFetched]);

  const tokenImageURLsMapped = useMemo(() => {
    if (!tokenImageURLs) return {};

    return tokenIds?.reduce((acc, tokenId, index) => {
      acc[tokenId] = tokenImageURLs[index];
      return acc;
    }, {} as Record<string, string>);
  }, [tokenImageURLs]);

  return { data: tokenImageURLs, dataMapped: tokenImageURLsMapped };
}
