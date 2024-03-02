import type { Hex } from "viem";

export { default as licensingModuleABI } from "@/constants/LicensingModule.abi";
export { default as licenseRegistryABI } from "@/constants/LicenseRegistry.abi";
export { default as mockERC721ABI } from "@/constants/MockERC721.abi";
export { default as erc1155ABI } from "@/constants/ERC1155.abi";

export const IMAGE_WIDTH = 512;
export const IMAGE_HEIGHT = 512;
export const EXPECTED_EDITED_DATA_NUM = 3;

export const MOCK_NFT_ADDRESS = process.env.NEXT_PUBLIC_MINT_NFT_ADDRESS as Hex;
export const LICENSE_REGISTRY_ADDRESS = process.env
  .NEXT_PUBLIC_LICENSE_REGISTRY_ADDRESS as Hex;

export const STORAGE_KEY__IMAGE_BASE64 = "make-nft-story__imageBase64";
export const STORAGE_KEY__IMAGE_URL = "make-nft-story__imageUrl";
export const STORAGE_KEY__TOKEN_ID = "make-nft-story__tokenId";
