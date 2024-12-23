import { useUserStore } from "@/stores/user";
import { Decimal } from "decimal.js";
import chains from "./chainList";

export async function switchChain(chainId: string) {
  const userStore = useUserStore();
  try {
    console.log(userStore.provider);

    await userStore.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: new Decimal(chainId).ceil().toHexadecimal() }],
    });
  } catch (e: any) {
    if (e.code === 4902) {
      const chainDetails = chains[Number(chainId)];
      try {
        if (!chainDetails) throw e;
        await userStore.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: new Decimal(chainId).ceil().toHexadecimal(),
              chainName: chainDetails.name,
              nativeCurrency: {
                symbol: chainDetails.currency,
                decimals: 18,
              },
              rpcUrls: [chainDetails.rpc_url],
              blockExplorerUrls: [chainDetails.explorer],
              iconUrls: [chainDetails.icon_url],
            },
          ],
        });
        const walletChainId = await userStore.provider.request({
          method: "eth_chainId",
        });
        if (Number(walletChainId) !== Number(chainId)) {
          await userStore.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: new Decimal(chainId).ceil().toHexadecimal() }],
          });
        }
      } catch (e) {
        throw e;
      }
    } else throw e;
  }
}
