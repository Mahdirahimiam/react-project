import { Swiper, SwiperSlide } from 'swiper/react';
import Card from '../Card';
import 'swiper/css';
import 'swiper/css/pagination';
import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { Box, Stack } from '@mui/material';

const MyImageGallery = ({ urls }) => {
  const images = urls;
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
        style={{ width: '100%', height: '100%', cursor: 'pointer', objectFit: 'cover' }}
        onClick={() => {
          setPhotoIndex(index);
          setIsOpen(true);
        }}
        alt={"Image " + index}
      />
    </SwiperSlide>
  ));

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
      <Stack style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '75vh', width: '100%', overflow: 'hidden' }}>
        <div style={{ height: '80%', overflow: 'hidden', borderRadius: "20px", width: '100%', marginBottom: '20px' }}>
          <img src={images[0]} onClick={() => {
            setIsOpen(true);
            setPhotoIndex(0);
          }} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
        </div>
        <Swiper
          style={{ padding: '5px', width: '100%', height: '17%' }}
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