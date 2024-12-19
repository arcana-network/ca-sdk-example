<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { initCA } from "../utils/getCA";
import { EthereumProvider } from "../utils/typings";
import { useUserStore } from "@/stores/user";
import { Dialog } from "@ark-ui/vue";

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
  if (providers.value.map((p) => p.info.uuid).includes(event.detail.info.uuid)) return;
  providers.value = [...providers.value, event.detail];
  const lastConnectedWallet = localStorage.getItem("xar-casdk-last-connected-wallet");
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
  try {
    const accounts = (await p.provider.request({
      method: "eth_requestAccounts",
    })) as string[];
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
    class="min-h-[400px] min-w-[400px] mx-auto max-w-lg flex flex-col justify-center items-center gap-2 bg-orange-500 border border-orange-500 rounded-3xl shadow p-10"
  >
    <div class="font-nohemi font-normal text-5xl text-blueGray-800 text-center">
      Welcome to Arcana SDK Demo App
    </div>
    <div class="font-inter font-medium text-sm text-blueGray-600 text-center">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. 
    </div>

    <Dialog.Root>
      <Dialog.Trigger class="button-secondary w-2/4 mt-4 max-md:w-full">
        Connect
      </Dialog.Trigger>
      <Teleport to="body">
        <Dialog.Backdrop />
        <Portal>
          <Dialog.Positioner class="fixed inset-0 flex items-center justify-center z-50">
            <Dialog.Content class="card">
              <div
                class="flex flex-col justify-center align-center text-center"
                v-if="loading"
              >
                <div class="flex justify-center align-center text-center">
                  <svg
                    aria-hidden="true"
                    class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
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
