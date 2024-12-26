<script lang="ts" setup>
const links = {
  howItWorks: "/how-it-works",
  scheduleDemo:
    "https://calendly.com/arcana-network/arcana-demo-walkthrough?month=2024-04",
  docs: "https://docs.arcana.network",
};
</script>

<template>
  <footer
    class="relative flex justify-end gap-4 items-center text-white h-10 px-16 pt-4 z-10 font-inter"
  >
    <a
      :href="links.howItWorks"
      target="_blank"
      rel="noopener noreferrer"
      class="font-semibold text-0.625rem text-blueGray-700 no-underline active:no-underline hover:no-underline"
    >
      How it Works
    </a>

    <a
      :href="links.scheduleDemo"
      target="_blank"
      rel="noopener noreferrer"
      class="font-semibold text-0.625rem text-blueGray-700 no-underline active:no-underline hover:no-underline"
    >
      Schedule a Demo
    </a>

    <a
      :href="links.docs"
      target="_blank"
      rel="noopener noreferrer"
      class="font-semibold text-0.625rem text-blueGray-700 no-underline active:no-underline hover:no-underline"
    >
      Docs
    </a>
  </footer>
</template>
