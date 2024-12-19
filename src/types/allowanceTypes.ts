type TokenData = {
  contractAddress: string
  decimals: number
  name: string
  symbol: string
}

type AllowanceData = {
  chainID: number
  chainName: string
  currentAllowance: string
  minAllowance: string
  token: TokenData
}

type AllowanceDataType = {
  open: boolean
  data: AllowanceData[]
  allow: ((s: Array<'min' | 'max' | bigint | string>) => void) | null
  deny: (() => void) | null
}

export type { AllowanceDataType }
