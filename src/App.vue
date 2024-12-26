<script setup lang="ts">
import Header from "@/components/layout/AppHeader.vue";
import Footer from "@/components/layout/AppFooter.vue";
import PreLogin from "./components/PreLogin.vue";
import "./style.css";
import { onMounted, ref } from "vue";
import { getCA } from "./utils/getCA";
import { useUserStore } from "./stores/user";
import AppDashboard from "./pages/AppDashboard.vue";
import DashBoardBackground from "@/assets/images/svg/DashboardBack.svg";

const user = useUserStore();

const connected = ref(false);
const connect = async () => {
  connected.value = true;
};
const disconnect = async () => {
  localStorage.removeItem("xar-casdk-last-connected-wallet");
  const ca = await getCA();
  await ca.request({
    method: "wallet_revokePermissions",
    params: [
      {
        eth_accounts: {},
      },
    ],
  });
  connected.value = false;
  user.isWalletConnected = false;
  user.walletAddress = "";
};

onMounted(async () => {});
</script>

<template>
  <div class="h-[calc(100vh-5.125rem)] bg-white-100">
    <div v-if="!connected" class="absolute top-5 right-0 z-0">
      <DashBoardBackground class="h-[97vh]" />
    </div>
    <Header :disconnect="disconnect" />
    <div v-if="connected" class="flex justify-center px-16 py-6">
      <AppDashboard />
    </div>
    <div
      v-else
      class="h-[calc(100vh-8.125rem)] flex flex-col justify-center align-center z-10 relative"
    >
      <PreLogin :connect="connect"></PreLogin>
    </div>
    <Footer />
  </div>
</template>
