import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Asset } from '@/types/balanceTypes'

export const useUserStore = defineStore('user', () => {
  const isWalletConnected = ref<boolean>(false)
  const walletAddress = ref<string>('')
  const balanceInFiat = ref<number>(0)
  const loading = ref<boolean>(true)

  const assets = ref<Asset[]>([])

  const setAsset = (newAssets: Asset[]) => {
    assets.value = newAssets
    loading.value= false
  }

  const setLoading = (newLoading: boolean) => {
    loading.value = newLoading
  }

  return {
    isWalletConnected,
    walletAddress,
    balanceInFiat,
    assets,
    setAsset,
    loading,
    setLoading
  }
})
