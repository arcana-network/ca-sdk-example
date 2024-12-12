<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Accordion } from '@ark-ui/vue/accordion'
import { getCA } from "../utils/getCA"
import ChevronDownIcon from "./ChevronDown.vue"
import { CA } from '@arcana/ca-sdk';
import Decimal from "decimal.js";

type BalancesType = Awaited<ReturnType<CA["getUnifiedBalances"]>>
const balances = ref<BalancesType>([]);
let address = ref("");

const setBalancePolling = (ca: CA) => {
    setInterval(async () => {
        balances.value = await ca.getUnifiedBalances();
    }, 20000)
}
onMounted(async () => {
    const ca = await getCA();

    const accounts = (await ca.request({ method: "eth_accounts" })) as string[][0]
    console.log({ accounts })
    address.value = accounts;

    balances.value = await ca.getUnifiedBalances();
    console.log({ balances })
    setBalancePolling(ca)
});

</script>

<template>
    <aside id="logo-sidebar" class="basis-1/5 min-h-screen" aria-label="Sidebar">
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <p
                class="text-center p-4 mb-4 font-bold leading-none tracking-tight text-gray-900 border-2 border-gray-200 rounded-lg dark:text-white">
                {{ address }}</p>
            <h5 id="drawer-navigation-label" class="mb-4 text-xl font-bold leading-none text-gray-900 dark:text-white">
                Balances</h5>
            <!-- <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"> -->

            <Accordion.Root collapsible multiple
                class="flex flex-col overflow-y-auto field divide-y divide-gray-200 dark:divide-gray-700"
                v-if="balances.length">
                <Accordion.Item v-for="balance in balances" :key="JSON.stringify(balance.breakdown)"
                    :value="JSON.stringify(balance.breakdown)" class="py-3">
                    <div class="flex justify-between">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ balance.symbol }}

                            <Accordion.ItemTrigger class="flex items-center gap-1">
                                <span class="text-[12px] text-gray-500">{{ balance.breakdown.length }} chain{{
                                    balance.breakdown.length > 1 ? "s" : ""
                                }}</span>
                                <Accordion.ItemIndicator>
                                    <ChevronDownIcon class="h-3 w-3 text-gray-500" />
                                </Accordion.ItemIndicator>
                            </Accordion.ItemTrigger>
                        </div>
                        <div class="text-gray-900 dark:text-white text-base font-semibold">
                            {{ new Decimal(balance.balance).toDecimalPlaces(4).toNumber() }} {{ balance.symbol }}
                        </div>
                    </div>
                    <Accordion.ItemContent class="pt-2">
                        <div class="p-3 bg-gray-900 font-xs rounded-lg space-y-4">
                            <div v-for="token in balance.breakdown" class="flex items-center justify-between ">
                                <div class="text-xs text-gray-900 dark:text-white">{{ `${balance.symbol}
                                    (${token.chain.name})` }}
                                </div>
                                <div class="text-xs text-gray-900 dark:text-white">
                                    {{ `${new Decimal(token.balance)
                                        .toDecimalPlaces(4)
                                        .toNumber()} ${balance.symbol}` }}
                                </div>
                            </div>
                        </div>
                    </Accordion.ItemContent>
                    <!-- <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"> -->
                </Accordion.Item>
            </Accordion.Root>
        </div>
    </aside>
</template>