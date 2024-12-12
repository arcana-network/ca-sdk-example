import type { ProgressStep } from "@arcana/ca-sdk";

export const getTextFromStep = (step: ProgressStep): string => {
  switch (step.type) {
    case "FAUCET_REQUEST":
      return `Requesting funds for ERC20 approvals`;
    case "FAUCET_RECEIVED":
      return `Faucet funds received`;
    case "ALLOWANCE_USER_APPROVAL":
      return `Allowance approved on ${step.data?.chainName}`;
    case "ALLOWANCE_APPROVAL_MINED":
      return `Allowance verified on ${step.data?.chainName}`;
    case "ALLOWANCE_ALL_DONE":
      return "Allowances approved";
    case "INTENT_ACCEPTED":
      return "User accepted the intent and associated fees";
    case "INTENT_HASH_SIGNED":
      return "User signed the intent hash";
    case "INTENT_SUBMITTED":
      return `Intent submitted to the chain: Link - ${step.data?.explorerURL}`;
    case "INTENT_COLLECTION":
      return `Intent collected on the chain ${step.data?.confirmed}/${step.data?.total}`;
    case "INTENT_MINED":
      return "Intent mined on the chain";
    case "INTENT_DEPOSIT":
      console.log(step.data?.amount);
      return `Deposited ${step.data?.amount.substring(0, 8)} on ${
        step.data?.chainName
      }`;
    case "INTENT_DEPOSITS_CONFIRMED":
      return "Deposits confirmed";
    case "INTENT_FULFILLED":
      return "Intent is fulfilled";
    default:
      return step.type;
  }
};
