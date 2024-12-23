<script lang="ts" setup>
import { Accordion, Checkbox } from "@ark-ui/vue";
import Decimal from "decimal.js";
import { ref, computed } from "vue";

import ChevronDownIcon from "@/assets/images/svg/ChevronDown.svg";
import InfoIcon from "@/assets/images/svg/InfoCircle.svg";
import LinkIcon from "@/assets/images/svg/Link.svg";
import ArrowRightIcon from "@/assets/images/svg/TransactionArrow.svg";
import AppTooltip from "@/components/shared/AppTooltip.vue";
import { getCoinbasePrices } from "@/services/coinbase";
import { AllowanceDataType } from "@/types/allowanceTypes";
import { IntentDataType } from "@/types/intentTypes";
import {
  getChainDetails,
  getExplorerUrl,
  getLogo,
  truncateString,
} from "@/utils/commonFunction";
import { symbolToLogo } from "@/utils/getLogoFromSymbol";
import { getTextFromStep } from "@/utils/getTextFromSteps";

const props = defineProps<{
  allowanceDetails: AllowanceDataType;
  intentDetails: IntentDataType;
  formAddress: string;
  toAddress: string;
  timer: string;
  submitLoader: boolean;
  txError: boolean;
  openIntentLoader: boolean;
  type: "Send" | "Receive";
  txHash?: string;
  chainExplorerToken?: string;
  submitSteps: {
    inProgress: boolean;
    completed: boolean;
    steps: {
      type: string;
      typeID: string;
      done: boolean;
      data: any;
    }[];
  };
}>();

const emit = defineEmits([
  "restIntentData",
  "startTimer",
  "closeModal",
  "startSubmitLoader",
  "intentDataClose",
  "clearTime",
  "clearIntentHandler",
]);

const rates = ref<Record<string, string>>({});

getCoinbasePrices().then((data: any) => {
  rates.value = data;
});

const totalSpend = () => {
  return (
    Number(props.intentDetails.intent?.destination.amount) +
    Number(props.intentDetails.intent?.fees.total)
  );
};

const submitIntentData = async () => {
  emit("clearTime");
  if (props.intentDetails.allow) {
    emit("intentDataClose");
    emit("startTimer");
    await props.intentDetails.allow();
    emit("startSubmitLoader");
    emit("clearIntentHandler");
  }
};

const rejectIntentData = () => {
  if (props.intentDetails.deny) {
    props.intentDetails.deny();
    emit("closeModal");
    emit("restIntentData");
    emit("clearTime");
    emit("clearIntentHandler");
  }
};

const closeModal = () => {
  emit("closeModal");
  emit("restIntentData");
  emit("clearTime");
  emit("clearIntentHandler");
};

const intentSteps = computed(() => {
  return props.submitSteps.steps.filter((item) => {
    if (!item.type.startsWith("INTENT")) {
      return false;
    }
    const statusText = getTextFromStep(item.type);
    return statusText !== "Unknown status. Please contact support.";
  });
});
</script>

<template>
  <div class="h-full w-full flex flex-col overflow-y-auto">
    <div class="w-full h-full p-2 pb-0 flex flex-col overflow-y-auto">
      <div
        v-if="!props.intentDetails.open && !submitLoader"
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
          v-else-if="props.txHash"
          src="@/assets/videos/new_success.webm"
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
        {{
          props.txError
            ? "Failed!"
            : props.txHash
            ? "Transaction Successfull"
            : "Loading..."
        }}
        <div
          v-if="props.txHash && props.chainExplorerToken"
          class="flex items-center justify-evenly transition-all w-full"
        >
          <a
            target="_blank"
            :href="
              getExplorerUrl(
                props.txHash,
                getChainDetails(Number(props.chainExplorerToken))
                  ?.blockExplorers?.default?.url
              )
            "
            class="flex items-center gap-1 font-inter text-rose-500 text-lg font-medium no-underline hover:no-underline active:no-underline"
            ><LinkIcon class="w-4 h-4 stroke-rose-500" /><span
              >View Transaction</span
            ></a
          >
        </div>
      </div>
      <div
        v-else-if="submitLoader === true && !props.openIntentLoader"
        class="h-full w-full relative"
      >
        <div
          class="relative z-20 flex flex-col p-2 gap-2 w-full text-center items-center justify-center pt-6 rounded-lg"
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
            v-for="(step, index) in intentSteps"
            :key="index"
            class="flex flex-col gap-2 w-full"
          >
            <div
              v-if="index === 0"
              class="flex justify-start font-inter text-base font-bold text-blueGray-600"
            >
              INTENT
            </div>
            <div
              v-if="index === 3"
              class="flex justify-start font-inter text-base font-bold text-blueGray-600"
            >
              TRANSACTION
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
                  'opacity-40': index !== 0 && !step.done,
                }"
                >{{ getTextFromStep(step.type) }}
              </Checkbox.Label>
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
            <div
              v-if="step.data?.explorerURL"
              class="flex items-center justify-evenly transition-all w-full"
            >
              <a
                target="_blank"
                :href="step.data?.explorerURL"
                class="flex items-center gap-1 font-inter text-rose-500 text-lg font-medium no-underline hover:no-underline active:no-underline"
                ><LinkIcon class="w-4 h-4 stroke-rose-500" /><span
                  >View Intent</span
                ></a
              >
            </div>
          </div>
          <div
            v-if="props.txHash && props.chainExplorerToken"
            class="flex items-center justify-evenly transition-all w-full"
          >
            <a
              target="_blank"
              :href="
                getExplorerUrl(
                  props.txHash,
                  getChainDetails(Number(props.chainExplorerToken))
                    ?.blockExplorers?.default?.url
                )
              "
              class="flex items-center gap-1 font-inter text-rose-500 text-lg font-medium no-underline hover:no-underline active:no-underline"
              ><LinkIcon class="w-4 h-4 stroke-rose-500" /><span
                >View Transaction</span
              ></a
            >
          </div>
          <button
            class="button-secondary w-full uppercase h-11 mt-2"
            @click.stop="closeModal"
          >
            Close
          </button>
        </div>
      </div>
      <div v-else class="flex flex-col flex-grow gap-4 mt-4">
        <div
          v-if="type === 'Receive'"
          class="flex flex-col flex-grow overflow-y-auto bg-orange-200 rounded-2xl border border-background-400 font-inter"
        >
          <Accordion.Root
            multiple
            collapsible
            class="relative z-20 field flex flex-col py-4 px-3 w-full text-center mt-2 rounded-xl"
          >
            <div class="flex flex-col items-start">
              <span class="text-base font-normal text-blueGray-700"
                >Sources</span
              >
              <div class="w-full bg-orange-300 rounded-2xl">
                <div
                  v-for="item in props.intentDetails.intent?.sources"
                  :key="item.chainID"
                  class="w-full flex justify-between items-center font-inter px-4"
                >
                  <div class="flex items-center h-14 space-x-4">
                    <div class="relative isolate">
                      <img
                        :src="
                          props.intentDetails.intent?.token.symbol &&
                          getLogo(
                            symbolToLogo[
                              props.intentDetails.intent?.token.symbol
                            ]
                          )
                        "
                        class="h-7 w-7 rounded-full bg-white-100"
                        alt="Logo"
                      />
                      <img
                        :src="getLogo(item.chainLogo)"
                        class="absolute z-50 rounded-full border border-solid border-white-100 h-3.5 w-3.5 -bottom-1 -right-1"
                        alt="Logo"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span
                        class="inline-block align-middle text-ellipsis overflow-hidden text-base font-medium leading-5 text-blueGray-800"
                        >{{ props.intentDetails.intent?.token?.symbol }}
                      </span>
                      <div
                        class="inline-block align-middle text-ellipsis overflow-hidden text-xs font-normal leading-4 text-blueGray-600"
                      >
                        {{ item.chainName }}
                      </div>
                    </div>
                  </div>

                  <div class="text-left text-xs font-medium text-blueGray-800">
                    {{ new Decimal(item.amount || 0).toDecimalPlaces(6) }}
                    {{ props.intentDetails.intent?.token.symbol }}
                  </div>
                </div>
              </div>

              <div class="w-full flex justify-center items-center p-2">
                <ArrowRightIcon class="h-4 w-4 stroke-blueGray-800 rotate-90" />
              </div>
              <span class="text-base font-normal text-blueGray-700"
                >Destination</span
              >
              <div
                class="w-full flex justify-between items-center bg-orange-300 rounded-2xl font-inter px-4 py-2 mt-1"
              >
                <div class="flex items-center h-14 space-x-4">
                  <div class="relative isolate">
                    <img
                      :src="
                        props.intentDetails.intent?.token.symbol &&
                        getLogo(
                          symbolToLogo[props.intentDetails.intent?.token.symbol]
                        )
                      "
                      class="h-7 w-7 rounded-full bg-white-100"
                      alt="Logo"
                    />
                    <img
                      :src="
                        getLogo(
                          props.intentDetails.intent?.destination.chainLogo
                        )
                      "
                      class="absolute z-50 rounded-full border border-solid border-white-100 h-3.5 w-3.5 -bottom-1 -right-1"
                      alt="Logo"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span
                      class="inline-block align-middle text-ellipsis overflow-hidden text-base font-medium leading-5 text-blueGray-800"
                      >{{ props.intentDetails.intent?.token?.symbol }}
                    </span>
                    <div
                      class="inline-block align-middle text-ellipsis overflow-hidden text-xs font-normal leading-4 text-blueGray-600"
                    >
                      {{ props.intentDetails.intent?.destination.chainName }}
                    </div>
                  </div>
                </div>

                <div class="text-left text-xs font-medium text-blueGray-800">
                  {{
                    new Decimal(
                      props.intentDetails.intent?.destination.amount || 0
                    ).toDecimalPlaces(6)
                  }}
                  {{ props.intentDetails.intent?.token.symbol }}
                </div>
              </div>
            </div>
            <div class="flex flex-col pt-6 gap-4">
              <div class="flex flex-col">
                <Accordion.Item value="fee-breakup" class="flex flex-col">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                      <span class="text-base font-normal text-blueGray-700"
                        >Total Fees</span
                      >
                      <AppTooltip message="Total Fees">
                        <InfoIcon
                          class="h-4 w-4 stroke-blueGray-700 stroke-cap-round"
                        />
                      </AppTooltip>
                    </div>
                    <div class="flex flex-col items-end">
                      <span class="font-medium text-sm"
                        >~{{
                          new Decimal(
                            intentDetails.intent?.fees.total || 0
                          ).toDecimalPlaces(6)
                        }}
                        {{ intentDetails.intent?.token.symbol }}</span
                      >
                      <span
                        v-if="
                          props.intentDetails.intent?.destination.amount &&
                          rates[props.intentDetails.intent?.token.symbol]
                        "
                        class="text-sm font-medium text-blueGray-600 font-inter"
                        >{{
                          new Decimal(
                            new Decimal(
                              intentDetails.intent?.fees.total || 0
                            ).toDecimalPlaces(6)
                          )
                            .mul(
                              Decimal.div(
                                1,
                                rates[props.intentDetails.intent?.token.symbol]
                              )
                            )
                            .toDecimalPlaces(2)
                        }}
                        USD</span
                      >
                      <Accordion.ItemTrigger class="flex items-center gap-1">
                        <span
                          class="whitespace-nowrap font-medium text-sm text-rose-500 und"
                          >View Breakup</span
                        >
                        <Accordion.ItemIndicator>
                          <ChevronDownIcon class="w-4 h-4 stroke-rose-500" />
                        </Accordion.ItemIndicator>
                      </Accordion.ItemTrigger>
                    </div>
                  </div>
                  <Accordion.ItemContent>
                    <div class="pt-3">
                      <div
                        class="bg-orange-300 w-full bg-opacity-75 rounded-lg p-3 flex flex-col gap-5"
                      >
                        <div class="flex flex-col gap-1 h-full text-center">
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-left text-xs text-blueGray-800">
                              CA Gas Fees:
                            </div>
                            <div
                              class="text-left text-xs font-medium text-blueGray-800"
                            >
                              {{
                                new Decimal(
                                  props.intentDetails.intent?.fees.caGas || 0
                                ).toDecimalPlaces(6)
                              }}
                              {{ props.intentDetails.intent?.token.symbol }}
                            </div>
                          </div>
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-left text-xs text-blueGray-800">
                              Solver Fees:
                            </div>
                            <div
                              class="text-left text-xs font-medium text-blueGray-800"
                            >
                              {{
                                new Decimal(
                                  props.intentDetails.intent?.fees.solver || 0
                                ).toDecimalPlaces(6)
                              }}
                              {{ props.intentDetails.intent?.token.symbol }}
                            </div>
                          </div>
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-left text-xs text-blueGray-800">
                              Protocol Fees:
                            </div>
                            <div
                              class="text-left text-xs font-medium text-blueGray-800"
                            >
                              {{
                                new Decimal(
                                  props.intentDetails.intent?.fees.protocol || 0
                                ).toDecimalPlaces(6) || 0
                              }}
                              {{ props.intentDetails.intent?.token.symbol }}
                            </div>
                          </div>
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-left text-xs text-blueGray-800">
                              Gas Supplied:
                            </div>
                            <div
                              class="text-left text-xs font-medium text-blueGray-800"
                            >
                              0 {{ props.intentDetails.intent?.token.symbol }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Accordion.ItemContent>
                </Accordion.Item>
              </div>

              <div class="flex justify-between items-start">
                <span class="text-base font-normal text-blueGray-700"
                  >Total at Destination</span
                >

                <div class="flex flex-col items-end">
                  <span
                    class="flex items-center gap-2 font-medium text-base text-blueGray-800"
                  >
                    {{ new Decimal(totalSpend()).toDecimalPlaces(6) }}
                    {{ props.intentDetails.intent?.token.symbol }}
                  </span>
                  <span
                    v-if="
                      props.intentDetails.intent?.destination.amount &&
                      rates[props.intentDetails.intent?.token.symbol]
                    "
                    class="text-sm font-medium text-blueGray-600 font-inter"
                    >{{
                      new Decimal(totalSpend())
                        .mul(
                          Decimal.div(
                            1,
                            rates[props.intentDetails.intent?.token.symbol]
                          )
                        )
                        .toDecimalPlaces(2)
                    }}
                    USD</span
                  >
                </div>
              </div>
            </div>
          </Accordion.Root>
        </div>

        <div
          v-else
          class="flex flex-col flex-grow overflow-y-auto bg-orange-200 rounded-2xl border border-background-400 font-inter"
        >
          <Accordion.Root
            multiple
            collapsible
            class="relative z-20 field flex flex-col py-4 px-3 w-full text-center mt-6 rounded-xl"
          >
            <div class="flex items-center justify-between">
              <div class="flex gap-1 flex-col items-start">
                <span class="uppercase text-xs font-semibold text-blueGray-400"
                  >From</span
                >
                <AppTooltip :message="props.formAddress">
                  <span class="text-base font-medium text-blueGray-800">
                    {{ truncateString(props.formAddress) }}
                  </span>
                </AppTooltip>
              </div>
              <ArrowRightIcon class="h-6 w-6 stroke-blueGray-800" />
              <div class="flex gap-1 flex-col items-start">
                <span class="uppercase text-xs font-semibold text-blueGray-400"
                  >To</span
                >
                <AppTooltip :message="props.toAddress">
                  <span class="text-base font-medium text-blueGray-800">
                    {{ truncateString(props.toAddress) }}
                  </span>
                </AppTooltip>
              </div>
            </div>
            <div class="flex flex-col pt-6 gap-4">
              <span
                class="text-base font-semibold text-blueGray-600 uppercase text-left"
                >Transaction Details</span
              >
              <div class="flex justify-between items-start">
                <span class="text-base font-normal text-blueGray-700"
                  >Destination Chain</span
                >
                <span
                  class="flex items-center gap-2 font-medium text-base text-blueGray-800"
                >
                  <img
                    v-if="intentDetails.intent?.destination.chainLogo"
                    :src="getLogo(intentDetails.intent?.destination.chainLogo)"
                    class="h-6 w-6 rounded-full"
                  />
                  {{ props.intentDetails.intent?.destination.chainName }}</span
                >
              </div>
              <div class="flex flex-col">
                <Accordion.Item value="sources" class="flex flex-col">
                  <div class="justify-between items-start flex">
                    <div class="flex items-center gap-2">
                      <span class="text-base font-normal text-blueGray-700"
                        >Spend</span
                      >
                      <AppTooltip message="Spend">
                        <InfoIcon
                          class="h-4 w-4 stroke-blueGray-700 stroke-cap-round"
                        />
                      </AppTooltip>
                    </div>
                    <div class="flex flex-col items-end">
                      <span class="font-medium text-base text-blueGray-800"
                        >{{ props.intentDetails.intent?.destination.amount }}
                        {{ props.intentDetails.intent?.token.symbol }}</span
                      >
                      <span
                        v-if="
                          props.intentDetails.intent?.destination.amount &&
                          rates[props.intentDetails.intent?.token.symbol]
                        "
                        class="text-sm font-medium text-blueGray-600 font-inter"
                        >{{
                          new Decimal(
                            props.intentDetails.intent?.destination.amount
                          )
                            .mul(
                              Decimal.div(
                                1,
                                rates[props.intentDetails.intent?.token.symbol]
                              )
                            )
                            .toDecimalPlaces(2)
                        }}
                        USD</span
                      >
                      <Accordion.ItemTrigger class="flex items-center gap-1">
                        <span
                          class="whitespace-nowrap font-medium text-sm text-rose-500"
                          >View Sources</span
                        >
                        <Accordion.ItemIndicator>
                          <ChevronDownIcon class="w-4 h-4 stroke-rose-500" />
                        </Accordion.ItemIndicator>
                      </Accordion.ItemTrigger>
                    </div>
                  </div>
                  <Accordion.ItemContent>
                    <div class="pt-3">
                      <div
                        class="bg-background-100 w-full bg-opacity-75 rounded-lg p-3 flex flex-col gap-3"
                      >
                        <div
                          v-for="source in props.intentDetails.intent?.sources"
                          :key="source.chainID"
                          class="flex items-center justify-between gap-2"
                        >
                          <div class="flex items-center gap-2">
                            <img
                              :src="getLogo(source.chainLogo)"
                              class="h-6 w-6 rounded-full border border-white-200 border-solid"
                              alt="Logo"
                            />

                            <span class="text-xs text-blueGray-800">{{
                              source?.chainName
                            }}</span>
                          </div>

                          <div class="text-xs font-semibold text-blueGray-800">
                            {{
                              new Decimal(source.amount || 0).toDecimalPlaces(6)
                            }}
                            {{ props.intentDetails.intent?.token.symbol }}
                          </div>
                        </div>
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-xs text-blueGray-800"
                            >Total Source</span
                          >

                          <span class="text-xs font-semibold text-blueGray-800"
                            >{{ props.intentDetails.intent?.sourcesTotal }}
                            {{ props.intentDetails.intent?.token.symbol }}</span
                          >
                        </div>
                        <div
                          class="text-xs font-medium text-blueGray-800 text-start"
                        >
                          <sup>*</sup>Inclusive of the fees
                        </div>
                      </div>
                    </div>
                  </Accordion.ItemContent>
                </Accordion.Item>
              </div>
              <div class="flex flex-col">
                <Accordion.Item value="fee-breakup" class="flex flex-col">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                      <span class="text-base font-normal text-blueGray-700"
                        >Total Fees</span
                      >
                      <AppTooltip message="Total Fees">
                        <InfoIcon
                          class="h-4 w-4 stroke-blueGray-700 stroke-cap-round"
                        />
                      </AppTooltip>
                    </div>
                    <div class="flex flex-col items-end">
                      <span class="font-medium text-sm"
                        >~{{
                          new Decimal(
                            intentDetails.intent?.fees.total || 0
                          ).toDecimalPlaces(6)
                        }}
                        {{ intentDetails.intent?.token.symbol }}</span
                      >
                      <span
                        v-if="
                          props.intentDetails.intent?.destination.amount &&
                          rates[props.intentDetails.intent?.token.symbol]
                        "
                        class="text-sm font-medium text-blueGray-600 font-inter"
                        >{{
                          new Decimal(
                            new Decimal(
                              intentDetails.intent?.fees.total || 0
                            ).toDecimalPlaces(6)
                          )
                            .mul(
                              Decimal.div(
                                1,
                                rates[props.intentDetails.intent?.token.symbol]
                              )
                            )
                            .toDecimalPlaces(2)
                        }}
                        USD</span
                      >
                      <Accordion.ItemTrigger class="flex items-center gap-1">
                        <span
                          class="whitespace-nowrap font-medium text-sm text-rose-500 und"
                          >View Breakup</span
                        >
                        <Accordion.ItemIndicator>
                          <ChevronDownIcon class="w-4 h-4 stroke-rose-500" />
                        </Accordion.ItemIndicator>
                      </Accordion.ItemTrigger>
                    </div>
                  </div>
                  <Accordion.ItemContent>
                    <div class="pt-3">
                      <div
                        class="bg-background-100 w-full bg-opacity-75 rounded-lg p-3 flex flex-col gap-5"
                      >
                        <div class="flex flex-col gap-1 h-full text-center">
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-left text-xs text-blueGray-800">
                              CA Gas Fees:
                            </div>
                            <div
                              class="text-left text-xs font-medium text-blueGray-800"
                            >
                              {{
                                new Decimal(
                                  props.intentDetails.intent?.fees.caGas || 0
                                ).toDecimalPlaces(6)
                              }}
                              {{ props.intentDetails.intent?.token.symbol }}
                            </div>
                          </div>
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-left text-xs text-blueGray-800">
                              Solver Fees:
                            </div>
                            <div
                              class="text-left text-xs font-medium text-blueGray-800"
                            >
                              {{
                                new Decimal(
                                  props.intentDetails.intent?.fees.solver || 0
                                ).toDecimalPlaces(6)
                              }}
                              {{ props.intentDetails.intent?.token.symbol }}
                            </div>
                          </div>
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-left text-xs text-blueGray-800">
                              Protocol Fees:
                            </div>
                            <div
                              class="text-left text-xs font-medium text-blueGray-800"
                            >
                              {{
                                new Decimal(
                                  props.intentDetails.intent?.fees.protocol || 0
                                ).toDecimalPlaces(6) || 0
                              }}
                              {{ props.intentDetails.intent?.token.symbol }}
                            </div>
                          </div>
                          <div class="flex items-center justify-between gap-2">
                            <div class="text-left text-xs text-blueGray-800">
                              Gas Supplied:
                            </div>
                            <div
                              class="text-left text-xs font-medium text-blueGray-800"
                            >
                              0 {{ props.intentDetails.intent?.token.symbol }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Accordion.ItemContent>
                </Accordion.Item>
              </div>

              <div class="flex justify-between items-start">
                <span class="text-base font-normal text-blueGray-700"
                  >Total Spend</span
                >

                <div class="flex flex-col items-end">
                  <span
                    class="flex items-center gap-2 font-medium text-base text-blueGray-800"
                  >
                    {{ totalSpend() }}
                    {{ props.intentDetails.intent?.token.symbol }}
                  </span>
                  <span
                    v-if="
                      props.intentDetails.intent?.destination.amount &&
                      rates[props.intentDetails.intent?.token.symbol]
                    "
                    class="text-sm font-medium text-blueGray-600 font-inter"
                    >{{
                      new Decimal(totalSpend())
                        .mul(
                          Decimal.div(
                            1,
                            rates[props.intentDetails.intent?.token.symbol]
                          )
                        )
                        .toDecimalPlaces(2)
                    }}
                    USD</span
                  >
                </div>
              </div>
            </div>
          </Accordion.Root>
        </div>
        <div
          class="sticky bottom-0 left-0 right-0 z-[99999] flex flex-col w-full pb-5 bg-white-200"
        >
          <div class="flex items-center w-full gap-4 pt-5">
            <button
              class="button-primary w-full uppercase h-11"
              @click.stop="rejectIntentData"
            >
              Cancel
            </button>
            <button
              class="button-secondary w-full uppercase h-11"
              :disabled="props.intentDetails.intentRefreshing"
              @click.stop="submitIntentData"
            >
              {{
                props.intentDetails.intentRefreshing ? "Refreshing" : "Confirm"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
