import { AnalyticsBrowser } from "@segment/analytics-next";

let analytics: AnalyticsBrowser | null = null;

const initSegment = async () => {
  if (!analytics) {
    analytics = AnalyticsBrowser.load({
      writeKey: import.meta.env.VITE_WRITE_KEY,
    });
    console.log("Segment initialized");
  }
};

const trackEvent = (
  eventName: string,
  properties: Record<string, any> = {}
) => {
  if (analytics) {
    analytics.track(eventName, properties);
  } else {
    console.warn("Segment Analytics is not initialized");
  }
};

export { initSegment, trackEvent };
