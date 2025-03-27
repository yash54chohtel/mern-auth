import React, { useContext } from 'react'

import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx';

const NavBar = () => {

    const navigate = useNavigate();

    const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);

    return (
        <>
            {/* Navbar */}
            <nav className="w-full flex justify-between items-center p-4 sm:p-6 sm:px24 absolute top-0">

                {/* logo */}
                <img src={assets.logo} alt="logo" className='w-28 sm:w-32' />

                {
                    userData ?
                        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative cursor-pointer group'>

                            {userData.name[0].toUpperCase()}

                            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
                                <ul className='list-none m-0 p-2 bg-gray-100 text-sm w-32'>

                                    {
                                        !userData.isAccountVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify email</li>
                                    }

                                    <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Logout</li>
                                </ul>
                            </div>

                        </div>

                        :

                        <button
                            onClick={() => navigate("/login")}
                            className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'> Signup  <img src={assets.arrow_icon} alt="" />
                        </button>
                }

            </nav >
        </>
    )
}

export default NavBar