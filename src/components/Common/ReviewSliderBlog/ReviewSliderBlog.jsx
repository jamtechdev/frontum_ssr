import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from 'swiper/modules';
import Image from "next/image";
import { Button } from "react-bootstrap";
import { useState } from "react";

export default function ReviewSlider() {
  const [showFullData, setShowFullData] = useState(false);

  const toggleShowFullData = () => {
    setShowFullData(!showFullData);
  };
  const product = [
    {
      image: "/images/review-image.png",
      reviewName: "Klarstein 22X 58 Imagine",
      reviewContent: "Kitchen Robots",
      rating: "8.0",
    },
    {
      image: "/images/review-image2.png",
      reviewName: "DJI MINI 3 Pro",
      reviewContent: "Kitchen Robots",
      rating: "8.0",
    },
    {
      image: "/images/review-image3.png",
      reviewName: "Ninebot Segway 22",
      reviewContent: "Kitchen Robots",
      rating: "8.0",
    },
    {
      image: "/images/review-image.png",
      reviewName: "Klarstein 22X 58 Imagine",
      reviewContent: "Kitchen Robots",
      rating: "8.0",
    },
    {
      image: "/images/review-image2.png",
      reviewName: "DJI MINI 3 Pro",
      reviewContent: "Kitchen Robots",
      rating: "8.0",
    },
    {
      image: "/images/review-image3.png",
      reviewName: "Ninebot Segway 22",
      reviewContent: "Kitchen Robots",
      rating: "8.0",
    },
    {
      image: "/images/review-image.png",
      reviewName: "Klarstein 22X 58 Imagine",
      reviewContent: "Kitchen Robots",
      rating: "8.0",
    },
    {
      image: "/images/review-image2.png",
      reviewName: "DJI MINI 3 Pro",
      reviewContent: "Kitchen Robots",
      rating: "8.0",
    },
    {
      image: "/images/review-image3.png",
      reviewName: "Ninebot Segway 22",
      reviewContent: "Kitchen Robots",
      rating: "8.0",
    },
  ];
  return (
    <section className="review-slider">
      {/* <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        loop={true}
        navigation={{ nextEl: ".review-slider .swiper-next", prevEl: ".review-slider .swiper-prev" }}
        pagination={true}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        }}
        className="product-slider"
      > */}
      {product &&
        product
          ?.slice(0, showFullData ? product?.length : 2)
          .map(function (item, index) {
            return (
              // <SwiperSlide key={index}>
              <div className="review-wrapper mb-3" key={index}>
                <div className="review-card">
                  <Image
                    src={item.image}
                    width={60}
                    height={60}
                    sizes="100%"
                    alt=""
                  />
                  <div className="footer_content">
                  <div className="flex-container-section">
                          <span className="text-wrapper">{item?.reviewName}</span>
                        </div>
                    {/* <span className="text-wrapper">{item.reviewName}</span> */}
                    <p>{item.reviewContent}</p>
                  </div>
                  <span className="rating_count">{item.rating}</span>
                </div>
              </div>
              //  </SwiperSlide>
            );
          })}
      {/* </Swiper> */}
      {/* <span className="swiper-prev">
        <i className="ri-arrow-left-s-line"></i>
      </span>
      <span className="swiper-next">
        <i className="ri-arrow-right-s-line"></i>
      </span> */}
      {/* <div className="text-center">
      <Button className="hide-show-btn" onClick={toggleShowFullData}>
        <i
          className={
            showFullData ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
          }
        ></i>
      </Button>
      </div> */}
    </section>
  );
}
