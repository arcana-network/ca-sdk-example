import { Account, createPublicClient, createWalletClient, custom } from "viem";
import { getChainName } from "./chainName";

export const sendContractFunction = async ({
  account,
  to,
  value,
  chain,
  provider,
}: {
  account: `0x${string}` | Account;
  to: `0x${string}`;
  value: bigint;
  chain: number;
  provider: any;
}): Promise<string | undefined> => {
  try {
    const chainName = getChainName(chain);

    const walletClient = createWalletClient({
      chain: chainName,
      transport: custom(provider),
    });

    const publicClient = createPublicClient({
      chain: chainName,
      transport: custom(provider),
    });

    const txResult: any = await walletClient.sendTransaction({
      account,
      to: to,
      value: value,
    });

    const transaction = await publicClient.waitForTransactionReceipt({
      hash: txResult,
    });

    return transaction?.transactionHash;
  } catch (error: any) {
    console.error("Error executing contract function:", error);
    throw new Error(`Contract execution failed: ${error.message}`);
  }
};
