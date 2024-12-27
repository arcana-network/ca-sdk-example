type TokenInfo = {
  contractAddress: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
  platform?: string;
};

type Chain = {
  id: number;
  rpcUrls: {
    default: {
      publicHttp?: string[];
    };
  };
  name: string;
  blockExplorers?: {
    default: {
      name: string;
      url: string;
    };
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  custom: {
    icon?: string;
    knownTokens: TokenInfo[];
    verifyingContract?: `0x${string}`;
  };
};

export type { Chain };
