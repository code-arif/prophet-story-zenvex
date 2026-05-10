import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export default function SliderBlock({ block }) {
  const p = block?.props || {};
  const slides = p.items || [];
  const heightClass = p.height || 'h-64';
  const roundedClass = p.rounded || 'rounded-xl';
  
  if (!slides.length) {
    return <div className={`${heightClass} ${roundedClass} bg-gray-200 flex items-center justify-center`}>No slides configured.</div>;
  }

  return (
    <div className={`relative overflow-hidden ${roundedClass} ${heightClass}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        loop={p.loop !== false}
        speed={300}
        autoplay={p.autoplay ? { delay: p.autoplayInterval || 4000, disableOnInteraction: false } : false}
        pagination={p.showDots ? { clickable: true } : false}
        navigation={p.showArrows ? { prevEl: '.slider-prev', nextEl: '.slider-next' } : false}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="px-2">
            <div 
              className={`h-full w-full rounded-xl overflow-hidden bg-cover bg-center flex items-end relative ${roundedClass}`}
              style={{ backgroundImage: slide.image ? `url(${slide.image})` : undefined }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              
              {/* Content */}
              <div className="relative z-10 p-6 text-white w-full">
                {slide.tag && (
                  <span className="inline-block px-3 py-1 mb-2 text-xs font-bold bg-red-600 rounded">
                    {slide.tag}
                  </span>
                )}
                <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">{slide.title}</h3>
                {slide.desc && (
                  <p className="text-sm text-white/80 line-clamp-2 mb-3 hidden md:block">{slide.desc}</p>
                )}
                {slide.href && slide.href !== '#' && (
                  <a 
                    href={slide.href}
                    className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    Read More →
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Navigation Arrows */}
        {p.showArrows && (
          <>
            <button 
              className="slider-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
              aria-label="Previous"
            >
              ‹
            </button>
            <button 
              className="slider-next absolute right-4 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </Swiper>
    </div>
  );
}
