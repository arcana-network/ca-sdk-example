<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { Asset, Breakdown, Chain as ChainDetails } from "@/types/balanceTypes";
import readable from "readable-numbers";
import { formatNumber, getLogo } from "@/utils/commonFunction";
import { getCA } from "@/utils/getCA";
import { CA } from "@arcana/ca-sdk";
import { Accordion, Avatar, Select } from "@ark-ui/vue";
import Decimal from "decimal.js";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppTooltip from "@/components/shared/AppTooltip.vue";
import ChevronDownIcon from "@/assets/images/svg/ChevronDown.svg";
import AppSend from "@/components/layout/Unified/AppSend.vue";
import AppBridge from "@/components/layout/Unified/AppBridge.vue";
import AppBasicSend from "@/components/layout/Basic/AppSend.vue";
import AppBasicBridge from "@/components/layout/Basic/AppBridge.vue";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";

const user = useUserStore();
const balances = ref<Asset[]>([]);
const balanceLoader = ref<boolean>(true);
const stepState = ref<{
  showSendSteps: boolean;
  showBridgeSteps: boolean;
  showBasicSendSteps: boolean;
  showBasicBridgeSteps: boolean;
}>({
  showSendSteps: false,
  showBridgeSteps: false,
  showBasicSendSteps: false,
  showBasicBridgeSteps: false,
});
const singleAssetChain = ref<{
  chain: string[];
}>({
  chain: ["1"],
});

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
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
    (c) => c.id.toString() === singleAssetChain.value.chain[0]
  );
});

const selectedChainName = computed(() => {
  return chainList.value.find(
    (c) => c.id.toString() === singleAssetChain.value.chain[0]
  );
});

console.log(selectedChainName);

const setBalancePolling = (ca: CA) => {
  setInterval(async () => {
    balances.value = await ca.getUnifiedBalances();
  }, 20000);
};

onMounted(async () => {
  const ca = await getCA();
  const allBalance = await ca.getUnifiedBalances();
  balances.value = allBalance;
  user.setAsset(allBalance);
  console.log(allBalance);

  balanceLoader.value = false;
  setBalancePolling(ca);
});

const getBreakdownImageArray = (breakdown: Breakdown[]) => {
  const length = breakdown.length;
  const spliceLength = length > 3 ? 2 : length;
  return [...breakdown].slice(0, spliceLength);
};

const totalFiatBalance = computed(() => {
  if (user.assets.length) {
    return user.assets.reduce(
      (total, asset) => total + (asset.balanceInFiat || 0),
      0
    );
  }
  return 0;
});

const getAssetsByChainId = (chainId: number) => {
  return user.assets.flatMap((asset) =>
    asset.breakdown
      .filter((breakdown) => breakdown.chain.id === chainId)
      .map((breakdown) => ({
        symbol: asset.symbol,
        icon: asset.icon,
        chainLogo: breakdown.chain.logo,
        balance: breakdown.balance,
        balanceInFiat: breakdown.balanceInFiat,
      }))
  );
};

const filteredAssets = computed(() => {
  const chainId = selectedChain.value?.id ?? 0;
  return getAssetsByChainId(chainId);
});

const totalAssetBalanceInFiat = computed(() => {
  return filteredAssets.value.reduce(
    (total, asset) => total + asset.balanceInFiat,
    0
  );
});

const resetSteps = () => {
  stepState.value = {
    showSendSteps: false,
    showBridgeSteps: false,
    showBasicSendSteps: false,
    showBasicBridgeSteps: false,
  };
};

const startSendSteps = () => {
  resetSteps();
  stepState.value.showSendSteps = true;
};

const startBridgeSteps = () => {
  resetSteps();
  stepState.value.showBridgeSteps = true;
};

const backSendSteps = () => {
  stepState.value.showSendSteps = false;
};

const backBridgeSteps = () => {
  stepState.value.showBridgeSteps = false;
};

const startBasicSendSteps = () => {
  resetSteps();
  stepState.value.showBasicSendSteps = true;
};

const startBasicBridgeSteps = () => {
  resetSteps();
  stepState.value.showBasicBridgeSteps = true;
};

const backBasicSendSteps = () => {
  stepState.value.showBasicSendSteps = false;
};

const backBasicBridgeSteps = () => {
  stepState.value.showBasicBridgeSteps = false;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div class="flex gap-12 w-full items-start max-md:flex-col">
    <div
      class="w-full lg:w-1/2 bg-background-500 p-6 rounded-lg shadow-lg flex flex-col"
    >
      <div class="flex justify-between items-center">
        <div class="font-nohemi text-blueGray-800 text-2xl font-semibold">
          Basic Apps
        </div>
        <Select.Root
          v-model="singleAssetChain.chain"
          class="w-52 flex flex-col gap-1 relative z-50 isolate"
          :items="chainList"
        >
          <Select.Control class="outline-none field">
            <Select.Trigger
              class="flex rounded-xl items-center w-full font-inter text-base font-medium text-blueGray-800 shadow-sm bg-white-100 text-start h-8 px-4 py-2 border border-background-400 placeholder:text-blueGray-600"
            >
              <div
                class="flex-grow flex items-center gap-2 font-medium text-sm"
              >
                <Avatar.Root>
                  <Avatar.Image
                    :src="getLogo(selectedChain?.logo)"
                    class="w-5 h-5 rounded-full"
                  />
                </Avatar.Root>
                <span>{{ selectedChain?.name || "Chain" }}</span>
              </div>
              <Select.Indicator>
                <ChevronDownIcon class="w-4 h-4 stroke-blueGray-800" />
              </Select.Indicator>
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner class="w-full z-50">
            <Select.Content
              class="max-h-60 w-full rounded-lg text-sm bg-white-100 font-inter"
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
      </div>

      <div
        class="h-full flex flex-col"
        v-if="!stepState.showBasicSendSteps && !stepState.showBasicBridgeSteps"
      >
        <div class="flex-1 flex flex-col gap-8 mt-6">
          <div
            class="border p-4 rounded-lg flex flex-col bg-background-700 border-background-400"
          >
            <div
              class="font-inter text-blueGray-900 text-sm font-semibold mb-2 text-center uppercase opacity-40"
            >
              Single Chain, Fragmented Balance
            </div>
            <div
              class="font-inter text-3xl text-maroon-800 font-semibold text-center"
            >
              ${{ formatNumber(totalAssetBalanceInFiat) }}
            </div>
          </div>

          <div
            class="border p-4 rounded-lg flex flex-col bg-background-700 border-background-400 font-inter h-18.125rem"
            :class="{ 'h-auto': balanceLoader }"
          >
            <div
              v-if="balanceLoader"
              class="flex justify-center items-center h-12"
            >
              <FadeLoader
                :loading="balanceLoader"
                color="#1D2A31"
                size="10rem"
              />
            </div>

            <div
              v-else
              class="flex justify-between items-center px-3 py-1"
              v-for="(balance, i) in filteredAssets"
              :key="i"
            >
              <div class="flex items-center h-14 space-x-4">
                <div class="relative isolate">
                  <img
                    :src="getLogo(balance.icon)"
                    class="h-7 w-7 rounded-full bg-white-100"
                    alt="Logo"
                  />
                  <img
                    :src="getLogo(balance.chainLogo)"
                    class="absolute z-50 rounded-full border border-solid border-white-100 h-3.5 w-3.5 -bottom-1 -right-1"
                    alt="Logo"
                  />
                </div>
                <div class="flex items-center gap-1">
                  <span
                    class="inline-block align-middle text-ellipsis overflow-hidden text-sm font-normal leading-5 text-black-900"
                    >{{ balance.symbol }}
                  </span>
                </div>
              </div>
              <div
                class="flex flex-col items-end text-blueGray-800 max-xl:w-40"
              >
                <AppTooltip
                  :message="`$${formatNumber(
                    balance.balanceInFiat
                  )} (${new Decimal(balance.balance)} ${balance.symbol})`"
                >
                  <span class="text-base font-medium flex items-center gap-1"
                    >{{
                      readable(
                        new Decimal(balance.balance)
                          .toDecimalPlaces(4)
                          .toNumber()
                      )
                    }}
                    <span
                      class="inline-block align-middle max-w-6ch text-ellipsis overflow-x-hidden"
                      >{{ balance.symbol }}</span
                    ></span
                  >
                </AppTooltip>
                <span class="text-sm font-medium text-blueGray-600 font-inter">
                  {{
                    readable(
                      new Decimal(balance.balanceInFiat)
                        .toDecimalPlaces(4)
                        .toNumber()
                    )
                  }}
                  USD
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-auto pt-4">
          <div class="flex gap-4">
            <button
              class="button-primary w-full h-11"
              @click.stop="startBasicBridgeSteps"
            >
              Bridge
            </button>
            <button
              class="button-primary w-full h-11"
              @click.stop="startBasicSendSteps"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <AppBasicSend
        :selectedChain="singleAssetChain.chain"
        :chainName="selectedChain?.name"
        @back-step="backBasicSendSteps"
        v-if="stepState.showBasicSendSteps"
      />
      <AppBasicBridge
        @back-step="backBasicBridgeSteps"
        :selectedChain="singleAssetChain.chain"
        v-if="stepState.showBasicBridgeSteps"
      />
    </div>

    <div
      class="w-full lg:w-1/2 bg-rose-800 p-6 rounded-lg shadow-lg flex flex-col"
    >
      <div class="flex justify-between items-center">
        <div class="font-nohemi text-blueGray-800 text-2xl font-semibold">
          {{
            windowWidth <= 1280
              ? "CA Enabled App"
              : "Chain Abstraction Enabled App"
          }}
        </div>
        <div
          class="text-rose-500 text-xs font-inter font-semibold flex items-center gap-1 px-4 py-2 rounded-full bg-rose-200"
        >
          Multi-chain by Default
        </div>
      </div>

      <div
        class="h-full flex flex-col"
        v-if="!stepState.showSendSteps && !stepState.showBridgeSteps"
      >
        <div class="flex-1 flex flex-col gap-8 mt-6">
          <div
            class="border p-4 rounded-lg flex flex-col bg-white-900 border-background-400"
          >
            <div
              class="font-inter text-maroon-800 text-sm font-semibold mb-2 text-center uppercase opacity-40"
            >
              Multi-chain, Unified Balance
            </div>
            <div
              class="font-inter text-3xl text-maroon-800 font-semibold text-center"
            >
              ${{ formatNumber(totalFiatBalance) }}
            </div>
          </div>

          <div
            class="border p-4 rounded-lg bg-white-900 border-background-400 font-inter"
          >
            <div
              v-if="balanceLoader"
              class="flex justify-center items-center h-12"
            >
              <FadeLoader
                :loading="balanceLoader"
                color="#1D2A31"
                size="10rem"
              />
            </div>

            <div
              v-else
              class="flex flex-col"
              v-for="(asset, i) in balances"
              :key="i"
            >
              <Accordion.Root
                v-if="balances.length"
                v-auto-animate
                collapsible
                multiple
                class="flex flex-col gap-4 overflow-y-auto field p-3"
              >
                <Accordion.Item :value="JSON.stringify(asset.breakdown)">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1">
                        <div class="flex items-center gap-4">
                          <div class="relative isolate">
                            <img
                              :src="getLogo(asset.icon)"
                              class="h-7 w-7 rounded-full bg-white-100"
                              alt="Logo"
                            />
                            <img
                              v-for="(b, index) in getBreakdownImageArray(
                                asset.breakdown
                              )"
                              :key="b.chain.id"
                              :src="getLogo(b.chain.logo)"
                              :class="{
                                'absolute rounded-full border border-solid border-white-100': true,
                                'h-2.5 w-2.5': asset.breakdown.length > 1,
                                'h-3.5 w-3.5 -bottom-1 -right-1':
                                  asset.breakdown.length === 1,
                                'right-0 -bottom-1':
                                  asset.breakdown.length > 1 && index === 0,
                                'bottom-0 -right-1':
                                  asset.breakdown.length > 1 && index === 1,
                                'bottom-1.5 -right-1.5':
                                  asset.breakdown.length > 1 && index === 2,
                              }"
                              :style="{
                                zIndex: `${index + 1}`,
                              }"
                              alt="Logo"
                            />
                            <div
                              v-if="asset.breakdown.length > 3"
                              :class="{
                                'absolute rounded-full border border-solid bg-blue-100 border-white-100 h-2.5 w-2.5 bottom-1.5 -right-1.5 flex items-center justify-center bg-blue-500': true,
                              }"
                              :style="{
                                zIndex: asset.breakdown.length,
                              }"
                            >
                              <span
                                v-if="asset.breakdown.length > 11"
                                class="text-0.25rem text-white font-semibold tabular-nums text-white-200"
                              >
                                +9
                              </span>
                              <span
                                v-else
                                class="text-0.25rem text-white font-semibold tabular-nums text-white-200"
                                >+{{ asset.breakdown.length - 2 }}</span
                              >
                            </div>
                          </div>
                          <div class="flex flex-col">
                            <div class="flex items-center gap-1">
                              <span
                                class="inline-block align-middle max-w-6ch text-ellipsis overflow-hidden font-inter text-base font-normal leading-5 text-black-900"
                                >{{ asset.symbol }}</span
                              >
                            </div>
                            <Accordion.ItemTrigger
                              class="flex items-center gap-1"
                            >
                              <span
                                class="text-xs font-inter font-normal text-blue-500"
                                >{{ asset.breakdown.length }} chain{{
                                  asset.breakdown.length > 1 ? "s" : ""
                                }}</span
                              >
                              <Accordion.ItemIndicator>
                                <ChevronDownIcon
                                  class="h-4 w-4 stroke-blue-500"
                                />
                              </Accordion.ItemIndicator>
                            </Accordion.ItemTrigger>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="flex flex-col items-end text-blueGray-800 max-xl:w-40"
                    >
                      <AppTooltip
                        :message="`$${formatNumber(
                          asset.balanceInFiat
                        )} (${new Decimal(asset.balance)} ${asset.symbol})`"
                      >
                        <div
                          class="flex items-center justify-center gap-2 font-inter text-base font-normal leading-5"
                        >
                          {{
                            readable(
                              new Decimal(asset.balance)
                                .toDecimalPlaces(4)
                                .toNumber()
                            )
                          }}
                          <span
                            class="inline-block align-middle max-w-6ch text-ellipsis overflow-hidden"
                            >{{ asset.symbol }}</span
                          >
                        </div>
                      </AppTooltip>
                      <span
                        class="text-sm font-medium text-blueGray-600 font-inter"
                      >
                        {{
                          readable(
                            new Decimal(asset.balanceInFiat)
                              .toDecimalPlaces(4)
                              .toNumber()
                          )
                        }}
                        USD
                      </span>
                    </div>
                  </div>
                  <Accordion.ItemContent>
                    <div class="pt-3">
                      <div
                        class="bg-background-400 bg-opacity-75 py-4 px-2 rounded-lg"
                      >
                        <div class="flex flex-col gap-4">
                          <div
                            v-for="token in asset.breakdown"
                            :key="token.network"
                            class="flex items-center justify-between font-inter text-base font-normal leading-5 text-black-700"
                          >
                            <span class="flex items-center gap-3">
                              <div class="relative isolate">
                                <img
                                  :src="getLogo(asset.icon)"
                                  class="relative z-10 h-5 w-5 rounded-full bg-white-100"
                                  alt="Logo"
                                />
                                <img
                                  :src="getLogo(token.chain.logo)"
                                  class="absolute h-3 w-3 z-20 rounded-full -bottom-3px -right-3px border border-solid border-white-100"
                                  alt="Logo"
                                />
                              </div>
                              <span class="text-xs"
                                ><span
                                  class="inline-block align-middle max-w-6ch text-ellipsis overflow-hidden"
                                  >{{ asset.symbol }}</span
                                >
                                ({{ token.chain.name }})</span
                              >
                            </span>
                            <div
                              class="font-inter text-base font-normal leading-5 text-blueGray-800"
                            >
                              <AppTooltip
                                :message="`$${formatNumber(
                                  token.balanceInFiat
                                )} (${new Decimal(token.balance)} ${
                                  asset.symbol
                                })`"
                              >
                                <span class="text-xs flex items-center gap-1"
                                  >{{
                                    readable(
                                      new Decimal(token.balance)
                                        .toDecimalPlaces(4)
                                        .toNumber()
                                    )
                                  }}
                                  <span
                                    class="inline-block align-middle max-w-6ch text-ellipsis overflow-x-hidden"
                                    >{{ asset.symbol }}</span
                                  ></span
                                >
                              </AppTooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Accordion.ItemContent>
                </Accordion.Item>
              </Accordion.Root>
            </div>
          </div>
        </div>

        <div class="mt-auto pt-4">
          <div class="flex gap-4">
            <button
              class="button-primary w-full h-11"
              @click.stop="startBridgeSteps"
            >
              Bridge Unified Balance
            </button>
            <button
              class="button-primary w-full h-11"
              @click.stop="startSendSteps"
            >
              Send Unified Balance
            </button>
          </div>
        </div>
      </div>

      <AppSend @back-step="backSendSteps" v-if="stepState.showSendSteps" />
      <AppBridge
        @back-step="backBridgeSteps"
        v-if="stepState.showBridgeSteps"
      />
    </div>
  </div>
</template>
