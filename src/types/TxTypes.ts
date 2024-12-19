type TxType = 'Send' | 'Receive'

interface TransactionActivityData {
  date: string
  type: TxType
  chainIcon: string
  chain: string
  tokenIcon: string
  token: string
  address: string
  amount: number
  balanceInFiat: number
  abstracted: boolean
}

export type { TransactionActivityData }
