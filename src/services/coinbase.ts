import axios from 'axios'

const memoryStore = {
  rates: {} as Record<string, string>,
  lastUpdatedAt: 0,
}

const memoryUpdateInterval = 1000 * 60 * 1

export const getCoinbasePrices = async () => {
  if (memoryStore.lastUpdatedAt + memoryUpdateInterval < Date.now()) {
    const exchange = await axios.get(
      'https://api.coinbase.com/v2/exchange-rates?currency=USD'
    )
    const rates = exchange.data.data.rates
    rates['WETH'] = rates['ETH']
    rates['WPOL'] = rates['POL']
    memoryStore.rates = rates as Record<string, string>
    memoryStore.lastUpdatedAt = Date.now()
  }
  return memoryStore.rates
}
