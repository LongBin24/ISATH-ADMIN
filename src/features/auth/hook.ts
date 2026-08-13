"use client";

import { useLogoutMutation } from "./api";

export function useSignOut() {
  const [logout] = useLogoutMutation();

  return async function signOut() {
    const refreshToken =
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await logout({ refreshToken }).unwrap();
      } catch {
        // Best-effort: still clear the local session and end the Keycloak SSO session below.
      }
    }

    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("idToken");
    window.sessionStorage.removeItem("accessToken");
    window.sessionStorage.removeItem("token");
    document.cookie = "accessToken=; Max-Age=0; path=/";

    window.location.assign("/api/keycloak/logout");
  };
}
