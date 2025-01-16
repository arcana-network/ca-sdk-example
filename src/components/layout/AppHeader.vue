<script lang="ts" setup>
import { Avatar, Menu } from "@ark-ui/vue";

import CopyButton from "@/components/shared/CopyButton.vue";
import { useUserStore } from "@/stores/user";
import { truncateString } from "@/utils/commonFunction";

const props = defineProps<{
  disconnect: () => void;
}>();

const links = {
  howItWorks:
    "https://blog.arcana.network/introducing-arcana-chain-abstraction-sdk",
  scheduleDemo:
    "https://calendly.com/arcana-network/arcana-demo-walkthrough?month=2024-04",
  docs: "https://docs.arcana.network",
};

const user = useUserStore();
</script>

<template>
  <div class="h-5.125rem">
    <header
      class="flex bg-background-300 py-1.0625rem pr-2rem pl-2.02731rem justify-between items-center"
    >
      <div class="flex items-center gap-4">
        <img
          src="@/assets/images/png/ArcanaPayLogo.png?url"
          alt="Logo"
          class="h-3rem"
        />
      </div>

      <div class="flex items-center gap-8 max-md:gap-2">
        <div
          class="relative flex justify-end gap-8 items-center text-white font-inter z-10 max-md:gap-2"
        >
          <a
            :href="links.howItWorks"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-base text-blueGray-800 no-underline active:no-underline hover:no-underline hover:text-rose-500"
          >
            How it Works
          </a>

          <a
            :href="links.scheduleDemo"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-base text-blueGray-800 no-underline active:no-underline hover:no-underline hover:text-rose-500"
          >
            Schedule a Demo
          </a>

          <a
            :href="links.docs"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-base text-blueGray-800 no-underline active:no-underline hover:no-underline hover:text-rose-500"
          >
            Docs
          </a>
        </div>
        <div
          v-if="user.isWalletConnected"
          class="flex items-center justify-end gap-10"
        >
          <Menu.Root>
            <Menu.Trigger
              class="flex items-center border-none hover:bg-none focus:outline-none active:border-none"
            >
              <div class="flex justify-center items-center gap-2">
                <Avatar.Root>
                  <img
                    src="@/assets/images/svg/Wallet.svg?url"
                    alt="avatar"
                    class="h-12 w-12 rounded-6.25rem"
                  />
                </Avatar.Root>

                <div class="flex flex-col items-start justify-between gap-1">
                  <div class="flex items-center justify-between gap-2">
                    <span
                      class="text-maroon-800 font-inter text-base font-semibold uppercase"
                      >Wallet</span
                    >
                  </div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-maroon-800 font-inter text-xs">{{
                      truncateString(user.walletAddress, 5, 5)
                    }}</span>
                    <span>
                      <CopyButton
                        :content="user.walletAddress"
                        copied="Copied"
                        copy="Click to copy"
                        button-class="stroke-maroon-800 h-3"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content
                class="p-5 rounded-1.25rem border-2 border-white-700 bg-background-300 shadow-0_0_38px_0_00000026 focus:outline-none active:border-none"
              >
                <MenuItem
                  class="flex justify-start items-center p-2 h-2.75rem rounded-0.75rem border border-background-400 bg-background-400 bg-opacity-50 cursor-pointer"
                  @click.stop="() => props.disconnect()"
                >
                  <span
                    class="font-nohemi text-0.875rem font-medium text-blueGray-800"
                  >
                    Disconnect Wallet</span
                  >
                </MenuItem>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </div>
      </div>
    </header>
  </div>
</template>
