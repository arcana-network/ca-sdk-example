import { useUserStore } from "@/stores/user";
import { Decimal } from "decimal.js";
import { MAINNET_CHAINS } from "./constants";

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
      const chainDetails = MAINNET_CHAINS.filter(
        (item) => item.id === Number(chainId)
      );
      try {
        if (!chainDetails) throw e;
        await userStore.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: new Decimal(chainId).ceil().toHexadecimal(),
              chainName: chainDetails[0]?.name,
              nativeCurrency: {
                symbol: chainDetails[0]?.nativeCurrency?.symbol,
                decimals: chainDetails[0]?.nativeCurrency?.decimals,
              },
              rpcUrls: chainDetails[0]?.rpcUrls?.default?.publicHttp,
              blockExplorerUrls: [
                chainDetails[0]?.blockExplorers?.default?.url,
              ],
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
