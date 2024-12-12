<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
    isOpen: Boolean,
});

const emit = defineEmits(["modal-close", "submit"]);

const target = ref(null)
onClickOutside(target, () => emit('modal-close'))

</script>

<template>
    <div id="hs-scale-animation-modal" tabindex="-1" v-if="props.isOpen"
        class="flex backdrop-blur overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        @click="() => emit('modal-close')">
        <div class="relative p-4 w-full max-w-2xl max-h-full mx-auto">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700" @click.stop>
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <slot name="header">Hi</slot>
                </div>
                <div class="modal-body">
                    <slot name="content"> default content </slot>
                </div>
                <div class="flex items-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <!-- <div> -->
                    <!-- <slot name="footer"> -->
                    <button type="button" @click="() => emit('submit')"
                        class="ml-auto text-right float-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Continue
                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </button>
                    <!-- </slot> -->
                </div>
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-wrapper {
    max-width: 80%;
    margin: 0 auto;
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
    margin: 150px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
</style>