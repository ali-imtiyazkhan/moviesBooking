import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Movies from '@/components/Movies'
import React from 'react'

const Home = () => {
  return (
    <div>
      <Header />
      <div>
        <Hero />
      </div>
      <Movies />

      <Footer />
    </div>
  )
}

export default Home