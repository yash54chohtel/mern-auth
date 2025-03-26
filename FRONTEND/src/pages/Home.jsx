import React from 'react'
import NavBar from '../Components/NavBar'
import Header from '../Components/Header'

const Home = () => {
    
    return (
        <>

            <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>

                {/* NavbarComponent */}
                <NavBar />

                {/* HeaderComponent */}
                <Header />

            </div>

        </>
    )
}

export default Home