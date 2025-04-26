export const parseCookies = (cookies: string) => {
  return cookies.split(';').reduce<Record<string, string>>((acc, cookie) => {
    const [key, value] = cookie.trim().split('=').map(decodeURIComponent);

    if (!(key && value)) {
      return acc;
    }

    acc[key] = value;

    return acc;
  }, {});
};
