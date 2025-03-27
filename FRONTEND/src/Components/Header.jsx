import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';

const Header = () => {

    // extracting data from appcontext that we have created
    const { userData } = useContext(AppContext);
    console.log(userData);
    
    return (
        <>

            <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>

                <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6' />

                <h1 className='flex items-center gap-2 text-xl font-medium'>
                    Hey  {userData ? userData.name.toUpperCase() : 'Developer'} !
                    <img src={assets.hand_wave} alt="" className='aspect-square' />
                </h1>

                <h2 className='text-3xl font-semibold mb-4'>Welcom to out app</h2>

                <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will haveyou up and running in no time!</p>

                <button className='mt-5 px-6 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition'>Get Statted</button>
            </div>

        </>
    )
}

export default Header