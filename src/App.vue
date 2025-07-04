<script setup lang="ts">
import Tranfer from './components/Transfer.vue'
import Sidebar from './components/Sidebar.vue'
import PreLogin from './components/PreLogin.vue'
import BalanceSidebar from './components/BalanceSidebar.vue'
import './style.css'
import { onMounted, ref } from 'vue';
import { getCA } from './utils/getCA'
import type { CA, UserAsset } from '@arcana/ca-sdk'
const balances = ref<UserAsset[]>([]);
const currentTab = ref<'transfer' | 'bridge' | 'refund'>('transfer')
const balancePoller = ref<number | undefined>(undefined)
const setBalancePolling = (ca: CA) => {
  balancePoller.value = window.setInterval(async () => {
    const b = await ca.getUnifiedBalances();
    console.log({ b })
    balances.value = b
  }, 20000)
}
const onSidebarClick = (tab: 'transfer' | 'bridge' | 'refund') => {
  console.log("got click?")
  currentTab.value = tab
}

const connected = ref(false)
const connect = async () => {
  connected.value = true
  const ca = await getCA()
  const b = await ca.getUnifiedBalances();
  const intents = await ca.getMyIntents(1)
  console.log({ balances2: b, intents })
  balances.value = b
  setBalancePolling(ca)
}
const disconnect = async () => {
  if (balancePoller.value != undefined) {
    window.clearTimeout(balancePoller.value)
    balancePoller.value = undefined
  }

  localStorage.removeItem("xar-casdk-last-connected-wallet")
  const ca = await getCA()
  const provider = ca.getEVMProviderWithCA()
  await provider.request({
    method: "wallet_revokePermissions",
    params: [{
      eth_accounts: {}
    }]
  })
  connected.value = false
}

onMounted(async () => {
})

</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div v-if="connected" class="flex">
      <Sidebar :onSidebarClick="onSidebarClick" :disconnect="disconnect"></Sidebar>
      <div class="basis-4/6 mx-auto p-6">
        <div class="py-6">
          <h1
            class="text-center mb-10 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Chain Abstraction Demo
          </h1>
          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">

        </div>
        <Tranfer :current-tab="currentTab"></Tranfer>
      </div>
      <BalanceSidebar :balances="balances"></BalanceSidebar>
    </div>
    <div v-else class="min-h-screen flex flex-col justify-center align-center">
      <PreLogin :connect="connect"></PreLogin>
    </div>
  </div>
</template>
