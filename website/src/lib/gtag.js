// based on:
// https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/lib/gtag.js

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url, user_id = '') => {
  let gaconfig = {
    page_path: url,
  };

  if (user_id !== '') {
    gaconfig.user_id = user_id;
  }

  window.gtag('config', GA_TRACKING_ID, gaconfig);
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
  nonInteraction,
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    nonInteraction: nonInteraction || false,
  });
};
