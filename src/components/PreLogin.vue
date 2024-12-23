<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { initCA } from "../utils/getCA";
import { EthereumProvider } from "../utils/typings";
import { useUserStore } from "@/stores/user";
import { Dialog } from "@ark-ui/vue";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";

const props = defineProps<{ connect: () => void }>();
const providers = ref<Array<{ provider: any; info: EIP6963ProviderInfo }>>([]);
const loading = ref(true);
const connectingMsg = ref("");

interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: "eip6963:announceProvider";
  detail: EIP6963ProviderDetail;
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EthereumProvider;
}

const user = useUserStore();

const onAnnouncement = (event: EIP6963AnnounceProviderEvent) => {
  if (providers.value.map((p) => p.info.uuid).includes(event.detail.info.uuid))
    return;
  providers.value = [...providers.value, event.detail];
  const lastConnectedWallet = localStorage.getItem(
    "xar-casdk-last-connected-wallet"
  );
  if (!lastConnectedWallet) {
    loading.value = false;
    return;
  }
  if (event.detail.info.rdns === lastConnectedWallet) {
    connectWallet(event.detail);
  }
  console.log({ providers: providers.value });
};

onMounted(() => {
  // @ts-ignore
  window.addEventListener("eip6963:announceProvider", onAnnouncement);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  // loading.value = false
});

onUnmounted(() => {
  // @ts-ignore
  window.removeEventListener("eip6963:announceProvider", onAnnouncement);
});

const connectWallet = async (p: EIP6963ProviderDetail) => {
  console.log(p.provider, loading);
  loading.value = true;
  connectingMsg.value = `Connecting to ${p.info.name}`;
  console.log({ loading: loading.value });
  console.log(p, "sksksksk");
  try {
    const accounts = (await p.provider.request({
      method: "eth_requestAccounts",
    })) as string[];
    user.setProvider(p.provider);
    await initCA(p.provider);
    localStorage.setItem("xar-casdk-last-connected-wallet", p.info.rdns);
    props.connect();
    user.isWalletConnected = true;
    user.walletAddress = accounts[0];
    console.log("Connected. Account:", accounts[0]);
  } catch (error) {
    console.error("Failed to connect:", error);
  } finally {
    console.log("reached finally");
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-[500px] min-w-[600px] mx-auto max-w-lg flex flex-col justify-center items-center gap-2 bg-orange-500 border border-orange-500 rounded-3xl shadow p-10"
  >
    <div class="font-nohemi font-normal text-6xl text-blueGray-800 text-center">
      Welcome to Arcana SDK Demo
    </div>
    <div class="font-inter font-medium text-sm text-blueGray-600 text-center">
      See how a simple integration of the Arcana Chain Abstraction SDK
      transforms the UX to a multi-chain setting, using any wallet and just a
      few clicks for users.
    </div>

    <Dialog.Root>
      <Dialog.Trigger class="button-secondary w-2/4 mt-4 max-md:w-full">
        Connect Wallet
      </Dialog.Trigger>
      <Teleport to="body">
        <Dialog.Backdrop />
        <Portal>
          <Dialog.Positioner
            class="fixed inset-0 flex items-center justify-center z-50"
          >
            <Dialog.Content class="card mt-10">
              <div
                class="flex flex-col justify-center align-center text-center"
                v-if="loading"
              >
                <div class="flex justify-center align-center text-center mb-10">
                  <FadeLoader :loading="loading" color="#1D2A31" size="16rem" />
                </div>
                <h5
                  v-if="connectingMsg"
                  class="mt-4 font-bold leading-none text-gray-900 font-inter"
                >
                  {{ connectingMsg }}
                </h5>
              </div>
              <div
                v-else
                v-for="p in providers"
                class="flex justify-center items-center flex-col gap-5"
              >
                <div class="w-48 text-gray-900 font-medium rounded-lg text-sm">
                  <button
                    class="button-primary w-full mt-4 max-md:w-full flex px-4 py-2 justify-start items-center"
                    @click="() => connectWallet(p)"
                  >
                    <img
                      :src="p.info.icon"
                      class="w-4 h-4 me-2 -ms-1 text-[#626890]"
                      aria-hidden="true"
                      focusable="false"
                    />
                    {{ p.info.name }}
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Teleport>
    </Dialog.Root>
  </div>
</template>
