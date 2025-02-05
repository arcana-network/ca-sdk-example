export const getTextFromStep = (status: string, done: boolean): string => {
  switch (status) {
    case "FAUCET_REQUEST":
      return done ? "Funds Requested Successfully" : "Requesting Funds";

    case "FAUCET_RECEIVED":
      return done ? "Funds Received" : "Waiting for Funds";

    case "ALLOWANCE_USER_APPROVAL":
      return done ? "Allowance Verified" : "Allowance Verifying";

    case "ALLOWANCE_APPROVAL_MINED":
      return done ? "Allowance Mined" : "Allowance Mining";

    case "ALLOWANCE_ALL_DONE":
      return done ? "Allowance Approved" : "Allowance Approving";

    case "INTENT_ACCEPTED":
      return done ? "Request Accepted" : "Accepting Request";

    case "INTENT_HASH_SIGNED":
      return done ? "Request Verified" : "Verifying Request";

    case "INTENT_SUBMITTED":
      return done
        ? "Collected on Source Chains"
        : "Collecting on Source Chains";

    case "INTENT_COLLECTION":
      return done ? "Liquidity Supplied" : "Supplying Liquidity";

    case "INTENT_MINED":
      return done ? "Transaction Mined" : "Transaction Mining";

    case "INTENT_FULFILLED":
      return done ? "Transaction Success" : "Completing Transaction";

    default:
      return "Unknown status. Please contact support.";
  }
};
