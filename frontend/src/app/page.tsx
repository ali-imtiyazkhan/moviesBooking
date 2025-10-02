import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Movies from '@/components/Movies'
import React from 'react'

const Home = () => {
  return (
    <div className='bg-white'>
      <div className='text-zinc-200'>
        <Header />
        <div>
          <Hero />
        </div>
        <Movies />

        <div> <Footer /></div>

      </div>
    </div>)
}

export default Home