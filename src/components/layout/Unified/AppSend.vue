<script lang="ts" setup>
import { reactive } from "vue";
import ArrowRightIcon from "@/assets/images/svg/TransactionArrow.svg";

type StepState = {
  currentStep: number;
  totalSteps: number;
};

const emit = defineEmits(["backStep"]);

const stepState = reactive<StepState>({
  currentStep: 1,
  totalSteps: 4,
});

const goBack = () => {
  if (stepState.currentStep > 1) {
    stepState.currentStep--;
  }
};

const handleBack = () => {
  if (stepState.currentStep > 1) {
    goBack();
  } else {
    emit("backStep");
  }
};
</script>

<template>
  <div class="relative">
    <button
      @click="handleBack"
      class="absolute top-2 left-2 bg-orange-200 border border-orange-800 p-4 rounded-full"
    >
      <ArrowRightIcon class="h-4 w-4 stroke-blueGray-800 rotate-180" />
    </button>

    <div>
      <h2
        class="text-xl font-nohemi font-semibold text-blueGray-800 mt-5 text-center"
      >
        Send Unified Balance
      </h2>
    </div>
  </div>
</template>
