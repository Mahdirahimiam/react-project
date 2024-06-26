import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
import ProductDetails from './Pages/ProductDetails'
import NotFound from "./Pages/NotFound";
import Formik from './Components/Formik/Formik'
import NewFormik from './Components/Formik/NewFormik'
import { Badge, Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import Slider from './Components/Slider'
import LoginRegister from './Pages/LoginRegister'
import Bag from './Pages/Bag'
import Shoe from './Pages/Shoe'
import Wear from './Pages/Wears'
import SpecialSale from './Pages/SpecialSale'
import AuthContext from './Utils/authContext'
import CartPage from './Pages/Cart'
export default function App() {
  const [token, setToken] = useState(null)
  const handleToken = (tr) => {
    setToken(tr)
  }
  return (
    <>
      <AuthContext.Provider value={{token, handleToken}}>
        <Grid bgcolor={'#fff'} container justifyContent={'center'} position={'relative'}>
          <Grid item xs={12} md={10}>
            <Navbar />
          </Grid>
        </Grid>
        <Grid container justifyContent={'center'} position={'relative'}>
          <Grid item xs={12} md={10}>
            <Routes>
              <Route path='' element={<Home />} />
              <Route path='/about-us' element={<About />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/why-wears' element={<WhyWears />} />
              <Route path='/solutions' element={<Solutions />} />
              <Route path='/our-clients' element={<Clients />} />
              <Route path='/integration' element={<Integration />} />
              <Route path='/login-register' element={<LoginRegister />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/bag' element={<Bag />} />
              <Route path='/shoe' element={<Shoe />} />
              <Route path='/wear' element={<Wear />} />
              <Route path='/special-sale' element={<SpecialSale />} />
              <Route path='/request-demo' element={<Demo />} />
              <Route path='/product-details/:slug' element={<ProductDetails />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
            <Stack className='telephone' direction={'row'} alignItems={'center'} justifyContent={'center'} position={'fixed'} right={'3%'} zIndex={100} bottom={'5%'}>
              <Stack alignItems={'center'} justifyContent={'center'} bgcolor={'#dc3545'} borderRadius={'50%'} padding={'5px'}>
                <box-icon name='phone' flip='horizontal' color='#fff' size='lg'></box-icon>
              </Stack>
              <Typography marginRight={'-5px'} fontSize={'1.2em'} color={'#ffffff'} padding={'2px 10px'} borderRadius={'20px 0 0 20px'} bgcolor={'#dc3545'}>
                تماس با ما
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Grid bgcolor={'#fff'} container justifyContent={'center'} position={'relative'}>
          <Grid item xs={12} md={10}>
            <Footer />
          </Grid>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} bgcolor={'#f0f0f1'} border={'1px #ddd solid'} color={'#686e74'} padding={'10px 0'} width={'100%'}>
            <Typography px={4}>
              استفاده از مطالب فروشگاه اینترنتی شیکو فقط با ذکر منبع بلامانع است. کليه حقوق اين سايت محفوظ می‌باشد
            </Typography>
            <Typography px={4}>
              فروشگاه ساخته شده توسط مهدی رحیمی
            </Typography>
          </Stack>
        </Grid>
      </AuthContext.Provider>
    </>

  )
}
