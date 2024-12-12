import { CA } from "@arcana/ca-sdk";

let ca: CA | null = null;

const getCA = async () => {
  if (!ca) {
    // @ts-ignore
    throw new Error("CA not initialized");
  }
  await ca.init();
  return ca;
};

const initCA = async (provider) => {
  ca = new CA(provider);
  await ca.init();
};

export { getCA, initCA };
