import { Intent } from '@arcana/ca-sdk'

type IntentDataType = {
  open: boolean;
  allow: () => void;
  deny: () => void;
  refresh: (() => Promise<Intent>) | null;
  intent: Intent | null;
  intervalHandler: number | null;
  intentRefreshing: boolean;
};

export type { IntentDataType }
