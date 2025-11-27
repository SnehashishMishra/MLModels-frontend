import { useEffect, useState, useCallback, useRef } from "react";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const mounted = useRef(false);

  const fetchUser = useCallback(async () => {
    try {
      if (!mounted.current) setLoadingUser(true);

      const res = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
      mounted.current = true;
    }
  }, []);

  useEffect(() => {
    fetchUser();

    const authHandler = () => fetchUser();

    const datasetHandler = () => {
      // 🔥 When dataset is updated we re-check user & session
      fetchUser();
    };

    window.addEventListener("auth-changed", authHandler);
    window.addEventListener("dataset-updated", datasetHandler);

    return () => {
      window.removeEventListener("auth-changed", authHandler);
      window.removeEventListener("dataset-updated", datasetHandler);
    };
  }, [fetchUser]);

  return {
    user,
    loadingUser,
    refreshUser: fetchUser,
  };
}
