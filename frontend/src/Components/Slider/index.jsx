import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import FetchApi from '../../Utils/FetchApi';
import { Navigation, Pagination, Scrollbar, A11y,Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './style.css';
import { Box } from '@mui/material';
export default function Slider() {
  const [img, setImg] = useState()
  useEffect(() => {
    const fetchApi =FetchApi(`${process.env.REACT_APP_BASE_URL}/api/sliders?populate=*`)
    .then((data) => setImg(data?.data))
  }, [])
  const items = img?.map((e, index) => (
    <SwiperSlide key={index}>
      <img style={{height:'100%',borderRadius:'20px'}} src={process.env.REACT_APP_BASE_URL + e?.attributes?.images?.data[0]?.attributes?.url} alt="slider" />
    </SwiperSlide>
  ));

  return (
    <>
<Swiper
  style={{borderRadius:'20px'}}
  spaceBetween={30}
  modules={[Autoplay, Pagination, Navigation]}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
  }}
  pagination={{
    clickable: true,
  }}
  className="mySwiper"
>
  {items}
</Swiper>

    </>
  )
}
