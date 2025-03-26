import React from 'react'

import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {

    const navigate = useNavigate();

    return (
        <>
            {/* Navbar */}
            <nav className="w-full flex justify-between items-center p-4 sm:p-6 sm:px24 absolute top-0">

                {/* logo */}
                <img src={assets.logo} alt="logo" className='w-28 sm:w-32' />

                {/* Login button */}
                <button
                    onClick={()=> navigate("/login")}
                    className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'> Login <img src={assets.arrow_icon} alt="" />
                </button>

            </nav>
        </>
    )
}

export default NavBar