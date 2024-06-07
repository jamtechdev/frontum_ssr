import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from 'swiper/modules';
import Image from "next/image";
import { Button } from "react-bootstrap";
import { useState } from "react";
import Link from "next/link";
export default function ProductSlider({ favSlider }) {
  const [showFullData, setShowFullData] = useState(false);

  const toggleShowFullData = () => {
    setShowFullData(!showFullData);
  };

  return (
    <section className="product-slider single-blog">
      {favSlider &&
        favSlider
          ?.slice(0, showFullData ? favSlider?.length : 3)
          .map(function (item, index) {
            return (
              // <SwiperSlide key={index}>
              <div className="product-card mb-3" key={index}>
               
                <Image
                  src={
                    item.bannerImage === null
                      ? item?.bannerImage
                      : `/images/nofound.png`
                  }
                  width={0}
                  height={0}
                  sizes="100%"
                  alt=""
                />
                <span>
                  {" "}
                  <Link
                    href={`/${item?.permalink}`}
                    style={{ color: "#27304e" }}
                  >
                    {item?.short_name}
                  </Link>
                </span>
              </div>
              // </SwiperSlide>
            );
          })}
    </section>
  );
}
