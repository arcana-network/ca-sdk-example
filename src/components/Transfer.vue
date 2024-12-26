<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getCA } from "../utils/getCA"
import Modal from './Modal.vue';
import type { CA, Intent, ProgressStep } from '@arcana/ca-sdk';
import { AllowanceHookInput } from '@arcana/ca-sdk';
import { getTextFromStep } from "../utils/getTextFromSteps"
import { CHAINS } from '../utils/chains';
import { Toast, Toaster, createToaster } from '@ark-ui/vue/toast'
import { setAsyncInterval, clearAsyncInterval } from '../utils/async_interval';


const toaster = createToaster({ placement: 'top-end', overlap: false, gap: 24, duration: 5000 })
const createErrorToast = (error: Error | string | unknown) => {
  console.log({ error })
  let message = "An unknown error occurred";
  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === "string") {
    message = error
  }
  console.log({ errorToast: message })
  toaster.create({
    title: 'Error',
    description: message,
    type: 'error',
  })
}
const props = defineProps<
  {
    currentTab: 'transfer' | 'bridge' | 'refund'
  }>()

console.log({ props: props.currentTab })

const messages = ref<{
  error: boolean;
  errorMsg: string;
  success: boolean;
  successMsg: string;
}>({
  error: false,
  errorMsg: "",
  success: false,
  successMsg: ""
})

const bridgeValue = ref<{
  token: string,
  amount: string,
  chain: number,
  loading: boolean
}>({
  token: "",
  amount: "",
  chain: 0,
  loading: false
})

const transferValue = ref<{
  token: string,
  amount: string,
  chain: number,
  loading: boolean,
  to: string
}>({
  token: "",
  amount: "",
  chain: 0,
  loading: false,
  to: ""
})

let ca: CA | null = null

const allowanceModal = ref<{
  data: AllowanceHookInput,
  allow: ((s: Array<"min" | "max" | bigint | string>) => void) | null,
  deny: (() => void) | null,
  open: boolean
  allowances: Array<"min" | "max" | bigint | string>
}>({
  data: [],
  allow: null,
  deny: null,
  open: false,
  allowances: []
})

const intentModal = ref<{
  open: boolean
  allow: () => void
  deny: () => void
  refresh: (() => Promise<Intent>) | null
  intent: Intent | null
  sourcesOpen: boolean
  feesBreakupOpen: boolean
  intervalHandler: number | null
  intentRefreshing: boolean
}>({
  allow: () => { },
  deny: () => { },
  refresh: null,
  intent: null,
  open: false,
  sourcesOpen: true,
  feesBreakupOpen: false,
  intervalHandler: null,
  intentRefreshing: false
})

// let client: WalletClient | null = null

const eventListener = (data: any) => {
  switch (data.type) {
    case "EXPECTED_STEPS": {
      console.log("Expected steps", data.data)
      state.value.steps = data.data.map((s: ProgressStep) => ({ ...s, done: false }))
      state.value.inProgress = true
      break;
    }
    case "STEP_DONE": {
      console.log("Step done", data.data)
      const v = state.value.steps.find(s => {
        return s.typeID === data.data.typeID
      })
      console.log({ v })
      if (v) {
        v.done = true
        if (data.data.data) {
          v.data = data.data.data
        }
      }
      break;
    }
  }
}

onUnmounted(() => {
  if (ca) {
    ca.removeCAEventListener(eventListener)
  }
})
onMounted(async () => {
  ca = await getCA()
  ca.addCAEventListener(eventListener)
  ca.setOnAllowanceHook(async ({ allow, deny, sources }) => {
    console.log({ allowancesInput: sources })
    allowanceModal.value.allow = allow;
    allowanceModal.value.deny = deny
    allowanceModal.value.open = true
    allowanceModal.value.data = sources
  })
  ca.setOnIntentHook(({ intent, allow, deny, refresh }) => {
    console.log({ intent })
    intentModal.value.allow = allow
    intentModal.value.deny = deny
    intentModal.value.refresh = refresh
    intentModal.value.intent = intent
    intentModal.value.open = true
    setTimeout(() => {
      intentModal.value.intervalHandler =
        setAsyncInterval(async () => {
          if (intentModal.value.refresh) {
            console.log("intentRefreshStarted")
            intentModal.value.intentRefreshing = true
            intentModal.value.intent = await intentModal.value.refresh!()
            intentModal.value.intentRefreshing = false
            console.log("intentRefreshEnded")
          }
        }, 5000)
    }, 5000)
  })
  await ca.init()
  console.log(await ca.getUnifiedBalances())
  console.log(await ca.allowance().tokens(["usdt", "usdc"]).get())
  console.log({ ca })
  // await ca.refund("0x75ff0dcff88c13b09fdd285f288d2ed412bcccd1a79386e31095356ff53aa76e");
})

const submitAllowance = () => {
  console.log("got submit")
  allowanceModal.value.open = false
  if (allowanceModal.value.allow) {
    const values = allowanceModal.value.data.map(() => "1.15")
    allowanceModal.value.allow(values)
  }
}
const rejectAllowance = () => {
  console.log("got reject")
  allowanceModal.value.open = false
  if (allowanceModal.value.deny) {
    allowanceModal.value.deny()
  }
}

const refundValue = ref({
  hash: "",
  loading: false,
})

const refundIntent = async () => {
  // refundValue.value.loading = true
  // try {
  //   // await ca?.refund(refundValue.value.hash as `0x${string}`)
  // } catch (e) {
  //   console.error("Refund failed with error", e);
  // } finally {
  //   refundValue.value.loading = false
  // }
}

const state = ref<{
  inProgress: boolean,
  completed: boolean
  steps: Array<ProgressStep & { done: boolean }>
}>({
  inProgress: false,
  steps: [],
  completed: false
})

// inProgress: true,
//   steps: [{
//     type: "INTENT_ACCEPTED",
//     typeID: "IA",
//     done: true
//   }, {
//     type: "INTENT_HASH_SIGNED",
//     typeID: "IHS",
//     done: false
//   }],

const resetState = () => {
  state.value.inProgress = false
  state.value.steps = []
  state.value.completed = false
}

const resetIntentModal = async () => {
  if (intentModal.value.intervalHandler != null) {
    clearAsyncInterval(intentModal.value.intervalHandler)
    intentModal.value.intervalHandler = null
  }
  intentModal.value.open = false
  intentModal.value.allow = () => { }
  intentModal.value.deny = () => { }
  intentModal.value.refresh = null
  intentModal.value.intent = null
  intentModal.value.sourcesOpen = true
  intentModal.value.feesBreakupOpen = false
}

const allowIntent = () => {
  console.log("got submit")
  intentModal.value.allow();
  resetIntentModal()
}

const rejectIntent = () => {
  console.log("got reject")
  intentModal.value.deny();
  resetIntentModal()
}

const handleTransfer = async () => {
  transferValue.value.loading = true
  try {
    console.log({ transferValue: transferValue.value })
    if (ca) {
      const hash = await ca.transfer()
        .amount(Number(transferValue.value.amount))
        .chain(Number(transferValue.value.chain))
        .token(transferValue.value.token)
        .to(transferValue.value.to as `0x${string}`)
        .exec()
      console.log({ hash })
      // const publicClient = createPublicClient({
      //   transport: http(""),
      // });
      // markStepDone("TRANSFER", hash)
      // await publicClient.waitForTransactionReceipt({ hash });
      state.value.completed = true
    }
  } catch (e) {
    resetState()
    console.error("Transfer failed with error", e);
    createErrorToast(e)
  } finally {
    transferValue.value.loading = false
  }
}

const handleBridge = async () => {
  bridgeValue.value.loading = true
  try {
    console.log({ bridgeValue: bridgeValue.value })
    if (ca) {
      await ca.bridge()
        .amount(bridgeValue.value.amount)
        .chain(Number(bridgeValue.value.chain))
        .token(bridgeValue.value.token)
        .exec()
      state.value.completed = true
    }
  } catch (e) {
    resetState()
    messages.value.error = true
    // messages.value.errorMsg = e.message
    createErrorToast(e)
    console.error("Bridge failed with error", e);
  } finally {
    bridgeValue.value.loading = false
  }
}

</script>

<template>
  <Toaster :toaster="toaster" v-slot="toast" class="w-full">
    <Toast.Root
      class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-500 dark:bg-gray-900">
      <!-- <Toast.Title>{{ toast.title }}</Toast.Title> -->
      <Toast.Description class="basis-5/6 flex items-center">
        <div
          class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            viewBox="0 0 20 20">
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
          </svg>
          <span class="sr-only">Error icon</span>
        </div>
        <div class="ms-3 text-sm font-normal">{{ toast.description }}</div>
      </Toast.Description>
      <Toast.CloseTrigger class="basis-1/6">
        <button type="button"
          class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-danger" aria-label="Close">
          <span class="sr-only">Close</span>
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </Toast.CloseTrigger>
    </Toast.Root>
  </Toaster>

  <div v-if="!state.inProgress" class="space-x-4">
    <div v-if="props.currentTab === 'transfer'"
      class="mx-auto w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Transfer</h5>
      <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">

      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="to">To</label>
        <input type="text" v-model="transferValue.to" placeholder="Receiver's address"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="to">Token</label>
        <input type="text" v-model="transferValue.token" placeholder="USDT"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </div>

      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="to">Chain</label>
        <select id="chains" name="Chain" v-model="transferValue.chain"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option disabled value="0">Select chain</option>
          <option v-for="chain in CHAINS" :value="chain.chainID">{{ chain.chainName }}</option>
        </select>
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="to">Amount</label>
        <input type="number" v-model="transferValue.amount" placeholder="Token amount ex - 1.1"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </div>

      <div class="self-end">

        <button @click="handleTransfer" :disabled="transferValue.loading"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg v-if="transferValue.loading" aria-hidden="true" role="status"
            class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor" />
          </svg>
          Transfer
          <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </button>
      </div>
    </div>
    <div v-if="props.currentTab === 'bridge'"
      class="mx-auto w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bridge</h5>
      <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">

      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="to">To</label>
        <input type="text" value="SELF" disabled readonly
          class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="to">Token</label>
        <input type="string" placeholder="Token symbol ex - USDT, ETH" v-model="bridgeValue.token"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="to">Amount</label>
        <input type="string" placeholder="Token amount ex - 1.1" v-model="bridgeValue.amount"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="to">Chain</label>
        <select id="chains" name="Chain" v-model="bridgeValue.chain"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option disabled value="0">Select chain</option>
          <option v-for="chain in CHAINS" :value="chain.chainID">{{ chain.chainName }}</option>
        </select>
      </div>

      <button @click="handleBridge" :disabled="bridgeValue.loading"
        class="text-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg v-if="bridgeValue.loading" aria-hidden="true" role="status"
          class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB" />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor" />
        </svg>
        Bridge
        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg>
      </button>
    </div>
    <div v-if="props.currentTab === 'refund'"
      class="mx-auto w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Refund</h5>
      <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700">

      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="intenthash">Intent Hash</label>
        <input type="string" placeholder="0x..." v-model="refundValue.hash"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </div>


      <button @click="refundIntent" :disabled="refundValue.loading"
        class="text-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        <svg v-if="refundValue.loading" aria-hidden="true" role="status"
          class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB" />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor" />
        </svg>
        Refund
      </button>
    </div>
  </div>
  <div v-if="state.inProgress" class=" mx-auto">
    <!-- <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Upcoming steps</h5> -->

    <div class="w-full flex space-x-4 mb-6">
      <ul
        class="w-full px-4 bg-white border border-gray-200 rounded-lg shadow sm:px-8 dark:bg-gray-800 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="s in state.steps" class="flex items-center py-6 px-5 font-medium text-gray-900 dark:text-white">
          <svg v-if="s.done" class="w-5 h-5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <svg v-else aria-hidden="true"
            class="w-5 h-5 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>
          {{ getTextFromStep(s as any) }}
        </li>
      </ul>
    </div>
    <button @click="resetState" :disabled="!state.completed"
      class="text-white text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <svg class="rotate-180 w-3.5 h-3.5 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M1 5h12m0 0L9 1m4 4L9 9" />
      </svg>
      Go back
    </button>
  </div>

  <Modal :isOpen="allowanceModal.open" @modal-close="rejectAllowance" @submit="submitAllowance" name="allowance-modal">
    <template #header>
      <h5 class="text-xl font-semibold text-gray-900 dark:text-white">
        Verify allowance
      </h5>
    </template>
    <template #content>
      <div class="text-xl font-semibold text-gray-900 dark:text-white">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3">Token</th>
              <th class="px-6 py-3">Chain</th>
              <th class="px-6 py-3">Current Allowance</th>
              <th class="px-6 py-3">Min Allowance</th>
              <th class="px-6 py-3">Set Allowance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="elem in allowanceModal.data" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td class="px-6 py-4">{{ elem.token.symbol }}</td>
              <td class="px-6 py-4">{{ `${elem.chainName}(${elem.chainID})` }}</td>
              <td class="px-6 py-4">{{ elem.currentAllowance.toString().startsWith("11579208923731619542") ? "MAX" :
                elem.currentAllowance }}</td>
              <td class="px-6 py-4">
                {{ elem.minAllowance }}
              </td>
              <td class="px-6 py-4">
                <input type="string" value="MAX" disabled
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </template>
  </Modal>
  <Modal :isDisabled="intentModal.intentRefreshing" :isOpen="intentModal.open" @modal-close="rejectIntent"
    @submit="allowIntent" name="intent-modal">
    <template #header>
      <h5 class="text-xl font-semibold text-gray-900 dark:text-white">
        Intent details
      </h5>
    </template>
    <template #content>
      <div class="p-3">
        <div>
          <div class="flex text-lg text-gray-900 dark:text-white p-2">
            <div class="basis-1/2 text-sm">Destination Chain</div>
            <div class="basis-1/2 text-right text-sm">{{ `${intentModal.intent?.destination.chainName}
              (${intentModal.intent?.destination.chainID})` }}</div>
          </div>
          <div class="flex text-lg text-gray-900 dark:text-white p-2">
            <div class="basis-1/2 text-sm">Spend</div>
            <div class="basis-1/2 text-right flex items-end flex-col">
              <p class="text-sm">{{ `${intentModal.intent?.sourcesTotal} ${intentModal.intent?.token.symbol}` }}</p>
              <div class="text-right" data-accordion="collapse">
                <button type="button" class="flex align-right items-center justify-between p-1"
                  @click="intentModal.sourcesOpen = !intentModal.sourcesOpen">
                  <span class="text-right text-xs text-gray-400">View sources</span>
                </button>
              </div>
            </div>
          </div>
          <div class="p-2 text-gray-900 dark:text-white" v-if="intentModal.sourcesOpen">
            <div class="p-5 bg-gray-200 w-full flex flex-col space-y-6 dark:bg-gray-900 font-xs rounded">
              <div class="flex" v-for="source in intentModal.intent?.sources">
                <div class="basis-1/2 text-xs">
                  {{ `${intentModal.intent?.token.symbol} (${source.chainName})` }}
                </div>
                <div class="basis-1/2 text-xs text-right">
                  {{ `${source.amount} ${intentModal.intent?.token.symbol}` }}
                </div>
              </div>
            </div>
          </div>



          <div class="flex text-lg text-gray-900 dark:text-white p-2">
            <div class="basis-1/2 text-sm">Total Fees</div>
            <div class="basis-1/2 text-right text-sm flex items-end flex-col">
              <p>{{ `${intentModal.intent?.fees.total} ${intentModal.intent?.token.symbol}` }}</p>
              <div class="text-right" data-accordion="collapse">
                <button type="button" class="flex align-right items-center justify-between p-1"
                  @click="intentModal.feesBreakupOpen = !intentModal.feesBreakupOpen">
                  <span class="text-right text-xs text-gray-400">View breakdown</span>
                </button>
              </div>
            </div>
          </div>
          <div class="p-2 text-gray-900 dark:text-white " v-if="intentModal.feesBreakupOpen">
            <div class="p-5 w-full bg-gray-200 flex flex-col space-y-6 dark: bg-gray-900 font-xs rounded">
              <div class="flex">
                <div class="basis-1/2 text-xs">
                  CA Gas Fees:
                </div>
                <div class="basis-1/2 text-xs text-right">
                  {{ `${intentModal.intent?.fees.caGas} ${intentModal.intent?.token.symbol}` }}
                </div>
              </div>
              <div class="flex">
                <div class="basis-1/2 text-xs">
                  Solver Fees:
                </div>
                <div class="basis-1/2 text-xs text-right">
                  {{ `${intentModal.intent?.fees.solver} ${intentModal.intent?.token.symbol}` }}
                </div>
              </div>
              <div class="flex">
                <div class="basis-1/2 text-xs">
                  Protocol Fees:
                </div>
                <div class="basis-1/2 text-xs text-right">
                  {{ `${intentModal.intent?.fees.protocol} ${intentModal.intent?.token.symbol}` }}
                </div>
              </div>
              <div class="flex">
                <div class="basis-1/2 text-xs">
                  Gas supplied:
                </div>
                <div class="basis-1/2 text-xs text-right">
                  0 {{ `${intentModal.intent?.token.symbol}` }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>
  </Modal>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
