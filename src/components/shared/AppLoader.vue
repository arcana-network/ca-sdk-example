<script lang="ts" setup>
const props = defineProps<{
  chain: string | undefined;
  loader: {
    inProgress: boolean;
    completed: boolean;
    error: boolean;
  };
}>();
</script>

<template>
  <div class="h-full w-full relative">
    <div
      class="relative z-20 flex flex-col p-5 gap-6 w-full text-center items-center justify-center pt-6 rounded-lg"
    >
      <div class="flex flex-col gap-3 items-center justify-center">
        <div
          v-if="props.loader.inProgress && !props.loader.completed"
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
          <span class="text-2xl font-nohemi font-semibold text-blueGray-800 tabular-nums"
            >Getting it Done...
          </span>
          <span
            class="text-base font-inter text-center font-medium text-blueGray-600 tabular-nums"
            >Setup will be completed in just a few moments Allowances setup on
            {{ props.chain }}</span
          >
        </div>
        <div
          v-else-if="props.loader.error"
          class="flex flex-col gap-1 items-center justify-center"
        >
          <video
            src="@/assets/videos/new_error.webm"
            autoplay
            muted
            class="h-32 relative animate-fadeIn"
            @contextmenu.prevent="void 0"
          />
          <span class="text-2xl font-nohemi font-semibold text-blueGray-800 tabular-nums"
            >Oops!</span
          >
          <span
            class="text-base font-inter text-center font-medium text-blueGray-600 tabular-nums"
            >Something went wrong during the setup. You could click on the button below to
            try the setup again or close this window to skip it for now</span
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
          <span class="text-2xl font-nohemi font-semibold text-blueGray-800 tabular-nums"
            >All Done!</span
          >
          <span
            class="text-base font-inter text-center font-medium text-blueGray-600 tabular-nums"
            >You’re all setup to use Chain Abstraction for the smoothest wallet experience
            on Arbitrum, Optimism, Base and Polygon chains.</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
