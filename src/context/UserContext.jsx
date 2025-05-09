
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { URL } from "../url";

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  getUser: () => {}
});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);

    const getUser = async () => {
      try {
        const res = await axios.get(URL + "/api/auth/refetch", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      }
    };

    useEffect(() => {
      getUser();
    }, []);

    const contextValue = {
      user,
      setUser,
      getUser
    };
    
    return (
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    );
}