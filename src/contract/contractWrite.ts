import { walletClientEth } from "./config";
import { Account } from "viem";

export const executeContractFunction = async ({
  contractAddress,
  abi,
  functionName,
  args = [],
  account,
}: {
  contractAddress: `0x${string}`;
  abi: any[];
  functionName: string;
  args: any[];
  account: `0x${string}` | Account;
}): Promise<string | undefined> => {
  try {
    console.log(contractAddress, abi, functionName, args, account);

    const walletClient = walletClientEth;
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
