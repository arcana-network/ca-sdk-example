import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Asset } from '@/types/balanceTypes'

export const useTokenStore = defineStore('token', () => {
  const selectedToken = ref<Asset | null>(null)

  const setToken = (token: Asset) => {
    selectedToken.value = token
  }

  const clearToken = () => {
    selectedToken.value = null
  }

  return {
    selectedToken,
    setToken,
    clearToken,
  }
})
