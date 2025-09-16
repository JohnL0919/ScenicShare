import { useEffect } from "react";

function useUserSession(initialUser) {
  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }
      if (initialUser?.uid === user?.uid) {
        return;
      }
      window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}
