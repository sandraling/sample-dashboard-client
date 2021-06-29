import * as React from "react";
import axios from "axios";

export interface NodeWrapperProp {
  children: React.ReactNode
}

export interface UserData {
  username: string,
  firstName: string,
  lastName: string,
  email: string
}

export interface AuthData {
  loggedIn: boolean,
  data: UserData | null
}

interface AuthResponse {
  success: boolean
}

interface RegisterData extends UserData {
  password: string,
  password2: string,
  tos: boolean
}

interface LoginResponse extends AuthResponse {
  error?: string,
  token?: string,
  username?: string,
  firstName?: string,
  lastName?: string,
  email?: string
}

interface RegisterResponse extends AuthResponse, UserData {
  token?: string,
  errors?: RegisterErrors
}

interface RegisterErrors {
  username?: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  password2?: string,
  tos?: string
}

interface VerifyResponse extends AuthResponse {
  username?: string
}

interface AccInfoResponse extends VerifyResponse {
  firstName?: string,
  lastName?: string,
  email?: string
}

interface AuthContextType {
  user: AuthData;
  login: (username: string, password: string, rmbrMe: boolean) => Promise<boolean>; 
  logout: () => void; 
  register: (registerData: RegisterData) => Promise<{success: boolean, error?: RegisterErrors}>;
  verify: () => Promise<boolean>;
  getLoginStatus: () => boolean;
  getUserData: () => UserData;
}

declare const AUTH_URL: string;   // AUTH_URL provided by webpack plugin
const baseUrl = AUTH_URL;
const credentialsOpt = { withCredentials: true, credentials: 'include' };

/**
 * AuthContext, useAuth and useProvideAuth are a modified version
 *  of the material provided by: {@link https://usehooks.com/useAuth/}
 */
export const AuthContext = React.createContext<AuthContextType | null>(null);

/**
 * Provider hook that creates auth object and handles state
 */
export const AuthProvider = (props: NodeWrapperProp) => {
  const [user, setUser] = React.useState<AuthData>({
    loggedIn: false,
    data: null
  });
  const [rmbrMe, setRmbrMe] = React.useState<boolean>(false);

  /**
   * Login via server side
   * @param {string} username
   * @param {string} password 
   * @param {boolean} rmbrMe 
   * @return {UserData | null} User data on successful login; null otherwise
   */
  const login = (username: string, password: string, rmbrMe: boolean) => {
    setRmbrMe(rmbrMe);
    return axios
      .post<LoginResponse>(baseUrl + "/api/users/login", { username, password }, credentialsOpt)
      .then(({ data }) => {
        if (data.success === true) {
          setUser({
            loggedIn: true,
            data: {
              username: data.username || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || ""
            }
          });
        };
        return data.success;
      });
  };

  /**
   * Register new user using userData via server
   * @param {object} userData - data from registration form;
   *  see UserData interface for structure
   * @returns {object} object of property 
   *  success - boolean denoting successful registration or not; and 
   *  errors - object with appropriate strings for each bad input
   */
  const register = (registerData: RegisterData) => {
    return axios
      .post<RegisterResponse>(baseUrl + "/api/users/register", registerData, credentialsOpt)
      .then(({ data }) => {
        if(data.success === true) {
          setUser({
            loggedIn: true,
            data: {
              username: data.username || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || ""
            }
          });
          return {
            success: true
          }
        } 
        return {
          success: false,
          errors: data.errors
        }
      });
  };

  /**
   * Verify the integrity of the login session jwt token stored in cookie
   * On success, update session user data accordingly; 
   * Else, remove jwt token and clear user data.
   */
  const verify = () => {
    return axios
      .post<AccInfoResponse>(baseUrl + "/api/users/verify", null, credentialsOpt)
      .then(({ data }) => {
        if (data.success === true && data.username) {
          setUser({
            loggedIn: true,
            data: {
              username: data.username || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || ""
            }
          });
        } else {
          // Remove outdated or invalid token on failure
          setUser({
            loggedIn: false,
            data: null
          });
          logout();
        }
        return data.success;
      });
  };

  /**
   * Log out from current login session
   */
  const logout = () => {
    return axios
      .post<AuthResponse>(baseUrl + "/api/users/logout", null, credentialsOpt)
      .then(({ data }) => {
        if (data.success === true) {
          setUser({
            loggedIn: false,
            data: null
          });
        }
      });
  };

  const getLoginStatus = () => {
    return user.loggedIn;
  };

  const getUserData = () => {
    return user.data || {
      username: "",
      firstName: "",
      lastName: "",
      email: ""
    }
  }

  React.useEffect(() => {
    // Verify our login session if we have a login token but no user data
    if (user.loggedIn === false) {
      verify();
    }

    return () => {
      if (rmbrMe === false) {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{user, login, logout, register, verify, getLoginStatus, getUserData}}>
      {props.children}
    </AuthContext.Provider>
  )
}

/**
 * Hook for child components to get the auth object
 *  and re-render when it changes.
 */
export const useAuth = () => {
  return React.useContext(AuthContext);
}

