<script setup lang="ts">
import Tranfer from './components/Transfer.vue'
import Sidebar from './components/Sidebar.vue'
import PreLogin from './components/PreLogin.vue'
import BalanceSidebar from './components/BalanceSidebar.vue'
import './style.css'
import { onMounted, ref } from 'vue';
import { getCA } from './utils/getCA'

const currentTab = ref<'transfer' | 'bridge' | 'refund'>('transfer')

const onSidebarClick = (tab: 'transfer' | 'bridge' | 'refund') => {
  console.log("got click?")
  currentTab.value = tab
}

const connected = ref(false)
const connect = async () => {
  connected.value = true
}
const disconnect = async () => {
  localStorage.removeItem("xar-casdk-last-connected-wallet")
  const ca = await getCA()
  await ca.request({
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
      <BalanceSidebar></BalanceSidebar>
    </div>
    <div v-else class="min-h-screen flex flex-col justify-center align-center">
      <PreLogin :connect="connect"></PreLogin>
    </div>
  </div>
</template>
