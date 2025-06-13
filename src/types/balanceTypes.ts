export declare enum Universe {
  ETHEREUM = 0,
  FUEL = 1,
  SOLANA = 2,
  UNRECOGNIZED = -1,
}

type Chain = {
  id: number;
  name: string;
  logo: string;
  abstracted?: boolean;
};

type Breakdown = {
  chain: Chain;
  universe: Universe;
  contractAddress: string;
  balance: string;
  balanceInFiat: number;
  isNative?: boolean;
  decimals: number;
};

type Asset = {
  symbol: string;
  balance: string;
  balanceInFiat: number;
  decimals: number;
  icon?: string;
  breakdown: Breakdown[];
  abstracted?: boolean;
};

export type { Asset, Breakdown, Chain };
