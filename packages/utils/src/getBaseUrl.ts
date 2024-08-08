export const getBaseUrl = () => {
  if (!!process.env.VERCEL_ENV) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  } else if (!!process.env.NEXT_PUBLIC_VERCEL_ENV) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  } else {
    return process.env.LOCAL_URL ? `http://${process.env.LOCAL_URL}` : `http://${process.env.NEXT_PUBLIC_LOCAL_URL}`;
  }
};
