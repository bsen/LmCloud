import { lmScaleAPI } from "@/api/instance";
import { AUTHENTICATED_ROUTES, ROUTES_MAP } from "@/constants/routes";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

const AuthenticationContext = createContext({});

const AuthenticationProvider = ({ children }) => {
  const router = useRouter();

  const [authToken, setAuthToken] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const logInUser = async (email, password) => {
    if (!email || !password) {
      throw new Error("Please fill in all fields");
    }

    setSubmitting(true);
    try {
      const res = await lmScaleAPI.post("/user/login", { email, password });
      localStorage.setItem("lm_auth_token", res.data.lm_auth_token);
      setAuthToken(res.data.lm_auth_token);
      window.location.href = ROUTES_MAP.DASHBOARD.__;
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const registerUser = async (name, email, password) => {
    if (!name || !email || !password) {
      throw new Error("Please fill in all fields");
    }

    setSubmitting(true);
    try {
      const res = await lmScaleAPI.post("/user/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("lm_auth_token", res.data.lm_auth_token);
      setAuthToken(res.data.lm_auth_token);
      window.location.href = ROUTES_MAP.DASHBOARD.__;
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error(err?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const logOutUser = () => {
    localStorage.clear();
    setAuthToken(null);
    window.location.href = ROUTES_MAP.LOGIN;
  };

  useEffect(() => {
    const tokenFromQuery = router?.query?.lm_auth_token;

    if (tokenFromQuery) {
      lmScaleAPI
        .get("/api/auth/account", {
          headers: {
            Authorization: `Bearer ${tokenFromQuery}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("lm_auth_token", tokenFromQuery);
            setAuthToken(tokenFromQuery);
          }
        })
        .catch((error) => {
          console.error("Error validating lm_auth_token:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    const lm_auth_tokenFromLocalStorage = localStorage.getItem("lm_auth_token");
    setAuthToken(lm_auth_tokenFromLocalStorage);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (loading) return;

    const isLoggedIn = !!authToken;
    const currentPathname = router.pathname;
    const isAuthenticatedRoute = AUTHENTICATED_ROUTES.includes(currentPathname);

    if (isAuthenticatedRoute && !isLoggedIn) {
      router.push(ROUTES_MAP.LOGIN);
    } else if (!isAuthenticatedRoute && isLoggedIn) {
      router.push(ROUTES_MAP.DASHBOARD.__);
    }
  }, [authToken, loading, router]);

  const contextValue = {
    logInUser,
    logOutUser,
    registerUser,
    isAuthenticated: !!authToken,
    authToken,
    submitting,
  };

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => useContext(AuthenticationContext);

export default AuthenticationProvider;
