type Chain = {
  id: number;
  name: string;
  logo: string;
};

type Breakdown = {
  chain: Chain;
  network: string;
  contractAddress: string;
  balance: string;
  balanceInFiat: number;
  isNative: boolean | undefined;
};

type Asset = {
  symbol: string;
  balance: string;
  balanceInFiat: number;
  decimals: number;
  icon: string | undefined;
  breakdown: Breakdown[];
  abstracted: boolean | undefined;
  local: boolean | undefined;
};

export type { Asset, Breakdown, Chain };
