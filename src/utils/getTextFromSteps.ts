export const getStatusMessage = (status: string): string => {
  switch (status) {
    case "FAUCET_REQUEST":
      return `Requesting Funds`;
    case "FAUCET_RECEIVED":
      return `Faucet Received`;
    case "ALLOWANCE_USER_APPROVAL":
      return `Allowance Verified`;
    case "ALLOWANCE_APPROVAL_MINED":
      return `Allowance Mined`;
    case "ALLOWANCE_ALL_DONE":
      return "Allowances Approved";
    case "INTENT_ACCEPTED":
      return "Verifying Request";
    case "INTENT_HASH_SIGNED":
      return "Collecting on Source Chains";
    case "INTENT_SUBMITTED":
      return "Supplying Liquidity";
    case "INTENT_COLLECTION":
      return "Submitting Transaction";
    case "INTENT_MINED":
      return "Transaction Mined";
    case "INTENT_FULFILLED":
      return "Transaction Success";
    default:
      return "Unknown status. Please contact support.";
  }
};
