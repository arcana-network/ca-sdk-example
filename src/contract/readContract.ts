<<<<<<< HEAD
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";
import { Account, createPublicClient, createWalletClient, custom } from "viem";
=======
import {
  arbitrum,
  avalanche,
  base,
  linea,
  mainnet,
  optimism,
  polygon,
  scroll,
} from "viem/chains";
import { Account, createPublicClient, custom } from "viem";
>>>>>>> 47c1ad2 (Feat: Implemented Scroll and Linea (#7))

export const readContractFunction = async ({
  contractAddress,
  abi,
  functionName,
  args = [],
  account,
  chain,
  provider,
}: {
  contractAddress: `0x${string}`;
  abi: any[];
  functionName: string;
  args: any[];
  account: `0x${string}` | Account;
  chain: number;
  provider: any;
}): Promise<string | undefined> => {
  try {
    const chainName =
      chain === 1
        ? mainnet
        : chain === 10
        ? optimism
        : chain === 42161
        ? arbitrum
        : chain === 137
        ? polygon
        : chain === 534352
        ? scroll
        : chain === 59144
        ? linea
        : chain === 43114
        ? avalanche
        : base;

    const walletClient = createPublicClient({
      chain: chainName,
      transport: custom(provider),
    });

    const txResult: any = await walletClient.readContract({
      address: contractAddress,
      abi,
      functionName: functionName,
      args,
      account,
    });

    return txResult;
  } catch (error: any) {
    console.error("Error executing contract function:", error);
    throw new Error(`Contract execution failed: ${error.message}`);
  }
};
