export const stargatePoolAddress = {
  Ethereum: {
    StargatePoolNative: import.meta.env.VITE_STARGATE_POOL_ETH_NATIVE_CONTRACT,
    StargatePoolUSDC: import.meta.env.VITE_STARGATE_POOL_ETH_USDC_CONTRACT,
    StargatePoolUSDT: import.meta.env.VITE_STARGATE_POOL_ETH_USDT_CONTRACT,
    StargatePoolmETH: import.meta.env.VITE_STARGATE_POOL_ETH_M_NATIVE_CONTRACT,
  },
  Optimism: {
    StargatePoolNative: import.meta.env.VITE_STARGATE_POOL_OP_NATIVE_CONTRACT,
    StargatePoolUSDC: import.meta.env.VITE_STARGATE_POOL_OP_USDC_CONTRACT,
    StargatePoolUSDT: import.meta.env.VITE_STARGATE_POOL_OP_USDT_CONTRACT,
  },
  Arbitrum: {
    StargatePoolNative: import.meta.env.VITE_STARGATE_POOL_ARB_NATIVE_CONTRACT,
    StargatePoolUSDC: import.meta.env.VITE_STARGATE_POOL_ARB_USDC_CONTRACT,
    StargatePoolUSDT: import.meta.env.VITE_STARGATE_POOL_ARB_USDT_CONTRACT,
  },
  Polygon: {
    StargatePoolUSDC: import.meta.env.VITE_STARGATE_POOL_POL_USDC_CONTRACT,
    StargatePoolUSDT: import.meta.env.VITE_STARGATE_POOL_POL_USDT_CONTRACT,
  },
  Base: {
    StargatePoolNative: import.meta.env.VITE_STARGATE_POOL_BASE_NATIVE_CONTRACT,
    StargatePoolUSDC: import.meta.env.VITE_STARGATE_POOL_BASE_USDT_CONTRACT,
  },
};
