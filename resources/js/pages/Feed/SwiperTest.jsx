import { Head } from '@inertiajs/react';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function SwiperTest() {
  const slides = [
    { id: 1, title: 'Slide 1', color: 'bg-red-500' },
    { id: 2, title: 'Slide 2', color: 'bg-blue-500' },
    { id: 3, title: 'Slide 3', color: 'bg-green-500' },
  ];

  return (
    <>
      <Head title="Swiper Test" />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Swiper Test</h1>
        <div className="h-64">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            className="w-full h-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className={`w-full h-full ${slide.color} flex items-center justify-center text-white text-2xl font-bold rounded-xl`}>
                  {slide.title}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default SwiperTest;
