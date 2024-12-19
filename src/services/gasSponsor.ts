import axios from 'axios'

export const getGasFromFaucet = async (address: string) => {
  await axios.post(import.meta.env.VITE_ARCANA_FAUCET_URL, {
    address,
  })
}
