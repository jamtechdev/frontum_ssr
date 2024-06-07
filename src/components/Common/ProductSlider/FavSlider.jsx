import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from 'swiper/modules';
import Image from "next/image";
import Link from "next/link";

export default function FavSlider({ favSlider }) {
  const product = [
    {
      image: "/images/p1.png",
      productName: "Best Monitors",
    },
    {
      image: "/images/p2.png",
      productName: "Best Washing Machines",
    },
    {
      image: "/images/p3.png",
      productName: "Best Robot Vacuum Cleaners",
    },
    {
      image: "/images/p4.png",
      productName: "Best Drones",
    },
    {
      image: "/images/p5.png",
      productName: "Best Kitchen Robots",
    },
    {
      image: "/images/p6.png",
      productName: "Best Electric Scooters",
    },
    {
      image: "/images/p1.png",
      productName: "Best Monitors",
    },
    {
      image: "/images/p2.png",
      productName: "Best Washing Machines",
    },
    {
      image: "/images/p3.png",
      productName: "Best Robot Vacuum Cleaners",
    },
  ];
  return (
    <>
      <section className="product-slider">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          loop={true}
          navigation={{
            nextEl: ".product-slider .swiper-next",
            prevEl: ".product-slider .swiper-prev",
          }}
          pagination={true}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
          }}
          className="product-slider"
        >
          {" "}
          {favSlider?.length > 0 &&
            favSlider?.map((section, index) => {
              return (
                <>
                  <SwiperSlide key={index}>
                    <div className="product-card">
                      <img
                        src={section.bannerImage}
                        width={0}
                        height={0}
                        sizes="100%"
                        alt=""
                      />
                      <span>
                        <Link
                          href={`/${section.permalink}`}
                          style={{ color: "#27304e" }}
                        >
                          {" "}
                          {section.title}{" "}
                        </Link>
                      </span>
                    </div>
                  </SwiperSlide>
                </>
              );
            })}
        </Swiper>
        <span className="swiper-prev">
          <i className="ri-arrow-left-s-line"></i>
        </span>
        <span className="swiper-next">
          <i className="ri-arrow-right-s-line"></i>
        </span>
      </section>
    </>
  );
}
