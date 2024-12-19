import { ref } from 'vue'

import { devLogger } from '@/utils/devLogger'

export const useCopyToClipboard = () => {
  const isCopied = ref(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 3000)
    } catch (err) {
      devLogger.error('Failed to copy to clipboard', err)
    }
  }

  return { copyToClipboard, isCopied }
}
