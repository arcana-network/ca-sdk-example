const asyncIntervals: Array<boolean> = [];

const runAsyncInterval = async (
  cb: () => Promise<void>,
  interval: number,
  intervalIndex: number,
) => {
  if (asyncIntervals[intervalIndex]) {
    await cb();
    setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
  }
};

const setAsyncInterval = (cb: () => Promise<void>, interval: number) => {
  if (cb && typeof cb === "function") {
    const intervalIndex = asyncIntervals.length;
    asyncIntervals.push(true);
    setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
    return intervalIndex;
  } else {
    throw new Error("Callback must be a function");
  }
};

const clearAsyncInterval = (intervalIndex: number) => {
  if (asyncIntervals[intervalIndex]) {
    asyncIntervals[intervalIndex] = false;
  }
};

export { setAsyncInterval, clearAsyncInterval };
