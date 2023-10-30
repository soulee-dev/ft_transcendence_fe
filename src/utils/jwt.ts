function base64UrlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  while (str.length % 4) {
    str += "=";
  }

  return atob(str);
}

export function parseJWT(jwt: string) {
  try {
    const parts = jwt.split(".");

    if (parts.length !== 3) {
      throw new Error("Not a valid JWT token.");
    }

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    return {
      header,
      payload,
    };
  } catch (err) {
    console.error("Failed to parse JWT:", err);
  }
}
