import Decimal from 'decimal.js'

import { MAINNET_CHAINS } from './constants'

const logoModules = import.meta.glob('@/assets/images/logos/*.svg', {
  eager: true,
  as: 'url',
})

const getLogo = (logoName?: string | undefined): string => {
  const logoPath = `/src/assets${logoName}`
  const logoUrl = logoModules[logoPath]

  if (logoUrl) {
    return logoUrl as string
  } else {
    console.warn(`Logo for ${logoName} not found, using default.`)
    return logoModules['@/assets/images/logos/default.svg'] as string
  }
}

const isNumber = (value: string | number): boolean => {
  return /^[0-9]+$/.test(value.toString())
}

const isEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

const truncateString = (
  str: string,
  frontLength = 4,
  backLength = 4
): string => {
  if (!str || str.length <= frontLength + backLength) {
    return str
  }

  const frontPart = str.slice(0, frontLength)
  const backPart = str.slice(-backLength)

  return `${frontPart}....${backPart}`
}

const formatNumber = (val: number) => {
  return Intl.NumberFormat().format(val)
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const day = d.getDate()
  const month = monthNames[d.getMonth()]
  const year = d.getFullYear()

  return `${month} ${day}, ${year}`
}

const formatTime = (date: string) => {
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const getExplorerUrl = (hash: string, url: string | undefined, path = 'tx') => {
  const pathString = `/${path}/${hash}`
  return new URL(pathString, url).href
}

const isMaxAllowance = (allowance: string | number | bigint): boolean => {
  const maxAllowancePrefix =
    '115792089237316195423570985008687907853269984665640564039457'
  return allowance.toString().startsWith(maxAllowancePrefix)
}

const getChainDetails = (chainID: number | undefined) => {
  if(chainID){
 const chainDetails = MAINNET_CHAINS.filter((item) => item.id === chainID)
  return chainDetails[0]
  }
 
}

const numberToBigInt = (num: number) => {
  const decimalValue = new Decimal(num)
  const scaledValue = decimalValue.times(10 ** 6)
  return BigInt(scaledValue.toFixed(0))
}

export {
  formatDate,
  formatNumber,
  formatTime,
  getChainDetails,
  getExplorerUrl,
  getLogo,
  isEthereumAddress,
  isMaxAllowance,
  isNumber,
  numberToBigInt,
  truncateString,
}
