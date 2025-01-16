import {
  arbitrum,
  base,
  linea,
  mainnet,
  optimism,
  polygon,
  scroll,
} from "viem/chains";
import { Account, createWalletClient, custom } from "viem";

export const executeContractFunction = async ({
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
        : base;

    const walletClient = createWalletClient({
      chain: chainName,
      transport: custom(provider),
    });

    const txHash = await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName: functionName,
      args,
      account,
    });

    console.log(`Transaction successfully sent! Tx Hash: ${txHash}`);
    return txHash;
  } catch (error: any) {
    console.error("Error executing contract function:", error);
    throw new Error(`Contract execution failed: ${error.message}`);
  }
};
