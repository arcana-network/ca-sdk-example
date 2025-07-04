import { Account, createWalletClient, custom } from "viem";
import { getChainName } from "./chainName";

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
    const chainName = getChainName(chain);

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

    return txHash;
  } catch (error: any) {
    console.error("Error executing contract function:", error);
    throw new Error(`Contract execution failed: ${error.message}`);
  }
};
