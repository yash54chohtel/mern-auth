import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from "axios";
import { toast } from 'react-toastify';
import { CgSpinner } from "react-icons/cg";

const Login = () => {

    // initilizing useNavigator
    const navigate = useNavigate();

    // Loading state
    const [loading, setLoading] = useState(false);

    // extracting data from appcontext that we have created
    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

    // state variable for storing auth state
    const [state, setState] = useState('signUp');

    // State for storing user input
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // Function to handle form submit
    const onSubmitHandler = async (e) => {

        try {

            // Start loading
            setLoading(true);

            // preventing default
            e.preventDefault();

            // defininf response variable to store response
            let response;

            // Ensures cookies are sent in cross-origin requests
            axios.defaults.withCredentials = true;

            if (state === 'signUp') {

                // hitting register api
                response = await axios.post(backendUrl + "/api/auth/register", { name, email, password });

            } else {

                // hitting login api
                response = await axios.post(backendUrl + "/api/auth/login", { email, password });
            }

            // Destructure response data
            const { data } = response;

            // handling response
            if (data.success) {

                toast.success(data.message); // notification
                setIsLoggedin(true); // set loggedin state
                getUserData() // calling get userData function for getting user data
                navigate('/'); // navigating

            } else {

                // display response message in toast notiifcation
                toast.error(data.message);
            }

        } catch (error) {

            console.error("Error during authentication:", error);

            toast.error(error.response?.data?.message || "Something went wrong!");

        } finally {

            // Stop loading after request completes
            setLoading(false);

        }

    }

    return (
        <>
            <div className='flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-100 to-purple-400'>

                {/* logo  */}
                <img onClick={() => navigate("/")} src={assets.logo} alt="logo img" className='absolute left-5 top-5 w-28 cursor-pointer' />

                {/* form container */}
                <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

                    {/* main descrition */}
                    <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'signUp' ? 'Create account' : 'Login'}</h2>

                    {/* secondry descrition */}
                    <p className='text-center text-sm mb-6'>{state === 'signUp' ? 'Create your account' : 'Login to your account'}</p>

                    {/* form */}
                    <form onSubmit={(e) => onSubmitHandler(e)}>

                        {/* Full Name Field (Only for Sign Up) */}
                        {state === 'signUp' && (
                            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
                                <img src={assets.person_icon} alt="icon" />
                                <input className='outline-none bg-transparent' type="text" placeholder='Full Name' required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}

                        {/* email input Field */}
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
                            <img src={assets.mail_icon} alt="icon" />
                            <input className='outline-none bg-transparent' type="email" placeholder='Email' required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* password input field */}
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
                            <img src={assets.lock_icon} alt="icon" />
                            <input className='outline-none bg-transparent' type="password" placeholder='Password' required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* forgot password */}
                        {state === 'login' && (
                            <p onClick={() => navigate("/reset-password")} className='mb-4 text-indigo-500 cursor-pointer hover:text-white inline-block'> Forgot password ? </p>
                        )}

                        {/* submit button */}
                        <button className='flex items-center justify-center h-10 mb-4 w-full py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-600 transition'
                            disabled={loading}
                        >
                            {loading ?
                                (<span className='loder'> <CgSpinner size={25} /> </span>)
                                : (state === "signUp" ? "Sign Up" : "Login")}
                        </button>

                        {/* login and signup Option */}
                        {
                            state === 'signUp' ?
                                <p className='text-gray-400 text-center text-sm flex gap-2 items-center justify-center'>Already have an account ?
                                    <span onClick={() => setState('login')} className='text-blue-400 cursor-pointer hover:text-white underline'>Login here</span>
                                </p>
                                :
                                <p className='text-gray-400 text-center text-sm flex gap-2 items-center justify-center'>
                                    Don't have an account ?
                                    <span onClick={() => setState('signUp')} className='text-blue-400 cursor-pointer hover:text-white underline'>Signup here</span>
                                </p>
                        }

                    </form>

                </div>



            </div>
        </>
    )
}

export default Login