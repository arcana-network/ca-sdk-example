<script lang="ts" setup>
import { Tooltip } from '@ark-ui/vue'

const props = defineProps<{
  message: string
}>()
</script>

<template>
  <Tooltip.Root :open-delay="1000" :interactive="true">
    <Tooltip.Trigger as-child class="inline-flex">
      <div class="inline-flex">
        <slot></slot>
      </div>
    </Tooltip.Trigger>
    <Tooltip.Positioner>
      <Tooltip.Content class="font-inter font-normal text-sm">
        {{ props.message }}
      </Tooltip.Content>
    </Tooltip.Positioner>
  </Tooltip.Root>
</template>
