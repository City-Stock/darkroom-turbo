export const getApiBaseUrl = () => {
  // Check to see if this is a vercel build or not.
  if (!!process.env.VERCEL_ENV) {
    return `https://${process.env.NEXT_PUBLIC_BASE_API_URL}`;
  } else {
    return process.env.LOCAL_URL ? `http://${process.env.LOCAL_URL}` : `http://${process.env.NEXT_PUBLIC_LOCAL_URL}`;
  }
};
