<script setup lang="ts">
import { Checkbox } from "@ark-ui/vue";
import { computed } from "vue";

import InfoIcon from "@/assets/images/svg/InfoCircle.svg";
import { AllowanceDataType } from "@/types/allowanceTypes";
import {
  getChainDetails,
  getLogo,
  isMaxAllowance,
} from "@/utils/commonFunction";
import { symbolToLogo } from "@/utils/getLogoFromSymbol";
import { getTextFromStep } from "@/utils/getTextFromSteps";

const props = defineProps<{
  allowanceDetails: AllowanceDataType;
  timer: string;
  submitLoader: boolean;
  txError: boolean;
  openIntentLoader: boolean;
  allowanceLoader: boolean;
  submitSteps: {
    inProgress: boolean;
    completed: boolean;
    steps: { type: string; typeID: string; done: boolean; data: any }[];
  };
}>();

const emit = defineEmits([
  "startTimer",
  "startSubmitLoader",
  "intentDataOpen",
  "closeModal",
  "restAllowanceData",
  "clearTime",
  "allowanceLoaderOpen",
]);

const submitAllowance = () => {
  if (props.allowanceDetails.allow) {
    emit("allowanceLoaderOpen");
    emit("intentDataOpen");
    emit("startTimer");
    const values = props.allowanceDetails.data.map(() => "1.15");
    props.allowanceDetails.allow(values);
    emit("startSubmitLoader");
  }
};

const rejectAllowance = () => {
  if (props.allowanceDetails.deny) {
    props.allowanceDetails.deny();
    emit("closeModal");
    emit("restAllowanceData");
    emit("clearTime");
  } else {
    emit("closeModal");
    emit("restAllowanceData");
    emit("clearTime");
  }
};

const handleButtonClick = () => {
  if (props.txError) {
    rejectAllowance();
  } else {
    submitAllowance();
  }
};

const allowanceSteps = computed(() => {
  return props.submitSteps.steps.filter((item) => {
    if (!item.type.startsWith("ALLOWANCE")) {
      return false;
    }
    const statusText = getTextFromStep(item.type, item.done);
    return statusText !== "Unknown status. Please contact support.";
  });
});
</script>

<template>
  <div class="flex flex-col items-center justify-center font-inter">
    <div v-if="!submitLoader" class="text-center">
      <p
        class="font-inter text-base font-normal text-blueGray-600 mt-5 text-center"
      >
        The Chain Abstraction protocol automates spending tokens from multiple
        chains, making future transactions simple.
      </p>
    </div>

    <div class="flex flex-col space-y-2 w-full max-w-2xl mt-4">
      <div
        v-if="!props.allowanceDetails.open && !submitLoader"
        class="flex flex-col items-center justify-center text-center align-middle text-ellipsis overflow-hidden text-base font-inter font-normal leading-4 text-blueGray-800"
      >
        <video
          v-if="props.txError"
          src="@/assets/videos/new_error.webm"
          autoplay
          muted
          class="h-32 relative animate-fadeIn"
          @contextmenu.prevent="void 0"
        />
        <video
          v-else-if="!props.txError"
          src="@/assets/videos/new_loader.webm"
          autoplay
          loop
          muted
          class="h-32 relative"
          @contextmenu.prevent="void 0"
        />
        <span
          class="text-2xl font-nohemi font-medium text-blueGray-800 tabular-nums"
        >
          {{ props.txError ? "Transaction Failed!" : "Loading..." }}
        </span>
      </div>
      <div v-else-if="submitLoader === true" class="h-full w-full relative">
        <div
          class="relative z-20 flex flex-col p-5 gap-6 w-full text-center items-center justify-center pt-6 rounded-lg"
        >
          <div class="flex flex-col gap-3 items-center justify-center">
            <div
              v-if="
                props.submitSteps.inProgress && !props.submitSteps.completed
              "
              class="flex flex-col gap-1 items-center justify-center"
            >
              <video
                src="@/assets/videos/new_loader.webm"
                autoplay
                loop
                muted
                class="h-32 relative"
                @contextmenu.prevent="void 0"
              />
              <span
                class="text-2xl font-nohemi font-medium text-blueGray-800 tabular-nums"
                >{{ props.timer }}s</span
              >
            </div>
            <div
              v-else-if="props.txError"
              class="flex flex-col gap-1 items-center justify-center"
            >
              <video
                src="@/assets/videos/new_error.webm"
                autoplay
                muted
                class="h-32 relative animate-fadeIn"
                @contextmenu.prevent="void 0"
              />
              <span
                class="text-2xl font-nohemi font-medium text-blueGray-800 tabular-nums"
                >{{ props.timer }}s</span
              >
            </div>
            <div v-else class="flex flex-col gap-1 items-center justify-center">
              <video
                src="@/assets/videos/new_success.webm"
                autoplay
                muted
                class="h-32 relative animate-fadeIn"
                @contextmenu.prevent="void 0"
              />
              <span
                class="text-2xl font-nohemi font-medium text-blueGray-800 tabular-nums"
                >Done in {{ props.timer }}s</span
              >
            </div>
          </div>
          <div
            v-for="(step, index) in allowanceSteps"
            :key="step.typeID"
            class="flex flex-col gap-2 w-full"
          >
            <div
              v-if="index === 0"
              class="flex justify-start font-inter text-base font-bold text-blueGray-600"
            >
              ALLOWANCE
            </div>
            <Checkbox.Root
              :value="step.type"
              :checked="step.done"
              disabled
              :class="{
                'flex items-center justify-between gap-2 text-sm transition-all duration-300 rounded-xl': true,
              }"
            >
              <Checkbox.Label
                :class="{
                  'text-start font-nohemi font-semibold text-base transition-all': true,
                  'opacity-40':
                    index !== 0 &&
                    !step.done &&
                    !allowanceSteps[index - 1]?.done,
                }"
                >{{ getTextFromStep(step.type, step.done) }}</Checkbox.Label
              >
              <Checkbox.Control
                :class="{
                  'rounded-full border-transparent transition-all overflow-hidden h-5 w-5 flex items-center justify-center': true,
                  'opacity-0': !step.done,
                  'opacity-100': step.done,
                }"
              >
                <Checkbox.Indicator class="inline-flex">
                  <img
                    v-if="!step.done"
                    src="@/assets/images/svg/ErrorExclamation.svg?url"
                    class="h-5 w-5"
                    alt="Error"
                  />
                  <img
                    v-else
                    src="@/assets/images/svg/SuccessCheck.svg?url"
                    class="h-5 w-5"
                    alt="Success"
                  />
                </Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.HiddenInput />
            </Checkbox.Root>
          </div>
        </div>
      </div>
      <div
        v-for="allowance in props.allowanceDetails.data"
        v-else
        :key="allowance.chainID"
        class="flex items-center justify-between bg-orange-200 shadow-md rounded-lg p-4 border border-background-400"
      >
        <div class="flex items-center space-x-4">
          <div class="relative isolate">
            <img
              :src="getLogo(symbolToLogo[allowance.token.symbol])"
              class="h-7 w-7 rounded-full bg-white-100"
              alt="Logo"
            />
            <img
              :src="
                getLogo(getChainDetails(allowance.chainID)?.custom.icon || '')
              "
              class="absolute z-50 rounded-full border border-solid border-white-100 h-3.5 w-3.5 -bottom-1 -right-1"
              alt="Logo"
            />
          </div>
          <div class="flex items-center gap-1">
            <span
              class="inline-block align-middle text-ellipsis overflow-hidden font-inter text-base font-medium leading-5 text-blueGray-800"
              >{{ allowance.token.name }}</span
            >
            <div
              class="inline-block align-middle font-inter text-ellipsis overflow-hidden text-xs font-normal leading-4 text-blueGray-600"
            >
              {{ allowance.chainName }}
            </div>
          </div>
        </div>

        <div
          class="text-right font-inter text-base font-semibold text-blueGray-800"
        >
          {{
            isMaxAllowance(allowance.currentAllowance)
              ? "Unlimited"
              : allowance.currentAllowance
          }}
        </div>
      </div>
    </div>

    <div
      v-if="props.allowanceDetails.open && !props.txError"
      class="w-full flex items-center gap-2 bg-blue-500 rounded-xl p-2 mt-4 font-inter text-xs font-normal"
    >
      <InfoIcon class="h-4 w-4 stroke-background-300 stroke-cap-round" />
      <span class="text-background-300"
        >You can always change these allowance limits later in settings</span
      >
    </div>

    <button
      class="button-secondary w-full mt-4"
      :disabled="!props.allowanceDetails.open && props.allowanceLoader"
      @click.stop="handleButtonClick"
    >
      {{ props.txError ? "Close" : "Continue" }}
    </button>
  </div>
</template>
