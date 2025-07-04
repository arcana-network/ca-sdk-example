import { Account, createPublicClient, custom } from "viem";
import { getChainName } from "./chainName";

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
    const chainName = getChainName(chain);

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
