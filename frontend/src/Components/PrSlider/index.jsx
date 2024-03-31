import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '../Card'
import 'swiper/css';
import 'swiper/css/pagination';
import './style.css';
import { Pagination } from 'swiper/modules';
export default function prSlider({ products }) {
  const items = products?.map((e, index) => (
    <SwiperSlide key={index}>
      <Card discount={e?.attributes?.Discount} discountPrice={e?.attributes?.DiscountPrice} isOff={e?.attributes?.IsOff} is100={true} title={e?.attributes.Name} image={e?.attributes?.Imgs?.data[0]?.attributes?.url} price={e.attributes?.Price}/>

    </SwiperSlide>
  ))
  return (
    <>
      <Swiper
        style={{ padding: '10px' }}
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        className="mySwiper"
      >
        {items}
      </Swiper>
    </>
  );
}
