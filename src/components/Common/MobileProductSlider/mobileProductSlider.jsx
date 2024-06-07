"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { Navigation, Pagination } from 'swiper/modules';
import { useCallback, useState } from "react";

export default function MobileProductSlider() {
  const product = [
    {
      image: "/images/review.png",
    },
    {
      image: "/images/review.png",
    },
    {
      image: "/images/review.png",
    },
    {
      image: "/images/review.png",
    },
    {
      image: "/images/review.png",
    },
    {
      image: "/images/review.png",
    },
    {
      image: "/images/review.png",
    },
    {
      image: "/images/review.png",
    },
    {
      image: "/images/review.png",
    },
  ];
  const [swiperRef, setSwiperRef] = useState();

  const handlePrevious = useCallback(() => {
    swiperRef?.slidePrev();
  }, [swiperRef]);

  const handleNext = useCallback(() => {
    swiperRef?.slideNext();
  }, [swiperRef]);
  return (
    <section className="mobile-product-slider">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        // loop={true}
        pagination={true}
        onSwiper={setSwiperRef}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
        //   1024: {
        //     slidesPerView: 4,
        //     spaceBetween: 20,
        //   },
        //   1200: {
        //     slidesPerView: 6,
        //     spaceBetween: 20,
        //   },
        }}
        className="mobile-product-slider"
      >
        {product.map(function (item, index) {
          return (
            <SwiperSlide key={index}>
              <div className="review-mobile-card">
              <Image
                        src={item.image}
                        width={0}
                        height={0}
                        sizes="100%"
                        alt=""
                        style={{ width: "100%", height: "100%" }}
                      />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <span className="swiper-prev" onClick={handlePrevious}><i className="ri-arrow-left-s-line"></i></span>
      <span className="swiper-next" onClick={handleNext}><i className="ri-arrow-right-s-line"></i></span>
    </section>
  );
}