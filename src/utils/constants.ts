import { Chain } from "@/types/chainTypes";

const TOAST_TIME_OUT = 5000;

const MAINNET_CHAINS: Chain[] = [
  {
    id: 1,
    name: "Ethereum Mainnet",
    rpcUrls: {
      default: {
        publicHttp: [
          "https://cloudflare-eth.com",
          "https://1rpc.io/eth",
          "https://ethereum-rpc.publicnode.com",
          "https://rpc.ankr.com/eth",
          "https://ethereum.blockpi.network/v1/rpc/public",
          "https://rpc.mevblocker.io",
          "https://rpc.mevblocker.io/fast",
        ],
      },
    },
    blockExplorers: {
      default: {
        name: "Etherscan",
        url: "https://etherscan.io",
      },
    },
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/ethereum.svg",
      knownTokens: [
        {
          contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
          name: "Tether USD",
          symbol: "USDT",
          logo: "/images/logos/usdt.svg",
          decimals: 6,
        },
        {
          contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
        },
        {
          contractAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
        },
      ],
      verifyingContract: "0xBc1770f42575a2f2edab512e7a733Bf0b79f7b82",
    },
  },
  {
    id: 10,
    rpcUrls: {
      default: {
        publicHttp: [
          "https://mainnet.optimism.io",
          "https://1rpc.io/op",
          "https://optimism-rpc.publicnode.com",
          "https://rpc.ankr.com/optimism",
          "https://optimism.blockpi.network/v1/rpc/public",
          "https://optimism.llamarpc.com",
        ],
      },
    },
    name: "OP Mainnet",
    blockExplorers: {
      default: {
        name: "Optimism Etherscan",
        url: "https://optimistic.etherscan.io",
      },
    },
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/optimism.svg",
      knownTokens: [
        {
          contractAddress: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
          name: "Tether USD",
          symbol: "USDT",
          decimals: 6,
          logo: "/images/logos/usdt.svg",
        },
        {
          contractAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          logo: "/images/logos/usdc.svg",
        },
        {
          contractAddress: "0x4200000000000000000000000000000000000006",
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
          logo: "/images/logos/weth.svg",
        },
      ],
      verifyingContract: "0x61E7BfD859AE76AC1C69A0F4BB6c35e3c1ff8a12",
    },
  },
  {
    id: 56,
    name: "BNB Smart Chain Mainnet",
    rpcUrls: {
      default: {
        publicHttp: [],
      },
    },
    blockExplorers: {
      default: {
        name: "Bscscan",
        url: "https://bscscan.com",
      },
    },
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/bnb.svg",
      knownTokens: [],
    },
  },
  {
    id: 137,
    name: "Polygon PoS",
    rpcUrls: {
      default: {
        publicHttp: [
          "https://polygon-rpc.com",
          "https://1rpc.io/matic",
          "https://polygon-bor-rpc.publicnode.com",
          "https://rpc.ankr.com/polygon",
          "https://polygon.blockpi.network/v1/rpc/public",
          "https://polygon.llamarpc.com",
        ],
      },
    },
    blockExplorers: {
      default: {
        name: "Polygonscan",
        url: "https://polygonscan.com",
      },
    },
    nativeCurrency: {
      name: "POL",
      symbol: "POL",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/polygon.svg",
      knownTokens: [
        {
          contractAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
          name: "Tether USD",
          symbol: "USDT",
          decimals: 6,
          logo: "/images/logos/usdt.svg",
        },
        {
          contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          logo: "/images/logos/usdc.svg",
        },
        {
          contractAddress: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
          logo: "/images/logos/weth.svg",
        },
      ],
      verifyingContract: "0xd7F1A0B549918077Ab4fE1870f6115EBdF49D8Bf",
    },
  },
  {
    id: 324,
    name: "zkSync Era",
    rpcUrls: {
      default: {
        publicHttp: [
          "https://mainnet.era.zksync.io",
          "https://1rpc.io/zksync2-era",
          "https://rpc.ankr.com/zksync_era",
          "https://zksync-mainnet.public.blastapi.io",
          "https://zksync-era.blockpi.network/v1/rpc/public",
        ],
      },
    },
    blockExplorers: {
      default: {
        name: "zkscan",
        url: "https://zkscan.io",
      },
    },
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/zksync.png",
      knownTokens: [],
    },
  },
  {
    id: 8453,
    rpcUrls: {
      default: {
        publicHttp: [
          "https://mainnet.base.org",
          "https://1rpc.io/base",
          "https://base-rpc.publicnode.com",
          "https://rpc.ankr.com/base",
          "https://base.blockpi.network/v1/rpc/public",
          "https://base.llamarpc.com",
        ],
      },
    },
    name: "Base",
    blockExplorers: {
      default: {
        name: "Basescan",
        url: "https://basescan.org",
      },
    },
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/base.svg",
      knownTokens: [
        {
          contractAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          logo: "/images/logos/usdc.svg",
        },
        {
          contractAddress: "0x4200000000000000000000000000000000000006",
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
          logo: "/images/logos/weth.svg",
        },
      ],
      verifyingContract: "0x9BD26053127D508DCf8CC113Ea44969D3f17ea14",
    },
  },
  {
    id: 42161,
    rpcUrls: {
      default: {
        publicHttp: [
          "https://arb1.arbitrum.io/rpc",
          "https://1rpc.io/arb",
          "https://arbitrum-one-rpc.publicnode.com",
          "https://rpc.ankr.com/arbitrum",
          "https://arbitrum.blockpi.network/v1/rpc/public",
        ],
      },
    },
    name: "Arbitrum One",
    blockExplorers: {
      default: {
        name: "Arbiscan",
        url: "https://arbiscan.io",
      },
    },
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/arbitrum.svg",
      knownTokens: [
        {
          contractAddress: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
          name: "Tether USD",
          symbol: "USDT",
          decimals: 6,
          logo: "/images/logos/usdt.svg",
        },
        {
          contractAddress: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
          logo: "/images/logos/usdc.svg",
        },
        {
          contractAddress: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
          name: "Wrapped Ether",
          symbol: "WETH",
          decimals: 18,
          logo: "/images/logos/weth.svg",
        },
      ],
      verifyingContract: "0x160059CE66Bf3e0E3D15A4dB3773a97644c7056c",
    },
  },
  {
    id: 42220,
    name: "Celo",
    rpcUrls: {
      default: {
        publicHttp: ["https://forno.celo.org"],
      },
    },
    blockExplorers: {
      default: {
        name: "Celo Explorer",
        url: "https://explorer.celo.org/mainnet",
      },
    },
    nativeCurrency: {
      name: "CELO",
      symbol: "CELO",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/celo.svg",
      knownTokens: [],
    },
  },
  {
    id: 43114,
    name: "Avalanche C-Chain",
    rpcUrls: {
      default: {
        publicHttp: [
          "https://1rpc.io/avax/c",
          "https://avalanche-c-chain-rpc.publicnode.com",
          "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc",
          "https://rpc.ankr.com/avalanche",
          "https://avalanche.blockpi.network/v1/rpc/public",
          "https://avalanche-mainnet.gateway.tenderly.co",
        ],
      },
    },
    blockExplorers: {
      default: {
        name: "Avascan",
        url: "https://snowscan.xyz",
      },
    },
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/avax.svg",
      knownTokens: [],
    },
  },
  {
    id: 81457,
    name: "Blast",
    rpcUrls: {
      default: {
        publicHttp: [
          "https://rpc.blast.io",
          "https://blast-rpc.publicnode.com",
          "https://blastl2-mainnet.public.blastapi.io",
          "https://rpc.ankr.com/blast",
          "https://blast.blockpi.network/v1/rpc/public",
          "https://blast.gateway.tenderly.co",
        ],
      },
    },
    blockExplorers: {
      default: {
        name: "Blastscan",
        url: "https://blastscan.io",
      },
    },
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/blast.svg",
      knownTokens: [],
    },
  },
  {
    id: 534352,
    name: "Scroll",
    rpcUrls: {
      default: {
        publicHttp: [
          "https://rpc.scroll.io",
          "https://1rpc.io/scroll",
          "https://rpc.ankr.com/scroll",
          "https://scroll-mainnet.public.blastapi.io",
          "https://scroll.blockpi.network/v1/rpc/public",
          "https://scroll-rpc.publicnode.com",
        ],
      },
    },
    blockExplorers: {
      default: {
        name: "Scrollscan",
        url: "https://scrollscan.com",
      },
    },
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/scroll.svg",
      knownTokens: [],
    },
  },
  {
    id: 59144,
    name: "Linea",
    rpcUrls: {
      default: {
        publicHttp: [
          "https://rpc.linea.build",
          "https://1rpc.io/linea",
          "https://linea-mainnet.public.blastapi.io",
          "https://linea.blockpi.network/v1/rpc/public",
          "https://linea-rpc.publicnode.com",
        ],
      },
    },
    blockExplorers: {
      default: {
        name: "Lineascan",
        url: "https://lineascan.build",
      },
    },
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    custom: {
      icon: "/images/logos/linea.svg",
      knownTokens: [],
    },
  },
];

export { MAINNET_CHAINS, TOAST_TIME_OUT };
