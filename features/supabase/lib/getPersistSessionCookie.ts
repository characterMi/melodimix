export function getPersistSessionCookie() {
  if (typeof document === "undefined") return "true";

  const value = `; ${document.cookie}`;
  const parts = value.split("; persist-session=");
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

// Supabase keeps the session up to date by requesting for new refresh token every one hour, and if the request fail, it will try
// again and again and again... so when we're offline, it will cause this infinite loop of requests. we're setting a cookie to whether
// we should persist the session or not, the cookie expiration time will be updated only if we check the app online, but as soon as we
// go offline, after one hour this persist-session cookie expires, so now supabase wont persist the session and we're not going to
// have that retry loop. smart isn't it? (check the lib/supabaseClient.ts file to see the full code)
export function setPersistSessionCookie(
  value = "true",
  expirationDate = new Date(Date.now() + 3600000 /* one hour */).toUTCString()
) {
  document.cookie = `persist-session=${value}; path=/; expires=${expirationDate}`;
}
