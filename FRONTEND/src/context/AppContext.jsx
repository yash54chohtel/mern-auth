import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

// ✅ Set Axios to include cookies with requests
axios.defaults.withCredentials = true;

// Creating context
export const AppContext = createContext();

// Creating context provider
export const AppContextProvider = ({ children }) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL; // backend URL
    const [isLoggedin, setIsLoggedin] = useState(false); // user logged-in state
    const [userData, setUserData] = useState(null); // user data (default should be null, not false)

    // endpoint api hit for getting user data
    const getUserData = async () => {
        try {

            // calling get api
            const { data } = await axios.get(backendUrl + "/api/auth/get-user-data")

            // setting userData
            data.success ? setUserData(data.userData) : toast.error(data.message);

        } catch (error) {

            console.error(error.message);

        }
    };

    // function for getting user auth status
    const getAuthState = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');

            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }

        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        getAuthState();
    }, [])


    // value object to provide all values of app context
    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};
