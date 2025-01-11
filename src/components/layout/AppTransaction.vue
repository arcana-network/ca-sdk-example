<script setup lang="ts">
import SendTransaction from "@/components/layout/SendTransaction.vue";
import SpendAllowence from "@/components/layout/SpendAllowance.vue";
import { AllowanceDataType } from "@/types/allowanceTypes";
import { IntentDataType } from "@/types/intentTypes";

const props = defineProps<{
  allowanceDetails: AllowanceDataType;
  intentDetails: IntentDataType;
  isNativeToken?: boolean;
  formAddress: string;
  toAddress: string;
  interection: boolean;
  openIntentLoader: boolean;
  submitLoader: boolean;
  disabbled: boolean;
  txError: boolean;
  timer: string;
  type: "Send" | "Receive";
  txHash?: string;
  chainExplorerToken?: string;
  allowanceLoader?: boolean;
  stepState: {
    currentStep: number;
    totalSteps: number;
  };
  submitSteps: {
    inProgress: boolean;
    completed: boolean;
    steps: { type: string; typeID: string; done: boolean; data: any }[];
  };
}>();

const emit = defineEmits([
  "continue",
  "nextStep",
  "restIntentData",
  "restAllowanceData",
  "startTimer",
  "closeModal",
  "startSubmitLoader",
  "intentDataOpen",
  "intentDataClose",
  "clearTime",
  "allowanceLoaderOpen",
  "clearIntentHandler",
]);

const handleContinue = () => {
  emit("nextStep");
  emit("continue");
};
</script>

<template>
  <button
    class="button-secondary w-full mt-4 max-md:w-full"
    v-if="props.stepState.currentStep === 1"
    @click.stop="handleContinue"
    :disabled="props.disabbled"
  >
    Continue
  </button>

  <div
    v-if="
      props.stepState.currentStep === 2 || props.stepState.currentStep === 3
    "
  >
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
      @clearIntentHandler="emit('clearIntentHandler')"
    />
  </div>
</template>
