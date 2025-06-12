import { onAllowanceHookSource } from "@arcana/ca-sdk";

type AllowanceDataType = {
  open: boolean;
  data: onAllowanceHookSource[];
  allow: ((s: Array<"min" | "max" | bigint | string>) => void) | null;
  deny: (() => void) | null;
};

export type { AllowanceDataType };
