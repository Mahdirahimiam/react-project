import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '../Card'
import 'swiper/css';
import 'swiper/css/pagination';
// import { Stack } from '@mui/material';
import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // اضافه کردن استایل‌های مربوطه
import { Box, Stack } from '@mui/material';
const MyImageGallery = () => {
  const images = [
    'https://cdnfa.com/shikomod/dfb3/files/normal/5523629.jpg',
    'https://lh3.googleusercontent.com/proxy/pajiuLIXVvbYvKQ3MNWTlUjLv-4ozTYiLlacCrEbA1sI7bvf8byo6y2RjdbMdBPKioA3cnDwsj0sJs630XZb1Teoo6LWO7e0GzybUhl93qMWuw5FAh-_7g',
    'https://lh3.googleusercontent.com/proxy/pajiuLIXVvbYvKQ3MNWTlUjLv-4ozTYiLlacCrEbA1sI7bvf8byo6y2RjdbMdBPKioA3cnDwsj0sJs630XZb1Teoo6LWO7e0GzybUhl93qMWuw5FAh-_7g',
    'https://lh3.googleusercontent.com/proxy/pajiuLIXVvbYvKQ3MNWTlUjLv-4ozTYiLlacCrEbA1sI7bvf8byo6y2RjdbMdBPKioA3cnDwsj0sJs630XZb1Teoo6LWO7e0GzybUhl93qMWuw5FAh-_7g',
    'https://rukminim2.flixcart.com/image/450/500/xif0q/shoe/7/z/r/8-white-leaf-8-urbanbox-white-black-original-imagvgf4cuzs2hrw.jpeg?q=90&crop=false',
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const items = images?.map((e, index) => (
    <SwiperSlide key={index} style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      width: '20%',
      borderRadius: '10px'
    }}>
      <img
        key={index}
        src={e}
        style={{ width: '100%', height: '100%', cursor: 'pointer' }}
        onClick={() => {
          setPhotoIndex(index);
          setIsOpen(true);
        }}
        alt={"Image " + index}
      />    </SwiperSlide>
  ))
  return (
    <Box>
      <Box>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + images.length - 1) % images.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % images.length)
            }
          />
        )}
      </Box>
      <Stack style={{ display: 'flex', direction: 'column', justifyContent: 'center', alignItems: 'center', height: '75vh', width: '350px', overflow: 'hidden' }}>
        <div style={{ height: '80%', overflow: 'hidden', borderRadius: "20px", width: '100%', marginBottom: '20px', }}>
          <img src={images[0]} onClick={() => {
            setIsOpen(true);
            setPhotoIndex(0);
          }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <Swiper
          style={{ padding: '5px', width: '100%', height: '20%' }}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 7,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 7,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 7,
            },
          }}
          className="mySwiper"
        >
          {items}
        </Swiper>
      </Stack>
    </Box>
  );
};

export default MyImageGallery;
