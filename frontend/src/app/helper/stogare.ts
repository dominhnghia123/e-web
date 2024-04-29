export const setStogare = (key: string, value: string) => {
  if (typeof window === "undefined" || !window) return;
  window.localStorage.setItem(key, value);
};

export const getStogare = (key: string): string => {
  if (typeof window === "undefined" || !window) return "";
  return window.localStorage.getItem(key) || "";
};

export const removeStogare = (key: string) => {
  if (typeof window === "undefined" || !window) return;
  window.localStorage.removeItem(key);
};

export const getToken = () => {
  const currentUserString = getStogare("currentUser");
  const token = currentUserString ? JSON.parse(currentUserString).token : "";
  return token;
}
