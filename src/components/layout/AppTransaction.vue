<script setup lang="ts">
import { Dialog } from '@ark-ui/vue'
import { ref, watch } from 'vue'

import SendTransaction from '@/components/layout/SendTransaction.vue'
import SpendAllowence from '@/components/layout/SpendAllowance.vue'
import { AllowanceDataType } from '@/types/allowanceTypes'
import { IntentDataType } from '@/types/intentTypes'

const props = defineProps<{
  allowanceDetails: AllowanceDataType
  intentDetails: IntentDataType
  isNativeToken?: boolean
  formAddress: string
  toAddress: string
  isModalOpen: boolean
  interection: boolean
  openIntentLoader: boolean
  submitLoader: boolean
  txError: boolean
  timer: string
  type: 'Send' | 'Receive'
  txHash?: string
  chainExplorerToken?: string
  allowanceLoader?: boolean
  submitSteps: {
    inProgress: boolean
    completed: boolean
    steps: { type: string; typeID: string; done: boolean; data: any }[]
  }
}>()

const emit = defineEmits([
  'continue',
  'restIntentData',
  'restAllowanceData',
  'startTimer',
  'closeModal',
  'startSubmitLoader',
  'intentDataOpen',
  'intentDataClose',
  'clearTime',
  'allowanceLoaderOpen',
])

const localModalOpen = ref(props.isModalOpen)

watch(
  () => props.isModalOpen,
  (newVal) => {
    localModalOpen.value = newVal
  },
)
</script>

<template>
  <Dialog.Root
    v-model:open="localModalOpen"
    :close-on-interact-outside="!props.interection"
  >
    <Dialog.Trigger
      class="button-secondary w-1/2 mt-4 max-md:w-full"
      @click.stop="emit('continue')"
    >
      Continue
    </Dialog.Trigger>
    <Teleport to="body">
      <Dialog.Backdrop />
      <Dialog.Positioner
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <Dialog.Content class="card">
          <SpendAllowence
            v-if="props.allowanceDetails.open"
            :allowance-details="props.allowanceDetails"
            :submit-steps="props.submitSteps"
            :timer="props.timer"
            :submit-loader="props.submitLoader"
            :tx-error="props.txError"
            :open-intent-loader="props.openIntentLoader"
            :allowanceLoader="props.allowanceLoader"
            @intentDataOpen="emit('intentDataOpen')"
            @start-timer="emit('startTimer')"
            @start-submit-loader="emit('startSubmitLoader')"
            @close-modal="emit('closeModal')"
            @clearTime="emit('clearTime')"
            @rest-allowance-data="emit('restAllowanceData')"
          />
          <SendTransaction
            v-else
            :allowance-details="props.allowanceDetails"
            :intent-details="props.intentDetails"
            :form-address="props.formAddress"
            :to-address="props.toAddress"
            :submit-steps="props.submitSteps"
            :timer="props.timer"
            :type="props.type"
            :submit-loader="props.submitLoader"
            :tx-error="props.txError"
            :tx-hash="props.txHash"
            :open-intent-loader="props.openIntentLoader"
            :chain-explorer-token="props.chainExplorerToken"
            @rest-intent-data="emit('restIntentData')"
            @start-timer="emit('startTimer')"
            @close-modal="emit('closeModal')"
            @start-submit-loader="emit('startSubmitLoader')"
            @intentDataClose="emit('intentDataClose')"
            @clearTime="emit('clearTime')"
          />
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
</template>
