import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import WhyWears from './Pages/Why-Wears'
import Solutions from './Pages/Solutions'
import Clients from './Pages/Clients'
import Integration from './Pages/Integration'
import Contact from './Pages/Contact'
import Demo from './Pages/Demo'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Formik from './Components/Formik/Formik'
import NewFormik from './Components/Formik/NewFormik'
import { Grid, Stack } from '@mui/material'
import Slider from './Components/Slider'
export default function App() {
  return (
    <>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid item xs={12} md={10}>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about-us' element={<About />} />
            <Route path='/why-wears' element={<WhyWears />} />
            <Route path='/solutions' element={<Solutions />} />
            <Route path='/our-clients' element={<Clients />} />
            <Route path='/integration' element={<Integration />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/request-demo' element={<Demo />} />
          </Routes>
          <Footer />
        </Grid>
      </Grid>
    </>

  )
}
