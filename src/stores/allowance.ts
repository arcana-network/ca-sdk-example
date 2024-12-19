import { defineStore } from 'pinia'
import { ref } from 'vue'

import { AllowanceDetailsTypes } from '@/types/allowanceDetailsTypes'

export const useAllowanceStore = defineStore('allowance', () => {
  const selectedAllowanceData = ref<AllowanceDetailsTypes | null>(null)
  const userAllowances = ref<AllowanceDetailsTypes[] | null>(null)
  const showAllowanceSetupModal = ref<boolean>(false)

  const setUserAllowance = (allowanceData: AllowanceDetailsTypes[]) => {
    userAllowances.value = allowanceData
  }

  const setAllowance = (allowanceData: AllowanceDetailsTypes) => {
    selectedAllowanceData.value = allowanceData
  }

  const clearAllowance = () => {
    selectedAllowanceData.value = null
  }

  const setAllowanceSetupModal = (value: boolean) => {
    showAllowanceSetupModal.value = value
  }

  return {
    selectedAllowanceData,
    setAllowance,
    clearAllowance,
    userAllowances,
    setUserAllowance,
    showAllowanceSetupModal,
    setAllowanceSetupModal,
  }
})
