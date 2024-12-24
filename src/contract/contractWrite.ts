import { walletClientEth } from "./config";
import { Account } from "viem";

export const executeContractFunction = async ({
  contractAddress,
  abi,
  functionName,
  args = [],
  value,
  account,
}: {
  contractAddress: `0x${string}`;
  abi: any[];
  functionName: string;
  args: any[];
  value: bigint;
  account: `0x${string}` | Account;
}): Promise<string | undefined> => {
  try {
    console.log(contractAddress, abi, functionName, args, value, account);

    const walletClient = walletClientEth;
    const txHash = await walletClient.writeContract({
      address: contractAddress,
      abi: abi,
      functionName: functionName,
      args: args,
      value: BigInt(1),
      account: account,
    });

    console.log(`Transaction successfully sent! Tx Hash: ${txHash}`);
    return txHash;
  } catch (error: any) {
    console.error("Error executing contract function:", error);
    throw new Error(`Contract execution failed: ${error.message}`);
  }
};
