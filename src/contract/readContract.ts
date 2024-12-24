import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";
import { Account, createPublicClient, custom } from "viem";

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
        : base;

    const walletClient = createPublicClient({
      chain: chainName,
      transport: custom(provider),
    });

    // const testClient = createTestClient({
    //   chain: chainName,
    //   mode: "anvil",
    //   transport: custom(provider),
    // });
    // await testClient.setLoggingEnabled(true);
    const txResult: any = await walletClient.readContract({
      address: contractAddress,
      abi,
      functionName: functionName,
      args,
      account,
    });

    console.log(`Transaction successfully sent! Tx Hash: ${txResult}`);
    return txResult;
  } catch (error: any) {
    console.error("Error executing contract function:", error);
    throw new Error(`Contract execution failed: ${error.message}`);
  }
};
