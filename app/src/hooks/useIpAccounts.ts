import axios from 'axios';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';

const IP_ACCOUNTS_OPTS = {
  method: 'POST' as const,
  url: 'https://api.storyprotocol.net/api/v1/assets',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'X-API-Key': 'U3RvcnlQcm90b2NvbFRlc3RBUElLRVk=', // for beta
  },
};

export type IpAccount = {
  id: Hex;
  chainId: '11155111';
  parentIpIds: IpAccount[];
  childIpIds: IpAccount[];
  rootIpIds: IpAccount[];
  tokenContract: Hex;
  tokenId: string;
  metadataResolverAddress: Hex;
  metadata: {
    name: string;
    hash: Hex;
    registrationDate: string;
    registrant: Hex;
    uri: string;
  };
  blockNumber: string;
  blockTimestamp: string;
};

export type FetchIpAccountResponse = {
  data: IpAccount[];
};

export type UseIpAccountsParams = {
  chainId?: string;
  metadataResolverAddress?: string;
  tokenContract?: string;
  tokenId?: string;
};

export function useIpAccounts(params?: UseIpAccountsParams) {
  const [ipAccounts, setIpAccounts] = useState<IpAccount[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchIpAccounts = async () => {
      try {
        setIsFetching(true);
        setIsError(false);

        const options = {
          ...IP_ACCOUNTS_OPTS,
          data: { options: { where: params } },
        };

        const res = await axios.request<FetchIpAccountResponse>(options);
        if (res.data.data && res.data.data.length > 0) {
          setIpAccounts(res.data.data);
        }
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsFetching(false);
      }
    };

    fetchIpAccounts();
  }, []);

  return { data: ipAccounts, isFetching, isError };
}
