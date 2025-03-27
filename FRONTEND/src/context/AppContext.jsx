import { createContext, useState } from "react";

// Creating context
export const AppContext = createContext();

// Creating context provider
export const AppContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL; // backend URL

    const [isLoggedin, setIsLoggedin] = useState(false); // user logged-in state

    const [userData, setUserData] = useState(null); // user data (default should be null, not false)

    // value object to provide all values of app context
    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};
