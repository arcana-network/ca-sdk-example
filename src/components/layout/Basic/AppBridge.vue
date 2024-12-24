<script lang="ts" setup>
import { useTokenStore } from "@/stores/token";
import { useUserStore } from "@/stores/user";
import { AllowanceDataType } from "@/types/allowanceTypes";
import ArrowRightIcon from "@/assets/images/svg/TransactionArrow.svg";
import CheckIcon from "@/assets/images/svg/Check.svg";
import ChevronDownIcon from "@/assets/images/svg/ChevronDown.svg";
import ArrowIcon from "@/assets/images/svg/ArrowUp.svg";
import InfoIcon from "@/assets/images/svg/InfoCircle.svg";
import { Asset, Chain as ChainDetails } from "@/types/balanceTypes";
import { Chain } from "@/types/chainTypes";
import { IntentDataType } from "@/types/intentTypes";
import { clearAsyncInterval, setAsyncInterval } from "@/utils/async_interval";
import { getLogo } from "@/utils/commonFunction";
import { MAINNET_CHAINS } from "@/utils/constants";
import { getCA } from "@/utils/getCA";
import { useErrorToast } from "@/utils/useErrorToast";
import { CA, ProgressStep } from "@arcana/ca-sdk";
import { Avatar, Field, NumberInput, Select } from "@ark-ui/vue";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import {
  Address,
  pad,
  SwitchChainError,
  toBytes,
  toHex,
  zeroAddress,
} from "viem";
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import AppTransaction from "../AppTransaction.vue";
import { switchChain } from "@/utils/switchChain";
import AppTooltip from "@/components/shared/AppTooltip.vue";
import { executeContractFunction } from "@/contract/contractWrite";
import { stargatePoolAddress } from "@/abi/stargatePoolAddress";
import { stargatePoolABI } from "@/abi/stargatePool.abi";

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

const goNext = () => {
  if (stepState.currentStep < stepState.totalSteps) {
    stepState.currentStep++;
  }
};

let caSdkAuth: CA | null = null;
const user = useUserStore();
const tokenStore = useTokenStore();
const userToast = useErrorToast();
const timer = ref<string>("0.00");
const timerInterval = ref<any>();
const openIntentLoader = ref<boolean>(false);
const allowanceLoader = ref<boolean>(false);
const txError = ref<boolean>(false);
const selectedOptions = ref<{
  token: string[];
  chain: string[];
  amount: string | null;
}>({
  token: [""],
  chain: [""],
  amount: null,
});
const submitSteps = ref<{
  inProgress: boolean;
  completed: boolean;
  steps: { type: string; typeID: string; done: boolean; data: any }[];
}>({
  inProgress: false,
  steps: [],
  completed: false,
});
const feeData = ref<{
  maxFeePerGas: string;
  gasPrice: string;
  maxPriorityFeePerGas: string;
}>({
  maxFeePerGas: "0",
  gasPrice: "0",
  maxPriorityFeePerGas: "0",
});
const allowanceData = ref<AllowanceDataType>({
  open: false,
  data: [],
  allow: null,
  deny: null,
});
const intentData = ref<IntentDataType>({
  open: false,
  allow: () => ({}),
  deny: () => ({}),
  refresh: null,
  intent: null,
  intervalHandler: 0,
  intentRefreshing: false,
});
const allLoader = ref<{
  startTransaction: boolean;
  stepsLoader: boolean;
}>({
  startTransaction: false,
  stepsLoader: false,
});

const resetSubmitSteps = () => {
  submitSteps.value.inProgress = false;
  submitSteps.value.steps = [];
  submitSteps.value.completed = false;
};

const getTokenAndChainDetails = (assets: Asset[]) => {
  const tokenSet = new Set<string>();
  const chainMap = new Map<number, ChainDetails>();

  assets.forEach((asset) => {
    tokenSet.add(asset.symbol);

    asset.breakdown.forEach((breakdown) => {
      const chainWithSymbol = {
        ...breakdown.chain,
        abstracted: asset.abstracted,
      };

      if (!chainMap.has(breakdown.chain.id)) {
        chainMap.set(Number(breakdown.chain.id), chainWithSymbol);
      }
    });
  });

  return {
    token: Array.from(tokenSet),
    chain: Array.from(chainMap.values()),
  };
};

const chainList = computed(() => getTokenAndChainDetails(user.assets).chain);

const selectedChain = computed(() => {
  return chainList.value.find(
    (c) => c.id.toString() === selectedOptions.value.chain[0]
  );
});

const selectedToken = computed(() => {
  selectedOptions.value.amount = null;
  return availableTokens.value.find((token) => {
    return token.breakdown.find(
      (b) => b.contractAddress.toString() === selectedOptions.value.token[0]
    );
  });
});

const availableTokens = computed(() => {
  const userAssets = user.assets;

  return userAssets
    .filter((asset) =>
      asset.breakdown.find(
        (b) =>
          b.chain.id.toString() === selectedOptions.value.chain[0].toString()
      )
    )
    .map((asset) => {
      return {
        ...asset,
        value: asset.breakdown.find(
          (b) =>
            b.chain.id.toString() === selectedOptions.value.chain[0].toString()
        )?.contractAddress,
      };
    });
});

const filteredBalance = computed(() => {
  if (selectedToken.value && selectedOptions.value) {
    return selectedToken.value?.breakdown.filter(
      (entry) => entry.chain.id === Number(selectedOptions.value.chain[0])
    );
  }
});

const getChainById = (chainId: number) => {
  return (
    MAINNET_CHAINS.find((chain: Chain) => chain.id === chainId) || ({} as Chain)
  );
};

const reduceFeeData = () => {
  if (selectedOptions.value.token[0] !== zeroAddress) return new Decimal(0);
  const f = new Decimal(
    feeData.value.maxFeePerGas || feeData.value.gasPrice || "0"
  )
    .div(
      Decimal.pow(
        10,
        getChainById(Number(selectedOptions.value.chain[0])).nativeCurrency
          .decimals || 0
      )
    )
    .mul(21000);
  return f.add(Decimal.mul(f, 0.05));
};

const getSymbolByContractAddress = (
  assets: Asset[],
  contractAddress: string
): string => {
  const matchedItem = assets?.filter((item) =>
    item.breakdown.find(
      (item) =>
        item.contractAddress.toLowerCase() === contractAddress.toLowerCase()
    )
  );

  return matchedItem[0].symbol;
};

const startTimer = () => {
  const submissionTime = Date.now();

  timerInterval.value = setInterval(() => {
    timer.value = dayjs().diff(submissionTime, "second", true).toFixed(2);
  }, 20);
};

const intentDataOpen = () => {
  openIntentLoader.value = true;
};

const intentDataClose = () => {
  openIntentLoader.value = false;
};

const startSubmitLoader = () => {
  allLoader.value.stepsLoader = true;
};

const clearTime = () => {
  clearInterval(timerInterval.value);
};

const clearTransferData = () => {
  selectedOptions.value.token = [""];
  selectedOptions.value.chain = [""];
  selectedOptions.value.amount = null;
};

const allowanceLoaderOpen = () => {
  allowanceLoader.value = true;
};

const allowanceLoaderClose = () => {
  allowanceLoader.value = false;
};

type EthereumAddress = `0x${string}`;

function toEthereumAddress(address: string): EthereumAddress {
  if (!address.startsWith("0x") || address.length !== 42) {
    throw new Error("Invalid Ethereum address format.");
  }
  return address as EthereumAddress;
}

const handleBridge = async () => {
  allLoader.value.startTransaction = true;
  allLoader.value.stepsLoader = false;
  txError.value = false;
  resetSubmitSteps();
  try {
    const address: Address = toEthereumAddress(user.walletAddress);
    // const usdtInWei = parseUnits(String(selectedOptions.value.amount), 6);
    const recipientBytes32 = toHex(pad(toBytes(address), { size: 32 }));
    console.log(address, toBytes(address), recipientBytes32, "address");

    const dstEid = 1;
    const to = recipientBytes32;
    const amountLD = BigInt(100_000);

    const params: any = {
      contractAddress: stargatePoolAddress.Polygon.StargatePoolUSDT,
      abi: stargatePoolABI,
      functionName: "quoteOFT",
      args: [[dstEid, to, amountLD, amountLD, "0x0", "0x0", "0x0"]],
      account: address,
    };

    const txHash1 = await executeContractFunction(params);
    console.log(txHash1, "hash 1");

    const params2: any = {
      contractAddress: stargatePoolAddress.Polygon.StargatePoolUSDT,
      abi: stargatePoolABI,
      functionName: "quoteSend",
      args: [],
      value: BigInt("1"),
      account: address,
    };
    const txHash2 = await executeContractFunction(params2);
    console.log(txHash2, "hash 2");

    // if (caSdkAuth) {
    //   await caSdkAuth
    //     .bridge()
    //     .amount(Number(selectedOptions.value.amount))
    //     .chain(Number(selectedOptions.value.chain[0]))
    //     .token(token)
    //     .exec();

    //   submitSteps.value.completed = true;
    // }
  } catch (error) {
    resetSubmitSteps();
    console.log("Transfer Failed:", error);
    allLoader.value.startTransaction = false;
    txError.value = true;
    allowanceLoaderClose();
    clearInterval(timerInterval.value);
    userToast.createErrorToast(error);
    if (
      error instanceof SwitchChainError &&
      error.message.includes("Unrecognized chain ID")
    ) {
      console.error("Chain not recognized. Try adding the chain first.");
      // txErrorMsg.value = "Retry"
      await switchChain(selectedOptions.value.chain[0] as string);
    }
  } finally {
    allLoader.value.startTransaction = false;
    resetIntentData();
    clearTransferData();
    clearInterval(timerInterval.value);
  }
};

const caSDKEventListener = (data: any) => {
  switch (data.type) {
    case "EXPECTED_STEPS": {
      console.log("Expected steps", data.data);
      submitSteps.value.steps = data.data.map((s: ProgressStep) => ({
        ...s,
        done: false,
      }));
      submitSteps.value.inProgress = true;
      break;
    }
    case "STEP_DONE": {
      console.log("Step done", data.data);
      const v = submitSteps.value.steps.find((s) => {
        return s.typeID === data.data.typeID;
      });
      console.log({ v });
      if (v) {
        v.done = true;
        if (data.data.data) {
          v.data = data.data.data;
        }
      }
      break;
    }
  }
};

const handleMax = async () => {
  if (filteredBalance?.value) {
    selectedOptions.value.amount = new Decimal(
      filteredBalance?.value?.[0]?.balance || 0
    )
      .minus(reduceFeeData())
      .toDecimalPlaces(6)
      .toString();

    await nextTick();
  }
};

const handleAmountInput = (event: Event) => {
  const input = (event.target as HTMLInputElement).value;

  if (!input || isNaN(Number(input))) {
    selectedOptions.value.amount = "";
    return;
  }

  const amount = new Decimal(input);

  if (filteredBalance.value) {
    const maxAllowed = new Decimal(
      filteredBalance?.value?.[0]?.balance || 0
    ).minus(reduceFeeData());
    if (amount.greaterThan(maxAllowed)) {
      selectedOptions.value.amount = maxAllowed.lessThan(0)
        ? "0"
        : maxAllowed.toString();
    } else {
      selectedOptions.value.amount = input;
    }
  }
};

const clearIntervalHandler = () => {
  if (intentData.value.intervalHandler != 0) {
    clearAsyncInterval(intentData.value.intervalHandler);
    intentData.value.intervalHandler = 0;
  }
};

const resetIntentData = () => {
  intentData.value.open = false;
  intentData.value.allow = () => ({});
  intentData.value.deny = () => ({});
  intentData.value.refresh = null;
  intentData.value.intent = null;
};

const resetAllowanceData = () => {
  allowanceData.value.open = false;
  allowanceData.value.allow = () => ({});
  allowanceData.value.deny = () => ({});
  allowanceData.value.data = [];
};

const setupAllowanceHook = (caSdkAuth: CA) => {
  caSdkAuth.setOnAllowanceHook(async ({ allow, deny, sources }: any) => {
    allowanceData.value.open = true;
    allowanceData.value.allow = allow;
    allowanceData.value.deny = deny;
    allowanceData.value.data = sources;
  });
};

const setupIntentHook = (caSdkAuth: CA) => {
  caSdkAuth.setOnIntentHook(({ intent, allow, deny, refresh }: any) => {
    console.log({ intent });
    resetAllowanceData();
    intentData.value.open = true;
    intentData.value.allow = allow;
    intentData.value.deny = deny;
    intentData.value.refresh = refresh;
    intentData.value.intent = intent;
    setTimeout(() => {
      intentData.value.intervalHandler = setAsyncInterval(async () => {
        if (intentData.value.refresh) {
          console.log("intentRefreshStarted");
          intentData.value.intentRefreshing = true;
          intentData.value.intent = await intentData.value.refresh!();
          intentData.value.intentRefreshing = false;
          console.log("intentRefreshEnded");
        }
      }, 5000);
    }, 5000);
  });
};

watch(
  () => tokenStore.selectedToken,
  (newToken: Asset | null) => {
    if (newToken) {
      selectedOptions.value.chain = [newToken.breakdown[0].chain.id.toString()];
      selectedOptions.value.token = [
        newToken.breakdown[0].contractAddress.toString(),
      ];
    }
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    caSdkAuth = await getCA();
    if (caSdkAuth) {
      setupAllowanceHook(caSdkAuth);
      setupIntentHook(caSdkAuth);
      caSdkAuth.addCAEventListener(caSDKEventListener);
    }
  } catch (error) {
    console.error("Error initializing CA SDK Auth:", error);
  }
});

onUnmounted(() => {
  if (caSdkAuth) {
    caSdkAuth.removeCAEventListener(caSDKEventListener);
  }
});
</script>

<template>
  <div class="relative">
    <button
      @click="handleBack"
      class="absolute top-6 left-2 bg-orange-200 border border-orange-800 p-4 rounded-full"
    >
      <ArrowRightIcon class="h-4 w-4 stroke-blueGray-800 rotate-180" />
    </button>

    <h2
      class="text-xl font-nohemi font-semibold text-blueGray-800 mt-9 text-center"
    >
      {{
        allLoader.stepsLoader === true
          ? "Processing Transaction"
          : allowanceData.open === true
          ? "Spend Allowance"
          : intentData.open === true
          ? "Send Transaction"
          : "Bridge"
      }}
    </h2>

    <div v-if="stepState.currentStep === 1">
      <div
        class="mt-6 space-y-4 text-blueGray-800 font-inter font-normal text-sm max-md:w-full"
      >
        <Field.Root>
          <Select.Root
            v-model="selectedOptions.chain"
            class="w-full flex flex-col gap-1 relative z-40 isolate"
            :items="chainList"
          >
            <Select.Label
              class="font-inter text-sm font-normal text-blueGray-800 placeholder:text-blueGray-600"
              >Destination Chain</Select.Label
            >
            <Select.Control class="outline-none field">
              <Select.Trigger
                class="flex rounded-md items-center w-full font-inter text-base font-medium text-blueGray-800 shadow-sm bg-white-100 text-start h-14 px-4 py-2 border border-background-400 placeholder:text-blueGray-600"
              >
                <div
                  class="flex-grow flex items-center gap-2 font-medium text-base"
                >
                  <Avatar.Root>
                    <Avatar.Image
                      :src="getLogo(selectedChain?.logo)"
                      class="w-5 h-5 rounded-full"
                    />
                  </Avatar.Root>
                  <span>{{ selectedChain?.name || "Chain" }}</span>
                  <div
                    v-if="selectedChain?.abstracted"
                    class="text-rose-500 text-0.625rem font-inter font-normal flex items-center gap-1 p-1 rounded-full bg-rose-200"
                  >
                    Chain Abstracted
                    <AppTooltip message="Chain Abstracted">
                      <InfoIcon
                        class="h-3 w-3 stroke-rose-500 stroke-cap-round"
                      />
                    </AppTooltip>
                  </div>
                </div>
                <Select.Indicator>
                  <ChevronDownIcon class="w-4 h-4 stroke-blueGray-800" />
                </Select.Indicator>
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner class="w-full z-50">
              <Select.Content
                class="max-h-60 w-full rounded-lg text-sm bg-white-100"
              >
                <Select.ItemGroup>
                  <Select.Item
                    v-for="chain in chainList"
                    :key="chain.id"
                    :item="chain.id.toString()"
                    class="px-4 py-3 w-full flex rounded-md justify-between hover:bg-blueGray-300"
                  >
                    <div class="flex items-center gap-2">
                      <Avatar.Root>
                        <Avatar.Fallback class="w-5 h-5 rounded-full">{{
                          chain.name.split(" ")[0].substring(0, 2).toUpperCase()
                        }}</Avatar.Fallback>
                        <Avatar.Image
                          :src="getLogo(chain.logo)"
                          class="w-5 h-5 rounded-full"
                        />
                      </Avatar.Root>
                      <span>{{ chain.name }}</span>
                      <div
                        v-if="chain?.abstracted"
                        class="text-rose-500 text-0.625rem font-inter font-normal flex items-center gap-1 p-1 rounded-full bg-rose-200"
                      >
                        Chain Abstracted
                        <AppTooltip message="Chain Abstracted">
                          <InfoIcon
                            class="h-3 w-3 stroke-rose-500 stroke-cap-round"
                          />
                        </AppTooltip>
                      </div>
                      <Select.ItemText class="hidden">{{
                        chain.id
                      }}</Select.ItemText>
                    </div>
                    <Select.ItemIndicator
                      ><CheckIcon class="w-5 h-5 stroke-black-700"
                    /></Select.ItemIndicator>
                  </Select.Item>
                </Select.ItemGroup>
              </Select.Content>
            </Select.Positioner>
            <Select.HiddenSelect />
          </Select.Root>
        </Field.Root>

        <Field.Root>
          <Select.Root
            v-model="selectedOptions.token"
            class="w-full flex flex-col gap-1 relative z-10 isolate"
            :items="availableTokens"
          >
            <Select.Label
              class="font-inter text-sm font-normal text-blueGray-800 placeholder:text-blueGray-600"
              >Token</Select.Label
            >
            <Select.Control class="outline-none field">
              <Select.Trigger
                class="flex rounded-md items-center w-full font-inter text-base font-medium text-blueGray-800 shadow-sm bg-white-100 text-start h-14 px-4 py-2 border border-background-400 placeholder:text-blueGray-600"
              >
                <div
                  class="flex-grow flex items-center gap-2 font-medium text-base"
                >
                  <Avatar.Root>
                    <Avatar.Image
                      :src="getLogo(selectedToken?.icon)"
                      class="w-5 h-5 rounded-full"
                    />
                  </Avatar.Root>
                  <span>{{ selectedToken?.symbol || "Token" }}</span>
                </div>
                <Select.Indicator>
                  <ChevronDownIcon class="w-4 h-4 stroke-blueGray-800" />
                </Select.Indicator>
              </Select.Trigger>
            </Select.Control>
            <Select.Positioner class="w-full z-50">
              <Select.Content
                class="max-h-60 w-full rounded-lg text-sm bg-white-100"
              >
                <Select.ItemGroup>
                  <Select.Item
                    v-for="token in availableTokens"
                    :key="token.breakdown[0].contractAddress"
                    :item="token.breakdown[0].contractAddress"
                    class="px-4 py-3 w-full flex rounded-md justify-between hover:bg-blueGray-300"
                  >
                    <div class="flex items-center gap-2">
                      <Avatar.Root>
                        <Avatar.Fallback class="w-5 h-5 rounded-full">{{
                          token.symbol
                            .split(" ")[0]
                            .substring(0, 2)
                            .toUpperCase()
                        }}</Avatar.Fallback>
                        <Avatar.Image
                          :src="getLogo(token.icon)"
                          class="w-5 h-5 rounded-full"
                        />
                      </Avatar.Root>
                      <span>{{ token.symbol }}</span>
                    </div>
                    <Select.ItemIndicator
                      ><CheckIcon class="w-4 h-4 stroke-black-700"
                    /></Select.ItemIndicator>
                  </Select.Item>
                </Select.ItemGroup>
              </Select.Content>
            </Select.Positioner>
            <Select.HiddenSelect />
          </Select.Root>
        </Field.Root>

        <Field.Root>
          <NumberInput.Root>
            <NumberInput.Label
              class="font-inter text-sm font-normal text-blueGray-800"
              >Amount</NumberInput.Label
            >

            <div class="relative flex items-center">
              <NumberInput.Input
                :value="selectedOptions.amount"
                class="w-full shadow-sm border border-background-400 placeholder:text-blueGray-600 mt-1"
                placeholder="0"
                :min="0"
                @input="handleAmountInput"
                @focus="
                  () => {
                    if (
                      selectedOptions.amount &&
                      new Decimal(selectedOptions.amount).greaterThan(
                        new Decimal(filteredBalance?.[0]?.balance || 0)
                          .minus(reduceFeeData())
                          .toNumber()
                      )
                    ) {
                      selectedOptions.amount = new Decimal(
                        filteredBalance?.[0]?.balance || 0
                      )
                        .minus(reduceFeeData())
                        .toString();
                      if (new Decimal(selectedOptions.amount).lessThan(0)) {
                        selectedOptions.amount = '0';
                      }
                    }
                  }
                "
              />

              <span
                class="absolute flex items-center gap-2 right-2 px-4 py-1 text-sm font-semibold font-inter uppercase border-l-2 border-blueGray-200 cursor-pointer text-blueGray-700"
                :disabled="!selectedToken"
                @click.stop="handleMax"
              >
                <ArrowIcon class="stroke-blueGray-700" />
                Max
              </span>
            </div>
          </NumberInput.Root>
        </Field.Root>

        <div class="flex items-center justify-start">
          Available:
          {{
            new Decimal(filteredBalance?.[0]?.balance || "0").toDecimalPlaces(6)
          }}
          {{ selectedToken?.symbol }}
        </div>
      </div>
    </div>

    <AppTransaction
      :allowance-details="allowanceData"
      :intent-details="intentData"
      :form-address="user.walletAddress"
      :to-address="user.walletAddress"
      :submit-steps="submitSteps"
      :timer="timer"
      :open-intent-loader="openIntentLoader"
      :interection="allLoader.startTransaction"
      :submit-loader="allLoader.stepsLoader"
      :tx-error="txError"
      :allowanceLoader="allowanceLoader"
      :stepState="stepState"
      type="Receive"
      @start-submit-loader="startSubmitLoader"
      @continue="handleBridge"
      @rest-intent-data="resetIntentData"
      @start-timer="startTimer"
      @close-modal="goBack"
      @intentDataOpen="intentDataOpen"
      @intentDataClose="intentDataClose"
      @clearTime="clearTime"
      @rest-allowance-data="resetAllowanceData"
      @allowance-loader-open="allowanceLoaderOpen"
      @next-step="goNext"
      @clearIntentHandler="clearIntervalHandler"
    />
  </div>
</template>
