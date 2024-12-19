<script lang="ts" setup>
import CopiedIcon from "@/assets/images/svg/Coppied.svg";
import CopyIcon from "@/assets/images/svg/Copy.svg";

import { useCopyToClipboard } from "@/utils/copy";
import AppTooltip from "@/components/shared/AppTooltip.vue";

const copy = useCopyToClipboard();

const props = defineProps<{
  content: string;
  copy?: string;
  copied?: string;
  buttonClass: string;
}>();
</script>

<template>
  <AppTooltip v-if="copy.isCopied.value && props.copied" :message="props.copied">
    <CopiedIcon :class="props.buttonClass" class="h-3 w-3" />
  </AppTooltip>
  <AppTooltip v-else-if="!copy.isCopied.value && props.copy" :message="props.copy">
    <button
      class="flex items-center gap-2"
      @click.stop="copy.copyToClipboard(props.content)"
    >
      <CopyIcon :class="props.buttonClass" />
    </button>
  </AppTooltip>
  <CopiedIcon
    v-else-if="copy.isCopied.value"
    :class="props.buttonClass"
    class="h-3 w-3"
  />
  <button
    v-else-if="!copy.isCopied.value"
    class="flex items-center gap-2"
    @click.stop="copy.copyToClipboard(props.content)"
  >
    <CopyIcon :class="props.buttonClass" />
  </button>
</template>
